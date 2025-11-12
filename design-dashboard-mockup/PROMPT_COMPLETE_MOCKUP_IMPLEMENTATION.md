# Prompt para Implementación Completa del Mockup Visual - CEP Comunicación Dashboard

## Contexto del Proyecto

Estás trabajando en un **mockup visual completo** (NO funcional) del sistema de gestión administrativa para CEP Comunicación. Este es un proyecto de **solo diseño visual** donde los botones y modales están presentes pero sin lógica real de CRUD, validación o persistencia.

**Stack Tecnológico:**
- React 19.2.0 + TypeScript 5.9.3
- Vite 7.2.2
- TailwindCSS 3.4.18
- shadcn/ui components
- Radix UI primitives
- React Router 7.9.5
- Lucide React icons

**Ubicación del Proyecto:**
`/Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup/`

## Estado Actual

### ✅ Ya Implementado

1. **Layout Principal** (`src/layouts/DashboardLayout.tsx`)
   - Header con hamburger button (variant="outline" border-2)
   - User info: "CARLOS PÉREZ" en mayúsculas junto al icono
   - Sidebar colapsable con navegación

2. **Sidebar Navigation** (`src/layouts/AppSidebar.tsx`)
   - Menú completo con secciones y subsecciones
   - AULAS subdividido por sedes (Norte, Santa Cruz, Sur)

3. **Páginas de Aulas** (Parcialmente implementado)
   - `ClassroomsNortePage.tsx` - Grid de aulas con horarios visuales
   - `ClassroomsSantaCruzPage.tsx` - Similar al Norte
   - `ClassroomsSurPage.tsx` - Existe pero necesita actualización

4. **Diálogos Existentes**
   - `ClassroomDialog.tsx` (128 líneas) - Para crear/editar aulas
   - `TeacherDialog.tsx` (156 líneas) - Para crear/editar profesores

5. **Mock Data** (`src/data/mockData.ts` - 822 líneas)
   - 15 profesores con avatars de pravatar.cc
   - 8 miembros del personal administrativo
   - Datos de dashboard, sedes, aulas, estudiantes, leads, campañas

## 🎯 Objetivo de esta Tarea

Completar el **mockup visual** de TODAS las secciones del dashboard siguiendo un patrón consistente y corrigiendo el patrón de diálogos actual.

### Cambio Crítico de Patrón: Botón Eliminar

**❌ PATRÓN ACTUAL (INCORRECTO):**
```tsx
// Botones Edit y Delete en la tarjeta
<div className="flex items-center gap-2">
  <Button size="icon" variant="ghost" title="Editar aula">
    <Edit className="h-4 w-4" />
  </Button>
  <Button size="icon" variant="ghost" title="Eliminar aula">
    <Trash className="h-4 w-4 text-destructive" />
  </Button>
</div>
```

**✅ PATRÓN NUEVO (CORRECTO):**
```tsx
// SOLO botón Edit en la tarjeta
<Button
  size="icon"
  variant="ghost"
  title="Editar aula"
  onClick={() => {
    setSelectedItem(item)
    setShowDialog(true)
  }}
>
  <Edit className="h-4 w-4" />
</Button>

// Botón Eliminar DENTRO del DialogFooter
<DialogFooter>
  <div className="flex w-full justify-between">
    <Button
      variant="destructive"
      onClick={() => onOpenChange(false)}
    >
      <Trash className="mr-2 h-4 w-4" />
      Eliminar
    </Button>
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancelar
      </Button>
      <Button onClick={() => onOpenChange(false)}>
        Guardar Cambios
      </Button>
    </div>
  </div>
</DialogFooter>
```

## 📋 Tareas a Realizar

### Tarea 1: Corregir Patrón de Diálogos Existentes

#### 1.1. Actualizar `ClassroomDialog.tsx`
- [ ] Añadir prop `mode?: 'create' | 'edit'` para distinguir creación de edición
- [ ] Añadir prop `classroom?: Classroom` con datos del aula seleccionada
- [ ] Cambiar título dinámicamente: "Agregar Nueva Aula" vs "Editar Aula"
- [ ] Incluir botón "Eliminar Aula" en DialogFooter (solo visible en modo edit)
- [ ] Pre-rellenar campos con datos del aula en modo edit

**Estructura del DialogFooter:**
```tsx
<DialogFooter>
  <div className="flex w-full justify-between">
    {mode === 'edit' && (
      <Button variant="destructive" onClick={() => onOpenChange(false)}>
        <Trash className="mr-2 h-4 w-4" />
        Eliminar Aula
      </Button>
    )}
    <div className={cn("flex gap-2", mode === 'create' && 'w-full justify-end')}>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancelar
      </Button>
      <Button onClick={() => onOpenChange(false)}>
        {mode === 'edit' ? 'Guardar Cambios' : 'Crear Aula'}
      </Button>
    </div>
  </div>
</DialogFooter>
```

#### 1.2. Actualizar `ClassroomsNortePage.tsx`, `ClassroomsSantaCruzPage.tsx`, `ClassroomsSurPage.tsx`
- [ ] Eliminar botón Delete de las tarjetas
- [ ] Añadir estado `const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)`
- [ ] Añadir estado `const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')`
- [ ] onClick del botón Edit: `setSelectedClassroom(classroom); setDialogMode('edit'); setShowDialog(true)`
- [ ] onClick del botón "Agregar Aula": `setDialogMode('create'); setSelectedClassroom(null); setShowDialog(true)`
- [ ] Pasar props al dialog: `mode={dialogMode} classroom={selectedClassroom}`

### Tarea 2: Implementar Mockup Visual de Secciones Restantes

#### 2.1. Profesores (TeachersPage.tsx) - YA TIENE DIALOG

**Actualizar:**
- [ ] Aplicar patrón correcto al `TeacherDialog.tsx` (eliminar dentro del modal)
- [ ] Página con grid responsive (1 col móvil → 2 col tablet → 3 col desktop)
- [ ] Cards con avatar grande, nombre, especialidades, cursos asignados
- [ ] Botón "Agregar Profesor" en header
- [ ] Solo botón Edit en cada card
- [ ] Badge de estado activo/inactivo

**Mock Data Required:**
```typescript
interface Teacher {
  id: string
  first_name: string
  last_name: string
  initials: string
  email: string
  phone: string
  photo: string // pravatar.cc
  department: string
  specialties: string[]
  bio: string
  active: boolean
  courses_count: number
}
```

#### 2.2. Alumnos (StudentsPage.tsx)

**Crear desde cero:**
- [ ] Tabla con paginación visual (no funcional)
- [ ] Columnas: Avatar, Nombre Completo, Email, Teléfono, Cursos Inscritos, Estado, Acciones
- [ ] Filtros en header: búsqueda, filtro por estado, filtro por curso
- [ ] Botón "Agregar Alumno" en header
- [ ] Solo botón Edit en columna Acciones (ícono)
- [ ] Dialog `StudentDialog.tsx` con botón eliminar dentro

**Mock Data Required:**
```typescript
interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  dni: string
  date_of_birth: string
  address: string
  city: string
  postal_code: string
  emergency_contact: string
  emergency_phone: string
  enrolled_courses: string[] // course IDs
  status: 'active' | 'inactive' | 'graduated'
}
```

**Componentes a crear:**
- `src/pages/StudentsPage.tsx`
- `src/components/dialogs/StudentDialog.tsx`
- `src/components/ui/table.tsx` (usar shadcn: `npx shadcn@latest add table`)

#### 2.3. Personal Administrativo (AdministrativePage.tsx)

**Crear desde cero:**
- [ ] Similar a TeachersPage pero adaptado para staff administrativo
- [ ] Grid responsive con cards
- [ ] Avatar, nombre, puesto, departamento, extensión, email
- [ ] Botón "Agregar Personal" en header
- [ ] Solo botón Edit en cada card
- [ ] Dialog `AdministrativeDialog.tsx` con botón eliminar dentro

**Mock Data Required:**
```typescript
interface AdministrativeStaff {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  photo: string
  position: string
  department: string
  extension: string
  active: boolean
}
```

**Componentes a crear:**
- `src/pages/AdministrativePage.tsx`
- `src/components/dialogs/AdministrativeDialog.tsx`

#### 2.4. Sedes (CampusPage.tsx)

**Crear desde cero:**
- [ ] Cards grandes con imagen de la sede (banner superior)
- [ ] Información: nombre, dirección, teléfono, email, responsable
- [ ] Lista de aulas disponibles en esa sede
- [ ] Horario de atención
- [ ] Mapa estático (imagen placeholder o iframe Google Maps)
- [ ] Botón "Agregar Sede" en header
- [ ] Solo botón Edit en cada card
- [ ] Dialog `CampusDialog.tsx` con upload de imagen y botón eliminar dentro

**Mock Data Required:**
```typescript
interface Campus {
  id: string
  name: string
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
  manager_name: string
  manager_email: string
  opening_hours: string
  image_url: string // Placeholder o real
  classrooms_count: number
  active: boolean
}
```

**Componentes a crear:**
- `src/pages/CampusPage.tsx`
- `src/components/dialogs/CampusDialog.tsx`

#### 2.5. Ciclos (CyclesPage.tsx)

**Crear desde cero:**
- [ ] Accordion/collapsible structure (usar shadcn: `npx shadcn@latest add accordion`)
- [ ] Cada ciclo expandible muestra: nivel, duración, requisitos, cursos asociados
- [ ] Badge de nivel (Grado Medio, Grado Superior)
- [ ] Contador de cursos asociados
- [ ] Botón "Agregar Ciclo" en header
- [ ] Solo botón Edit en header de cada accordion item
- [ ] Dialog `CycleDialog.tsx` con botón eliminar dentro

**Mock Data Required:**
```typescript
interface Cycle {
  id: string
  name: string
  code: string
  level: 'grado-medio' | 'grado-superior'
  duration_hours: number
  requirements: string[]
  description: string
  courses: string[] // course IDs
  active: boolean
}
```

**Componentes a crear:**
- `src/pages/CyclesPage.tsx`
- `src/components/dialogs/CycleDialog.tsx`
- `npx shadcn@latest add accordion`

#### 2.6. Cursos (CoursesPage.tsx)

**Crear desde cero:**
- [ ] Grid responsive de cards (1 col → 2 col → 3 col)
- [ ] Cada card: nombre, tipo, modalidad, ciclo, duración, precio, plazas, badge estado
- [ ] Filtros en header: por tipo, modalidad, ciclo, estado
- [ ] Búsqueda por nombre
- [ ] Botón "Agregar Curso" en header
- [ ] Solo botón Edit en cada card
- [ ] Dialog `CourseDialog.tsx` completo con tabs (Información General, Contenido, Precios, Plazas)
- [ ] Botón eliminar dentro del dialog

**Mock Data Required:**
```typescript
interface Course {
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
  description: string
  objectives: string[]
  requirements: string[]
  status: 'draft' | 'published' | 'archived'
  featured: boolean
}
```

**Componentes a crear:**
- `src/pages/CoursesPage.tsx`
- `src/components/dialogs/CourseDialog.tsx`
- `npx shadcn@latest add tabs`

#### 2.7. Campañas (CampaignsPage.tsx)

**Crear desde cero:**
- [ ] Tabla con columnas: Nombre, Tipo, Estado, Fecha Inicio, Fecha Fin, Presupuesto, Leads, Conversiones, ROI
- [ ] Filtros: por tipo, estado, rango de fechas
- [ ] Badges de estado (activa, pausada, completada, borrador)
- [ ] Indicadores visuales de ROI (positivo/negativo)
- [ ] Botón "Crear Campaña" en header
- [ ] Solo botón Edit en columna Acciones
- [ ] Dialog `CampaignDialog.tsx` con tabs (Información, Objetivos, Presupuesto, UTM)
- [ ] Botón eliminar dentro del dialog

**Mock Data Required:**
```typescript
interface Campaign {
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
}
```

**Componentes a crear:**
- `src/pages/CampaignsPage.tsx`
- `src/components/dialogs/CampaignDialog.tsx`

#### 2.8. Configuración (SettingsPage.tsx)

**Crear desde cero:**
- [ ] Tabs para diferentes secciones de configuración
- [ ] Tab "General": nombre de la organización, logo, colores
- [ ] Tab "Notificaciones": checkboxes para tipos de notificaciones
- [ ] Tab "Seguridad": cambio de contraseña, 2FA (visual)
- [ ] Tab "Integraciones": conexiones con Meta Ads, Mailchimp, WhatsApp
- [ ] Tab "Usuarios y Roles": tabla de usuarios con roles asignados
- [ ] Botón "Guardar Cambios" en cada tab (no funcional)

**Componentes a crear:**
- `src/pages/SettingsPage.tsx`

#### 2.9. Perfil de Usuario (UserProfilePage.tsx)

**Crear desde cero:**
- [ ] Sección superior: Avatar grande, nombre, email, rol
- [ ] Botón "Cambiar Foto" (no funcional)
- [ ] Formulario: nombre, apellidos, email, teléfono, departamento
- [ ] Sección "Cambiar Contraseña" con campos visuales
- [ ] Sección "Preferencias": idioma, zona horaria, notificaciones
- [ ] Botón "Guardar Cambios" (no funcional)

**Mock Data Required:**
```typescript
interface UserProfile {
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
}
```

**Componentes a crear:**
- `src/pages/UserProfilePage.tsx`

### Tarea 3: Actualizar Mock Data

Expandir `src/data/mockData.ts` con datos para todas las secciones nuevas:

- [ ] Añadir 20+ estudiantes
- [ ] Añadir 5+ ciclos formativos
- [ ] Añadir 15+ cursos variados
- [ ] Añadir 8+ campañas con métricas
- [ ] Añadir perfil de usuario actual

### Tarea 4: Actualizar Rutas en App.tsx

```typescript
<Route path="profesores" element={<TeachersPage />} />
<Route path="alumnos" element={<StudentsPage />} />
<Route path="personal" element={<AdministrativePage />} />
<Route path="sedes" element={<CampusPage />} />
<Route path="ciclos" element={<CyclesPage />} />
<Route path="cursos" element={<CoursesPage />} />
<Route path="campanas" element={<CampaignsPage />} />
<Route path="configuracion" element={<SettingsPage />} />
<Route path="perfil" element={<UserProfilePage />} />
```

### Tarea 5: Dejar Sin Implementar

Estas páginas deben quedar como placeholders simples:

- [ ] `ProgramacionPage.tsx` - Solo título y mensaje "Próximamente"
- [ ] `PlannerVisualPage.tsx` - Solo título y mensaje "Próximamente"

## 🎨 Guía de Estilo Visual

### Paleta de Colores (TailwindCSS)
- **Primary**: `bg-primary text-primary-foreground` (azul CEP)
- **Secondary**: `bg-secondary text-secondary-foreground` (gris claro)
- **Destructive**: `bg-destructive text-destructive-foreground` (rojo para eliminar)
- **Muted**: `bg-muted text-muted-foreground` (gris suave)

### Badges de Estado
```tsx
// Activo/Publicado
<Badge variant="default">Activo</Badge>

// Inactivo/Borrador
<Badge variant="secondary">Inactivo</Badge>

// Advertencia
<Badge variant="outline" className="border-yellow-500 text-yellow-600">En Espera</Badge>

// Eliminado/Archivado
<Badge variant="destructive">Archivado</Badge>
```

### Espaciado Consistente
```tsx
// Contenedor principal
<div className="space-y-6">

// Grid responsive
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

// Header con botón
<div className="flex items-center justify-between">
```

### Iconos (Lucide React)
```typescript
import {
  Users,           // Alumnos, Personal
  GraduationCap,   // Profesores, Cursos
  Building2,       // Sedes
  Book,            // Ciclos
  TrendingUp,      // Campañas
  Settings,        // Configuración
  User,            // Perfil
  DoorOpen,        // Aulas
  Edit,            // Editar
  Trash,           // Eliminar
  Plus,            // Agregar
  Search,          // Búsqueda
  Filter,          // Filtros
} from "lucide-react"
```

## 📊 Mock Data Patterns

### Avatars con pravatar.cc
```typescript
photo: `https://i.pravatar.cc/150?img=${id}`
```

### Fechas Mock
```typescript
start_date: "2025-02-01"
end_date: "2025-06-30"
```

### Emails Mock
```typescript
email: `${first_name.toLowerCase()}.${last_name.toLowerCase()}@cepcomunicacion.com`
```

## ⚠️ Importante: Mockup Visual SOLAMENTE

**NO implementar:**
- ❌ Validación de formularios
- ❌ Persistencia de datos (localStorage, API)
- ❌ Lógica de eliminación real
- ❌ Paginación funcional
- ❌ Filtros funcionales
- ❌ Búsqueda funcional
- ❌ Autenticación

**SÍ implementar:**
- ✅ Botones que abren/cierran modales
- ✅ Estados visuales (hover, active, disabled)
- ✅ Animaciones de TailwindCSS
- ✅ Responsive design completo
- ✅ Accesibilidad básica (labels, alt texts)

## 📦 Shadcn Components Necesarios

Instalar con `npx shadcn@latest add [component]`:

```bash
npx shadcn@latest add table
npx shadcn@latest add accordion
npx shadcn@latest add tabs
```

## ✅ Criterios de Aceptación

1. **Todas las secciones implementadas** excepto Programación y Planner Visual
2. **Patrón consistente** de diálogos con botón eliminar dentro
3. **Mock data completo** en `mockData.ts` para todas las entidades
4. **Responsive design** funcionando en móvil, tablet, desktop
5. **Rutas configuradas** en `App.tsx`
6. **Sin errores** en consola del navegador
7. **Dev server** corriendo sin warnings

## 🕒 Estimación de Tiempo

**Total: 6-8 horas**

- Tarea 1 (Corrección patrón): 1 hora
- Tarea 2.1 (Profesores): 30 min
- Tarea 2.2 (Alumnos): 1.5 horas
- Tarea 2.3 (Personal Admin): 45 min
- Tarea 2.4 (Sedes): 1 hora
- Tarea 2.5 (Ciclos): 1 hora
- Tarea 2.6 (Cursos): 1.5 horas
- Tarea 2.7 (Campañas): 1 hora
- Tarea 2.8 (Configuración): 45 min
- Tarea 2.9 (Perfil): 30 min
- Tarea 3 (Mock data): 30 min

## 🚀 Orden de Ejecución Sugerido

1. Corregir `ClassroomDialog.tsx` y las 3 páginas de aulas (validar patrón)
2. Actualizar `TeacherDialog.tsx` y `TeachersPage.tsx` (ya existe, solo corregir)
3. Implementar Alumnos (tabla compleja)
4. Implementar Personal Administrativo (similar a profesores)
5. Implementar Sedes (cards grandes)
6. Implementar Ciclos (accordion)
7. Implementar Cursos (grid con filtros)
8. Implementar Campañas (tabla con métricas)
9. Implementar Configuración (tabs)
10. Implementar Perfil de Usuario
11. Expandir mock data
12. Verificación final responsive

## 📝 Checklist Final

- [ ] Todas las páginas creadas
- [ ] Todos los diálogos con patrón correcto
- [ ] Mock data completo
- [ ] Rutas configuradas
- [ ] Responsive verificado
- [ ] Sin errores en consola
- [ ] Dev server funcionando
- [ ] Git commit con mensaje descriptivo

---

**Creado para:** Claude Code Web
**Proyecto:** CEP Comunicación Dashboard Mockup
**Versión:** 1.0
**Fecha:** 2025-11-11
