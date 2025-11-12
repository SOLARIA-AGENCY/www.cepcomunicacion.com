import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Plus, Edit, DoorOpen } from "lucide-react"
import { CampusDialog } from "@/components/dialogs/CampusDialog"
import { campusesData } from "@/data/mockData"

export function CampusPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [selected, setSelected] = useState<typeof campusesData[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setDialogMode('create')
    setSelected(null)
    setShowDialog(true)
  }

  const handleEdit = (campus: typeof campusesData[0]) => {
    setDialogMode('edit')
    setSelected(campus)
    setShowDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sedes</h1>
          <p className="text-muted-foreground">
            Gestión de las sedes de CEP Comunicación
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Sede
        </Button>
      </div>

      {/* Grid de Sedes */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {campusesData.map((campus) => (
          <Card key={campus.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Imagen Banner */}
            <div className="h-48 w-full overflow-hidden bg-muted">
              <img
                src={campus.image_url}
                alt={campus.name}
                className="w-full h-full object-cover"
              />
            </div>

            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{campus.name}</CardTitle>
                  <CardDescription className="text-sm">
                    Código: {campus.code}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(campus)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {campus.active ? (
                    <Badge variant="default">Activa</Badge>
                  ) : (
                    <Badge variant="secondary">Inactiva</Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Ubicación */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{campus.address}</p>
                    <p>{campus.city}, {campus.postal_code}</p>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{campus.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>{campus.email}</span>
                </div>
              </div>

              {/* Responsable */}
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-medium mb-1">Responsable:</p>
                <p className="text-sm font-medium">{campus.manager_name}</p>
                <p className="text-xs text-muted-foreground">{campus.manager_email}</p>
              </div>

              {/* Horario */}
              <div>
                <p className="text-xs font-medium mb-1">Horario de Atención:</p>
                <p className="text-sm text-muted-foreground">{campus.opening_hours}</p>
              </div>

              {/* Descripción - OBLIGATORIA */}
              <div>
                <p className="text-xs font-medium mb-1">Descripción:</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {campus.description}
                </p>
              </div>

              {/* Instalaciones */}
              <div>
                <p className="text-xs font-medium mb-2">Instalaciones:</p>
                <div className="flex flex-wrap gap-1">
                  {campus.facilities.slice(0, 4).map((facility, idx) => (
                    <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                      {facility}
                    </span>
                  ))}
                  {campus.facilities.length > 4 && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      +{campus.facilities.length - 4} más
                    </span>
                  )}
                </div>
              </div>

              {/* Stats de Aulas */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DoorOpen className="h-4 w-4" />
                  <span>{campus.classrooms?.length || 0} aulas</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Navigate to classrooms */}}
                >
                  Ver Aulas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{campusesData.length}</p>
            <p className="text-xs text-muted-foreground">Sedes totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {campusesData.filter(c => c.active).length}
            </p>
            <p className="text-xs text-muted-foreground">Activas</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {campusesData.reduce((acc, c) => acc + (c.classrooms?.length || 0), 0)}
            </p>
            <p className="text-xs text-muted-foreground">Aulas totales</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <CampusDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode={dialogMode}
        campus={selected || undefined}
      />
    </div>
  )
}
