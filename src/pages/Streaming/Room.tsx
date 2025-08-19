import { useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

// Configuración optimizada para máxima calidad de pantalla
const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

// Configuraciones de calidad optimizadas para getDisplayMedia
const QUALITY_PRESETS = {
  // Para presentaciones y documentos - prioriza nitidez
  presentation: {
    video: {
      width: { ideal: 2560, max: 4096 },
      height: { ideal: 1440, max: 2160 },
      frameRate: { ideal: 30, max: 60 }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false
    }
  },
  // Para video y animaciones - prioriza fluidez
  motion: {
    video: {
      width: { ideal: 1920, max: 2560 },
      height: { ideal: 1080, max: 1440 },
      frameRate: { ideal: 60, max: 120 }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false
    }
  },
  // Configuración equilibrada
  balanced: {
    video: {
      width: { ideal: 1920, max: 2560 },
      height: { ideal: 1080, max: 1440 },
      frameRate: { ideal: 30, max: 60 }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false
    }
  }
};

export type Peer = {
  id: string;
  stream: MediaStream;
};

type QualityPreset = keyof typeof QUALITY_PRESETS;

export default function Room() {
  const { streamId } = useParams<{ streamId: string }>();
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuth();
  const pcsRef = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [localPreviewStream, setLocalPreviewStream] = useState<MediaStream | null>(null);
  const [qualityPreset, setQualityPreset] = useState<QualityPreset>('balanced');
  const [connectionStats, setConnectionStats] = useState<Record<string, any>>({});

  /**
   * Optimizar configuración de RTCPeerConnection para máxima calidad
   */
  const optimizePeerConnection = (pc: RTCPeerConnection) => {
    const sender = pc.getSenders().find(s => s.track?.kind === 'video');
    if (sender && sender.track) {
      const params = sender.getParameters();

      if (params.encodings && params.encodings.length > 0) {
        // Configurar para máxima calidad
        params.encodings[0].maxBitrate = 10000000; // 10 Mbps máximo
        params.encodings[0].maxFramerate = 60;
        params.encodings[0].priority = 'high';
        params.encodings[0].networkPriority = 'high';

        // Deshabilitar degradación automática
        params.degradationPreference = 'maintain-resolution';

        sender.setParameters(params).catch(console.error);
      }
    }
  };

  /**
   * Monitorear estadísticas de conexión
   */
  const startStatsMonitoring = (pc: RTCPeerConnection, peerId: string) => {
    const interval = setInterval(async () => {
      try {
        const stats = await pc.getStats();
        const outboundStats: any = {};

        stats.forEach((report) => {
          if (report.type === 'outbound-rtp' && report.kind === 'video') {
            outboundStats[peerId] = {
              bitrate: Math.round((report.bytesSent * 8) / 1000), // kbps
              fps: report.framesPerSecond || 0,
              resolution: `${report.frameWidth}x${report.frameHeight}`,
              packetsLost: report.packetsLost || 0
            };
          }
        });

        setConnectionStats(prev => ({ ...prev, ...outboundStats }));
      } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
      }
    }, 2000);

    // Limpiar el intervalo cuando la conexión se cierre
    pc.addEventListener('connectionstatechange', () => {
      if (pc.connectionState === 'closed' || pc.connectionState === 'failed') {
        clearInterval(interval);
      }
    });
  };

  /**
   * Crear RTCPeerConnection optimizada
   */
  const createPeerConnection = (peerId: string, socket: Socket, isInitiator = false) => {
    if (pcsRef.current[peerId]) {
      return pcsRef.current[peerId];
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    pcsRef.current[peerId] = pc;

    // Iniciar monitoreo de estadísticas
    startStatsMonitoring(pc, peerId);

    pc.ontrack = (event) => {
      console.log(`[WebRTC] Track recibido del peer ${peerId}`);
      setPeers(prev => {
        if (prev.some(p => p.id === peerId)) return prev;
        return [...prev, { id: peerId, stream: event.streams[0] }];
      });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc:ice-candidate', { to: peerId, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC] Estado de conexión con ${peerId}: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        // Optimizar después de conectar
        setTimeout(() => optimizePeerConnection(pc), 1000);
      }
    };

    pc.onnegotiationneeded = async () => {
      try {
        if (pc.signalingState !== 'stable') return;
        console.log(`[WebRTC] Negociación necesaria con ${peerId}, creando oferta...`);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc:offer', { to: peerId, sdp: pc.localDescription });
      } catch (err) {
        console.error(`[WebRTC] Error durante onnegotiationneeded con ${peerId}:`, err);
      }
    };

    // Añadir tracks del stream local si ya existe
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
      // Optimizar inmediatamente si hay stream
      setTimeout(() => optimizePeerConnection(pc), 500);
    }

    // Crear oferta proactiva si somos el iniciador
    if (isInitiator) {
      (async () => {
        try {
          console.log(`[WebRTC] Creando oferta proactiva para el nuevo peer: ${peerId}`);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('webrtc:offer', { to: peerId, sdp: pc.localDescription });
        } catch (err) {
          console.error(`[WebRTC] Error creando la oferta proactiva para ${peerId}:`, err);
        }
      })();
    }

    return pc;
  };

  /**
   * Iniciar compartición de pantalla con configuración optimizada
   */
  const startScreenShare = async () => {
    try {
      // Constraints simplificadas - getDisplayMedia es muy restrictivo
      const constraints: MediaStreamConstraints = {
        video: {
          width: QUALITY_PRESETS[qualityPreset].video.width,
          height: QUALITY_PRESETS[qualityPreset].video.height,
          frameRate: QUALITY_PRESETS[qualityPreset].video.frameRate
        },
        audio: true // Simplificado para máxima compatibilidad
      };

      console.log('Solicitando pantalla con configuración:', constraints);
      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

      setIsSharing(true);
      localStreamRef.current = stream;
      setLocalPreviewStream(stream);

      // Configurar pistas para máxima calidad
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        // Aplicar configuraciones avanzadas si están disponibles
        const capabilities = videoTrack.getCapabilities();
        const settings = videoTrack.getSettings();

        console.log('Capacidades del track de video:', capabilities);
        console.log('Configuración actual:', settings);

        // Aplicar contentHint según el preset seleccionado
        if (qualityPreset === 'presentation') {
          videoTrack.contentHint = 'text';
        } else if (qualityPreset === 'motion') {
          videoTrack.contentHint = 'motion';
        } else {
          videoTrack.contentHint = 'detail';
        }

        // Evento cuando el usuario detiene la compartición
        videoTrack.onended = () => {
          console.log('Track de video terminado');
          stopScreenShare();
        };
      }

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        console.log('Configuración de audio:', audioTrack.getSettings());
      }

      // Añadir tracks a conexiones existentes
      Object.values(pcsRef.current).forEach(pc => {
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });
        // Optimizar después de añadir tracks
        setTimeout(() => optimizePeerConnection(pc), 1000);
      });

    } catch (err) {
      console.error('Error al iniciar la compartición de pantalla:', err);
      setIsSharing(false);

      // Mostrar error específico al usuario
      let errorMessage = 'Error desconocido';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Permisos denegados para compartir pantalla';
        } else if (err.name === 'NotSupportedError') {
          errorMessage = 'Compartir pantalla no compatible con este navegador';
        } else if (err.name === 'AbortError') {
          errorMessage = 'Operación cancelada por el usuario';
        }
      }

      alert(`Error: ${errorMessage}`);
    }
  };

  /**
   * Detener compartición de pantalla
   */
  const stopScreenShare = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log(`Deteniendo track: ${track.kind}`);
        track.stop();
      });
    }

    localStreamRef.current = null;
    setLocalPreviewStream(null);
    setIsSharing(false);
    setConnectionStats({});

    // Notificar a los peers
    if (socketRef.current) {
      socketRef.current.emit('webrtc:screen-stop', { roomId: streamId });
    }

    // Remover tracks de las conexiones
    Object.values(pcsRef.current).forEach(pc => {
      pc.getSenders().forEach(sender => {
        if (sender.track) {
          pc.removeTrack(sender);
        }
      });
    });
  };

  // Socket management
  useEffect(() => {
    if (!streamId) return;

    console.log('[Socket.IO] Estableciendo conexión...');
    const socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`[Socket.IO] Conectado con ID: ${socket.id}`);
      socket.emit('webrtc:join', { roomId: streamId }, (res: any) => {
        if (res.ok) {
          console.log(`[Socket.IO] Unido a la sala ${streamId}. Peers existentes:`, res.data.peers);
          res.data.peers.forEach((peerId: string) => {
            createPeerConnection(peerId, socket, false);
          });
        }
      });
    });

    socket.on('webrtc:user-joined', ({ id: peerId }) => {
      console.log(`[Socket.IO] Nuevo usuario unido: ${peerId}. Iniciando conexión con él.`);
      createPeerConnection(peerId, socket, true);
    });

    socket.on('webrtc:offer', async ({ from, sdp }) => {
      console.log(`[WebRTC] Oferta recibida de ${from}`);
      const pc = createPeerConnection(from, socket);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc:answer', { to: from, sdp: pc.localDescription });
    });

    socket.on('webrtc:answer', async ({ from, sdp }) => {
      console.log(`[WebRTC] Respuesta recibida de ${from}`);
      const pc = pcsRef.current[from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    socket.on('webrtc:ice-candidate', async ({ from, candidate }) => {
      const pc = pcsRef.current[from];
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('webrtc:user-left', ({ id: peerId }) => {
      console.log(`[Socket.IO] Usuario ${peerId} se ha ido.`);
      if (pcsRef.current[peerId]) {
        pcsRef.current[peerId].close();
        delete pcsRef.current[peerId];
      }
      setPeers(prev => prev.filter(p => p.id !== peerId));
      setConnectionStats(prev => {
        const newStats = { ...prev };
        delete newStats[peerId];
        return newStats;
      });
    });

    return () => {
      console.log('[Socket.IO] Desconectando y limpiando...');
      socket.disconnect();
      Object.values(pcsRef.current).forEach(pc => pc.close());
      pcsRef.current = {};
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamId]);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Sala de Streaming HD</CardTitle>
          <div className="text-sm text-muted-foreground">
            ID de sala: <span className="font-mono">{streamId}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4 items-start">
            {/* Local Stream Preview */}
            <div className="md:col-span-3">
              <Label className="mb-2 block">Vista previa local</Label>
              <div className={cn('relative w-full aspect-video overflow-hidden rounded-2xl border bg-black', !isSharing && 'grid place-items-center')}>
                {!isSharing && (
                  <div className="text-sm text-muted-foreground px-4 text-center">
                    Selecciona la calidad y pulsa "Iniciar" para comenzar a compartir pantalla en alta definición.
                  </div>
                )}
                {localPreviewStream && (
                  <video
                    ref={(video) => { if (video) video.srcObject = localPreviewStream; }}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-contain"
                  />
                )}
                {isSharing && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    EN VIVO
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Configuración de Calidad</Label>
                <select
                  value={qualityPreset}
                  onChange={(e) => setQualityPreset(e.target.value as QualityPreset)}
                  disabled={isSharing}
                  className="w-full p-2 border rounded-lg bg-background"
                >
                  <option value="presentation">📄 Presentación (4K, texto nítido)</option>
                  <option value="motion">🎬 Video/Animación (fluido, 60fps)</option>
                  <option value="balanced">⚖️ Equilibrado (calidad/rendimiento)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Controles</Label>
                <div className="flex flex-col gap-2">
                  {!isSharing ? (
                    <Button onClick={startScreenShare} className="rounded-2xl">
                      🚀 Iniciar HD
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={stopScreenShare} className="rounded-2xl">
                      ⏹️ Detener
                    </Button>
                  )}
                </div>
              </div>

              {/* Estadísticas en tiempo real */}
              {Object.keys(connectionStats).length > 0 && (
                <div className="space-y-2">
                  <Label>Estadísticas</Label>
                  <div className="text-xs space-y-1 bg-muted p-2 rounded">
                    {Object.entries(connectionStats).map(([peerId, stats]) => (
                      <div key={peerId} className="space-y-1">
                        <div className="font-medium">Peer {peerId.slice(0, 5)}</div>
                        <div>📊 {stats.bitrate} kbps</div>
                        <div>🎯 {stats.fps} fps</div>
                        <div>📐 {stats.resolution}</div>
                        {stats.packetsLost > 0 && (
                          <div className="text-red-500">📦 Perdidos: {stats.packetsLost}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Remote Streams */}
          {peers.length > 0 && (
            <div className="space-y-2">
              <Label>Streams de otros usuarios ({peers.length})</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {peers.map(peer => (
                  <div key={peer.id} className="relative">
                    <video
                      ref={(video) => { if (video) video.srcObject = peer.stream; }}
                      autoPlay
                      playsInline
                      className="w-full aspect-video rounded-lg border bg-black"
                    />
                    <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                      ID: {peer.id.substring(0, 8)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between text-xs text-muted-foreground">
          <span>Streaming optimizado para máxima calidad con WebRTC</span>
          {isSharing && (
            <span className="text-green-600 font-medium">✅ Transmitiendo en alta calidad</span>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}