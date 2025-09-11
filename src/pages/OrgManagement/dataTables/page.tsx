import { columns, type Payment } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { useOrg } from "@/hooks/useOrg"

export function OrgDataTable() {
  const { getAllOrg } = useOrg()
  const [data, setData] = useState<Payment[] | []>([])

  useEffect(() => {
    const fetch = async () => {
      const response = await getAllOrg()
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