# Admin Dashboard Interno - CEPComunicación

**Fecha**: 2025-11-04
**Status**: Especificación - Ready for Implementation
**Metodología**: SOLARIA (Spec-Driven Development)
**Prioridad**: HIGH (reemplaza panel admin de Payload)

---

## Contexto y Motivación

### Problema
Payload CMS 3.62.1 + Next.js 15.2.3 tiene incompatibilidad en el admin UI (`/admin`).

### Solución
Crear dashboard de administración interno custom que consume la API de Payload para gestión completa del centro educativo.

### Ventajas
- ✅ **Control Total**: Adaptado 100% a necesidades del centro
- ✅ **API Nativa**: Usa Payload API (ya funcional)
- ✅ **UX Mejorado**: Diseñado específicamente para CEP
- ✅ **Escalable**: Fácil agregar módulos personalizados
- ✅ **Zero Dependencies**: No depende del admin UI de Payload

---

## Arquitectura Técnica

### Stack Propuesto

**Frontend** (Dashboard Admin):
- **Framework**: Next.js 15.2.3 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: TailwindCSS 4.x
- **Components**: shadcn/ui (componentes reutilizables)
- **Forms**: React Hook Form + Zod validation
- **State**: React Context + TanStack Query (cache API)
- **Auth**: JWT tokens (Payload API)

**Backend** (Ya existe):
- **API**: Payload CMS REST API
- **Autenticación**: POST /api/users/login
- **Endpoints**: /api/courses, /api/students, etc.

**Ubicación**:
```
apps/
├── cms/          # Payload CMS (backend)
├── web/          # Frontend público (React+Vite)
└── admin/        # 🆕 Dashboard Admin (Next.js)
```

---

## Módulos del Dashboard

### 1. Autenticación y Seguridad

**Pantallas**:
- Login (email + password)
- Recuperar contraseña
- Cambiar contraseña
- Perfil de usuario

**Roles y Permisos** (heredados de Payload):
1. **Admin** - Acceso completo
2. **Gestor** - Gestión de contenido y usuarios
3. **Marketing** - Campañas y leads
4. **Asesor** - Leads y estudiantes
5. **Lectura** - Solo lectura

**Funcionalidades**:
- Login con email/password → JWT token
- Token almacenado en httpOnly cookie
- Refresh token automático
- Logout y sesión segura
- Protección de rutas por rol

---

### 2. Gestión de Cursos

**Pantallas**:
- **Lista de Cursos** (tabla con filtros)
- **Crear Curso**
- **Editar Curso**
- **Ver Curso** (detalles completos)
- **Eliminar Curso** (soft delete)

**Campos**:
- Información básica (título, descripción, slug)
- Tipo de curso (dropdown: ciclo-superior, ocupados, etc.)
- Modalidad (presencial, online, híbrido)
- Precio y duración (horas)
- Ciclo relacionado (select)
- Sedes (multi-select)
- Imagen destacada (upload)
- SEO (meta title, meta description)
- Estado (activo/inactivo, destacado)

**Filtros**:
- Por tipo de curso
- Por modalidad
- Por ciclo
- Por sede
- Por estado (activo/inactivo)
- Búsqueda por texto

**Acciones**:
- Crear nuevo curso
- Editar curso existente
- Duplicar curso
- Activar/desactivar
- Marcar como destacado
- Eliminar (soft delete)

---

### 3. Gestión de Convocatorias (Course Runs)

**Pantallas**:
- **Lista de Convocatorias** (tabla + calendario)
- **Crear Convocatoria**
- **Editar Convocatoria**
- **Ver Inscripciones** (enrollments)

**Campos**:
- Curso relacionado (select)
- Fechas (inicio, fin, deadline inscripción)
- Sede (select)
- Capacidad (min/max estudiantes)
- Precio override (opcional)
- Estado (draft, publicado, inscripción abierta, etc.)
- Horario (días de semana + horas)
- Instructor asignado

**Vistas**:
- **Tabla**: Convocatorias con filtros
- **Calendario**: Vista mensual/semanal de convocatorias
- **Timeline**: Próximas convocatorias

**Acciones**:
- Crear convocatoria
- Editar convocatoria
- Cambiar estado (publicar, abrir inscripción, cerrar)
- Ver lista de inscritos
- Descargar lista de asistencia (PDF)

---

### 4. Gestión de Estudiantes

**Pantallas**:
- **Lista de Estudiantes**
- **Crear Estudiante**
- **Editar Estudiante**
- **Ficha de Estudiante** (historial completo)

**Campos** (15+ campos PII):
- Datos personales (nombre, apellidos, DNI, email, teléfono)
- Fecha de nacimiento (cálculo automático de edad)
- Dirección completa
- Contacto de emergencia
- Consentimiento GDPR (readonly)
- Historial de inscripciones
- Notas y observaciones

**Funcionalidades**:
- Búsqueda avanzada (DNI, email, nombre)
- Exportar datos (CSV) - GDPR compliant
- Historial académico (cursos realizados)
- Estado de pagos
- Certificados emitidos

**Acciones**:
- Crear estudiante
- Editar datos
- Ver historial completo
- Exportar datos individuales (GDPR)
- Eliminar datos (derecho al olvido)

---

### 5. Gestión de Inscripciones (Enrollments)

**Pantallas**:
- **Lista de Inscripciones**
- **Nueva Inscripción**
- **Editar Inscripción**
- **Ficha de Inscripción**

**Campos**:
- Estudiante (select)
- Convocatoria (select)
- Estado (pendiente, confirmada, waitlist, etc.)
- Información de pago
  - Importe total
  - Importe pagado
  - Estado de pago
  - Ayuda financiera (solicitud/aprobación)
- Asistencia (porcentaje)
- Nota final
- Certificado emitido (boolean + URL)

**Workflow de Estados**:
1. **Pending** → Inscripción creada
2. **Confirmed** → Pago confirmado
3. **Waitlisted** → Lista de espera (capacidad llena)
4. **In Progress** → Curso iniciado
5. **Completed** → Curso finalizado
6. **Cancelled** / **Withdrawn** → Baja

**Funcionalidades**:
- Inscripción rápida (estudiante + convocatoria)
- Gestión de pagos
- Solicitud de ayuda financiera
- Registro de asistencia
- Calificaciones
- Emisión de certificados

---

### 6. Gestión de Leads

**Pantallas**:
- **Lista de Leads** (tabla con filtros)
- **Ver Lead** (ficha completa)
- **Asignar Lead** (a asesor)
- **Convertir a Estudiante**

**Campos**:
- Datos de contacto (nombre, email, teléfono)
- Curso de interés
- Sede de interés
- Campaña (UTM tracking)
- Lead score (calculado automáticamente)
- Estado (nuevo, contactado, cualificado, convertido)
- Asignado a (asesor)
- Notas del asesor

**Filtros**:
- Por estado
- Por curso de interés
- Por campaña (UTM)
- Por asesor asignado
- Por lead score
- Por fecha de creación

**Acciones**:
- Asignar a asesor
- Cambiar estado
- Agregar nota
- Enviar email/WhatsApp
- Convertir a estudiante
- Marcar como duplicado

---

### 7. Gestión de Campañas

**Pantallas**:
- **Lista de Campañas**
- **Crear Campaña**
- **Editar Campaña**
- **Analytics de Campaña**

**Campos**:
- Nombre de campaña
- Tipo (email, social, paid_ads, etc.)
- Curso relacionado (opcional)
- Fechas (inicio/fin)
- Presupuesto
- UTM parameters (source, medium, campaign, term, content)
- Estado (draft, activa, pausada, completada)
- Métricas (total leads, conversiones, ROI)

**Analytics**:
- Total de leads generados
- Tasa de conversión
- Coste por lead (CPL)
- ROI (retorno de inversión)
- Gráficos de evolución temporal

---

### 8. Gestión de Sedes (Campuses)

**Pantallas**:
- **Lista de Sedes**
- **Crear/Editar Sede**

**Campos**:
- Nombre y código
- Dirección completa
- Coordenadas (mapa)
- Teléfono y email
- Horario de atención
- Capacidad máxima
- Servicios (WiFi, parking, cafetería, etc.)
- Estado (activa/inactiva)

---

### 9. Gestión de Ciclos Formativos

**Pantallas**:
- **Lista de Ciclos**
- **Crear/Editar Ciclo**

**Campos**:
- Nombre del ciclo
- Código
- Nivel (Grado Medio, Grado Superior)
- Descripción
- Duración (horas)
- Orden de visualización

---

### 10. Blog y Contenido

**Pantallas**:
- **Lista de Posts**
- **Crear/Editar Post**
- **Gestión de Categorías**

**Campos**:
- Título y slug
- Contenido (rich text editor)
- Autor
- Categorías y tags
- Imagen destacada
- SEO (meta)
- Estado (draft, publicado)
- Fecha de publicación

---

### 11. FAQs

**Pantallas**:
- **Lista de FAQs**
- **Crear/Editar FAQ**
- **Ordenar FAQs** (drag & drop)

**Campos**:
- Pregunta
- Respuesta (rich text)
- Categoría
- Orden de visualización
- Estado (activo/inactivo)

---

### 12. Dashboard Principal (Home)

**Widgets**:
- **KPIs Principales**:
  - Total estudiantes activos
  - Convocatorias activas
  - Leads pendientes (sin asignar)
  - Inscripciones este mes
  - Ingresos este mes

- **Gráficos**:
  - Inscripciones por mes (últimos 12 meses)
  - Leads por fuente/campaña
  - Cursos más populares
  - Tasa de conversión (lead → estudiante)

- **Acciones Rápidas**:
  - Crear nueva inscripción
  - Crear nuevo estudiante
  - Ver leads pendientes
  - Próximas convocatorias

- **Notificaciones**:
  - Leads sin asignar
  - Pagos pendientes
  - Convocatorias próximas a llenarse
  - Certificados pendientes de emitir

---

## Diseño UX/UI

### Principios de Diseño

1. **Simplicidad**: Navegación clara, pocas clicks para tareas comunes
2. **Responsivo**: Funciona en desktop, tablet, móvil
3. **Accesible**: WCAG 2.1 AA compliance
4. **Rápido**: Carga instantánea con caching (TanStack Query)

### Layout

```
┌─────────────────────────────────────────────────────┐
│  HEADER (Logo, Usuario, Notificaciones, Logout)    │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ SIDEBAR  │         CONTENT AREA                     │
│          │                                          │
│ • Home   │  [ Breadcrumbs ]                         │
│ • Cursos │  [ Page Title + Actions ]                │
│ • Alumnos│  [ Filters / Search ]                    │
│ • Leads  │  [ Main Content (Table/Form/Details) ]   │
│ • Campañ.│                                          │
│ • Config │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Componentes Clave

**shadcn/ui Components**:
- `<DataTable>` - Tablas con sorting, filtros, paginación
- `<Form>` - Formularios con validación
- `<Select>` - Dropdowns
- `<Calendar>` - Selector de fechas
- `<Dialog>` - Modales
- `<Tabs>` - Navegación por pestañas
- `<Badge>` - Estados (activo, pendiente, etc.)
- `<Avatar>` - Fotos de perfil
- `<Toast>` - Notificaciones

---

## Integración con Payload API

### Autenticación

```typescript
// Login
POST /api/users/login
Body: { email, password }
Response: { token, user }

// Refresh Token
POST /api/users/refresh-token
Headers: { Authorization: Bearer <token> }

// Logout
POST /api/users/logout
```

### Endpoints CRUD

**Cursos**:
```
GET    /api/courses?limit=20&page=1&where[active][equals]=true
POST   /api/courses
GET    /api/courses/:id?depth=2
PATCH  /api/courses/:id
DELETE /api/courses/:id
```

**Estudiantes**:
```
GET    /api/students?search=john&limit=20
POST   /api/students
GET    /api/students/:id
PATCH  /api/students/:id
DELETE /api/students/:id
```

**Inscripciones**:
```
GET    /api/enrollments?where[student][equals]=123
POST   /api/enrollments
PATCH  /api/enrollments/:id
```

**Leads**:
```
GET    /api/leads?where[assigned_to][equals]=null
PATCH  /api/leads/:id
```

### Cache Strategy (TanStack Query)

```typescript
// Invalidación automática
queryClient.invalidateQueries(['courses'])
queryClient.invalidateQueries(['students'])

// Stale time: 5 minutos
staleTime: 5 * 60 * 1000

// Refetch en background
refetchOnWindowFocus: true
```

---

## Estructura de Archivos

```
apps/admin/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar + Header
│   │   ├── page.tsx            # Home/Dashboard
│   │   ├── cursos/
│   │   │   ├── page.tsx        # Lista
│   │   │   ├── nuevo/page.tsx  # Crear
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Ver
│   │   │       └── editar/page.tsx
│   │   ├── estudiantes/
│   │   ├── inscripciones/
│   │   ├── leads/
│   │   ├── campanas/
│   │   ├── sedes/
│   │   ├── ciclos/
│   │   └── configuracion/
│   └── api/                    # API routes (proxy a Payload)
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Breadcrumbs.tsx
│   ├── forms/
│   │   ├── CursoForm.tsx
│   │   ├── EstudianteForm.tsx
│   │   └── InscripcionForm.tsx
│   └── tables/
│       ├── CursosTable.tsx
│       └── EstudiantesTable.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts           # Axios instance
│   │   ├── courses.ts          # Courses API
│   │   ├── students.ts
│   │   └── auth.ts
│   ├── hooks/
│   │   ├── useCourses.ts       # TanStack Query hooks
│   │   ├── useStudents.ts
│   │   └── useAuth.ts
│   └── utils/
│       ├── validation.ts       # Zod schemas
│       └── permissions.ts      # RBAC helpers
├── public/
├── styles/
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## Roadmap de Implementación

### Phase 1: Setup & Auth (1 semana)
- [ ] Crear estructura Next.js en `apps/admin/`
- [ ] Configurar TailwindCSS + shadcn/ui
- [ ] Implementar login/logout
- [ ] Protección de rutas por rol
- [ ] Layout base (Sidebar + Header)

### Phase 2: Módulos Core (2 semanas)
- [ ] Dashboard principal (KPIs + gráficos)
- [ ] Gestión de Cursos (CRUD completo)
- [ ] Gestión de Convocatorias
- [ ] Gestión de Estudiantes

### Phase 3: Módulos Secundarios (1 semana)
- [ ] Gestión de Inscripciones
- [ ] Gestión de Leads
- [ ] Gestión de Campañas
- [ ] Sedes y Ciclos

### Phase 4: Content & Advanced (1 semana)
- [ ] Blog y FAQs
- [ ] Calendario de convocatorias
- [ ] Reportes y exportación
- [ ] Notificaciones en tiempo real

### Phase 5: Testing & Deploy (1 semana)
- [ ] Tests unitarios (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] Optimización de performance
- [ ] Deploy a producción

**Total**: ~6 semanas

---

## Quality Gates (SOLARIA)

### Tests
- [ ] ≥75% code coverage
- [ ] 100% tests passing
- [ ] E2E tests para flujos críticos

### Performance
- [ ] Lighthouse score ≥90
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s

### Security
- [ ] HTTPS enforced
- [ ] JWT token con httpOnly cookies
- [ ] CSRF protection
- [ ] Rate limiting en API
- [ ] Validación en backend (Payload API)

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader compatible

---

## Ventajas vs Payload Admin UI

| Feature | Payload Admin | Custom Dashboard |
|---------|---------------|------------------|
| **Personalización** | Limitada | Total |
| **UX específica CEP** | Genérica | Optimizada |
| **Performance** | Buena | Excelente (cache) |
| **Escalabilidad** | Media | Alta |
| **Mantenimiento** | Depende de Payload | Bajo (API estable) |
| **Funcionalidades custom** | Difícil | Fácil |
| **Calendario integrado** | No | Sí |
| **Dashboard analytics** | Básico | Avanzado |
| **Compatibilidad** | Issue conocido | Sin problemas |

---

## Próximos Pasos

1. **Aprobar especificación**
2. **Crear ADR-002**: "Decisión de implementar Custom Admin Dashboard"
3. **Asignar a agente especializado** (react-frontend-dev)
4. **Implementar Phase 1** (Setup & Auth)
5. **Desplegar en** `http://46.62.222.138/dashboard` (Nginx config)

---

**Status**: ✅ Ready for Implementation
**Estimación**: 6 semanas (siguiendo SOLARIA TDD)
**ROI**: Dashboard custom 100% adaptado vs esperar fix de Payload (timing incierto)

