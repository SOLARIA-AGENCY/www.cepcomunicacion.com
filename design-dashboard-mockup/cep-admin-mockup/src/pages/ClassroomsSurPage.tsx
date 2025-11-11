import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DoorOpen, Users, Calendar } from "lucide-react"

// Mock data para aulas de CEP Sur
const classrooms = [
  {
    id: 1,
    name: "Aula E1",
    capacity: 30,
    floor: 1,
    equipment: ["Proyector", "Ordenadores", "Pizarra Digital"],
    currentCourse: "Desarrollo Web Full Stack",
    schedule: [
      { day: "Lunes", time: "09:00-13:00", course: "Desarrollo Web Full Stack" },
      { day: "Miércoles", time: "09:00-13:00", course: "Desarrollo Web Full Stack" },
      { day: "Viernes", time: "09:00-13:00", course: "Desarrollo Web Full Stack" },
    ],
  },
  {
    id: 2,
    name: "Aula E2",
    capacity: 20,
    floor: 1,
    equipment: ["Proyector", "Pizarra Digital", "Ordenadores"],
    currentCourse: "JavaScript Avanzado",
    schedule: [
      { day: "Martes", time: "16:00-20:00", course: "JavaScript Avanzado" },
      { day: "Jueves", time: "16:00-20:00", course: "React & Node.js" },
    ],
  },
  {
    id: 3,
    name: "Aula F1",
    capacity: 24,
    floor: 2,
    equipment: ["Proyector", "Ordenadores", "Servidores", "Equipamiento Red"],
    currentCourse: "Administración de Sistemas",
    schedule: [
      { day: "Lunes", time: "16:00-20:00", course: "Administración de Sistemas" },
      { day: "Miércoles", time: "16:00-20:00", course: "Ciberseguridad" },
      { day: "Viernes", time: "16:00-20:00", course: "Cloud Computing" },
    ],
  },
  {
    id: 4,
    name: "Aula F2",
    capacity: 26,
    floor: 2,
    equipment: ["Proyector", "Pizarra Digital", "Ordenadores"],
    currentCourse: "Análisis de Datos",
    schedule: [
      { day: "Martes", time: "09:00-13:00", course: "Análisis de Datos" },
      { day: "Jueves", time: "09:00-13:00", course: "Python para Data Science" },
    ],
  },
  {
    id: 5,
    name: "Aula G1",
    capacity: 15,
    floor: 3,
    equipment: ["Proyector", "Ordenadores Mac", "Estación de Audio"],
    currentCourse: null,
    schedule: [],
  },
]

export function ClassroomsSurPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aulas CEP Sur</h1>
        <p className="text-muted-foreground">
          Gestión visual de aulas y asignación de cursos - Sede Sur
        </p>
      </div>

      {/* Grid de Aulas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classrooms.map((classroom) => (
          <Card key={classroom.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5 text-primary" />
                  <CardTitle>{classroom.name}</CardTitle>
                </div>
                {classroom.currentCourse ? (
                  <Badge>Ocupada</Badge>
                ) : (
                  <Badge variant="secondary">Disponible</Badge>
                )}
              </div>
              <CardDescription>
                Planta {classroom.floor} • Capacidad: {classroom.capacity} personas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Equipamiento */}
              <div>
                <p className="text-sm font-medium mb-2">Equipamiento:</p>
                <div className="flex flex-wrap gap-1">
                  {classroom.equipment.map((item) => (
                    <Badge key={item} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Horario Semanal */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Horario Semanal:
                </p>
                {classroom.schedule.length > 0 ? (
                  <div className="space-y-2">
                    {classroom.schedule.map((slot, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
                      >
                        <div>
                          <p className="font-medium">{slot.day}</p>
                          <p className="text-xs text-muted-foreground">{slot.time}</p>
                        </div>
                        <Badge variant="default" className="text-xs">
                          {slot.course}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay cursos asignados
                  </p>
                )}
              </div>

              {/* Ocupación */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {classroom.schedule.length > 0
                      ? `${(
                          (classroom.schedule.length / 10) *
                          100
                        ).toFixed(0)}% ocupación`
                      : "0% ocupación"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leyenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leyenda</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex items-center gap-2">
            <Badge>Ocupada</Badge>
            <span className="text-sm text-muted-foreground">
              Aula con cursos asignados
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Disponible</Badge>
            <span className="text-sm text-muted-foreground">
              Aula sin asignaciones
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
