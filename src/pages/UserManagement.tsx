import { UsersTabaTable } from "@/dataTables/page";

export default function UserManagement() {
  return (
    <div className="flex flex-col items-center justify-start gap-4 py-4 w-full h-full">
      <h1 className="text-5xl font-bold">Lista de usuarios</h1>
      <div>
        <UsersTabaTable />
      </div>
    </div>
  )
}