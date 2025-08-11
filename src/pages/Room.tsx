import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

export default function Room() {
  const { roomId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ id: string; user: string; message: string }[]>([]);
  const [inRoom, setInRoom] = useState(roomId !== undefined);
  const socketRef = useRef<any>(null);

  const socket = io("http://localhost:4000", {
    auth: { token }
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("createRoom", null, (id: string) => {
      navigate(`/room/${id}`);
    })
  };

  console.log('messages:', messages);
  console.log('socketRef:', socketRef.current);

  useEffect(() => {
    if (!roomId) return;

    setInRoom(true);

    const socket = io("http://localhost:4000", { auth: { token } });
    socketRef.current = socket;

    socket.emit("joinRoom", roomId, (msg: string) => {
      console.log(msg);
      if (msg.startsWith("Joined")) {
        console.log(`✅ Entraste a la sala ${roomId}`);
      } else {
        console.warn(`⚠️ Sala no encontrada: ${roomId}`);
        navigate("/"); // redirige si no existe
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión:", err.message);
      navigate("/");
    });

    // Escuchar mensajes nuevos
    socket.on("chatMessage", (data: {id: string, user: string; message: string }) => {
      setMessages((prev) => [...prev, data]);
    });

    // Opcional: escuchar usuarios que entran para mostrar mensaje
    socket.on("userJoined", (userId: string) => {
      setMessages((prev) => [...prev, { id: '000', user: "system", message: `Usuario ${userId} se unió.` }]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, token, navigate]);

  // Modificar handleSendMessage para usar socketRef
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const message = form.message.value.trim();
    if (!message) return;

    if (socketRef.current) {
      socketRef.current.emit("chatMessage", { roomId, message });
      form.reset();
    }
  };

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

      {inRoom && (
        <section className="p-4 border border-[#f0f0f0]/20 rounded-lg w-[500px] h-[600px] flex flex-col gap-4 justify-start items-start">
          <h2 className="text-xl font-bold">Room ID: {roomId}</h2>
          <div className="w-full h-full bg-white/10 rounded-lg p-4 flex flex-col justify-end gap-4">
            <ul className="w-full flex flex-col gap-2 overflow-y-auto">
              {messages.map((msg, i) => (
                <li
                  key={i}
                  className={msg.user === "system" ? "italic text-gray-400" : msg.id === (socketRef.current?.id) ? "p-2 rounded-lg my_text" : "p-2 rounded-lg your_text"}
                >
                  <b>{msg.user}:</b> {msg.message}
                </li>
              ))}
            </ul>

            <form className="flex gap-4" onSubmit={handleSendMessage}>
              <input
                type="text"
                name="message"
                className="border border-[#f0f0f0]/20 p-2 rounded-lg w-full"
                placeholder="Type your message..."
                autoComplete="off"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Enviar</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
