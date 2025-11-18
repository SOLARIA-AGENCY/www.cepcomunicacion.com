#!/bin/bash

# Script de despliegue para Netlify
# Uso: ./scripts/deploy-netlify.sh [frontend|admin|all]

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

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
    print_error "Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que netlify-cli esté instalado
if ! command -v netlify &> /dev/null; then
    print_error "Netlify CLI no está instalado. Instálalo con: npm install -g netlify-cli"
    exit 1
fi

# Función para desplegar frontend
deploy_frontend() {
    print_message "Desplegando frontend (web-next)..."

    cd apps/web-next

    # Instalar dependencias
    print_message "Instalando dependencias..."
    npm ci

    # Verificar tipos
    print_message "Verificando tipos..."
    npm run type-check

    # Ejecutar tests
    print_message "Ejecutando tests..."
    npm run test:unit

    # Build
    print_message "Construyendo aplicación..."
    npm run build

    # Desplegar a Netlify
    print_message "Desplegando a Netlify..."
    if [ "$BRANCH" = "main" ]; then
        netlify deploy --dir=out --prod
    else
        netlify deploy --dir=out
    fi

    cd ../..
    print_success "Frontend desplegado exitosamente"
}

# Función para desplegar admin
deploy_admin() {
    print_message "Desplegando panel de administración..."

    cd apps/admin

    # Instalar dependencias
    print_message "Instalando dependencias..."
    npm ci

    # Build
    print_message "Construyendo aplicación..."
    npm run build

    # Desplegar a Netlify
    print_message "Desplegando a Netlify..."
    if [ "$BRANCH" = "main" ]; then
        netlify deploy --dir=out --prod
    else
        netlify deploy --dir=out
    fi

    cd ../..
    print_success "Panel de administración desplegado exitosamente"
}

# Obtener la rama actual
BRANCH=$(git branch --show-current)

# Determinar qué desplegar
case "${1:-all}" in
    "frontend")
        deploy_frontend
        ;;
    "admin")
        deploy_admin
        ;;
    "all")
        deploy_frontend
        deploy_admin
        ;;
    *)
        print_error "Uso: $0 [frontend|admin|all]"
        exit 1
        ;;
esac

print_success "Despliegue completado!"
print_message "URLs de despliegue:"
print_message "- Frontend: https://[tu-sitio].netlify.app"
print_message "- Admin: https://admin-[tu-sitio].netlify.app"
print_message "- API: https://api.cepcomunicacion.com"