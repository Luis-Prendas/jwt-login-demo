import { type ColumnDef } from "@tanstack/react-table"
import type { TBL_Organization } from "@/types/UserManagement";

export type Payment = TBL_Organization;

export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "corporateName", header: "Nombre corporativo" },
  { accessorKey: "displayName", header: "Nombre a mostrar" },
  { accessorKey: "organizationCode", header: "Código de organización" },
  {
    accessorKey: "slogan", header: "Slogan",
    cell: ({ row }) => (
      row.original.slogan ? row.original.slogan : 'Null'
    )
  },
  {
    accessorKey: "logoUrl", header: "Logo",
    cell: ({ row }) => (
      row.original.logoUrl ? row.original.logoUrl : "Null"
    )
  },
  {
    id: "actions",
  },
]