import { useState } from "react";
import { SquarePen, Trash } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { TBL_Organization } from "@/types/UserManagement";
import type { Payment } from "./columns";
import DialogEditOrganization from "./DialogEditOrganization";
import { useOrg } from "@/hooks/useOrg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useNavigate } from "react-router";

export function EditOrganization({ payment }: { payment: Payment }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<TBL_Organization | null>(null);
  const { getOrg, deleteOrg } = useOrg();

  const handleClick = async () => {
    const response = await getOrg(payment.id);
    setData(response);
  };

  const handleDelete = async () => {
    const deleted = await deleteOrg(payment.id)
    if (deleted) {
      navigate(0);
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={handleClick}>
            <SquarePen />
          </Button>
        </DialogTrigger>
        <DialogEditOrganization data={data} setOpen={setOpen} />
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline"><Trash /></Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="p-4">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Eliminará permanentemente los datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Conninuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
