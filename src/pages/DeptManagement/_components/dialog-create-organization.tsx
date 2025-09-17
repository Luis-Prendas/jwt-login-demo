import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// ✨ NUEVO: Hooks unificados
import { useDepartments } from "@/hooks/useDepartments";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  orgId: string
  onSuccess?: () => void
}

export function DialogCreateOrganization({ isOpen, setIsOpen, orgId, onSuccess }: Props) {
  const { userData } = useAuth()
  // ✨ NUEVO: Hook unificado
  const { create, loading } = useDepartments()

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const deptName = form.deptName.value
    const deptDescription = form.deptDescription.value

    // ✨ NUEVO: Usar el método create unificado
    await create(
      {
        name: deptName,
        description: deptDescription,
        organizationId: userData?.organizationId!
      },
      { orgId }, // parámetros para la URL
      () => {
        // ✨ Callback de éxito
        console.log('✅ Departamento creado exitosamente')
        setIsOpen(false)
        form.reset() // ✨ Limpiar el formulario
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
              <Label htmlFor="deptName">Nombre del departamento *</Label>
              <Input
                id="deptName"
                name="deptName"
                type="text"
                placeholder="Ej: Recursos Humanos"
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
                placeholder="Ej: Gestión del talento humano"
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