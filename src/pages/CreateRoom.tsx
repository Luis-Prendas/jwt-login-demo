import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";

export default function CreateRoom() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<{ uuid: string; name: string; capacity: number, isFull: boolean }[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    // Escuchar cambios en tiempo real
    socket.on("roomsUpdated", (updatedRooms) => {
      setRooms(updatedRooms);
    });

    // Al conectar, pedir la lista inicial
    socket.emit("listRooms", (roomsList: { uuid: string; name: string; capacity: number, isFull: boolean }[]) => {
      setRooms(roomsList);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, rooms]);

  return (
    <div className="flex items-center flex-col py-4 justify-start gap-4 w-full h-full">
      <h1 className="text-5xl font-bold">Salas Activas</h1>
      {rooms.length > 0 && rooms.map((room) => (
        <div key={room.uuid} className="flex gap-4">
          {room.isFull ? (
            <span className="secondary_btn line-through opacity-30 cursor-not-allowed">{room.name}</span>
          ) : (
            <Link to={`/room/${room.uuid}`} className="main_btn">{room.name}</Link>
          )}
        </div>
      ))}
    </div>
  );
}
