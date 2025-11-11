import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DoorOpen, Users, Calendar, Plus, Edit, Trash } from "lucide-react"
import { ClassroomDialog } from "@/components/dialogs/ClassroomDialog"

// Mock data para aulas de CEP Santa Cruz
const classrooms = [
  {
    id: 1,
    name: "Aula C1",
    capacity: 28,
    floor: 1,
    equipment: ["Proyector", "Ordenadores", "Pizarra Digital", "Audio"],
    currentCourse: "Community Manager",
    schedule: [
      { day: "Lunes", time: "09:00-13:00", course: "Community Manager" },
      { day: "Martes", time: "16:00-20:00", course: "SEO y SEM" },
      { day: "Jueves", time: "09:00-13:00", course: "Community Manager" },
    ],
  },
  {
    id: 2,
    name: "Aula C2",
    capacity: 22,
    floor: 1,
    equipment: ["Proyector", "Pizarra Digital", "Ordenadores"],
    currentCourse: "Diseño UX/UI",
    schedule: [
      { day: "Miércoles", time: "09:00-13:00", course: "Diseño UX/UI" },
      { day: "Viernes", time: "16:00-20:00", course: "Prototipado Digital" },
    ],
  },
  {
    id: 3,
    name: "Aula D1",
    capacity: 25,
    floor: 2,
    equipment: ["Proyector", "Ordenadores Mac", "Tabletas Gráficas"],
    currentCourse: "Ilustración Digital",
    schedule: [
      { day: "Lunes", time: "16:00-20:00", course: "Ilustración Digital" },
      { day: "Miércoles", time: "16:00-20:00", course: "Adobe Creative Suite" },
      { day: "Viernes", time: "09:00-13:00", course: "Diseño Editorial" },
    ],
  },
]

export function ClassroomsSantaCruzPage() {
  const [showClassroomDialog, setShowClassroomDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aulas CEP Santa Cruz</h1>
          <p className="text-muted-foreground">
            Gestión visual de aulas y asignación de cursos - Sede Santa Cruz
          </p>
        </div>
        <Button onClick={() => setShowClassroomDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Aula
        </Button>
      </div>

      {/* Grid de Aulas */}
      <div className="grid gap-6 md:grid-cols-2">
        {classrooms.map((classroom) => (
          <Card key={classroom.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5 text-primary" />
                  <CardTitle>{classroom.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" title="Editar aula">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title="Eliminar aula">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                  {classroom.currentCourse ? (
                    <Badge>Ocupada</Badge>
                  ) : (
                    <Badge variant="secondary">Disponible</Badge>
                  )}
                </div>
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

      {/* Modal de Aula */}
      <ClassroomDialog
        open={showClassroomDialog}
        onOpenChange={setShowClassroomDialog}
        campus="santa-cruz"
      />
    </div>
  )
}
