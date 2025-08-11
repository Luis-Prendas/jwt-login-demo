import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

export default function Room() {
  const { token } = useAuth();
  const [roomId, setRoomId] = useState("");

  const socket = io("http://localhost:4000", {
    auth: { token }
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("createRoom", null, (id: string) => {
      setRoomId(id);
    });
  };

  useEffect(() => {
    if (roomId) {
      console.log(`Room created: ${roomId}`);
    }
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <form
        onSubmit={handleCreateRoom}
        className="flex flex-col items-center gap-2 p-4 border border-[#f0f0f0]/20 rounded-lg"
      >
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Room
        </button>
      </form>

      {roomId && <p>Room ID: {roomId}</p>}
    </div>
  );
}
