import { useAuth, type AssistanceWithSchedule } from "@/hooks/useAuth"
import { columns, columnsSchedule } from "./columns"
import { DataTable, DataTableSchedule } from "./data-table"
import { useEffect, useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import type { Assistance, Schedule } from "@/types/UserManagement"


export function Assistance() {
  const { fetchUserAssistance, fetchUserSchedule } = useAuth()
  const [data, setData] = useState<{ assistance: Assistance[], assistanceWithSchedule: AssistanceWithSchedule[] } | null>(null)
  const [scheduleData, setScheduleData] = useState<Schedule[] | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchUserAssistance()
      const scheduleResponse = await fetchUserSchedule()
      setScheduleData(scheduleResponse ? scheduleResponse : null)
      setData(response ? response : null)
    }
    fetch()
  }, [])

  return (
    <div className="container mx-auto h-full py-10 flex flex-col gap-4 justify-start items-center">
      <Dialog>
        <DataTableSchedule columns={columnsSchedule} data={scheduleData ? scheduleData : []} />
        <DataTable columns={columns} data={data ? data.assistanceWithSchedule : []} />
      </Dialog>
    </div>
  )
}