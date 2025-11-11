import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WeeklyScheduleSlot } from "@/data/mockData"

interface WeeklyCalendarProps {
  schedule: WeeklyScheduleSlot[]
  className?: string
}

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
]

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
]

export function WeeklyCalendar({ schedule, className }: WeeklyCalendarProps) {
  const getSlotForDayAndTime = (day: string, time: string) => {
    return schedule.find(slot =>
      slot.day === day && slot.start_time <= time && slot.end_time > time
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Horario Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-muted text-sm font-medium">Hora</th>
                {DAYS.map(day => (
                  <th key={day.key} className="border p-2 bg-muted text-sm font-medium">
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map(time => (
                <tr key={time}>
                  <td className="border p-2 text-xs font-medium text-muted-foreground">
                    {time}
                  </td>
                  {DAYS.map(day => {
                    const slot = getSlotForDayAndTime(day.key, time)
                    return (
                      <td
                        key={`${day.key}-${time}`}
                        className="border p-1"
                        style={{
                          backgroundColor: slot ? `${slot.color}20` : 'transparent'
                        }}
                      >
                        {slot && slot.start_time === time && (
                          <div className="text-xs">
                            <div className="font-semibold truncate" style={{ color: slot.color }}>
                              {slot.course_name}
                            </div>
                            <div className="text-muted-foreground truncate">
                              {slot.teacher_name}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {slot.start_time} - {slot.end_time}
                            </div>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Leyenda */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from(new Set(schedule.map(s => s.course_id))).map(courseId => {
            const slot = schedule.find(s => s.course_id === courseId)!
            return (
              <Badge
                key={courseId}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: slot.color,
                  color: slot.color
                }}
              >
                {slot.course_name}
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
