import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { DialogEditOrganization } from './dialogEditOrganization';
import { useOrg } from '@/hooks/useOrg';
import type { TBL_Organization } from '@/types/UserManagement';

export function DataTableRowActions({ id }: { id: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { getOrg } = useOrg()
  const [data, setData] = useState<TBL_Organization | null>(null)

  const handleClick = async () => {
    const response = await getOrg(id);
    setData(response);
    setIsEditOpen(true)
  };

  return (
    <>
      <DialogEditOrganization isOpen={isEditOpen} setIsOpen={setIsEditOpen} data={data!} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleClick}>Editar</DropdownMenuItem>
          <DropdownMenuItem>Crear</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Eliminr</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}