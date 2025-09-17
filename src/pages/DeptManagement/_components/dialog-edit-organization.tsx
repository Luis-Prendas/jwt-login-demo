import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDept } from '@/hooks/useDept';
import type { Department } from '@/types';
import { useNavigate } from 'react-router';

export function DialogEditOrganization({ isOpen, setIsOpen, data }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, data: Department }) {
  const navigate = useNavigate();
  const { updateDept } = useDept()

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const deptName = form.deptName.value
    const deptDescription = form.deptDescription.value

    const updated = await updateDept({ dataUpdate: { name: deptName, description: deptDescription }, id: data.id })

    if (updated) {
      navigate(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] p-0">
        {data ? (
          <form onSubmit={handleSaveChanges} className="flex flex-col gap-4 p-4">
            <DialogHeader>
              <DialogTitle className="flex gap-4">
                Editar Departamento
              </DialogTitle>
              <DialogDescription className="text-balance">
                Realiza cambios en el departamento. Haz clic en guardar cuando hayas terminado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="deptName">Nombre del departamento *</Label>
                <Input id="deptName" name="deptName" type="text" defaultValue={data?.name ?? ""} required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="deptDescription">Descripción *</Label>
                <Input id="deptDescription" name="deptDescription" type="text" defaultValue={data?.description ?? ""} required />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </form>
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