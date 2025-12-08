# VERSION COMPATIBILITY - CEPComunicacion CMS

**Fecha:** 2025-12-07
**Estado:** BLOQUEADO por bug de CSS en Next.js + Payload

---

## VERSIONES ACTUALES (NO CAMBIAR)

### Core Dependencies

| Package | Version | Lock Status |
|---------|---------|-------------|
| **next** | 15.4.8 | FIXED |
| **payload** | ^3.67.0 | FIXED |
| **react** | ^19.2.0 | FIXED |
| **react-dom** | ^19.2.0 | FIXED |

### Payload Plugins (DEBEN COINCIDIR con payload version)

| Package | Version |
|---------|---------|
| @payloadcms/next | 3.67.0 |
| @payloadcms/db-postgres | 3.67.0 |
| @payloadcms/drizzle | 3.67.0 |
| @payloadcms/graphql | 3.67.0 |
| @payloadcms/ui | 3.67.0 |
| @payloadcms/richtext-lexical | 3.67.0 |
| @payloadcms/storage-s3 | 3.67.0 |
| @payloadcms/plugin-cloud-storage | 3.67.0 |

### Infrastructure

| Component | Version |
|-----------|---------|
| Node.js | 22.x |
| PostgreSQL | 16.10 |
| Redis | 7.0.15 |
| pnpm | 9.x |

---

## DEPENDENCIAS DE COMPATIBILIDAD

```
Payload 3.67.0 → Requiere Next.js ≥15.4.8
Next.js 15.4.8 → Requiere React ≥19.0.0
@payloadcms/* → DEBEN coincidir con version de payload
```

**REGLA CRÍTICA:** Todos los paquetes @payloadcms/* DEBEN tener la misma versión que payload.

---

## BUG CONOCIDO: CSS NO RENDERIZA

### Síntomas

1. Payload Admin muestra página sin estilos (fondo transparente)
2. Console errors: "Refused to execute script from '*.css'"
3. CSS files cargados como `<script>` tags además de `<link>` tags

### Causa Raíz

Next.js 15.x App Router genera tanto:
- `<link rel="stylesheet" href="/*.css">` (correcto)
- `<script src="/*.css" async="">` (bug)

El navegador intenta ejecutar CSS como JavaScript, falla, y causa race conditions.

### Estado de Investigación

| Versión Probada | Bug Presente |
|-----------------|--------------|
| Next.js 15.2.3 + Payload 3.62.1 | Sí |
| Next.js 15.4.8 + Payload 3.67.0 | Sí |

### Referencias

- [GitHub Issue #9598](https://github.com/payloadcms/payload/issues/9598) - CSS is not defined
- [GitHub Issue #12640](https://github.com/payloadcms/payload/issues/12640) - Config context undefined
- [Payload Blog](https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload)

### Workarounds Investigados

1. ❌ Actualizar versiones - No resuelve
2. ❌ Limpiar cache (.next, node_modules/.cache) - No resuelve
3. 🔄 CSP Headers - Pendiente investigar
4. 🔄 CSS extraction config en next.config.js - Pendiente

---

## CONFIGURACIÓN CRÍTICA

### .env (apps/cms/.env)

```env
PORT=3002
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3002
NEXT_PUBLIC_SERVER_URL=http://localhost:3002
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=...
```

### payload.config.ts

```typescript
serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3002',
```

---

## COMANDOS DE BUILD

```bash
# Desarrollo (con bug de CSS)
pnpm dev --port 3002

# Producción
rm -rf .next node_modules/.cache
pnpm build
pnpm start --port 3002

# Limpiar y reiniciar
lsof -ti:3002 | xargs kill -9
rm -rf .next node_modules/.cache
pnpm dev --port 3002
```

---

## ACCIONES PROHIBIDAS

1. **NO** cambiar versión de Next.js sin probar CSS
2. **NO** cambiar versión de Payload sin actualizar TODOS los @payloadcms/*
3. **NO** usar npm en lugar de pnpm
4. **NO** ignorar peer dependency warnings de @payloadcms
5. **NO** borrar esta documentación sin actualizar

---

## PRÓXIMOS PASOS

1. Monitorear [Payload Releases](https://github.com/payloadcms/payload/releases) para fix de CSS
2. Investigar workaround con next.config.js cssChunking
3. Considerar reportar bug específico a Payload si no existe

---

**Última actualización:** 2025-12-07 20:15 UTC
**Actualizado por:** Claude Code (investigación de compatibilidad)
