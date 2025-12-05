#!/bin/bash

# CEP COMUNICACIÓN - CONFIGURACIÓN INICIAL SERVIDOR NUEVO
# Ejecutar en la consola de Hetzner inmediatamente

echo "🚀 CONFIGURACIÓN INICIAL - CEP COMUNICACIÓN SAAS"
echo "================================================"
echo "Fecha: $(date)"
echo "Servidor: 46.62.222.138"
echo ""

# 1. Cambiar contraseña root (obligatorio en primer login)
echo "🔑 Cambiando contraseña root..."
echo "Actual contraseña: 4egNXuLtnn4K7wHHqgKp"
echo "Nueva contraseña: CEPadmin2024!Secure"
echo "root:CEPadmin2024!Secure" | chpasswd
echo "✅ Contraseña root cambiada"
echo ""

# 2. Crear clave SSH para el servidor
echo "🔑 Creando clave SSH para el servidor..."
ssh-keygen -t ed25519 -C "admin@cepcomunicacion-saas.com" -f /root/.ssh/server_key -N ""
echo "✅ Clave SSH creada"
echo ""

# 3. Configurar SSH para permitir clave y contraseña
echo "🔧 Configurando SSH..."
cat > /etc/ssh/sshd_config.d/99-custom.conf << 'EOF'
# Custom SSH Configuration for CEP Comunicación
Port 22
PermitRootLogin yes
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
EOF

# 4. Añadir clave pública a authorized_keys
cat /root/.ssh/server_key.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
chmod 700 /root/.ssh
echo "✅ SSH configurado"
echo ""

# 5. Reiniciar servicio SSH
echo "🔄 Reiniciando SSH..."
systemctl restart sshd
systemctl enable sshd
echo "✅ SSH reiniciado"
echo ""

# 6. Mostrar clave pública para copiar
echo "📋 CLAVE PÚBLICA PARA COPIAR:"
echo "================================"
echo "Copia esta clave y guárdala en tu máquina local:"
cat /root/.ssh/server_key.pub
echo ""
echo "================================"
echo ""

# 7. Configurar firewall UFW para evitar bloqueos
echo "🔥 Configurando firewall UFW..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Permitir SSH desde cualquier lugar temporalmente
ufw allow 22/tcp comment "SSH"
ufw allow 80/tcp comment "HTTP"
ufw allow 443/tcp comment "HTTPS"

# Permitir rangos de IPs seguros (Hetzner, Cloudflare, etc.)
ufw allow from 65.21.0.0/16 to any port 22 comment "Hetzner range"
ufw allow from 172.64.0.0/13 to any port 22 comment "Cloudflare range"
ufw allow from 104.16.0.0/12 to any port 22 comment "Cloudflare range"

# Habilitar firewall
ufw --force enable
echo "✅ Firewall configurado"
echo ""

# 8. Verificar configuración SSH
echo "🔍 Verificando configuración SSH..."
sshd -t
echo "✅ Configuración SSH válida"
echo ""

# 9. Verificar estado del firewall
echo "🔥 Estado del firewall:"
ufw status verbose
echo ""

# 10. Verificar que SSH está escuchando
echo "🔍 Verificando SSH..."
netstat -tulpn | grep :22
echo ""

# 11. Mostrar clave privada para descarga
echo "🔑 CLAVE PRIVADA PARA DESCARGAR:"
echo "================================"
echo "Esta clave privada necesitarás copiarla a tu máquina local:"
echo ""
cat /root/.ssh/server_key
echo ""
echo "================================"
echo ""

# 12. Crear script de seguridad adicional
echo "🛡️ Creando políticas de seguridad adicionales..."
cat > /root/setup_security.sh << 'EOF'
#!/bin/bash

# Políticas de seguridad adicionales
echo "Configurando seguridad adicional..."

# Instalar fail2ban
apt update
apt install -y fail2ban

# Configurar fail2ban
cat > /etc/fail2ban/jail.local << 'FAIL2BAN'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
destemail = admin@cepcomunicacion.com

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
FAIL2BAN

systemctl enable fail2ban
systemctl start fail2ban

# Configurar límites de conexión
echo "Configurando límites de conexión..."
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf

# Optimizar parámetros del kernel
cat >> /etc/sysctl.conf << 'KERNEL'
# Network optimization
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_congestion_control = bbr

# Security
net.ipv4.tcp_syncookies = 1
net.ipv4.ip_forward = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
KERNEL

sysctl -p

echo "✅ Seguridad adicional configurada"
EOF

chmod +x /root/setup_security.sh
echo "✅ Script de seguridad creado"
echo ""

# 13. Instrucciones finales
echo "📋 INSTRUCCIONES FINALES:"
echo "========================"
echo ""
echo "1. COPIA LA CLAVE PÚBLICA (arriba) y guárdala"
echo "2. COPIA LA CLAVE PRIVADA (arriba) y guárdala en tu máquina local:"
echo "   mkdir -p ~/.ssh"
echo "   chmod 700 ~/.ssh"
echo "   # Pega la clave privada en ~/.ssh/cepcomunicacion_saas"
echo "   chmod 600 ~/.ssh/cepcomunicacion_saas"
echo ""
echo "3. CONECTA DESDE TU MÁQUINA LOCAL:"
echo "   ssh -i ~/.ssh/cepcomunicacion_saas root@46.62.222.138"
echo ""
echo "4. EJECUTA SEGURIDAD ADICIONAL:"
echo "   /root/setup_security.sh"
echo ""
echo "5. VERIFICA CONEXIÓN:"
echo "   ssh -i ~/.ssh/cepcomunicacion_saas root@46.62.222.138 'uptime'"
echo ""
echo "🎉 CONFIGURACIÓN BÁSICA COMPLETADA!"
echo "=================================="
echo "Contraseña root: CEPadmin2024!Secure"
echo "IP del servidor: 46.62.222.138"
echo "Clave SSH: Configurada y lista para usar"