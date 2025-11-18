# 🚨 DIAGNÓSTICO DE ACCESO SSH - CEP COMUNICACIÓN PROD

## 📊 **Estado Actual**

### ✅ **Servidor Activo**

- **IP**: 46.62.222.138
- **Estado**: Responde a ping y nmap
- **Puerto 22**: Abierto con OpenSSH 9.6
- **Sistema**: Ubuntu 22.04 LTS

### ❌ **Problemas Detectados**

- **SSH Connection**: Permission denied (publickey,password)
- **Contraseña Original**: uCfeWsUvnJbjvqPxTLUE - No funciona
- **Contraseña Nueva**: CEPadmin2024!SecureProd#46 - No funciona
- **Clave SSH**: No configurada o no funciona

## 🔍 **Análisis de Causas**

### 1. **Script No Ejecutado**

- El script de configuración probablemente no se ejecutó en la consola
- El servidor todavía tiene configuración por defecto
- La contraseña original podría haber sido cambiada por el sistema

### 2. **Problemas de Autenticación**

- SSH podría estar configurado para solo clave pública
- Podría haber políticas de seguridad adicionales
- El primer login podría requerir cambio de contraseña interactivo

### 3. **Configuración SSH Personalizada**

- Hetzner podría tener configuraciones especiales
- Podría haber políticas de seguridad adicionales
- El acceso podría estar restringido

## 🛠️ **Soluciones Propuestas**

### Opción 1: Acceso por Consola Hetzner (Recomendado)

1. **Acceder a https://console.hetzner.cloud/**
2. **Servers → cepcomunicacion-prod → Console**
3. **Ejecutar diagnóstico manual**:

   ```bash
   # Verificar estado actual
   whoami
   pwd
   uptime

   # Verificar configuración SSH
   cat /etc/ssh/sshd_config | grep -E "(Port|PermitRootLogin|PasswordAuthentication|PubkeyAuthentication)"

   # Verificar usuarios
   cat /etc/passwd | grep root

   # Verificar logs de conexión
   tail -20 /var/log/auth.log
   ```

### Opción 2: Reset de SSH desde Consola

```bash
# Reset completo de configuración SSH
apt update
apt install -y openssh-server

# Configurar SSH para permitir contraseña
cat > /etc/ssh/sshd_config.d/99-emergency.conf << 'EOF'
Port 22
PermitRootLogin yes
PasswordAuthentication yes
PubkeyAuthentication yes
EOF

# Reiniciar SSH
systemctl restart sshd
systemctl enable sshd

# Verificar estado
systemctl status sshd
sshd -t
```

### Opción 3: Crear Nuevo Usuario

```bash
# Crear usuario admin
useradd -m -s /bin/bash admin
echo "admin:AdminPass2024!" | chpasswd
usermod -aG sudo admin

# Configurar SSH para admin
mkdir -p /home/admin/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ7z8wfurmhmT71GPsDrprLuRE0EviT0QHjq+ZPcKnWG admin@cepcomunicacion.com" > /home/admin/.ssh/authorized_keys
chown -R admin:admin /home/admin/.ssh
chmod 700 /home/admin/.ssh
chmod 600 /home/admin/.ssh/authorized_keys
```

## 📋 **Comandos de Diagnóstico para Consola**

### Diagnóstico Completo

```bash
# 1. Información del sistema
echo "=== INFORMACIÓN DEL SISTEMA ==="
hostname
whoami
pwd
uptime
date
echo ""

# 2. Configuración SSH
echo "=== CONFIGURACIÓN SSH ==="
cat /etc/ssh/sshd_config | grep -E "(Port|PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|AuthorizedKeysFile)"
echo ""

# 3. Estado de servicios
echo "=== ESTADO DE SERVICIOS ==="
systemctl status sshd --no-pager
echo ""

# 4. Logs de autenticación
echo "=== LOGS DE AUTENTICACIÓN ==="
tail -20 /var/log/auth.log | grep sshd
echo ""

# 5. Usuarios y grupos
echo "=== USUARIOS ==="
cat /etc/passwd | grep -E "(root|admin)"
echo ""

# 6. Red y puertos
echo "=== RED Y PUERTOS ==="
ip addr show
netstat -tulpn | grep :22
echo ""

# 7. Firewall
echo "=== FIREWALL ==="
ufw status verbose || echo "UFW not installed"
iptables -L | head -10
echo ""

# 8. Intentos de conexión recientes
echo "=== INTENTOS DE CONEXIÓN ==="
last -n 10
echo ""
```

### Configuración de Emergencia

```bash
# Reset completo de SSH
echo "=== RESET DE SSH ==="
systemctl stop sshd

# Configuración básica
cat > /etc/ssh/sshd_config << 'EOF'
Port 22
Protocol 2
PermitRootLogin yes
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
UsePAM yes
X11Forwarding yes
PrintMotd no
PrintLastLog yes
ClientAliveInterval 300
ClientAliveCountMax 2
MaxAuthTries 3
MaxSessions 10
EOF

# Reiniciar SSH
systemctl start sshd
systemctl enable sshd

# Verificar
systemctl status sshd --no-pager
sshd -t
echo "✅ SSH reset completado"
```

## 🎯 **Plan de Acción Inmediato**

1. **Acceder a consola Hetzner**
2. **Ejecutar diagnóstico completo**
3. **Identificar el problema real**
4. **Aplicar solución correspondiente**
5. **Verificar acceso SSH**
6. **Continuar con configuración**

## 📞 **Contacto de Emergencia**

Si nada funciona:

- **Hetzner Support**: 24/7 disponible
- **Rescue System**: Reiniciar en modo rescate
- **Recreate Server**: Última opción

---

**Estado Crítico**: Servidor activo pero sin acceso SSH  
**Acción Requerida**: Acceso por consola Hetzner inmediato  
**Tiempo Estimado**: 15-30 minutos para resolver
