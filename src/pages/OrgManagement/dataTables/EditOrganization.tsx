import { useState } from "react";
import { SquarePen } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { TBL_Organization } from "@/types/UserManagement";
import type { Payment } from "./columns";
import DialogEditOrganization from "./DialogEditOrganization";
import { useOrg } from "@/hooks/useOrg";

export function EditOrganization({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<TBL_Organization | null>(null);
  const { getOrg } = useOrg();

  const handleClick = async () => {
    const response = await getOrg(payment.id);
    setData(response);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleClick}>
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogEditOrganization data={data} setOpen={setOpen} />
    </Dialog>
  );
}
