import { columns, type Payment } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import { useOrg } from "@/hooks/useOrg"
import { AddOrganization } from "./AddOrganization"

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
    <div className="flex flex-col justify-center items-end">
      <DataTable columns={columns} data={data ? data : []} />
      <AddOrganization />
    </div>
  )
}