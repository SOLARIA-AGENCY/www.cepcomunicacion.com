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
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface Classroom {
  id: number
  name: string
  capacity: number
  floor: number
  equipment: string[]
}

interface ClassroomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  classroom?: Classroom
  campus?: string
}

export function ClassroomDialog({ open, onOpenChange, mode = 'create', classroom, campus }: ClassroomDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Aula' : 'Agregar Nueva Aula'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar el aula' : 'Complete los campos para crear una nueva aula'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Aula *</Label>
              <Input
                id="name"
                placeholder="ej: Aula A1"
                defaultValue={classroom?.name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacidad *</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="ej: 25"
                defaultValue={classroom?.capacity}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="floor">Planta *</Label>
              <Select defaultValue={classroom?.floor.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione planta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Planta 1</SelectItem>
                  <SelectItem value="2">Planta 2</SelectItem>
                  <SelectItem value="3">Planta 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="campus-select">Sede *</Label>
              <Select defaultValue={campus}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione sede" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="norte">CEP Norte</SelectItem>
                  <SelectItem value="santa-cruz">CEP Santa Cruz</SelectItem>
                  <SelectItem value="sur">CEP Sur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Equipamiento *</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="eq-proyector" />
                <label htmlFor="eq-proyector" className="text-sm cursor-pointer">
                  Proyector
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="eq-ordenadores" />
                <label htmlFor="eq-ordenadores" className="text-sm cursor-pointer">
                  Ordenadores
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="eq-pizarra" />
                <label htmlFor="eq-pizarra" className="text-sm cursor-pointer">
                  Pizarra Digital
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="eq-audio" />
                <label htmlFor="eq-audio" className="text-sm cursor-pointer">
                  Sistema de Audio
                </label>
              </div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Los horarios de las aulas se asignan automáticamente desde el sistema central
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Aula
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Aula'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
