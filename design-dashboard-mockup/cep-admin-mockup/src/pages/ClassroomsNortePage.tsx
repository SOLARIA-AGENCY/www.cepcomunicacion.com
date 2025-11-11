import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DoorOpen, Plus, Edit, Users } from "lucide-react"
import { ClassroomDialog } from "@/components/dialogs/ClassroomDialog"
import { WeeklyCalendar } from "@/components/ui/WeeklyCalendar"
import { campusesData } from "@/data/mockData"

export function ClassroomsNortePage() {
  const [showClassroomDialog, setShowClassroomDialog] = useState(false)
  const [selectedClassroom, setSelectedClassroom] = useState<any>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  const campus = campusesData.find(c => c.code === 'NORTE')
  const classrooms = campus?.classrooms || []

  const handleAddClassroom = () => {
    setDialogMode('create')
    setSelectedClassroom(null)
    setShowClassroomDialog(true)
  }

  const handleEditClassroom = (classroom: any) => {
    setDialogMode('edit')
    setSelectedClassroom(classroom)
    setShowClassroomDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aulas CEP Norte</h1>
          <p className="text-muted-foreground">
            Gestión visual de aulas y asignación de cursos - Sede Norte
          </p>
        </div>
        <Button onClick={handleAddClassroom}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Aula
        </Button>
      </div>

      {/* Grid de Aulas */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {classrooms.map((classroom) => (
          <Card key={classroom.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5 text-primary" />
                  <CardTitle>{classroom.name}</CardTitle>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Editar aula"
                  onClick={() => handleEditClassroom(classroom)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Planta {classroom.floor} • Capacidad: {classroom.capacity} personas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Equipamiento - Lista dinámica */}
              <div>
                <p className="text-sm font-medium mb-2">Equipamiento:</p>
                <div className="flex flex-wrap gap-1">
                  {classroom.equipment.map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-secondary px-2 py-1 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Calendario Semanal Visual */}
              <WeeklyCalendar schedule={classroom.weekly_schedule} />

              {/* Estadísticas de Ocupación */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {classroom.weekly_schedule.length} franjas ocupadas
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {((classroom.weekly_schedule.length / (5 * 3)) * 100).toFixed(0)}% ocupación
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Aula */}
      <ClassroomDialog
        open={showClassroomDialog}
        onOpenChange={setShowClassroomDialog}
        mode={dialogMode}
        classroom={selectedClassroom}
        campus="norte"
      />
    </div>
  )
}
