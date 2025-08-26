import { useAuth } from "@/hooks/useAuth"
import { columns, type Payment } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import { Dialog } from "@/components/ui/dialog"


export function UsersTabaTable() {
  const { getAllUsers } = useAuth()
  const [data, setData] = useState<Payment[] | []>([])

  useEffect(() => {
    const fetch = async () => {
      const response = await getAllUsers()
      setData(response ? response : [])
    }
    fetch()
  }, [])


  return (
    <div className="container mx-auto py-10">
      <Dialog>
        <DataTable columns={columns} data={data ? data : []} />
      </Dialog>
    </div>
  )
}