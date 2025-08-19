import { type ColumnDef } from "@tanstack/react-table"
import { ActionCell } from "./ActionCell";

export type Payment = {
  uuid: string;
  email: string;
  username: string;
  password: string;
  nickname: string;
  role: 'user' | 'admin' | 'developer' | 'moderator';
}

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