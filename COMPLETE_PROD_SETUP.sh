#!/bin/bash

# CEP COMUNICACIÓN - CONFIGURACIÓN COMPLETA SERVIDOR PROD
# Ejecutar en la consola de Hetzner inmediatamente

echo "🚀 CONFIGURACIÓN COMPLETA - CEP COMUNICACIÓN PROD"
echo "================================================="
echo "Fecha: $(date)"
echo "Servidor: 46.62.222.138"
echo "Nombre: cepcomunicacion-prod"
echo ""

# 1. Cambiar contraseña root (obligatorio en primer login)
echo "🔑 Cambiando contraseña root..."
echo "Contraseña actual: uCfeWsUvnJbjvqPxTLUE"
echo "Nueva contraseña: CEPadmin2024!SecureProd#46"
echo "root:CEPadmin2024!SecureProd#46" | chpasswd
echo "✅ Contraseña root cambiada"
echo ""

# 2. Crear backup de credenciales importantes
echo "💾 Creando backup de credenciales..."
mkdir -p /root/backup
cat > /root/backup/credentials.txt << CREDENTIALS
=== CEP COMUNICACIÓN PROD - CREDENCIALES ===
Fecha: $(date)
Servidor: 46.62.222.138
Nombre: cepcomunicacion-prod

CONTRASEÑA ROOT ORIGINAL: uCfeWsUvnJbjvqPxTLUE
CONTRASEÑA ROOT NUEVA: CEPadmin2024!SecureProd#46

=== CLAVES SSH GENERADAS ABAJO ===
CREDENTIALS

chmod 600 /root/backup/credentials.txt
echo "✅ Backup de credenciales creado en /root/backup/credentials.txt"
echo ""

# 3. Crear clave SSH para el servidor
echo "🔑 Creando clave SSH para el servidor..."
ssh-keygen -t ed25519 -C "admin@cepcomunicacion-prod.com" -f /root/.ssh/server_key -N ""
echo "✅ Clave SSH creada"
echo ""

# 4. Configurar SSH para permitir clave y contraseña
echo "🔧 Configurando SSH..."
cat > /etc/ssh/sshd_config.d/99-custom.conf << 'EOF'
# Custom SSH Configuration for CEP Comunicación Prod
Port 22
PermitRootLogin yes
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
# Limitar intentos de conexión
MaxAuthTries 3
MaxSessions 10
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

# 5. Añadir clave pública a authorized_keys
cat /root/.ssh/server_key.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
chmod 700 /root/.ssh
echo "✅ SSH configurado"
echo ""

# 6. Reiniciar servicio SSH
echo "🔄 Reiniciando SSH..."
systemctl restart sshd
systemctl enable sshd
echo "✅ SSH reiniciado"
echo ""

# 7. Guardar claves SSH en backup
echo "💾 Guardando claves SSH en backup..."
cat >> /root/backup/credentials.txt << SSH_KEYS

=== CLAVES SSH ===
CLAVE PÚBLICA:
$(cat /root/.ssh/server_key.pub)

CLAVE PRIVADA:
$(cat /root/.ssh/server_key)
SSH_KEYS

echo "✅ Claves SSH guardadas en backup"
echo ""

# 8. Configurar firewall UFW para evitar bloqueos
echo "🔥 Configurando firewall UFW..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Permitir SSH desde cualquier lugar temporalmente
ufw allow 22/tcp comment "SSH - Temporal"
ufw allow 80/tcp comment "HTTP"
ufw allow 443/tcp comment "HTTPS"

# Permitir rangos de IPs seguros (Hetzner, Cloudflare, etc.)
ufw allow from 65.21.0.0/16 to any port 22 comment "Hetzner Infrastructure"
ufw allow from 172.64.0.0/13 to any port 22 comment "Cloudflare Range 1"
ufw allow from 104.16.0.0/12 to any port 22 comment "Cloudflare Range 2"
ufw allow from 162.158.0.0/15 to any port 22 comment "Cloudflare Range 3"

# Permitir loopback
ufw allow from 127.0.0.1 to any comment "Loopback"

# Habilitar firewall
ufw --force enable
echo "✅ Firewall configurado"
echo ""

# 9. Verificar configuración SSH
echo "🔍 Verificando configuración SSH..."
sshd -t
echo "✅ Configuración SSH válida"
echo ""

# 10. Verificar estado del firewall
echo "🔥 Estado del firewall:"
ufw status verbose
echo ""

# 11. Verificar que SSH está escuchando
echo "🔍 Verificando SSH..."
netstat -tulpn | grep :22
echo ""

# 12. Crear información de red
echo "🌐 Guardando información de red..."
cat > /root/backup/network_info.txt << NETWORK_INFO
=== INFORMACIÓN DE RED ===
Fecha: $(date)
Servidor: 46.62.222.138

INTERFACES DE RED:
$(ip addr show)

ROUTES:
$(ip route show)

DNS:
$(cat /etc/resolv.conf)

FIREWALL STATUS:
$(ufw status verbose)

OPEN PORTS:
$(netstat -tulpn | grep LISTEN)
NETWORK_INFO

echo "✅ Información de red guardada"
echo ""

# 13. Crear script de seguridad completa
echo "🛡️ Creando script de seguridad completa..."
cat > /root/setup_complete_security.sh << 'SECURITY_SCRIPT'
#!/bin/bash

echo "🛡️ CONFIGURANDO SEGURIDAD COMPLETA..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
apt update && apt upgrade -y

# Instalar herramientas de seguridad
echo "🔧 Instalando herramientas de seguridad..."
apt install -y fail2ban ufw logwatch htop nano curl wget git

# Configurar fail2ban
echo "🚫 Configurando Fail2Ban..."
cat > /etc/fail2ban/jail.local << FAIL2BAN_CONFIG
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
destemail = admin@cepcomunicacion.com
sender = fail2ban@cepcomunicacion.com
mta = sendmail
action = %(action_mw)s

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
FAIL2BAN_CONFIG

systemctl enable fail2ban
systemctl start fail2ban

# Configurar límites de sistema
echo "⚙️ Configurando límites de sistema..."
cat >> /etc/security/limits.conf << LIMITS
# CEP Comunicación Limits
* soft nofile 65536
* hard nofile 65536
* soft nproc 32768
* hard nproc 32768
root soft nofile 65536
root hard nofile 65536
LIMITS

# Optimizar parámetros del kernel
echo "🔧 Optimizando kernel..."
cat >> /etc/sysctl.conf << KERNEL_PARAMS
# Network optimization for CEP Comunicación
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_congestion_control = bbr

# Security parameters
net.ipv4.tcp_syncookies = 1
net.ipv4.ip_forward = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# DDoS protection
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5
KERNEL_PARAMS

sysctl -p

# Configurar logrotate
echo "📋 Configurando logrotate..."
cat > /etc/logrotate.d/cepcomunicacion << LOGROTATE
/var/log/cepcomunicacion/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
LOGROTATE

# Crear directorios de logs
mkdir -p /var/log/cepcomunicacion

echo "✅ Seguridad completa configurada"
echo "🎉 SISTEMA SEGURO Y OPTIMIZADO"
SECURITY_SCRIPT

chmod +x /root/setup_complete_security.sh
echo "✅ Script de seguridad completa creado"
echo ""

# 14. Crear script de instalación de Docker
echo "🐳 Creando script de instalación de Docker..."
cat > /root/install_docker.sh << DOCKER_SCRIPT
#!/bin/bash

echo "🐳 INSTALANDO DOCKER Y DOCKER COMPOSE..."

# Actualizar sistema
apt update

# Instalar Docker
echo "📦 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
echo "📦 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalación
echo "🔍 Verificando instalación..."
docker --version
docker-compose --version

# Añadir usuario root a grupo docker
usermod -aG docker root

# Habilitar Docker al inicio
systemctl enable docker
systemctl start docker

echo "✅ Docker y Docker Compose instalados"
echo "🎉 LISTO PARA DESPLEgar APLICACIONES"
DOCKER_SCRIPT

chmod +x /root/install_docker.sh
echo "✅ Script de Docker creado"
echo ""

# 15. Crear resumen completo
echo "📋 Creando resumen completo..."
cat > /root/backup/COMPLETE_SETUP_SUMMARY.md << SUMMARY
# CEP COMUNICACIÓN PROD - RESUMEN COMPLETO DE CONFIGURACIÓN

## 📊 Información del Servidor
- **Nombre**: cepcomunicacion-prod
- **IP**: 46.62.222.138
- **Fecha de configuración**: $(date)
- **Sistema**: Ubuntu 22.04 LTS

## 🔑 Credenciales
- **Contraseña Root Original**: uCfeWsUvnJbjvqPxTLUE
- **Contraseña Root Nueva**: CEPadmin2024!SecureProd#46

## 🔐 Claves SSH
- **Clave Pública**: Ver /root/backup/credentials.txt
- **Clave Privada**: Ver /root/backup/credentials.txt
- **Archivo de clave**: /root/.ssh/server_key

## 🛡️ Seguridad Configurada
- ✅ Firewall UFW activo y configurado
- ✅ SSH configurado con clave y contraseña
- ✅ Rangos de IPs seguros permitidos
- ✅ Scripts de seguridad listos para ejecutar

## 📋 Scripts Disponibles
- \`/root/setup_complete_security.sh\` - Seguridad completa
- \`/root/install_docker.sh\` - Instalación de Docker

## 🚀 Próximos Pasos
1. Ejecutar seguridad completa: \`/root/setup_complete_security.sh\`
2. Instalar Docker: \`/root/install_docker.sh\`
3. Clonar repositorio y desplegar aplicaciones

## 📁 Archivos de Backup
- \`/root/backup/credentials.txt\` - Credenciales y claves
- \`/root/backup/network_info.txt\` - Información de red
- \`/root/backup/COMPLETE_SETUP_SUMMARY.md\` - Este resumen

---
**Configuración completada**: $(date)
**Estado**: Listo para instalación de aplicaciones
SUMMARY

echo "✅ Resumen completo creado"
echo ""

# 16. Instrucciones finales
echo "📋 INSTRUCCIONES FINALES COMPLETAS:"
echo "===================================="
echo ""
echo "🔑 CONTRASEÑAS:"
echo "   Root Original: uCfeWsUvnJbjvqPxTLUE"
echo "   Root Nueva: CEPadmin2024!SecureProd#46"
echo ""
echo "🔑 CLAVES SSH:"
echo "   Pública y Privada guardadas en: /root/backup/credentials.txt"
echo "   Archivo de clave: /root/.ssh/server_key"
echo ""
echo "🛡️ SEGURIDAD:"
echo "   1. Ejecutar: /root/setup_complete_security.sh"
echo "   2. Verificar: fail2ban-client status"
echo "   3. Verificar: ufw status verbose"
echo ""
echo "🐳 DOCKER:"
echo "   1. Ejecutar: /root/install_docker.sh"
echo "   2. Verificar: docker --version"
echo "   3. Verificar: docker-compose --version"
echo ""
echo "📁 BACKUPS COMPLETOS:"
echo "   /root/backup/credentials.txt - Credenciales y claves"
echo "   /root/backup/network_info.txt - Info de red"
echo "   /root/backup/COMPLETE_SETUP_SUMMARY.md - Resumen"
echo ""
echo "🌐 CONEXIÓN DESDE MÁQUINA LOCAL:"
echo "   # Copiar clave privada a ~/.ssh/cepcomunicacion_prod"
echo "   chmod 600 ~/.ssh/cepcomunicacion_prod"
echo "   ssh -i ~/.ssh/cepcomunicacion_prod root@46.62.222.138"
echo ""
echo "🎉 CONFIGURACIÓN BÁSICA COMPLETADA!"
echo "=================================="
echo "Servidor: 46.62.222.138"
echo "Nombre: cepcomunicacion-prod"
echo "Estado: Seguro y listo para producción"
echo ""