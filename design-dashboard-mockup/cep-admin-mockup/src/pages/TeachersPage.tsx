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
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GraduationCap, Mail, Phone, Plus, Edit, BookOpen, Award, Building2, Search } from "lucide-react"
import { TeacherDialog } from "@/components/dialogs/TeacherDialog"
import { CourseCardMini } from "@/components/ui/CourseCard"
import { teachersExpanded } from "@/data/mockData"

export function TeachersPage() {
  const [showTeacherDialog, setShowTeacherDialog] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<typeof teachersExpanded[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

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

  // Filtrado
  const filteredTeachers = teachersExpanded.filter(teacher => {
    const matchesSearch = teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = filterDepartment === 'all' || teacher.department === filterDepartment
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && teacher.active) ||
                         (filterStatus === 'inactive' && !teacher.active)
    return matchesSearch && matchesDept && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                <SelectItem value="Diseño Gráfico">Diseño Gráfico</SelectItem>
                <SelectItem value="Audiovisual">Audiovisual</SelectItem>
                <SelectItem value="Gestión Empresarial">Gestión Empresarial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Profesores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
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
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
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

              {/* Certificaciones */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  Certificaciones:
                </p>
                <div className="space-y-1">
                  {teacher.certifications.slice(0, 2).map((cert, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground">
                      <p className="font-medium">{cert.title}</p>
                      <p className="text-[10px]">{cert.institution} ({cert.year})</p>
                    </div>
                  ))}
                  {teacher.certifications.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{teacher.certifications.length - 2} más
                    </p>
                  )}
                </div>
              </div>

              {/* Sedes Asignadas */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  Sedes:
                </p>
                <div className="flex flex-wrap gap-1">
                  {teacher.campuses.map(campusId => (
                    <Badge key={campusId} variant="outline" className="text-xs">
                      {campusId === 'C001' ? 'CEP Norte' :
                       campusId === 'C002' ? 'CEP Santa Cruz' :
                       campusId === 'C003' ? 'CEP Sur' :
                       campusId === 'C004' ? 'CEP Online' : campusId}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Biografía - SIEMPRE VISIBLE */}
              <div>
                <p className="text-xs font-medium mb-1">Biografía:</p>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {teacher.bio}
                </p>
              </div>

              {/* Cursos Asignados - EXPANDIDO CON FICHAS CLICABLES */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  Cursos asignados ({teacher.courses.length}):
                </p>
                <div className="space-y-2">
                  {teacher.courses.map(course => (
                    <CourseCardMini key={course.id} course={course} />
                  ))}
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between pt-2 border-t">
                {teacher.active ? (
                  <Badge variant="default" className="text-xs">Activo</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {teacher.courses.reduce((acc, c) => acc + c.students, 0)} alumnos totales
                </span>
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
              {teachersExpanded.reduce((acc, t) => acc + t.courses.length, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Cursos asignados</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {Array.from(new Set(teachersExpanded.flatMap(t => t.campuses))).length}
            </p>
            <p className="text-xs text-muted-foreground">Sedes con profesores</p>
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
