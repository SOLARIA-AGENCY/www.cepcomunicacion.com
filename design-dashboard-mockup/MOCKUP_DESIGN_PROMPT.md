# 🎨 PROMPT DE DISEÑO: Dashboard Admin CEP - Mockup Visual Completo

## 📋 Contexto del Proyecto

El dashboard admin de CEP Comunicación tiene la estructura base implementada. **OBJETIVO: Completar el diseño visual de TODAS las páginas antes de implementar funcionalidad.**

**Ubicación:** `design-dashboard-mockup/cep-admin-mockup/`

## 🎯 Objetivo

Crear un **mockup visual completo** con:

- ✅ Todas las páginas diseñadas (no solo placeholders)
- ✅ Todos los botones visibles (sin funcionalidad real)
- ✅ Todos los modales/dialogs diseñados
- ✅ Formularios completos con diseño (sin validación)
- ✅ Datos mock abundantes y realistas
- ✅ Estados visuales (hover, active, disabled)
- ❌ NO implementar CRUD real
- ❌ NO implementar gestión de estado global
- ❌ NO implementar validaciones

**Propósito:** Validar diseño y UX con cliente antes de desarrollo funcional

## 🎨 Filosofía de Diseño

**Inspiración:** Dashboards SaaS modernos (Notion, Linear, Airtable, Retool)

**Principios:**
1. **Data Density:** Mostrar información relevante sin saturar
2. **Visual Hierarchy:** Títulos claros, secciones bien definidas
3. **Actionable UI:** Botones evidentes para acciones principales
4. **Consistent Patterns:** Mismo diseño para operaciones similares
5. **Responsive First:** Mobile, tablet, desktop

## 📦 Componentes shadcn/ui a Instalar

```bash
# Solo los necesarios para el mockup visual
npx shadcn@latest add form select textarea checkbox label avatar tabs switch badge alert
```

## 🎨 Patrones de Diseño a Aplicar

### Patrón 1: Card con Acciones
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Título del Item</CardTitle>
      <div className="flex gap-2">
        <Button size="icon" variant="ghost" title="Editar">
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Eliminar">
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {/* Contenido */}
  </CardContent>
</Card>
```

### Patrón 2: Header de Página con Botón Acción
```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">Título de Página</h1>
    <p className="text-muted-foreground">Descripción de la sección</p>
  </div>
  <Button>
    <Plus className="mr-2 h-4 w-4" />
    Agregar Nuevo
  </Button>
</div>
```

### Patrón 3: Modal de Formulario (Visual Only)
```tsx
<Dialog>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Crear/Editar Item</DialogTitle>
      <DialogDescription>Complete los campos para crear el registro</DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-4">
      {/* Mostrar campos del formulario sin funcionalidad */}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" placeholder="Ingrese el nombre" />
        </div>
        {/* Más campos... */}
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button>Guardar Cambios</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Patrón 4: Tabla con Filtros
```tsx
<div className="space-y-4">
  <div className="flex items-center gap-4">
    <Input placeholder="Buscar..." className="max-w-sm" />
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar por..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Opción 1</SelectItem>
        <SelectItem value="option2">Opción 2</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <Table>
    {/* Tabla con datos mock */}
  </Table>
</div>
```

### Patrón 5: Avatar con Upload (Visual)
```tsx
<div className="flex items-center gap-4">
  <Avatar className="h-24 w-24">
    <AvatarImage src={imageUrl} />
    <AvatarFallback>AB</AvatarFallback>
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
```

## 📄 Implementación por Página

### 1. AULAS (CEP Norte, Santa Cruz, Sur)

**Archivos:**
- `ClassroomsNortePage.tsx`
- `ClassroomsSantaCruzPage.tsx`
- `ClassroomsSurPage.tsx`

**Mejoras a Implementar:**

#### 1.1 Agregar Botón "Agregar Aula"
```tsx
// En el header de la página
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">Aulas CEP Norte</h1>
    <p className="text-muted-foreground">
      Gestión visual de aulas y asignación de cursos - Sede Norte
    </p>
  </div>
  <Button>
    <Plus className="mr-2 h-4 w-4" />
    Agregar Aula
  </Button>
</div>
```

#### 1.2 Agregar Botones Editar/Eliminar en Cards
```tsx
<CardHeader>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <DoorOpen className="h-5 w-5 text-primary" />
      <CardTitle>{classroom.name}</CardTitle>
    </div>
    <div className="flex gap-2">
      <Button size="icon" variant="ghost" title="Editar aula">
        <Edit className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" title="Eliminar aula">
        <Trash className="h-4 w-4 text-destructive" />
      </Button>
      {classroom.currentCourse ? <Badge>Ocupada</Badge> : <Badge variant="secondary">Disponible</Badge>}
    </div>
  </div>
</CardHeader>
```

#### 1.3 Modal de Aula (Sin Funcionalidad)
Crear componente visual del modal que se mostraría al hacer click en "Agregar" o "Editar":

```tsx
// Agregar estado para mostrar el modal (solo visual)
const [showClassroomDialog, setShowClassroomDialog] = useState(false)

<Dialog open={showClassroomDialog} onOpenChange={setShowClassroomDialog}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Agregar Nueva Aula</DialogTitle>
      <DialogDescription>Complete los campos para crear una nueva aula</DialogDescription>
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
          <Label htmlFor="campus">Sede *</Label>
          <Select>
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
            <label htmlFor="eq-proyector" className="text-sm">Proyector</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="eq-ordenadores" />
            <label htmlFor="eq-ordenadores" className="text-sm">Ordenadores</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="eq-pizarra" />
            <label htmlFor="eq-pizarra" className="text-sm">Pizarra Digital</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="eq-audio" />
            <label htmlFor="eq-audio" className="text-sm">Sistema de Audio</label>
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
      <Button variant="outline" onClick={() => setShowClassroomDialog(false)}>
        Cancelar
      </Button>
      <Button onClick={() => setShowClassroomDialog(false)}>
        Guardar Aula
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 2. PROFESORES

**Archivo:** `src/pages/TeachersPage.tsx`

**Implementar:**

#### 2.1 Layout con Grid de Cards
```tsx
export function TeachersPage() {
  const [showTeacherDialog, setShowTeacherDialog] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header con botón */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profesores</h1>
          <p className="text-muted-foreground">
            Gestión de profesorado del centro
          </p>
        </div>
        <Button onClick={() => setShowTeacherDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Profesor
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <Input placeholder="Buscar por nombre..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="diseno">Diseño</SelectItem>
            <SelectItem value="desarrollo">Desarrollo</SelectItem>
            <SelectItem value="audiovisual">Audiovisual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de profesores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={teacher.photo} />
                    <AvatarFallback>{teacher.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <Badge variant="outline">{teacher.department}</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" title="Editar">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title="Eliminar">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {teacher.email}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {teacher.phone}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.specialties.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {teacher.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {teacher.bio}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Profesor */}
      <TeacherDialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog} />
    </div>
  )
}
```

#### 2.2 Modal de Profesor (Componente Separado)
```tsx
// src/components/TeacherDialog.tsx
interface TeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeacherDialog({ open, onOpenChange }: TeacherDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Profesor</DialogTitle>
          <DialogDescription>
            Complete la información del nuevo profesor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Foto del profesor */}
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>AB</AvatarFallback>
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

          {/* Información personal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="teacher-name">Nombre Completo *</Label>
              <Input id="teacher-name" placeholder="Juan Pérez García" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-email">Email *</Label>
              <Input id="teacher-email" type="email" placeholder="juan.perez@cepcomunicacion.com" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-phone">Teléfono *</Label>
              <Input id="teacher-phone" placeholder="+34 600 000 000" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-department">Departamento *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing Digital</SelectItem>
                  <SelectItem value="diseno">Diseño Gráfico</SelectItem>
                  <SelectItem value="desarrollo">Desarrollo Web</SelectItem>
                  <SelectItem value="audiovisual">Audiovisual</SelectItem>
                  <SelectItem value="gestion">Gestión Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Especialidades */}
          <div className="grid gap-2">
            <Label>Especialidades *</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-seo" />
                <label htmlFor="spec-seo" className="text-sm">SEO y SEM</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-social" />
                <label htmlFor="spec-social" className="text-sm">Redes Sociales</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-content" />
                <label htmlFor="spec-content" className="text-sm">Content Marketing</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spec-analytics" />
                <label htmlFor="spec-analytics" className="text-sm">Analytics</label>
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div className="grid gap-2">
            <Label htmlFor="teacher-bio">Biografía (Opcional)</Label>
            <Textarea
              id="teacher-bio"
              placeholder="Breve descripción profesional..."
              rows={4}
            />
          </div>

          {/* Estado activo */}
          <div className="flex items-center space-x-2">
            <Switch id="teacher-active" defaultChecked />
            <Label htmlFor="teacher-active">Profesor activo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Guardar Profesor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### 2.3 Datos Mock de Profesores
```typescript
// src/data/mockData.ts - Agregar
export const teachers = [
  {
    id: 1,
    name: "Ana García Martínez",
    initials: "AG",
    email: "ana.garcia@cepcomunicacion.com",
    phone: "+34 612 345 678",
    photo: "https://i.pravatar.cc/150?img=1",
    department: "Marketing Digital",
    specialties: ["SEO", "SEM", "Analytics"],
    bio: "15 años de experiencia en marketing digital. Certificada en Google Ads y Analytics.",
    active: true
  },
  {
    id: 2,
    name: "Carlos Rodríguez López",
    initials: "CR",
    email: "carlos.rodriguez@cepcomunicacion.com",
    phone: "+34 623 456 789",
    photo: "https://i.pravatar.cc/150?img=12",
    department: "Desarrollo Web",
    specialties: ["React", "Node.js", "TypeScript"],
    bio: "Full-stack developer con 10 años de experiencia. Especialista en arquitecturas modernas.",
    active: true
  },
  // ... 13 profesores más
]
```

---

### 3. ALUMNOS

**Archivo:** `src/pages/StudentsPage.tsx`

**Implementar tabla completa con filtros:**

```tsx
export function StudentsPage() {
  const [showStudentDialog, setShowStudentDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumnos</h1>
          <p className="text-muted-foreground">
            Gestión de estudiantes matriculados
          </p>
        </div>
        <Button onClick={() => setShowStudentDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Alumno
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <Input placeholder="Buscar por nombre o email..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sede" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="norte">CEP Norte</SelectItem>
            <SelectItem value="santa-cruz">CEP Santa Cruz</SelectItem>
            <SelectItem value="sur">CEP Sur</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
            <SelectItem value="graduated">Graduado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de alumnos */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Sede</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-20">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.photo} />
                    <AvatarFallback>{student.initials}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{student.course}</Badge>
                </TableCell>
                <TableCell>{student.campus}</TableCell>
                <TableCell>
                  <Badge variant={
                    student.status === 'active' ? 'default' :
                    student.status === 'graduated' ? 'secondary' :
                    'outline'
                  }>
                    {student.status === 'active' ? 'Activo' :
                     student.status === 'graduated' ? 'Graduado' :
                     'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Eliminar">
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal de Alumno */}
      <StudentDialog open={showStudentDialog} onOpenChange={setShowStudentDialog} />
    </div>
  )
}
```

---

### 4. PERSONAL ADMINISTRATIVO

**Archivo:** `src/pages/AdministrativePage.tsx` (CREAR NUEVO)

Similar a profesores pero con roles administrativos:
- Director/a
- Coordinador/a Académico
- Secretario/a
- Administrativo/a
- Recepcionista

---

### 5. SEDES

**Archivo:** `src/pages/CampusPage.tsx`

**Rediseñar con cards grandes y foto:**

```tsx
export function CampusPage() {
  const [showCampusDialog, setShowCampusDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sedes</h1>
          <p className="text-muted-foreground">
            Gestión de centros CEP Comunicación
          </p>
        </div>
        <Button onClick={() => setShowCampusDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Sede
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campuses.map((campus) => (
          <Card key={campus.id} className="overflow-hidden">
            {/* Foto de la sede */}
            <div className="relative h-48 w-full">
              <img
                src={campus.photo}
                alt={campus.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button size="icon" variant="secondary">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardHeader>
              <CardTitle>{campus.name}</CardTitle>
              <CardDescription>{campus.address}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {campus.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {campus.email}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {campus.city}, {campus.postal_code}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Aulas</p>
                  <p className="text-2xl font-bold">{campus.total_classrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacidad</p>
                  <p className="text-2xl font-bold">{campus.total_capacity}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Instalaciones:</p>
                <div className="flex flex-wrap gap-1">
                  {campus.facilities.map((facility) => (
                    <Badge key={facility} variant="outline" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CampusDialog open={showCampusDialog} onOpenChange={setShowCampusDialog} />
    </div>
  )
}
```

---

### 6-11. RESTO DE PÁGINAS

**Seguir el mismo patrón para:**
- Ciclos (CyclesPage.tsx)
- Cursos (CoursesPage.tsx)
- Campañas (CampaignsPage.tsx)
- Configuración (SettingsPage.tsx)
- Perfil de Usuario (UserProfilePage.tsx)

**Todas deben tener:**
1. Header con botón "Agregar"
2. Botones Editar/Eliminar visibles
3. Modal diseñado (sin funcionalidad)
4. Datos mock abundantes (10-50 items)

---

## 📊 Datos Mock a Generar

Crear en `src/data/mockData.ts`:

```typescript
// 15 profesores con fotos (pravatar.cc)
export const teachers = [ /* ... */ ]

// 50 alumnos
export const students = [ /* ... */ ]

// 8 personal administrativo
export const staff = [ /* ... */ ]

// 3 sedes con fotos
export const campuses = [ /* ... */ ]

// 4 ciclos formativos
export const cycles = [ /* ... */ ]

// 25 cursos variados
export const courses = [ /* ... */ ]

// 10 campañas de marketing
export const marketingCampaigns = [ /* ... */ ]

// 100 leads (read-only)
export const leads = [ /* ... */ ]
```

**Usar generadores:**
- Fotos: `https://i.pravatar.cc/150?img={1-70}` (avatares)
- Fotos sedes: `https://images.unsplash.com/photo-{id}?w=800` (edificios/aulas)
- Nombres: Combinaciones españolas realistas
- Emails: `{nombre}.{apellido}@cepcomunicacion.com`
- Teléfonos: `+34 6XX XXX XXX` (formato español)

---

## 📱 Responsive Design

Verificar que TODAS las páginas funcionen en:

- **Mobile (< 768px):**
  - Grid → 1 columna
  - Tabla → Cards apiladas
  - Modales → Full screen

- **Tablet (768px-1024px):**
  - Grid → 2 columnas
  - Tablas con scroll horizontal

- **Desktop (> 1024px):**
  - Grid → 3 columnas
  - Tablas completas

---

## ✅ Checklist de Implementación

### Fase 1: Aulas (3 páginas)
- [ ] Botón "Agregar Aula" en header
- [ ] Botones Editar/Eliminar en cada card
- [ ] Modal de aula con formulario completo
- [ ] 12 aulas mock (4 por sede)

### Fase 2: Profesores
- [ ] Página con grid de cards
- [ ] Cards con avatar y especialidades
- [ ] Botón "Agregar Profesor"
- [ ] Modal con subida de foto (visual)
- [ ] 15 profesores mock con fotos

### Fase 3: Alumnos
- [ ] Tabla completa con filtros
- [ ] Paginación visual
- [ ] Modal con todos los campos
- [ ] 50 alumnos mock

### Fase 4: Personal Administrativo
- [ ] Página nueva similar a profesores
- [ ] 8 miembros del staff mock

### Fase 5: Sedes
- [ ] Cards con foto grande de sede
- [ ] Modal con subida de foto
- [ ] 3 sedes mock con fotos reales

### Fase 6: Ciclos
- [ ] Página nueva con accordion
- [ ] 4 ciclos mock

### Fase 7: Cursos
- [ ] Grid con filtros por tipo
- [ ] 25 cursos mock

### Fase 8: Campañas
- [ ] Tabla con métricas
- [ ] 10 campañas mock

### Fase 9: Configuración
- [ ] Página con tabs
- [ ] Settings general, notificaciones, seguridad

### Fase 10: Perfil Usuario
- [ ] Página de perfil editable

### Fase 11: Leads (Read-Only)
- [ ] Alert explicativo
- [ ] Tabla sin botones editar/eliminar
- [ ] 100 leads mock

---

## 🎨 Resultado Esperado

Un mockup visual completo que muestre:

✅ **Todas las páginas diseñadas** (no placeholders)
✅ **Todos los botones visibles** (Agregar, Editar, Eliminar)
✅ **Todos los modales diseñados** (formularios completos)
✅ **Datos mock abundantes** (parecer real)
✅ **Diseño responsive** (mobile, tablet, desktop)
✅ **Diseño consistente** (mismos patrones en todas las páginas)
✅ **Estados visuales** (hover, active en botones)

**NO incluir:**
❌ Funcionalidad CRUD real
❌ Validaciones de formularios
❌ Gestión de estado global
❌ localStorage
❌ React Hook Form

---

## 🤖 Prompt Resumido para Claude Code

**COPIAR Y PEGAR:**

```
Completa el diseño visual del dashboard mockup en design-dashboard-mockup/cep-admin-mockup/

OBJETIVO: Mockup visual completo SIN funcionalidad CRUD real

INSTALAR COMPONENTES:
npx shadcn@latest add form select textarea checkbox label avatar tabs switch badge alert

TAREAS:

1. AULAS (3 páginas):
   - Botón "Agregar Aula" en header
   - Botones Editar/Eliminar en cada card
   - Modal con formulario completo (sin validación)
   - 12 aulas mock

2. PROFESORES (TeachersPage.tsx):
   - Grid de cards con avatares
   - Botón "Agregar Profesor"
   - Modal con todos los campos + foto (visual)
   - 15 profesores mock con fotos (pravatar.cc)

3. ALUMNOS (StudentsPage.tsx):
   - Tabla completa con filtros
   - Modal con todos los campos
   - 50 alumnos mock

4. PERSONAL (AdministrativePage.tsx - CREAR):
   - Similar a profesores
   - 8 miembros staff mock

5. SEDES (CampusPage.tsx - REDISEÑAR):
   - Cards grandes con foto de sede
   - Modal con subida de foto
   - 3 sedes mock con fotos

6. CICLOS (CyclesPage.tsx - CREAR):
   - Accordion con ciclos
   - 4 ciclos mock

7. CURSOS (CoursesPage.tsx - REDISEÑAR):
   - Grid con filtros
   - 25 cursos mock

8. CAMPAÑAS (CampaignsPage.tsx - CREAR en marketing/):
   - Tabla con métricas
   - 10 campañas mock

9. CONFIGURACIÓN (SettingsPage.tsx - CREAR):
   - Tabs: General, Notificaciones, Seguridad, Integraciones

10. PERFIL (UserProfilePage.tsx - CREAR):
    - Edición de perfil con foto

11. LEADS (LeadsPage.tsx - REDISEÑAR):
    - Alert: "Datos automáticos - No editables"
    - Tabla sin botones editar/eliminar
    - 100 leads mock

PATRONES A SEGUIR:
- Header con botón "Agregar" (top-right)
- Cards con botones Editar/Eliminar (icons)
- Modales con DialogHeader + campos + DialogFooter
- Avatares con botón "Subir Foto" (visual only)
- Tablas con filtros y búsqueda
- Badges para estados
- Responsive: mobile (1 col), tablet (2 col), desktop (3 col)

DATOS MOCK:
- Fotos: pravatar.cc/150?img={1-70}
- Emails: nombre.apellido@cepcomunicacion.com
- Teléfonos: +34 6XX XXX XXX

IMPORTANTE:
- Solo diseño visual, NO funcionalidad CRUD
- NO validaciones
- NO gestión de estado global
- Modales se abren/cierran con useState local
- Botones sin onClick real (solo visual)

Documento completo: design-dashboard-mockup/MOCKUP_DESIGN_PROMPT.md
```

---

**Documento creado:** 2025-11-11
**Autor:** Claude AI + CTO
**Estado:** ✅ Listo para diseño mockup completo
**Timeline:** 6-8 horas
