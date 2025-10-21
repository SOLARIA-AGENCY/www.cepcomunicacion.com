# Documento de Desarrollo – Plataforma CEPComunicacion.com v2

## 1. Visión General

Plataforma integral para la gestión, publicación y promoción de la oferta formativa de CEP FORMACIÓN. Sustituye el antiguo WordPress y unifica en un solo ecosistema la administración de cursos, sedes, campañas publicitarias, leads y analítica.

El sistema estará optimizado para SEO, automatización de marketing y sincronización futura con el campus educativo (`cepformacion.com`) y la Agencia de Colocación.

---

## 2. Objetivos

- Crear una **arquitectura moderna, modular y segura**, basada en TypeScript.
- Permitir **gestión completa** de cursos, sedes, convocatorias, campañas y leads desde un dashboard central.
- Automatizar generación de fichas de curso y anuncios mediante **asistente LLM**.
- Integrar analítica y tracking de campañas sin depender de n8n ni servicios externos.
- Garantizar compatibilidad futura con el campus educativo y los sistemas de inserción laboral.

---

## 3. Stack Tecnológico

| Capa                 | Tecnología                                            | Justificación                                    |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| **Frontend**         | React + TypeScript + Vite + TailwindCSS               | Interfaz rápida, modular y reutilizable.         |
| **Backend / CMS**    | Payload CMS (Node.js + Express)                       | CRUD robusto con panel administrativo integrado. |
| **Base de datos**    | PostgreSQL 16+                                        | Relacional, fiable y escalable.                  |
| **Colas / Jobs**     | BullMQ + Redis                                        | Orquestación interna sin dependencias externas.  |
| **Servidor / Infra** | VPS Ubuntu 22.04 + Docker + Nginx + SSL Let's Encrypt | Control completo y seguridad.                    |
| **Storage Media**    | Local persistente o S3-compatible (MinIO)             | Gestión de assets y backups.                     |
| **LLM API**          | OpenAI / Claude / Ollama local                        | Extracción y generación automática de contenido. |
| **Analítica**        | GA4 + Meta Pixel + Plausible                          | Seguimiento de tráfico y conversiones.           |
| **Notificaciones**   | SMTP (Brevo/Mailgun) + WhatsApp Cloud API             | Automatización de contacto con leads.            |

---

## 4. Arquitectura General

**Monorepo estructurado:**

```
cepcomunicacion/
├─ apps/
│  ├─ web/        # Frontend público (React/Vite)
│  └─ cms/        # Payload CMS (Node)
├─ packages/
│  ├─ ui/         # Design System (Tailwind + Montserrat)
│  ├─ sdk/        # Cliente API para Payload
│  └─ config/     # Configuración compartida (tsconfig, eslint)
├─ infra/         # Docker, Nginx, scripts VPS
└─ .github/       # CI/CD workflows
```

**Servicios:**

- **frontend:** interfaz pública de cursos.
- **cms-api:** Payload CMS y API REST.
- **worker-automation:** colas y tareas automáticas.
- **worker-llm:** procesamiento de ingesta de contenido y generación Ads.
- **db:** PostgreSQL.
- **redis:** almacenamiento de colas.

---

## 5. Frontend – Estructura y Secciones

**Tipografía:** Montserrat (familia completa, jerarquías 12–56px).

### Navegación principal

Inicio · Cursos · Ciclos · Sedes · Agencia de Colocación · Quiénes somos · Blog · FAQ · Contacto · Acceso alumnos

### Taxonomías

- Tipo de oferta: telemático | ocupados | desempleados | privados | ciclo-medio | ciclo-superior
- Modalidad: presencial | semipresencial | telemático
- Familia profesional
- Sede (N sedes configurables)
- Estado de convocatoria: abierta | lista espera | cerrada | planificada

### Estructura de rutas

- `/` – Home
- `/cursos` – Catálogo general
- `/cursos/[slug]` – Ficha de curso
- `/convocatorias/[id]` – Ficha convocatoria
- `/ciclos`, `/ciclos/ciclo-medio`, `/ciclos/ciclo-superior`
- `/sedes`, `/sedes/[slug]`
- `/agencia-colocacion`
- `/quienes-somos`, `/blog`, `/faq`, `/contacto`
- `/gracias`, `/privacidad`, `/cookies`, `/aviso-legal`

### Componentes base

`Hero`, `CourseCard`, `LeadForm`, `CampusCard`, `Syllabus`, `CTAStickyBar`, `FilterPanel`, `Footer`, `Header`, `Modal`, `Toast`, `Loader`, `Table`, `StatsWidget`.

### Formularios de lead

- Campos: nombre, email, teléfono, curso, sede, consentimiento RGPD.
- Tracking automático: UTM, origen, dispositivo.
- Eventos: `generate_lead`, `view_item`, `select_item`.
- Mensajería post-envío: WhatsApp + email automáticos.

---

## 6. Dashboard Administrativo (Payload CMS)

### Roles

Admin · Gestor Académico · Marketing · Asesor Comercial · Lectura

### Módulos principales

1. **Inicio** – KPIs rápidos.
2. **Cursos** – CRUD completo + plantillas estandarizadas.
3. **Convocatorias** – calendario, estado, sede.
4. **Sedes** – CRUD abierto, sin límite de número.
5. **Ciclos** – medio/superior.
6. **Campañas** – generación automática de ads.
7. **Leads** – seguimiento, notas, export.
8. **Analítica** – clics, leads, conversiones.
9. **Contenido** – blog, noticias, FAQ.
10. **Automatización** – configuración APIs externas, plantillas de mensajes, colas.

### Funcionalidades clave

- Versionado y auditoría de cambios.
- Filtros avanzados por tipo, sede, estado.
- Exportaciones CSV/XLSX.
- Integración directa con Mailchimp y WhatsApp Cloud API.
- Estadísticas en tiempo real por curso/campaña/sede.

---

## 7. Automatización interna

Eliminado n8n. Sustituido por **BullMQ + Redis** y workers Node.js.

### Flujos principales

1. **Lead creado** → Envío automático a Mailchimp + WhatsApp + CRM (opcional).
2. **Meta Webhook** → Inserción y confirmación de lead en BD.
3. **Programación automática** de tareas (rollup, backups, fetch de leads Meta, etc.).

### Jobs

- `lead.created`: gestiona automatizaciones post-lead.
- `campaign.sync`: actualiza UTMs y stats.
- `stats.rollup`: consolida métricas por curso/campaña.
- `backup.daily`: export de DB y media.

---

## 8. Ingesta y generación LLM

### Proceso

1. Subida de **PDF** o **texto plano**.
2. Extracción de:
   - Objetivos
   - Temario
   - Requisitos
   - Beneficios
   - Salidas profesionales
3. Generación de:
   - Copy de ficha web (título, descripción, keywords)
   - Textos publicitarios Meta Ads (headline, body, hashtags, CTA)
4. Validación de estilo (RGPD, tono, longitud, coherencia).
5. Previsualización → Aprobación → Publicar.

---

## 9. Seguridad

- HTTPS obligatorio.
- Roles y permisos por campo.
- Logs de acceso y cambios.
- Rate-limit y captcha en formularios.
- Auditoría completa (user, acción, timestamp).
- Backups automáticos.
- RGPD: consentimiento almacenado con IP y fecha.

---

## 10. Analítica y métricas

### Business

- Leads, CTR, CPL estimado.
- Conversión por tipo de curso.
- Rendimiento por sede/campaña.

### Sistema

- Latencia API, colas activas, errores.
- Disponibilidad de servicios.
- Alerta en fallos críticos.

---

## 11. Integraciones externas

- **Meta Ads**: Webhook leads + fetch backup.
- **Mailchimp**: listas y campañas automáticas.
- **WhatsApp Cloud API**: envío programado de mensajes.
- **CRM externo (Pipedrive/HubSpot)**: opcional.
- **GA4 / Plausible**: analítica web.

---

## 12. Roadmap técnico

| Fase | Entregable                                                   | Duración  |
| ---- | ------------------------------------------------------------ | --------- |
| F1   | Infraestructura Docker + Payload CMS base + Postgres + Redis | 1 semana  |
| F2   | Frontend estático + diseño base Montserrat                   | 2 semanas |
| F3   | CRUD cursos/convocatorias/sedes/ciclos + roles               | 2 semanas |
| F4   | Formularios leads + tracking + RGPD                          | 1 semana  |
| F5   | Automatización BullMQ + Mailchimp + WhatsApp                 | 2 semanas |
| F6   | LLM ingest + generación de campañas Ads                      | 2 semanas |
| F7   | Analítica + métricas + exportaciones                         | 1 semana  |
| F8   | QA + hardening + despliegue                                  | 1 semana  |

**Duración total estimada:** 10–11 semanas.

---

## 13. Entregables finales

- Web pública responsive y optimizada.
- Dashboard administrativo completo.
- API REST/GraphQL documentada.
- Workers y colas funcionales.
- LLM ingest automático operativo.
- Integraciones de marketing verificadas.
- Analítica consolidada.
- Sistema de backups y monitoreo.

---

## 14. Mantenimiento y escalabilidad

- Contenedores Docker versionados.
- Actualizaciones seguras vía CI/CD.
- Monitorización de logs y métricas.
- Backups diarios.
- Roadmap de evolución hacia SSO con campus educativo.

---

**Responsable técnico:** Dirección de Tecnología – Solaria Agency\
**Fecha de inicio:** Q4 2025\
**Plataforma:** CEPComunicacion.com v2




# Documento de Desarrollo – Plataforma CEPComunicacion.com v2

## Diagrama de Arquitectura del Sistema

```mermaid
graph TD

%% Nodos principales
A[Usuario Web] -->|HTTP/HTTPS| B[Frontend (React/Vite)]
B -->|API REST / GraphQL| C[Payload CMS / API]
C -->|SQL| D[(PostgreSQL)]
C -->|Media Upload| E[(Storage Local / MinIO)]
C -->|Redis Pub/Sub| F[Worker Automation (BullMQ)]
C -->|Webhook Leads| G[Meta Ads API]
C -->|Webhook Leads| H[Mailchimp API]
C -->|Webhook Leads| I[WhatsApp Cloud API]
C -->|Webhook Leads| J[(CRM externo - opcional)]
C -->|Event| K[Worker LLM Ingest]

%% Workers y procesos
F -->|Queue jobs| D
F -->|Send| H
F -->|Send| I
F -->|Sync| J
K -->|Read/Write| D
K -->|Store Generated Assets| E

%% Analítica y métricas
B -->|Pixel / GA4 / Plausible| L[Analítica]
C -->|Logs & Stats| M[(Prometheus / Grafana opcional)]

%% Infraestructura
subgraph Infraestructura VPS
C
D
E
F
K
end

subgraph Servicios Externos
G
H
I
J
L
M
end
```

### Descripción de flujos

1. **Frontend (React/Vite)**

   - Renderiza páginas públicas y formularios de leads.
   - Se comunica con la API de Payload mediante REST o GraphQL.

2. **Payload CMS / API**

   - Gestiona cursos, sedes, campañas, leads y usuarios.
   - Expone endpoints seguros con roles y permisos.

3. **PostgreSQL**

   - Base de datos principal con relaciones entre cursos, sedes, convocatorias, campañas y leads.

4. **Storage Local / MinIO**

   - Almacena imágenes, PDFs, assets y ficheros generados por LLM.

5. **Worker Automation (BullMQ)**

   - Procesa colas de automatización: envío de emails, WhatsApp, Mailchimp, CRM y estadísticas.

6. **Worker LLM Ingest**

   - Extrae datos de PDFs o texto.
   - Genera descripciones, objetivos, temarios y copies para campañas.

7. **Integraciones externas**

   - Meta Ads API: recepción de leads y tracking.
   - Mailchimp: alta automática de contactos.
   - WhatsApp Cloud API: mensajería automatizada.
   - CRM (Pipedrive / HubSpot): sincronización de oportunidades.

8. **Analítica y monitoreo**

   - GA4, Meta Pixel y Plausible: tracking de usuarios y conversiones.
   - Prometheus / Grafana: métricas internas del sistema (opcional).

### Seguridad e Infraestructura

- Todos los servicios bajo HTTPS gestionado por Nginx.
- Tokens y credenciales en Docker secrets.
- Backups automáticos de PostgreSQL y media.
- Firewalls y roles mínimos por contenedor.

---

Este diagrama refleja la comunicación completa entre el **frontend**, el **CMS Payload**, los **workers internos**, y las **integraciones externas** sin dependencia de plataformas de terceros como n8n.



# Documento de Desarrollo – Plataforma CEPComunicacion.com v2

## Diagrama de Flujo de Datos (DFD) – Creación de Curso → Publicación → Campañas Ads

```mermaid
flowchart LR

%% Inicio: creación de curso
A[Usuario Dashboard\n(Admin/Marketing)] --> B[Formulario Crear Curso\n(Payload Admin)]
B -->|Guardar Borrador| C[(PostgreSQL)]
B -->|Adjunta PDF/URL| D[Worker LLM Ingest]

D -->|Extrae objetivos, temario, requisitos, salidas| E[Normalizador]
E -->|Campos validados| C
E -->|Genera variantes Ads\n(headlines, primary text, hashtags, CTA)| F[Plantillas Ads]
F --> C

%% Revisión y publicación
A --> G[Revisión de Contenido\n(Checklist + Previsualización)]
G -->|Publicar Curso| C
G -->|Crear Convocatoria| H[Formulario Convocatoria]
H -->|Guardar| C

%% Generación automática de campaña
G --> I[Generar Campaña]
I -->|Construye UTMs + Nombre Formulario Meta + Pixel Tags| J[Config Campaña]
J --> C

%% Frontend y captación
K[Frontend Web\n(React/Vite)] -->|GET /courses /runs| C
K -->|Vista Ficha Curso/Convocatoria| L[Usuario Visitante]
L -->|Enviar Lead (form)| M[API Leads (Payload)]
M -->|Insert lead| C
M -->|Evento lead.created| N[Worker Automation]

%% Automatización post-lead
N -->|Upsert| O[Mailchimp API]
N -->|Enviar template| P[WhatsApp Cloud API]
N -->|Upsert (opcional)| Q[CRM Externo]
N -->|Registrar| R[(Logs/Metrics)]

%% Analítica y reporting
K --> S[GA4/Meta Pixel/Plausible]
N --> T[Rollup Stats]
T --> C
```

### Etapas clave

1. **Creación de curso**: el usuario completa campos mínimos y puede adjuntar PDF/URL. El LLM extrae y normaliza contenido hacia la estructura estándar.
2. **Revisión**: previsualización de ficha web y variantes Ads. Check de campos obligatorios y RGPD.
3. **Publicación**: el curso pasa a estado `publicado` y se crean **convocatorias** por sede o telemático.
4. **Campaña**: se generan UTMs, nombres de formularios Meta y pixel tags a partir de la plantilla; quedan listas para activación.
5. **Captación**: la web muestra el curso y sus convocatorias. Los leads se registran por API segura.
6. **Automatización**: tras el lead, se disparan envíos a Mailchimp/WhatsApp/CRM y se consolidan métricas.

### Datos principales en tránsito

- **Curso**: título, familia, tipo oferta, modalidad, resumen, objetivos, temario, requisitos, salidas, medios, SEO.
- **Convocatoria**: sede (si aplica), fechas, horario, plazas, precio/financiación, estado.
- **Campaña**: UTMs, pixel events, naming de formulario, lista Mailchimp objetivo.
- **Lead**: datos personales, consentimiento, UTM/source, curso/convocatoria.

### Controles de calidad

- Validaciones de longitud por campo y formato.
- Detección de duplicados (slug/curso).
- Auditoría y versionado por registro.
- Idempotencia en webhook y en colas.

---

Este DFD muestra el ciclo completo desde **borrador** hasta **captación y automatización**, asegurando consistencia de datos y trazabilidad end-to-end sin dependencias externas como n8n.







# Esquema de Colecciones y Campos – Payload + PostgreSQL

> Tipado TypeScript y validaciones. Todos los modelos con `timestamps`, `versioning` y `auditLog`.

## 1) Users
- `id: uuid`
- `email: email` (único, requerido)
- `password: string` (hashed)
- `role: enum('admin','gestor','marketing','asesor','lectura')`
- `name: string`
- `twoFAEnabled: boolean`
- `status: enum('active','suspended')`
- `lastLoginAt: datetime`
- Índices: `email_unique`, `role_idx`, `status_idx`

## 2) Campuses (Sedes)
- `id: uuid`
- `slug: string` (único, requerido)
- `name: string` (requerido)
- `address: string`
- `city: string`
- `province: string`
- `zip: string`
- `geo: point` (lat, lng)
- `transport: text[]` (líneas, aparcamiento)
- `contactPhone: string`
- `contactEmail: email`
- `openingHours: json`
- `visible: boolean` (default true)
- Índices: `slug_unique`, `geo_idx`

## 3) Courses (Curso base)
- `id: uuid`
- `slug: string` (único, requerido)
- `title: string` (requerido)
- `subtitle: string`
- `family: enum('sanidad','estetica','veterinaria','logistica','administracion','bienestar','otros')`
- `offerType: enum('telematico','ocupados','desempleados','privados','ciclo-medio','ciclo-superior')` (requerido)
- `modality: enum('presencial','semipresencial','telematico')` (requerido)
- `summary: text` (requerido, 160–320 chars recomendado)
- `objectives: text[]` (min 3, max 8)
- `syllabus: text[]` (min 6, max 16)
- `requirements: text[]`
- `outcomes: text[]` (salidas profesionales)
- `benefits: text[]` (checklist)
- `durationHours: int` (opcional)
- `docs: media[]` (PDF temario, guía)
- `coverImage: media`
- `faqs: json[]` ({q, a})
- `isCampusIndependent: boolean` (default false) – telemático = true
- `seo: { title, description, keywords[], ogImage }`
- `adsTemplateRef: relationship('ads-templates')`
- `status: enum('draft','review','published','archived')` (default 'draft')
- Índices: `slug_unique`, `offerType_idx`, `modality_idx`, `status_idx`

## 4) CourseRuns (Convocatorias)
- `id: uuid`
- `course: relationship('courses')` (requerido)
- `campus: relationship('campuses')` (opcional si telemático)
- `startDate: date` (requerido)
- `endDate: date`
- `schedule: string` (ej. "Jueves tarde")
- `seats: int`
- `price: numeric(10,2)` (si privados)
- `funding: enum('SEPE','SCE','Privado','Mixto')`
- `state: enum('abierta','lista_espera','cerrada','planificada')` (default 'abierta')
- `leadForm: json` (campos adicionales si aplica)
- `attachments: media[]`
- `notes: text`
- Índices: `course_idx`, `campus_idx`, `date_idx`, `state_idx`

## 5) Cycles (Ciclos formativos)
- `id: uuid`
- `slug: string` (único, requerido)
- `title: string`
- `level: enum('medio','superior')` (requerido)
- `modules: json[]` ({title, contents[]})
- `officialRequirements: text[]`
- `fctHours: int`
- `outcomes: text[]`
- `docs: media[]`
- `seo: { title, description, keywords[], ogImage }`
- `status: enum('draft','review','published','archived')`
- Índices: `slug_unique`, `level_idx`, `status_idx`

## 6) Campaigns (Campañas)
- `id: uuid`
- `season: enum('invierno','primavera','verano','otono')`
- `year: int`
- `status: enum('planificada','activa','pausada','finalizada')`
- `trackingTag: string` (formato: `${season}-${year}-${slug}`)
- `utm: json` ({source, medium, campaign, content})
- `pixelIds: json` ({meta: string, ...})
- `mailchimpList: string`
- `relatedCourses: relationship('courses')[]`
- Índices: `season_year_idx`, `status_idx`

## 7) AdsTemplates (Plantillas Ads)
- `id: uuid`
- `name: string`
- `type: enum('telematico','ocupados','desempleados','privados','ciclo')`
- `headlines: string[]` (3–5)
- `primaryTexts: text[]` (3–5)
- `descriptions: string[]` (opc.)
- `hashtags: string[]`
- `cta: enum('Más información','Solicitar información','Inscríbete ahora','Reserva tu plaza')`
- `policyNotes: text` (restricciones copy)
- `pixelEvents: string[]`
- Índices: `type_idx`

## 8) Leads
- `id: uuid`
- `name: string` (requerido)
- `email: email` (requerido)
- `phone: string`
- `source: enum('meta','seo','direct','referral','other')` (default 'meta')
- `utm: json` ({source, medium, campaign, content, term})
- `campaign: relationship('campaigns')`
- `courseRun: relationship('course-runs')` (requerido)
- `consent: boolean` (requerido)
- `status: enum('new','contacted','qualified','enrolled','lost')` (default 'new')
- `notes: text`
- `externalId: string` (idempotencia webhook)
- Índices: `courseRun_idx`, `status_idx`, `email_idx`, `externalId_unique`

## 9) BlogPosts / News
- `id: uuid`
- `slug: string` (único)
- `title: string`
- `excerpt: string`
- `content: richtext`
- `coverImage: media`
- `tags: string[]`
- `status: enum('draft','review','published','archived')`
- Índices: `slug_unique`, `status_idx`

## 10) Pages (Corporativas/Legales)
- `id: uuid`
- `slug: string` (único)
- `title: string`
- `content: richtext`
- `seo: { title, description, keywords[], ogImage }`
- Índices: `slug_unique`

## 11) Settings (Globales)
- `branding: json` (colores, logo, tipografía UI)
- `seoDefaults: json` (titleSuffix, ogImageDefault)
- `integrations: json` ({ga4Id, plausibleDomain, metaPixelId, mailchimp, whatsapp, smtp, crm})
- `privacy: json` (textos legales, versión)

## 12) Events (Tracking on-site)
- `id: uuid`
- `type: enum('page_view','click_cta','lead_submit','form_error')`
- `sessionId: string`
- `path: string`
- `referrer: string`
- `props: json` ({course, run, campus, device, abVariant})
- `utm: json`
- `createdAt: datetime`
- Índices: `type_idx`, `createdAt_idx`, `path_idx`

---

### Reglas y validaciones
- **Courses**: `summary` 160–320 chars; `objectives` min 3; `syllabus` min 6.
- **CourseRuns**: `startDate` ≤ `endDate`; si `course.isCampusIndependent === false` → `campus` requerido.
- **Leads**: `consent === true` obligatorio. `externalId` único si llega desde Meta webhook.
- **AdsTemplates**: al menos 3 `headlines` y 3 `primaryTexts`.
- **Blog/News**: `slug` único.

### Hooks Payload (pseudocódigo)
- `courses.afterChange`: si `status === 'published'` → revalidar caché frontend.
- `leads.afterChange`: encolar `lead.created` (BullMQ) con `{ leadId }`.
- `course-runs.beforeValidate`: autocompletar `state` por fechas.
- `campaigns.beforeChange`: generar UTMs si faltan.

### Índices recomendados (PostgreSQL)
- B-tree por `slug`, `status`, `offerType`, `modality`, `startDate`.
- GIN para `tags` y campos `json` consultados frecuentemente.
- Extension `pg_trgm` para búsqueda por `title`/`slug`.

### Seguridad y auditoría
- `access control` por rol y acción.
- `versioning` habilitado en `courses`, `course-runs`, `campaigns`.
- `auditLog` colección aparte (opcional) para registrar `{user, action, entity, diff}`.

---

Este esquema define los **tipos exactos y validaciones** para implementar en Payload + PostgreSQL, manteniendo coherencia con el frontend y los procesos de automatización internos.

# 🎨 GLASS IOS 22+ CARD DESIGN - DOCUMENTACIÓN COMPLETA

## 📋 Información General

**Nombre del Componente:** `CursoGlassCard`  
**Categoría:** Glassmorphism Modern  
**Framework:** React + TypeScript + Tailwind CSS  
**Estilo:** iOS 22+ Glassmorphism  
**Fecha de Creación:** 2025  
**Última Actualización:** Octubre 2025  

---

## 🎯 Descripción del Diseño

El **Glass iOS 22+ Card** es un componente moderno que implementa el estilo glassmorphism característico de iOS 22+, con efectos de transparencia, blur y sombras suaves. Está optimizado para mostrar información de cursos con una experiencia visual premium.

### Características Principales:
- ✨ **Glassmorphism Effect**: Fondo semi-transparente con blur
- 📱 **Responsive Design**: Optimizado para móvil, tablet y desktop
- 🎨 **Dynamic Colors**: Colores adaptativos según tipo de curso
- 🖼️ **Image Overlay**: Gradientes y overlays dinámicos
- 💫 **Hover Effects**: Animaciones suaves al interactuar
- 🎯 **Interactive Elements**: Botones con efectos hover
- 📊 **Real-time Data**: Información dinámica de likes y fechas

---

## 🏗️ Estructura del Componente

```tsx
interface CursoGlassCardProps {
  curso: CursoMaestro | CursoUnificado;
  showEmploymentType?: boolean;
  employmentFilter?: EmploymentStatus;
  fixedTimestamp?: string;
}
```

### Dependencias Requeridas:

```json
{
  "react": "^19.1.0",
  "lucide-react": "^0.536.0",
  "tailwindcss": "^3.3.6"
}
```

### Hooks Personalizados Necesarios:
- `useLikes`: Para gestión de likes
- `useTimeReal`: Para fechas dinámicas

---

## 🎨 Estilos CSS/Tailwind Completos

### Container Principal:
```css
/* Estilos base del card */
.glass-card {
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.20);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.5s ease;
}

/* Hover effects */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.20);
  border-color: rgba(255, 255, 255, 0.30);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.20);
  transform: scale(1.02);
}
```

### Barra Glassmorphism Inferior:
```css
/* Barra glass con información */
.glass-bar {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.30);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
}

/* Botones de acción en barra */
.action-button {
  background: rgba(255, 255, 255, 0.40);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 12px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  transition: transform 0.2s ease;
}

.action-button:hover {
  transform: scale(1.10);
}
```

### Etiquetas y Badges:
```css
/* Etiqueta de fecha */
.date-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

/* Etiqueta de precio/gratuito */
.price-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background: #dc2626; /* red-600 */
}
```

### Overlay de Imagen:
```css
/* Overlay gradiente */
.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 70%,
    rgba(0, 0, 0, 0.30) 100%
  );
  transition: all 0.3s ease;
}

.image-overlay:hover {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.40) 100%
  );
}
```

---

## 🖥️ Código JSX Completo para Reutilización

```tsx
import React, { useState } from 'react';
import { MapPin, Globe, Phone, Heart } from "lucide-react";

interface GlassCardProps {
  // Props básicas requeridas
  title: string;
  image: string;
  sede: string;
  modalidad: string;
  fechaInicio: string;
  precio?: string;
  plazasDisponibles?: string;
  slug: string;
  categoria: string;
  
  // Props opcionales
  showLikes?: boolean;
  employmentFilter?: 'ocupados' | 'desempleados';
  onLike?: (liked: boolean) => void;
  onView?: (slug: string) => void;
}

export default function GlassCard({
  title,
  image,
  sede,
  modalidad,
  fechaInicio,
  precio,
  plazasDisponibles,
  slug,
  categoria,
  showLikes = true,
  employmentFilter,
  onLike,
  onView
}: GlassCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Sistema de colores dinámicos
  const getColorScheme = () => {
    if (employmentFilter === 'ocupados') {
      return {
        primary: 'bg-green-600 hover:bg-green-700',
        text: 'text-green-600',
        title: 'text-green-600'
      };
    }
    if (employmentFilter === 'desempleados') {
      return {
        primary: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-600',
        title: 'text-blue-600'
      };
    }
    return {
      primary: 'bg-pink-600 hover:bg-pink-700',
      text: 'text-pink-600',
      title: 'text-pink-600'
    };
  };

  const colorScheme = getColorScheme();

  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'PRÓXIMAMENTE';
    try {
      const date = new Date(dateString);
      const today = new Date();
      const formatted = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      if (date > today) return formatted;
      if (date < today) return formatted;
      return 'PRÓXIMAMENTE';
    } catch {
      return 'PRÓXIMAMENTE';
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(!isLiked);
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 hover:border-white/30 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen y overlay */}
      <div className="relative">
        <img
          src={image}
          alt={`Imagen de ${title}`}
          className="w-full aspect-[4/3] object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Curso';
          }}
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 group-hover:to-black/40 transition-all duration-300"></div>

        {/* Etiqueta de fecha */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-green-600">
          {formatDate(fechaInicio)}
        </div>

        {/* Etiqueta de precio si existe */}
        {precio && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600">
            {precio}
          </div>
        )}

        {/* Etiqueta de plazas disponibles */}
        {plazasDisponibles && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600 animate-pulse">
            {plazasDisponibles}
          </div>
        )}

        {/* BARRA GLASSMORPHISM CON ICONOS */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[92%]">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              {/* Información del curso */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white/40 border border-white/60">
                  <MapPin className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                </span>
                <div className="text-[13px] font-medium">
                  <div className="text-[#f2014b] font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {sede.toUpperCase()}
                  </div>
                  <div className="text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {modalidad}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onView?.(slug)}
                  className="w-8 h-8 rounded-xl grid place-items-center bg-white/40 border border-white/55 hover:scale-110 transition-transform"
                >
                  <Globe className="w-4 h-4 text-white drop-shadow-sm" />
                </button>

                <a
                  href="tel:+34922219257"
                  className="w-8 h-8 rounded-xl grid place-items-center bg-white/40 border border-white/55 hover:scale-110 transition-transform"
                >
                  <Phone className="w-4 h-4 text-white drop-shadow-sm" />
                </a>

                {showLikes && (
                  <button
                    onClick={handleLike}
                    className={`w-8 h-8 rounded-xl grid place-items-center transition-all hover:scale-110 ${
                      isLiked
                        ? 'bg-[#f2014b] border border-[#f2014b]/60'
                        : 'bg-white/40 border border-white/55'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${
                        isLiked ? 'text-white fill-white' : 'text-white'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 sm:p-6 flex-grow flex flex-col bg-white/20 backdrop-blur-sm border-t border-white/10">
        <h3 className={`text-lg font-bold mb-2 uppercase line-clamp-2 min-h-[3rem] ${colorScheme.title}`}>
          {title.toUpperCase()}
        </h3>

        {/* Información adicional */}
        <div className="space-y-2 mb-4">
          <div className="text-xs">
            <span className="font-semibold text-gray-700 uppercase">TIPO DE FORMACIÓN: </span>
            <span className="font-bold text-gray-800 uppercase">{modalidad}</span>
          </div>

          <div className="text-xs">
            <span className="font-semibold text-gray-700 uppercase">FECHA DE INICIO: </span>
            <span className={`font-bold uppercase ${
              formatDate(fechaInicio) === 'PRÓXIMAMENTE'
                ? 'text-gray-500'
                : 'text-green-600'
            }`}>
              {formatDate(fechaInicio)}
            </span>
          </div>
        </div>

        <button
          onClick={() => onView?.(slug)}
          className={`w-full py-2 px-4 rounded-lg transition-colors font-semibold text-center text-sm sm:text-base mt-auto ${colorScheme.primary} text-white`}
        >
          VER CURSO COMPLETO
        </button>
      </div>
    </div>
  );
}
```

---

## 📚 Guía de Implementación

### 1. **Instalación de Dependencias:**

```bash
npm install lucide-react tailwindcss
```

### 2. **Configuración de Tailwind:**

Asegúrate de tener estas configuraciones en `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        'xs': '2px',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.10)',
        'glass-hover': 'rgba(255, 255, 255, 0.20)',
      }
    },
  },
  plugins: [],
}
```

### 3. **Uso Básico:**

```tsx
import GlassCard from './components/GlassCard';

function MyComponent() {
  const courseData = {
    title: "Curso de Desarrollo Web",
    image: "/images/curso.jpg",
    sede: "Santa Cruz",
    modalidad: "Presencial",
    fechaInicio: "2025-02-15",
    precio: "GRATUITO",
    plazasDisponibles: "PLAZAS LIMITADAS",
    slug: "desarrollo-web",
    categoria: "tecnologia"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GlassCard {...courseData} />
    </div>
  );
}
```

### 4. **Personalización Avanzada:**

```tsx
// Con callbacks personalizados
<GlassCard
  {...courseData}
  onLike={(liked) => console.log('Liked:', liked)}
  onView={(slug) => navigate(`/course/${slug}`)}
  employmentFilter="desempleados"
  showLikes={true}
/>
```

---

## 🎨 Paleta de Colores

### Esquema de Colores Principal:
```css
/* Colores base glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.10);
--glass-bg-hover: rgba(255, 255, 255, 0.20);
--glass-border: rgba(255, 255, 255, 0.20);
--glass-border-hover: rgba(255, 255, 255, 0.30);
--glass-shadow: rgba(0, 0, 0, 0.15);

/* Colores por tipo de curso */
--color-ocupados: #16a34a;      /* green-600 */
--color-desempleados: #2563eb;  /* blue-600 */
--color-general: #db2777;      /* pink-600 */
--color-accent: #f2014b;       /* Brand color */

/* Estados */
--color-future: #16a34a;       /* green-600 */
--color-past: #dc2626;         /* red-600 */
--color-soon: #6b7280;         /* gray-500 */
```

---

## 📱 Responsive Design

### Breakpoints:
- **Mobile (< 640px)**: 1 columna, padding reducido
- **Tablet (640px - 1024px)**: 2 columnas, elementos medianos
- **Desktop (> 1024px)**: 3 columnas, elementos completos

### Aspect Ratio:
- **Imagen**: 4:3 (aspect-[4/3])
- **Card completa**: Altura flexible (h-full)

---

## ⚡ Optimizaciones de Performance

### 1. **Lazy Loading:**
```tsx
<img
  loading="lazy"
  decoding="async"
  onError={handleImageError}
/>
```

### 2. **Memoización:**
```tsx
const MemoizedGlassCard = React.memo(GlassCard);
```

### 3. **CSS Optimizations:**
- Usa `backdrop-filter` con moderación
- Implementa `will-change` para animaciones
- Utiliza `transform` en lugar de propiedades de posición

---

## 🔧 Personalizaciones Comunes

### Cambiar Colores:
```tsx
const customColorScheme = {
  primary: 'bg-purple-600 hover:bg-purple-700',
  text: 'text-purple-600',
  title: 'text-purple-600'
};
```

### Modificar Blur Effect:
```css
.glass-card {
  backdrop-filter: blur(8px); /* Menos blur */
  /* o */
  backdrop-filter: blur(16px); /* Más blur */
}
```

### Ajustar Bordes:
```css
.glass-card {
  border-radius: 8px; /* Menos redondeado */
  /* o */
  border-radius: 20px; /* Más redondeado */
}
```

---

## 🐛 Solución de Problemas

### Problema: Glass effect no funciona en Safari
**Solución:** Añade prefijos webkit:
```css
.glass-card {
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
```

### Problema: Texto no legible sobre imagen
**Solución:** Ajusta el overlay:
```css
.image-overlay {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0.4) 100%
  );
}
```

### Problema: Animaciones lag en móviles
**Solución:** Reduce complejidad:
```css
.glass-card:hover {
  transform: none; /* Desactiva scale en móviles */
}
```

---

## 📄 Licencia y Créditos

**Creado por:** SOLARIA.AGENCY  
**Framework:** React + TypeScript  
**Styling:** Tailwind CSS  
**Icons:** Lucide React  
**Fecha:** Octubre 2025  

**Licencia:** MIT - Libre para uso comercial y personal.


