import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Edit, BookOpen, Clock, GraduationCap } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CycleDialog } from "@/components/dialogs/CycleDialog"
import { cyclesData } from "@/data/mockData"

export function CyclesPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [selected, setSelected] = useState<typeof cyclesData[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setDialogMode('create')
    setSelected(null)
    setShowDialog(true)
  }

  const handleEdit = (cycle: typeof cyclesData[0]) => {
    setDialogMode('edit')
    setSelected(cycle)
    setShowDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ciclos Formativos</h1>
          <p className="text-muted-foreground">
            Gestión de los ciclos de Formación Profesional
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Ciclo
        </Button>
      </div>

      {/* Accordion de Ciclos */}
      <Accordion type="single" collapsible className="space-y-4">
        {cyclesData.map((cycle) => (
          <AccordionItem
            key={cycle.id}
            value={cycle.id}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">{cycle.name}</p>
                    <p className="text-xs text-muted-foreground">{cycle.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={cycle.level === 'grado-superior' ? 'default' : 'secondary'}>
                    {cycle.level === 'grado-superior' ? 'Grado Superior' : 'Grado Medio'}
                  </Badge>
                  {cycle.active ? (
                    <Badge variant="outline" className="border-green-500 text-green-600">
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactivo</Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(cycle)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="space-y-4 pt-4">
              {/* Duración */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{cycle.duration_hours} horas</span>
                <span className="text-muted-foreground">
                  ({(cycle.duration_hours / 160).toFixed(1)} meses aprox.)
                </span>
              </div>

              {/* Descripción - OBLIGATORIA */}
              <div>
                <p className="text-sm font-medium mb-1">Descripción:</p>
                <p className="text-sm text-muted-foreground">{cycle.description}</p>
              </div>

              {/* Requisitos */}
              <div>
                <p className="text-sm font-medium mb-2">Requisitos de Acceso:</p>
                <ul className="space-y-1">
                  {cycle.requirements.map((req, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cursos Asociados */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Cursos Asociados ({cycle.courses.length}):
                </p>
                {cycle.courses.length > 0 ? (
                  <div className="grid gap-2">
                    {cycle.courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium">{course.name}</p>
                          <p className="text-xs text-muted-foreground">{course.code}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {course.mandatory && (
                            <Badge variant="outline" className="text-xs">Obligatorio</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No hay cursos asociados aún</p>
                )}
              </div>

              {/* Salidas Profesionales */}
              {cycle.career_opportunities && cycle.career_opportunities.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Salidas Profesionales:</p>
                  <div className="flex flex-wrap gap-2">
                    {cycle.career_opportunities.map((career, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {career}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{cyclesData.length}</p>
            <p className="text-xs text-muted-foreground">Ciclos totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {cyclesData.filter(c => c.level === 'grado-superior').length}
            </p>
            <p className="text-xs text-muted-foreground">Grado Superior</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {cyclesData.filter(c => c.level === 'grado-medio').length}
            </p>
            <p className="text-xs text-muted-foreground">Grado Medio</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {cyclesData.reduce((acc, c) => acc + c.courses.length, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Cursos asociados</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <CycleDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode={dialogMode}
        cycle={selected || undefined}
      />
    </div>
  )
}
