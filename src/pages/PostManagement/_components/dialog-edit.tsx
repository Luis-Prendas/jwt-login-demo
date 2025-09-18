import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePositions } from '@/hooks/usePositions';
import type { Position } from '@/types';

type Props = {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  data: Position,
  onSuccess?: () => void
}

export function DialogEdit({ isOpen, setIsOpen, data, onSuccess }: Props) {
  const { update, loading } = usePositions()

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const postFemaleName = form.postFemaleName.value
    const postMaleName = form.postMaleName.value
    const postDescription = form.postDescription.value

    await update(
      data.id,
      {
        femaleName: postFemaleName,
        maleName: postMaleName,
        description: postDescription,
      },
      undefined, // sin parámetros adicionales para la URL
      () => {
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
                Editar Puesto
              </DialogTitle>
              <DialogDescription className="text-balance">
                Realiza cambios en el puesto. Haz clic en guardar cuando hayas terminado.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="postMaleName">Nombre del puesto masculino *</Label>
                <Input
                  id="postMaleName"
                  name="postMaleName"
                  type="text"
                  defaultValue={data.maleName}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="postFemaleName">Nombre del puesto femenino *</Label>
                <Input
                  id="postFemaleName"
                  name="postFemaleName"
                  type="text"
                  defaultValue={data.femaleName}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="postDescription">Descripción *</Label>
                <Input
                  id="postDescription"
                  name="postDescription"
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