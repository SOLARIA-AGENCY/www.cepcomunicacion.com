# Comandos Aprobados para Ejecución Automática

Este archivo documenta todos los comandos que han sido aprobados para ejecución automática sin requerir confirmación del usuario.

**Última actualización:** 2025-10-22 (Expandido con wildcards para acelerar Phase 1)

---

## Git Commands

### Commits y Push
```bash
git add .
git add -A
git add *  # Agregar todos los archivos modificados
git status
git commit *  # Cualquier variante de git commit
git commit -m "mensaje"
git push *  # Cualquier variante de git push
git push origin inicio
git log *  # Cualquier variante de git log
git log --oneline -10
git diff *  # Cualquier variante de git diff
git diff --cached --stat
git diff origin/main..HEAD --stat
```

### Inspección
```bash
git check-ignore .env
git ls-files
git branch -a
```

---

## File Operations

### Lectura
```bash
cat *  # Cualquier archivo
ls *  # Cualquier directorio o patrón
tree *  # Cualquier directorio con tree
```

### Búsqueda
```bash
find *  # Cualquier búsqueda con find
grep -r "pattern" directorio/
```

### Conteo y Estadísticas
```bash
wc *  # Cualquier conteo de líneas/palabras
awk '{print $NF}' archivo
```

---

## Docker Commands

### Gestión de Contenedores
```bash
docker compose ps
docker compose up -d postgres redis
docker compose up -d postgres redis minio
docker compose down
docker compose logs -f
docker inspect nombre_contenedor
```

### Verificación
```bash
docker --version
docker compose version
```

---

## Package Management

### PNPM
```bash
pnpm install
pnpm test *  # Cualquier comando de test
pnpm run *  # Cualquier script de package.json
pnpm test:cms
pnpm test:watch
pnpm test:coverage
pnpm typecheck
pnpm lint
pnpm build
pnpm dev
```

### NPM
```bash
npm run *  # Cualquier script
npm test -- --run apps/cms/src/collections/Cycles/Cycles.test.ts
npx tsc *  # Cualquier comando TypeScript
npx tsc --noEmit
```

---

## Database Operations

### PostgreSQL
```bash
psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "\dt"
cd infra/postgres && ./apply_migrations.sh
```

---

## File Creation & Modification

### Touch y Mkdir
```bash
touch archivo.ts
mkdir -p directorio/subdirectorio
```

### Chmod
```bash
chmod +x script.sh
chmod 0600 archivo
```

### Copy y Move
```bash
cp origen destino
cp -r directorio_origen directorio_destino
mv origen destino
```

---

## System Information

```bash
node --version
pnpm --version
ls
pwd
tree -L 3 directorio/
```

---

## JSON Processing

```bash
cat archivo.json | python3 -m json.tool
```

---

## Security & Validation

### Security Review
```bash
/security-review  # Slash command para análisis de seguridad
```

---

## Approved Patterns

### Safe Patterns (Siempre Aprobados)
1. **Lectura de archivos** dentro del proyecto
2. **Git operations** (status, diff, log, commit, push)
3. **Docker compose** operations (up, down, ps, logs)
4. **Package manager** operations (install, test, build)
5. **File creation** dentro del proyecto
6. **Permission changes** en scripts del proyecto
7. **Database migrations** usando scripts del proyecto

### Require Confirmation (No Automáticos)
1. **Eliminación de archivos** (rm, rm -rf)
2. **Modificación de configuración del sistema**
3. **Instalación de software del sistema** (apt, brew)
4. **Docker system prune**
5. **Comandos fuera del directorio del proyecto**

---

## Context-Specific Approvals

### CEPComunicacion v2 Project
**Project Root:** `/Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com`

**Aprobado para:**
- Todos los comandos git dentro del proyecto
- Todos los comandos docker compose
- Todos los comandos pnpm/npm
- Lectura/escritura de archivos dentro de apps/, infra/, docs/, packages/
- Ejecución de scripts en infra/postgres/, infra/scripts/, infra/backup/
- Lectura de configuración en .claude/, claude_speckit_commands/

**No Aprobado (requiere confirmación):**
- Modificación de archivos fuera del proyecto
- Eliminación de directorios completos
- Comandos que afecten el sistema operativo

---

## Best Practices

1. **Siempre verificar** con `git status` antes de commit
2. **Siempre ejecutar** `/security-review` antes de commits importantes
3. **Siempre documentar** cambios en commit messages
4. **Siempre usar** TodoWrite para tracking de progreso
5. **Siempre seguir** TDD: RED → GREEN → REFACTOR

---

## Emergency Commands

En caso de problemas:

```bash
# Revertir cambios no committed
git restore --staged .
git restore .

# Ver logs de Docker
docker compose logs -f servicio

# Verificar TypeScript
pnpm typecheck

# Limpiar node_modules
rm -rf node_modules && pnpm install
```

---

**Notas:**
- Esta lista se actualiza automáticamente cuando se aprueban nuevos comandos
- Los comandos aprobados se guardan en la configuración de Claude Code
- Para revocar permisos, modificar las preferencias de Claude Code
