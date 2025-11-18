#!/bin/bash

# Script de despliegue para Hetzner VPS
# Uso: ./scripts/deploy-hetzner.sh [production|staging|preview]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes coloreados
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuración
HETZNER_IP=${HETZNER_IP:-"YOUR_HETZNER_IP"}
SSH_KEY=${SSH_KEY:-"~/.ssh/id_rsa"}
PROJECT_DIR="/opt/cepcomunicacion"
DOCKER_COMPOSE_FILE="infra/docker/docker-compose.hetzner.yml"

# Verificar argumentos
ENVIRONMENT=${1:-"production"}
BRANCH=${2:-"main"}

print_message "Iniciando despliegue a Hetzner VPS..."
print_message "Entorno: $ENVIRONMENT"
print_message "Rama: $BRANCH"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
    print_error "Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que el archivo de configuración exista
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
    print_error "Archivo docker-compose no encontrado: $DOCKER_COMPOSE_FILE"
    exit 1
fi

# Función para desplegar a producción
deploy_production() {
    print_message "Desplegando a producción..."
    
    ssh root@$HETZNER_IP << EOF
        echo "🚀 Iniciando despliegue a producción..."
        
        # Navegar al directorio del proyecto
        cd $PROJECT_DIR
        
        # Hacer backup del estado actual
        echo "💾 Creando backup del estado actual..."
        docker-compose -f infra/docker/docker-compose.hetzner.yml exec backup /scripts/backup.sh || true
        
        # Actualizar código
        echo "📥 Actualizando código..."
        git fetch origin
        git reset --hard origin/$BRANCH
        
        # Construir y desplegar
        echo "🔨 Construyendo y desplegando servicios..."
        cd infra/docker
        docker-compose -f docker-compose.hetzner.yml pull
        docker-compose -f docker-compose.hetzner.yml build
        docker-compose -f docker-compose.hetzner.yml up -d --force-recreate
        
        # Esperar a que los servicios estén listos
        echo "⏳ Esperando que los servicios estén listos..."
        sleep 30
        
        # Verificar salud de los servicios
        echo "🏥 Verificando salud de los servicios..."
        if docker-compose -f docker-compose.hetzner.yml ps | grep -q "Up"; then
            echo "✅ Todos los servicios están corriendo!"
        else
            echo "❌ Algunos servicios fallaron al iniciar"
            docker-compose -f docker-compose.hetzner.yml logs --tail=50
            exit 1
        fi
        
        # Limpiar imágenes antiguas
        echo "🧹 Limpiando imágenes Docker antiguas..."
        docker image prune -f
        
        echo "🎉 Despliegue a producción completado!"
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Despliegue a producción completado exitosamente"
        print_message "URLs:"
        print_message "- Frontend: https://cepcomunicacion.com"
        print_message "- Admin: https://admin.cepcomunicacion.com"
        print_message "- API: https://api.cepcomunicacion.com"
    else
        print_error "El despliegue a producción falló"
        exit 1
    fi
}

# Función para desplegar a staging
deploy_staging() {
    print_message "Desplegando a staging..."
    
    ssh root@$HETZNER_IP << EOF
        echo "🚀 Iniciando despliegue a staging..."
        
        cd $PROJECT_DIR
        
        # Actualizar código
        echo "📥 Actualizando código..."
        git fetch origin
        git reset --hard origin/$BRANCH
        
        # Construir y desplegar con configuración de staging
        echo "🔨 Construyendo y desplegando servicios de staging..."
        cd infra/docker
        export COMPOSE_PROJECT_NAME=cep-staging
        export DOMAIN=staging.cepcomunicacion.com
        export NEXT_PUBLIC_ENVIRONMENT=staging
        
        docker-compose -f docker-compose.hetzner.yml pull
        docker-compose -f docker-compose.hetzner.yml build
        docker-compose -f docker-compose.hetzner.yml up -d --force-recreate
        
        echo "🎉 Despliegue a staging completado!"
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Despliegue a staging completado exitosamente"
        print_message "URLs:"
        print_message "- Frontend: https://staging.cepcomunicacion.com"
        print_message "- Admin: https://admin-staging.cepcomunicacion.com"
        print_message "- API: https://api-staging.cepcomunicacion.com"
    else
        print_error "El despliegue a staging falló"
        exit 1
    fi
}

# Función para desplegar preview
deploy_preview() {
    local PR_NUMBER=$2
    if [ -z "$PR_NUMBER" ]; then
        print_error "Para despliegue preview, especifica el número de PR"
        print_error "Uso: $0 preview <PR_NUMBER>"
        exit 1
    fi
    
    print_message "Desplegando preview para PR #$PR_NUMBER..."
    
    ssh root@$HETZNER_IP << EOF
        echo "🚀 Iniciando despliegue preview para PR #$PR_NUMBER..."
        
        cd $PROJECT_DIR
        
        # Crear rama de preview
        git fetch origin
        git checkout -b preview-pr-$PR_NUMBER || git checkout preview-pr-$PR_NUMBER
        git reset --hard origin/$BRANCH
        
        # Construir y desplegar preview
        echo "🔨 Construyendo y desplegando servicios de preview..."
        cd infra/docker
        export COMPOSE_PROJECT_NAME=cep-preview-$PR_NUMBER
        export DOMAIN=preview-$PR_NUMBER.cepcomunicacion.com
        export NEXT_PUBLIC_ENVIRONMENT=preview
        
        docker-compose -f docker-compose.hetzner.yml pull
        docker-compose -f docker-compose.hetzner.yml build
        docker-compose -f docker-compose.hetzner.yml up -d --force-recreate
        
        echo "🎉 Despliegue preview completado!"
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Despliegue preview completado exitosamente"
        print_message "URL:"
        print_message "- Preview: https://preview-$PR_NUMBER.cepcomunicacion.com"
    else
        print_error "El despliegue preview falló"
        exit 1
    fi
}

# Función para limpiar previews
cleanup_previews() {
    print_message "Limpiando previews antiguos..."
    
    ssh root@$HETZNER_IP << EOF
        echo "🧹 Limpiando previews antiguos..."
        
        cd $PROJECT_DIR/infra/docker
        
        # Listar y remover contenedores de preview
        docker ps -a --filter "name=cep-preview-" --format "{{.Names}}" | while read container; do
            if [ -n "\$container" ]; then
                echo "Removiendo contenedor: \$container"
                docker stop \$container || true
                docker rm \$container || true
            fi
        done
        
        # Limpiar redes Docker
        docker network prune -f
        
        echo "✅ Limpieza de previews completada"
EOF
    
    print_success "Limpieza de previews completada"
}

# Función para verificar estado
check_status() {
    print_message "Verificando estado de los servicios..."
    
    ssh root@$HETZNER_IP << EOF
        echo "📊 Estado de los servicios en Hetzner VPS:"
        echo ""
        
        cd $PROJECT_DIR/infra/docker
        docker-compose -f docker-compose.hetzner.yml ps
        
        echo ""
        echo "💾 Uso de recursos:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
        
        echo ""
        echo "📦 Espacio en disco:"
        df -h | grep -E "(Filesystem|/dev/)"
EOF
}

# Función para ver logs
show_logs() {
    local SERVICE=${2:-"cms"}
    print_message "Mostrando logs del servicio: $SERVICE"
    
    ssh root@$HETZNER_IP "cd $PROJECT_DIR/infra/docker && docker-compose -f docker-compose.hetzner.yml logs -f $SERVICE"
}

# Menú principal
case "$ENVIRONMENT" in
    "production"|"prod")
        deploy_production
        ;;
    "staging"|"stage")
        deploy_staging
        ;;
    "preview")
        deploy_preview "$@"
        ;;
    "cleanup")
        cleanup_previews
        ;;
    "status")
        check_status
        ;;
    "logs")
        show_logs "$@"
        ;;
    *)
        echo "Uso: $0 [production|staging|preview|cleanup|status|logs] [opciones]"
        echo ""
        echo "Comandos disponibles:"
        echo "  production          - Desplegar a producción"
        echo "  staging            - Desplegar a staging"
        echo "  preview <PR_NUM>   - Desplegar preview para PR"
        echo "  cleanup            - Limpiar previews antiguos"
        echo "  status             - Verificar estado de servicios"
        echo "  logs [servicio]   - Ver logs de un servicio"
        echo ""
        echo "Ejemplos:"
        echo "  $0 production"
        echo "  $0 staging"
        echo "  $0 preview 123"
        echo "  $0 cleanup"
        echo "  $0 status"
        echo "  $0 logs cms"
        exit 1
        ;;
esac

print_success "Operación completada!"