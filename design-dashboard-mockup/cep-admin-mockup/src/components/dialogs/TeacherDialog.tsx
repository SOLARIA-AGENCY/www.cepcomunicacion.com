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
import { Upload } from "lucide-react"

interface TeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeacherDialog({ open, onOpenChange }: TeacherDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Profesor</DialogTitle>
          <DialogDescription>
            Complete la información del nuevo profesor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Foto del profesor */}
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>AB</AvatarFallback>
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
              <Label htmlFor="teacher-name">Nombre Completo *</Label>
              <Input id="teacher-name" placeholder="Juan Pérez García" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-email">Email *</Label>
              <Input
                id="teacher-email"
                type="email"
                placeholder="juan.perez@cepcomunicacion.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-phone">Teléfono *</Label>
              <Input id="teacher-phone" placeholder="+34 600 000 000" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-department">Departamento *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing Digital</SelectItem>
                  <SelectItem value="diseno">Diseño Gráfico</SelectItem>
                  <SelectItem value="desarrollo">Desarrollo Web</SelectItem>
                  <SelectItem value="audiovisual">Audiovisual</SelectItem>
                  <SelectItem value="gestion">Gestión Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Especialidades */}
          <div className="grid gap-2">
            <Label>Especialidades *</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-seo" />
                <label htmlFor="spec-seo" className="text-sm cursor-pointer">
                  SEO y SEM
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-social" />
                <label htmlFor="spec-social" className="text-sm cursor-pointer">
                  Redes Sociales
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-content" />
                <label htmlFor="spec-content" className="text-sm cursor-pointer">
                  Content Marketing
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-analytics" />
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
            />
          </div>

          {/* Estado activo */}
          <div className="flex items-center space-x-2">
            <Switch id="teacher-active" defaultChecked />
            <Label htmlFor="teacher-active" className="cursor-pointer">
              Profesor activo
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onOpenChange(false)}>Guardar Profesor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
