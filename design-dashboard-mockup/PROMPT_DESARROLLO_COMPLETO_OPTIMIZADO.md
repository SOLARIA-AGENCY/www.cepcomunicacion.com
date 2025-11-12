# PROMPT COMPLETO OPTIMIZADO - Dashboard CEP Comunicación (Mockup Visual)

## 🎯 OBJETIVO

Implementar **TODAS las secciones** del dashboard con un patrón visual optimizado, detallado y consistente. Este es un mockup visual (NO funcional) pero debe mostrar todos los detalles como si fuera real.

**Ubicación del proyecto:**
```
/Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup/
```

## 🏗️ PATRÓN DE DISEÑO MEJORADO

### Principios Generales

1. **Información Completa**: Mostrar TODA la información relevante, no ocultar campos "opcionales"
2. **Visualización Detallada**: Desglosar relaciones (cursos asignados, sedes, etc.) con fichas visuales clicables
3. **Campos Dinámicos**: Usar listas editables en lugar de checkboxes fijos (ejemplo: equipamiento de aulas)
4. **Calendarios Visuales**: Para ocupación temporal (aulas, profesores) usar vistas por semana/mes
5. **Navegación Contextual**: Elementos relacionados deben ser clicables y llevar a su detalle

### Estructura de Página Estándar

```tsx
export function EntityPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  return (
    <div className="space-y-6">
      {/* Header con Título, Descripción y Botón Agregar */}
      <Header />

      {/* Barra de Filtros y Búsqueda */}
      <Filters />

      {/* Toggle Grid/List View */}
      <ViewToggle />

      {/* Grid/List de Items */}
      {viewMode === 'grid' ? <GridView /> : <ListView />}

      {/* Stats Card */}
      <StatsCard />

      {/* Dialog */}
      <EntityDialog />
    </div>
  )
}
```

### Estructura de Card Detallada

```tsx
<Card className="overflow-hidden hover:shadow-lg transition-shadow">
  <CardHeader>
    {/* Avatar/Image grande */}
    {/* Nombre y rol/tipo */}
    {/* Solo botón Edit (NO delete) */}
  </CardHeader>

  <CardContent className="space-y-4">
    {/* Información de contacto */}
    {/* Detalles específicos (especialidades, certificados, etc.) */}
    {/* Relaciones expandidas (cursos, sedes) con fichas clicables */}
    {/* Biografía/Descripción SIEMPRE visible (no opcional) */}
    {/* Estado y badges */}
  </CardContent>

  <CardFooter>
    {/* Acciones secundarias (ver detalle, etc.) */}
  </CardFooter>
</Card>
```

### Estructura de Dialog Optimizada

```tsx
<Dialog>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>{mode === 'edit' ? 'Editar' : 'Agregar'} {Entity}</DialogTitle>
    </DialogHeader>

    {/* Tabs para organizar mucha información */}
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="details">Detalles</TabsTrigger>
        <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        {/* Avatar Upload */}
        {/* Campos básicos */}
      </TabsContent>

      <TabsContent value="details">
        {/* Información detallada */}
        {/* Campos dinámicos (NO checkboxes fijos) */}
      </TabsContent>

      <TabsContent value="assignments">
        {/* Asignación de cursos, sedes, etc. */}
        {/* Multi-select con preview */}
      </TabsContent>
    </Tabs>

    <DialogFooter>
      <div className="flex w-full justify-between">
        {mode === 'edit' && (
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Eliminar {Entity}
          </Button>
        )}
        <div className="flex gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button>{mode === 'edit' ? 'Guardar' : 'Crear'}</Button>
        </div>
      </div>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 📋 FASE 1: Actualizar Mock Data (15 min)

### Archivo: `src/data/mockData.ts`

**REEMPLAZAR la interfaz `TeacherExpanded` existente:**

```typescript
export interface TeacherExpanded {
  id: string
  first_name: string
  last_name: string
  initials: string
  email: string
  phone: string
  photo: string
  department: string
  specialties: string[]
  certifications: {
    title: string
    institution: string
    year: number
  }[]
  bio: string // OBLIGATORIO (no opcional)
  active: boolean
  courses: {
    id: string
    name: string
    code: string
    type: string
    modality: string
    students: number
  }[]
  campuses: string[] // IDs de sedes asignadas
}
```

**ACTUALIZAR el array `teachersExpanded` (expandir cada profesor):**

```typescript
export const teachersExpanded: TeacherExpanded[] = [
  {
    id: "1",
    first_name: "María",
    last_name: "García Pérez",
    initials: "MG",
    email: "maria.garcia@cepcomunicacion.com",
    phone: "+34 612 345 678",
    photo: "https://i.pravatar.cc/150?img=1",
    department: "Marketing Digital",
    specialties: ["SEO", "SEM", "Analytics", "Google Ads", "Meta Ads"],
    certifications: [
      {
        title: "Google Ads Certified",
        institution: "Google",
        year: 2023
      },
      {
        title: "Master en Marketing Digital",
        institution: "ESIC Business School",
        year: 2019
      },
      {
        title: "Certificación Meta Blueprint",
        institution: "Meta",
        year: 2022
      }
    ],
    bio: "15 años de experiencia en marketing digital y publicidad. Especializada en campañas de rendimiento para e-commerce y generación de leads B2B. Ha gestionado presupuestos superiores a 500K€ anuales con ROI promedio del 320%.",
    active: true,
    courses: [
      {
        id: "CURSO001",
        name: "Community Manager Profesional",
        code: "CM-PRO-2025",
        type: "Privado",
        modality: "Semipresencial",
        students: 18
      },
      {
        id: "CURSO002",
        name: "SEO y SEM Avanzado",
        code: "SEO-SEM-ADV",
        type: "Privado",
        modality: "Presencial",
        students: 15
      },
      {
        id: "CURSO008",
        name: "Marketing para Desempleados",
        code: "MKT-DESEMP",
        type: "Desempleados",
        modality: "Semipresencial",
        students: 20
      }
    ],
    campuses: ["C001", "C002"] // CEP Norte y Santa Cruz
  },
  // ... Expandir los otros 14 profesores con el mismo patrón
  {
    id: "2",
    first_name: "Carlos",
    last_name: "Rodríguez Martínez",
    initials: "CR",
    email: "carlos.rodriguez@cepcomunicacion.com",
    phone: "+34 612 345 679",
    photo: "https://i.pravatar.cc/150?img=2",
    department: "Desarrollo Web",
    specialties: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    certifications: [
      {
        title: "AWS Certified Solutions Architect",
        institution: "Amazon Web Services",
        year: 2023
      },
      {
        title: "Técnico Superior en Desarrollo de Aplicaciones Web",
        institution: "CEP Comunicación",
        year: 2015
      }
    ],
    bio: "Desarrollador full-stack con 10 años de experiencia en tecnologías web modernas. Ha liderado proyectos para empresas como CaixaBank y Telefónica. Especializado en arquitecturas escalables y metodologías ágiles.",
    active: true,
    courses: [
      {
        id: "CURSO004",
        name: "Desarrollo Frontend con React",
        code: "REACT-2025",
        type: "Ciclo Superior",
        modality: "Presencial",
        students: 12
      },
      {
        id: "CURSO005",
        name: "Backend con Node.js y PostgreSQL",
        code: "NODE-PSQL",
        type: "Ciclo Superior",
        modality: "Semipresencial",
        students: 9
      }
    ],
    campuses: ["C001"] // Solo CEP Norte
  },
  // Continuar con los 13 profesores restantes...
]
```

**AGREGAR nuevas interfaces al final del archivo:**

```typescript
// ============================================
// ESTUDIANTES (20 registros)
// ============================================
export interface Student {
  id: string
  first_name: string
  last_name: string
  initials: string
  email: string
  phone: string
  dni: string
  date_of_birth: string
  address: string
  city: string
  postal_code: string
  emergency_contact: string
  emergency_phone: string
  photo: string
  enrolled_courses: {
    id: string
    name: string
    code: string
    enrollment_date: string
    status: 'active' | 'completed' | 'dropped'
    grade?: number
  }[]
  campus_id: string
  academic_notes: string // OBLIGATORIO (no opcional)
  status: 'active' | 'inactive' | 'graduated'
}

export const studentsData: Student[] = [
  {
    id: "S001",
    first_name: "Ana",
    last_name: "Martín López",
    initials: "AM",
    email: "ana.martin@estudiante.com",
    phone: "+34 612 111 001",
    dni: "12345678A",
    date_of_birth: "1998-05-15",
    address: "Calle Mayor 45",
    city: "Santa Cruz de Tenerife",
    postal_code: "38001",
    emergency_contact: "María López García",
    emergency_phone: "+34 612 111 002",
    photo: "https://i.pravatar.cc/150?img=16",
    enrolled_courses: [
      {
        id: "CURSO001",
        name: "Community Manager Profesional",
        code: "CM-PRO-2025",
        enrollment_date: "2025-01-15",
        status: "active",
        grade: undefined
      },
      {
        id: "CURSO003",
        name: "Diseño UX/UI con Figma",
        code: "UX-UI-FIG",
        enrollment_date: "2025-02-01",
        status: "active",
        grade: undefined
      }
    ],
    campus_id: "C002", // Santa Cruz
    academic_notes: "Estudiante destacada con excelente participación en clase. Muestra gran interés en marketing digital y diseño. Ha completado varios proyectos freelance durante el curso.",
    status: "active"
  },
  // ... Agregar 19 estudiantes más con este patrón
]

// ============================================
// PERSONAL ADMINISTRATIVO (8+ registros)
// ============================================
export interface AdministrativeStaff {
  id: string
  first_name: string
  last_name: string
  initials: string
  email: string
  phone: string
  photo: string
  position: string
  department: string
  extension: string
  active: boolean
  campuses: string[] // Múltiples sedes asignadas
  responsibilities: string[] // Lista de responsabilidades
  bio: string // OBLIGATORIO
  certifications: {
    title: string
    institution: string
    year: number
  }[]
}

export const administrativeStaffData: AdministrativeStaff[] = [
  {
    id: "ADM001",
    first_name: "Isabel",
    last_name: "Fernández Ruiz",
    initials: "IF",
    email: "isabel.fernandez@cepcomunicacion.com",
    phone: "+34 922 123 456",
    photo: "https://i.pravatar.cc/150?img=9",
    position: "Secretaria Académica",
    department: "Secretaría Académica",
    extension: "101",
    active: true,
    campuses: ["C001", "C002"],
    responsibilities: [
      "Gestión de matrículas y expedientes académicos",
      "Atención al alumno presencial y telefónica",
      "Emisión de certificados y títulos",
      "Coordinación con profesorado"
    ],
    bio: "12 años de experiencia en gestión académica en centros de formación profesional. Responsable de la digitalización del sistema de matrículas en 2020. Coordinadora del equipo de atención al estudiante.",
    certifications: [
      {
        title: "Técnico en Gestión Administrativa",
        institution: "IES La Laguna",
        year: 2010
      },
      {
        title: "Certificado en Protección de Datos (RGPD)",
        institution: "Escuela de Negocios",
        year: 2022
      }
    ]
  },
  // ... Agregar 7 más
]

// ============================================
// SEDES CON AULAS DETALLADAS
// ============================================
export interface Campus {
  id: string
  name: string
  code: string
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
  manager_name: string
  manager_email: string
  opening_hours: string
  image_url: string
  classrooms: Classroom[] // Aulas con calendario
  active: boolean
  description: string // OBLIGATORIO
  facilities: string[] // Instalaciones disponibles
}

export interface Classroom {
  id: string
  name: string
  capacity: number
  floor: number
  equipment: string[] // Array DINÁMICO (no checkboxes fijos)
  weekly_schedule: WeeklyScheduleSlot[]
}

export interface WeeklyScheduleSlot {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  start_time: string // "09:00"
  end_time: string // "13:00"
  course_id: string
  course_name: string
  teacher_name: string
  color: string // Para visualización
}

export const campusesData: Campus[] = [
  {
    id: "C001",
    name: "CEP Norte",
    code: "NORTE",
    address: "Avenida Los Menceyes 45",
    city: "San Cristóbal de La Laguna",
    postal_code: "38200",
    phone: "+34 922 123 456",
    email: "norte@cepcomunicacion.com",
    manager_name: "Ana García Pérez",
    manager_email: "ana.garcia@cepcomunicacion.com",
    opening_hours: "Lunes a Viernes: 08:00 - 21:00 | Sábados: 09:00 - 14:00",
    image_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
    description: "Sede principal ubicada en el corazón de La Laguna, con fácil acceso en transporte público. Instalaciones modernas renovadas en 2022 con tecnología de última generación. Cuenta con 4 aulas equipadas, sala de profesores, biblioteca digital y zona de coworking para alumnos.",
    facilities: [
      "4 Aulas completamente equipadas",
      "Biblioteca digital con 500+ recursos",
      "Zona de coworking con WiFi 6",
      "Cafetería con máquinas vending",
      "Aparcamiento privado (20 plazas)",
      "Acceso para personas con movilidad reducida"
    ],
    classrooms: [
      {
        id: "A1-NORTE",
        name: "Aula A1",
        capacity: 25,
        floor: 1,
        equipment: [
          "Proyector 4K",
          "Ordenadores (25 unidades)",
          "Pizarra Digital Interactiva",
          "Sistema de Audio Profesional",
          "Cámaras para streaming",
          "Aire Acondicionado",
          "Mobiliario ergonómico"
        ],
        weekly_schedule: [
          {
            day: "monday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO001",
            course_name: "Community Manager Profesional",
            teacher_name: "María García Pérez",
            color: "#3b82f6" // blue
          },
          {
            day: "monday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO004",
            course_name: "Desarrollo Frontend con React",
            teacher_name: "Carlos Rodríguez Martínez",
            color: "#8b5cf6" // purple
          },
          {
            day: "tuesday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO002",
            course_name: "SEO y SEM Avanzado",
            teacher_name: "María García Pérez",
            color: "#3b82f6"
          },
          {
            day: "wednesday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO003",
            course_name: "Diseño UX/UI con Figma",
            teacher_name: "Laura Martínez Sosa",
            color: "#ec4899" // pink
          },
          {
            day: "thursday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO001",
            course_name: "Community Manager Profesional",
            teacher_name: "María García Pérez",
            color: "#3b82f6"
          },
          {
            day: "friday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO005",
            course_name: "Backend con Node.js",
            teacher_name: "Carlos Rodríguez Martínez",
            color: "#8b5cf6"
          }
        ]
      },
      // ... 3 aulas más para CEP Norte
    ],
    active: true
  },
  // ... Otras sedes
]

// ============================================
// CICLOS FORMATIVOS
// ============================================
export interface Cycle {
  id: string
  name: string
  code: string
  level: 'grado-medio' | 'grado-superior'
  duration_hours: number
  requirements: string[]
  description: string // OBLIGATORIO (no opcional)
  courses: {
    id: string
    name: string
    code: string
    mandatory: boolean
  }[]
  active: boolean
  career_opportunities: string[] // Salidas profesionales
}

// ============================================
// CURSOS
// ============================================
export interface Course {
  id: string
  name: string
  code: string
  type: 'telematico' | 'ocupados' | 'desempleados' | 'privados' | 'ciclo-medio' | 'ciclo-superior'
  modality: 'presencial' | 'semipresencial' | 'telematico'
  cycle_id?: string
  duration_hours: number
  price: number
  max_students: number
  current_students: number
  description: string // OBLIGATORIO
  objectives: string[]
  requirements: string[]
  syllabus: {
    module: string
    hours: number
    topics: string[]
  }[]
  teachers: string[] // IDs de profesores asignados
  campuses: string[] // IDs de sedes donde se imparte
  status: 'draft' | 'published' | 'archived'
  featured: boolean
}

// ============================================
// CAMPAÑAS
// ============================================
export interface Campaign {
  id: string
  name: string
  type: 'email' | 'social' | 'paid_ads' | 'organic' | 'event' | 'referral'
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
  start_date: string
  end_date: string
  budget: number
  target_leads: number
  total_leads: number
  total_conversions: number
  conversion_rate: number
  cost_per_lead: number
  roi: number
  utm_source: string
  utm_medium: string
  utm_campaign: string
  description: string // OBLIGATORIO
  target_audience: string
  key_messages: string[]
}

// ============================================
// PERFIL DE USUARIO
// ============================================
export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: 'admin' | 'gestor' | 'marketing' | 'asesor' | 'lectura'
  department: string
  photo: string
  language: 'es' | 'en' | 'ca'
  timezone: string
  email_notifications: boolean
  sms_notifications: boolean
  bio: string // OBLIGATORIO
  certifications: {
    title: string
    year: number
  }[]
}
```

## 📋 FASE 2: Crear Componentes de UI Necesarios (10 min)

### 2.1. Instalar shadcn components faltantes

```bash
cd /Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add calendar
```

### 2.2. Crear Componente de Calendario Semanal

**Archivo:** `src/components/ui/WeeklyCalendar.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WeeklyScheduleSlot } from "@/data/mockData"

interface WeeklyCalendarProps {
  schedule: WeeklyScheduleSlot[]
  className?: string
}

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
]

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
]

export function WeeklyCalendar({ schedule, className }: WeeklyCalendarProps) {
  const getSlotForDayAndTime = (day: string, time: string) => {
    return schedule.find(slot =>
      slot.day === day && slot.start_time <= time && slot.end_time > time
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Horario Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-muted text-sm font-medium">Hora</th>
                {DAYS.map(day => (
                  <th key={day.key} className="border p-2 bg-muted text-sm font-medium">
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map(time => (
                <tr key={time}>
                  <td className="border p-2 text-xs font-medium text-muted-foreground">
                    {time}
                  </td>
                  {DAYS.map(day => {
                    const slot = getSlotForDayAndTime(day.key, time)
                    return (
                      <td
                        key={`${day.key}-${time}`}
                        className="border p-1"
                        style={{
                          backgroundColor: slot ? `${slot.color}20` : 'transparent'
                        }}
                      >
                        {slot && slot.start_time === time && (
                          <div className="text-xs">
                            <div className="font-semibold truncate" style={{ color: slot.color }}>
                              {slot.course_name}
                            </div>
                            <div className="text-muted-foreground truncate">
                              {slot.teacher_name}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {slot.start_time} - {slot.end_time}
                            </div>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leyenda */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from(new Set(schedule.map(s => s.course_id))).map(courseId => {
            const slot = schedule.find(s => s.course_id === courseId)!
            return (
              <Badge
                key={courseId}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: slot.color,
                  color: slot.color
                }}
              >
                {slot.course_name}
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
```

### 2.3. Crear Componente de Ficha de Curso Clicable

**Archivo:** `src/components/ui/CourseCard.tsx`

```typescript
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface CourseCardMiniProps {
  course: {
    id: string
    name: string
    code: string
    type: string
    modality: string
    students: number
  }
  className?: string
}

export function CourseCardMini({ course, className }: CourseCardMiniProps) {
  const navigate = useNavigate()

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={() => navigate(`/cursos?highlight=${course.id}`)}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-semibold text-sm leading-tight">{course.name}</p>
            <p className="text-xs text-muted-foreground">{course.code}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{course.students}</span>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {course.modality}
          </Badge>
        </div>

        <Badge variant="outline" className="text-[10px]">
          {course.type}
        </Badge>
      </CardContent>
    </Card>
  )
}
```

### 2.4. Crear Componente de Lista Dinámica Editable

**Archivo:** `src/components/ui/EditableList.tsx`

```typescript
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface EditableListProps {
  items: string[]
  onItemsChange?: (items: string[]) => void
  placeholder?: string
  label: string
}

export function EditableList({ items, onItemsChange, placeholder = "Agregar ítem...", label }: EditableListProps) {
  const [newItem, setNewItem] = useState("")
  const [currentItems, setCurrentItems] = useState(items)

  const addItem = () => {
    if (newItem.trim()) {
      const updated = [...currentItems, newItem.trim()]
      setCurrentItems(updated)
      onItemsChange?.(updated)
      setNewItem("")
    }
  }

  const removeItem = (index: number) => {
    const updated = currentItems.filter((_, i) => i !== index)
    setCurrentItems(updated)
    onItemsChange?.(updated)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Lista de items actuales */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
        {currentItems.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {item}
            <button
              onClick={() => removeItem(index)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Input para agregar nuevo */}
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <Button type="button" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

## 📋 FASE 3: Actualizar TeachersPage.tsx (15 min)

**Archivo:** `src/pages/TeachersPage.tsx`

**REEMPLAZAR TODO el contenido:**

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
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GraduationCap, Mail, Phone, Plus, Edit, BookOpen, Award, Building2, Search } from "lucide-react"
import { TeacherDialog } from "@/components/dialogs/TeacherDialog"
import { CourseCardMini } from "@/components/ui/CourseCard"
import { teachersExpanded } from "@/data/mockData"

export function TeachersPage() {
  const [showTeacherDialog, setShowTeacherDialog] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<typeof teachersExpanded[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const handleAddTeacher = () => {
    setDialogMode('create')
    setSelectedTeacher(null)
    setShowTeacherDialog(true)
  }

  const handleEditTeacher = (teacher: typeof teachersExpanded[0]) => {
    setDialogMode('edit')
    setSelectedTeacher(teacher)
    setShowTeacherDialog(true)
  }

  // Filtrado
  const filteredTeachers = teachersExpanded.filter(teacher => {
    const matchesSearch = teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = filterDepartment === 'all' || teacher.department === filterDepartment
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && teacher.active) ||
                         (filterStatus === 'inactive' && !teacher.active)
    return matchesSearch && matchesDept && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profesores</h1>
          <p className="text-muted-foreground">
            Gestión del equipo docente de CEP Comunicación
          </p>
        </div>
        <Button onClick={handleAddTeacher}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Profesor
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                <SelectItem value="Diseño Gráfico">Diseño Gráfico</SelectItem>
                <SelectItem value="Audiovisual">Audiovisual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Profesores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={teacher.photo} alt={`${teacher.first_name} ${teacher.last_name}`} />
                    <AvatarFallback>{teacher.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {teacher.first_name} {teacher.last_name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {teacher.department}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Editar profesor"
                  onClick={() => handleEditTeacher(teacher)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Información de contacto */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Especialidades:
                </p>
                <div className="flex flex-wrap gap-1">
                  {teacher.specialties.slice(0, 3).map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {teacher.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{teacher.specialties.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Certificaciones */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  Certificaciones:
                </p>
                <div className="space-y-1">
                  {teacher.certifications.slice(0, 2).map((cert, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground">
                      <p className="font-medium">{cert.title}</p>
                      <p className="text-[10px]">{cert.institution} ({cert.year})</p>
                    </div>
                  ))}
                  {teacher.certifications.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{teacher.certifications.length - 2} más
                    </p>
                  )}
                </div>
              </div>

              {/* Sedes Asignadas */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  Sedes:
                </p>
                <div className="flex flex-wrap gap-1">
                  {teacher.campuses.map(campusId => (
                    <Badge key={campusId} variant="outline" className="text-xs">
                      {campusId === 'C001' ? 'CEP Norte' :
                       campusId === 'C002' ? 'CEP Santa Cruz' :
                       campusId === 'C003' ? 'CEP Sur' : campusId}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Biografía - SIEMPRE VISIBLE */}
              <div>
                <p className="text-xs font-medium mb-1">Biografía:</p>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {teacher.bio}
                </p>
              </div>

              {/* Cursos Asignados - EXPANDIDO CON FICHAS CLICABLES */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  Cursos asignados ({teacher.courses.length}):
                </p>
                <div className="space-y-2">
                  {teacher.courses.map(course => (
                    <CourseCardMini key={course.id} course={course} />
                  ))}
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between pt-2 border-t">
                {teacher.active ? (
                  <Badge variant="default" className="text-xs">Activo</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {teacher.courses.reduce((acc, c) => acc + c.students, 0)} alumnos totales
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{teachersExpanded.length}</p>
            <p className="text-xs text-muted-foreground">Profesores totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {teachersExpanded.filter(t => t.active).length}
            </p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {teachersExpanded.reduce((acc, t) => acc + t.courses.length, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Cursos asignados</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {Array.from(new Set(teachersExpanded.flatMap(t => t.campuses))).length}
            </p>
            <p className="text-xs text-muted-foreground">Sedes con profesores</p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Profesor */}
      <TeacherDialog
        open={showTeacherDialog}
        onOpenChange={setShowTeacherDialog}
        mode={dialogMode}
        teacher={selectedTeacher || undefined}
      />
    </div>
  )
}
```

## 📋 FASE 4: Actualizar TeacherDialog.tsx (10 min)

**Archivo:** `src/components/dialogs/TeacherDialog.tsx`

**REEMPLAZAR TODO (usar tabs con General, Certificaciones, Asignaciones):**

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash, Upload, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { EditableList } from "@/components/ui/EditableList"
import type { TeacherExpanded } from "@/data/mockData"

interface TeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  teacher?: TeacherExpanded
}

export function TeacherDialog({ open, onOpenChange, mode = 'create', teacher }: TeacherDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar el profesor' : 'Complete los campos para agregar un nuevo profesor'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="py-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
            <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={teacher?.photo} />
                <AvatarFallback>{teacher?.initials || 'NP'}</AvatarFallback>
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
                <Label htmlFor="first_name">Nombre *</Label>
                <Input
                  id="first_name"
                  placeholder="ej: María"
                  defaultValue={teacher?.first_name}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last_name">Apellidos *</Label>
                <Input
                  id="last_name"
                  placeholder="ej: García Pérez"
                  defaultValue={teacher?.last_name}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ej: profesor@cepcomunicacion.com"
                  defaultValue={teacher?.email}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  placeholder="ej: +34 612 345 678"
                  defaultValue={teacher?.phone}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="department">Departamento *</Label>
                <Select defaultValue={teacher?.department}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                    <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                    <SelectItem value="Diseño Gráfico">Diseño Gráfico</SelectItem>
                    <SelectItem value="Audiovisual">Audiovisual</SelectItem>
                    <SelectItem value="Administración">Administración</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Estado *</Label>
                <Select defaultValue={teacher?.active ? 'active' : 'inactive'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Especialidades - Lista dinámica */}
            <EditableList
              items={teacher?.specialties || []}
              label="Especialidades *"
              placeholder="ej: SEO, SEM, Analytics..."
            />

            {/* Biografía - OBLIGATORIA */}
            <div className="grid gap-2">
              <Label htmlFor="bio">Biografía * (Obligatoria)</Label>
              <Textarea
                id="bio"
                placeholder="Experiencia profesional, logros destacados, áreas de especialización..."
                rows={4}
                defaultValue={teacher?.bio}
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 100 caracteres. Incluya experiencia, logros y especialización.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Certificados y Títulos</Label>
                <Button type="button" size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Certificación
                </Button>
              </div>

              {/* Lista de certificaciones existentes */}
              {teacher?.certifications.map((cert, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">Certificación #{index + 1}</p>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2 col-span-2">
                      <Label>Título de la Certificación</Label>
                      <Input defaultValue={cert.title} placeholder="ej: Google Ads Certified" />
                    </div>

                    <div className="grid gap-2">
                      <Label>Institución</Label>
                      <Input defaultValue={cert.institution} placeholder="ej: Google" />
                    </div>

                    <div className="grid gap-2">
                      <Label>Año</Label>
                      <Input
                        type="number"
                        defaultValue={cert.year}
                        placeholder="ej: 2023"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!teacher || teacher.certifications.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No hay certificaciones registradas</p>
                  <p className="text-xs">Haga clic en "Agregar Certificación" para comenzar</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            {/* Asignación de Sedes */}
            <div className="space-y-3">
              <Label>Sedes Asignadas *</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campus-norte"
                    defaultChecked={teacher?.campuses.includes('C001')}
                  />
                  <label htmlFor="campus-norte" className="text-sm cursor-pointer">
                    CEP Norte
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campus-santa-cruz"
                    defaultChecked={teacher?.campuses.includes('C002')}
                  />
                  <label htmlFor="campus-santa-cruz" className="text-sm cursor-pointer">
                    CEP Santa Cruz
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campus-sur"
                    defaultChecked={teacher?.campuses.includes('C003')}
                  />
                  <label htmlFor="campus-sur" className="text-sm cursor-pointer">
                    CEP Sur
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campus-online"
                    defaultChecked={teacher?.campuses.includes('C004')}
                  />
                  <label htmlFor="campus-online" className="text-sm cursor-pointer">
                    CEP Online
                  </label>
                </div>
              </div>
            </div>

            {/* Asignación de Cursos */}
            <div className="space-y-3">
              <Label>Cursos Asignados</Label>
              <p className="text-xs text-muted-foreground">
                Seleccione los cursos que imparte este profesor
              </p>
              {/* Multi-select de cursos (mockup visual) */}
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {teacher?.courses.map(course => (
                  <div key={course.id} className="flex items-center space-x-2">
                    <Checkbox id={`course-${course.id}`} defaultChecked />
                    <label htmlFor={`course-${course.id}`} className="text-sm cursor-pointer flex-1">
                      {course.name} ({course.code})
                    </label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox id="course-new" />
                  <label htmlFor="course-new" className="text-sm cursor-pointer flex-1">
                    Inteligencia Artificial para Marketing (AI-MKT-2025)
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Profesor
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Profesor'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## 📋 FASE 5: Actualizar ClassroomsPages con Calendario Visual (20 min)

**Archivo:** `src/pages/ClassroomsNortePage.tsx`

**REEMPLAZAR TODO:**

```typescript
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DoorOpen, Plus, Edit, Users } from "lucide-react"
import { ClassroomDialog } from "@/components/dialogs/ClassroomDialog"
import { WeeklyCalendar } from "@/components/ui/WeeklyCalendar"
import { campusesData } from "@/data/mockData"

export function ClassroomsNortePage() {
  const [showClassroomDialog, setShowClassroomDialog] = useState(false)
  const [selectedClassroom, setSelectedClassroom] = useState<any>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  const campus = campusesData.find(c => c.code === 'NORTE')
  const classrooms = campus?.classrooms || []

  const handleAddClassroom = () => {
    setDialogMode('create')
    setSelectedClassroom(null)
    setShowClassroomDialog(true)
  }

  const handleEditClassroom = (classroom: any) => {
    setDialogMode('edit')
    setSelectedClassroom(classroom)
    setShowClassroomDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aulas CEP Norte</h1>
          <p className="text-muted-foreground">
            Gestión visual de aulas y asignación de cursos - Sede Norte
          </p>
        </div>
        <Button onClick={handleAddClassroom}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Aula
        </Button>
      </div>

      {/* Grid de Aulas */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {classrooms.map((classroom) => (
          <Card key={classroom.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5 text-primary" />
                  <CardTitle>{classroom.name}</CardTitle>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Editar aula"
                  onClick={() => handleEditClassroom(classroom)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Planta {classroom.floor} • Capacidad: {classroom.capacity} personas
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Equipamiento - Lista dinámica */}
              <div>
                <p className="text-sm font-medium mb-2">Equipamiento:</p>
                <div className="flex flex-wrap gap-1">
                  {classroom.equipment.map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-secondary px-2 py-1 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Calendario Semanal Visual */}
              <WeeklyCalendar schedule={classroom.weekly_schedule} />

              {/* Estadísticas de Ocupación */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {classroom.weekly_schedule.length} franjas ocupadas
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {((classroom.weekly_schedule.length / (5 * 3)) * 100).toFixed(0)}% ocupación
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Aula */}
      <ClassroomDialog
        open={showClassroomDialog}
        onOpenChange={setShowClassroomDialog}
        mode={dialogMode}
        classroom={selectedClassroom}
        campus="norte"
      />
    </div>
  )
}
```

**Aplicar el mismo patrón a:**
- `src/pages/ClassroomsSantaCruzPage.tsx` (cambiar `NORTE` por `SANTA-CRUZ`)
- `src/pages/ClassroomsSurPage.tsx` (cambiar `NORTE` por `SUR`)

## 📋 FASE 6: Actualizar ClassroomDialog.tsx (10 min)

**Archivo:** `src/components/dialogs/ClassroomDialog.tsx`

**REEMPLAZAR TODO (usar EditableList para equipamiento):**

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { EditableList } from "@/components/ui/EditableList"
import type { Classroom } from "@/data/mockData"

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

          {/* Equipamiento - Lista Dinámica (NO checkboxes fijos) */}
          <EditableList
            items={classroom?.equipment || []}
            label="Equipamiento *"
            placeholder="ej: Proyector 4K, Ordenadores, etc."
          />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Los horarios de las aulas se asignan automáticamente desde el sistema central.
              Puede ver la ocupación semanal en la vista de calendario.
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
```

---

## 🎯 CONTINÚA EN EL SIGUIENTE DOCUMENTO

Este prompt es DEMASIADO EXTENSO. Voy a crear un SEGUNDO documento con las fases restantes (7-12).

**IMPORTANTE:** Ejecuta este documento PRIMERO en Claude Code Web, luego te daré la PARTE 2.
