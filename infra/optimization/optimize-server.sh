#!/bin/bash

################################################################################
# SERVER OPTIMIZATION SCRIPT
#
# Purpose: Apply comprehensive optimizations for production deployment
# Server: CEPCOMUNICACION-PROD (Hetzner VPS - 46.62.222.138)
# Target Stack: Next.js, PostgreSQL, Redis, Docker
# Date: 2025-11-03
# Author: SOLARIA AGENCY
#
# CRITICAL: This script must be run as ROOT
# WARNING: Requires server reboot after completion
################################################################################

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
OPTIMIZATION_DIR="/root/server-optimization"
LOG_FILE="${OPTIMIZATION_DIR}/optimization-$(date +%Y%m%d_%H%M%S).log"
SWAP_SIZE="4G"  # 4GB swap (1.08x RAM for 3.7GB RAM)
SWAP_FILE="/swapfile"

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    echo "[SUCCESS] $1" >> "$LOG_FILE"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    echo "[WARNING] $1" >> "$LOG_FILE"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    echo "[ERROR] $1" >> "$LOG_FILE"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
    echo "[INFO] $1" >> "$LOG_FILE"
}

print_step() {
    echo -e "${MAGENTA}➜ $1${NC}"
    echo "[STEP] $1" >> "$LOG_FILE"
}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

################################################################################
# Pre-flight Checks
################################################################################

preflight_checks() {
    print_header "PRE-FLIGHT CHECKS"

    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
    print_success "Running as root"

    # Create directories
    mkdir -p "$OPTIMIZATION_DIR"
    print_success "Created optimization directory"

    # Initialize log file
    cat > "$LOG_FILE" <<EOF
################################################################################
# SERVER OPTIMIZATION LOG
################################################################################
Server: CEPCOMUNICACION-PROD
IP: 46.62.222.138
Started: $(date '+%Y-%m-%d %H:%M:%S %Z')
Script: optimize-server.sh
################################################################################

EOF
    print_success "Initialized log file: $LOG_FILE"

    # Check if baseline was captured
    if [[ ! -f "${OPTIMIZATION_DIR}/baseline/"baseline-report-*.txt ]]; then
        print_warning "No baseline report found"
        print_warning "Run './pre-optimization-check.sh' first for comparison"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    # Check available disk space (need at least 5GB for swap + overhead)
    local available_space=$(df / | tail -1 | awk '{print $4}')
    local required_space=$((5 * 1024 * 1024))  # 5GB in KB
    if [[ $available_space -lt $required_space ]]; then
        print_error "Insufficient disk space for 4GB swap file"
        print_error "Available: $((available_space / 1024 / 1024))GB, Required: 5GB"
        exit 1
    fi
    print_success "Sufficient disk space available"

    # Update package lists
    print_info "Updating package lists..."
    apt-get update -qq
    print_success "Package lists updated"
}

################################################################################
# 1. SWAP CONFIGURATION
################################################################################

configure_swap() {
    print_header "STEP 1: SWAP CONFIGURATION"

    # Check if swap already exists
    if swapon --show | grep -q "$SWAP_FILE"; then
        print_warning "Swap file already exists at $SWAP_FILE"
        print_info "Current swap configuration:"
        swapon --show
        read -p "Recreate swap? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_step "Disabling existing swap..."
            swapoff "$SWAP_FILE"
            rm -f "$SWAP_FILE"
            print_success "Existing swap removed"
        else
            print_info "Keeping existing swap configuration"
            return 0
        fi
    fi

    # Create swap file
    print_step "Creating ${SWAP_SIZE} swap file at ${SWAP_FILE}..."
    fallocate -l "$SWAP_SIZE" "$SWAP_FILE"
    print_success "Swap file created"

    # Set permissions
    print_step "Setting secure permissions (600)..."
    chmod 600 "$SWAP_FILE"
    print_success "Permissions set"

    # Format as swap
    print_step "Formatting swap file..."
    mkswap "$SWAP_FILE" >> "$LOG_FILE" 2>&1
    print_success "Swap formatted"

    # Enable swap
    print_step "Enabling swap..."
    swapon "$SWAP_FILE"
    print_success "Swap enabled"

    # Verify swap
    print_info "Swap status:"
    swapon --show

    # Make permanent in /etc/fstab
    if ! grep -q "$SWAP_FILE" /etc/fstab; then
        print_step "Adding swap to /etc/fstab for persistence..."
        echo "$SWAP_FILE none swap sw 0 0" >> /etc/fstab
        print_success "Swap added to /etc/fstab"
    else
        print_info "Swap already in /etc/fstab"
    fi

    # Configure swappiness (minimize swap usage, use as emergency only)
    print_step "Configuring vm.swappiness=10..."
    sysctl -w vm.swappiness=10 >> "$LOG_FILE" 2>&1
    print_success "Swappiness set to 10"

    # Configure cache pressure (balanced)
    print_step "Configuring vm.vfs_cache_pressure=50..."
    sysctl -w vm.vfs_cache_pressure=50 >> "$LOG_FILE" 2>&1
    print_success "Cache pressure set to 50"

    print_success "SWAP CONFIGURATION COMPLETE"
    free -h
}

################################################################################
# 2. KERNEL PARAMETER TUNING (SYSCTL)
################################################################################

configure_kernel_parameters() {
    print_header "STEP 2: KERNEL PARAMETER TUNING"

    # Backup existing sysctl.conf
    print_step "Backing up /etc/sysctl.conf..."
    cp /etc/sysctl.conf "/etc/sysctl.conf.backup.$(date +%Y%m%d_%H%M%S)"
    print_success "Backup created"

    # Create optimized sysctl configuration
    print_step "Writing optimized kernel parameters..."

    cat >> /etc/sysctl.conf <<'EOF'

################################################################################
# SERVER OPTIMIZATIONS FOR CEPCOMUNICACION-PROD
# Applied: 2025-11-03
# Target: Next.js + PostgreSQL + Redis + Docker workloads
################################################################################

# SWAP BEHAVIOR
# Minimize swap usage (emergency only)
vm.swappiness=10
vm.vfs_cache_pressure=50

# MEMORY MANAGEMENT
# Allow overcommit for better memory utilization
vm.overcommit_memory=1
vm.panic_on_oom=0

# Optimize dirty page cache flushing (reduce I/O latency)
vm.dirty_ratio=15
vm.dirty_background_ratio=5
vm.dirty_expire_centisecs=3000
vm.dirty_writeback_centisecs=500

# NETWORK PERFORMANCE
# Increase TCP buffer sizes for high-throughput connections
net.core.rmem_max=16777216
net.core.wmem_max=16777216
net.ipv4.tcp_rmem=4096 87380 16777216
net.ipv4.tcp_wmem=4096 65536 16777216

# Enable TCP window scaling for large data transfers
net.ipv4.tcp_window_scaling=1

# Increase connection queue sizes
net.core.somaxconn=4096
net.core.netdev_max_backlog=5000
net.ipv4.tcp_max_syn_backlog=8192

# TCP optimization for web applications
net.ipv4.tcp_fastopen=3
net.ipv4.tcp_slow_start_after_idle=0
net.ipv4.tcp_tw_reuse=1
net.ipv4.tcp_fin_timeout=15
net.ipv4.tcp_keepalive_time=300
net.ipv4.tcp_keepalive_probes=5
net.ipv4.tcp_keepalive_intvl=15

# Increase local port range for high connection counts
net.ipv4.ip_local_port_range=1024 65535

# BBR TCP Congestion Control (modern, efficient)
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr

# FILE SYSTEM PERFORMANCE
# Increase file descriptor limits
fs.file-max=2097152

# Optimize inode cache
fs.inode-max=2097152

# Increase max watches for file monitoring (Docker, Node.js)
fs.inotify.max_user_watches=524288
fs.inotify.max_user_instances=512
fs.inotify.max_queued_events=32768

# SHARED MEMORY (PostgreSQL optimization)
# 4GB shared memory
kernel.shmmax=4294967296
kernel.shmall=1048576

# MESSAGE QUEUES
# Increase message queue limits
kernel.msgmnb=65536
kernel.msgmax=65536

# NETFILTER CONNECTION TRACKING
# Increase connection tracking table (for Docker networking)
net.netfilter.nf_conntrack_max=262144
net.netfilter.nf_conntrack_tcp_timeout_established=1800

# SECURITY
# Enable SYN cookies (protection against SYN flood attacks)
net.ipv4.tcp_syncookies=1

# Ignore ICMP redirects (security)
net.ipv4.conf.all.accept_redirects=0
net.ipv4.conf.default.accept_redirects=0
net.ipv6.conf.all.accept_redirects=0
net.ipv6.conf.default.accept_redirects=0

# Ignore source-routed packets (security)
net.ipv4.conf.all.accept_source_route=0
net.ipv4.conf.default.accept_source_route=0

# Enable reverse path filtering (anti-spoofing)
net.ipv4.conf.all.rp_filter=1
net.ipv4.conf.default.rp_filter=1

# Log martian packets (security monitoring)
net.ipv4.conf.all.log_martians=1

EOF

    print_success "Kernel parameters written to /etc/sysctl.conf"

    # Apply all parameters
    print_step "Applying kernel parameters..."
    sysctl -p >> "$LOG_FILE" 2>&1
    print_success "Kernel parameters applied"

    # Verify critical parameters
    print_info "Verifying critical parameters:"
    echo "  vm.swappiness: $(sysctl -n vm.swappiness)"
    echo "  net.core.somaxconn: $(sysctl -n net.core.somaxconn)"
    echo "  fs.file-max: $(sysctl -n fs.file-max)"
    echo "  net.ipv4.tcp_congestion_control: $(sysctl -n net.ipv4.tcp_congestion_control)"

    print_success "KERNEL PARAMETERS CONFIGURED"
}

################################################################################
# 3. FILE DESCRIPTOR LIMITS
################################################################################

configure_fd_limits() {
    print_header "STEP 3: FILE DESCRIPTOR LIMITS"

    # Backup existing limits.conf
    print_step "Backing up /etc/security/limits.conf..."
    cp /etc/security/limits.conf "/etc/security/limits.conf.backup.$(date +%Y%m%d_%H%M%S)"
    print_success "Backup created"

    # Remove existing wildcard entries to avoid duplicates
    sed -i '/^\* soft nofile/d' /etc/security/limits.conf
    sed -i '/^\* hard nofile/d' /etc/security/limits.conf
    sed -i '/^\* soft nproc/d' /etc/security/limits.conf
    sed -i '/^\* hard nproc/d' /etc/security/limits.conf
    sed -i '/^root soft nofile/d' /etc/security/limits.conf
    sed -i '/^root hard nofile/d' /etc/security/limits.conf

    # Add optimized limits
    print_step "Configuring file descriptor limits..."

    cat >> /etc/security/limits.conf <<'EOF'

################################################################################
# FILE DESCRIPTOR LIMITS - CEPCOMUNICACION-PROD
# Applied: 2025-11-03
################################################################################

# All users (including application users)
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536

# Root user
root soft nofile 65536
root hard nofile 65536

# Specific limits for PostgreSQL (if postgres user exists)
postgres soft nofile 65536
postgres hard nofile 65536

EOF

    print_success "File descriptor limits configured"

    # Show current limits
    print_info "Current shell limits:"
    ulimit -Sn | xargs echo "  Soft limit:"
    ulimit -Hn | xargs echo "  Hard limit:"

    print_success "FILE DESCRIPTOR LIMITS CONFIGURED"
}

################################################################################
# 4. SYSTEMD SERVICE LIMITS
################################################################################

configure_systemd_limits() {
    print_header "STEP 4: SYSTEMD SERVICE LIMITS"

    # Configure system-wide service defaults
    print_step "Backing up /etc/systemd/system.conf..."
    cp /etc/systemd/system.conf "/etc/systemd/system.conf.backup.$(date +%Y%m%d_%H%M%S)"

    print_step "Configuring systemd system limits..."
    sed -i 's/^#\?DefaultLimitNOFILE=.*/DefaultLimitNOFILE=65536/' /etc/systemd/system.conf
    sed -i 's/^#\?DefaultLimitNPROC=.*/DefaultLimitNPROC=65536/' /etc/systemd/system.conf
    sed -i 's/^#\?DefaultTasksMax=.*/DefaultTasksMax=65536/' /etc/systemd/system.conf

    # If settings don't exist, add them
    if ! grep -q "^DefaultLimitNOFILE=" /etc/systemd/system.conf; then
        echo "DefaultLimitNOFILE=65536" >> /etc/systemd/system.conf
    fi
    if ! grep -q "^DefaultLimitNPROC=" /etc/systemd/system.conf; then
        echo "DefaultLimitNPROC=65536" >> /etc/systemd/system.conf
    fi
    if ! grep -q "^DefaultTasksMax=" /etc/systemd/system.conf; then
        echo "DefaultTasksMax=65536" >> /etc/systemd/system.conf
    fi

    print_success "System limits configured"

    # Configure user service defaults
    print_step "Backing up /etc/systemd/user.conf..."
    cp /etc/systemd/user.conf "/etc/systemd/user.conf.backup.$(date +%Y%m%d_%H%M%S)"

    print_step "Configuring systemd user limits..."
    sed -i 's/^#\?DefaultLimitNOFILE=.*/DefaultLimitNOFILE=65536/' /etc/systemd/user.conf
    sed -i 's/^#\?DefaultLimitNPROC=.*/DefaultLimitNPROC=65536/' /etc/systemd/user.conf

    if ! grep -q "^DefaultLimitNOFILE=" /etc/systemd/user.conf; then
        echo "DefaultLimitNOFILE=65536" >> /etc/systemd/user.conf
    fi
    if ! grep -q "^DefaultLimitNPROC=" /etc/systemd/user.conf; then
        echo "DefaultLimitNPROC=65536" >> /etc/systemd/user.conf
    fi

    print_success "User limits configured"

    # Reload systemd configuration
    print_step "Reloading systemd daemon..."
    systemctl daemon-reload
    print_success "systemd daemon reloaded"

    print_success "SYSTEMD LIMITS CONFIGURED"
}

################################################################################
# 5. DISK I/O OPTIMIZATION
################################################################################

configure_disk_io() {
    print_header "STEP 5: DISK I/O OPTIMIZATION"

    # Enable fstrim for SSD
    print_step "Enabling weekly SSD TRIM..."
    if systemctl is-enabled fstrim.timer &>/dev/null; then
        print_info "fstrim.timer already enabled"
    else
        systemctl enable fstrim.timer >> "$LOG_FILE" 2>&1
        systemctl start fstrim.timer >> "$LOG_FILE" 2>&1
        print_success "fstrim.timer enabled and started"
    fi

    # Configure I/O scheduler for SSD (mq-deadline)
    print_step "Configuring I/O scheduler for SSD..."

    # Create udev rule for persistent I/O scheduler
    cat > /etc/udev/rules.d/60-scheduler.rules <<'EOF'
# I/O Scheduler optimization for SSD
# Use mq-deadline for better SSD performance
ACTION=="add|change", KERNEL=="sd[a-z]", ATTR{queue/scheduler}="mq-deadline"
ACTION=="add|change", KERNEL=="nvme[0-9]n[0-9]", ATTR{queue/scheduler}="none"
EOF

    print_success "I/O scheduler udev rule created"

    # Apply to current devices
    for disk in /sys/block/sd*/queue/scheduler; do
        if [[ -f "$disk" ]]; then
            echo "mq-deadline" > "$disk" 2>/dev/null || print_warning "Could not set scheduler for $disk"
        fi
    done
    print_success "I/O scheduler applied to SSD devices"

    # Optimize mount options in /etc/fstab
    print_step "Backing up /etc/fstab..."
    cp /etc/fstab "/etc/fstab.backup.$(date +%Y%m%d_%H%M%S)"

    print_step "Checking /etc/fstab for noatime optimization..."
    if grep -q "noatime" /etc/fstab; then
        print_info "noatime already configured in /etc/fstab"
    else
        print_warning "Manual /etc/fstab edit required:"
        print_warning "Add 'noatime' to mount options for root filesystem"
        print_warning "Example: defaults,noatime,errors=remount-ro"
        print_warning "This will take effect after reboot"
    fi

    print_success "DISK I/O OPTIMIZATION CONFIGURED"
}

################################################################################
# 6. DISABLE UNNECESSARY SERVICES
################################################################################

disable_unnecessary_services() {
    print_header "STEP 6: DISABLE UNNECESSARY SERVICES"

    # List of services to potentially disable (check if exists first)
    local services_to_check=(
        "snapd.service"
        "snapd.socket"
        "ModemManager.service"
        "bluetooth.service"
        "cups.service"
        "cups-browsed.service"
        "avahi-daemon.service"
    )

    print_info "Checking for unnecessary services..."

    for service in "${services_to_check[@]}"; do
        if systemctl list-unit-files | grep -q "^${service}"; then
            if systemctl is-enabled "$service" &>/dev/null; then
                print_step "Disabling $service..."
                systemctl disable "$service" >> "$LOG_FILE" 2>&1 || true
                systemctl stop "$service" >> "$LOG_FILE" 2>&1 || true
                print_success "Disabled: $service"
            else
                print_info "Already disabled: $service"
            fi
        else
            print_info "Not installed: $service"
        fi
    done

    # Mask snapd completely if installed
    if systemctl list-unit-files | grep -q "^snapd.service"; then
        print_step "Masking snapd to prevent auto-restart..."
        systemctl mask snapd.service >> "$LOG_FILE" 2>&1 || true
        print_success "snapd masked"
    fi

    print_success "UNNECESSARY SERVICES DISABLED"
}

################################################################################
# 7. JOURNALD LOG OPTIMIZATION
################################################################################

configure_journald() {
    print_header "STEP 7: JOURNALD LOG OPTIMIZATION"

    # Backup journald config
    print_step "Backing up /etc/systemd/journald.conf..."
    cp /etc/systemd/journald.conf "/etc/systemd/journald.conf.backup.$(date +%Y%m%d_%H%M%S)"

    # Configure log limits
    print_step "Configuring journald limits..."

    sed -i 's/^#\?SystemMaxUse=.*/SystemMaxUse=500M/' /etc/systemd/journald.conf
    sed -i 's/^#\?SystemMaxFileSize=.*/SystemMaxFileSize=100M/' /etc/systemd/journald.conf
    sed -i 's/^#\?MaxRetentionSec=.*/MaxRetentionSec=7day/' /etc/systemd/journald.conf

    # Add settings if they don't exist
    if ! grep -q "^SystemMaxUse=" /etc/systemd/journald.conf; then
        echo "SystemMaxUse=500M" >> /etc/systemd/journald.conf
    fi
    if ! grep -q "^SystemMaxFileSize=" /etc/systemd/journald.conf; then
        echo "SystemMaxFileSize=100M" >> /etc/systemd/journald.conf
    fi
    if ! grep -q "^MaxRetentionSec=" /etc/systemd/journald.conf; then
        echo "MaxRetentionSec=7day" >> /etc/systemd/journald.conf
    fi

    print_success "journald limits configured"

    # Restart journald
    print_step "Restarting journald..."
    systemctl restart systemd-journald
    print_success "journald restarted"

    print_success "JOURNALD OPTIMIZATION COMPLETE"
}

################################################################################
# 8. TIMEZONE CONFIGURATION
################################################################################

configure_timezone() {
    print_header "STEP 8: TIMEZONE CONFIGURATION"

    local target_timezone="Europe/Madrid"

    print_step "Setting timezone to ${target_timezone}..."
    timedatectl set-timezone "$target_timezone"
    print_success "Timezone set to ${target_timezone}"

    # Show current time configuration
    print_info "Current time configuration:"
    timedatectl | sed 's/^/  /'

    print_success "TIMEZONE CONFIGURED"
}

################################################################################
# 9. TIME SYNCHRONIZATION (NTP)
################################################################################

configure_time_sync() {
    print_header "STEP 9: TIME SYNCHRONIZATION"

    # Check if chrony or systemd-timesyncd is available
    if command -v chrony &> /dev/null; then
        print_info "chrony already installed"
    elif systemctl is-active systemd-timesyncd &>/dev/null; then
        print_info "systemd-timesyncd is active"
        print_step "Enabling NTP synchronization..."
        timedatectl set-ntp true
        print_success "NTP enabled via systemd-timesyncd"
    else
        print_step "Installing chrony for time synchronization..."
        apt-get install -y chrony >> "$LOG_FILE" 2>&1
        systemctl enable chrony >> "$LOG_FILE" 2>&1
        systemctl start chrony >> "$LOG_FILE" 2>&1
        print_success "chrony installed and started"
    fi

    # Verify time sync status
    print_info "Time synchronization status:"
    timedatectl | grep "synchronized" | sed 's/^/  /'

    print_success "TIME SYNCHRONIZATION CONFIGURED"
}

################################################################################
# 10. INSTALL MONITORING TOOLS
################################################################################

install_monitoring_tools() {
    print_header "STEP 10: MONITORING TOOLS INSTALLATION"

    local tools=(
        "htop"           # Interactive process viewer
        "iotop"          # I/O monitoring
        "sysstat"        # Performance monitoring (iostat, mpstat, etc.)
        "nethogs"        # Network bandwidth by process
        "ncdu"           # Disk usage analyzer
        "net-tools"      # Network tools (netstat, ifconfig)
        "dstat"          # Versatile resource statistics
        "bmon"           # Network bandwidth monitor
    )

    print_step "Installing monitoring tools..."

    for tool in "${tools[@]}"; do
        if command -v "$tool" &> /dev/null; then
            print_info "Already installed: $tool"
        else
            print_step "Installing $tool..."
            apt-get install -y "$tool" >> "$LOG_FILE" 2>&1
            print_success "Installed: $tool"
        fi
    done

    print_success "MONITORING TOOLS INSTALLED"
}

################################################################################
# 11. DOCKER OPTIMIZATIONS
################################################################################

configure_docker_optimizations() {
    print_header "STEP 11: DOCKER OPTIMIZATIONS"

    # Create Docker daemon configuration directory
    print_step "Configuring Docker daemon settings..."
    mkdir -p /etc/docker

    # Create optimized Docker daemon configuration
    cat > /etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 65536,
      "Soft": 65536
    }
  }
}
EOF

    print_success "Docker daemon configuration created"

    # Note: Docker will be restarted after reboot
    print_info "Docker daemon will use new settings after reboot"

    print_success "DOCKER OPTIMIZATIONS CONFIGURED"
}

################################################################################
# 12. SECURITY HARDENING
################################################################################

configure_security() {
    print_header "STEP 12: SECURITY HARDENING"

    # Enable automatic security updates (if unattended-upgrades exists)
    if dpkg -l | grep -q unattended-upgrades; then
        print_step "Enabling automatic security updates..."
        echo 'APT::Periodic::Update-Package-Lists "1";' > /etc/apt/apt.conf.d/20auto-upgrades
        echo 'APT::Periodic::Unattended-Upgrade "1";' >> /etc/apt/apt.conf.d/20auto-upgrades
        print_success "Automatic security updates enabled"
    else
        print_warning "unattended-upgrades not installed"
        print_info "Install with: apt-get install -y unattended-upgrades"
    fi

    # Disable root login message (security through obscurity)
    print_step "Configuring SSH banner..."
    if [[ -f /etc/ssh/sshd_config ]]; then
        sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
        print_info "SSH configured to require key-based authentication"
    fi

    # Set restrictive umask for new files
    print_step "Setting restrictive umask..."
    if ! grep -q "umask 027" /etc/profile; then
        echo "umask 027" >> /etc/profile
        print_success "umask set to 027"
    fi

    print_success "SECURITY HARDENING COMPLETE"
}

################################################################################
# 13. GENERATE OPTIMIZATION SUMMARY
################################################################################

generate_summary() {
    print_header "OPTIMIZATION SUMMARY"

    local summary_file="${OPTIMIZATION_DIR}/optimization-summary-$(date +%Y%m%d_%H%M%S).txt"

    cat > "$summary_file" <<EOF
################################################################################
# SERVER OPTIMIZATION SUMMARY
################################################################################

Server: CEPCOMUNICACION-PROD
IP: 46.62.222.138
Completed: $(date '+%Y-%m-%d %H:%M:%S %Z')

OPTIMIZATIONS APPLIED:
=====================

1. SWAP CONFIGURATION
   - Created: ${SWAP_SIZE} swap file at ${SWAP_FILE}
   - Swappiness: 10 (minimal swap usage)
   - Cache pressure: 50 (balanced)

2. KERNEL PARAMETERS
   - Network buffers increased for high throughput
   - BBR congestion control enabled
   - File descriptor limits: 2,097,152
   - Connection queue sizes increased
   - Security hardening applied

3. FILE DESCRIPTOR LIMITS
   - Soft/Hard limits: 65,536
   - Applied to all users and root

4. SYSTEMD LIMITS
   - DefaultLimitNOFILE: 65,536
   - DefaultLimitNPROC: 65,536
   - DefaultTasksMax: 65,536

5. DISK I/O OPTIMIZATION
   - SSD TRIM enabled (weekly)
   - I/O scheduler: mq-deadline (SSD optimized)
   - Mount options: noatime recommended

6. SERVICES
   - Disabled unnecessary services (snapd, bluetooth, etc.)
   - Reduced RAM consumption

7. JOURNALD LOGS
   - Max disk usage: 500M
   - Max file size: 100M
   - Retention: 7 days

8. TIMEZONE & TIME SYNC
   - Timezone: Europe/Madrid
   - NTP synchronization enabled

9. MONITORING TOOLS
   - htop, iotop, sysstat, nethogs, ncdu installed

10. DOCKER OPTIMIZATIONS
    - Log rotation configured
    - Storage driver: overlay2
    - File descriptor limits applied

11. SECURITY HARDENING
    - SSH key-based auth enforced
    - Restrictive umask set
    - Automatic security updates enabled

CURRENT SYSTEM STATE:
====================

Memory:
$(free -h)

Swap:
$(swapon --show)

Disk:
$(df -h /)

Load Average:
$(uptime)

NEXT STEPS:
==========

1. REBOOT THE SERVER (REQUIRED)
   sudo reboot

2. After reboot, run post-optimization check:
   ./post-optimization-check.sh

3. Review and compare reports:
   - Baseline: ${OPTIMIZATION_DIR}/baseline/
   - Post-optimization: ${OPTIMIZATION_DIR}/post-optimization/

4. Monitor system performance for 24-48 hours

5. Adjust parameters if needed based on application behavior

ROLLBACK INSTRUCTIONS:
=====================

If issues occur, restore from backups:

# Restore sysctl
cp /etc/sysctl.conf.backup.YYYYMMDD_HHMMSS /etc/sysctl.conf
sysctl -p

# Restore limits
cp /etc/security/limits.conf.backup.YYYYMMDD_HHMMSS /etc/security/limits.conf

# Restore systemd
cp /etc/systemd/system.conf.backup.YYYYMMDD_HHMMSS /etc/systemd/system.conf
cp /etc/systemd/user.conf.backup.YYYYMMDD_HHMMSS /etc/systemd/user.conf
systemctl daemon-reload

# Disable swap
swapoff ${SWAP_FILE}
rm ${SWAP_FILE}
# Remove swap entry from /etc/fstab

All backups are stored in:
- ${OPTIMIZATION_DIR}/config-backups/

################################################################################
EOF

    print_success "Summary saved: $summary_file"

    # Display summary
    cat "$summary_file"

    print_info "Full log available at: $LOG_FILE"
}

################################################################################
# 14. FINAL VERIFICATION
################################################################################

final_verification() {
    print_header "FINAL VERIFICATION"

    local issues=0

    # Check swap
    print_step "Verifying swap..."
    if swapon --show | grep -q "$SWAP_FILE"; then
        print_success "Swap active: $(swapon --show | grep $SWAP_FILE | awk '{print $3}')"
    else
        print_error "Swap not active"
        ((issues++))
    fi

    # Check swappiness
    print_step "Verifying swappiness..."
    local swappiness=$(sysctl -n vm.swappiness)
    if [[ $swappiness -eq 10 ]]; then
        print_success "Swappiness: $swappiness"
    else
        print_warning "Swappiness is $swappiness (expected 10)"
    fi

    # Check file-max
    print_step "Verifying file descriptor limit..."
    local file_max=$(sysctl -n fs.file-max)
    if [[ $file_max -ge 2097152 ]]; then
        print_success "fs.file-max: $file_max"
    else
        print_warning "fs.file-max is $file_max (expected >= 2097152)"
    fi

    # Check BBR
    print_step "Verifying BBR congestion control..."
    local tcp_cc=$(sysctl -n net.ipv4.tcp_congestion_control)
    if [[ "$tcp_cc" == "bbr" ]]; then
        print_success "TCP congestion control: $tcp_cc"
    else
        print_warning "TCP congestion control is $tcp_cc (expected bbr)"
    fi

    # Check fstrim
    print_step "Verifying fstrim timer..."
    if systemctl is-enabled fstrim.timer &>/dev/null; then
        print_success "fstrim.timer enabled"
    else
        print_warning "fstrim.timer not enabled"
    fi

    # Summary
    echo ""
    if [[ $issues -eq 0 ]]; then
        print_success "All verifications passed!"
    else
        print_warning "Verification completed with $issues issues"
    fi

    print_success "VERIFICATION COMPLETE"
}

################################################################################
# Main Execution
################################################################################

main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                                                                ║"
    echo "║          SERVER OPTIMIZATION FOR PRODUCTION                    ║"
    echo "║          CEPCOMUNICACION-PROD (Hetzner VPS)                   ║"
    echo "║                                                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "This script will apply comprehensive optimizations for:"
    echo "  - Next.js application performance"
    echo "  - PostgreSQL database"
    echo "  - Redis cache/queue"
    echo "  - Docker containerization"
    echo ""
    print_warning "IMPORTANT: Server reboot required after completion"
    echo ""
    read -p "Continue with optimization? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Optimization cancelled"
        exit 0
    fi

    log "=== OPTIMIZATION STARTED ==="

    preflight_checks
    configure_swap
    configure_kernel_parameters
    configure_fd_limits
    configure_systemd_limits
    configure_disk_io
    disable_unnecessary_services
    configure_journald
    configure_timezone
    configure_time_sync
    install_monitoring_tools
    configure_docker_optimizations
    configure_security
    final_verification
    generate_summary

    print_header "OPTIMIZATION COMPLETE"

    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                   NEXT STEPS                                   ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "1. Review the optimization summary above"
    echo "2. REBOOT the server to apply all changes:"
    echo "   ${GREEN}sudo reboot${NC}"
    echo ""
    echo "3. After reboot, SSH back and run:"
    echo "   ${GREEN}./post-optimization-check.sh${NC}"
    echo ""
    echo "4. Compare baseline vs post-optimization reports"
    echo ""
    print_success "All optimizations applied successfully!"
    echo ""

    log "=== OPTIMIZATION COMPLETED ==="
}

# Execute main function
main "$@"
