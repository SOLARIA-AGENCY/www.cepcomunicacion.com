#!/bin/bash

# CEP Comunicación - Complete Server Reinstallation Script
# Created: 2025-11-18
# Purpose: Clean server and reinstall from scratch with updated code

set -e

# Configuration
PROJECT_DIR="/var/www/cepcomunicacion"
BACKUP_DIR="${PROJECT_DIR}/backups"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${BACKUP_DIR}/reinstall_${DATE}.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "${LOG_FILE}"
}

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "${LOG_FILE}"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "${LOG_FILE}"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "${LOG_FILE}"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "${LOG_FILE}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for user confirmation
confirm() {
    read -p "$1 [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Operation cancelled by user"
        exit 1
    fi
}

# Main installation function
main() {
    print_status "=== CEP COMUNICACIÓN - COMPLETE REINSTALLATION ==="
    print_status "Date: $(date)"
    print_status "Log file: ${LOG_FILE}"
    echo ""

    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! command_exists git; then
        print_error "Git is not installed"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    echo ""

    # Confirm operation
    print_warning "This will COMPLETELY REMOVE all containers, images, and volumes!"
    print_warning "All data will be lost unless you have a backup!"
    confirm "Do you want to proceed with the complete reinstallation?"
    echo ""

    # Change to project directory
    cd "${PROJECT_DIR}" || {
        print_error "Cannot change to project directory: ${PROJECT_DIR}"
        exit 1
    }

    # Step 1: Stop all containers
    print_status "Step 1: Stopping all containers..."
    docker-compose down --remove-orphans || true
    print_success "All containers stopped"

    # Step 2: Remove all containers
    print_status "Step 2: Removing all containers..."
    docker container rm -f $(docker container ls -aq) 2>/dev/null || true
    print_success "All containers removed"

    # Step 3: Remove all images
    print_status "Step 3: Removing all Docker images..."
    docker image rm -f $(docker image ls -aq) 2>/dev/null || true
    print_success "All Docker images removed"

    # Step 4: Remove all volumes (WARNING: This deletes all data!)
    print_status "Step 4: Removing all volumes..."
    docker volume rm -f $(docker volume ls -q) 2>/dev/null || true
    print_success "All volumes removed"

    # Step 5: Clean Docker system
    print_status "Step 5: Cleaning Docker system..."
    docker system prune -af --volumes || true
    print_success "Docker system cleaned"

    # Step 6: Pull latest code
    print_status "Step 6: Pulling latest code from repository..."
    git fetch origin
    git reset --hard origin/main
    git clean -fd
    print_success "Latest code pulled"

    # Step 7: Create necessary directories
    print_status "Step 7: Creating necessary directories..."
    mkdir -p logs backups nginx/conf.d nginx/ssl postgres/init
    print_success "Directories created"

    # Step 8: Set up environment file
    print_status "Step 8: Setting up environment file..."
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Environment file created from .env.example"
            print_warning "Please edit .env file with your actual values before continuing!"
            confirm "Have you configured the .env file with proper values?"
        else
            print_error "No .env.example file found!"
            exit 1
        fi
    else
        print_success "Environment file already exists"
    fi

    # Step 9: Build and start services
    print_status "Step 9: Building and starting services..."
    
    # Start with database first
    print_status "Starting database..."
    docker-compose up -d postgres redis minio
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 30
    
    # Check database health
    for i in {1..10}; do
        if docker-compose exec -T postgres pg_isready -U cepadmin -d cepcomunicacion >/dev/null 2>&1; then
            print_success "Database is ready"
            break
        fi
        if [ $i -eq 10 ]; then
            print_error "Database failed to start properly"
            exit 1
        fi
        print_status "Waiting for database... ($i/10)"
        sleep 10
    done
    
    # Start CMS
    print_status "Starting CMS..."
    docker-compose up -d cms
    
    # Wait for CMS to be ready
    print_status "Waiting for CMS to be ready..."
    sleep 30
    
    # Start frontend
    print_status "Starting frontend..."
    docker-compose up -d frontend
    
    # Start admin
    print_status "Starting admin..."
    docker-compose up -d admin
    
    # Start nginx
    print_status "Starting nginx..."
    docker-compose up -d nginx
    
    print_success "All services started"

    # Step 10: Initialize database
    print_status "Step 10: Initializing database..."
    
    # Wait a bit more for all services to be fully ready
    sleep 30
    
    # Check if CMS is responding
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_success "CMS is responding"
    else
        print_warning "CMS is not responding yet, this may be normal"
    fi
    
    # Step 11: Verify installation
    print_status "Step 11: Verifying installation..."
    
    # Check container status
    print_status "Container status:"
    docker-compose ps
    
    # Check service health
    print_status "Service health checks:"
    
    # Frontend check
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend is responding"
    else
        print_warning "Frontend is not responding yet"
    fi
    
    # CMS check
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_success "CMS API is responding"
    else
        print_warning "CMS API is not responding yet"
    fi
    
    # Nginx check
    if curl -f http://localhost >/dev/null 2>&1; then
        print_success "Nginx proxy is responding"
    else
        print_warning "Nginx proxy is not responding yet"
    fi

    # Step 12: Final instructions
    print_success "=== INSTALLATION COMPLETED ==="
    echo ""
    print_status "Next steps:"
    echo "1. Check the logs: docker-compose logs -f"
    echo "2. Access the applications:"
    echo "   - Frontend: http://$(hostname -I | awk '{print $1}')"
    echo "   - CMS Admin: http://$(hostname -I | awk '{print $1}')/admin"
    echo "   - Admin Panel: http://$(hostname -I | awk '{print $1}'):3001"
    echo "3. Configure SSL certificates if needed"
    echo "4. Set up monitoring and backups"
    echo "5. Test all functionality"
    echo ""
    print_status "Log file: ${LOG_FILE}"
    print_status "Backup directory: ${BACKUP_DIR}"
    echo ""
    print_success "CEP Comunicación has been successfully reinstalled!"
}

# Run main function
main "$@"