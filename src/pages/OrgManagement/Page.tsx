import { DataTable } from "./_components/data-table";

export default function OrganizationManagementPega() {
  return (
    <div className="flex flex-col items-center justify-start gap-4 py-4 w-full h-full">
      <h1 className="text-5xl font-bold">Lista de Organizaciones</h1>
      <div className="w-[1200px]">
        <DataTable />
      </div>
    </div>
  )
}