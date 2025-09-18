import { Checkbox } from '@/components/ui/checkbox';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import type { Position } from '@/types';

export const createColumns = (onSuccess?: () => void): ColumnDef<Position>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Nombre del puesto masculino",
    accessorKey: "maleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre del puesto masculino" />
    ),
  },
  {
    id: "Nombre del puesto femenino",
    accessorKey: "femaleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre del puesto femenino" />
    ),
  },
  {
    id: "Descripción",
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
  },
  {
    id: "ID Departamental",
    accessorKey: "departmentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Departamental" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions 
        post={row.original} 
        onSuccess={onSuccess}
      />
    ),
  },
]

export const columns: ColumnDef<Position>[] = createColumns()