# 🎯 PROMPT SPEC-DRIVEN: CEPComunicacion v2

**Proyecto:** Plataforma integral de gestión formativa CEPComunicacion.com v2
**Metodología:** Spec-Driven Development (SDD)
**Fecha inicio:** Q4 2025
**Responsable técnico:** Solaria Agency

---

## 📋 CONTEXTO Y OBJETIVO

Vamos a desarrollar una plataforma moderna para CEP FORMACIÓN siguiendo estrictamente la metodología **Spec-Driven Development**, utilizando los MCPs disponibles para asegurar que **TODAS las especificaciones estén completas y validadas ANTES de escribir código**.

### Documento Base
Lee y analiza el documento completo: `/Users/carlosjperez/Desktop/cepcomunicacion_v_2_desarrollo.md`

### Stack Tecnológico Definido
- **Frontend:** React 18+ + TypeScript + Vite + TailwindCSS
- **Backend/CMS:** Payload CMS (Node.js + Express)
- **Base de datos:** PostgreSQL 16+
- **Colas/Jobs:** BullMQ + Redis
- **Servidor:** VPS Ubuntu 22.04 + Docker + Nginx + SSL
- **LLM:** OpenAI / Claude / Ollama
- **Analítica:** GA4 + Meta Pixel + Plausible

---

## 🎯 FASE 0: ANÁLISIS Y PLANIFICACIÓN COMPLETA (SIN CÓDIGO)

### OBJETIVO
Crear un set completo de especificaciones técnicas, arquitecturales y funcionales que permitan desarrollar el proyecto sin ambigüedades.

---

## 📝 TAREAS SECUENCIALES OBLIGATORIAS (Usa Sequential Thinking MCP)

### **TAREA 1: Análisis Exhaustivo del Documento**

Usa el **Sequential Thinking MCP** para:

1. **Descomponer el proyecto** en componentes principales
2. **Identificar dependencias** entre módulos
3. **Detectar ambigüedades** o requisitos faltantes
4. **Priorizar** componentes críticos vs. secundarios
5. **Validar** coherencia del stack tecnológico con requisitos

**Prompt para Sequential Thinking:**
```
Analiza el documento /Users/carlosjperez/Desktop/cepcomunicacion_v_2_desarrollo.md y descompón el proyecto CEPComunicacion v2 en:
1. Componentes principales (Frontend, Backend, Workers, LLM, Infra)
2. Dependencias críticas entre componentes
3. Requisitos ambiguos que necesitan clarificación
4. Orden lógico de desarrollo (DAG de dependencias)
5. Riesgos técnicos identificables

Estructura tu razonamiento paso a paso, explorando alternativas y refinando el análisis.
```

**OUTPUT ESPERADO:**
- Árbol de componentes con dependencias
- Lista de preguntas para resolver ambigüedades
- Orden de desarrollo óptimo
- Documento de riesgos técnicos

---

### **TAREA 2: Crear Tareas Maestras con Task Master MCP**

Usa el **Task Master MCP** para:

1. Crear tareas principales del proyecto
2. Descomponer en subtareas
3. Establecer dependencias
4. Asignar prioridades
5. Estimar esfuerzos

**Prompt para Task Master:**
```
Crea un plan de tareas completo para CEPComunicacion v2 basado en el análisis previo. Estructura las tareas en:

FASE 1: ESPECIFICACIONES (Sin código)
- Arquitectura de sistema
- Diseño de base de datos
- API contracts
- Componentes UI
- Flujos de automatización
- Seguridad y RGPD
- Analítica y métricas

FASE 2-8: DESARROLLO (Según roadmap del documento)

Para cada tarea define:
- Descripción clara
- Criterios de aceptación
- Dependencias
- Estimación de esfuerzo
- Etiquetas (frontend/backend/infra/llm/security)
```

**OUTPUT ESPERADO:**
- Sistema de tareas jerarquizado
- Dependencias mapeadas
- Estimaciones por fase
- Criterios de aceptación claros

---

### **TAREA 3: Generar Especificaciones con Spec-Kit MCP**

Usa el **Spec-Kit MCP** para crear especificaciones formales:

#### **3.1 Especificación de Arquitectura**
```
Genera una especificación técnica completa de la arquitectura de CEPComunicacion v2 incluyendo:

1. DIAGRAMA DE ARQUITECTURA
   - Componentes principales (Frontend, CMS, Workers, DB, Redis)
   - Comunicación entre servicios
   - Puertos y protocolos
   - Docker containers

2. DIAGRAMAS DE FLUJO
   - Usuario web → Frontend → API → DB
   - Lead creado → Workers → Integraciones externas
   - Ingesta PDF → LLM → Generación contenido

3. DECISIONES ARQUITECTURALES
   - Justificación de cada tecnología
   - Alternativas consideradas
   - Trade-offs aceptados

4. ESCALABILIDAD
   - Horizontal vs. vertical
   - Caching estrategias
   - CDN para assets

5. SEGURIDAD
   - Capas de seguridad
   - Autenticación/Autorización
   - HTTPS/TLS
   - Secrets management
```

#### **3.2 Especificación de Base de Datos**
```
Genera una especificación completa del esquema PostgreSQL incluyendo:

1. DIAGRAMA ERD COMPLETO
   - Todas las 12 colecciones definidas
   - Relaciones (1:1, 1:N, N:M)
   - Cardinalidades
   - Claves foráneas

2. DEFINICIÓN DE TABLAS
   - DDL SQL completo para cada tabla
   - Tipos de datos exactos
   - Constraints (NOT NULL, UNIQUE, CHECK)
   - Valores por defecto

3. ÍNDICES
   - B-tree para búsquedas exactas
   - GIN para full-text search
   - Índices compuestos para queries frecuentes
   - EXPLAIN ANALYZE de queries críticas

4. MIGRACIONES
   - Script de creación inicial (001_create_tables.sql)
   - Scripts de seed data (002_seed_data.sql)
   - Estrategia de versionado
   - Rollback plan

5. VALIDACIONES
   - Check constraints (ej: start_date < end_date)
   - Triggers para timestamps
   - Función de auditoría
```

#### **3.3 Especificación de API REST/GraphQL**
```
Genera especificación OpenAPI 3.0 completa para Payload CMS API incluyendo:

1. ENDPOINTS REST
   - GET /api/courses (lista con filtros)
   - GET /api/courses/:slug (detalle)
   - POST /api/leads (crear lead con validación)
   - GET /api/campuses (sedes)
   - GET /api/course-runs (convocatorias)
   - POST /api/campaigns/generate-ads (LLM)

2. SCHEMAS
   - RequestBody schemas con validaciones
   - Response schemas tipados
   - Error schemas (4xx, 5xx)

3. AUTENTICACIÓN
   - JWT Bearer token
   - Refresh token flow
   - Rate limiting por endpoint

4. CONTRATOS DE API
   - Request/Response examples
   - Status codes esperados
   - Headers requeridos

5. DOCUMENTACIÓN INTERACTIVA
   - Swagger UI embebido
   - Postman collection exportable
```

#### **3.4 Especificación de Frontend (React)**
```
Genera especificación completa del frontend incluyendo:

1. ARQUITECTURA DE COMPONENTES
   - Atomic Design (Atoms, Molecules, Organisms, Templates, Pages)
   - Estructura de carpetas
   - Component hierarchy

2. COMPONENTES BASE (Documentados con Storybook)
   - Hero (props, variants, examples)
   - CourseCard (GlassCard iOS 22+ spec incluida)
   - LeadForm (validaciones Zod)
   - FilterPanel (multi-select)
   - Header, Footer, Modal, Toast, Loader

3. PÁGINAS Y RUTAS
   - / (Home)
   - /cursos (lista con filtros)
   - /cursos/:slug (detalle)
   - /sedes, /ciclos, /blog, /contacto
   - /gracias, /privacidad, /cookies

4. STATE MANAGEMENT
   - React Context para global state
   - TanStack Query para server state
   - Zustand para UI state (opcional)

5. TRACKING EVENTS
   - page_view, lead_submit, cta_click
   - GA4, Meta Pixel, Plausible integration

6. ACCESIBILIDAD (WCAG 2.1 AA)
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation
   - Color contrast ratios
```

#### **3.5 Especificación de Workers (BullMQ)**
```
Genera especificación completa de workers incluyendo:

1. JOBS DEFINIDOS
   - lead.created (payload, retry policy)
   - campaign.sync (cron schedule)
   - stats.rollup (aggregation queries)
   - backup.daily (S3 upload)

2. COLAS (Queues)
   - Naming convention
   - Prioridades
   - Concurrencia
   - Rate limiting

3. INTEGRACIONES EXTERNAS
   - Mailchimp API (endpoints, auth)
   - WhatsApp Cloud API (message templates)
   - Meta Ads API (webhook verification)

4. ERROR HANDLING
   - Retry strategy (exponential backoff)
   - Dead letter queue
   - Alertas en failures críticos

5. MONITOREO
   - BullBoard dashboard
   - Métricas: jobs/sec, latency, failures
```

#### **3.6 Especificación de LLM Ingest**
```
Genera especificación completa del sistema LLM incluyendo:

1. FLUJO DE INGESTA
   - Upload PDF → Parse text
   - Chunking estrategia
   - Prompt engineering templates

2. EXTRACCIÓN DE DATOS
   - Objetivos (lista bullets)
   - Temario (estructura jerárquica)
   - Requisitos, salidas profesionales

3. GENERACIÓN DE ADS
   - Headlines (3-5, max 40 chars)
   - Primary texts (3-5, max 125 chars)
   - Hashtags (5-10)
   - CTA options

4. VALIDACIÓN POST-LLM
   - Schema validation (Zod)
   - RGPD compliance check
   - Tone and style validation

5. RATE LIMITING Y COSTOS
   - Tokens por request
   - Cache de prompts
   - Fallback a modelos locales (Ollama)
```

#### **3.7 Especificación de Seguridad y RGPD**
```
Genera especificación completa de seguridad incluyendo:

1. AUTENTICACIÓN
   - JWT access token (15min expiry)
   - Refresh token (7 days)
   - Password hashing (bcrypt rounds: 12)

2. AUTORIZACIÓN (RBAC)
   - Roles: admin, gestor, marketing, asesor, lectura
   - Permisos por colección
   - Permisos por campo

3. RATE LIMITING
   - API pública: 100 req/15min
   - Auth endpoints: 5 req/15min
   - Forms: 3 req/1hour

4. CAPTCHA
   - hCaptcha en formularios
   - Verificación server-side

5. AUDITORÍA
   - Tabla audit_log (user, action, entity, timestamp)
   - Retention: 2 años

6. RGPD
   - Consentimiento con IP y timestamp
   - Right to be forgotten (anonimización)
   - Data portability (export JSON)
```

#### **3.8 Especificación de Analítica**
```
Genera especificación completa de analítica incluyendo:

1. EVENTOS TRACKEADOS
   - page_view, lead_submit, cta_click, course_view
   - Parámetros por evento

2. MÉTRICAS DE NEGOCIO
   - Leads totales, por sede, por curso
   - CTR, CPL, conversion rate
   - SQL queries para dashboards

3. MÉTRICAS DE SISTEMA
   - API latency (p95, p99)
   - Error rate
   - Active jobs (BullMQ)
   - DB connection pool

4. DASHBOARDS
   - Grafana templates
   - Alertas configuradas
```

#### **3.9 Especificación de Infraestructura (Docker)**
```
Genera especificación completa de infraestructura incluyendo:

1. DOCKER COMPOSE
   - Services: frontend, cms, worker-automation, worker-llm, db, redis
   - Networks (internal, external)
   - Volumes (postgres-data, redis-data, uploads)

2. NGINX CONFIGURATION
   - Reverse proxy a frontend (puerto 80/443)
   - Proxy pass a CMS API (/api)
   - SSL Let's Encrypt
   - Headers de seguridad

3. CI/CD PIPELINE
   - GitHub Actions workflow
   - Build Docker images
   - Push to registry
   - Deploy to VPS

4. BACKUP STRATEGY
   - PostgreSQL dump diario (03:00)
   - Upload a S3
   - Retention: 30 días
   - Test restore mensual
```

**OUTPUT ESPERADO DE SPEC-KIT:**
- 9 documentos de especificación completos
- Diagramas en Mermaid/PlantUML
- Código de ejemplo (NO producción, solo referencia)
- Criterios de aceptación por módulo

---

### **TAREA 4: Obtener Documentación Técnica con Context7 MCP**

Usa **Context7 MCP** para obtener documentación actualizada de las tecnologías:

```
Para cada tecnología del stack, obtén documentación y mejores prácticas:

1. Payload CMS
   - Colecciones con TypeScript
   - Hooks (beforeValidate, afterChange)
   - Access control avanzado
   - Versioning y drafts

2. BullMQ
   - Workers pattern
   - Retry strategies
   - Event listeners
   - BullBoard setup

3. Zod
   - Schema validation
   - Transform y refine
   - Error messages customizados

4. TanStack Query
   - useQuery, useMutation
   - Cache invalidation
   - Optimistic updates

5. TailwindCSS
   - Custom theme (colores CEP)
   - Glassmorphism utilities
   - Responsive design patterns
```

**OUTPUT ESPERADO:**
- Snippets de código actualizados
- Mejores prácticas por librería
- Links a documentación oficial

---

### **TAREA 5: Validación Cruzada de Especificaciones**

Usa **Sequential Thinking MCP** para validar coherencia:

```
Valida que todas las especificaciones generadas sean coherentes entre sí:

1. ¿El esquema de DB soporta todos los requisitos de API?
2. ¿Los componentes frontend consumen correctamente la API especificada?
3. ¿Los workers tienen acceso a todas las integraciones necesarias?
4. ¿La seguridad está implementada en todas las capas?
5. ¿Los eventos de analítica están presentes en frontend y backend?

Identifica:
- Inconsistencias
- Dependencias circulares
- Requisitos faltantes
- Oportunidades de optimización
```

**OUTPUT ESPERADO:**
- Reporte de validación cruzada
- Lista de correcciones necesarias
- Confirmación de coherencia

---

## ✅ CRITERIOS DE COMPLETITUD (ANTES DE ESCRIBIR CÓDIGO)

### Checklist de Especificaciones Completas

- [ ] **Arquitectura:**
  - [ ] Diagrama de componentes completo
  - [ ] Flujos de datos documentados
  - [ ] Decisiones técnicas justificadas

- [ ] **Base de Datos:**
  - [ ] ERD completo con relaciones
  - [ ] Scripts SQL de creación
  - [ ] Índices optimizados
  - [ ] Estrategia de migraciones

- [ ] **API:**
  - [ ] OpenAPI spec completo
  - [ ] Todos los endpoints documentados
  - [ ] Request/Response schemas
  - [ ] Autenticación especificada

- [ ] **Frontend:**
  - [ ] Componentes documentados (Storybook)
  - [ ] Rutas y navegación mapeadas
  - [ ] State management definido
  - [ ] Tracking events especificados

- [ ] **Workers:**
  - [ ] Jobs y payloads definidos
  - [ ] Retry policies configuradas
  - [ ] Integraciones externas especificadas

- [ ] **LLM:**
  - [ ] Prompts templates creados
  - [ ] Validaciones post-generación
  - [ ] Rate limiting y costos estimados

- [ ] **Seguridad:**
  - [ ] RBAC completo
  - [ ] Rate limiting configurado
  - [ ] RGPD compliance validado

- [ ] **Infraestructura:**
  - [ ] Docker Compose completo
  - [ ] Nginx config validado
  - [ ] CI/CD pipeline diseñado
  - [ ] Backup strategy documentada

---

## 🎯 RESULTADO FINAL DE LA FASE DE ESPECIFICACIONES

Al completar esta fase, deberás tener:

### 📁 Carpeta de Especificaciones (`/specs`)

```
/specs/
├── 00_analisis_sequential_thinking.md
├── 01_plan_tareas_taskmaster.md
├── 02_arquitectura_sistema.md
├── 03_database_schema.sql
├── 04_database_erd.mermaid
├── 05_api_openapi.yaml
├── 06_frontend_components.md
├── 07_workers_jobs.md
├── 08_llm_prompts.md
├── 09_security_rgpd.md
├── 10_analytics.md
├── 11_infrastructure_docker.md
├── 12_validacion_cruzada.md
└── README.md (índice de todas las specs)
```

### ✅ Criterios de Aprobación para Iniciar Desarrollo

1. **Todas las especificaciones están completas** (checklist 100%)
2. **No hay ambigüedades críticas sin resolver**
3. **Validación cruzada pasada exitosamente**
4. **Stakeholders han revisado y aprobado las specs**
5. **Estimaciones de esfuerzo validadas con el equipo**

---

## 🚀 SIGUIENTE PASO (SOLO DESPUÉS DE SPECS COMPLETAS)

Una vez completada y validada la fase de especificaciones, entonces y solo entonces:

```
Iniciar FASE 1 de desarrollo: Infraestructura Docker + Payload CMS base + PostgreSQL + Redis

Seguir las especificaciones al pie de la letra, con code reviews usando CodeRabbit MCP.
```

---

## 🛠️ COMANDOS PARA EJECUTAR ESTE PROMPT

### 1. Iniciar Análisis Sequential Thinking
```
Usa Sequential Thinking MCP para analizar el documento /Users/carlosjperez/Desktop/cepcomunicacion_v_2_desarrollo.md según TAREA 1
```

### 2. Crear Plan de Tareas
```
Usa Task Master MCP para crear el plan completo de tareas según TAREA 2
```

### 3. Generar Especificaciones
```
Usa Spec-Kit MCP para generar cada especificación de la TAREA 3 (3.1 a 3.9)
```

### 4. Obtener Documentación
```
Usa Context7 MCP para obtener docs de Payload, BullMQ, Zod, TanStack Query, TailwindCSS según TAREA 4
```

### 5. Validar Coherencia
```
Usa Sequential Thinking MCP para validación cruzada según TAREA 5
```

---

## 📊 MÉTRICAS DE ÉXITO DE LA FASE DE SPECS

- **Tiempo invertido:** 1-2 semanas (antes de escribir código)
- **Ambigüedades resueltas:** 100%
- **Especificaciones completas:** 9/9 (100%)
- **Validación cruzada:** APROBADA
- **Code lines written:** 0 (solo specs, diagramas, ejemplos de referencia)

---

## ⚠️ REGLAS ESTRICTAS

1. **NO SE ESCRIBE CÓDIGO DE PRODUCCIÓN** hasta que todas las specs estén completas
2. **CADA ESPECIFICACIÓN DEBE SER REVISADA** por al menos 2 personas
3. **AMBIGÜEDADES DEBEN RESOLVERSE** antes de aprobar una spec
4. **DIAGRAMAS SON OBLIGATORIOS** para arquitectura, DB, flujos
5. **EJEMPLOS DE CÓDIGO** en specs son solo referencias, no producción

---

**Comandante, ejecuta este prompt siguiendo el orden secuencial de tareas. Al completar cada tarea, reporta el output generado antes de continuar con la siguiente.**

**ECO, esperando tu orden para iniciar TAREA 1 con Sequential Thinking MCP.**
