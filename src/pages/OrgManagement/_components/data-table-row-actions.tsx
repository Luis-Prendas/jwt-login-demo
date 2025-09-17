import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { DialogEditOrganization } from './dialog-edit-organization';
import { useOrg } from '@/hooks/useOrg';
import { DialogCreateOrganization } from './dialog-create-organization';
import { DialogDeleteOrganization } from './dialog-delete-organization';
import type { Organization } from '@/types';

export function DataTableRowActions({ id }: { id: string }) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const { getOrg } = useOrg()
  const [data, setData] = useState<Organization | null>(null)

  const handleClick = async () => {
    const response = await getOrg(id);
    setData(response);
    setIsEditOpen(true)
  };

  return (
    <>
      {data && <DialogEditOrganization isOpen={isEditOpen} setIsOpen={setIsEditOpen} data={data} />}
      <DialogCreateOrganization isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
      <DialogDeleteOrganization isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} orgId={id} />

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
          <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>Crear</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} variant='destructive'>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}