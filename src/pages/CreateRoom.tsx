import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";

export default function CreateRoom() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<string[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    // Escuchar actualizaciones en tiempo real
    socket.on("roomsUpdated", (roomsList: string[]) => {
      setRooms(roomsList);
    });

    // Al conectar, pedir la lista inicial
    socket.emit("listRooms", (roomsList: string[]) => {
      setRooms(roomsList);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const handleCreateRoom = () => {
    socketRef.current.emit("createRoom", null, (id: string) => {
      navigate(`/room/${id}`);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <section className="flex gap-4 p-4 border border-[#f0f0f0]/20 rounded-lg">
        <button type="button" className="main_btn" onClick={handleCreateRoom}>
          Create Room
        </button>
      </section>

      {rooms.length > 0 && (
        <section>
          <h3>Salas Activas</h3>
          <ul>
            {rooms.map((room) => (
              <li key={room}>
                <a href={`/room/${room}`}>{room}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
