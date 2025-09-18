import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { usePositions } from "@/hooks/usePositions";

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  deptId: string
  onSuccess?: () => void
}

export function DialogCreate({ isOpen, setIsOpen, deptId, onSuccess }: Props) {
  const { create, loading } = usePositions()

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const postFemaleName = form.postFemaleName.value
    const postMaleName = form.postMaleName.value
    const postDescription = form.postDescription.value

    await create(
      {
        femaleName: postFemaleName,
        maleName: postMaleName,
        description: postDescription,
        departmentId: deptId
      },
      { deptId }, // parámetros para la URL
      () => {
        console.log('✅ Departamento creado exitosamente')
        setIsOpen(false)
        form.reset()
        onSuccess?.()
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] p-0">
        <form onSubmit={handleSaveChanges} className="flex flex-col gap-4 p-4">
          <DialogHeader>
            <DialogTitle className="flex gap-4">
              Crear un Puesto
            </DialogTitle>
            <DialogDescription className="text-balance">
              Crea un nuevo puesto. Haz clic en guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="postMaleName">Nombre del puesto masculino *</Label>
              <Input
                id="postMaleName"
                name="postMaleName"
                type="text"
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
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}