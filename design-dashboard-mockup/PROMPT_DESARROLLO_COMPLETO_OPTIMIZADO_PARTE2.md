# PROMPT COMPLETO OPTIMIZADO - PARTE 2 - Dashboard CEP Comunicación

## 🎯 CONTINUACIÓN - Fases 7-14

**IMPORTANTE:** Este documento continúa donde termina PARTE 1. Asegúrate de que PARTE 1 esté completada antes de ejecutar esto.

**Ubicación del proyecto:**
```
/Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup/
```

---

## 📋 FASE 7: StudentsPage + StudentDialog (25 min)

### 7.1. Crear StudentsPage.tsx

**Archivo:** `src/pages/StudentsPage.tsx`

```typescript
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
import { CourseCardMini } from "@/components/ui/CourseCard"
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
```

### 7.2. Crear StudentDialog.tsx

**Archivo:** `src/components/dialogs/StudentDialog.tsx`

```typescript
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Student } from "@/data/mockData"

interface StudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  student?: Student
}

export function StudentDialog({ open, onOpenChange, mode = 'create', student }: StudentDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar el alumno' : 'Complete los campos para crear un nuevo alumno'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="personal" className="py-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Datos Personales</TabsTrigger>
            <TabsTrigger value="academic">Académico</TabsTrigger>
            <TabsTrigger value="emergency">Contacto Emergencia</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={student?.photo} />
                <AvatarFallback>{student?.initials || 'AL'}</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Foto
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG o WebP. Max 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">Nombre *</Label>
                <Input
                  id="first_name"
                  placeholder="ej: Ana"
                  defaultValue={student?.first_name}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last_name">Apellidos *</Label>
                <Input
                  id="last_name"
                  placeholder="ej: Martín López"
                  defaultValue={student?.last_name}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  placeholder="ej: 12345678A"
                  defaultValue={student?.dni}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date_of_birth">Fecha de Nacimiento *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  defaultValue={student?.date_of_birth}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ej: alumno@email.com"
                  defaultValue={student?.email}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  placeholder="ej: +34 612 345 678"
                  defaultValue={student?.phone}
                />
              </div>

              <div className="grid gap-2 col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  placeholder="ej: Calle Mayor 45"
                  defaultValue={student?.address}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="ej: Santa Cruz"
                  defaultValue={student?.city}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="postal_code">Código Postal</Label>
                <Input
                  id="postal_code"
                  placeholder="ej: 38001"
                  defaultValue={student?.postal_code}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="campus">Sede Asignada *</Label>
                <Select defaultValue={student?.campus_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione sede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C001">CEP Norte</SelectItem>
                    <SelectItem value="C002">CEP Santa Cruz</SelectItem>
                    <SelectItem value="C003">CEP Sur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Estado *</Label>
                <Select defaultValue={student?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                    <SelectItem value="graduated">Graduado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cursos Matriculados */}
              <div className="grid gap-2">
                <Label>Cursos Matriculados</Label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {student?.enrolled_courses.map(course => (
                    <div key={course.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="text-sm font-medium">{course.name}</p>
                        <p className="text-xs text-muted-foreground">{course.code}</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              {/* Notas Académicas - OBLIGATORIO */}
              <div className="grid gap-2">
                <Label htmlFor="academic_notes">Notas Académicas * (Obligatorio)</Label>
                <Textarea
                  id="academic_notes"
                  placeholder="Rendimiento académico, participación, logros, áreas de mejora..."
                  rows={5}
                  defaultValue={student?.academic_notes}
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 50 caracteres. Incluya rendimiento, participación y observaciones relevantes.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="emergency_contact">Nombre Contacto Emergencia</Label>
                <Input
                  id="emergency_contact"
                  placeholder="ej: María López García"
                  defaultValue={student?.emergency_contact}
                />
              </div>

              <div className="grid gap-2 col-span-2">
                <Label htmlFor="emergency_phone">Teléfono Emergencia</Label>
                <Input
                  id="emergency_phone"
                  placeholder="ej: +34 612 111 002"
                  defaultValue={student?.emergency_phone}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Alumno
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Alumno'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 📋 FASE 8: AdministrativePage + Dialog (15 min)

### 8.1. Crear AdministrativePage.tsx

**Archivo:** `src/pages/AdministrativePage.tsx`

```typescript
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
import { Users, Mail, Phone, Plus, Edit, Building2, Award, Search } from "lucide-react"
import { AdministrativeDialog } from "@/components/dialogs/AdministrativeDialog"
import { administrativeStaffData } from "@/data/mockData"

export function AdministrativePage() {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<typeof administrativeStaffData[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const handleAdd = () => {
    setDialogMode('create')
    setSelectedStaff(null)
    setShowDialog(true)
  }

  const handleEdit = (staff: typeof administrativeStaffData[0]) => {
    setDialogMode('edit')
    setSelectedStaff(staff)
    setShowDialog(true)
  }

  // Filtrado
  const filteredStaff = administrativeStaffData.filter(staff => {
    const matchesSearch = staff.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = filterDepartment === 'all' || staff.department === filterDepartment
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && staff.active) ||
                         (filterStatus === 'inactive' && !staff.active)
    return matchesSearch && matchesDept && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Administrativo</h1>
          <p className="text-muted-foreground">
            Gestión del equipo administrativo de CEP Comunicación
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Personal
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
                <SelectItem value="Administración">Administración</SelectItem>
                <SelectItem value="Secretaría Académica">Secretaría Académica</SelectItem>
                <SelectItem value="Recepción">Recepción</SelectItem>
                <SelectItem value="Informática">Informática</SelectItem>
                <SelectItem value="Contabilidad">Contabilidad</SelectItem>
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

      {/* Grid de Personal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={staff.photo} />
                    <AvatarFallback>{staff.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {staff.first_name} {staff.last_name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {staff.position}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEdit(staff)}
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
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{staff.phone}</span>
                  {staff.extension && (
                    <Badge variant="secondary" className="text-[10px]">
                      Ext. {staff.extension}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Departamento */}
              <div>
                <p className="text-xs font-medium mb-1">Departamento:</p>
                <Badge variant="outline">{staff.department}</Badge>
              </div>

              {/* Sedes Asignadas */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  Sedes asignadas:
                </p>
                <div className="flex flex-wrap gap-1">
                  {staff.campuses.map(campusId => (
                    <Badge key={campusId} variant="outline" className="text-xs">
                      {campusId === 'C001' ? 'CEP Norte' :
                       campusId === 'C002' ? 'CEP Santa Cruz' :
                       campusId === 'C003' ? 'CEP Sur' : campusId}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Responsabilidades */}
              <div>
                <p className="text-xs font-medium mb-2">Responsabilidades:</p>
                <ul className="space-y-1">
                  {staff.responsibilities.slice(0, 3).map((resp, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-primary">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                  {staff.responsibilities.length > 3 && (
                    <li className="text-xs text-muted-foreground">
                      +{staff.responsibilities.length - 3} más
                    </li>
                  )}
                </ul>
              </div>

              {/* Certificaciones */}
              {staff.certifications.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    Certificaciones:
                  </p>
                  <div className="space-y-1">
                    {staff.certifications.slice(0, 2).map((cert, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground">
                        <p className="font-medium">{cert.title}</p>
                        <p className="text-[10px]">{cert.institution} ({cert.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Biografía - OBLIGATORIA */}
              <div>
                <p className="text-xs font-medium mb-1">Biografía:</p>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {staff.bio}
                </p>
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between pt-2 border-t">
                {staff.active ? (
                  <Badge variant="default" className="text-xs">Activo</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                )}
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
            <p className="text-2xl font-bold">{administrativeStaffData.length}</p>
            <p className="text-xs text-muted-foreground">Personal total</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {administrativeStaffData.filter(s => s.active).length}
            </p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {Array.from(new Set(administrativeStaffData.flatMap(s => s.campuses))).length}
            </p>
            <p className="text-xs text-muted-foreground">Sedes cubiertas</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <AdministrativeDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode={dialogMode}
        staff={selectedStaff || undefined}
      />
    </div>
  )
}
```

### 8.2. Crear AdministrativeDialog.tsx

**Archivo:** `src/components/dialogs/AdministrativeDialog.tsx`

```typescript
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash, Upload, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { EditableList } from "@/components/ui/EditableList"
import type { AdministrativeStaff } from "@/data/mockData"

interface AdministrativeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  staff?: AdministrativeStaff
}

export function AdministrativeDialog({ open, onOpenChange, mode = 'create', staff }: AdministrativeDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Personal' : 'Agregar Personal Administrativo'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar' : 'Complete los campos para agregar personal'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="py-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
            <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={staff?.photo} />
                <AvatarFallback>{staff?.initials || 'AD'}</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Foto
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG o WebP. Max 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Nombre *</Label>
                <Input defaultValue={staff?.first_name} />
              </div>
              <div className="grid gap-2">
                <Label>Apellidos *</Label>
                <Input defaultValue={staff?.last_name} />
              </div>
              <div className="grid gap-2">
                <Label>Email *</Label>
                <Input type="email" defaultValue={staff?.email} />
              </div>
              <div className="grid gap-2">
                <Label>Teléfono *</Label>
                <Input defaultValue={staff?.phone} />
              </div>
              <div className="grid gap-2">
                <Label>Puesto *</Label>
                <Input defaultValue={staff?.position} />
              </div>
              <div className="grid gap-2">
                <Label>Departamento *</Label>
                <Select defaultValue={staff?.department}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administración">Administración</SelectItem>
                    <SelectItem value="Secretaría Académica">Secretaría Académica</SelectItem>
                    <SelectItem value="Recepción">Recepción</SelectItem>
                    <SelectItem value="Informática">Informática</SelectItem>
                    <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Extensión</Label>
                <Input defaultValue={staff?.extension} placeholder="ej: 101" />
              </div>
              <div className="grid gap-2">
                <Label>Estado *</Label>
                <Select defaultValue={staff?.active ? 'active' : 'inactive'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Responsabilidades - Lista dinámica */}
            <EditableList
              items={staff?.responsibilities || []}
              label="Responsabilidades *"
              placeholder="ej: Gestión de matrículas..."
            />

            {/* Biografía - OBLIGATORIA */}
            <div className="grid gap-2">
              <Label>Biografía * (Obligatoria)</Label>
              <Textarea
                placeholder="Experiencia, formación, logros..."
                rows={4}
                defaultValue={staff?.bio}
              />
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            {/* Similar a TeacherDialog */}
            <div className="flex items-center justify-between">
              <Label>Certificaciones</Label>
              <Button type="button" size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
            {staff?.certifications.map((cert, idx) => (
              <div key={idx} className="border rounded p-3 space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Certificación #{idx + 1}</p>
                  <Button type="button" size="icon" variant="ghost" className="h-6 w-6">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <Label>Título</Label>
                    <Input defaultValue={cert.title} />
                  </div>
                  <div>
                    <Label>Institución</Label>
                    <Input defaultValue={cert.institution} />
                  </div>
                  <div>
                    <Label>Año</Label>
                    <Input type="number" defaultValue={cert.year} />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            {/* Sedes */}
            <div className="space-y-3">
              <Label>Sedes Asignadas *</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="c-norte" defaultChecked={staff?.campuses.includes('C001')} />
                  <label htmlFor="c-norte" className="text-sm cursor-pointer">CEP Norte</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c-sc" defaultChecked={staff?.campuses.includes('C002')} />
                  <label htmlFor="c-sc" className="text-sm cursor-pointer">CEP Santa Cruz</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c-sur" defaultChecked={staff?.campuses.includes('C003')} />
                  <label htmlFor="c-sur" className="text-sm cursor-pointer">CEP Sur</label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button variant="destructive" onClick={() => onOpenChange(false)}>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Personal
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar' : 'Crear'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

**CONTINÚA en siguiente mensaje con Fases 9-14 (Sedes, Ciclos, Cursos, Campañas, Configuración, Perfil)**

**Este archivo es demasiado largo. Necesito crear PARTE 2A y PARTE 2B.**

¿Quieres que continúe con las 6 fases restantes ahora?
