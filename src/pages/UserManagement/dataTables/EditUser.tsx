import { useState } from "react";
import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { UserBasicData } from "@/types/UserManagement";
import type { Payment } from "./columns";
import DialogEditUser from "./DialogEditUser";

export function EditUser({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UserBasicData | null>(null);
  const { getUser } = useAuth();

  const handleClick = async () => {
    const response = await getUser(payment.id);
    setData(response);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleClick}>
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogEditUser data={data} setOpen={setOpen} />
    </Dialog>
  );
}
