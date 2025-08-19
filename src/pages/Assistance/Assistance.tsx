import { useAuth } from "@/hooks/useAuth"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import type { Assistance } from "@/types/UserManagement"


export function Assistance() {
  const { fetchUserAssistance } = useAuth()
  const [data, setData] = useState<Assistance[] | []>([])

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchUserAssistance()
      setData(response ? response : [])
    }
    fetch()
  }, [])

  console.log('Asistencia data:', data)

  return (
    <div className="container mx-auto py-10">
      <Dialog>
        <DataTable columns={columns} data={data ? data : []} />
      </Dialog>
    </div>
  )
}