import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "./data-table-column-header";
import type { Organization } from "@/types";

export type Payment = Organization;

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
    id: "Nombre corporativo",
    accessorKey: "corporateName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre corporativo" />,
  },
  {
    id: "Nombre a mostrar",
    accessorKey: "displayName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre a mostrar" />,
  },
  {
    id: "Slogan",
    accessorKey: "slogan",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slogan" />,
    cell: ({ row }) => row.original.slogan ? row.original.slogan : 'Null'
  },
  {
    id: "Código de organización",
    accessorKey: "organizationCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código de organización" />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions id={row.original.id} />,
  },
]