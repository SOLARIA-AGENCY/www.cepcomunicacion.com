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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface Teacher {
  id: string
  first_name: string
  last_name: string
  initials: string
  email: string
  phone: string
  photo: string
  department: string
  specialties: string[]
  bio: string
  active: boolean
}

interface TeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  teacher?: Teacher
}

export function TeacherDialog({ open, onOpenChange, mode = 'create', teacher }: TeacherDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Profesor' : 'Agregar Profesor'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique la información del profesor' : 'Complete la información del nuevo profesor'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Foto del profesor */}
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={teacher?.photo || "/placeholder-avatar.jpg"} />
              <AvatarFallback>{teacher?.initials || "AB"}</AvatarFallback>
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

          {/* Información personal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="teacher-first-name">Nombre *</Label>
              <Input
                id="teacher-first-name"
                placeholder="Juan"
                defaultValue={teacher?.first_name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-last-name">Apellidos *</Label>
              <Input
                id="teacher-last-name"
                placeholder="Pérez García"
                defaultValue={teacher?.last_name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-email">Email *</Label>
              <Input
                id="teacher-email"
                type="email"
                placeholder="juan.perez@cepcomunicacion.com"
                defaultValue={teacher?.email}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-phone">Teléfono *</Label>
              <Input
                id="teacher-phone"
                placeholder="+34 600 000 000"
                defaultValue={teacher?.phone}
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="teacher-department">Departamento *</Label>
              <Select defaultValue={teacher?.department}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                  <SelectItem value="Diseño Gráfico">Diseño Gráfico</SelectItem>
                  <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                  <SelectItem value="Audiovisual">Audiovisual</SelectItem>
                  <SelectItem value="Gestión Empresarial">Gestión Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Especialidades */}
          <div className="grid gap-2">
            <Label>Especialidades *</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-seo" defaultChecked={teacher?.specialties.includes("SEO")} />
                <label htmlFor="spec-seo" className="text-sm cursor-pointer">
                  SEO y SEM
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-social" defaultChecked={teacher?.specialties.includes("Redes Sociales")} />
                <label htmlFor="spec-social" className="text-sm cursor-pointer">
                  Redes Sociales
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-content" defaultChecked={teacher?.specialties.includes("Content Marketing")} />
                <label htmlFor="spec-content" className="text-sm cursor-pointer">
                  Content Marketing
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-analytics" defaultChecked={teacher?.specialties.includes("Analytics")} />
                <label htmlFor="spec-analytics" className="text-sm cursor-pointer">
                  Analytics
                </label>
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div className="grid gap-2">
            <Label htmlFor="teacher-bio">Biografía (Opcional)</Label>
            <Textarea
              id="teacher-bio"
              placeholder="Breve descripción profesional..."
              rows={4}
              defaultValue={teacher?.bio}
            />
          </div>

          {/* Estado activo */}
          <div className="flex items-center space-x-2">
            <Switch id="teacher-active" defaultChecked={teacher?.active ?? true} />
            <Label htmlFor="teacher-active" className="cursor-pointer">
              Profesor activo
            </Label>
          </div>
        </div>

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
