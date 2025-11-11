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
import {
  Users,
  Clock,
  Euro,
  Plus,
  Edit,
  Search,
  Star,
  MapPin,
  GraduationCap,
  Calendar
} from "lucide-react"
import { CourseDialog } from "@/components/dialogs/CourseDialog"
import { coursesData } from "@/data/mockData"

export function CoursesPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [selected, setSelected] = useState<typeof coursesData[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterModality, setFilterModality] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const handleAdd = () => {
    setDialogMode('create')
    setSelected(null)
    setShowDialog(true)
  }

  const handleEdit = (course: typeof coursesData[0]) => {
    setDialogMode('edit')
    setSelected(course)
    setShowDialog(true)
  }

  // Filtrado
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || course.type === filterType
    const matchesModality = filterModality === 'all' || course.modality === filterModality
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus
    const matchesFeatured = !showFeaturedOnly || course.featured

    return matchesSearch && matchesType && matchesModality && matchesStatus && matchesFeatured
  })

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'telematico': 'Telemático',
      'ocupados': 'Ocupados',
      'desempleados': 'Desempleados',
      'privados': 'Privados',
      'ciclo-medio': 'Ciclo Medio',
      'ciclo-superior': 'Ciclo Superior'
    }
    return labels[type] || type
  }

  const getModalityLabel = (modality: string) => {
    const labels: Record<string, string> = {
      'presencial': 'Presencial',
      'semipresencial': 'Semipresencial',
      'telematico': 'Telemático'
    }
    return labels[modality] || modality
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground">
            Gestión del catálogo de cursos de CEP Comunicación
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Curso
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="privados">Privados</SelectItem>
                <SelectItem value="telematico">Telemático</SelectItem>
                <SelectItem value="ocupados">Ocupados</SelectItem>
                <SelectItem value="desempleados">Desempleados</SelectItem>
                <SelectItem value="ciclo-medio">Ciclo Medio</SelectItem>
                <SelectItem value="ciclo-superior">Ciclo Superior</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterModality} onValueChange={setFilterModality}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las modalidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las modalidades</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="semipresencial">Semipresencial</SelectItem>
                <SelectItem value="telematico">Telemático</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="archived">Archivados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            >
              <Star className="h-4 w-4 mr-2" />
              Solo Destacados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Cursos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {course.featured && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                    <CardTitle className="text-base leading-tight">
                      {course.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {course.code}
                  </CardDescription>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(course)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Badges de Tipo y Modalidad */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {getTypeLabel(course.type)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getModalityLabel(course.modality)}
                </Badge>
              </div>

              {/* Ciclo */}
              {course.cycle_name && (
                <div className="flex items-start gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">{course.cycle_name}</span>
                </div>
              )}

              {/* Descripción - OBLIGATORIA */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {course.description}
              </p>

              {/* Métricas Clave */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{course.duration_hours}h</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">
                    {course.price === 0 ? 'Gratis' : `${course.price}€`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">
                    {course.current_students}/{course.max_students}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{course.campuses.length} {course.campuses.length === 1 ? 'sede' : 'sedes'}</span>
                </div>
              </div>

              {/* Profesores */}
              <div>
                <p className="text-xs font-medium mb-2">Profesores:</p>
                <div className="flex -space-x-2">
                  {course.teachers.slice(0, 3).map((teacher) => (
                    <Avatar key={teacher.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={teacher.photo} />
                      <AvatarFallback className="text-xs">{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  ))}
                  {course.teachers.length > 3 && (
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                      <span className="text-xs">+{course.teachers.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fechas */}
              {course.start_date && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(course.start_date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
                    {course.end_date && ` - ${new Date(course.end_date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}`}
                  </span>
                </div>
              )}

              {/* Estado */}
              <div className="flex items-center justify-between pt-2 border-t">
                {course.status === 'published' && (
                  <Badge variant="default" className="text-xs">Publicado</Badge>
                )}
                {course.status === 'draft' && (
                  <Badge variant="secondary" className="text-xs">Borrador</Badge>
                )}
                {course.status === 'archived' && (
                  <Badge variant="outline" className="text-xs">Archivado</Badge>
                )}

                <span className="text-xs text-muted-foreground">
                  {Math.round((course.current_students / course.max_students) * 100)}% ocupado
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{coursesData.length}</p>
            <p className="text-xs text-muted-foreground">Cursos totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {coursesData.filter(c => c.status === 'published').length}
            </p>
            <p className="text-xs text-muted-foreground">Publicados</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {coursesData.reduce((acc, c) => acc + c.current_students, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Alumnos matriculados</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {coursesData.filter(c => c.featured).length}
            </p>
            <p className="text-xs text-muted-foreground">Destacados</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <CourseDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode={dialogMode}
        course={selected || undefined}
      />
    </div>
  )
}
