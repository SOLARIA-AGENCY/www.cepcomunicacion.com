# 🚀 Despliegue Completo en Hetzner VPS - CEP Comunicación v2

## 🎯 **Arquitectura Todo-en-Uno**

**VPS Hetzner + Docker + Nginx = Control Total**

```
Internet
    ↓
Nginx (SSL + Load Balancer + Reverse Proxy)
    ↓
┌─────────────────────────────────────────────────────────┐
│  Frontend (web-next)  │  Admin (admin)  │  CMS (backend)  │
│  Next.js 14          │  Next.js 15     │  Payload CMS     │
│  Port 3000           │  Port 3001      │  Port 3002      │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│  PostgreSQL  │  Redis  │  MinIO  │  Workers  │  MailHog  │
│  Port 5432   │ 6379   │ 9000    │  Varios   │  1025     │
└─────────────────────────────────────────────────────────┘
```

---

## 💰 **Costos Optimizados**

### **Hetzner CX21 (Recomendado)**

- **CPU:** 4 vCPU
- **RAM:** 16GB
- **Storage:** 80GB NVMe SSD
- **Tráfico:** 20TB/mes
- **Precio:** **€8.87/mes** (~$9.50)

### **Alternativas:**

| Plan      | vCPU | RAM  | Storage | Precio | Uso         |
| --------- | ---- | ---- | ------- | ------ | ----------- |
| **CPX11** | 2    | 4GB  | 40GB    | €4.51  | Desarrollo  |
| **CPX21** | 2    | 8GB  | 80GB    | €6.72  | Producción  |
| **CX21**  | 4    | 16GB | 80GB    | €8.87  | Producción+ |
| **CX31**  | 6    | 32GB | 160GB   | €17.57 | Enterprise  |

**Total mensual: €8.87** (vs $25-78 en arquitectura híbrida)

---

## 🏗️ **Servicios Completos**

### **Frontend & Admin**

```bash
✅ Next.js 14 (web-next) - SSR/SSG
✅ Next.js 15 (admin) - SPA
✅ Build optimizado con Nginx
✅ CDN con Nginx cache
✅ Compresión Gzip/Brotli
```

### **Backend Completo**

```bash
✅ Payload CMS 3.62.1
✅ PostgreSQL 15 (base de datos)
✅ Redis 7 (cache + colas)
✅ MinIO (S3-compatible storage)
✅ BullMQ (background workers)
✅ MailHog (email testing)
```

### **Infraestructura**

```bash
✅ Nginx (reverse proxy + SSL)
✅ Docker Compose (orchestración)
✅ Let's Encrypt (SSL automático)
✅ Backups automáticos
✅ Monitoreo con logs
✅ Firewall configurado
```

---

## 🚀 **Guía de Despliegue Paso a Paso**

### **Paso 1: Crear VPS en Hetzner**

#### 1.1 Crear Cuenta

```bash
# 1. Ir a https://console.hetzner.cloud/
# 2. Crear cuenta (verificar email)
# 3. Añadir método de pago
# 4. Crear proyecto: "CEP Comunicación"
```

#### 1.2 Crear Servidor

```bash
# 1. Dashboard → Servers → Add Server
# 2. Seleccionar: Ubuntu 22.04
# 3. Location: Nuremberg (nbg1) o Falkenstein (fsn1)
# 4. Type: CX21 (4 vCPU, 16GB RAM, 80GB SSD)
# 5. Name: cepcomunicacion-vps
# 6. SSH Key: Añadir tu clave pública
# 7. Create & Buy
```

#### 1.3 Configurar DNS

```bash
# En tu registrador de dominios:
A cepcomunicacion.com → IP_DEL_VPS
A www.cepcomunicacion.com → IP_DEL_VPS
A admin.cepcomunicacion.com → IP_DEL_VPS
A api.cepcomunicacion.com → IP_DEL_VPS
```

### **Paso 2: Configuración Inicial del VPS**

#### 2.1 Conectar por SSH

```bash
ssh root@IP_DEL_VPS
```

#### 2.2 Actualizar Sistema

```bash
apt update && apt upgrade -y
```

#### 2.3 Instalar Docker

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

#### 2.4 Configurar Firewall

```bash
# Configurar UFW
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### **Paso 3: Desplegar Aplicación**

#### 3.1 Clonar Repositorio

```bash
# Ir a /opt (directorio de aplicaciones)
cd /opt

# Clonar repositorio
git clone https://github.com/solaria-agency/cepcomunicacion.git

# Entrar al directorio
cd cepcomunicacion
```

#### 3.2 Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar configuración
nano .env
```

**Variables críticas:**

```env
# Dominio
DOMAIN=cepcomunicacion.com

# Base de datos
POSTGRES_PASSWORD=generar_contraseña_segura_aquí
POSTGRES_USER=cepcomunicacion
POSTGRES_DB=cepcomunicacion

# Redis
REDIS_PASSWORD=generar_contraseña_segura_aquí

# MinIO
MINIO_ROOT_USER=cepcomunicacion
MINIO_ROOT_PASSWORD=generar_contraseña_segura_aquí

# Payload CMS
PAYLOAD_SECRET=generar_secreto_32_caracteres_aquí

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# URLs
NEXT_PUBLIC_API_URL=https://api.cepcomunicacion.com
CORS_ORIGINS=https://cepcomunicacion.com,https://www.cepcomunicacion.com,https://admin.cepcomunicacion.com
```

#### 3.3 Iniciar Servicios

```bash
# Iniciar todos los servicios
cd infra/docker
docker-compose up -d

# Verificar estado
docker-compose ps
```

### **Paso 4: Configurar Nginx y SSL**

#### 4.1 Instalar Certbot

```bash
# Instalar Certbot para SSL
apt install certbot python3-certbot-nginx -y
```

#### 4.2 Generar Certificados SSL

```bash
# Certificado para dominio principal
certbot --nginx -d cepcomunicacion.com -d www.cepcomunicacion.com

# Certificado para admin
certbot --nginx -d admin.cepcomunicacion.com

# Certificado para API
certbot --nginx -d api.cepcomunicacion.com
```

#### 4.3 Configurar Nginx

```bash
# La configuración está en infra/nginx/nginx.conf
# Certbot la actualizará automáticamente
```

### **Paso 5: Verificar Despliegue**

#### 5.1 Verificar Servicios

```bash
# Verificar que todos los contenedores estén corriendo
docker-compose ps

# Verificar logs
docker-compose logs -f

# Verificar endpoints
curl https://cepcomunicacion.com
curl https://admin.cepcomunicacion.com
curl https://api.cepcomunicacion.com/api/health
```

#### 5.2 Acceder a Servicios

```bash
# Frontend público
https://cepcomunicacion.com

# Panel de administración
https://admin.cepcomunicacion.com

# API backend
https://api.cepcomunicacion.com/admin

# MinIO Console (storage)
http://IP_DEL_VPS:9001

# MailHog (email testing)
http://IP_DEL_VPS:8025
```

---

## 🔄 **CI/CD Automático**

### **GitHub Actions para Despliegue**

```yaml
# .github/workflows/deploy-hetzner.yml
name: Deploy to Hetzner VPS

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Hetzner
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.HETZNER_IP }}
          username: root
          key: ${{ secrets.HETZNER_SSH_KEY }}
          script: |
            cd /opt/cepcomunicacion
            git pull origin main
            cd infra/docker
            docker-compose pull
            docker-compose up -d --build
```

### **Configurar GitHub Secrets**

```bash
HETZNER_IP=IP_DEL_VPS
HETZNER_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...tu clave privada SSH...
-----END OPENSSH PRIVATE KEY-----
```

---

## 📊 **Monitoreo y Mantenimiento**

### **Verificar Estado**

```bash
# Estado de todos los servicios
docker-compose ps

# Uso de recursos
docker stats

# Logs en tiempo real
docker-compose logs -f

# Logs de servicio específico
docker-compose logs -f cms
```

### **Backups Automáticos**

```bash
# Backup programado (diario)
docker-compose exec backup /scripts/backup.sh

# Listar backups
docker-compose exec backup ls -lh /backups

# Restaurar backup
docker-compose exec backup /scripts/restore.sh -f /backups/backup.sql.gz
```

### **Actualizaciones**

```bash
# Actualizar código
cd /opt/cepcomunicacion
git pull origin main

# Actualizar imágenes Docker
cd infra/docker
docker-compose pull

# Reiniciar con nuevas imágenes
docker-compose up -d --build
```

---

## 🛠️ **Troubleshooting**

### **Problemas Comunes**

#### **Servicios no inician:**

```bash
# Verificar logs
docker-compose logs <servicio>

# Verificar recursos
docker stats

# Reiniciar servicio
docker-compose restart <servicio>
```

#### **Problemas de SSL:**

```bash
# Renovar certificados
certbot renew --dry-run

# Verificar configuración Nginx
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

#### **Problemas de memoria:**

```bash
# Verificar uso de memoria
free -h
docker stats

# Limpiar Docker
docker system prune -a
```

---

## 📈 **Optimizaciones**

### **Performance**

```bash
# Habilitar cache en Nginx (configurado)
# Compresión Gzip/Brotli (configurado)
# CDN con Cloudflare (opcional)
# Optimización de imágenes (Next.js)
```

### **Seguridad**

```bash
# Firewall UFW configurado
# SSL/TLS con Let's Encrypt
# Actualizaciones automáticas
# Backups diarios
# Monitoreo de logs
```

---

## 🎯 **Ventajas de Esta Arquitectura**

### **✅ Control Total**

- Todos los servicios en un solo lugar
- Acceso root completo
- Configuración personalizada
- Sin limitaciones de plataforma

### **✅ Costo Óptimo**

- €8.87/mes vs $25-78/mes
- Sin costos por transferencia
- Sin límites de requests
- Escalabilidad lineal

### **✅ Alto Rendimiento**

- Red interna Docker (muy rápida)
- NVMe SSD
- 16GB RAM para cache
- CDN con Nginx

### **✅ Simplicidad**

- Un solo VPS que gestionar
- Docker Compose para todo
- Despliegue con un comando
- Backups centralizados

---

## 📋 **Checklist Final**

- [ ] Crear cuenta Hetzner
- [ ] Crear VPS CX21
- [ ] Configurar DNS
- [ ] Instalar Docker
- [ ] Clonar repositorio
- [ ] Configurar .env
- [ ] Iniciar servicios
- [ ] Configurar SSL
- [ ] Verificar funcionamiento
- [ ] Configurar CI/CD
- [ ] Configurar monitoreo

---

**¿Listos para proceder con el despliegue en Hetzner?** Es la solución más robusta y económica para tener control total de todos los servicios. 🚀
