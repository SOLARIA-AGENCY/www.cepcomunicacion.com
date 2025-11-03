# Backup System Quick Reference Card

## Emergency Contact

**Incident Commander:** [Name] - +XX XXX XXX XXX
**Technical Lead:** [Name] - admin@cepcomunicacion.com

---

## Quick Commands

### Run Manual Backup

```bash
# Database
sudo /opt/cepcomunicacion-backup/scripts/backup-database.sh

# Media Files
sudo /opt/cepcomunicacion-backup/scripts/backup-media.sh

# Configuration
sudo /opt/cepcomunicacion-backup/scripts/backup-config.sh
```

### Restore Database

```bash
# Interactive (with confirmation)
sudo /opt/cepcomunicacion-backup/scripts/restore-database.sh /var/backups/cepcomunicacion/database/cepcomunicacion_YYYY-MM-DD_HH-MM-SS.dump

# Force (no confirmation)
sudo /opt/cepcomunicacion-backup/scripts/restore-database.sh /path/to/backup.dump --force
```

### Restore Media Files

```bash
# From latest backup
sudo /opt/cepcomunicacion-backup/scripts/restore-media.sh /var/backups/cepcomunicacion/media/latest

# From specific backup
sudo /opt/cepcomunicacion-backup/scripts/restore-media.sh /var/backups/cepcomunicacion/media/2025-10-31_03-00-00
```

### Restore Configuration

```bash
sudo /opt/cepcomunicacion-backup/scripts/restore-config.sh /var/backups/cepcomunicacion/config/config_YYYY-MM-DD_HH-MM-SS.tar.gz
```

### Check Backup Health

```bash
# Run health check
sudo /opt/cepcomunicacion-backup/scripts/check-backups.sh

# View status
cat /var/run/cepcomunicacion-backup-status.json
```

---

## Backup Locations

```
/var/backups/cepcomunicacion/
├── database/              # Daily DB backups (30 days)
│   └── weekly/           # Weekly DB backups (12 weeks)
├── media/                # Daily media backups (30 days)
│   └── latest/           # Symlink to latest
└── config/               # Daily config backups (30 days)
```

---

## Log Files

```
/var/log/cepcomunicacion/
├── backup-database.log
├── backup-media.log
├── backup-config.log
└── backup-check.log
```

**View logs:**
```bash
tail -f /var/log/cepcomunicacion/backup-database.log
```

---

## Backup Schedule

| Time | Task | Script |
|------|------|--------|
| 02:00 | Database backup | backup-database.sh |
| 02:30 | Config backup | backup-config.sh |
| 03:00 | Media backup | backup-media.sh |
| 03:30 (Sun) | Weekly DB backup | backup-database-weekly.sh |
| Every 6h | Health check | check-backups.sh |

---

## Troubleshooting

### Backup Failed

```bash
# Check logs
tail -50 /var/log/cepcomunicacion/backup-database.log

# Test DB connection
PGPASSWORD=secret psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "SELECT 1;"

# Check disk space
df -h
```

### Restore Failed

```bash
# Check backup file exists
ls -lh /var/backups/cepcomunicacion/database/

# Verify backup integrity
pg_restore -l /path/to/backup.dump

# Check logs
tail -50 /var/log/cepcomunicacion/restore-database.log
```

### Disk Space Full

```bash
# Check usage
du -sh /var/backups/cepcomunicacion/*

# Clean old backups (60+ days)
find /var/backups/cepcomunicacion/database -name "*.dump" -mtime +60 -delete
```

---

## Recovery Time Objectives (RTO)

| Scenario | RTO | Procedure |
|----------|-----|-----------|
| Database corruption | 1-2h | Restore DB |
| Server failure | 4-6h | Rebuild server |
| Data deletion | 2-4h | Selective restore |
| Media loss | 3-4h | Restore media |

**See:** `/infra/backup/DISASTER_RECOVERY.md` for detailed procedures

---

## Critical Files

- **README.md** - Complete documentation (1,100+ lines)
- **DISASTER_RECOVERY.md** - Emergency procedures (1,000+ lines)
- **INSTALLATION.md** - Installation guide (650+ lines)
- **IMPLEMENTATION_SUMMARY.md** - Implementation overview

---

## Support

**Documentation:**
- Read: `/infra/backup/README.md`
- Emergency: `/infra/backup/DISASTER_RECOVERY.md`
- Install: `/infra/backup/INSTALLATION.md`

**Contact:**
- Email: admin@cepcomunicacion.com
- Emergency: +XX XXX XXX XXX

---

**Print this card and keep it accessible for emergencies!**
