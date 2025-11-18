# 🚀 Despliegue en Netlify - CEP Comunicación v2

## 📋 Resumen de Arquitectura

**Estrategia Híbrida Optimizada:**

- **Frontend (web-next)** → Netlify (SSR/SSG)
- **Admin Panel** → Netlify (SPA)
- **Backend (CMS + API + Servicios)** → Railway/Render (Docker)

**Beneficios:**

- ✅ Previews automáticos en PRs
- ✅ Despliegues instantáneos
- ✅ CDN global integrado
- ✅ Costos optimizados
- ✅ Backend robusto con todos los servicios

---

## 🏗️ Estructura de Despliegues

### 1. Frontend Público (`apps/web-next`)

- **Tecnología:** Next.js 14 con App Router
- **Despliegue:** Netlify (SSR/SSG)
- **URL:** `https://cepcomunicacion.com`
- **Características:**
  - Páginas estáticas generadas en build time
  - Rutas dinámicas server-rendered
  - API routes proxy a backend
  - Imágenes optimizadas automáticamente

### 2. Panel de Administración (`apps/admin`)

- **Tecnología:** Next.js 15
- **Despliegue:** Netlify (SPA)
- **URL:** `https://admin.cepcomunicacion.com`
- **Características:**
  - Single Page Application
  - Autenticación JWT
  - Consumo de API REST

### 3. Backend Completo (`apps/cms` + infraestructura)

- **Tecnología:** Payload CMS + PostgreSQL + Redis + MinIO
- **Despliegue:** Railway/Render
- **URL:** `https://api.cepcomunicacion.com`
- **Servicios incluidos:**
  - Payload CMS (admin + API)
  - PostgreSQL database
  - Redis (cache + queues)
  - MinIO (S3-compatible storage)
  - Background workers (BullMQ)
  - Email service (MailHog/Postfix)

---

## 🚀 Guía de Despliegue Paso a Paso

### Paso 1: Preparar Netlify

#### 1.1 Crear cuenta y sitios

```bash
# Instalar Netlify CLI
npm install -g netlify-cli
netlify login

# Crear sitio para frontend
netlify init
# Seleccionar: "Create & configure a new site"
# Nombre sugerido: cepcomunicacion

# Crear sitio para admin
netlify init
# Seleccionar: "Create & configure a new site"
# Nombre sugerido: cep-admin
```

#### 1.2 Configurar dominios

```bash
# Frontend
netlify domains:add cepcomunicacion.com
netlify domains:add www.cepcomunicacion.com

# Admin
netlify domains:add admin.cepcomunicacion.com
```

### Paso 2: Configurar Variables de Entorno

#### En Netlify Dashboard:

```bash
# Para frontend (cepcomunicacion)
NEXT_PUBLIC_API_URL=https://api.cepcomunicacion.com
NEXT_PUBLIC_ENVIRONMENT=production

# Para admin (cep-admin)
NEXT_PUBLIC_API_URL=https://api.cepcomunicacion.com
```

#### En GitHub Secrets (para CI/CD):

```bash
NETLIFY_AUTH_TOKEN_FRONTEND=tu_token_aqui
NETLIFY_SITE_ID_FRONTEND=tu_site_id_aqui
NETLIFY_AUTH_TOKEN_ADMIN=tu_token_aqui
NETLIFY_SITE_ID_ADMIN=tu_site_id_aqui
NEXT_PUBLIC_API_URL=https://api.cepcomunicacion.com
NEXT_PUBLIC_API_URL_STAGING=https://api-staging.cepcomunicacion.com
```

### Paso 3: Desplegar Backend (Railway/Render)

#### Opción A: Railway (Recomendado - más fácil)

```bash
# 1. Crear cuenta en Railway
# 2. Conectar GitHub repository
# 3. Railway detectará automáticamente render.yaml
# 4. Configurar variables de entorno
# 5. Desplegar

# Variables críticas:
PAYLOAD_SECRET=generar_32_caracteres_seguros
DATABASE_URL=proporcionado_por_railway
REDIS_URL=proporcionado_por_railway
S3_ENDPOINT=proporcionado_por_railway
OPENAI_API_KEY=tu_clave_openai
```

#### Opción B: Render

```bash
# 1. Crear cuenta en Render
# 2. Crear servicios desde render.yaml
# 3. Configurar variables de entorno
# 4. Desplegar
```

### Paso 4: Configurar CI/CD

#### 4.1 GitHub Actions

El workflow `.github/workflows/deploy-netlify.yml` está configurado para:

- ✅ Despliegue automático en push a `main`
- ✅ Previews automáticos en PRs
- ✅ Tests automáticos
- ✅ Type checking
- ✅ Despliegue a staging/production

#### 4.2 Configurar GitHub Secrets

```bash
# En tu repositorio GitHub → Settings → Secrets and variables → Actions
NETLIFY_AUTH_TOKEN_FRONTEND=...
NETLIFY_SITE_ID_FRONTEND=...
NETLIFY_AUTH_TOKEN_ADMIN=...
NETLIFY_SITE_ID_ADMIN=...
NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_API_URL_STAGING=...
```

### Paso 5: Primer Despliegue

#### Despliegue Manual Inicial

```bash
# Desde la raíz del proyecto
./scripts/deploy-netlify.sh all
```

#### Verificar Despliegues

```bash
# Frontend
curl https://cepcomunicacion.com

# Admin
curl https://admin.cepcomunicacion.com

# API
curl https://api.cepcomunicacion.com/api/health
```

---

## 🔄 Flujo de Desarrollo y CI/CD

### Desarrollo Local

```bash
# Frontend
cd apps/web-next && npm run dev

# Admin
cd apps/admin && npm run dev

# CMS (requiere backend local)
cd apps/cms && npm run dev
```

### Proceso de PR

1. **Crear PR** → GitHub Actions ejecuta tests
2. **Tests pasan** → Se crea preview deployment
3. **Preview URL** → Revisar cambios en vivo
4. **Aprobar PR** → Merge a main
5. **Despliegue automático** → Producción actualizada

### URLs de Preview

- **Frontend:** `https://deploy-preview-[PR_NUMBER]--cepcomunicacion.netlify.app`
- **Admin:** `https://deploy-preview-[PR_NUMBER]--cep-admin.netlify.app`

---

## ⚙️ Configuración Avanzada

### Build Hooks (Opcional)

```bash
# Webhook para despliegues programados
curl -X POST -d '{}' \
  https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID
```

### Redirects y Rewrites

Los archivos `netlify.toml` incluyen:

- ✅ API proxy a backend
- ✅ SPA fallbacks
- ✅ Headers de seguridad
- ✅ Cache optimization

### Monitoreo

```bash
# Logs de Netlify
netlify logs

# Métricas de Railway/Render
# Dashboard de cada servicio
```

---

## 🐛 Troubleshooting

### Problema: Build falla en Netlify

```bash
# Verificar build localmente
cd apps/web-next && npm run build

# Verificar variables de entorno
# Asegurar que NEXT_PUBLIC_API_URL esté configurado
```

### Problema: API calls fallan

```bash
# Verificar CORS en backend
# Verificar que NEXT_PUBLIC_API_URL apunte correctamente
# Verificar que backend esté corriendo
```

### Problema: Preview deployments no se crean

```bash
# Verificar que el workflow de GitHub Actions esté habilitado
# Verificar que los secrets estén configurados
# Verificar que el PR tenga cambios en las apps correspondientes
```

---

## 💰 Costos Estimados

### Netlify (Gratis → $19/mes)

- **Plan Personal (Free):** 100GB bandwidth, 300 build minutes
- **Plan Pro ($19/mes):** 400GB bandwidth, 3000 build minutes
- **Plan Business ($99/mes):** 1000GB bandwidth, 10000 build minutes

### Railway (Pago por uso)

- **PostgreSQL:** ~$10/mes
- **Redis:** ~$3/mes
- **Workers:** ~$5/mes cada uno
- **MinIO:** ~$5/mes
- **Total estimado:** $25-40/mes

### Alternativa: VPS (Hetzner)

- **VPS CX11:** €4.51/mes (1 vCPU, 2GB RAM, 40GB SSD)
- **Total con dominio:** ~€10/mes

---

## 📞 Soporte

- **Documentación completa:** [docs/](../docs/)
- **Issues:** https://github.com/solaria-agency/cepcomunicacion/issues
- **Email:** soporte@solaria.agency

---

**¿Necesitas ayuda con algún paso específico?** Revisa los logs de despliegue y verifica la configuración de variables de entorno.</content>
</xai:function_call: write>
<parameter name="filePath">DEPLOYMENT_NETLIFY.md
