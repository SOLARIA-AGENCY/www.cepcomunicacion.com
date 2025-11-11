# 🎯 PROMPT DE DESARROLLO: Dashboard Admin CEP - Mockup Funcional Completo

## 📋 Contexto del Proyecto

El dashboard admin de CEP Comunicación ya tiene la estructura base implementada con React + TypeScript + Vite + shadcn/ui. El código está en el repositorio remoto (commit `0047cec`).

**Ubicación:** `design-dashboard-mockup/cep-admin-mockup/`

## 🎯 Objetivo

Transformar el mockup actual en un **dashboard completamente funcional** con operaciones CRUD completas, incluyendo:

- ✅ Crear, editar y eliminar registros
- ✅ Subida de imágenes/fotografías
- ✅ Modales de edición con formularios validados
- ✅ Gestión completa de usuarios y configuración
- ✅ Todas las páginas funcionales (no solo placeholders)

## 🏗️ Arquitectura de Referencia

Basado en análisis de dashboards SaaS modernos 2024-2025, implementar:

### Patrones de Diseño
1. **CRUD Operations**: Dialogs modales para crear/editar, confirmación para eliminar
2. **Form Validation**: React Hook Form + Zod schemas
3. **Image Upload**: Drag-and-drop con preview (react-dropzone + local storage mockup)
4. **State Management**: React Context para gestión global de datos
5. **Responsive Design**: Mobile-first con Tailwind breakpoints
6. **User Feedback**: Toast notifications, loading states, error handling

### Componentes shadcn/ui Adicionales Necesarios
```bash
npx shadcn@latest add form
npx shadcn@latest add toast
npx shadcn@latest add alert-dialog
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add label
npx shadcn@latest add avatar
npx shadcn@latest add tabs
npx shadcn@latest add switch
```

## 📦 Estructura de Datos Mock

Crear contextos React para gestionar datos en memoria (sin backend):

```typescript
// src/contexts/DataContext.tsx
interface DataContextType {
  // Aulas
  classrooms: Classroom[]
  addClassroom: (classroom: Classroom) => void
  updateClassroom: (id: string, classroom: Partial<Classroom>) => void
  deleteClassroom: (id: string) => void

  // Profesores
  teachers: Teacher[]
  addTeacher: (teacher: Teacher) => void
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void
  deleteTeacher: (id: string) => void

  // Alumnos
  students: Student[]
  addStudent: (student: Student) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void

  // Personal Administrativo
  staff: Staff[]
  addStaff: (staff: Staff) => void
  updateStaff: (id: string, staff: Partial<Staff>) => void
  deleteStaff: (id: string) => void

  // Sedes
  campuses: Campus[]
  addCampus: (campus: Campus) => void
  updateCampus: (id: string, campus: Partial<Campus>) => void
  deleteCampus: (id: string) => void

  // Ciclos
  cycles: Cycle[]
  addCycle: (cycle: Cycle) => void
  updateCycle: (id: string, cycle: Partial<Cycle>) => void
  deleteCycle: (id: string) => void

  // Cursos
  courses: Course[]
  addCourse: (course: Course) => void
  updateCourse: (id: string, course: Partial<Course>) => void
  deleteCourse: (id: string) => void

  // Campañas
  campaigns: Campaign[]
  addCampaign: (campaign: Campaign) => void
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void
  deleteCampaign: (id: string) => void
}
```

## 🎨 Implementación por Módulo

### 1. AULAS (CEP Norte, Santa Cruz, Sur)

**Archivos a modificar:**
- `src/pages/ClassroomsNortePage.tsx`
- `src/pages/ClassroomsSantaCruzPage.tsx`
- `src/pages/ClassroomsSurPage.tsx`

**Funcionalidades:**

#### 1.1 Botón "Agregar Aula Nueva"
- Ubicación: Top-right del header de página
- Abre Dialog modal con formulario

**Formulario:**
```typescript
interface ClassroomForm {
  name: string          // ej: "Aula A1"
  capacity: number      // ej: 25
  floor: number         // ej: 1
  equipment: string[]   // Multi-select: Proyector, Ordenadores, etc.
  campus_id: string     // Select: CEP Norte, Santa Cruz, Sur
}
```

#### 1.2 Botón "Editar" en cada card
- Icono de lápiz (Edit icon) en top-right de cada card
- Abre mismo Dialog con datos prellenados
- Permite modificar todos los campos

#### 1.3 Botón "Eliminar" en cada card
- Icono de papelera (Trash icon) dentro del card
- Abre AlertDialog de confirmación
- Mensaje: "¿Está seguro de eliminar el aula {name}? Esta acción no se puede deshacer."
- Botones: "Cancelar" y "Eliminar" (destructive variant)

#### 1.4 Gestión de Horarios
- **NO editable** en mockup (dato automático del CMS)
- Mostrar solo como read-only con nota: "Los horarios se asignan automáticamente desde el sistema central"

**Validaciones:**
- Nombre: requerido, 2-50 caracteres
- Capacidad: requerido, número 1-100
- Piso: requerido, número 1-10
- Equipamiento: al menos 1 seleccionado
- Sede: requerido

---

### 2. PROFESORES

**Archivo:** `src/pages/TeachersPage.tsx`

**Layout:**
- Grid de cards con foto, nombre, especialidades
- Botón "Agregar Profesor" (top-right)

**Card de Profesor:**
```tsx
<Card>
  <Avatar>
    <AvatarImage src={teacher.photo} />
    <AvatarFallback>{teacher.initials}</AvatarFallback>
  </Avatar>

  <CardHeader>
    <div className="flex justify-between">
      <CardTitle>{teacher.name}</CardTitle>
      <div className="flex gap-2">
        <Button size="icon" variant="ghost" onClick={handleEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  </CardHeader>

  <CardContent>
    <Badge>{teacher.department}</Badge>
    <p>Email: {teacher.email}</p>
    <p>Teléfono: {teacher.phone}</p>
    <div className="mt-2">
      <p className="text-sm font-medium">Especialidades:</p>
      {teacher.specialties.map(s => <Badge variant="outline">{s}</Badge>)}
    </div>
  </CardContent>
</Card>
```

**Formulario:**
```typescript
interface TeacherForm {
  name: string
  email: string
  phone: string
  photo: File | null         // Image upload
  department: string         // Select: Marketing, Diseño, Desarrollo, etc.
  specialties: string[]      // Multi-select
  bio: string                // Textarea (opcional)
  active: boolean            // Switch
}
```

**Image Upload:**
- Drag-and-drop area con react-dropzone
- Preview inmediato de la imagen
- Tamaño máximo: 2MB
- Formatos aceptados: JPG, PNG, WebP
- Guardado en base64 en memoria (mockup)

**Validaciones:**
- Nombre: requerido, 2-100 caracteres
- Email: requerido, formato email válido
- Teléfono: requerido, formato español +34 XXX XXX XXX
- Departamento: requerido
- Especialidades: al menos 1 seleccionada
- Foto: opcional pero recomendada

---

### 3. PERSONAL ADMINISTRATIVO

**Archivo:** `src/pages/AdministrativePage.tsx` (crear nuevo)

**Estructura:** Similar a profesores

**Roles disponibles:**
- Director/a
- Coordinador/a Académico
- Secretario/a
- Administrativo/a
- Recepcionista
- Mantenimiento

**Formulario:**
```typescript
interface StaffForm {
  name: string
  email: string
  phone: string
  photo: File | null
  role: string              // Select: roles arriba
  campus_id: string         // Select: sedes
  hire_date: Date           // DatePicker
  active: boolean
}
```

---

### 4. ALUMNOS

**Archivo:** `src/pages/StudentsPage.tsx`

**Vista:** Tabla con filtros y búsqueda

**Tabla Columns:**
- Foto (Avatar)
- Nombre completo
- Email
- Teléfono
- Ciclo/Curso inscrito
- Sede
- Estado (Activo/Inactivo/Graduado)
- Acciones (Editar/Eliminar)

**Formulario:**
```typescript
interface StudentForm {
  name: string
  email: string
  phone: string
  photo: File | null
  dni: string
  birth_date: Date
  address: string
  city: string
  postal_code: string
  enrolled_courses: string[]  // Multi-select de cursos
  campus_id: string
  emergency_contact: {
    name: string
    phone: string
    relationship: string
  }
  status: 'active' | 'inactive' | 'graduated'
}
```

**Filtros:**
- Por sede
- Por curso
- Por estado
- Búsqueda por nombre/email

---

### 5. SEDES

**Archivo:** `src/pages/CampusPage.tsx`

**Vista:** Grid de cards grandes con foto de la sede

**Card de Sede:**
```tsx
<Card>
  <div className="relative h-48 w-full">
    <img src={campus.photo} className="object-cover rounded-t-lg" />
    <div className="absolute top-2 right-2 flex gap-2">
      <Button size="icon" variant="secondary" onClick={handleEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive" onClick={handleDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  </div>

  <CardHeader>
    <CardTitle>{campus.name}</CardTitle>
    <CardDescription>{campus.address}</CardDescription>
  </CardHeader>

  <CardContent>
    <div className="space-y-2">
      <p><Phone className="inline h-4 w-4" /> {campus.phone}</p>
      <p><Mail className="inline h-4 w-4" /> {campus.email}</p>
      <p><MapPin className="inline h-4 w-4" /> {campus.city}</p>

      <div className="mt-4">
        <p className="text-sm font-medium">Capacidad:</p>
        <p className="text-2xl font-bold">{campus.total_classrooms} aulas</p>
        <p className="text-sm text-muted-foreground">
          {campus.total_capacity} estudiantes
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

**Formulario:**
```typescript
interface CampusForm {
  name: string              // ej: "CEP Norte"
  photo: File | null        // Foto de la sede
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
  total_classrooms: number
  total_capacity: number
  facilities: string[]      // Multi-select: Biblioteca, Cafetería, etc.
  opening_hours: string     // Textarea
  map_url: string          // Google Maps embed URL
}
```

---

### 6. CICLOS

**Archivo:** `src/pages/CyclesPage.tsx` (crear nuevo)

**Vista:** Lista con accordion para Ciclo Medio y Ciclo Superior

**Cada ciclo muestra:**
- Nombre del ciclo
- Duración (horas)
- Cursos incluidos
- Requisitos de acceso
- Salidas profesionales

**Formulario:**
```typescript
interface CycleForm {
  name: string
  type: 'medio' | 'superior'
  duration_hours: number
  description: string        // Textarea
  requirements: string[]     // Multi-input
  career_paths: string[]     // Multi-input
  courses: string[]          // Multi-select de cursos
  active: boolean
}
```

---

### 7. CURSOS

**Archivo:** `src/pages/CoursesPage.tsx`

**Vista:** Grid con filtros por tipo

**Card de Curso:**
```tsx
<Card>
  <Badge>{course.type}</Badge>
  <CardHeader>
    <div className="flex justify-between">
      <CardTitle>{course.name}</CardTitle>
      <div className="flex gap-2">
        <Button size="icon" variant="ghost" onClick={handleEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  </CardHeader>

  <CardContent>
    <p className="text-sm">{course.description}</p>
    <div className="mt-4 space-y-2">
      <p><Clock /> {course.hours} horas</p>
      <p><Users /> {course.modality}</p>
      <p><Euro /> {course.price}€</p>
    </div>
  </CardContent>
</Card>
```

**Formulario:**
```typescript
interface CourseForm {
  name: string
  description: string
  type: 'telematico' | 'ocupados' | 'desempleados' | 'privados' | 'ciclo-medio' | 'ciclo-superior'
  modality: 'presencial' | 'semipresencial' | 'telematico'
  hours: number
  price: number
  cycle_id?: string         // Si es de ciclo
  teacher_ids: string[]     // Multi-select profesores
  requirements: string[]
  syllabus: string          // Textarea
  active: boolean
}
```

---

### 8. CAMPAÑAS DE MARKETING

**Archivo:** `src/pages/CampaignsPage.tsx` (crear nuevo dentro de Marketing)

**Vista:** Tabla con métricas

**Formulario:**
```typescript
interface CampaignForm {
  name: string
  type: 'email' | 'social' | 'paid_ads' | 'organic' | 'event'
  budget: number
  start_date: Date
  end_date: Date
  target_courses: string[]   // Multi-select
  description: string
  status: 'draft' | 'active' | 'paused' | 'completed'
}
```

---

### 9. LEADS (READ-ONLY)

**Archivo:** `src/pages/LeadsPage.tsx`

**Vista:** Tabla con filtros

**Funcionalidades:**
- ❌ NO editable
- ❌ NO eliminable
- ✅ Exportar a CSV
- ✅ Filtrar por fecha, curso, campaña
- ✅ Ver detalle en modal (read-only)

**Nota en UI:**
```tsx
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Información Automática</AlertTitle>
  <AlertDescription>
    Los leads se capturan automáticamente desde formularios web y campañas de marketing.
    No pueden editarse manualmente para mantener la integridad de los datos.
  </AlertDescription>
</Alert>
```

---

### 10. CONFIGURACIÓN

**Archivo:** `src/pages/SettingsPage.tsx` (crear nuevo)

**Tabs:**

#### 10.1 Configuración General
- Nombre de la organización
- Logo (upload)
- Colores corporativos (color pickers)
- Idioma por defecto
- Zona horaria
- Formato de fecha

#### 10.2 Notificaciones
- Email notifications (switches)
- Push notifications (switches)
- Frecuencia de reportes

#### 10.3 Seguridad
- Cambiar contraseña
- Autenticación de dos factores (toggle)
- Sesiones activas
- Registro de actividad

#### 10.4 Integrations (Mockup)
- Meta Ads (conectado/desconectado)
- Mailchimp (conectado/desconectado)
- WhatsApp Cloud API (conectado/desconectado)
- Google Analytics (conectado/desconectado)

---

### 11. PERFIL DE USUARIO

**Archivo:** `src/pages/UserProfilePage.tsx` (crear nuevo)

**Secciones:**

#### 11.1 Información Personal
```typescript
interface UserProfile {
  name: string
  email: string
  phone: string
  photo: File | null
  role: 'admin' | 'gestor' | 'marketing' | 'asesor' | 'lectura'
  department: string
  bio: string
}
```

#### 11.2 Preferencias
- Tema (light/dark/system)
- Idioma
- Notificaciones por email
- Dashboard por defecto (al hacer login)

#### 11.3 Seguridad
- Cambiar contraseña
- Sesiones activas
- Actividad reciente

---

## 🧩 Componentes Reutilizables a Crear

### 1. ImageUploader Component
```tsx
// src/components/shared/ImageUploader.tsx
interface ImageUploaderProps {
  value?: string          // URL o base64
  onChange: (file: File) => void
  maxSize?: number        // MB
  aspectRatio?: string    // ej: "1:1", "16:9"
}
```

**Características:**
- Drag and drop zone
- Click to select file
- Preview de imagen
- Validación de tamaño y formato
- Botón para eliminar imagen
- Crop opcional

### 2. ConfirmDialog Component
```tsx
// src/components/shared/ConfirmDialog.tsx
interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'destructive'
}
```

### 3. DataTable Component
```tsx
// src/components/shared/DataTable.tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  searchable?: boolean
  searchPlaceholder?: string
  filters?: FilterConfig[]
  pagination?: boolean
  pageSize?: number
}
```

### 4. FormDialog Component
```tsx
// src/components/shared/FormDialog.tsx
interface FormDialogProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  onSubmit: (data: any) => void
  children: React.ReactNode
  submitLabel?: string
}
```

---

## 🔐 Sistema de Roles (Mockup)

Implementar control de acceso basado en roles para el mockup:

```typescript
// src/contexts/AuthContext.tsx
interface User {
  id: string
  name: string
  email: string
  photo?: string
  role: 'admin' | 'gestor' | 'marketing' | 'asesor' | 'lectura'
}

const ROLE_PERMISSIONS = {
  admin: ['*'], // Todo
  gestor: ['create', 'read', 'update', 'delete'],
  marketing: ['create', 'read', 'update'], // Solo campañas y contenido
  asesor: ['read', 'update'], // Solo leads y alumnos
  lectura: ['read'] // Solo lectura
}
```

**Implementar:**
- Login page mockup (email + password, sin validación real)
- Logout functionality
- Mock user guardado en localStorage
- Botones/acciones deshabilitadas según rol

---

## 📊 Toast Notifications

Implementar feedback visual para todas las acciones:

```tsx
import { useToast } from "@/components/ui/use-toast"

// Ejemplos
toast({
  title: "Aula creada",
  description: "El aula A1 se ha creado correctamente.",
})

toast({
  title: "Error",
  description: "No se pudo eliminar el profesor. Intente nuevamente.",
  variant: "destructive",
})

toast({
  title: "Cambios guardados",
  description: "Los cambios se han guardado correctamente.",
})
```

---

## 🎨 Estados de Carga

Implementar estados de loading para mejor UX:

```tsx
// En formularios
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Guardar Cambios
</Button>

// En cards
{isLoading ? (
  <Skeleton className="h-48 w-full" />
) : (
  <Card>...</Card>
)}
```

---

## 📱 Responsive Design

Todas las páginas deben ser completamente responsive:

- **Mobile (< 768px):** Layout vertical, sidebar como drawer, tablas como cards
- **Tablet (768px - 1024px):** Grid 2 columnas, sidebar colapsado por defecto
- **Desktop (> 1024px):** Grid 3 columnas, sidebar expandido

---

## 🧪 Datos de Prueba

Generar datos mock realistas para todas las entidades:

- 12 aulas (4 por sede)
- 15 profesores
- 8 personal administrativo
- 50 alumnos
- 3 sedes
- 4 ciclos (2 medio, 2 superior)
- 25 cursos
- 100 leads
- 10 campañas

---

## 📦 Estructura de Carpetas Final

```
src/
├── components/
│   ├── ui/              # shadcn components
│   └── shared/          # Componentes reutilizables custom
│       ├── ImageUploader.tsx
│       ├── ConfirmDialog.tsx
│       ├── DataTable.tsx
│       ├── FormDialog.tsx
│       └── LoadingState.tsx
├── contexts/
│   ├── ThemeContext.tsx
│   ├── DataContext.tsx
│   └── AuthContext.tsx
├── layouts/
│   ├── DashboardLayout.tsx
│   └── AppSidebar.tsx
├── pages/
│   ├── DashboardPage.tsx
│   ├── classrooms/
│   │   ├── ClassroomsNortePage.tsx
│   │   ├── ClassroomsSantaCruzPage.tsx
│   │   └── ClassroomsSurPage.tsx
│   ├── teachers/
│   │   └── TeachersPage.tsx
│   ├── staff/
│   │   └── AdministrativePage.tsx
│   ├── students/
│   │   └── StudentsPage.tsx
│   ├── campuses/
│   │   └── CampusPage.tsx
│   ├── cycles/
│   │   └── CyclesPage.tsx
│   ├── courses/
│   │   ├── CoursesPage.tsx
│   │   ├── ProgrammingPage.tsx
│   │   └── PlannerPage.tsx
│   ├── leads/
│   │   └── LeadsPage.tsx
│   ├── marketing/
│   │   └── CampaignsPage.tsx
│   ├── content/
│   │   ├── PagesPage.tsx
│   │   ├── BlogPage.tsx
│   │   └── FAQsPage.tsx
│   ├── analytics/
│   │   └── AnalyticsPage.tsx
│   ├── settings/
│   │   └── SettingsPage.tsx
│   └── auth/
│       ├── LoginPage.tsx
│       └── UserProfilePage.tsx
├── lib/
│   ├── utils.ts
│   ├── validations.ts   # Zod schemas
│   └── mock-data.ts     # Generadores de datos
├── types/
│   └── index.ts
└── hooks/
    ├── use-mobile.ts
    └── use-data.ts      # Hook para DataContext
```

---

## ✅ Checklist de Implementación

### Fase 1: Infraestructura
- [ ] Instalar componentes shadcn/ui adicionales
- [ ] Crear DataContext con CRUD operations
- [ ] Crear AuthContext con mock user
- [ ] Crear componentes shared reutilizables
- [ ] Configurar react-hook-form + zod

### Fase 2: CRUD de Aulas
- [ ] ClassroomsNortePage con botones Create/Edit/Delete
- [ ] ClassroomsSantaCruzPage con botones Create/Edit/Delete
- [ ] ClassroomsSurPage con botones Create/Edit/Delete
- [ ] Dialog con formulario de aula
- [ ] Validaciones con Zod
- [ ] Toast notifications

### Fase 3: CRUD de Personal
- [ ] TeachersPage completa con foto upload
- [ ] AdministrativePage completa con foto upload
- [ ] StudentsPage completa con foto upload y tabla
- [ ] ImageUploader component
- [ ] Filtros y búsqueda en tabla de alumnos

### Fase 4: CRUD de Configuración
- [ ] CampusPage con cards y foto upload
- [ ] CyclesPage con accordion y formularios
- [ ] CoursesPage con grid y filtros
- [ ] CampaignsPage con tabla de métricas

### Fase 5: Páginas de Sistema
- [ ] SettingsPage con tabs
- [ ] UserProfilePage con edición de perfil
- [ ] LoginPage mockup
- [ ] Control de permisos por rol

### Fase 6: Mejoras UX
- [ ] Estados de loading en todos los formularios
- [ ] Responsive design verificado en mobile/tablet/desktop
- [ ] Toast notifications en todas las acciones
- [ ] Confirmaciones para acciones destructivas
- [ ] Validaciones visuales en formularios

### Fase 7: Datos Mock
- [ ] Generar 50+ alumnos
- [ ] Generar 15 profesores con fotos
- [ ] Generar 100 leads
- [ ] Generar 25 cursos variados
- [ ] Generar 10 campañas con métricas

---

## 🚀 Instrucciones de Ejecución

```bash
# 1. Clonar repositorio
git clone https://github.com/SOLARIA-AGENCY/www.cepcomunicacion.com.git
cd www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup

# 2. Instalar dependencias
pnpm install

# 3. Instalar componentes shadcn/ui adicionales
npx shadcn@latest add form toast alert-dialog textarea select checkbox label avatar tabs switch

# 4. Instalar dependencias adicionales
pnpm add react-hook-form @hookform/resolvers zod react-dropzone date-fns

# 5. Ejecutar desarrollo
pnpm dev

# 6. Abrir navegador
# http://localhost:5173
```

---

## 📝 Notas Importantes

1. **No Backend:** Este es un mockup funcional. Todos los datos se guardan en memoria (React Context + localStorage)

2. **Persistencia:** Los datos persisten entre recargas usando localStorage, pero se pierden al limpiar navegador

3. **Imágenes:** Las fotos se guardan como base64 en localStorage (limitación de 5-10MB)

4. **Leads:** Página read-only con nota explicativa de que son datos automáticos

5. **Horarios de Aulas:** Read-only con nota explicativa de asignación automática

6. **Roles:** Mockup de control de acceso, sin autenticación real

7. **Production Ready:** El mockup debe verse y sentirse como una aplicación real, lista para demostrar a clientes

---

## 🎯 Resultado Esperado

Un dashboard completamente funcional que permita:

✅ Gestionar aulas, profesores, alumnos, personal, sedes, ciclos, cursos y campañas
✅ Crear, editar y eliminar registros con validaciones
✅ Subir y previsualizar imágenes
✅ Ver datos en diferentes formatos (grid, tabla, lista)
✅ Filtrar y buscar información
✅ Recibir feedback visual de todas las acciones
✅ Funcionar perfectamente en mobile, tablet y desktop
✅ Simular diferentes roles de usuario
✅ Configurar preferencias y perfil

**Timeline Estimado:** 8-12 horas de desarrollo

**Prioridad:** 🔥 Alta - Mockup para presentación a cliente

---

## 🤖 Prompt Resumido para Claude Code

**COPIAR Y PEGAR EN CLAUDE CODE:**

```
Implementa un dashboard admin completamente funcional basado en el mockup actual en design-dashboard-mockup/cep-admin-mockup/.

OBJETIVO: CRUD completo en todas las páginas con:
- Botones Create/Edit/Delete en cada módulo
- Formularios modales con validación (react-hook-form + zod)
- Subida de imágenes con preview (profesores, alumnos, personal, sedes)
- Toast notifications para feedback
- DataContext para gestión de estado global
- Componentes reutilizables (ImageUploader, ConfirmDialog, DataTable, FormDialog)

MÓDULOS A IMPLEMENTAR:
1. AULAS (3 páginas: Norte, Santa Cruz, Sur) - Create/Edit/Delete aulas
2. PROFESORES - CRUD con foto upload
3. PERSONAL ADMINISTRATIVO - CRUD con foto upload
4. ALUMNOS - CRUD con foto upload y tabla con filtros
5. SEDES - CRUD con foto upload
6. CICLOS - CRUD con accordion
7. CURSOS - CRUD con grid y filtros
8. CAMPAÑAS - CRUD con tabla de métricas
9. LEADS - READ-ONLY con nota explicativa
10. CONFIGURACIÓN - Settings con tabs
11. PERFIL DE USUARIO - Edición de perfil

COMPONENTES SHADCN A AGREGAR:
npx shadcn@latest add form toast alert-dialog textarea select checkbox label avatar tabs switch

DEPENDENCIAS ADICIONALES:
pnpm add react-hook-form @hookform/resolvers zod react-dropzone date-fns

REQUISITOS:
- Datos mock en DataContext + localStorage
- Validaciones Zod en todos los formularios
- Estados de loading en acciones
- Responsive design (mobile/tablet/desktop)
- Toast notifications en todas las acciones CRUD
- Confirmación para eliminaciones
- ImageUploader con drag-and-drop
- Datos de prueba: 50 alumnos, 15 profesores, 100 leads, 25 cursos

IMPORTANTE:
- NO editable: Leads (datos automáticos), Horarios de aulas (asignación automática)
- Roles mockup: admin, gestor, marketing, asesor, lectura
- Persistencia con localStorage
- Imágenes en base64

Sigue la estructura detallada en DEVELOPMENT_PROMPT.md
```

---

**Documento creado:** 2025-11-11
**Autor:** Claude AI + CTO (Carlos Pérez)
**Proyecto:** CEP Comunicación v2 - Dashboard Admin Mockup
**Estado:** ✅ Listo para desarrollo
