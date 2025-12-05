#!/bin/bash

# CEP Comunicación - Backup Script
# Created: 2025-11-18
# Purpose: Complete system backup before reinstallation

set -e

# Configuration
BACKUP_DIR="/var/www/cepcomunicacion/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_complete_${DATE}"

echo "=== CEP COMUNICACIÓN - BACKUP COMPLETE ==="
echo "Date: $(date)"
echo "Backup ID: ${BACKUP_FILE}"
echo ""

# Create backup directory
mkdir -p ${BACKUP_DIR}
cd /var/www/cepcomunicacion

echo "📦 Creating backups..."

# 1. Database Backup
echo "🗄️ Backing up PostgreSQL database..."
docker-compose exec -T postgres pg_dump -U cepadmin cepcomunicacion > ${BACKUP_DIR}/${BACKUP_FILE}_database.sql
echo "✅ Database backup completed: ${BACKUP_DIR}/${BACKUP_FILE}_database.sql"

# 2. MinIO Files Backup
echo "📁 Backing up MinIO files..."
docker run --rm -v cep-minio-data:/data -v ${BACKUP_DIR}:/backup alpine tar czf /backup/${BACKUP_FILE}_minio_files.tar.gz -C /data .
echo "✅ MinIO files backup completed: ${BACKUP_DIR}/${BACKUP_FILE}_minio_files.tar.gz"

# 3. Configuration Files Backup
echo "⚙️ Backing up configuration files..."
tar czf ${BACKUP_DIR}/${BACKUP_FILE}_config.tar.gz \
    docker-compose.yml \
    .env* \
    infra/ \
    scripts/ \
    nginx/ \
    --exclude='*.log' \
    --exclude='node_modules'
echo "✅ Configuration backup completed: ${BACKUP_DIR}/${BACKUP_FILE}_config.tar.gz"

# 4. SSL Certificates (if they exist)
if [ -d "/etc/letsencrypt" ]; then
    echo "🔐 Backing up SSL certificates..."
    tar czf ${BACKUP_DIR}/${BACKUP_FILE}_ssl.tar.gz -C /etc letsencrypt
    echo "✅ SSL backup completed: ${BACKUP_DIR}/${BACKUP_FILE}_ssl.tar.gz"
fi

# 5. Create backup manifest
echo "📋 Creating backup manifest..."
cat > ${BACKUP_DIR}/${BACKUP_FILE}_manifest.txt << EOF
CEP COMUNICACIÓN - BACKUP MANIFEST
=====================================
Backup ID: ${BACKUP_FILE}
Date: $(date)
Server: $(hostname)
IP: $(hostname -I | awk '{print $1}')

CONTENTS:
- Database: ${BACKUP_FILE}_database.sql
- MinIO Files: ${BACKUP_FILE}_minio_files.tar.gz
- Configuration: ${BACKUP_FILE}_config.tar.gz
- SSL Certificates: ${BACKUP_FILE}_ssl.tar.gz (if exists)

SYSTEM STATUS:
$(docker-compose ps)

DISK USAGE:
$(df -h /var/www/cepcomunicacion)

BACKUP SIZES:
$(ls -lh ${BACKUP_DIR}/${BACKUP_FILE}_*)
EOF

echo "✅ Backup manifest created: ${BACKUP_DIR}/${BACKUP_FILE}_manifest.txt"

# 6. List all backup files
echo ""
echo "📦 Backup Summary:"
ls -lh ${BACKUP_DIR}/${BACKUP_FILE}_*

echo ""
echo "✅ BACKUP COMPLETED SUCCESSFULLY!"
echo "Backup ID: ${BACKUP_FILE}"
echo "All files stored in: ${BACKUP_DIR}"
echo ""
echo "Next steps:"
echo "1. Verify backup files are complete"
echo "2. Proceed with server cleanup"
echo "3. Reinstall from scratch"
echo ""