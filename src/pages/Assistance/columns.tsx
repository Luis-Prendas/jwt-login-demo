import type { Assistance } from "@/types/UserManagement";
import { type ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Assistance>[] = [
  { accessorKey: "uuid", header: "ID" },
  { accessorKey: "userUuid", header: "User ID" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "clockIn", header: "Clock In" },
  { accessorKey: "clockOut", header: "Clock Out" },
]