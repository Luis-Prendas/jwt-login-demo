import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
// ✨ NUEVO: Hook unificado
import { useDepartments } from "@/hooks/useDepartments";

export function DialogDeleteOrganization({
  isOpen,
  setIsOpen,
  id,
  onSuccess
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  id: string
  onSuccess?: () => void
}) {
  // ✨ NUEVO: Hook unificado
  const { remove, loading } = useDepartments();

  const handleDelete = async () => {
    // ✨ NUEVO: Usar el método remove unificado
    await remove(
      id,
      undefined, // sin parámetros adicionales
      () => {
        // ✨ Callback de éxito
        console.log('✅ Departamento eliminado exitosamente')
        setIsOpen(false)
        onSuccess?.()
      }
    )
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Eliminará permanentemente el departamento 
            <strong className="font-medium"> "{id}" </strong>
            de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Eliminando...
              </>
            ) : (
              'Continuar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}