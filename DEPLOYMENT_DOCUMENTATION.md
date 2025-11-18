# Deployment Documentation - Estado Actual del Sistema

## Fecha y Hora

**Generado:** 2025-11-18  
**Propósito:** Documentar estado completo antes de limpieza y reinstalación

## 🏗️ Arquitectura del Sistema

### Servidor VPS Hetzner

- **IP:** 46.62.222.138
- **Dominio:** cepcomunicacion.com
- **Proveedor:** Hetzner
- **OS:** Ubuntu (verificar versión específica)

### Aplicaciones

1. **Frontend (Next.js 16)** - Puerto 3000 (interno)
2. **CMS (Payload CMS)** - Puerto 3000 (interno)
3. **Admin Panel** - Puerto 3001 (interno)
4. **Nginx (Reverse Proxy)** - Puertos 80, 443
5. **PostgreSQL** - Base de datos principal
6. **Redis** - Cache y sesiones
7. **MinIO** - Almacenamiento de archivos

## 📁 Estructura de Directorios en Servidor

```
/var/www/cepcomunicacion/
├── apps/
│   ├── web-next/          # Frontend Next.js
│   ├── cms/               # Payload CMS
│   └── admin/             # Admin Panel
├── infra/
│   └── docker/            # Configuraciones Docker
├── docker-compose.yml     # Orquestación de servicios
└── .env                   # Variables de entorno
```

## 🔧 Configuraciones Clave

### Frontend (Next.js)

- **Framework:** Next.js 16.0.1
- **Output Mode:** Standalone (recientemente configurado)
- **Características:** HeroCarousel con imágenes de cursotenerife.es
- **Archivo clave:** `apps/web-next/next.config.mjs`

### Backend (Payload CMS)

- **Framework:** Payload CMS v3
- **Base de datos:** PostgreSQL
- **Colecciones:** Cursos, Ciclos, Usuarios, Media
- **Archivo clave:** `apps/cms/payload.config.ts`

### Docker Compose

- **Archivo principal:** `docker-compose.yml`
- **Servicios:** frontend, cms, admin, nginx, postgres, redis, minio
- **Red:** `cep-network`

## 🌐 Estado Actual de Containers

```bash
NAME           IMAGE                      STATUS
cep-admin      cepcomunicacion-admin      Up 8 days (healthy)
cep-cms        cepcomunicacion-cms        Up 8 days (unhealthy)
cep-frontend   cepcomunicacion-frontend   Up 8 days (healthy)
cep-minio      minio/minio:latest         Up 12 days (healthy)
cep-nginx      nginx:1.27-alpine          Up 8 days (healthy)
cep-postgres   postgres:16-alpine         Up 12 days (healthy)
cep-redis      redis:7-alpine             Up 12 days (healthy)
```

## 🚨 Problemas Identificados

1. **Frontend Desactualizado:** Container actualizado pero muestra versión antigua
2. **CMS Unhealthy:** Container con estado unhealthy
3. **SSH Inestable:** Conexiones intermitentes al servidor
4. **Posible Caching:** Nginx o Next.js cacheando contenido antiguo

## 📦 Variables de Entorno Críticas

### Base de Datos

- `POSTGRES_DB=cepcomunicacion`
- `POSTGRES_USER=cep_user`
- `POSTGRES_PASSWORD` (en .env)

### URLs

- `NEXT_PUBLIC_API_URL=http://localhost:3000`
- `PAYLOAD_PUBLIC_SERVER_URL=http://cepcomunicacion.com`
- `PAYLOAD_SERVER_URL=http://cms:3000`

## 🔑 SSH Configuration

```bash
Host hetzner-cep
    HostName 46.62.222.138
    User root
    IdentityFile ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod
    IdentitiesOnly yes
    StrictHostKeyChecking accept-new
```

## 📋 Checklist de Respaldo

### Datos Críticos

- [ ] Base de datos PostgreSQL completa
- [ ] Archivos subidos a MinIO
- [ ] Configuraciones personalizadas
- [ ] Variables de entorno
- [ ] Certificados SSL (si existen)

### Código

- [ ] Repositorio Git completo
- [ ] Configuraciones Docker
- [ ] Scripts de despliegue

## 🎯 Objetivo de Reinstalación

1. **Limpiar completamente** el servidor VPS
2. **Sincronizar código actualizado** con HeroCarousel
3. **Reinstalar desde cero** con configuraciones correctas
4. **Verificar funcionamiento** de todos los componentes
5. **Asegurar actualización** del frontend en producción

## 📞 Contactos y Soporte

- **Hetzner:** Panel de control para gestión VPS
- **Dominio:** Configuración DNS apuntando a 46.62.222.138
- **SSH:** Acceso mediante key pair configurado

---

**Última actualización:** 2025-11-18  
**Estado:** Pendiente de limpieza y reinstalación
