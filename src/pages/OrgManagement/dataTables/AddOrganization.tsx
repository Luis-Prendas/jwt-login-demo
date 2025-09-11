import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { BadgePlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useOrg } from "@/hooks/useOrg";
import { useNavigate } from "react-router";

export function AddOrganization() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { createOrg } = useOrg();

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const corporateName = form.corporateName.value
    const displayName = form.displayName.value
    const slogan = form.slogan.value

    const created = await createOrg({ corporateName, displayName, slogan })

    if (created) {
      setOpen(false);
      navigate(0);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="p-2">
        <Button variant="outline">
          <BadgePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0">
        <form onSubmit={handleSaveChanges} className="flex flex-col gap-4 p-4">
          <DialogHeader>
            <DialogTitle className="flex gap-4">
              Crear Organización
            </DialogTitle>
            <DialogDescription className="text-balance">
              Crea una nueva organización. Haz clic en guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="corporateName">Nombre corporativo *</Label>
              <Input id="corporateName" name="corporateName" type="text" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="displayName">Nombre a mostrar *</Label>
              <Input id="displayName" name="displayName" type="text" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="slogan">Slogan</Label>
              <Input id="slogan" name="slogan" type="text" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
