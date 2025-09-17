import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { DialogEditOrganization } from './dialog-edit-organization';
import { DialogCreateOrganization } from './dialog-create-organization';
import { DialogDeleteOrganization } from './dialog-delete-organization';
import type { Department } from '@/types';
// ✨ NUEVO: Usar el hook unificado
import { useDepartments } from '@/hooks/useDepartments';

export function DataTableRowActions({ dept, onSuccess }: { dept: Department, onSuccess?: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [data, setData] = useState<Department | null>(null)
  
  // ✨ NUEVO: Hook unificado en lugar de useDept
  const { getOne, loading } = useDepartments()

  const handleEditClick = async () => {
    // ✨ NUEVO: Usar getOne con callback
    await getOne(
      dept.id,
      undefined, // sin parámetros adicionales
      (departmentData) => {
        setData(departmentData)
        setIsEditOpen(true)
      }
    )
  };

  return (
    <>
      {data && (
        <DialogEditOrganization
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          data={data}
          onSuccess={onSuccess}
        />
      )}

      <DialogCreateOrganization
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        orgId={dept.organizationId}
        onSuccess={onSuccess}
      />

      <DialogDeleteOrganization
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        id={dept.id}
        onSuccess={onSuccess}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
            disabled={loading} // ✨ Deshabilitar durante cargas
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem 
            onClick={handleEditClick}
            disabled={loading} // ✨ Deshabilitar durante cargas
          >
            {loading ? 'Cargando...' : 'Editar'}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsCreateOpen(true)}
            disabled={loading}
          >
            Crear
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsDeleteOpen(true)} 
            className="text-destructive"
            disabled={loading}
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}