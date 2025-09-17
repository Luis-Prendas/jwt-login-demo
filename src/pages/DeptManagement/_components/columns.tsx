import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "./data-table-column-header";
import type { Department } from "@/types";

export type Payment = Department;

export const columns: ColumnDef<Payment>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre del departamento" />,
  },
  {
    id: "Descripcion",
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Descripcion" />,
  },
  {
    id: "ID Organizacional",
    accessorKey: "organizationId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID Organizacional" />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions id={row.original.id} />,
  },
]