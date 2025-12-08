# Campus Virtual – Estrategia de Implementación

Fecha: 2025-12-08  
Autor: Equipo CEPComunicacion  
Alcance: Módulo Campus Virtual como addon opcional por tenant, integrable con Gestión Académica y/o Marketing.

## Objetivos
- Entregar un Campus Virtual para alumnos (portal de cursos, progreso, materiales, clases en vivo, tareas, certificados).
- Mantenerlo como módulo opcional (feature flag por tenant, facturable aparte).
- No bloquear la operación actual: desarrollo en rama/worktree `feature/campus-virtual`.

## Modelo de módulos y pricing (en suscripciones)
- Módulos: Gestión Académica, Marketing, Campus Virtual (addon).
- Planes base (referencia de mock actual en Academix):
  - Starter (Gestión+Marketing): 5 usuarios, 1 sede, 20 cursos; addons: €5/curso extra, €9/usuario extra, €29/sede extra.
  - Pro Campus (Gestión+Marketing+Campus): 10 usuarios, 3 sedes, 100 cursos; addons: €3/curso extra, €7/usuario extra, €39/sede extra. Precio mínimo campus: €299.
  - Enterprise Full: ilimitado (sedes/usuarios/cursos). Precio: €599.
- Feature flag por tenant: `features: { gestionAcademica, marketing, campusVirtual }`. Campus deshabilitado = ocultar menú/UI + bloquear endpoints.
- Addons aplican solo si hay límites: cursos extra, usuarios extra, sedes extra.

## Arquitectura funcional del Campus Virtual (alumno)
- Mi Panel: progreso, próximas sesiones, tareas pendientes, certificados.
- Mis Cursos: en curso / completados / próximos.
- Detalle de Curso:
  - Temario (módulos/lecciones).
  - Materiales (PDF/links/video).
  - Clases en vivo (agenda, link, grabaciones).
  - Tareas/entregas + feedback.
  - Notas personales.
  - Foro/Q&A por curso o lección.
  - Progreso y certificación.
- Agenda en vivo (incluye semipresencial): próximas sesiones, recordatorios, grabaciones.
- Perfil alumno: datos, preferencias de notificación.

## UI de gestión (backoffice) para Campus
- Estructura de Cursos: módulos/lecciones (orden drag & drop), visibilidad/fechas.
- Alumnos & Matriculados: enrollments, progreso, revocar/conceder acceso.
- Anuncios a alumnos: broadcast por curso/convocatoria/lección.
- Clases en vivo: agenda, links de streaming, grabaciones.
- Tareas/Entregas: asignaciones, correcciones, feedback.
- Materiales: biblioteca por curso/lección con scheduling de publicación.
- Certificados (fase posterior): reglas de completitud + descarga.
- CTA “activar módulo” si el tenant no tiene Campus Virtual.

## Modelo de datos (Payload) propuesto
Todos con `tenant_id` y relaciones a `courses` / `course_runs` / `students` / `enrollments`.
- `course_modules` (1:N course).
- `lessons` (per module; tipo online/presencial/mixto; orden; duración).
- `lesson_assets` (file/link; published_at; visibility).
- `live_sessions` (datetime, link, grabación, modalidad).
- `assignments` y `submissions` (estado, feedback, calificación opcional).
- `lesson_notes` (por alumno).
- `course_announcements` (scopes: course / course_run / lesson).
- `certificates` (opcional fase 3).
- Reusar: `courses`, `course_runs/convocatorias`, `students`, `enrollments`, `staff`.

## Endpoints (ejemplos, versión student y manager)
- Student:
  - `GET /api/student/courses` (por enrollment).
  - `GET /api/student/courses/:id` (detalle + módulos + progreso + agenda).
  - `GET /api/student/lessons/:lessonId` (contenido/materiales).
  - `POST /api/student/lessons/:lessonId/notes`
  - `GET /api/student/live-sessions`
  - `GET /api/student/recordings`
  - `POST /api/student/assignments/:id/submissions`
- Manager (backoffice):
  - CRUD módulos/lecciones/materiales/sesiones/assignments/announcements.
  - Gestión de enrollments (conceder/revocar).

## Fases de entrega
1) Fase A (infra + mocks):
   - Sidebar adaptable por feature flag.
   - Páginas mock de Campus Virtual en gestión (panel, cursos, alumnos, anuncios, sesiones, tareas, materiales).
   - Endpoints stub `api/campus/mock/*` para aislar UI mientras se limpian duplicados.
2) Fase B (backend base):
   - Colecciones Payload nuevas (arriba) + RLS por tenant/enrollment.
   - Endpoints student/manager reales (lectura y escritura básica).
3) Fase C (live + foro + certificados):
   - live_sessions con grabaciones; foro/Q&A; reglas de completitud y certificados.
4) Fase D (mejoras):
   - Chat en vivo opcional; integraciones streaming; quizzes.

## Reglas de acceso
- Alumno accede si tiene `enrollment` activo en el curso/convocatoria.
- Gestor/admin: acceso completo. Profesor: acceso a sus cursos/lessons (según staff-role).
- Feature flag `campusVirtual=false` bloquea menús y endpoints para el tenant.

## Menú (backoffice) sugerido
- Campus Virtual
  - Estructura de Cursos
  - Alumnos y Matriculados
  - Anuncios
  - Clases en Vivo / Grabaciones
  - Tareas y Entregas
  - Materiales
  - Certificados (si aplica)

## Plan de trabajo (branching)
- Rama dedicada: `feature/campus-virtual` en worktree limpio `../www.cepcomunicacion.com-campus-virtual`.
- Commits/push solo desde ese worktree para no mezclar con el estado sucio de `main`.
- Cherry-pick solo de cambios necesarios desde el worktree principal.

## Riesgos y mitigaciones
- Warnings por rutas duplicadas (.js/.ts) en apps: limpiar antes de conectar API real.
- Admin Payload actual con errores de build: resolver duplicados y funciones inline.
- Performance streaming/grabaciones: evaluar proveedor externo si se usan live/recordings.

