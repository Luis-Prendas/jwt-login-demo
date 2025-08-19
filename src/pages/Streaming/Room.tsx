import { useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

// Configuración de servidores STUN
const RTC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export type Peer = {
  id: string;
  stream: MediaStream;
};

export default function Room() {
  const { streamId } = useParams<{ streamId: string }>();
  const socketRef = useRef<Socket | null>(null);
  const pcsRef = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null); // Usamos ref para evitar re-renders innecesarios
  const [peers, setPeers] = useState<Peer[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [localPreviewStream, setLocalPreviewStream] = useState<MediaStream | null>(null);

if (!streamId) return null;

  /**
   * Crear o recuperar una RTCPeerConnection.
   * AHORA INCLUYE LA LÓGICA PROACTIVA PARA EL INICIADOR.
   */
  const createPeerConnection = (peerId: string, socket: Socket, isInitiator = false) => {
    if (pcsRef.current[peerId]) {
      return pcsRef.current[peerId];
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    pcsRef.current[peerId] = pc;

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

    pc.onnegotiationneeded = async () => {
      // Este evento sigue siendo vital para re-negociaciones (si se cambia el stream).
      try {
        if (pc.signalingState !== 'stable') return; // Evitar ofertas duplicadas
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
    }

    // *** LA SOLUCIÓN ***
    // Si somos el "iniciador" (el peer que ya estaba en la sala),
    // creamos la oferta proactivamente en lugar de esperar a onnegotiationneeded.
    // Esto resuelve la condición de carrera.
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
   * Iniciar compartición de pantalla.
   */
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 60 },
        audio: true,
      });

      setIsSharing(true);
      localStreamRef.current = stream;
      setLocalPreviewStream(stream);

      // Añadir tracks a cada peer connection existente.
      // Esto disparará 'onnegotiationneeded' para cada peer.
      Object.values(pcsRef.current).forEach(pc => {
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      });

      // Detectar cuando el usuario detiene la compartición desde el control del navegador
      const [videoTrack] = stream.getVideoTracks();
      if (videoTrack) videoTrack.onended = () => stopScreenShare();

    } catch (err) {
      console.error('Error al iniciar la compartición de pantalla:', err);
      // Aquí podrías mostrar una notificación (toast) al usuario.
      setIsSharing(false);
    }
  };

  /**
   * Detener compartición de pantalla.
   */
  const stopScreenShare = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    localStreamRef.current = null;
    setLocalPreviewStream(null);
    setIsSharing(false);

    // Notificar a los peers que el stream se ha detenido (opcional pero buena práctica)
    // El navegador ya dispara eventos 'removetrack', pero esto puede ser más explícito.
    if (socketRef.current) {
      socketRef.current.emit('webrtc:screen-stop', { roomId: streamId });
    }

    // Quitar los tracks de las conexiones existentes (esto también podría disparar renegociación)
    Object.values(pcsRef.current).forEach(pc => {
      pc.getSenders().forEach(sender => {
        pc.removeTrack(sender);
      });
    });
  };

  // *** MEJORA CLAVE #2: useEffect para la gestión del Socket ***
  // Este efecto se ejecuta solo una vez para establecer y limpiar la conexión del socket.
  useEffect(() => {
    // *** AÑADIDO: Logs para depuración ***
    console.log('[Socket.IO] Estableciendo conexión...');
    const socket = io(import.meta.env.VITE_SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`[Socket.IO] Conectado con ID: ${socket.id}`);
      socket.emit('webrtc:join', { roomId: streamId }, (res: any) => {
        if (res.ok) {
          console.log(`[Socket.IO] Unido a la sala ${streamId}. Peers existentes:`, res.data.peers);
          res.data.peers.forEach((peerId: string) => {
            // A los peers existentes, les pedimos que nos inicien una conexión
            createPeerConnection(peerId, socket, false); // isInitiator = false
          });
        }
      });
    });

    socket.on('webrtc:user-joined', ({ id: peerId }) => {
      console.log(`[Socket.IO] Nuevo usuario unido: ${peerId}. Iniciando conexión con él.`);
      // Somos el peer "antiguo", así que iniciamos la conexión con el nuevo
      createPeerConnection(peerId, socket, true); // isInitiator = true
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
    <div className="mx-auto max-w-5xl p-4 md:p-6 space-y-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Sala de Streaming</CardTitle>
          <div className="text-sm text-muted-foreground">
            ID de sala: <span className="font-mono">{streamId}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 items-start">
            {/* Local Stream Preview */}
            <div className="md:col-span-2">
              <Label className="mb-2 block">Vista previa local</Label>
              <div className={cn('relative w-full aspect-video overflow-hidden rounded-2xl border bg-black', !isSharing && 'grid place-items-center')}>
                {!isSharing && (
                  <div className="text-sm text-muted-foreground px-4 text-center">
                    No estás compartiendo pantalla. Pulsa el botón para comenzar.
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
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2">
              <Label>Controles</Label>
              <div className="flex flex-wrap gap-2">
                {!isSharing ? (
                  <Button onClick={startScreenShare} className="rounded-2xl">
                    Iniciar compartir pantalla
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={stopScreenShare} className="rounded-2xl">
                    Detener
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Remote Streams */}
          {peers.length > 0 && (
            <div className="space-y-2">
              <Label>Streams de otros usuarios ({peers.length})</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {peers.map(peer => (
                  <div key={peer.id} className="relative">
                    <video
                      ref={(video) => { if (video) video.srcObject = peer.stream; }}
                      autoPlay
                      playsInline
                      className="w-full aspect-video rounded-lg border bg-black"
                    />
                    <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                      ID: {peer.id.substring(0, 5)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end text-xs text-muted-foreground">
          Streaming en vivo con WebRTC y Socket.IO.
        </CardFooter>
      </Card>
    </div>
  );
}