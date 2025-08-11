import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState, useRef } from "react";

export default function CreateRoom() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<{ uuid: string; name: string; capacity: number, isFull: boolean }[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    // Escuchar actualizaciones en tiempo real
    socket.on("roomsUpdated", (roomsList: { uuid: string; name: string; capacity: number, isFull: boolean }[]) => {
      setRooms(roomsList);
    });

    // Al conectar, pedir la lista inicial
    socket.emit("listRooms", (roomsList: { uuid: string; name: string; capacity: number, isFull: boolean }[]) => {
      setRooms(roomsList);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return (
    <div className="flex flex-col items-center gap-4">
      {rooms.length > 0 && (
        <section className="flex flex-col justify-center items-center gap-4 p-4 border border-[#f0f0f0]/20 rounded-lg">
          <h3 className="text-xl font-bold">Salas Activas</h3>
          <ul className="flex flex-col gap-2">
            {rooms.map((room) => (
              <li key={room.uuid} className="border border-[#f0f0f0]/20 p-2 rounded-lg">
                {room.isFull ? (
                  <span className="line-through opacity-30 cursor-not-allowed">{room.name}</span>
                ) : (
                  <a href={`/room/${room.uuid}`} className="font-semibold">{room.name}</a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
