import { OrgDataTable } from "./dataTables/page";

export default function OrgManagement() {
  return (
    <div className="flex flex-col items-center justify-start gap-4 py-4 w-full h-full">
      <h1 className="text-5xl font-bold">Lista de Organizaciones</h1>
      <div>
        <OrgDataTable />
      </div>
    </div>
  )
}