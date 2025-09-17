import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// ✨ NUEVO: Hook unificado
import { useDepartments } from '@/hooks/useDepartments';
import type { Department } from '@/types';

type Props = {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  data: Department,
  onSuccess?: () => void
}

export function DialogEditOrganization({ isOpen, setIsOpen, data, onSuccess }: Props) {
  // ✨ NUEVO: Hook unificado
  const { update, loading } = useDepartments()

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const deptName = form.deptName.value
    const deptDescription = form.deptDescription.value

    // ✨ NUEVO: Usar el método update unificado
    await update(
      data.id,
      {
        name: deptName,
        description: deptDescription
      },
      undefined, // sin parámetros adicionales para la URL
      () => {
        // ✨ Callback de éxito
        console.log('✅ Departamento actualizado exitosamente')
        setIsOpen(false)
        onSuccess?.()
      }
    )
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
                <Input
                  id="deptName"
                  name="deptName"
                  type="text"
                  defaultValue={data.name}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="deptDescription">Descripción *</Label>
                <Input
                  id="deptDescription"
                  name="deptDescription"
                  type="text"
                  defaultValue={data.description ? data.description : "Null"}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando cambios...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogHeader>
            <DialogTitle className="flex gap-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Cargando...
            </DialogTitle>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
}