import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { FaRegCopy } from "react-icons/fa";

export default function Room() {
  const { roomId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ id: string; user: string; message: string }[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!roomId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.emit("joinRoom", roomId, (msg: string) => {
      if (msg.startsWith("Joined")) {
        console.log(`✅ Entraste a la sala ${roomId}`);
      } else {
        console.warn(`⚠️ Sala no encontrada: ${roomId}`);
        navigate("/"); // redirige si no existe
      }
    });

    // Escuchar mensajes nuevos
    socket.on("chatMessage", (data: { id: string, user: string; message: string }) => {
      setMessages((prev) => [...prev, data]);
    });

    // Escuchar usuarios que entran para mostrar mensaje
    socket.on("userJoined", (data: { id: string; user: string }) => {
      console.log(data)
      setMessages((prev) => [...prev, { id: '000', user: "system", message: `Usuario ${data.user} se unió.` }]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, token, navigate]);

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

  const handleCopyToClipboard = () => {
    const SITE_URL = import.meta.env.VITE_SITE_URL;
    navigator.clipboard.writeText(`${SITE_URL}/room/${roomId}`).then(() => {
      console.log("Room ID copiado al portapapeles");
    });
  };

  return (
    <div className="flex justify-center items-center">
      <section className="p-4 border border-[#f0f0f0]/20 rounded-lg w-[500px] h-[600px] flex flex-col gap-4 justify-start items-start">
        <div className="flex gap-2">
          <h2 className="text-xl"> Room ID: <span className="font-bold">{roomId}</span></h2>
          <button onClick={handleCopyToClipboard} className="cursor-pointer hover:scale-110 main_btn">
            <FaRegCopy />
          </button>
        </div>
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
            <button type="submit" className="main_btn">Enviar</button>
          </form>
        </div>
      </section>
    </div>
  )
}