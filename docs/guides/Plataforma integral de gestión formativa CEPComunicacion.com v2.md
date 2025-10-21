{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 **Proyecto:** Plataforma integral de gesti\'f3n formativa CEPComunicacion.com v2\
     **Metodolog\'eda:** Spec-Driven Development (SDD)\
     **Fecha inicio:** Q4 2025\
     **Responsable t\'e9cnico:** Solaria Agency\
\
     ---\
\
     ## \uc0\u55357 \u56523  CONTEXTO Y OBJETIVO\
\
     Vamos a desarrollar una plataforma moderna para CEP FORMACI\'d3N siguiendo estrictamente la metodolog\'eda **Spec-Driven \
     Development**, utilizando los MCPs disponibles para asegurar que **TODAS las especificaciones est\'e9n completas y validadas ANTES\
      de escribir c\'f3digo**.\
\
     ### Documento Base\
     Lee y analiza el documento completo: `/Users/carlosjperez/Desktop/cepcomunicacion_v_2_desarrollo.md`\
\
     ### Stack Tecnol\'f3gico Definido\
     - **Frontend:** React 18+ + TypeScript + Vite + TailwindCSS\
     - **Backend/CMS:** Payload CMS (Node.js + Express)\
     - **Base de datos:** PostgreSQL 16+\
     - **Colas/Jobs:** BullMQ + Redis\
     - **Servidor:** VPS Ubuntu 22.04 + Docker + Nginx + SSL\
     - **LLM:** OpenAI / Claude / Ollama\
     - **Anal\'edtica:** GA4 + Meta Pixel + Plausible\
\
     ---\
\
     ## \uc0\u55356 \u57263  FASE 0: AN\'c1LISIS Y PLANIFICACI\'d3N COMPLETA (SIN C\'d3DIGO)\
\
     ### OBJETIVO\
     Crear un set completo de especificaciones t\'e9cnicas, arquitecturales y funcionales que permitan desarrollar el proyecto sin\
     ambig\'fcedades.\
\
     ---\
\
     ## \uc0\u55357 \u56541  TAREAS SECUENCIALES OBLIGATORIAS (Usa Sequential Thinking MCP)\
\
     ### **TAREA 1: An\'e1lisis Exhaustivo del Documento**\
\
     Usa el **Sequential Thinking MCP** para:\
\
     1. **Descomponer el proyecto** en componentes principales\
     2. **Identificar dependencias** entre m\'f3dulos\
     3. **Detectar ambig\'fcedades** o requisitos faltantes\
     4. **Priorizar** componentes cr\'edticos vs. secundarios\
     5. **Validar** coherencia del stack tecnol\'f3gico con requisitos\
\
     **Prompt para Sequential Thinking:**\
     ```\
     Analiza el documento /Users/carlosjperez/Desktop/cepcomunicacion_v_2_desarrollo.md y descomp\'f3n el proyecto CEPComunicacion v2\
     en:\
     1. Componentes principales (Frontend, Backend, Workers, LLM, Infra)\
     2. Dependencias cr\'edticas entre componentes\
     3. Requisitos ambiguos que necesitan clarificaci\'f3n\
     4. Orden l\'f3gico de desarrollo (DAG de dependencias)\
     5. Riesgos t\'e9cnicos identificables\
\
     Estructura tu razonamiento paso a paso, explorando alternativas y refinando el an\'e1lisis.\
     ```\
\
     **OUTPUT ESPERADO:**\
     - \'c1rbol de componentes con dependencias\
     - Lista de preguntas para resolver ambig\'fcedades\
     - Orden de desarrollo \'f3ptimo\
     - Documento de riesgos t\'e9cnicos\
\
     ---\
\
     ### **TAREA 2: Crear Tareas Maestras con Task Master MCP**\
\
     Usa el **Task Master MCP** para:\
\
     1. Crear tareas principales del proyecto\
     2. Descomponer en subtareas\
     3. Establecer dependencias\
     4. Asignar prioridades\
     5. Estimar esfuerzos\
\
     **Prompt para Task Master:**\
     ```\
     Crea un plan de tareas completo para CEPComunicacion v2 basado en el an\'e1lisis previo. Estructura las tareas en:\
\
     FASE 1: ESPECIFICACIONES (Sin c\'f3digo)\
     - Arquitectura de sistema\
     - Dise\'f1o de base de datos\
     - API contracts\
     - Componentes UI\
     - Flujos de automatizaci\'f3n\
     - Seguridad y RGPD\
     - Anal\'edtica y m\'e9tricas\
\
     FASE 2-8: DESARROLLO (Seg\'fan roadmap del documento)\
\
     Para cada tarea define:\
     - Descripci\'f3n clara\
     - Criterios de aceptaci\'f3n\
     - Dependencias\
     - Estimaci\'f3n de esfuerzo\
     - Etiquetas (frontend/backend/infra/llm/security)\
     ```\
\
     **OUTPUT ESPERADO:**\
     - Sistema de tareas jerarquizado\
     - Dependencias mapeadas\
     - Estimaciones por fase\
     - Criterios de aceptaci\'f3n claros\
\
     ---\
\
     ### **TAREA 3: Generar Especificaciones con Spec-Kit MCP**\
\
     Usa el **Spec-Kit MCP** para crear especificaciones formales:\
\
     #### **3.1 Especificaci\'f3n de Arquitectura**\
     ```\
     Genera una especificaci\'f3n t\'e9cnica completa de la arquitectura de CEPComunicacion v2 incluyendo:\
\
     1. DIAGRAMA DE ARQUITECTURA\
        - Componentes principales (Frontend, CMS, Workers, DB, Redis)\
        - Comunicaci\'f3n entre servicios\
        - Puertos y protocolos\
        - Docker containers\
\
     2. DIAGRAMAS DE FLUJO\
        - Usuario web \uc0\u8594  Frontend \u8594  API \u8594  DB\
        - Lead creado \uc0\u8594  Workers \u8594  Integraciones externas\
        - Ingesta PDF \uc0\u8594  LLM \u8594  Generaci\'f3n contenido\
\
     3. DECISIONES ARQUITECTURALES\
        - Justificaci\'f3n de cada tecnolog\'eda\
        - Alternativas consideradas\
        - Trade-offs aceptados\
\
     4. ESCALABILIDAD\
        - Horizontal vs. vertical\
        - Caching estrategias\
        - CDN para assets\
\
     5. SEGURIDAD\
        - Capas de seguridad\
        - Autenticaci\'f3n/Autorizaci\'f3n\
        - HTTPS/TLS\
        - Secrets management\
     ```\
\
     #### **3.2 Especificaci\'f3n de Base de Datos**\
     ```\
     Genera una especificaci\'f3n completa del esquema PostgreSQL incluyendo:\
\
     1. DIAGRAMA ERD COMPLETO\
        - Todas las 12 colecciones definidas\
        - Relaciones (1:1, 1:N, N:M)\
        - Cardinalidades\
        - Claves for\'e1neas\
\
     2. DEFINICI\'d3N DE TABLAS\
        - DDL SQL completo para cada tabla\
        - Tipos de datos exactos\
        - Constraints (NOT NULL, UNIQUE, CHECK)\
        - Valores por defecto\
\
     3. \'cdNDICES\
        - B-tree para b\'fasquedas exactas\
        - GIN para full-text search\
        - \'cdndices compuestos para queries frecuentes\
        - EXPLAIN ANALYZE de queries cr\'edticas\
\
     4. MIGRACIONES\
        - Script de creaci\'f3n inicial (001_create_tables.sql)\
        - Scripts de seed data (002_seed_data.sql)\
        - Estrategia de versionado\
        - Rollback plan\
\
     5. VALIDACIONES\
        - Check constraints (ej: start_date < end_date)\
        - Triggers para timestamps\
        - Funci\'f3n de auditor\'eda\
     ```\
\
     #### **3.3 Especificaci\'f3n de API REST/GraphQL**\
     ```\
     Genera especificaci\'f3n OpenAPI 3.0 completa para Payload CMS API incluyendo:\
\
     1. ENDPOINTS REST\
        - GET /api/courses (lista con filtros)\
        - GET /api/courses/:slug (detalle)\
        - POST /api/leads (crear lead con validaci\'f3n)\
        - GET /api/campuses (sedes)\
        - GET /api/course-runs (convocatorias)\
        - POST /api/campaigns/generate-ads (LLM)\
\
     2. SCHEMAS\
        - RequestBody schemas con validaciones\
        - Response schemas tipados\
        - Error schemas (4xx, 5xx)\
\
     3. AUTENTICACI\'d3N\
        - JWT Bearer token\
        - Refresh token flow\
        - Rate limiting por endpoint\
\
     4. CONTRATOS DE API\
        - Request/Response examples\
        - Status codes esperados\
        - Headers requeridos\
\
     5. DOCUMENTACI\'d3N INTERACTIVA\
        - Swagger UI embebido\
        - Postman collection exportable\
     ```\
\
     #### **3.4 Especificaci\'f3n de Frontend (React)**\
     ```\
     Genera especificaci\'f3n completa del frontend incluyendo:\
\
     1. ARQUITECTURA DE COMPONENTES\
        - Atomic Design (Atoms, Molecules, Organisms, Templates, Pages)\
        - Estructura de carpetas\
        - Component hierarchy\
\
     2. COMPONENTES BASE (Documentados con Storybook)\
        - Hero (props, variants, examples)\
        - CourseCard (GlassCard iOS 22+ spec incluida)\
        - LeadForm (validaciones Zod)\
        - FilterPanel (multi-select)\
        - Header, Footer, Modal, Toast, Loader\
\
     3. P\'c1GINAS Y RUTAS\
        - / (Home)\
        - /cursos (lista con filtros)\
        - /cursos/:slug (detalle)\
        - /sedes, /ciclos, /blog, /contacto\
        - /gracias, /privacidad, /cookies\
\
     4. STATE MANAGEMENT\
        - React Context para global state\
        - TanStack Query para server state\
        - Zustand para UI state (opcional)\
\
     5. TRACKING EVENTS\
        - page_view, lead_submit, cta_click\
        - GA4, Meta Pixel, Plausible integration\
\
     6. ACCESIBILIDAD (WCAG 2.1 AA)\
        - Semantic HTML\
        - ARIA labels\
        - Keyboard navigation\
        - Color contrast ratios\
     ```\
\
     #### **3.5 Especificaci\'f3n de Workers (BullMQ)**\
     ```\
     Genera especificaci\'f3n completa de workers incluyendo:\
\
     1. JOBS DEFINIDOS\
        - lead.created (payload, retry policy)\
        - campaign.sync (cron schedule)\
        - stats.rollup (aggregation queries)\
        - backup.daily (S3 upload)\
\
     2. COLAS (Queues)\
        - Naming convention\
        - Prioridades\
        - Concurrencia\
        - Rate limiting\
\
     3. INTEGRACIONES EXTERNAS\
        - Mailchimp API (endpoints, auth)\
        - WhatsApp Cloud API (message templates)\
        - Meta Ads API (webhook verification)\
\
     4. ERROR HANDLING\
        - Retry strategy (exponential backoff)\
        - Dead letter queue\
        - Alertas en failures cr\'edticos\
\
     5. MONITOREO\
        - BullBoard dashboard\
        - M\'e9tricas: jobs/sec, latency, failures\
     ```\
\
     #### **3.6 Especificaci\'f3n de LLM Ingest**\
     ```\
     Genera especificaci\'f3n completa del sistema LLM incluyendo:\
\
     1. FLUJO DE INGESTA\
        - Upload PDF \uc0\u8594  Parse text\
        - Chunking estrategia\
        - Prompt engineering templates\
\
     2. EXTRACCI\'d3N DE DATOS\
        - Objetivos (lista bullets)\
        - Temario (estructura jer\'e1rquica)\
        - Requisitos, salidas profesionales\
\
     3. GENERACI\'d3N DE ADS\
        - Headlines (3-5, max 40 chars)\
        - Primary texts (3-5, max 125 chars)\
        - Hashtags (5-10)\
        - CTA options\
\
     4. VALIDACI\'d3N POST-LLM\
        - Schema validation (Zod)\
        - RGPD compliance check\
        - Tone and style validation\
\
     5. RATE LIMITING Y COSTOS\
        - Tokens por request\
        - Cache de prompts\
        - Fallback a modelos locales (Ollama)\
     ```\
\
     #### **3.7 Especificaci\'f3n de Seguridad y RGPD**\
     ```\
     Genera especificaci\'f3n completa de seguridad incluyendo:\
\
     1. AUTENTICACI\'d3N\
        - JWT access token (15min expiry)\
        - Refresh token (7 days)\
        - Password hashing (bcrypt rounds: 12)\
\
     2. AUTORIZACI\'d3N (RBAC)\
        - Roles: admin, gestor, marketing, asesor, lectura\
        - Permisos por colecci\'f3n\
        - Permisos por campo\
\
     3. RATE LIMITING\
        - API p\'fablica: 100 req/15min\
        - Auth endpoints: 5 req/15min\
        - Forms: 3 req/1hour\
\
     4. CAPTCHA\
        - hCaptcha en formularios\
        - Verificaci\'f3n server-side\
\
     5. AUDITOR\'cdA\
        - Tabla audit_log (user, action, entity, timestamp)\
        - Retention: 2 a\'f1os\
\
     6. RGPD\
        - Consentimiento con IP y timestamp\
        - Right to be forgotten (anonimizaci\'f3n)\
        - Data portability (export JSON)\
     ```\
\
     #### **3.8 Especificaci\'f3n de Anal\'edtica**\
     ```\
     Genera especificaci\'f3n completa de anal\'edtica incluyendo:\
\
     1. EVENTOS TRACKEADOS\
        - page_view, lead_submit, cta_click, course_view\
        - Par\'e1metros por evento\
\
     2. M\'c9TRICAS DE NEGOCIO\
        - Leads totales, por sede, por curso\
        - CTR, CPL, conversion rate\
        - SQL queries para dashboards\
\
     3. M\'c9TRICAS DE SISTEMA\
        - API latency (p95, p99)\
        - Error rate\
        - Active jobs (BullMQ)\
        - DB connection pool\
\
     4. DASHBOARDS\
        - Grafana templates\
        - Alertas configuradas\
     ```\
\
     #### **3.9 Especificaci\'f3n de Infraestructura (Docker)**\
     ```\
     Genera especificaci\'f3n completa de infraestructura incluyendo:\
\
     1. DOCKER COMPOSE\
        - Services: frontend, cms, worker-automation, worker-llm, db, redis\
        - Networks (internal, external)\
        - Volumes (postgres-data, redis-data, uploads)\
\
     2. NGINX CONFIGURATION\
        - Reverse proxy a frontend (puerto 80/443)\
        - Proxy pass a CMS API (/api)\
        - SSL Let's Encrypt\
        - Headers de seguridad\
\
     3. CI/CD PIPELINE\
        - GitHub Actions workflow\
        - Build Docker images\
        - Push to registry\
        - Deploy to VPS\
\
     4. BACKUP STRATEGY\
        - PostgreSQL dump diario (03:00)\
        - Upload a S3\
        - Retention: 30 d\'edas\
        - Test restore mensual\
     ```\
\
     **OUTPUT ESPERADO DE SPEC-KIT:**\
     - 9 documentos de especificaci\'f3n completos\
     - Diagramas en Mermaid/PlantUML\
     - C\'f3digo de ejemplo (NO producci\'f3n, solo referencia)\
     - Criterios de aceptaci\'f3n por m\'f3dulo\
\
     ---\
\
     ### **TAREA 4: Obtener Documentaci\'f3n T\'e9cnica con Context7 MCP**\
\
     Usa **Context7 MCP** para obtener documentaci\'f3n actualizada de las tecnolog\'edas:\
\
     ```\
     Para cada tecnolog\'eda del stack, obt\'e9n documentaci\'f3n y mejores pr\'e1cticas:\
\
     1. Payload CMS\
        - Colecciones con TypeScript\
        - Hooks (beforeValidate, afterChange)\
        - Access control avanzado\
        - Versioning y drafts\
\
     2. BullMQ\
        - Workers pattern\
        - Retry strategies\
        - Event listeners\
        - BullBoard setup\
\
     3. Zod\
        - Schema validation\
        - Transform y refine\
        - Error messages customizados\
\
     4. TanStack Query\
        - useQuery, useMutation\
        - Cache invalidation\
        - Optimistic updates\
\
     5. TailwindCSS\
        - Custom theme (colores CEP)\
        - Glassmorphism utilities\
        - Responsive design patterns\
     ```\
\
     **OUTPUT ESPERADO:**\
     - Snippets de c\'f3digo actualizados\
     - Mejores pr\'e1cticas por librer\'eda\
     - Links a documentaci\'f3n oficial\
\
     ---\
\
     ### **TAREA 5: Validaci\'f3n Cruzada de Especificaciones**\
\
     Usa **Sequential Thinking MCP** para validar coherencia:\
\
     ```\
     Valida que todas las especificaciones generadas sean coherentes entre s\'ed:\
\
     1. \'bfEl esquema de DB soporta todos los requisitos de API?\
     2. \'bfLos componentes frontend consumen correctamente la API especificada?\
     3. \'bfLos workers tienen acceso a todas las integraciones necesarias?\
     4. \'bfLa seguridad est\'e1 implementada en todas las capas?\
     5. \'bfLos eventos de anal\'edtica est\'e1n presentes en frontend y backend?\
\
     Identifica:\
     - Inconsistencias\
     - Dependencias circulares\
     - Requisitos faltantes\
     - Oportunidades de optimizaci\'f3n\
     ```\
\
     **OUTPUT ESPERADO:**\
     - Reporte de validaci\'f3n cruzada\
     - Lista de correcciones necesarias\
     - Confirmaci\'f3n de coherencia\
\
     ---\
\
     ## \uc0\u9989  CRITERIOS DE COMPLETITUD (ANTES DE ESCRIBIR C\'d3DIGO)\
\
     ### Checklist de Especificaciones Completas\
\
     - [ ] **Arquitectura:**\
       - [ ] Diagrama de componentes completo\
       - [ ] Flujos de datos documentados\
       - [ ] Decisiones t\'e9cnicas justificadas\
\
     - [ ] **Base de Datos:**\
       - [ ] ERD completo con relaciones\
       - [ ] Scripts SQL de creaci\'f3n\
       - [ ] \'cdndices optimizados\
       - [ ] Estrategia de migraciones\
\
     - [ ] **API:**\
       - [ ] OpenAPI spec completo\
       - [ ] Todos los endpoints documentados\
       - [ ] Request/Response schemas\
       - [ ] Autenticaci\'f3n especificada\
\
     - [ ] **Frontend:**\
       - [ ] Componentes documentados (Storybook)\
       - [ ] Rutas y navegaci\'f3n mapeadas\
       - [ ] State management definido\
       - [ ] Tracking events especificados\
\
     - [ ] **Workers:**\
       - [ ] Jobs y payloads definidos\
       - [ ] Retry policies configuradas\
       - [ ] Integraciones externas especificadas\
\
     - [ ] **LLM:**\
       - [ ] Prompts templates creados\
       - [ ] Validaciones post-generaci\'f3n\
       - [ ] Rate limiting y costos estimados\
\
     - [ ] **Seguridad:**\
       - [ ] RBAC completo\
       - [ ] Rate limiting configurado\
       - [ ] RGPD compliance validado\
\
     - [ ] **Infraestructura:**\
       - [ ] Docker Compose completo\
       - [ ] Nginx config validado\
       - [ ] CI/CD pipeline dise\'f1ado\
       - [ ] Backup strategy documentada\
\
     ---\
\
     ## \uc0\u55356 \u57263  RESULTADO FINAL DE LA FASE DE ESPECIFICACIONES\
\
     Al completar esta fase, deber\'e1s tener:\
\
     ### \uc0\u55357 \u56513  Carpeta de Especificaciones (`/specs`)\
\
     ```\
     /specs/\
     \uc0\u9500 \u9472 \u9472  00_analisis_sequential_thinking.md\
     \uc0\u9500 \u9472 \u9472  01_plan_tareas_taskmaster.md\
     \uc0\u9500 \u9472 \u9472  02_arquitectura_sistema.md\
     \uc0\u9500 \u9472 \u9472  03_database_schema.sql\
     \uc0\u9500 \u9472 \u9472  04_database_erd.mermaid\
     \uc0\u9500 \u9472 \u9472  05_api_openapi.yaml\
     \uc0\u9500 \u9472 \u9472  06_frontend_components.md\
     \uc0\u9500 \u9472 \u9472  07_workers_jobs.md\
     \uc0\u9500 \u9472 \u9472  08_llm_prompts.md\
     \uc0\u9500 \u9472 \u9472  09_security_rgpd.md\
     \uc0\u9500 \u9472 \u9472  10_analytics.md\
     \uc0\u9500 \u9472 \u9472  11_infrastructure_docker.md\
     \uc0\u9500 \u9472 \u9472  12_validacion_cruzada.md\
     \uc0\u9492 \u9472 \u9472  README.md (\'edndice de todas las specs)\
     ```\
\
     ### \uc0\u9989  Criterios de Aprobaci\'f3n para Iniciar Desarrollo\
\
     1. **Todas las especificaciones est\'e1n completas** (checklist 100%)\
     2. **No hay ambig\'fcedades cr\'edticas sin resolver**\
     3. **Validaci\'f3n cruzada pasada exitosamente**\
     4. **Stakeholders han revisado y aprobado las specs**\
     5. **Estimaciones de esfuerzo validadas con el equipo**\
\
     ---\
\
     ## \uc0\u55357 \u56960  SIGUIENTE PASO (SOLO DESPU\'c9S DE SPECS COMPLETAS)\
\
     Una vez completada y validada la fase de especificaciones, entonces y solo entonces:\
\
     ```\
     Iniciar FASE 1 de desarrollo: Infraestructura Docker + Payload CMS base + PostgreSQL + Redis\
\
     Seguir las especificaciones al pie de la letra, con code reviews usando CodeRabbit MCP.\
     ```\
\
     ---\
\
     ## \uc0\u55357 \u57056 \u65039  COMANDOS PARA EJECUTAR ESTE PROMPT\
\
     ### 1. Iniciar An\'e1lisis Sequential Thinking\
     ```\
     Usa Sequential Thinking MCP para analizar el documento /Users/carlosjperez/Desktop/cepcomunicacion_v_2_desarrollo.md seg\'fan\
     TAREA 1\
     ```\
\
     ### 2. Crear Plan de Tareas\
     ```\
     Usa Task Master MCP para crear el plan completo de tareas seg\'fan TAREA 2\
     ```\
\
     ### 3. Generar Especificaciones\
     ```\
     Usa Spec-Kit MCP para generar cada especificaci\'f3n de la TAREA 3 (3.1 a 3.9)\
     ```\
\
     ### 4. Obtener Documentaci\'f3n\
     ```\
     Usa Context7 MCP para obtener docs de Payload, BullMQ, Zod, TanStack Query, TailwindCSS seg\'fan TAREA 4\
     ```\
\
     ### 5. Validar Coherencia\
     ```\
     Usa Sequential Thinking MCP para validaci\'f3n cruzada seg\'fan TAREA 5\
     ```\
\
     ---\
\
     ## \uc0\u55357 \u56522  M\'c9TRICAS DE \'c9XITO DE LA FASE DE SPECS\
\
     - **Tiempo invertido:** 1-2 semanas (antes de escribir c\'f3digo)\
     - **Ambig\'fcedades resueltas:** 100%\
     - **Especificaciones completas:** 9/9 (100%)\
     - **Validaci\'f3n cruzada:** APROBADA\
     - **Code lines written:** 0 (solo specs, diagramas, ejemplos de referencia)\
\
     ---\
\
     ## \uc0\u9888 \u65039  REGLAS ESTRICTAS\
\
     1. **NO SE ESCRIBE C\'d3DIGO DE PRODUCCI\'d3N** hasta que todas las specs est\'e9n completas\
     2. **CADA ESPECIFICACI\'d3N DEBE SER REVISADA** por al menos 2 personas\
     3. **AMBIG\'dcEDADES DEBEN RESOLVERSE** antes de aprobar una spec\
     4. **DIAGRAMAS SON OBLIGATORIOS** para arquitectura, DB, flujos\
     5. **EJEMPLOS DE C\'d3DIGO** en specs son solo referencias, no producci\'f3n\
\
     ---\
\
     **Comandante, ejecuta este prompt siguiendo el orden secuencial de tareas. Al completar cada tarea, reporta el output generado \
     antes de continuar con la siguiente.**}