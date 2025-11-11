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
import { Info } from "lucide-react"

interface ClassroomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campus?: string
}

export function ClassroomDialog({ open, onOpenChange, campus }: ClassroomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Aula</DialogTitle>
          <DialogDescription>
            Complete los campos para crear una nueva aula
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Aula *</Label>
              <Input id="name" placeholder="ej: Aula A1" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacidad *</Label>
              <Input id="capacity" type="number" placeholder="ej: 25" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="floor">Planta *</Label>
              <Select>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onOpenChange(false)}>Guardar Aula</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
