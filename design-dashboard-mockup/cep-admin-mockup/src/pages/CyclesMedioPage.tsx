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
import { Plus, Edit, BookOpen, Calendar, Users } from "lucide-react"

// Mock data for Ciclo Medio courses
const cicloMedioData = [
  {
    id: 1,
    name: "Técnico en Sistemas Microinformáticos y Redes",
    code: "SMR",
    duration: "2000 horas",
    modality: "Presencial",
    level: "Grado Medio",
    active_convocations: 2,
    total_students: 45,
    description: "Formación profesional orientada a la instalación, configuración y mantenimiento de sistemas microinformáticos y redes locales.",
  },
  {
    id: 2,
    name: "Técnico en Gestión Administrativa",
    code: "GA",
    duration: "2000 horas",
    modality: "Semipresencial",
    level: "Grado Medio",
    active_convocations: 1,
    total_students: 32,
    description: "Preparación para la gestión administrativa en pequeñas y medianas empresas, incluyendo contabilidad, recursos humanos y atención al cliente.",
  },
  {
    id: 3,
    name: "Técnico en Actividades Comerciales",
    code: "AC",
    duration: "2000 horas",
    modality: "Presencial",
    level: "Grado Medio",
    active_convocations: 1,
    total_students: 28,
    description: "Formación en técnicas de venta, merchandising, organización comercial y atención al cliente.",
  },
]

export function CyclesMedioPage() {
  const [selectedCycle, setSelectedCycle] = useState<typeof cicloMedioData[0] | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ciclo Formativo de Grado Medio</h1>
          <p className="text-muted-foreground">
            Gestión de ciclos formativos de grado medio (FP Medio)
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Ciclo Medio
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ciclos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cicloMedioData.length}</div>
            <p className="text-xs text-muted-foreground">Grado Medio activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convocatorias Activas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cicloMedioData.reduce((acc, cycle) => acc + cycle.active_convocations, 0)}
            </div>
            <p className="text-xs text-muted-foreground">En curso actualmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alumnos Matriculados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cicloMedioData.reduce((acc, cycle) => acc + cycle.total_students, 0)}
            </div>
            <p className="text-xs text-muted-foreground">En ciclos de grado medio</p>
          </CardContent>
        </Card>
      </div>

      {/* Cycles Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {cicloMedioData.map((cycle) => (
          <Card key={cycle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{cycle.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    Código: {cycle.code} | {cycle.duration}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSelectedCycle(cycle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Badge variant="default">{cycle.level}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {cycle.description}
                </p>
              </div>

              {/* Modality */}
              <div>
                <p className="text-xs font-medium mb-1">Modalidad:</p>
                <Badge variant="secondary">{cycle.modality}</Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Convocatorias</p>
                  <p className="text-lg font-semibold">{cycle.active_convocations}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Alumnos</p>
                  <p className="text-lg font-semibold">{cycle.total_students}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalles
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Convocatorias
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
