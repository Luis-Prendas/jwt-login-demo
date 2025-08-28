import { type ColumnDef } from "@tanstack/react-table"
import type { UserBasicData } from "@/types/UserManagement";
import { EditUser } from "./EditUser";

export type Payment = UserBasicData;

export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "email", header: "Email" },
  { accessorKey: "nickname", header: "Nickname" },
  { accessorKey: "username", header: "Nombre de usuario" },
  { accessorKey: "role", header: "Rol" },
  {
    id: "actions",
    cell: ({ row }) => <EditUser payment={row.original} />,
  },
]