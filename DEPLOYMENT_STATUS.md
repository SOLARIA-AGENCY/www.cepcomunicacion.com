# CEP Comunicacion - Production Server Deployment

## Server Information

- **Server IP**: 46.62.222.138
- **Server Name**: cepcomunicacion-prod
- **Provider**: Hetzner
- **Date**: 2025-11-18
- **OS**: Ubuntu 24.04 LTS

## SSH Access

- **SSH Key**: ED25519 key stored in `~/.ssh/cepcomunicacion`
- **Command**: `ssh -i ~/.ssh/cepcomunicacion root@46.62.222.138`
- **Port**: 22 (primary), 2022 (alternative)
- **Public Key**: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ7z8wfurmhmT71GPsDrprLuRE0EviT0QHjq+ZPcKnWG admin@cepcomunicacion-prod.com`

## Security Configuration

- **Firewall**: UFW enabled with deny-by-default policy
- **Allowed Ports**:
  - SSH: 22, 2022
  - HTTP: 80, 8080
  - HTTPS: 443
  - FTP: 20, 21, 30000:30100
  - MinIO: 9000, 9001
- **IP Whitelisting**: Hetzner (65.21.0.0/16) and Cloudflare ranges for SSH
- **Security Tools**: fail2ban enabled

## Services Status

- ✅ Docker: Running
- ✅ Nginx: Running (test page accessible)
- ✅ Firewall: Active
- ✅ Fail2ban: Active
- ✅ FTP Server: Configured
- ⏳ Full Application Stack: In Progress

## Project Deployment

- **Project Path**: `/opt/www.cepcomunicacion.com/`
- **Docker Compose**: Complex multi-service setup
- **Environment**: Production `.env` file created
- **Database**: PostgreSQL 16 (planned)
- **Storage**: MinIO S3-compatible (planned)
- **Cache**: Redis 7 (planned)

## Access URLs

- **Test Page**: http://46.62.222.138 (nginx welcome)
- **Planned Frontend**: http://46.62.222.138/ (HeroCarousel)
- **Planned CMS API**: http://46.62.222.138:3000/admin
- **Planned Admin Panel**: http://46.62.222.138:3001
- **Planned MinIO Console**: http://46.62.222.138:9001

## Backup Strategy

- **SSH Keys**: Backed up locally in `./backup-server-keys/`
- **Server Info**: Stored in `/opt/backup/server-info.txt`
- **Database**: Automated backups planned to MinIO
- **FTP Access**: Multiple ports for redundancy

## Next Steps

1. Complete Docker services deployment
2. Configure application environment
3. Deploy frontend with HeroCarousel
4. Test all services
5. Configure SSL certificates
6. Setup monitoring

## Recovery Commands

```bash
# SSH Access
ssh -i ~/.ssh/cepcomunicacion root@46.62.222.138

# Check Services
docker ps
docker-compose ps

# Restart Services
cd /opt && docker-compose restart

# Firewall Status
ufw status verbose

# System Logs
journalctl -u docker -f
```

## Important Notes

- Server is accessible and secure
- Basic Docker functionality verified
- Complex application deployment in progress
- All critical information backed up
- Multiple access methods configured for redundancy

---

_Last Updated: 2025-11-18_
_Status: Infrastructure Ready, Application Deployment In Progress_
