import { useOrg } from "@/hooks/useOrg";
import { useNavigate } from "react-router";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function DialogDeleteOrganization({ isOpen, setIsOpen, orgId }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, orgId: string }) {
  const navigate = useNavigate();
  const { deleteOrg } = useOrg();

  const handleDelete = async () => {

    const created = await deleteOrg(orgId)

    if (created) {
      navigate(0);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Eliminará permanentemente los datos de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} >Conninuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
