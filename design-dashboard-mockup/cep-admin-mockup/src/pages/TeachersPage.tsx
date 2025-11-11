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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash, Mail, Phone } from "lucide-react"
import { TeacherDialog } from "@/components/dialogs/TeacherDialog"
import { teachersExpanded } from "@/data/mockData"

export function TeachersPage() {
  const [showTeacherDialog, setShowTeacherDialog] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header con botón */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profesores</h1>
          <p className="text-muted-foreground">
            Gestión de profesorado del centro
          </p>
        </div>
        <Button onClick={() => setShowTeacherDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Profesor
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <Input placeholder="Buscar por nombre..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="marketing">Marketing Digital</SelectItem>
            <SelectItem value="diseno">Diseño Gráfico</SelectItem>
            <SelectItem value="desarrollo">Desarrollo Web</SelectItem>
            <SelectItem value="audiovisual">Audiovisual</SelectItem>
            <SelectItem value="gestion">Gestión Empresarial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de profesores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teachersExpanded.map((teacher) => (
          <Card key={teacher.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={teacher.photo} alt={teacher.first_name} />
                    <AvatarFallback>{teacher.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {teacher.first_name} {teacher.last_name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {teacher.department}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" title="Editar">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title="Eliminar">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {teacher.email}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {teacher.phone}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.specialties.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {teacher.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {teacher.bio}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Profesor */}
      <TeacherDialog
        open={showTeacherDialog}
        onOpenChange={setShowTeacherDialog}
      />
    </div>
  )
}
