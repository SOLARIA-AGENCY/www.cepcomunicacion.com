# PROMPT DE CORRECCIÓN: Sistema CEPComunicacion + Academix

**Fecha:** 2025-12-07
**Prioridad:** P0 - Crítico
**Tiempo estimado:** 4-6 horas

---

## CONTEXTO DEL PROBLEMA

El sistema CEPComunicacion es una plataforma multi-tenant para gestión educativa que consta de:

1. **Academix Dashboard** (puerto 3003) - Panel de administración principal para SOLARIA
2. **Impersonator** (/dashboard/impersonar) - Permite a SOLARIA acceder como cliente
3. **Payload CMS** (puerto 3002) - CMS por cliente para gestión de datos

### Arquitectura Esperada

```
┌─────────────────────────────────────────────────────────────┐
│                    SOLARIA AGENCY                            │
│                  (Super Administrador)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ACADEMIX DASHBOARD (3003)                       │
│   /dashboard - Lista de clientes/tenants                    │
│   /dashboard/impersonar - Selector de cliente               │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  CEP Formación  │ │   Cliente B     │ │   Cliente C     │
│  Payload (3002) │ │  Payload (TBD)  │ │  Payload (TBD)  │
│  PostgreSQL     │ │  PostgreSQL     │ │  PostgreSQL     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## BUGS CRÍTICOS A RESOLVER

### BUG #1: CSS No Renderiza en Payload Admin (P0)

**Ubicación:** `apps/cms` → `/admin`

**Síntomas:**
- Página de Payload Admin muestra fondo transparente
- Formularios sin estilos (texto negro sobre fondo blanco/transparente)
- Console errors: "Refused to execute script from '*.css'"

**Causa Raíz Identificada:**
Next.js 15.x genera HTML con CSS cargado TANTO como `<link>` Y como `<script>`:

```html
<!-- CORRECTO - se genera -->
<link rel="stylesheet" href="/_next/static/css/xxx.css"/>

<!-- BUG - también se genera -->
<script src="/_next/static/css/xxx.css" async=""></script>
```

El navegador intenta ejecutar CSS como JavaScript, falla, y causa race conditions en la carga de estilos.

**Versiones Probadas (bug persiste):**
- Next.js 15.2.3 + Payload 3.62.1 ❌
- Next.js 15.4.8 + Payload 3.67.0 ❌

**Archivos Relevantes:**
- `apps/cms/next.config.js`
- `apps/cms/src/payload.config.ts`
- `apps/cms/app/globals.css`
- `apps/cms/tailwind.config.js`

**Posibles Soluciones a Investigar:**
1. Configuración de `cssChunking` en next.config.js
2. Deshabilitar CSS optimization en producción
3. Custom Document con manejo explícito de CSS
4. Actualizar a Payload 3.68+ cuando salga fix oficial
5. Workaround con CSS inline para Payload admin

---

### BUG #2: Academix Dashboard No Conecta con Impersonator

**Ubicación:** `apps/admin`

**Estado Esperado:**
1. Usuario SOLARIA accede a `http://localhost:3003/dashboard`
2. Ve lista de clientes/tenants
3. Selecciona cliente en `/dashboard/impersonar`
4. Se redirige a Payload CMS del cliente seleccionado

**Estado Actual:**
- Dashboard muestra mockups estáticos
- Impersonator no conecta con tenants reales
- No hay integración con Payload CMS de clientes

**Archivos a Revisar:**
```
apps/admin/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          # Lista de clientes
│   │   └── impersonar/
│   │       └── page.tsx      # Selector de tenant
│   └── login/
│       └── page.tsx          # Auth SOLARIA
├── lib/
│   └── api.ts                # Cliente API
└── components/               # UI components
```

**Tareas:**
1. Implementar API de listado de tenants
2. Conectar Impersonator con instancias de Payload
3. Manejar autenticación cross-tenant
4. Implementar token de impersonación

---

### BUG #3: TailwindCSS v4 Configuración

**Problema:** Colores CSS variables no generan clases de utilidad.

**Configuración CORRECTA (verificar que esté así):**

```javascript
// apps/cms/tailwind.config.js
module.exports = {
  theme: {
    colors: {  // ✅ EN theme.colors, NO en extend
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      // ... resto de colores
    },
    extend: {
      // ❌ NO mover colores aquí
    }
  }
}
```

---

## VERSIONES FIJAS (NO CAMBIAR SIN PRUEBAS)

```json
{
  "next": "15.4.8",
  "payload": "^3.67.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "@payloadcms/next": "3.67.0",
  "@payloadcms/db-postgres": "3.67.0",
  "@payloadcms/ui": "3.67.0"
}
```

**REGLA:** Todos los `@payloadcms/*` DEBEN tener la misma versión que `payload`.

---

## ESTRUCTURA DE ARCHIVOS CLAVE

```
www.cepcomunicacion.com/
├── apps/
│   ├── cms/                      # Payload CMS (cliente CEP)
│   │   ├── app/
│   │   │   ├── (dashboard)/      # Custom dashboard pages
│   │   │   ├── (payload)/        # Payload admin routes
│   │   │   │   └── admin/
│   │   │   │       └── [[...segments]]/
│   │   │   └── api/              # API routes
│   │   ├── src/
│   │   │   ├── collections/      # Payload collections
│   │   │   └── payload.config.ts # Config principal
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── .env
│   │
│   └── admin/                    # Academix Dashboard (SOLARIA)
│       ├── app/
│       │   ├── dashboard/
│       │   │   ├── page.tsx      # Lista clientes
│       │   │   └── impersonar/
│       │   │       └── page.tsx  # Selector tenant
│       │   └── login/
│       └── lib/
│           └── api.ts
│
├── .memory/
│   ├── VERSION_COMPATIBILITY.md  # Versiones documentadas
│   └── PROMPT_CORRECCION_SISTEMA.md  # Este archivo
│
└── CLAUDE.md                     # Instrucciones proyecto
```

---

## COMANDOS DE VERIFICACIÓN

### 1. Verificar CSS Bug

```bash
cd apps/cms

# Limpiar cache
rm -rf .next node_modules/.cache

# Build producción
pnpm build

# Iniciar servidor
pnpm start --port 3002

# Verificar script tags con CSS (BUG)
curl -s http://localhost:3002/admin | grep -o '<script[^>]*css[^>]*>'

# Verificar link tags (CORRECTO)
curl -s http://localhost:3002/admin | grep -o '<link[^>]*css[^>]*>'
```

### 2. Verificar Academix Dashboard

```bash
cd apps/admin

rm -rf .next node_modules/.cache
pnpm dev --port 3003

# Probar rutas
curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/dashboard
curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/dashboard/impersonar
```

### 3. Test con Playwright

```bash
# Script de prueba CSS
python3 /tmp/create_user_and_verify_css.py

# Verificar screenshots en /tmp/css_*.png
```

---

## CRITERIOS DE ÉXITO

### CSS Fix Completado Cuando:
- [ ] `curl ... | grep '<script.*css'` retorna vacío
- [ ] Screenshot de /admin muestra estilos completos
- [ ] No hay errores "Refused to execute script" en console
- [ ] Background de body NO es `rgba(0,0,0,0)`
- [ ] Formularios tienen estilos de Payload UI

### Academix Dashboard Completado Cuando:
- [ ] /dashboard muestra lista real de tenants desde DB
- [ ] /dashboard/impersonar permite seleccionar cliente
- [ ] Al seleccionar cliente, redirige a su Payload CMS
- [ ] Token de impersonación funciona cross-tenant
- [ ] SOLARIA puede ver/editar datos del cliente

---

## REFERENCIAS

- [Payload CMS Docs](https://payloadcms.com/docs)
- [GitHub Issue #9598](https://github.com/payloadcms/payload/issues/9598) - CSS is not defined
- [GitHub Issue #12640](https://github.com/payloadcms/payload/issues/12640) - Config context
- [Next.js App Router CSS](https://nextjs.org/docs/app/building-your-application/styling)
- [VERSION_COMPATIBILITY.md](/.memory/VERSION_COMPATIBILITY.md)

---

## INSTRUCCIONES PARA EL AGENTE

1. **Prioridad 1:** Resolver bug de CSS en Payload Admin
   - Investigar next.config.js cssChunking options
   - Probar con CSS extraction manual
   - Verificar con Playwright después de cada cambio

2. **Prioridad 2:** Conectar Academix con tenants
   - Revisar modelo de datos de Tenants en Payload
   - Implementar API de listado
   - Crear flujo de impersonación

3. **NO HACER:**
   - Cambiar versiones sin documentar en VERSION_COMPATIBILITY.md
   - Borrar .memory/
   - Modificar collections de Payload sin backup

4. **DOCUMENTAR:**
   - Todo cambio de configuración
   - Resultados de pruebas
   - Nuevos bugs encontrados

---

**Generado:** 2025-12-07 20:30 UTC
**Por:** Claude Code (Auditoría de Sistema)
