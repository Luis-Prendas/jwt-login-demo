// src/socket/webrtcClient.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4040";
let socket: Socket;

export function initWebRTCClient(token: string) {
  socket = io(SOCKET_URL, {
    auth: { token }, // JWT que ya usas en middleware
  });
  return socket;
}

export function getSocket(): Socket {
  if (!socket) {
    throw new Error("Socket.IO no inicializado. Llama a initWebRTCClient primero.");
  }
  return socket;
}
