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
