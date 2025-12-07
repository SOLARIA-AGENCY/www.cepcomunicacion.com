# Análisis Arquitectónico: Database & Deployment Multi-Tenant

**Proyecto:** CEPComunicacion v2
**Fecha:** 2025-12-07
**Tipo:** Evaluación técnica y financiera

---

## 📊 Resumen Ejecutivo

| Categoría | Recomendación | Razón Principal |
|-----------|---------------|-----------------|
| **Database** | 🏆 **Mantener PostgreSQL + Payload** | Control total, sin vendor lock-in, costo predecible |
| **Alternativa DB** | Neon DB (para desarrollo/staging) | Branching gratuito, scale-to-zero |
| **Deployment 1-10 tenants** | 🏆 **VPS Hetzner** | €4.51/mes, control total |
| **Deployment 10-100 tenants** | Evaluar Vercel + Neon | Mayor elasticidad, menos DevOps |

---

## 1. ANÁLISIS DE ARQUITECTURA ACTUAL

### Estado Actual Multi-Tenant

```
┌─────────────────────────────────────────────────────────┐
│                    ARQUITECTURA ACTUAL                   │
├─────────────────────────────────────────────────────────┤
│  Estrategia: Row-Level Security (RLS)                   │
│  Database: PostgreSQL 16.10 (single database)           │
│  ORM: Payload CMS Native (NO Drizzle)                   │
│  Aislamiento: tenant_id en cada tabla                   │
│  Tablas tenant-aware: 7 (users, cycles, campuses,       │
│                         courses, course_runs,            │
│                         campaigns, leads)                │
│  Tablas compartidas: 8 (students, enrollments, etc.)    │
│  Roles RBAC: 6 niveles (superadmin → lectura)           │
└─────────────────────────────────────────────────────────┘
```

### Archivos Críticos
- `/apps/cms/src/access/tenantAccess.ts` - Lógica de aislamiento
- `/apps/cms/src/collections/Tenants/Tenants.ts` - Modelo de tenant
- `/apps/cms/migrations/20251207_081627.ts` - Schema completo (35 tablas, 39 enums)

---

## 2. COMPARATIVA DE BASES DE DATOS

### Opción A: PostgreSQL + Payload (ACTUAL)

| Aspecto | Detalle |
|---------|---------|
| **Costo fijo** | €0 (incluido en VPS) |
| **Escalabilidad** | Vertical (upgrade VPS) |
| **Control** | 100% - acceso directo a DB |
| **Vendor lock-in** | ❌ Ninguno |
| **Multi-tenant** | ✅ Ya implementado (RLS) |
| **Backups** | ✅ Control total (pg_dump) |
| **Branching** | ❌ No nativo |

**Pros:**
- Sin costos adicionales de DB
- Control total sobre optimización
- Sin límites de conexiones/storage
- Migrable a cualquier proveedor

**Contras:**
- Requiere mantenimiento manual
- Sin branching para dev/staging
- Escalado requiere intervención

---

### Opción B: Supabase

| Plan | Precio/mes | Incluido |
|------|------------|----------|
| **Free** | $0 | 500MB storage, 2GB bandwidth, 50K MAUs |
| **Pro** | $25 | 8GB storage, 250GB bandwidth, 100K MAUs |
| **Team** | $599 | SOC2, SSO, 28-day logs |

**Costo Multi-Tenant (Database-per-tenant):**
```
1 tenant:   $25/mes (Pro plan)
10 tenants: $250/mes + storage overages (~$300-400/mes)
100 tenants: Inviable - requiere Enterprise ($2,000+/mes)
```

**Pros:**
- Auth, Storage, Realtime incluidos
- Dashboard visual
- Edge Functions
- Buena DX

**Contras:**
- ⚠️ **Sin sharding nativo** - escala mal
- Storage crece linealmente por replica
- Pricing impredecible con overages
- No optimizado para >10M MAUs

---

### Opción C: Neon DB

| Plan | Precio/mes | Incluido |
|------|------------|----------|
| **Free** | $0 | 0.5GB storage, 100 CU-hours/proyecto |
| **Launch** | $19 | 10GB storage, $0.106/CU-hour |
| **Scale** | $69 | 50GB storage, $0.222/CU-hour |

**Costo Multi-Tenant (Branch-per-tenant):**
```
1 tenant:   $19/mes (Launch)
10 tenants: $19/mes (branches incluidos, mismo proyecto)
100 tenants: ~$150-300/mes (Scale + compute adicional)
```

**Pros:**
- ✅ **Branching gratuito** (copy-on-write)
- ✅ **Scale-to-zero** - sin costo cuando no hay uso
- ✅ **20% más barato que Aurora**
- Instant restore hasta 7 días
- Integración nativa con Vercel

**Contras:**
- Requiere adaptar código para conexión serverless
- Compute autoscaling limitado a 16 CU
- Cold starts en scale-to-zero (~500ms)

---

### Comparativa de Costos DB

| Escenario | PostgreSQL/VPS | Supabase | Neon DB |
|-----------|----------------|----------|---------|
| **1 tenant** | €0 (incl.) | $25 | $19 |
| **10 tenants** | €0 (incl.) | $300-400 | $50-100 |
| **100 tenants** | €0 (incl.) | $2,000+ | $200-500 |
| **Branching dev** | Manual | ❌ | ✅ Gratis |
| **Cold starts** | ❌ No | ❌ No | ⚠️ ~500ms |

---

## 3. COMPARATIVA DE DEPLOYMENT

### Opción A: VPS Hetzner (ACTUAL)

| Aspecto | Detalle |
|---------|---------|
| **Costo** | €4.51/mes (CX22: 2 vCPU, 4GB RAM, 40GB SSD) |
| **Escalado** | Upgrade instant a CX32 (€8.98) o CX42 (€17.97) |
| **Control** | 100% - root access |
| **SSL** | Let's Encrypt (gratuito) |
| **CDN** | Requiere Cloudflare (gratis) |
| **CI/CD** | Manual o GitHub Actions |

**Costos Proyectados:**
```
1 tenant:    €4.51/mes (CX22)
10 tenants:  €8.98/mes (CX32: 4 vCPU, 8GB RAM)
100 tenants: €35.88/mes (CX52: 16 vCPU, 32GB RAM) + Load Balancer
```

**Pros:**
- Costo fijo predecible
- Sin límites de bandwidth
- Control total de stack
- IP dedicada

**Contras:**
- Requiere DevOps
- Sin edge computing
- Escalado manual

---

### Opción B: Vercel

| Plan | Precio/mes | Incluido |
|------|------------|----------|
| **Hobby** | $0 | 100GB bandwidth, limitado |
| **Pro** | $20/user | 1TB bandwidth, 1000 GB-hours |
| **Enterprise** | ~$2,000/mes | SLA, soporte |

**Costo Proyectado:**
```
1 tenant (1 dev):   $20/mes
10 tenants (3 devs): $60/mes + ~$50 overages = $110/mes
100 tenants (5 devs): $100/mes + ~$300-500 overages = $400-600/mes
```

**Costos Ocultos:**
- Bandwidth: $0.15/GB después de 1TB
- Edge requests: $2/millón después de 10M
- ISR: $0.40/millón cache reads

**Pros:**
- Zero-config deployment
- Edge Network global
- Preview deployments
- Integración Neon nativa

**Contras:**
- ⚠️ **Overages impredecibles**
- SSR costoso a escala
- Vendor lock-in con features propias
- Enterprise muy caro ($20K+/año)

---

### Opción C: Cloudflare Pages + Workers

| Plan | Precio/mes | Incluido |
|------|------------|----------|
| **Free** | $0 | 100K requests/día, 500 builds |
| **Pro** | $20 | 5K builds, Workers ilimitados |
| **Workers Paid** | $5 | 10M requests |

**Costo Proyectado:**
```
1 tenant:   $5/mes (Workers Paid)
10 tenants: $25/mes (Pro + Workers)
100 tenants: $25-50/mes (mismo pricing)
```

**Pros:**
- ✅ **Sin cargos de bandwidth**
- ✅ **Pricing más predecible**
- Edge computing global
- D1 (SQLite edge) incluido

**Contras:**
- ⚠️ **No compatible con Payload CMS**
- ⚠️ **Requiere reescritura del backend**
- Workers tienen límites de CPU (30s free, 5min paid)
- D1 no es PostgreSQL

---

### Comparativa de Costos Deployment

| Escenario | VPS Hetzner | Vercel | Cloudflare |
|-----------|-------------|--------|------------|
| **1 tenant** | €4.51 | $20 | $5 |
| **10 tenants** | €8.98 | $110 | $25 |
| **100 tenants** | €35.88 | $400-600 | $50 |
| **Bandwidth extra** | €0 | $0.15/GB | $0 |
| **DevOps requerido** | Alto | Bajo | Medio |
| **Compatibilidad Payload** | ✅ | ✅ | ❌ |

---

## 4. ANÁLISIS POR ESCENARIO

### Escenario 1: 1 Tenant (Actual)

| Stack | Costo Total/mes | Pros | Contras |
|-------|-----------------|------|---------|
| **VPS + PostgreSQL** | **€4.51** | Control total, sin límites | Más DevOps |
| Vercel + Supabase | $45 | Zero-config | 10x más caro |
| Vercel + Neon | $39 | Branching, zero-config | 8x más caro |
| Cloudflare + D1 | $5 | Barato | Requiere rewrite |

**🏆 Recomendación:** Mantener VPS actual

---

### Escenario 2: 10 Tenants

| Stack | Costo Total/mes | Pros | Contras |
|-------|-----------------|------|---------|
| **VPS + PostgreSQL** | **€8.98** | Predecible, escalable | DevOps |
| Vercel + Supabase | $410+ | Integración | Impredecible |
| Vercel + Neon | $160 | Branching | Overages |
| Cloudflare | $50 | Barato | No compatible |

**🏆 Recomendación:** VPS con upgrade a CX32

---

### Escenario 3: 100 Tenants

| Stack | Costo Total/mes | Pros | Contras |
|-------|-----------------|------|---------|
| **VPS Cluster** | **€100-150** | Escalable, predecible | Requiere infra |
| Vercel + Supabase | $2,500+ | Managed | Muy caro |
| Vercel + Neon | $700-900 | Elástico | Overages |
| Kubernetes | €200-300 | Auto-scaling | Complejidad |

**🏆 Recomendación:**
- Si priorizas **costo**: VPS cluster con load balancer
- Si priorizas **elasticidad**: Vercel + Neon

---

## 5. MATRIZ DE DECISIÓN

### Database

| Criterio (peso) | PostgreSQL/VPS | Supabase | Neon |
|-----------------|----------------|----------|------|
| Costo (30%) | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Control (20%) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Escalabilidad (20%) | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| DX/Features (15%) | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Vendor lock-in (15%) | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **TOTAL** | **4.35** | **2.75** | **3.75** |

### Deployment

| Criterio (peso) | VPS Hetzner | Vercel | Cloudflare |
|-----------------|-------------|--------|------------|
| Costo (30%) | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Facilidad (25%) | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Escalabilidad (20%) | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Control (15%) | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Compatibilidad (10%) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| **TOTAL** | **3.70** | **3.50** | **3.25** |

---

## 6. ESPECIFICACIONES VPS POR ESCALA

### Matriz de Sizing VPS Hetzner

| Tenants | Plan | vCPU | RAM | SSD | Precio/mes | Notas |
|---------|------|------|-----|-----|------------|-------|
| **1-3** | CX22 | 2 | 4 GB | 40 GB | €4.51 | Actual - suficiente para MVP |
| **4-10** | CX32 | 4 | 8 GB | 80 GB | €8.98 | Upgrade recomendado |
| **11-25** | CX42 | 8 | 16 GB | 160 GB | €17.97 | Headroom cómodo |
| **26-50** | CX52 | 16 | 32 GB | 240 GB | €35.88 | Considerar réplica DB |
| **51-100** | CPX51 | 16 | 64 GB | 360 GB | €71.76 | + Load Balancer (€5.83) |
| **100+** | Cluster | - | - | - | €150+ | 2+ nodos + DB dedicada |

### Fórmula de Cálculo

```
RAM por tenant ≈ 50-100 MB (usuarios activos)
CPU por tenant ≈ 0.1-0.2 vCPU (promedio)
Storage por tenant ≈ 500 MB - 2 GB (media + DB)

Ejemplo 25 tenants:
- RAM: 25 × 100 MB = 2.5 GB + 4 GB sistema = ~7 GB → CX42 (16 GB)
- Storage: 25 × 1 GB = 25 GB + 20 GB sistema = ~45 GB → 160 GB ✓
```

### Cuándo Hacer Upgrade

| Señal | Acción |
|-------|--------|
| RAM > 80% sostenido | Upgrade al siguiente tier |
| CPU > 70% sostenido | Upgrade o optimizar queries |
| Disk > 80% | Upgrade o limpiar logs/backups |
| Response time > 2s | Investigar bottleneck |

---

## 7. ACLARACIÓN: ESTRATEGIA NEON + PostgreSQL

### ⚠️ Neon NO es para Producción en este caso

**La confusión:** La recomendación "VPS prod + Neon dev" significa:

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA HÍBRIDA                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRODUCCIÓN (VPS Hetzner)           DESARROLLO (Neon)       │
│  ┌─────────────────────┐            ┌─────────────────────┐ │
│  │ PostgreSQL 16.10    │            │ Neon PostgreSQL     │ │
│  │ • Datos reales      │            │ • Branch por PR     │ │
│  │ • Sin cold starts   │            │ • Branch por dev    │ │
│  │ • Conexión directa  │            │ • Scale-to-zero     │ │
│  │ • Backups propios   │            │ • Datos de prueba   │ │
│  │ • €0 adicional      │            │ • $19/mes           │ │
│  └─────────────────────┘            └─────────────────────┘ │
│           ▲                                   ▲             │
│           │                                   │             │
│     Usuarios reales                  Desarrolladores        │
│     (clientes finales)               (equipo interno)       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### ¿Por Qué Neon Solo para Desarrollo?

| Aspecto | Producción (PostgreSQL VPS) | Desarrollo (Neon) |
|---------|----------------------------|-------------------|
| **Cold starts** | ❌ No hay | ⚠️ ~500ms después de inactividad |
| **Costo** | €0 (incluido en VPS) | $19/mes base |
| **Latencia** | ~1-5ms (mismo servidor) | ~20-50ms (red) |
| **Conexiones** | Ilimitadas | Limitadas por plan |
| **Datos** | Reales, sensibles | Sintéticos/anonimizados |
| **Disponibilidad** | 99.9% (tu control) | 99.95% (SLA Neon) |

### Beneficio de Neon en Desarrollo

```
Sin Neon (actual):
─────────────────────────────────────────
Developer A → PostgreSQL local → git push → Deploy → Test en prod
Developer B → PostgreSQL local → git push → Deploy → Test en prod
                                              ↓
                                    ⚠️ Conflictos de schema
                                    ⚠️ Datos de test en prod
                                    ⚠️ No hay preview DB

Con Neon:
─────────────────────────────────────────
Developer A → Neon Branch A → git push → Preview Deploy + Preview DB
Developer B → Neon Branch B → git push → Preview Deploy + Preview DB
                                              ↓
                                    ✅ Aislamiento total
                                    ✅ Cada PR tiene su DB
                                    ✅ Merge solo cuando funciona
                                              ↓
                                    Merge → PostgreSQL Prod (VPS)
```

### Cuándo Considerar Neon para Desarrollo

| Situación | Recomendación |
|-----------|---------------|
| 1 desarrollador | No necesario - PostgreSQL local suficiente |
| 2-3 desarrolladores | Útil para evitar conflictos |
| 4+ desarrolladores | Muy recomendado |
| CI/CD con tests de integración | Ideal - branch por pipeline |
| Previews de Vercel | Perfecto - Neon se integra nativamente |

### Resumen de la Estrategia

```
CORTO PLAZO (ahora):
└── Producción: PostgreSQL en VPS ✓
└── Desarrollo: PostgreSQL local (cada dev)

MEDIANO PLAZO (cuando haya 2+ devs):
└── Producción: PostgreSQL en VPS ✓
└── Desarrollo: Neon (branches por PR/dev)
└── Staging: Neon branch "staging"

LARGO PLAZO (50+ tenants):
└── Producción: PostgreSQL dedicado (o Neon Scale)
└── Desarrollo: Neon
└── Staging: Neon branch
```

---

## 8. CUÁNDO MIGRAR A VERCEL (Análisis Detallado)

### ❌ NO Migrar a Vercel Si...

| Situación | Por Qué No |
|-----------|------------|
| Solo tienes 1-3 desarrolladores | El costo de DevOps es menor que $240/año de Vercel |
| El tráfico es predecible | Sin beneficio de auto-scaling |
| Tienes control sobre el servidor | VPS es más flexible |
| El presupuesto es limitado | Vercel cuesta 5-10x más |
| Necesitas acceso directo a DB | Vercel no permite conexiones persistentes fácilmente |

### ✅ SÍ Migrar a Vercel Si...

| Situación | Por Qué Sí |
|-----------|------------|
| **Equipo crece a 5+ devs** | Preview deployments ahorran tiempo de QA |
| **Tráfico impredecible** | Picos de 10x necesitan auto-scaling |
| **Budget DevOps > $500/mes** | El costo del equipo supera el de Vercel |
| **Necesitas edge rendering** | Latencia global < 50ms |
| **Lanzas features rápido** | CI/CD integrado reduce tiempo de deploy |

### Punto de Inflexión: Cuándo Vercel Tiene Sentido

```
FÓRMULA:

Si (Costo DevOps mensual) > (Costo Vercel mensual):
    → Migrar a Vercel

Costo DevOps típico:
- Ingeniero DevOps part-time: €1,500-3,000/mes
- Herramientas (monitoring, CI/CD): €100-300/mes
- Tiempo de desarrollo perdido: Variable

Costo Vercel:
- Pro: $20/dev × 5 devs = $100/mes
- Overages estimados: $50-200/mes
- Total: $150-300/mes
```

### Escenario Real: Cuándo Migraría CEPComunicacion

| Fase | Tenants | Devs | Recomendación | Costo Mensual |
|------|---------|------|---------------|---------------|
| Actual | 1 | 1 | VPS | €4.51 |
| Crecimiento | 5 | 2 | VPS | €8.98 |
| Escala | 15 | 3 | VPS + considerar Vercel | €17.97 |
| **Punto de inflexión** | 25+ | 4+ | **Evaluar migración** | VPS: €35 vs Vercel: $200 |
| Enterprise | 50+ | 5+ | Vercel + Neon o Railway | $300-500 |

### Arquitectura Vercel para CEPComunicacion

Si decides migrar, esta sería la arquitectura:

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL DEPLOYMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │ Frontend        │    │ CMS (Payload)   │                 │
│  │ React + Vite    │    │ Next.js         │                 │
│  │ Static/SSG      │    │ Serverless      │                 │
│  │ Vercel Edge     │    │ Vercel Functions│                 │
│  └────────┬────────┘    └────────┬────────┘                 │
│           │                      │                           │
│           └──────────┬───────────┘                           │
│                      │                                       │
│           ┌──────────▼──────────┐                           │
│           │ Neon PostgreSQL     │   ← DB Serverless         │
│           │ (Scale plan)        │                           │
│           └─────────────────────┘                           │
│                                                              │
│  Alternativa para CMS:                                       │
│  ┌─────────────────┐                                        │
│  │ Railway         │   ← Container persistente              │
│  │ Payload CMS     │   ← Mejor que Vercel Functions         │
│  │ $5-20/mes       │                                        │
│  └─────────────────┘                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### ⚠️ ADVERTENCIA: Payload CMS en Vercel

**Problema:** Payload CMS no está optimizado para Serverless

| Aspecto | VPS (actual) | Vercel Serverless |
|---------|--------------|-------------------|
| Cold starts | ❌ No hay | ⚠️ 2-5 segundos |
| Conexiones DB | Persistentes | Pool serverless requerido |
| Admin Panel | Rápido | Lento en cold start |
| Costo compute | €0 | $0.18/GB-hour |
| File uploads | Directo a disco | Requiere S3/Cloudflare R2 |

**Solución si migras:** Usar Railway o Render para el CMS

```
Arquitectura híbrida recomendada:
─────────────────────────────────

Frontend (Vercel):
├── React SPA
├── Edge rendering
├── Preview deployments
└── $20/dev

CMS (Railway):
├── Payload CMS
├── Conexión persistente
├── Sin cold starts
└── $5-20/mes

Database (Neon):
├── PostgreSQL serverless
├── Branching
└── $19-69/mes

TOTAL: ~$100-150/mes (vs €4.51 VPS actual)
```

### Costos Detallados: VPS vs Vercel

| Concepto | VPS Hetzner | Vercel + Railway + Neon |
|----------|-------------|-------------------------|
| **1 tenant, 1 dev** | | |
| Servidor/Compute | €4.51 | $25 (Railway) |
| Database | €0 (incluido) | $19 (Neon Launch) |
| Hosting frontend | €0 (Nginx) | $20 (Vercel Pro) |
| SSL | €0 (Let's Encrypt) | €0 (incluido) |
| CDN | €0 (Cloudflare free) | €0 (incluido) |
| **TOTAL** | **€4.51** | **$64 (~€60)** |
| | | |
| **25 tenants, 4 devs** | | |
| Servidor/Compute | €35.88 | $50 (Railway Pro) |
| Database | €0 (incluido) | $69 (Neon Scale) |
| Hosting frontend | €0 (Nginx) | $80 (4 × $20) |
| Bandwidth overages | €0 | ~$50 |
| **TOTAL** | **€35.88** | **$249 (~€230)** |

### Decisión Final: ¿Cuándo Migrar?

```
╔═══════════════════════════════════════════════════════════════╗
║                    REGLA DE DECISIÓN                           ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                 ║
║  MANTENER VPS si:                                              ║
║  • Menos de 25 tenants                                         ║
║  • Menos de 4 desarrolladores                                  ║
║  • Tráfico predecible (sin picos de 10x)                       ║
║  • Presupuesto < €200/mes para infra                           ║
║                                                                 ║
║  CONSIDERAR VERCEL si:                                         ║
║  • 25+ tenants                                                  ║
║  • 4+ desarrolladores                                           ║
║  • Necesitas preview deployments por PR                        ║
║  • El tiempo de DevOps cuesta más que €200/mes                 ║
║  • Picos de tráfico impredecibles (campañas marketing)         ║
║                                                                 ║
║  MIGRAR A VERCEL si:                                           ║
║  • 50+ tenants                                                  ║
║  • 5+ desarrolladores                                           ║
║  • Expansión internacional (necesitas edge global)             ║
║  • El costo de oportunidad > costo de Vercel                   ║
║                                                                 ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 9. PREGUNTAS FRECUENTES - ANÁLISIS PROFUNDO

### P1: ¿Cuáles son las ventajas REALES de Vercel sobre VPS?

**Respuesta corta:** Vercel NO es mejor técnicamente. Es más CÓMODO para equipos grandes.

| Aspecto | VPS (Hetzner) | Vercel |
|---------|---------------|--------|
| **Rendimiento** | ⭐⭐⭐⭐⭐ (tú controlas) | ⭐⭐⭐⭐ (optimizado para Next.js) |
| **Costo** | ⭐⭐⭐⭐⭐ (€4-70/mes) | ⭐⭐ ($100-500/mes) |
| **Control** | ⭐⭐⭐⭐⭐ (root access) | ⭐⭐ (limitado) |
| **DevOps requerido** | ⭐⭐ (alto) | ⭐⭐⭐⭐⭐ (cero) |
| **Preview deployments** | ⭐⭐ (manual con Docker) | ⭐⭐⭐⭐⭐ (automático) |
| **CI/CD** | ⭐⭐⭐ (GitHub Actions) | ⭐⭐⭐⭐⭐ (integrado) |
| **Edge global** | ⭐⭐⭐ (con Cloudflare) | ⭐⭐⭐⭐⭐ (nativo) |

**¿Cuándo Vercel es mejor?**

```
SOLO si estas condiciones se cumplen:

1. Tu equipo tiene 5+ desarrolladores
   → Preview deployments ahorran horas de QA
   → Cada PR tiene su URL de preview automática

2. El tiempo de DevOps cuesta más que Vercel
   → Si pagas a alguien €2,000/mes por DevOps
   → Vercel a $300/mes es más barato

3. Necesitas latencia <50ms globalmente
   → Usuarios en USA, Europa, Asia simultáneamente
   → Vercel Edge sirve desde 100+ ubicaciones

4. Lanzas features múltiples veces al día
   → Deploy en 30 segundos vs 5 minutos
   → Rollback instantáneo
```

**¿Cuándo VPS es mejor?**

```
1. Equipo pequeño (1-4 devs)
2. Presupuesto limitado
3. Necesitas control total
4. Tráfico principalmente en una región (España)
5. El CTO/lead puede hacer DevOps
```

---

### P2: ¿Qué es Railway y por qué cambiar arquitectura?

**Railway** es un PaaS (Platform as a Service) similar a Heroku pero moderno.

```
VPS (Hetzner):
─────────────
Tú manejas TODO:
• Instalar Node.js
• Configurar Nginx
• Configurar SSL
• Configurar PM2
• Gestionar backups
• Actualizar seguridad
• Monitorear servicios

Railway:
─────────
Solo subes tu código:
• git push → deploy automático
• SSL automático
• Escalado automático
• Logs integrados
• Métricas incluidas
```

**¿Por qué Railway si migramos a Vercel?**

El problema es que **Payload CMS no funciona bien en Vercel Functions**:

```
Vercel Functions (Serverless):
─────────────────────────────
• Se "apagan" después de cada request
• Se "encienden" cuando llega un request
• Cold start: 2-5 segundos
• No mantienen conexiones DB persistentes
• Admin panel de Payload: MUY LENTO

Payload CMS necesita:
• Proceso siempre corriendo
• Conexiones DB persistentes
• Sin cold starts
• Acceso a filesystem (uploads)

Railway resuelve esto:
• Container siempre corriendo (como VPS)
• Sin cold starts
• Conexiones persistentes
• $5-20/mes
```

**Arquitectura híbrida (si migras):**

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│   VERCEL                         RAILWAY               │
│   (solo frontend)                (solo backend)        │
│   ┌──────────────┐               ┌──────────────┐     │
│   │ React SPA    │               │ Payload CMS  │     │
│   │ SSG/SSR      │  ──API──→     │ Node.js      │     │
│   │ Edge global  │               │ Always-on    │     │
│   └──────────────┘               └──────────────┘     │
│                                        │              │
│                                        ▼              │
│                               ┌──────────────┐       │
│                               │ PostgreSQL   │       │
│                               │ (Neon/VPS)   │       │
│                               └──────────────┘       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

### P3: ¿Por qué migrar frontend a Vercel Edge?

**NO es obligatorio.** Vercel Edge solo tiene sentido si:

| Situación | ¿Vercel Edge? |
|-----------|---------------|
| Usuarios solo en España | ❌ No necesario |
| Usuarios en Europa | ⚠️ Cloudflare gratis es suficiente |
| Usuarios globales (USA, Asia, LatAm) | ✅ Sí tiene sentido |
| Mucho contenido dinámico (SSR) | ✅ Reduce latencia |
| Contenido estático (SSG) | ❌ Cloudflare gratis es igual |

**¿Qué es Vercel Edge?**

```
Sin Edge (VPS en Alemania):
──────────────────────────
Usuario en Madrid    → 20ms  (cerca)
Usuario en New York  → 120ms (lejos)
Usuario en Tokyo     → 250ms (muy lejos)

Con Vercel Edge:
──────────────────────────
Usuario en Madrid    → 15ms  (edge en Madrid)
Usuario en New York  → 15ms  (edge en New York)
Usuario en Tokyo     → 15ms  (edge en Tokyo)
```

**Para CEPComunicacion:** Si tus usuarios están principalmente en España, **Cloudflare (gratis) + VPS es suficiente**.

---

### P4: ¿Por qué Neon y no Supabase?

**Comparación directa:**

| Aspecto | Neon | Supabase |
|---------|------|----------|
| **Core** | Solo PostgreSQL | PostgreSQL + Auth + Storage + Realtime |
| **Multi-tenant** | ✅ Branching por tenant | ⚠️ Database-per-tenant caro |
| **Pricing model** | Compute-based | Usuario-based |
| **Escalabilidad** | ✅ Horizontal (serverless) | ❌ Solo vertical |
| **Cold starts** | ~500ms | ❌ No hay |
| **Conexión con Payload** | ✅ Standard PostgreSQL | ⚠️ Requiere adaptador |

**¿Por qué NO Supabase para este proyecto?**

```
1. YA TIENES implementado:
   • Auth → Payload Auth (RBAC de 6 niveles)
   • Storage → Sistema de uploads propio
   • Multi-tenant → Row-Level Security en Payload

   Supabase duplicaría estas features sin beneficio.

2. PRICING PROBLEMÁTICO para multi-tenant:

   Supabase cobra por MAUs (usuarios activos):
   ─────────────────────────────────────────
   Free:  50K MAUs
   Pro:   100K MAUs ($25/mes) + $0.00325/MAU extra

   Si tienes 100 tenants × 500 usuarios = 50,000 MAUs
   → Justo en el límite de Pro
   → Cualquier crecimiento = overages

   Neon cobra por compute:
   ─────────────────────────────────────────
   Launch: $0.106/CU-hour

   100 tenants con uso moderado:
   → ~200 CU-hours/mes = $21
   → Mucho más predecible

3. SUPABASE NO ESCALA HORIZONTALMENTE:

   Supabase usa UNA instancia PostgreSQL por proyecto.
   Si necesitas más poder, solo puedes:
   • Upgrade a instancia más grande (más cara)
   • NO puedes distribuir carga

   Neon usa arquitectura serverless:
   • Compute se escala automáticamente
   • Storage se replica automáticamente
   • Sin límite teórico

4. LOCK-IN:

   Supabase tiene muchas features propietarias:
   • Supabase Auth (diferente a Payload Auth)
   • Supabase Storage (diferente a tu sistema)
   • Supabase Realtime (no lo necesitas)

   Neon es PostgreSQL estándar:
   • Migras a cualquier PostgreSQL
   • Sin cambios de código
```

---

### P5: ¿Podemos mantener VPS hasta 1000 tenants?

**RESPUESTA: SÍ, es posible, pero requiere estrategia.**

**Escalado vertical máximo en Hetzner:**

| Plan | vCPU | RAM | SSD | €/mes | Tenants Estimados |
|------|------|-----|-----|-------|-------------------|
| CX22 | 2 | 4 GB | 40 GB | €4.51 | 1-5 |
| CX32 | 4 | 8 GB | 80 GB | €8.98 | 5-15 |
| CX42 | 8 | 16 GB | 160 GB | €17.97 | 15-40 |
| CX52 | 16 | 32 GB | 240 GB | €35.88 | 40-100 |
| **CCX23** | **4 dedicated** | **16 GB** | **80 GB** | **€36.41** | **50-150** |
| **CCX33** | **8 dedicated** | **32 GB** | **160 GB** | **€72.83** | **100-300** |
| **CCX43** | **16 dedicated** | **64 GB** | **240 GB** | **€145.66** | **300-600** |
| **CCX53** | **32 dedicated** | **128 GB** | **360 GB** | **€291.31** | **500-1000** |

**Para 1000 tenants necesitas:**

```
Cálculo:
─────────────────────────────────────────
RAM por tenant: ~50-100 MB (usuarios activos concurrentes)
CPU por tenant: ~0.05-0.1 vCPU

1000 tenants:
• RAM: 1000 × 75 MB = 75 GB + 10 GB sistema = 85 GB
• CPU: 1000 × 0.075 = 75 vCPU (PROBLEMA)

PROBLEMA: Hetzner máximo es 32 vCPU

SOLUCIÓN: Cluster de 2-3 servidores
```

**Arquitectura para 1000 tenants en VPS:**

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA CLUSTER                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐         ┌─────────────────┐            │
│  │ Load Balancer   │         │ Load Balancer   │            │
│  │ Hetzner LB      │         │ (backup)        │            │
│  │ €5.83/mes       │         │ opcional        │            │
│  └────────┬────────┘         └────────┬────────┘            │
│           │                           │                      │
│     ┌─────┴─────┬─────────────────────┴─────┐               │
│     ▼           ▼                           ▼               │
│  ┌──────┐   ┌──────┐   ┌──────┐                             │
│  │App 1 │   │App 2 │   │App 3 │   ← 3 × CCX33 = €218/mes   │
│  │333   │   │333   │   │334   │   ← Tenants distribuidos    │
│  │tenants│  │tenants│  │tenants│                            │
│  └──┬───┘   └──┬───┘   └──┬───┘                             │
│     │          │          │                                  │
│     └──────────┼──────────┘                                  │
│                ▼                                             │
│  ┌─────────────────────────────────────┐                    │
│  │ PostgreSQL Primary                   │                    │
│  │ CCX43 (16 vCPU, 64 GB RAM)          │ ← €145/mes         │
│  │ Dedicated for 1000 tenants           │                    │
│  └─────────────────────────────────────┘                    │
│                │                                             │
│                ▼                                             │
│  ┌─────────────────────────────────────┐                    │
│  │ PostgreSQL Replica (read-only)       │                    │
│  │ CCX33 (8 vCPU, 32 GB RAM)           │ ← €72/mes          │
│  │ Para queries de reporting            │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
│  Redis: Puede quedarse en App 1 o separar                   │
│                                                              │
│  COSTO TOTAL para 1000 tenants:                             │
│  ─────────────────────────────────────                      │
│  3 × App servers (CCX33):     €218.49/mes                   │
│  1 × DB Primary (CCX43):      €145.66/mes                   │
│  1 × DB Replica (CCX33):      €72.83/mes                    │
│  1 × Load Balancer:           €5.83/mes                     │
│  ─────────────────────────────────────                      │
│  TOTAL:                       ~€443/mes (~$480)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Comparación: VPS Cluster vs Vercel para 1000 tenants**

| Aspecto | VPS Cluster | Vercel + Railway + Neon |
|---------|-------------|-------------------------|
| **Costo** | ~€443/mes | ~$800-1200/mes |
| **Complejidad** | Alta (cluster setup) | Baja (managed) |
| **Control** | Total | Limitado |
| **Escalado** | Manual (añadir nodos) | Automático |
| **Mantenimiento** | Alto | Bajo |
| **DevOps requerido** | Sí (parte del equipo) | No |

**Mi recomendación para 1000 tenants:**

```
SI tienes equipo DevOps o el CTO puede dedicar tiempo:
→ VPS Cluster (€443/mes) - MEJOR ROI

SI no tienes tiempo para DevOps:
→ Vercel + Railway + Neon ($800-1200/mes) - MÁS CÓMODO

SI quieres balance:
→ VPS para producción + Neon para dev
→ ~€450-500/mes
```

---

### RESUMEN EJECUTIVO

**¿Qué hacer AHORA (1-10 tenants)?**
```
✅ Mantener VPS actual (€4.51/mes)
✅ Añadir Cloudflare CDN (gratis)
✅ Configurar SWAP (4GB)
✅ SSL con Let's Encrypt
```

**¿Qué hacer a 100 tenants?**
```
✅ Upgrade a CCX33 (€72/mes)
✅ Separar PostgreSQL a su propio servidor
✅ Considerar réplica de lectura
```

**¿Qué hacer a 1000 tenants?**
```
✅ Cluster de 3 app servers
✅ PostgreSQL dedicado + réplica
✅ Load balancer
✅ ~€443/mes total
```

**¿Cuándo cambiar a Vercel?**
```
SOLO SI:
• El equipo crece a 5+ devs
• El tiempo de DevOps cuesta más de €500/mes
• Necesitas edge global (usuarios fuera de Europa)
```

---

## 10. VERCEL EN LA PRÁCTICA: ¿Qué te Facilita la Vida?

### Escenario: Tu Día a Día ACTUAL con VPS

```
DEPLOY DE UN CAMBIO:
─────────────────────────────────────────────────────────────

1. Haces cambios en el código local
2. git commit && git push

3. SSH al servidor:
   ssh root@46.62.222.138

4. Pull del código:
   cd /opt/apps/cms && git pull

5. Instalar dependencias (si hay nuevas):
   pnpm install

6. Build:
   pnpm build

7. Reiniciar:
   pm2 restart cepcomunicacion-cms

8. Verificar:
   pm2 logs cepcomunicacion-cms --lines 50

TIEMPO TOTAL: 5-10 minutos
INTERVENCIÓN MANUAL: 6 comandos
```

### Escenario: Tu Día a Día con Vercel

```
DEPLOY DE UN CAMBIO:
─────────────────────────────────────────────────────────────

1. Haces cambios en el código local
2. git push

✅ LISTO - Vercel detecta el push y hace todo automáticamente:
   • Build
   • Tests (si están configurados)
   • Deploy
   • Notificación en Slack/Discord

TIEMPO TOTAL: 0 minutos de tu tiempo
INTERVENCIÓN MANUAL: 0 comandos
```

---

### Las 7 Cosas que Vercel te Facilita

#### 1. ZERO DEPLOYS MANUALES

**VPS (Actual):**
```bash
# Cada vez que quieres desplegar:
ssh root@servidor
cd /opt/apps/cms
git pull
pnpm install
pnpm build
pm2 restart app
# Rezar para que funcione
pm2 logs app
```

**Vercel:**
```bash
git push
# Ir a tomar un café
```

**¿Cuánto tiempo ahorras?**
- 10 deploys/semana × 10 min = **100 minutos/semana** = 7 horas/mes

---

#### 2. PREVIEW DEPLOYMENTS AUTOMÁTICOS

**VPS (Actual):**
```
Tu proceso de QA:
─────────────────
1. Developer hace cambios
2. Push a branch
3. TÚ (CTO) SSH al servidor
4. Checkout del branch
5. Build y deploy a staging
6. Probar manualmente
7. Si OK, merge a main
8. Repetir proceso para producción

TIEMPO: 30-60 minutos por feature
```

**Vercel:**
```
Tu proceso de QA:
─────────────────
1. Developer hace cambios
2. Push a branch → PR automático
3. Vercel crea URL única: https://cep-pr-123.vercel.app
4. Tú (y el developer) prueban en esa URL
5. Si OK, merge → Deploy automático a prod

TIEMPO: 0 minutos de tu tiempo
```

**Ejemplo real:**
```
Developer A: "Terminé el formulario de leads"
→ URL automática: https://cep-git-feature-leads-solaria.vercel.app

Developer B: "Arreglé el bug del calendario"
→ URL automática: https://cep-git-fix-calendar-solaria.vercel.app

Tú: Abres las URLs, pruebas, apruebas merge. Sin tocar servidor.
```

---

#### 3. ROLLBACK INSTANTÁNEO

**VPS (Actual):**
```
Si un deploy falla:
──────────────────
1. SSH al servidor
2. git log (buscar commit anterior)
3. git checkout <commit-anterior>
4. pnpm install (por si acaso)
5. pnpm build
6. pm2 restart
7. Verificar logs

TIEMPO: 10-20 minutos de estrés
```

**Vercel:**
```
Si un deploy falla:
──────────────────
1. Ir al dashboard de Vercel
2. Click en "Rollback" en el deploy anterior
3. ✅ Listo (30 segundos)
```

---

#### 4. LOGS Y MÉTRICAS CENTRALIZADAS

**VPS (Actual):**
```
Para ver qué pasa:
──────────────────
ssh root@servidor
pm2 logs app --lines 100
# O
tail -f /var/log/nginx/access.log
# O
docker logs cep-cms
```

**Vercel:**
```
Para ver qué pasa:
──────────────────
Abrir dashboard.vercel.com
→ Ver logs en tiempo real
→ Ver métricas de performance
→ Ver errores con stack traces
→ Ver analytics de Core Web Vitals
```

---

#### 5. SSL AUTOMÁTICO Y RENOVACIÓN

**VPS (Actual):**
```
Configurar SSL:
──────────────────
1. Instalar certbot
2. Configurar Nginx
3. Generar certificado
4. Configurar renovación automática
5. Verificar que funciona

# Y cada 3 meses:
Verificar que la renovación funcionó
```

**Vercel:**
```
SSL: ✅ Automático desde el día 1
Renovación: ✅ Automática
Tu intervención: 0
```

---

#### 6. EDGE FUNCTIONS (Serverless Geográfico)

**VPS (Actual):**
```
Servidor en Alemania
Usuario en Madrid: 20ms
Usuario en Argentina: 180ms
Usuario en USA: 120ms
```

**Vercel:**
```
Edge en 100+ ubicaciones
Usuario en Madrid: 15ms (edge Madrid)
Usuario en Argentina: 15ms (edge Buenos Aires)
Usuario en USA: 15ms (edge New York)
```

**¿Cuándo importa?** Solo si tienes usuarios globales.
**Para CEPComunicacion:** Probablemente NO importa (usuarios en España).

---

#### 7. INTEGRACIÓN CON GITHUB (CI/CD Nativo)

**VPS (Actual):**
```
Para tener CI/CD necesitas:
─────────────────────────
1. Configurar GitHub Actions
2. Crear workflow.yml
3. Configurar SSH keys como secrets
4. Configurar variables de entorno
5. Mantener el workflow actualizado

# workflow.yml (~50 líneas de YAML)
```

**Vercel:**
```
CI/CD: ✅ Conectar repo de GitHub y listo
Variables: ✅ Dashboard visual
Secrets: ✅ Dashboard visual
```

---

### RESUMEN: ¿Vale la Pena para Ti?

| Beneficio | Ahorro Estimado | ¿Vale la pena? |
|-----------|-----------------|----------------|
| Zero deploys manuales | 7 horas/mes | ✅ Si haces 10+ deploys/semana |
| Preview deployments | 4-8 horas/mes | ✅ Si tienes 2+ devs |
| Rollback instantáneo | Incalculable (paz mental) | ✅ Si valoras tu sueño |
| Logs centralizados | 2-3 horas/mes | ⚠️ Puedes hacerlo con Grafana |
| SSL automático | 1-2 horas/año | ⚠️ Let's Encrypt también es fácil |
| Edge Functions | 0 (usuarios en España) | ❌ No necesario |
| CI/CD integrado | 2-4 horas setup inicial | ⚠️ GitHub Actions también funciona |

### Mi Evaluación para Tu Caso

```
SITUACIÓN ACTUAL:
• 1 desarrollador (tú)
• Usuarios en España
• Deploy ocasional (1-2/semana probablemente)

VEREDICTO: ❌ NO VALE LA PENA AÚN
────────────────────────────────────────
Costo Vercel: $20-100/mes
Ahorro de tiempo: ~5-10 horas/mes
Costo por hora tuya: ¿€50-100?
Ahorro monetario: €500-1000/mes (si tu tiempo vale eso)

PERO: El VPS cuesta €4.51/mes
Diferencia: ~$100/mes = €1,200/año

¿Vale €1,200/año ahorrar 5-10 horas/mes de DevOps?
→ Si tu hora vale €25+: Sí
→ Si disfrutas el control del VPS: No
```

### Punto de Inflexión Real

```
MIGRAR A VERCEL cuando:

1. Tengas 3+ desarrolladores haciendo PRs frecuentes
   → Preview deployments se vuelven críticos

2. Hagas 10+ deploys por semana
   → El tiempo de deploy manual se acumula

3. Tu tiempo valga más que €100/mes
   → El costo de Vercel se justifica

4. Quieras delegar DevOps completamente
   → Zero intervención manual
```

---

## 11. ALTERNATIVA: VPS + GitHub Actions + Cloudflare (MEJOR OPCIÓN)

### Tienes Razón: Todos los Beneficios de Vercel se Pueden Replicar

| Beneficio Vercel | Alternativa con VPS | Costo |
|------------------|---------------------|-------|
| CI/CD automático | **GitHub Actions** | Gratis (2,000 min/mes) |
| Preview deployments | **GitHub Actions + Docker** | Gratis |
| Edge global | **Cloudflare CDN** | Gratis |
| SSL automático | **Let's Encrypt + Cloudflare** | Gratis |
| Rollback | **Docker tags + script** | Gratis |
| Logs centralizados | **Grafana + Loki** | Gratis (self-hosted) |

---

### GitHub Actions: CI/CD Gratuito

**Incluido GRATIS (plan Free de GitHub):**
- 2,000 minutos/mes para repos privados
- Ilimitado para repos públicos
- Linux: $0.008/min después del límite

**Cálculo para CEPComunicacion:**
```
Build típico: ~3-5 minutos
10 deploys/semana × 4 semanas = 40 deploys/mes
40 × 5 min = 200 minutos/mes

GRATIS (muy por debajo de 2,000 min)
```

**GitHub Team ($4/usuario/mes) incluye:**
- 3,000 minutos/mes
- Protected branches
- Code owners
- Draft PRs

**Self-hosted runners (GRATIS):**
Si superas los minutos, puedes usar tu propio VPS como runner:
```bash
# En tu VPS:
./config.sh --url https://github.com/OWNER/REPO --token TOKEN
./run.sh

# Resultado: Builds corren en TU servidor = 0 costo de minutos
```

Fuente: [GitHub Actions Runner Pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing)

---

### Cloudflare: Edge Global GRATIS

**Plan FREE incluye:**
- CDN global (200+ datacenters)
- SSL gratuito
- DDoS protection
- Cache de assets estáticos
- 3 Page Rules

**Plan Pro ($20/mes) añade:**
- Más Page Rules (20)
- Image optimization (Polish)
- Cache Rules avanzadas
- Mobile optimization

**Para CEPComunicacion: FREE es suficiente**

```
Configuración óptima (gratis):
─────────────────────────────
1. Cloudflare como proxy DNS
2. Cache de assets estáticos (JS, CSS, imágenes)
3. SSL en modo Full (Strict)
4. Page Rules para cache de páginas
```

**¿Cuándo Pro vale la pena?**
- Si necesitas cache granular por cookies (login sessions)
- Si tienes muchas imágenes (Polish optimization)
- Si quieres Argo Smart Routing (+$5/mes para rutas óptimas)

Fuente: [Cloudflare Plans](https://www.cloudflare.com/plans/)

---

### Workflow Completo: VPS + GitHub Actions + Cloudflare

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # Para CADA PR: Preview deployment
  preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build
        run: pnpm install && pnpm build

      - name: Deploy Preview
        run: |
          # Deploy a subdomain temporal
          # preview-pr-123.cepcomunicacion.com
          ssh root@${{ secrets.VPS_IP }} "
            cd /opt/previews/pr-${{ github.event.number }}
            docker compose up -d
          "

      - name: Comment PR with URL
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: '🚀 Preview: https://preview-pr-${{ github.event.number }}.cepcomunicacion.com'
            })

  # Para MAIN: Production deployment
  production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build
        run: pnpm install && pnpm build

      - name: Deploy Production
        run: |
          ssh root@${{ secrets.VPS_IP }} "
            cd /opt/apps/cms
            git pull
            pnpm install --frozen-lockfile
            pnpm build
            pm2 restart cepcomunicacion-cms
          "

      - name: Purge Cloudflare Cache
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CF_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'

      - name: Health Check
        run: |
          sleep 10
          curl -f https://cepcomunicacion.com/api/health || exit 1
```

**Este workflow te da:**
- ✅ Deploy automático en push a main
- ✅ Preview URL por cada PR
- ✅ Purge de cache Cloudflare
- ✅ Health check post-deploy
- ✅ Notificación en PR con URL de preview

---

### Comparativa Final: Vercel vs VPS+GH+CF

| Aspecto | Vercel | VPS + GitHub Actions + Cloudflare |
|---------|--------|-----------------------------------|
| **Costo base** | $20/dev/mes | €4.51/mes (total) |
| **CI/CD** | ✅ Integrado | ✅ GitHub Actions (gratis) |
| **Preview deploys** | ✅ Automático | ✅ Con workflow (30 min setup) |
| **Edge/CDN** | ✅ Nativo | ✅ Cloudflare (gratis) |
| **SSL** | ✅ Automático | ✅ Cloudflare (gratis) |
| **Rollback** | ✅ 1 click | ⚠️ Script (pero funciona) |
| **Logs** | ✅ Dashboard | ⚠️ SSH o Grafana |
| **Setup inicial** | 5 minutos | 2-3 horas |
| **Mantenimiento** | Cero | Bajo (updates ocasionales) |

---

### Costo Total Comparado (Por Escala)

| Escenario | Vercel Pro | VPS + GitHub + Cloudflare |
|-----------|------------|---------------------------|
| **1 tenant, 1 dev** | $20/mes | **€4.51/mes** |
| **10 tenants, 3 devs** | $60 + overages = ~$100 | **€8.98/mes** |
| **50 tenants, 5 devs** | $100 + overages = ~$200 | **€35.88/mes** |
| **100 tenants, 5 devs** | $100 + overages = ~$400 | **€72.83/mes** |
| **Ahorro anual (100 tenants)** | - | **~€3,900/año** |

---

### ¿Cuándo Cloudflare Pro o GitHub Team?

**Cloudflare Pro ($20/mes) - SOLO SI:**
```
• Tienes muchas imágenes grandes (Polish optimization)
• Necesitas cache bypass por cookies (usuarios logueados)
• Quieres Argo Smart Routing para latencia óptima
```

**GitHub Team ($4/usuario/mes) - SOLO SI:**
```
• Superas 2,000 min/mes de builds (muy improbable)
• Necesitas branch protection rules avanzadas
• Quieres CODEOWNERS para review obligatorio
```

**Para CEPComunicacion actual:** FREE en ambos es suficiente.

---

### MI RECOMENDACIÓN FINAL ACTUALIZADA

```
╔═══════════════════════════════════════════════════════════════╗
║          STACK RECOMENDADO: VPS + GITHUB + CLOUDFLARE         ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                 ║
║  INFRAESTRUCTURA:                                              ║
║  ├── VPS Hetzner (€4.51 - €72/mes según escala)               ║
║  ├── PostgreSQL nativo (incluido)                              ║
║  ├── Redis nativo (incluido)                                   ║
║  └── PM2 para process management                               ║
║                                                                 ║
║  CI/CD:                                                         ║
║  ├── GitHub Actions (GRATIS, 2,000 min/mes)                    ║
║  ├── Workflow con preview deployments                          ║
║  └── Self-hosted runner (opcional, si superas minutos)        ║
║                                                                 ║
║  CDN & EDGE:                                                    ║
║  ├── Cloudflare FREE                                           ║
║  ├── SSL automático                                            ║
║  ├── Cache de assets                                           ║
║  └── DDoS protection                                           ║
║                                                                 ║
║  COSTO TOTAL:                                                   ║
║  ├── 1-10 tenants:  €4.51 - €8.98/mes                         ║
║  ├── 10-50 tenants: €17.97 - €35.88/mes                       ║
║  └── 50-100 tenants: €72.83/mes                               ║
║                                                                 ║
║  vs VERCEL:                                                     ║
║  ├── 1-10 tenants:  $100-200/mes (20-40x más caro)            ║
║  └── 50-100 tenants: $400-600/mes (6-8x más caro)             ║
║                                                                 ║
╚═══════════════════════════════════════════════════════════════╝
```

---

### Próximos Pasos Concretos

**1. Configurar GitHub Actions (30 min):**
```bash
# Crear workflow básico
mkdir -p .github/workflows
# Añadir deploy.yml con el template de arriba
```

**2. Configurar Cloudflare (15 min):**
```bash
# 1. Añadir dominio a Cloudflare
# 2. Cambiar nameservers
# 3. Configurar SSL: Full (Strict)
# 4. Crear Page Rule: Cache Everything para /static/*
```

**3. Configurar VPS para previews (1 hora, opcional):**
```bash
# Si quieres preview deployments por PR:
# Configurar wildcard subdomain *.cepcomunicacion.com
# Crear script para levantar containers por PR
```

---

## 12. RECOMENDACIONES FINALES

### Corto Plazo (1-10 tenants) - Próximos 6 meses

```
✅ MANTENER: VPS Hetzner + PostgreSQL + Payload CMS
   Costo: €4.51 - €8.98/mes
   Razón: ROI máximo, sin cambios de arquitectura
```

**Optimizaciones inmediatas:**
1. Configurar SWAP (4GB) - CRÍTICO
2. Activar SSL con Let's Encrypt
3. Añadir Cloudflare (gratis) como CDN

### Mediano Plazo (10-50 tenants) - 6-18 meses

```
🔄 EVALUAR: Neon DB para desarrollo/staging
   Costo adicional: $19-69/mes
   Beneficio: Branching, previews por PR
```

**Implementar:**
1. Neon para ambientes de desarrollo (branching)
2. PostgreSQL en VPS para producción
3. GitHub Actions para CI/CD

### Largo Plazo (50-100+ tenants) - 18+ meses

```
🔄 CONSIDERAR: Arquitectura híbrida
   - Vercel para frontend (edge rendering)
   - VPS/Railway para Payload CMS
   - Neon o PlanetScale para DB

   O

   - Kubernetes cluster propio
   - PostgreSQL con Patroni (HA)
   - Horizontal scaling
```

---

## 7. RIESGOS Y MITIGACIONES

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| VPS sin SWAP | 🔴 Alto | Configurar 4GB SWAP inmediatamente |
| Single point of failure | 🟡 Medio | Backups diarios, replica en standby |
| Vendor lock-in Supabase | 🟡 Medio | Mantener PostgreSQL estándar |
| Overages Vercel | 🟡 Medio | Configurar alertas de spending |
| Escalado manual VPS | 🟢 Bajo | Scripts de auto-upgrade |

---

## Fuentes

### Database
- [Supabase Pricing](https://supabase.com/pricing)
- [Neon Pricing](https://neon.com/pricing)
- [Supabase vs AWS Comparison](https://www.bytebase.com/blog/supabase-vs-aws-database-pricing/)

### Deployment
- [Vercel Pricing](https://vercel.com/pricing)
- [Vercel Pricing Breakdown](https://flexprice.io/blog/vercel-pricing-breakdown)
- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare Pages Pricing](https://www.cloudflare.com/plans/developer-platform/)

---

## Conclusión

**Para CEPComunicacion v2 con la arquitectura multi-tenant actual:**

1. **Database:** Mantener PostgreSQL + Payload es la opción más costo-efectiva y flexible. Supabase no escala bien para multi-tenant y Neon es mejor como complemento para desarrollo.

2. **Deployment:** VPS Hetzner ofrece el mejor ROI hasta ~50 tenants. Vercel solo tiene sentido si el equipo crece y el tiempo de DevOps supera el costo del servicio.

3. **Estrategia híbrida futura:** Usar Neon para dev/staging + PostgreSQL en VPS para prod es un buen equilibrio de DX y costo.

**No se recomienda migrar a Supabase** porque:
- El multi-tenant ya está implementado correctamente
- No hay beneficio técnico que justifique el costo adicional
- Supabase no escala bien más allá de ~10 tenants con database-per-tenant

**No se recomienda Cloudflare Pages** porque:
- Payload CMS no es compatible con Workers
- Requeriría reescribir todo el backend
