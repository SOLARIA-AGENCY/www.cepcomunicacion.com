# 🚀 NUEVO SERVIDOR HETZNER - CONFIGURACIÓN COMPLETA DESDE CERO

## 📋 **PLAN DE EJECUCIÓN LIMPIO**

### Paso 1: Crear Nuevo Servidor en Hetzner

1. **Ir a https://console.hetzner.cloud/**
2. **Servers → Add Server**
3. **Configuración recomendada:**
   - **Location**: Nuremberg (nbg1) o Falkenstein (fsn1)
   - **Server Type**: CX21 (4 vCPU, 16GB RAM, 80GB SSD) - €8.87/mes
   - **Image**: Ubuntu 22.04 LTS
   - **Name**: `cepcomunicacion-v2-clean`
   - **SSH Key**: Añadir tu clave pública SSH

### Paso 2: Generar Clave SSH (Si no tienes)

```bash
# En tu máquina local
ssh-keygen -t ed25519 -C "admin@cepcomunicacion.com" -f ~/.ssh/cepcomunicacion
# Presiona Enter para passphrase vacía (o pon una segura)

# Mostrar clave pública para copiar en Hetzner
cat ~/.ssh/cepcomunicacion.pub
```

### Paso 3: Primera Conexión y Configuración Básica

```bash
# Conectar al nuevo servidor
ssh -i ~/.ssh/cepcomunicacion root@NUEVA_IP_DEL_SERVIDOR

# Actualizar sistema
apt update && apt upgrade -y

# Crear usuario deploy (opcional, más seguro)
useradd -m -s /bin/bash deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### Paso 4: Instalar Docker y Docker Compose

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

# Añadir usuario a grupo docker
usermod -aG docker deploy
```

### Paso 5: Configurar Firewall Seguro

```bash
# Configurar UFW
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Verificar estado
ufw status verbose
```

### Paso 6: Clonar Proyecto y Configurar

```bash
# Ir a /opt (directorio de aplicaciones)
cd /opt

# Clonar repositorio
git clone https://github.com/solaria-agency/cepcomunicacion.git

# Entrar al directorio
cd cepcomunicacion

# Verificar estructura
ls -la
cat docker-compose.yml | head -20
```

### Paso 7: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar configuración
nano .env
```

**Variables críticas en .env:**

```env
# Dominio
DOMAIN=cepcomunicacion.com

# Base de datos
POSTGRES_PASSWORD=generar_contraseña_segura_aquí_123
POSTGRES_USER=cepcomunicacion
POSTGRES_DB=cepcomunicacion

# Redis
REDIS_PASSWORD=generar_contraseña_segura_aquí_456

# MinIO
MINIO_ROOT_USER=cepcomunicacion
MINIO_ROOT_PASSWORD=generar_contraseña_segura_aquí_789

# Payload CMS
PAYLOAD_SECRET=generar_secreto_32_caracteres_aquí

# Email (opcional para desarrollo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# URLs
NEXT_PUBLIC_API_URL=https://cepcomunicacion.com
CORS_ORIGINS=https://cepcomunicacion.com,https://www.cepcomunicacion.com
```

### Paso 8: Iniciar Servicios Docker

```bash
# Crear directorios necesarios
mkdir -p logs nginx/conf.d nginx/ssl postgres/init

# Iniciar servicios en secuencia
docker-compose up -d postgres redis minio
sleep 30

docker-compose up -d cms
sleep 30

docker-compose up -d frontend admin
sleep 20

docker-compose up -d nginx

# Verificar estado
docker-compose ps
docker-compose logs --tail=10
```

### Paso 9: Verificar Despliegue

```bash
# Verificar servicios localmente
curl -I http://localhost
curl -I http://localhost:3000
curl -I http://localhost:3001

# Verificar HeroCarousel
curl -s http://localhost | grep -i "carousel\|hero"

# Verificar acceso público (desde tu máquina local)
# curl -I http://NUEVA_IP_DEL_SERVIDOR/
# curl -s http://NUEVA_IP_DEL_SERVIDOR/ | grep -i carousel
```

### Paso 10: Configurar SSL (Opcional pero Recomendado)

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Generar certificados (necesitas dominio configurado)
# certbot --nginx -d cepcomunicacion.com -d www.cepcomunicacion.com
```

---

## 🎯 **RESULTADO ESPERADO**

### Servicios Funcionales:

- ✅ **Frontend**: http://NUEVA_IP/ con HeroCarousel visible
- ✅ **CMS API**: http://NUEVA_IP:3000 con Payload CMS
- ✅ **Admin Panel**: http://NUEVA_IP:3001 con Next.js admin
- ✅ **Base de datos**: PostgreSQL corriendo en Docker
- ✅ **Storage**: MinIO para archivos
- ✅ **Cache**: Redis para sesiones

### Seguridad Configurada:

- ✅ **SSH**: Solo con clave pública
- ✅ **Firewall**: UFW configurado restrictivamente
- ✅ **Docker**: Aislamiento de contenedores
- ✅ **SSL**: Certificados Let's Encrypt (opcional)

---

## 📋 **CHECKLIST FINAL**

- [ ] Crear servidor CX21 en Hetzner
- [ ] Configurar clave SSH
- [ ] Primera conexión SSH exitosa
- [ ] Actualizar sistema Ubuntu
- [ ] Instalar Docker y Docker Compose
- [ ] Configurar firewall UFW
- [ ] Clonar repositorio del proyecto
- [ ] Configurar variables de entorno (.env)
- [ ] Iniciar servicios Docker
- [ ] Verificar HeroCarousel funcionando
- [ ] Configurar SSL (opcional)
- [ ] Documentar IPs y credenciales

---

## 🚀 **COMANDOS RÁPIDOS**

Una vez que tengas la IP del nuevo servidor:

```bash
# 1. Conectar
ssh -i ~/.ssh/cepcomunicacion root@NUEVA_IP

# 2. Ejecutar script completo de instalación
curl -fsSL https://raw.githubusercontent.com/solaria-agency/cepcomunicacion/main/scripts/quick-install.sh | bash

# 3. O ejecutar paso a paso manualmente
# (ver pasos anteriores)
```

**¿Listo para crear el nuevo servidor?** Cuando tengas la IP, podemos empezar con la configuración completa.
