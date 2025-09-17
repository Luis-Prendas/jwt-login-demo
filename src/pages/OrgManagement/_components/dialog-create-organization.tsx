import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useOrganizations } from "@/hooks/useOrganizations";

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess?: () => void
}

export function DialogCreateOrganization({ isOpen, setIsOpen, onSuccess }: Props) {
  const { create, loading } = useOrganizations()

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const corporateName = form.corporateName.value
    const displayName = form.displayName.value
    const slogan = form.slogan.value

    // Usar el método create unificado
    await create(
      {
        corporateName,
        displayName,
        slogan
      },
      undefined, // sin parámetros para la URL
      () => {
        // Callback de éxito
        console.log('✅ Departamento creado exitosamente')
        setIsOpen(false)
        form.reset() // Limpiar el formulario
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
              Crear un Departamento
            </DialogTitle>
            <DialogDescription className="text-balance">
              Crea un nuevo departamento. Haz clic en guardar cuando hayas terminado.
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