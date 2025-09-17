import { Checkbox } from '@/components/ui/checkbox';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import type { Department } from '@/types';

export const createColumns = (onSuccess?: () => void): ColumnDef<Department>[] => [
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
    id: "Nombre del departamento",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre del departamento" />
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
    id: "ID Organizacional",
    accessorKey: "organizationId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Organizacional" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions 
        dept={row.original} 
        onSuccess={onSuccess}
      />
    ),
  },
]

export const columns: ColumnDef<Department>[] = createColumns()