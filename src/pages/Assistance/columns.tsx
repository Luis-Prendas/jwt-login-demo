import type { AssistanceWithSchedule } from "@/hooks/useAuth";
import type { Schedule } from "@/types/UserManagement";
import { type ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<AssistanceWithSchedule>[] = [
  { accessorKey: "userUuid", header: "User ID" },
  { accessorKey: "date", header: "Fecha" },
  {
    accessorKey: "clockIn",
    header: "Hora de Entrada",
    cell: ({ row }) => {
      const schedule = row.original.schedule;
      const clockIn = new Date(row.original.clockIn);

      if (!schedule) {
        return clockIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }

      // Construir fecha con la hora de entrada programada
      const [h, m] = schedule.startTime.split(":").map(Number);
      const scheduleDate = new Date(clockIn);
      scheduleDate.setHours(h, m, 0, 0);

      // Crear rangos de tolerancia ±5 minutos
      const lowerBound = new Date(scheduleDate.getTime() - 5 * 60 * 1000);
      const upperBound = new Date(scheduleDate.getTime() + 5 * 60 * 1000);

      // Formatear hora de entrada
      const formattedClockIn = clockIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Comparar contra rangos
      if (clockIn < lowerBound) {
        return <span className="text-yellow-500">{formattedClockIn}</span>; // temprano
      } else if (clockIn > upperBound) {
        return <span className="text-red-500">{formattedClockIn}</span>; // tarde
      } else {
        return formattedClockIn; // dentro del rango permitido
      }
    }
  },
  {
    accessorKey: "clockOut",
    header: "Hora de Salida",
    cell: ({ row }) => {
      const schedule = row.original.schedule;
      const clockOut = new Date(row.original.clockOut!);

      if (!schedule) {
        return clockOut.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }

      // Construir fecha con la hora de salida programada
      const [h, m] = schedule.endTime.split(":").map(Number);
      const scheduleDate = new Date(clockOut);
      scheduleDate.setHours(h, m, 0, 0);

      // Crear rangos de tolerancia ±5 minutos
      const lowerBound = new Date(scheduleDate.getTime() - 5 * 60 * 1000);
      const upperBound = new Date(scheduleDate.getTime() + 5 * 60 * 1000);

      // Formatear hora de salida
      const formattedClockOut = clockOut.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Comparar contra rangos
      if (clockOut < lowerBound) {
        return <span className="text-red-500">{formattedClockOut}</span>; // temprano
      } else if (clockOut > upperBound) {
        return <span className="text-yellow-500">{formattedClockOut}</span>; // tarde
      } else {
        return formattedClockOut; // dentro del rango permitido
      }
    }
  },
]

export const columnsSchedule: ColumnDef<Schedule>[] = [
  {
    accessorKey: "dayOfWeek", header: "Día de la Semana",
    cell: ({ getValue }) => {
      const dayOfWeek = getValue() as number;
      const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      return days[dayOfWeek] || "Desconocido";
    },
  },
  {
    accessorKey: "startTime",
    header: "Hora de entrada",
    cell: ({ row }) => {
      const startTime = row.original.startTime; // "09:00"
      // Formatear a AM/PM sin usar Date directamente
      const [h, m] = startTime.split(":").map(Number);
      const date = new Date();
      date.setHours(h, m, 0, 0);

      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },
  },
  {
    accessorKey: "endTime",
    header: "Hora de salida",
    cell: ({ row }) => {
      const endTime = row.original.endTime; // "17:00"
      const [h, m] = endTime.split(":").map(Number);
      const date = new Date();
      date.setHours(h, m, 0, 0);

      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },
  },
]