import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import type { UserBasicData, UserRole } from "@/types/UserManagement";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function DialogEditUser({ data, setOpen }: { data: UserBasicData | null, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [nickname, setNickname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | "developer" | "moderator" | null>(null);

  const handleSaveChanges = async () => {
    if (!data) return;

    const updatedData: UserBasicData = {
      ...data,
      nickname: nickname ? nickname : data.nickname,
      username: username ? username : data.username,
      role: role ? (role as UserRole) : data.role,
    };

    const updated = await updateUser(updatedData, data.id);

    if (updated) {
      setOpen(false);
      navigate(0);
    }
  };

  return (
    <DialogContent className="sm:max-w-[450px] p-0">
      {data ? (
        <Tabs defaultValue="account">
          <TabsList className="p-0 bg-transparent mb-2 ml-3.5 mt-4">
            <TabsTrigger value="account">Cuenta</TabsTrigger>
            <TabsTrigger value="badges">Insignias</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="flex flex-col gap-4 px-4 pb-4">
            <DialogHeader>
              <DialogTitle className="flex gap-4">
                Editar perfil
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
          <TabsContent value="badges" className="flex flex-col gap-4 px-4 pb-4">
            <DialogHeader>
              <DialogTitle className="flex gap-4">
                Editar perfil
              </DialogTitle>
              <DialogDescription className="text-balance">
                Realiza cambios en tu perfil aquí. Haz clic en guardar cuando hayas terminado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
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
  );
}
