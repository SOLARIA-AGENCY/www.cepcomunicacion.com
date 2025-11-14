# CEPComunicacion.com v2

> Plataforma integral de gestión formativa para CEP Comunicación

## Estado del Proyecto

**Fase Actual:** Planificación y Especificaciones (COMPLETA)
**Próxima Fase:** Fundación e Infraestructura Core
**Stack Principal:** Cloudflare Workers + D1 + Hono.js + React + Drizzle ORM

---

## ⚠️ Critical Configuration Notes

### TailwindCSS v4 Configuration

**IMPORTANT:** When using TailwindCSS v4.x, colors MUST be defined in `theme.colors` (NOT `theme.extend.colors`). This is a breaking change from v3.x.

**Incorrect configuration will cause:**
- Utility classes like `.bg-background`, `.text-foreground` will NOT be generated
- Dashboard appears completely unstyled despite CSS file loading correctly

See `agents.md` for complete configuration details and verification steps.

---

## Descripción

CEPComunicacion.com v2 es una plataforma integral de gestión formativa diseñada para modernizar y optimizar la administración de cursos, estudiantes, y procesos formativos de CEP Comunicación. La plataforma está construida sobre la infraestructura serverless de Cloudflare para garantizar escalabilidad, rendimiento y costos optimizados.

### Características Principales

- **Gestión Integral de Cursos:** Administración completa del ciclo de vida de cursos y convocatorias
- **Portal del Estudiante:** Interfaz moderna y responsive para estudiantes
- **Sistema de Pagos:** Integración con pasarelas de pago (Stripe/Redsys)
- **IA Integrada:** Recomendaciones personalizadas y análisis predictivo
- **Analytics Avanzado:** Dashboards en tiempo real con métricas de negocio
- **Multi-tenant:** Soporte para múltiples organizaciones
- **Seguridad Enterprise:** RBAC, auditoría, cumplimiento GDPR

---

## Estructura del Proyecto

```
/
├── apps/                    # Aplicaciones del monorepo
│   ├── api/                # Cloudflare Workers API
│   ├── web/                # Frontend React (estudiantes)
│   └── admin/              # Panel de administración
│
├── packages/               # Paquetes compartidos
│   ├── database/          # Esquemas Drizzle ORM
│   ├── types/             # TypeScript types compartidos
│   ├── ui/                # Componentes UI compartidos
│   └── utils/             # Utilidades compartidas
│
├── infra/                  # Infraestructura como código
│   ├── cloudflare/        # Configuración Cloudflare
│   └── terraform/         # Scripts Terraform (si aplica)
│
├── docs/                   # Documentación completa
│   ├── specs/             # Especificaciones técnicas (11,405 líneas)
│   ├── reports/           # Reportes de progreso y auditoría
│   ├── executive/         # Resúmenes ejecutivos
│   └── guides/            # Guías de desarrollo
│
├── .claude/               # Configuración Claude Code
│   ├── memories/          # Metodología de desarrollo
│   └── tasks/             # Integración TaskMaster
│
├── DEVELOPMENT.md         # Tracking de desarrollo
├── README.md              # Este archivo
└── .gitignore            # Archivos ignorados
```

---

## Documentación

### Para Desarrolladores

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Tracking de progreso y tareas activas
- **[Especificaciones Técnicas](docs/specs/README.md)** - Suite completa de specs (11,405 líneas)
- **[Índice del Proyecto](docs/guides/PROJECT_INDEX.md)** - Navegación por toda la documentación
- **[Guía de Arquitectura](docs/specs/01-architecture/)** - Decisiones arquitectónicas

### Para Stakeholders

- **[Resumen Ejecutivo](docs/executive/RESUMEN_EJECUTIVO.md)** - Visión general del proyecto
- **[Progreso de Especificaciones](docs/reports/SPEC_PROGRESS.md)** - Estado de las especificaciones
- **[Auditoría de Completitud](docs/reports/AUDIT_COMPLETENESS.md)** - Análisis de cobertura

---

## Stack Tecnológico

### Backend
- **Runtime:** Cloudflare Workers (Edge Computing)
- **Framework:** Hono.js (Web framework ligero)
- **Base de Datos:** Cloudflare D1 (SQLite serverless)
- **ORM:** Drizzle ORM
- **Storage:** Cloudflare R2 (S3-compatible)
- **Cache:** Cloudflare KV

### Frontend
- **Framework:** React 18+ con TypeScript
- **Build Tool:** Vite
- **Routing:** TanStack Router
- **State Management:** Zustand
- **UI Components:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod

### DevOps
- **Monorepo:** Turborepo
- **CI/CD:** GitHub Actions
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint + Prettier
- **Type Checking:** TypeScript strict mode

---

## Inicio Rápido

> **Nota:** El proyecto está actualmente en fase de especificaciones. El código de implementación comenzará en Fase 1.

### Prerrequisitos

- Node.js 20+ y npm/pnpm/yarn
- Cuenta de Cloudflare
- Git

### Instalación (Disponible en Fase 1)

```bash
# Clonar el repositorio
git clone https://github.com/cepcomunicacion/www.cepcomunicacion.com.git
cd www.cepcomunicacion.com

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar desarrollo
pnpm dev
```

---

## Fases de Desarrollo

### ✅ Fase 0: Planificación (COMPLETA)
- Especificaciones técnicas completas
- Diseño de arquitectura
- Diseño de base de datos
- Framework de seguridad
- Documentación completa

### 🚧 Fase 1: Fundación (PRÓXIMA)
- Setup del monorepo
- Capa de base de datos
- API foundation
- Sistema de autenticación
- Despliegue a staging

### 📋 Fase 2: Lógica de Negocio (PLANIFICADA)
- Gestión de usuarios
- Gestión de cursos
- Sistema de inscripciones
- Reportes básicos
- Integración de pagos

### 📋 Fase 3: Características Avanzadas (PLANIFICADA)
- Integración IA
- Analytics avanzado
- Sistema de comunicación
- Gestión documental
- Optimización móvil

---

## Contribución

Este es un proyecto privado de CEP Comunicación. Para contribuir:

1. Revisa el [DEVELOPMENT.md](DEVELOPMENT.md) para el estado actual
2. Consulta las especificaciones en [docs/specs/](docs/specs/)
3. Sigue las guías de estilo del proyecto
4. Crea un branch para tu feature
5. Envía un pull request

---

## Licencia

Propietario: CEP Comunicación
Todos los derechos reservados.

---

## Contacto

**Proyecto:** CEPComunicacion.com v2
**Organización:** CEP Comunicación
**Documentación:** [docs/](docs/)
**Issues:** GitHub Issues (proyecto privado)

---

**Última Actualización:** 2025-10-21
**Versión de Documentación:** 2.0.0
**Estado:** Especificaciones Completas - Preparado para Fase 1
