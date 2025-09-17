import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useDept } from "@/hooks/useDept";
import { useAuth } from "@/hooks/useAuth";

export function DialogCreateOrganization({ isOpen, setIsOpen, orgId }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, orgId: string }) {
  const navigate = useNavigate();
  const { userData } = useAuth()
  const { createDept } = useDept()

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const deptName = form.deptName.value
    const deptDescription = form.deptDescription.value

    const created = await createDept({ createData: { name: deptName, description: deptDescription, organizationId: userData?.organizationId! }, orgId })

    if (created) {
      navigate(0);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] p-0">
        <form onSubmit={handleSaveChanges} className="flex flex-col gap-4 p-4">
          <DialogHeader>
            <DialogTitle className="flex gap-4">
              Crear un Departamento
            </DialogTitle>
            <DialogDescription className="text-balance">
              Crea un nuevo departamento. Haz clic en guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="deptName">Nombre del departamento *</Label>
              <Input id="deptName" name="deptName" type="text" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="deptDescription">Descripción *</Label>
              <Input id="deptDescription" name="deptDescription" type="text" required />
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
