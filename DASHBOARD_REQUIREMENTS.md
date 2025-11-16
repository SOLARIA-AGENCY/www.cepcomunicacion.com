# Dashboard Administrativo CEP - Especificación de Diseño

## Objetivo General
Dashboard de administración para gestionar la operativa completa de la academia CEP, incluyendo programación de cursos, gestión de recursos (sedes, profesores, aulas) y seguimiento de leads/inscripciones.

## Módulos Principales

### 1. **Gestión de Cursos** (Courses Management)
**Funcionalidades:**
- Crear/editar/eliminar cursos
- Configurar: título, descripción, tipo (telemático, ocupados, desempleados, privados, ciclo-medio, ciclo-superior)
- Configurar modalidad (presencial, semipresencial, telemático)
- Asignar ciclo formativo (FP)
- Gestionar contenido didáctico
- Estado de publicación (borrador, publicado, archivado)
- SEO y metadatos
- Activar/desactivar publicidad del curso

**Componentes UI:**
- Tabla con filtros avanzados (shadcn Table + DataTable)
- Formulario modal/drawer para crear/editar (shadcn Form + Dialog)
- Búsqueda y filtros por tipo, modalidad, estado
- Vista de tarjetas y lista

---

### 2. **Programación de Cursos** (Course Scheduling - Convocations)
**Funcionalidades:**
- Crear convocatorias de cursos (fechas inicio/fin)
- Asignar sede/campus
- Configurar capacidad (min/max alumnos)
- Estado de convocatoria (abierta, lista espera, cerrada, planificada)
- Asignar precio y opciones de ayudas/subvenciones
- Configurar plazas disponibles
- Ver alumnos preinscritos en cada convocatoria

**Componentes UI:**
- Calendario visual (shadcn Calendar integrado con vista de timeline)
- Tabla de convocatorias con estados (badges para estados)
- Formulario de configuración
- Vista de inscripciones por convocatoria

---

### 3. **Planner Visual de Horarios** (Visual Scheduling Planner)
**Funcionalidades:**
- Vista de calendario semanal/mensual
- Asignación drag-and-drop de:
  - Cursos a aulas
  - Profesores a sesiones
  - Horarios de clases
- Vista por sede/campus
- Vista por profesor (disponibilidad)
- Vista por aula (ocupación)
- Detección de conflictos (doble asignación)
- Código de colores por tipo de curso

**Componentes UI:**
- Grilla de calendario interactiva (custom component + shadcn Card)
- Drag & Drop interface
- Filtros por sede, profesor, aula
- Selector de vista (semanal, mensual, por recurso)
- Badges y tooltips para información rápida

---

### 4. **Gestión de Sedes/Campus** (Campus Management)
**Funcionalidades:**
- Crear/editar/eliminar sedes
- Configurar: nombre, dirección, contacto
- Gestionar aulas dentro de cada sede
- Configurar capacidad de cada aula
- Estado de disponibilidad
- Horarios de apertura/cierre

**Componentes UI:**
- Lista de sedes con expansión para aulas (shadcn Accordion)
- Formulario de sede con mapa (opcional)
- Gestión de aulas nested
- Vista de capacidad y disponibilidad

---

### 5. **Gestión de Profesores** (Teachers Management)
**Funcionalidades:**
- Crear/editar/eliminar profesores
- Información personal y contacto
- Especialidades y materias que imparte
- Disponibilidad horaria
- Asignaciones actuales
- Historial de cursos impartidos

**Componentes UI:**
- Tabla de profesores (shadcn Table)
- Formulario de perfil de profesor
- Vista de disponibilidad (calendario)
- Lista de asignaciones

---

### 6. **Gestión de Aulas** (Classrooms Management)
**Funcionalidades:**
- Crear/editar/eliminar aulas
- Asignar a sede
- Configurar capacidad
- Equipamiento disponible
- Estado de ocupación
- Calendario de uso

**Componentes UI:**
- Tabla con agrupación por sede
- Estado visual de ocupación (badges)
- Filtros por sede y disponibilidad

---

### 7. **Leads e Inscripciones** (Leads & Enrollments)
**Funcionalidades:**
- Visualizar leads capturados desde:
  - Formularios web
  - Publicidad (Meta Ads)
  - WhatsApp
- Información del lead: nombre, email, teléfono, curso de interés, fuente (UTM)
- Estado del lead (nuevo, contactado, inscrito, descartado)
- Asignar lead a asesor
- Conversión a inscripción
- Historial de interacciones
- Vista de preinscritos por curso/convocatoria
- Gestión de cupos y listas de espera

**Componentes UI:**
- Dashboard de leads con KPIs (shadcn Card + Stats)
- Tabla de leads con filtros avanzados
- Vista kanban por estado (columnas: nuevo → contactado → inscrito)
- Formulario de seguimiento
- Vista de distribución por fuente (gráficos)

---

### 8. **Gestión de Matrículas** (Enrollment Management)
**Funcionalidades FASE 1:**
- Ver solicitudes de matrícula
- Aprobar/rechazar matrículas
- Asignar alumno a convocatoria
- Gestionar cupos y capacidad

**Funcionalidades FASE 2 (Futura - Stripe):**
- Procesamiento de pagos
- Planes de financiación
- Facturas y recibos
- Estado de pago

**Componentes UI:**
- Tabla de matrículas con estados
- Proceso de aprobación (wizard steps)
- Vista de pagos (fase 2)

---

### 9. **Gestión de Campañas Publicitarias** (Ad Campaigns Management)
**Funcionalidades:**
- Crear/editar/eliminar campañas
- Asignar cursos a promover
- Configurar presupuesto
- Estado de campaña (activa, pausada, finalizada)
- Seguimiento de resultados (leads generados, conversiones)
- Integración con Meta Ads
- Generación de creatividades con LLM (texto, hashtags, CTAs)

**Componentes UI:**
- Tabla de campañas
- Dashboard de rendimiento (gráficos de conversión)
- Formulario de configuración
- Preview de creatividades

---

### 10. **Gestión de Contenido del Frontend** (Frontend Content Management)
**Funcionalidades:**
- Editar páginas estáticas (Home, Quiénes Somos, Contacto)
- Gestionar blog posts
- Configurar FAQs
- Gestionar testimonios
- Configurar banners y promociones
- Gestionar medios (imágenes, vídeos)

**Componentes UI:**
- Editor de contenido (rich text editor)
- Gestión de media library
- Vista previa de cambios

---

### 11. **Analíticas y Reportes** (Analytics & Reports)
**Funcionalidades:**
- Dashboard de KPIs generales:
  - Leads capturados (semana/mes)
  - Tasa de conversión
  - Ocupación de cursos
  - Ingresos proyectados
- Reportes por curso/sede/profesor
- Exportación de datos (CSV, PDF)
- Integración con GA4, Meta Pixel, Plausible

**Componentes UI:**
- Dashboard con gráficos (shadcn Charts)
- Filtros de rango de fechas
- Tarjetas de métricas clave
- Tablas de datos exportables

---

## Estructura de Navegación Propuesta

### Sidebar Principal (Collapsible)
```
📊 Dashboard (Home)
📚 Cursos
   ├── Lista de Cursos
   ├── Programación (Convocatorias)
   └── Planner Visual
👥 Personas
   ├── Profesores
   └── Asesores
🏢 Recursos
   ├── Sedes/Campus
   └── Aulas
📋 Leads e Inscripciones
   ├── Leads
   ├── Matrículas
   └── Lista de Espera
📢 Marketing
   ├── Campañas
   └── Creatividades
📝 Contenido Web
   ├── Páginas
   ├── Blog
   ├── FAQs
   └── Medios
📈 Analíticas
⚙️ Configuración
   ├── Usuarios y Roles
   └── Sistema
```

### Header
- Logo CEP
- Breadcrumbs
- Notificaciones (badge con contador)
- Búsqueda global
- Avatar de usuario + menú dropdown

---

## Roles y Permisos (a reflejar en UI)

**5 Roles RBAC:**
1. **Admin** - Acceso total
2. **Gestor** - Gestión de contenido y programación
3. **Marketing** - Campañas y analíticas
4. **Asesor** - Solo leads asignados
5. **Lectura** - Solo visualización

Los componentes deben mostrar/ocultar acciones según el rol (usar contexto de autenticación mock).

---

## Paleta de Colores y Diseño

**Colores del Branding CEP:**
- Primario: #0066CC (azul corporativo)
- Secundario: #FF6600 (naranja acento)
- Neutros: Grises de Tailwind (slate)
- Estados: success (green), warning (yellow), error (red)

**Principios de Diseño:**
- Clean y minimalista
- Uso de whitespace generoso
- Jerarquía visual clara
- Mobile-first responsive
- Accesibilidad WCAG 2.1 AA
- Animaciones sutiles (no distractivas)

---

## Tecnologías del Mockup

- **Framework:** React 19 + TypeScript
- **Build:** Vite
- **Styling:** TailwindCSS 4.0
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts (integrado con shadcn)
- **Forms:** React Hook Form + Zod validation
- **Tables:** TanStack Table (shadcn DataTable)
- **Drag & Drop:** @dnd-kit
- **Date/Time:** date-fns

---

## Datos Mock

Se crearán datasets JSON con:
- 20+ cursos de diferentes tipos
- 10+ convocatorias programadas
- 5+ sedes con 15+ aulas
- 10+ profesores
- 50+ leads con diferentes estados
- 5+ campañas publicitarias

---

## Entregables del Mockup

1. **Aplicación funcional en navegador** (localhost:5174)
2. **Documentación de componentes** creados
3. **Guía de integración** para migrar al dashboard real
4. **Assets y estilos** reutilizables
5. **Data schemas** de los mocks (para tipado TypeScript)

---

**Fecha de Creación:** 2025-11-11
**Estado:** En Diseño - Mockup Fase 1
**Responsable:** SOLARIA AGENCY
