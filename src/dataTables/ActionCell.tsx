// ActionCell.tsx
import { useState } from "react";
import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import type { UserDataWithBadges } from "@/types/UserManagement";
import type { Payment } from "./columns";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ActionCell({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UserDataWithBadges | null>(null);
  const { fetchUserInfoWithBadge, updateUser } = useAuth();

  const [nickname, setNickname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | "developer" | "moderator" | null>(null);

  const handleClick = async () => {
    const response = await fetchUserInfoWithBadge(payment.uuid);
    setData(response);
  };

  const handleSaveChanges = async () => {
    if (!data) return;

    const updatedData = {
      ...data,
      nickname: nickname ? nickname : data.nickname,
      username: username ? username : data.username,
      role: role ? role : data.role,
    };

    const updated = await updateUser(updatedData);

    console.log(updatedData, updated);

    if (updated) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleClick}>
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        {data ? (
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <DialogHeader>
                <DialogTitle className="flex gap-4">
                  Editar perfil
                  <ul className="flex gap-2">
                    {data && data.badges && data.badges.map((badge) => (
                      <li key={badge.uuid} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{badge.label}</li>
                    ))}
                  </ul>
                </DialogTitle>
                <DialogDescription className="text-balance">
                  Realiza cambios en tu perfil aquí. Haz clic en guardar cuando hayas terminado.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="userEmail">Email</Label>
                  <Input id="userEmail" name="userEmail" type="email" className="cursor-not-allowed" defaultValue={data?.email ?? ""} disabled />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="userNickname">Nickname</Label>
                  <Input id="userNickname" name="userNickname" defaultValue={data?.nickname ?? ""} onChange={(e) => setNickname(e.target.value)} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="userUsername">Nombre de usuario</Label>
                  <Input id="userUsername" name="userUsername" defaultValue={data?.username ?? ""} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="userRole">Rol</Label>
                  <Select name="userRole" defaultValue={data?.role ?? ""} onValueChange={(value) => setRole(value as "user" | "admin" | "developer" | "moderator")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="user">Usuario</SelectItem>
                        <SelectItem value="moderator">Moderador</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="developer">Desarrollador</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleSaveChanges}>Guardar cambios</Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        ) : (
          <DialogHeader>
            <DialogTitle className="flex gap-4">
              Cargando...
            </DialogTitle>
          </DialogHeader>
        )}
      </DialogContent>


    </Dialog>
  );
}
