import {
  Card,
  CardContent,
  CardDescription,
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
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { courses } from "@/data/mockData"

export function CoursesPage() {
  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      telematico: "bg-blue-100 text-blue-800",
      ocupados: "bg-green-100 text-green-800",
      desempleados: "bg-orange-100 text-orange-800",
      privados: "bg-purple-100 text-purple-800",
      "ciclo-medio": "bg-cyan-100 text-cyan-800",
      "ciclo-superior": "bg-indigo-100 text-indigo-800",
    }
    return colors[type] || ""
  }

  const getModalityBadge = (modality: string) => {
    const colors: Record<string, string> = {
      presencial: "bg-emerald-100 text-emerald-800",
      semipresencial: "bg-amber-100 text-amber-800",
      telematico: "bg-sky-100 text-sky-800",
    }
    return colors[modality] || ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground">
            Gestión completa del catálogo de cursos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Curso
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Cursos</CardTitle>
              <CardDescription>
                {courses.length} cursos en el sistema
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar cursos..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Modalidad</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    {course.title}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeBadge(course.type)} variant="outline">
                      {course.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getModalityBadge(course.modality)} variant="outline">
                      {course.modality}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.duration}h</TableCell>
                  <TableCell>
                    {course.price === 0 ? "Gratuito" : `${course.price}€`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "publicado" ? "default" : "secondary"
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
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
