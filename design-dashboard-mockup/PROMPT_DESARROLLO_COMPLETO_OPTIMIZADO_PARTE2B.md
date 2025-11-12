# PROMPT COMPLETO OPTIMIZADO - PARTE 2B - Dashboard CEP Comunicación

## 🎯 CONTINUACIÓN - Fases 9-14 (FINAL)

**IMPORTANTE:** Este documento continúa la PARTE 2. Ejecuta en orden: PARTE 1 → PARTE 2 → PARTE 2B

**Ubicación del proyecto:**
```
/Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup/
```

---

## 📋 FASE 9: CampusPage + CampusDialog (20 min)

### 9.1. Archivo: `src/pages/CampusPage.tsx`

**CREAR NUEVO:**

```typescript
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
import { MapPin, Phone, Mail, Plus, Edit, DoorOpen, Users } from "lucide-react"
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
                  <span>{campus.classrooms?.length || campus.classrooms_count} aulas</span>
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
              {campusesData.reduce((acc, c) => acc + (c.classrooms?.length || c.classrooms_count), 0)}
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
```

### 9.2. Archivo: `src/components/dialogs/CampusDialog.tsx`

```typescript
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
                <img src={campus.image_url} className="w-full h-40 object-cover rounded mb-2" />
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
```

---

## 📋 FASE 10: CyclesPage + CycleDialog (15 min)

### 10.1. Archivo: `src/pages/CyclesPage.tsx`

```typescript
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
              </div>

              {/* Salidas Profesionales */}
              {cycle.career_opportunities && (
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
```

### 10.2. Archivo: `src/components/dialogs/CycleDialog.tsx`

```typescript
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
```

---

## 📋 FASES 11-14: RESUMEN EJECUTIVO

**Por limitación de espacio, las fases 11-14 siguen el MISMO PATRÓN que ya establecimos.**

### Fase 11: CoursesPage + CourseDialog
- Grid con filtros (tipo, modalidad, estado)
- Tabs en dialog (General, Contenido, Profesores, Sedes)
- Descripción OBLIGATORIA
- Temario desglosado
- Profesores asignados (checkboxes)
- Sedes donde se imparte (checkboxes)

### Fase 12: CampaignsPage + CampaignDialog
- Tabla con métricas (leads, conversiones, ROI)
- Tabs en dialog (General, Objetivos, Presupuesto, UTM)
- Descripción OBLIGATORIA
- Público objetivo, mensajes clave

### Fase 13: SettingsPage (Solo página, sin dialog)
- Tabs: General, Notificaciones, Seguridad, Integraciones, Usuarios
- Formularios visuales (mockup, no funcional)

### Fase 14: UserProfilePage (Solo página, sin dialog)
- Avatar grande
- Formulario de datos personales
- Sección biografía OBLIGATORIA
- Certificaciones
- Preferencias (idioma, zona horaria, notificaciones)

---

## 📋 PASO FINAL: Actualizar App.tsx con Rutas

**Archivo:** `src/App.tsx`

**AGREGAR las rutas que faltan:**

```typescript
// ... importar nuevas páginas

<Route path="alumnos" element={<StudentsPage />} />
<Route path="personal" element={<AdministrativePage />} />
<Route path="sedes" element={<CampusPage />} />
<Route path="ciclos" element={<CyclesPage />} />
<Route path="cursos" element={<CoursesPage />} />
<Route path="campanas" element={<CampaignsPage />} />
<Route path="configuracion" element={<SettingsPage />} />
<Route path="perfil" element={<UserProfilePage />} />
```

---

## ✅ CHECKLIST FINAL

Al completar PARTE 1 + PARTE 2 + PARTE 2B:

- [ ] Profesores (completo con biografía, certificaciones, sedes, cursos clicables)
- [ ] Aulas (calendario semanal visual, equipamiento dinámico)
- [ ] Alumnos (tabla + cards, cursos matriculados, notas académicas)
- [ ] Personal Administrativo (similar a profesores, responsabilidades)
- [ ] Sedes (cards grandes con imagen, descripción, instalaciones)
- [ ] Ciclos (accordion, cursos asociados, salidas profesionales)
- [ ] Cursos (por implementar siguiendo patrón)
- [ ] Campañas (por implementar siguiendo patrón)
- [ ] Configuración (por implementar)
- [ ] Perfil (por implementar)

---

## 🚀 EJECUCIÓN

1. **Ejecuta PARTE 1** en Claude Code Web
2. **Ejecuta PARTE 2** en Claude Code Web
3. **Ejecuta PARTE 2B** (este archivo) en Claude Code Web

**RESULTADO FINAL:** Dashboard completamente funcional (visual) con todas las secciones implementadas siguiendo el patrón optimizado.

---

**Creado:** 2025-11-11
**Proyecto:** CEP Comunicación Dashboard Mockup
**Versión:** 2B (Final)
