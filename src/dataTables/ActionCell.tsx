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
import type { UserBasicData, UserRole } from "@/types/UserManagement";
import type { Payment } from "./columns";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";

export function ActionCell({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UserBasicData | null>(null);
  const { getUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | "developer" | "moderator" | null>(null);

  const handleClick = async () => {
    const response = await getUser(payment.id);
    setData(response);
  };

  const handleSaveChanges = async () => {
    if (!data) return;

    const updatedData: UserBasicData = {
      ...data,
      nickname: nickname ? nickname : data.nickname,
      username: username ? username : data.username,
      role: role ? (role as UserRole) : data.role,
    };

    const updated = await updateUser(updatedData, payment.id);

    if (updated) {
      setOpen(false);
      navigate(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleClick}>
          <SquarePen />
        </Button>
      </DialogTrigger>
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


    </Dialog>
  );
}
