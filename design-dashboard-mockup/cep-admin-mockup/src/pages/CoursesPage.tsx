import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  Star,
} from "lucide-react"
import { CourseDialog } from "@/components/dialogs/CourseDialog"
import { CourseCard } from "@/components/ui/CourseCard"
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
                <SelectItem value="privados">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600" />
                    Privados
                  </div>
                </SelectItem>
                <SelectItem value="teleformacion">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-600" />
                    Teleformación
                  </div>
                </SelectItem>
                <SelectItem value="ocupados">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600" />
                    Ocupados
                  </div>
                </SelectItem>
                <SelectItem value="desempleados">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    Desempleados
                  </div>
                </SelectItem>
                <SelectItem value="ciclo-medio">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    Ciclo Medio
                  </div>
                </SelectItem>
                <SelectItem value="ciclo-superior">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600" />
                    Ciclo Superior
                  </div>
                </SelectItem>
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
          <div key={course.id} className="relative">
            {course.featured && (
              <div className="absolute -top-2 -right-2 z-10">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 drop-shadow-md" />
              </div>
            )}
            <CourseCard
              course={course}
              onClick={() => handleEdit(course)}
            />
          </div>
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
