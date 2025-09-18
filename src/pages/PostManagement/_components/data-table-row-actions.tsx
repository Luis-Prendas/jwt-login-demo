import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { DialogCreate } from './dialog-create';
import type { Position } from '@/types';
import { usePositions } from '@/hooks/usePositions';
import { DialogEdit } from './dialog-edit';
import { DialogDelete } from './dialog-delete';

export function DataTableRowActions({ post, onSuccess }: { post: Position, onSuccess?: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [data, setData] = useState<Position | null>(null)
  
  const { getOne, loading } = usePositions()

  const handleEditClick = async () => {
    // ✨ NUEVO: Usar getOne con callback
    await getOne(
      post.id,
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
        <DialogEdit
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          data={data}
          onSuccess={onSuccess}
        />
      )}

      <DialogCreate
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        deptId={post.departmentId}
        onSuccess={onSuccess}
      />

      <DialogDelete
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        id={post.id}
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