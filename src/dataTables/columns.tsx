import { type ColumnDef } from "@tanstack/react-table"
import { ActionCell } from "./ActionCell";
import type { UserBasicData } from "@/types/UserManagement";

export type Payment = UserBasicData;

export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "email", header: "Email" },
  { accessorKey: "nickname", header: "Nickname" },
  { accessorKey: "username", header: "Nombre de usuario" },
  { accessorKey: "role", header: "Rol" },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell payment={row.original} />,
  },
]