import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash } from "lucide-react"
import { students } from "@/data/mockData"

// Extender datos de estudiantes con información adicional
const studentsExtended = students.map((student, index) => ({
  ...student,
  initials: `${student.first_name[0]}${student.last_name[0]}`,
  photo: `https://i.pravatar.cc/150?img=${index + 20}`,
  course: ["Marketing Digital", "Desarrollo Web", "Diseño Gráfico", "Community Manager"][index % 4],
  campus: ["CEP Madrid Centro", "CEP Barcelona", "CEP Valencia"][index % 3],
  status: (index % 5 === 0 ? "inactive" : index % 7 === 0 ? "graduated" : "active") as "active" | "inactive" | "graduated"
}))

export function StudentsPage() {
  const [showStudentDialog, setShowStudentDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumnos</h1>
          <p className="text-muted-foreground">
            Gestión de estudiantes matriculados
          </p>
        </div>
        <Button onClick={() => setShowStudentDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Alumno
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 flex-wrap">
        <Input placeholder="Buscar por nombre o email..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sede" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="madrid">CEP Madrid Centro</SelectItem>
            <SelectItem value="barcelona">CEP Barcelona</SelectItem>
            <SelectItem value="valencia">CEP Valencia</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
            <SelectItem value="graduated">Graduado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de alumnos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alumnos ({studentsExtended.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsExtended.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.photo} alt={student.first_name} />
                      <AvatarFallback>{student.initials}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.course}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{student.campus}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "active"
                          ? "default"
                          : student.status === "graduated"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {student.status === "active"
                        ? "Activo"
                        : student.status === "graduated"
                        ? "Graduado"
                        : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" title="Eliminar">
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
