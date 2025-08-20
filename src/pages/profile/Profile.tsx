import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { UserDataWithBadges } from "@/types/UserManagement";
import { Bookmark, EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Profile() {
  const [data, setData] = useState<UserDataWithBadges | null>(null);
  const { userId } = useParams<{ userId: string }>();
  const { fetchUserInfoWithBadge } = useAuth();
  const [date, setDate] = useState<Date | null>(null);
  const { userData } = useAuth();

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const userInfo = await fetchUserInfoWithBadge(userId);
      setData(userInfo);
      setDate(new Date());
    };

    fetchData();
  }, []);

  return (
    <main className="w-full h-full flex justify-center items-center flex-col p-4">
      <section className="flex justify-start items-center flex-col gap-4 relative w-3/4 h-3/4 bg-secondary rounded-lg border shadow-lg">
        <div className="absolute -top-24 w-[200px] h-[200px] ring-8 ring-background text-white rounded-lg bg-sky-600 flex justify-center items-center shadow-lg">
          <span className="text-9xl mb-2 font-bold">{data?.nickname[0].toUpperCase()}</span>
        </div>

        <div className="h-28 w-full flex justify-center items-start gap-[225px]">
          <div className="w-full h-full p-2 flex items-center justify-around">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold">{date?.getDate()}</span>
              <span className="text-lg opacity-60">Dia</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold">{date?.getMonth()}</span>
              <span className="text-lg opacity-60">Mes</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold">{date?.getFullYear()}</span>
              <span className="text-lg opacity-60">Año</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold">{date?.getHours()}:{date ? date.getMinutes().toString().padStart(2, '0') : ''}</span>
              <span className="text-lg opacity-60">Hora</span>
            </div>
          </div>
          <div className="w-full p-4 flex items-end justify-center flex-col gap-4">
            <div className="flex items-center gap-4">
              {userData?.username === data?.username ? (
                <>
                  <Button>Editar perfil</Button>
                </>
              ) : (
                <Button>Enviar mensaje</Button>
              )}
              <Button variant="outline" className="text-2xl">
                <Bookmark />
              </Button>
              <Button variant="outline">
                <EllipsisVertical />
              </Button>
            </div>
            <div>
              {userData?.username === data?.username && (
                <Button variant="outline">Marcar entrada</Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <ul className="flex gap-2">
            {data && data.badges && data.badges.map((badge) => (
              <li key={badge.uuid} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{badge.label}</li>
            ))}
          </ul>
          <span className="opacity-60 text-lg">{data?.email}</span>
          <span className="text-2xl font-semibold">{data?.nickname}</span>
        </div>
      </section>
    </main>
  )
}