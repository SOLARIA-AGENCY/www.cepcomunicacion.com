import { useState } from "react"
import {
  Card,
  CardContent,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Mail, Phone, Plus, Edit, BookOpen, Search, GraduationCap } from "lucide-react"
import { StudentDialog } from "@/components/dialogs/StudentDialog"
import { studentsData } from "@/data/mockData"

export function StudentsPage() {
  const [showStudentDialog, setShowStudentDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<typeof studentsData[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCampus, setFilterCampus] = useState('all')

  const handleAddStudent = () => {
    setDialogMode('create')
    setSelectedStudent(null)
    setShowStudentDialog(true)
  }

  const handleEditStudent = (student: typeof studentsData[0]) => {
    setDialogMode('edit')
    setSelectedStudent(student)
    setShowStudentDialog(true)
  }

  // Filtrado
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.dni.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus
    const matchesCampus = filterCampus === 'all' || student.campus_id === filterCampus
    return matchesSearch && matchesStatus && matchesCampus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumnos</h1>
          <p className="text-muted-foreground">
            Gestión de estudiantes matriculados en CEP Comunicación
          </p>
        </div>
        <Button onClick={handleAddStudent}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Alumno
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
                <SelectItem value="graduated">Graduados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCampus} onValueChange={setFilterCampus}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las sedes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las sedes</SelectItem>
                <SelectItem value="C001">CEP Norte</SelectItem>
                <SelectItem value="C002">CEP Santa Cruz</SelectItem>
                <SelectItem value="C003">CEP Sur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vista de Tabla */}
      {viewMode === 'table' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Cursos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.photo} />
                        <AvatarFallback>{student.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{student.dni}</TableCell>
                  <TableCell>
                    <p className="text-sm">{student.phone}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {student.campus_id === 'C001' ? 'CEP Norte' :
                       student.campus_id === 'C002' ? 'CEP Santa Cruz' :
                       student.campus_id === 'C003' ? 'CEP Sur' : student.campus_id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{student.enrolled_courses.length}</span>
                    <span className="text-xs text-muted-foreground ml-1">cursos</span>
                  </TableCell>
                  <TableCell>
                    {student.status === 'active' && (
                      <Badge variant="default" className="text-xs">Activo</Badge>
                    )}
                    {student.status === 'inactive' && (
                      <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                    )}
                    {student.status === 'graduated' && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                        Graduado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        /* Vista de Cards (expandida) */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={student.photo} />
                      <AvatarFallback>{student.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {student.first_name} {student.last_name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{student.dni}</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditStudent(student)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contacto */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{student.phone}</span>
                  </div>
                </div>

                {/* Sede */}
                <div>
                  <p className="text-xs font-medium mb-1">Sede:</p>
                  <Badge variant="outline">
                    {student.campus_id === 'C001' ? 'CEP Norte' :
                     student.campus_id === 'C002' ? 'CEP Santa Cruz' :
                     student.campus_id === 'C003' ? 'CEP Sur' : student.campus_id}
                  </Badge>
                </div>

                {/* Cursos Matriculados - EXPANDIDO CON FICHAS */}
                <div>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    Cursos matriculados ({student.enrolled_courses.length}):
                  </p>
                  <div className="space-y-2">
                    {student.enrolled_courses.map(course => (
                      <div key={course.id} className="border rounded-lg p-2 space-y-1">
                        <p className="text-xs font-medium">{course.name}</p>
                        <p className="text-[10px] text-muted-foreground">{course.code}</p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              course.status === 'active' ? 'default' :
                              course.status === 'completed' ? 'outline' :
                              'secondary'
                            }
                            className="text-[10px]"
                          >
                            {course.status === 'active' ? 'En curso' :
                             course.status === 'completed' ? 'Completado' :
                             'Abandonado'}
                          </Badge>
                          {course.grade !== undefined && (
                            <span className="text-xs font-medium">
                              Nota: {course.grade}/100
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas Académicas - OBLIGATORIO */}
                <div>
                  <p className="text-xs font-medium mb-1">Notas Académicas:</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {student.academic_notes}
                  </p>
                </div>

                {/* Estado */}
                <div className="flex items-center justify-between pt-2 border-t">
                  {student.status === 'active' && (
                    <Badge variant="default" className="text-xs">Activo</Badge>
                  )}
                  {student.status === 'inactive' && (
                    <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                  )}
                  {student.status === 'graduated' && (
                    <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Graduado
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Toggle View */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border p-1">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Tabla
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Tarjetas
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{studentsData.length}</p>
            <p className="text-xs text-muted-foreground">Alumnos totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {studentsData.filter(s => s.status === 'active').length}
            </p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {studentsData.filter(s => s.status === 'graduated').length}
            </p>
            <p className="text-xs text-muted-foreground">Graduados</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {studentsData.reduce((acc, s) => acc + s.enrolled_courses.length, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Matrículas totales</p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Alumno */}
      <StudentDialog
        open={showStudentDialog}
        onOpenChange={setShowStudentDialog}
        mode={dialogMode}
        student={selectedStudent || undefined}
      />
    </div>
  )
}
