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
import { Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { EditableList } from "@/components/ui/EditableList"
import type { Cycle } from "@/data/mockData"

interface CycleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  cycle?: Cycle
}

export function CycleDialog({ open, onOpenChange, mode = 'create', cycle }: CycleDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Ciclo' : 'Agregar Nuevo Ciclo'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos' : 'Complete los campos'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 col-span-2">
              <Label>Nombre del Ciclo *</Label>
              <Input defaultValue={cycle?.name} placeholder="ej: Técnico Superior en Marketing..." />
            </div>
            <div className="grid gap-2">
              <Label>Código *</Label>
              <Input defaultValue={cycle?.code} placeholder="ej: TSMP" />
            </div>
            <div className="grid gap-2">
              <Label>Nivel *</Label>
              <Select defaultValue={cycle?.level}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grado-medio">Grado Medio</SelectItem>
                  <SelectItem value="grado-superior">Grado Superior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Duración (horas) *</Label>
              <Input type="number" defaultValue={cycle?.duration_hours} placeholder="ej: 2000" />
            </div>
          </div>

          {/* Descripción - OBLIGATORIA */}
          <div className="grid gap-2">
            <Label>Descripción * (Obligatoria)</Label>
            <Textarea
              placeholder="Formación profesional, competencias, ámbitos..."
              rows={4}
              defaultValue={cycle?.description}
            />
          </div>

          {/* Requisitos - Lista dinámica */}
          <EditableList
            items={cycle?.requirements || []}
            label="Requisitos de Acceso *"
            placeholder="ej: Bachillerato o equivalente..."
          />

          {/* Salidas Profesionales - Lista dinámica */}
          <EditableList
            items={cycle?.career_opportunities || []}
            label="Salidas Profesionales"
            placeholder="ej: Especialista en Marketing Digital..."
          />
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button variant="destructive" onClick={() => onOpenChange(false)}>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Ciclo
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
