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
import { Trash, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { EditableList } from "@/components/ui/EditableList"
import type { Campus } from "@/data/mockData"

interface CampusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  campus?: Campus
}

export function CampusDialog({ open, onOpenChange, mode = 'create', campus }: CampusDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Sede' : 'Agregar Nueva Sede'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar la sede' : 'Complete los campos'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Imagen */}
          <div className="grid gap-2">
            <Label>Imagen de la Sede</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {campus?.image_url && (
                <img src={campus.image_url} className="w-full h-40 object-cover rounded mb-2" alt="Campus" />
              )}
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Subir Imagen
              </Button>
              <p className="text-xs text-muted-foreground mt-1">800x400px recomendado</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Nombre *</Label>
              <Input defaultValue={campus?.name} placeholder="ej: CEP Norte" />
            </div>
            <div className="grid gap-2">
              <Label>Código *</Label>
              <Input defaultValue={campus?.code} placeholder="ej: NORTE" />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label>Dirección *</Label>
              <Input defaultValue={campus?.address} />
            </div>
            <div className="grid gap-2">
              <Label>Ciudad *</Label>
              <Input defaultValue={campus?.city} />
            </div>
            <div className="grid gap-2">
              <Label>Código Postal *</Label>
              <Input defaultValue={campus?.postal_code} />
            </div>
            <div className="grid gap-2">
              <Label>Teléfono *</Label>
              <Input defaultValue={campus?.phone} />
            </div>
            <div className="grid gap-2">
              <Label>Email *</Label>
              <Input type="email" defaultValue={campus?.email} />
            </div>
            <div className="grid gap-2">
              <Label>Responsable</Label>
              <Input defaultValue={campus?.manager_name} />
            </div>
            <div className="grid gap-2">
              <Label>Email Responsable</Label>
              <Input type="email" defaultValue={campus?.manager_email} />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label>Horario de Atención</Label>
              <Input defaultValue={campus?.opening_hours} />
            </div>
          </div>

          {/* Descripción - OBLIGATORIA */}
          <div className="grid gap-2">
            <Label>Descripción * (Obligatoria)</Label>
            <Textarea
              placeholder="Ubicación, instalaciones, características destacadas..."
              rows={4}
              defaultValue={campus?.description}
            />
          </div>

          {/* Instalaciones - Lista dinámica */}
          <EditableList
            items={campus?.facilities || []}
            label="Instalaciones *"
            placeholder="ej: Aulas equipadas, Biblioteca, etc."
          />
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button variant="destructive" onClick={() => onOpenChange(false)}>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Sede
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
