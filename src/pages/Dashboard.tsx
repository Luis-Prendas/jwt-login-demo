import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChartNoAxesColumn, Ellipsis, Heart, Image, List, MapPin, MessageCircle, Repeat2, Video } from "lucide-react";

export default function Dashboard() {
  const { userData } = useAuth();

  return (
    <main className="w-full h-full flex justify-center items-start">
      <section className="h-full w-[300px] line1"></section>
      <div className="flex items-start justify-start flex-col w-[600px] h-full line1">
        <section className="w-full flex flex-col justify-center items-center outline-1 outline-white/5 p-2 line1 gap-2">
          <div className="w-full flex items-start justify-center gap-4">
            <div className="flex justify-center items-center">
              <section className="flex justify-center items-center w-[50px] h-[50px] bg-sky-600 rounded-lg">
                <img src={`/letters/${userData?.nickname[0].toLowerCase()}-solid-full.svg`} alt={`Letter ${userData?.nickname[0].toUpperCase()}`} className="w-8" />
              </section>
            </div>
            <section className="w-full min-h-[50px] flex justify-center">
              <textarea className="w-full text-xl focus:outline-1 outline-white/20 rounded-lg pt-1 resize-none" name="PostText" id="PostText" rows={1.5} placeholder="¿Qué está pasando?"></textarea>
            </section>
          </div>

          <div className="w-full flex items-start gap-4">
            <ul className="w-full flex ml-[50px] text-sky-500">
              <li>
                <Button variant="ghost"><Image /></Button>
              </li>
              <li>
                <Button variant="ghost"><Video /></Button>
              </li>
              <li>
                <Button variant="ghost"><MapPin /></Button>
              </li>
              <li>
                <Button variant="ghost"><List /></Button>
              </li>
            </ul>
            <Button>Postear</Button>
          </div>
        </section>

        <section className="w-full flex flex-col justify-center items-start line1 p-2 gap-2">
          <div className="w-full flex justify-center items-start gap-2">
            <div className="flex justify-center items-center">
              <section className="flex justify-center items-center w-[50px] h-[50px] bg-sky-600 rounded-lg">
                <img src={`/letters/${userData?.nickname[0].toLowerCase()}-solid-full.svg`} alt={`Letter ${userData?.nickname[0].toUpperCase()}`} className="w-8" />
              </section>
            </div>

            <div className="w-full flex justify-between items-start mb-2">
              <div className="w-full">
                <div className="flex gap-2">
                  <span className="font-bold">{userData?.nickname}</span>
                  <span className="opacity-30">@{userData?.username}</span>
                </div>
                <div>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta tempora corrupti aperiam doloribus, fuga sed est consectetur alias nisi hic similique aliquid quidem porro nulla neque. Perferendis, dolorum! Sit, ab.</p>
                </div>
              </div>
              <Button variant="ghost">
                <Ellipsis />
              </Button>
            </div>
          </div>

          <div className="w-full">
            <ul className="w-full flex justify-around gap-4">
              <li><Button variant="ghost"><MessageCircle /></Button></li>
              <li><Button variant="ghost"><Repeat2 /></Button></li>
              <li><Button variant="ghost"><Heart /></Button></li>
              <li><Button variant="ghost"><ChartNoAxesColumn /></Button></li>
            </ul>
          </div>
        </section>

        <section className="w-full flex justify-center items-center line1 py-10">
          <p className="opacity-30 font-light">Contenido no encontrado...</p>
        </section>
      </div>
      <section className="h-full w-[300px] line1"></section>
    </main>

  );
}
