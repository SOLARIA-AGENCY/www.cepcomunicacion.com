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
