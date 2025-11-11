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
import type { TeacherExpanded } from "@/data/mockData"

interface TeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  teacher?: TeacherExpanded
}

export function TeacherDialog({ open, onOpenChange, mode = 'create', teacher }: TeacherDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar el profesor' : 'Complete los campos para agregar un nuevo profesor'}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs para organizar mucha información */}
        <Tabs defaultValue="general" className="py-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
            <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={teacher?.photo} />
                <AvatarFallback>{teacher?.initials || 'NP'}</AvatarFallback>
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
                  placeholder="ej: María"
                  defaultValue={teacher?.first_name}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Apellidos *</Label>
                <Input
                  id="last_name"
                  placeholder="ej: García Pérez"
                  defaultValue={teacher?.last_name}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ej: profesor@cepcomunicacion.com"
                  defaultValue={teacher?.email}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  placeholder="ej: +34 612 345 678"
                  defaultValue={teacher?.phone}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Departamento *</Label>
                <Select defaultValue={teacher?.department}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                    <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                    <SelectItem value="Diseño Gráfico">Diseño Gráfico</SelectItem>
                    <SelectItem value="Audiovisual">Audiovisual</SelectItem>
                    <SelectItem value="Gestión Empresarial">Gestión Empresarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Estado *</Label>
                <Select defaultValue={teacher?.active ? 'active' : 'inactive'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Especialidades - Lista dinámica (NO checkboxes fijos) */}
            <EditableList
              items={teacher?.specialties || []}
              label="Especialidades *"
              placeholder="ej: SEO, SEM, Analytics..."
            />

            {/* Biografía - OBLIGATORIA */}
            <div className="grid gap-2">
              <Label htmlFor="bio">Biografía * (Obligatoria)</Label>
              <Textarea
                id="bio"
                placeholder="Experiencia profesional, logros destacados, áreas de especialización..."
                rows={4}
                defaultValue={teacher?.bio}
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 100 caracteres. Incluya experiencia, logros y especialización.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Certificados y Títulos</Label>
                <Button type="button" size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Certificación
                </Button>
              </div>

              {/* Lista de certificaciones existentes */}
              {teacher?.certifications && teacher.certifications.length > 0 ? (
                teacher.certifications.map((cert, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">Certificación #{index + 1}</p>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2 col-span-2">
                        <Label>Título de la Certificación</Label>
                        <Input defaultValue={cert.title} placeholder="ej: Google Ads Certified" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Institución</Label>
                        <Input defaultValue={cert.institution} placeholder="ej: Google" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Año</Label>
                        <Input
                          type="number"
                          defaultValue={cert.year}
                          placeholder="ej: 2023"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                  <p className="text-sm">No hay certificaciones registradas</p>
                  <p className="text-xs mt-1">Haga clic en "Agregar Certificación" para comenzar</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            {/* Asignación de Sedes */}
            <div className="space-y-3">
              <Label>Sedes Asignadas *</Label>
              <p className="text-xs text-muted-foreground">
                Seleccione las sedes donde imparte clases este profesor
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campus-norte"
                    defaultChecked={teacher?.campuses?.includes('C001')}
                  />
                  <label htmlFor="campus-norte" className="text-sm cursor-pointer">
                    CEP Norte
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campus-santa-cruz"
                    defaultChecked={teacher?.campuses?.includes('C002')}
                  />
                  <label htmlFor="campus-santa-cruz" className="text-sm cursor-pointer">
                    CEP Santa Cruz
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campus-sur"
                    defaultChecked={teacher?.campuses?.includes('C003')}
                  />
                  <label htmlFor="campus-sur" className="text-sm cursor-pointer">
                    CEP Sur
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campus-online"
                    defaultChecked={teacher?.campuses?.includes('C004')}
                  />
                  <label htmlFor="campus-online" className="text-sm cursor-pointer">
                    CEP Online
                  </label>
                </div>
              </div>
            </div>

            {/* Asignación de Cursos */}
            <div className="space-y-3">
              <Label>Cursos Asignados</Label>
              <p className="text-xs text-muted-foreground">
                Seleccione los cursos que imparte este profesor
              </p>
              {/* Multi-select de cursos (mockup visual) */}
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {teacher?.courses && teacher.courses.length > 0 ? (
                  teacher.courses.map(course => (
                    <div key={course.id} className="flex items-center space-x-2">
                      <Checkbox id={`course-${course.id}`} defaultChecked />
                      <label htmlFor={`course-${course.id}`} className="text-sm cursor-pointer flex-1">
                        {course.name} ({course.code})
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay cursos asignados</p>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox id="course-new" />
                  <label htmlFor="course-new" className="text-sm cursor-pointer flex-1">
                    Inteligencia Artificial para Marketing (AI-MKT-2025)
                  </label>
                </div>
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
                Eliminar Profesor
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Profesor'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
