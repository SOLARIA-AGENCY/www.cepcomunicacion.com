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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Mail, Phone, Plus, Edit, BookOpen } from "lucide-react"
import { TeacherDialog } from "@/components/dialogs/TeacherDialog"
import { teachersExpanded } from "@/data/mockData"

export function TeachersPage() {
  const [showTeacherDialog, setShowTeacherDialog] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<typeof teachersExpanded[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  const handleAddTeacher = () => {
    setDialogMode('create')
    setSelectedTeacher(null)
    setShowTeacherDialog(true)
  }

  const handleEditTeacher = (teacher: typeof teachersExpanded[0]) => {
    setDialogMode('edit')
    setSelectedTeacher(teacher)
    setShowTeacherDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profesores</h1>
          <p className="text-muted-foreground">
            Gestión del equipo docente de CEP Comunicación
          </p>
        </div>
        <Button onClick={handleAddTeacher}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Profesor
        </Button>
      </div>

      {/* Grid de Profesores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teachersExpanded.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.photo} alt={`${teacher.first_name} ${teacher.last_name}`} />
                    <AvatarFallback>{teacher.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {teacher.first_name} {teacher.last_name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {teacher.department}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Editar profesor"
                  onClick={() => handleEditTeacher(teacher)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Información de contacto */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{teacher.phone}</span>
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Especialidades:
                </p>
                <div className="flex flex-wrap gap-1">
                  {teacher.specialties.slice(0, 3).map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {teacher.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{teacher.specialties.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Biografía */}
              {teacher.bio && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {teacher.bio}
                </p>
              )}

              {/* Estado y Cursos */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{teacher.courses_count} {teacher.courses_count === 1 ? 'curso' : 'cursos'}</span>
                </div>
                {teacher.active ? (
                  <Badge variant="default" className="text-xs">Activo</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{teachersExpanded.length}</p>
            <p className="text-xs text-muted-foreground">Profesores totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {teachersExpanded.filter(t => t.active).length}
            </p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {teachersExpanded.reduce((acc, t) => acc + t.courses_count, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Cursos asignados</p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Profesor */}
      <TeacherDialog
        open={showTeacherDialog}
        onOpenChange={setShowTeacherDialog}
        mode={dialogMode}
        teacher={selectedTeacher || undefined}
      />
    </div>
  )
}
