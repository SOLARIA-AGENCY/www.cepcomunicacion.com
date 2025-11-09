# Execution Instructions - ADR-003 Parallel Migration

**Execution Mode:** Parallel (All agents at once)
**Platform:** Claude Code Web (8 separate sessions)
**Branch Strategy:** Each agent creates own branch + PR
**Coordinator Role:** Review PRs, merge, then execute rebuild/deploy

---

## 🎯 Execution Strategy

### Parallel Execution (All Agents Launch Simultaneously)

**No dependencies between agents** - cada agente trabaja en su propia copia del repo.

1. **Abre 8 sesiones de Claude Code Web** (puede ser en pestañas diferentes o ventanas)
2. **Cada agente recibe su prompt completo** del archivo `docs/AGENT_PROMPTS_ADR003.md`
3. **Cada agente trabaja en su propia branch** y crea PR al terminar
4. **Tú revisas y mergeas los PRs** cuando estén listos
5. **Me avisas cuando todos estén mergeados** para pull + rebuild + deploy

---

## 📋 Agent Assignments & Branch Names

| Session | Agent | Branch Name | PR Title | Estimated Time |
|---------|-------|-------------|----------|----------------|
| **1** | A1 | `feature/adr003-api-client` | `feat(web-next): implement Payload API client` | 30 min |
| **2** | A5 | `chore/adr003-verify-cms` | `chore(cms): verify API endpoints for frontend` | 15 min |
| **3** | A2 | `refactor/adr003-homepage` | `refactor(web-next): homepage to use REST API` | 20 min |
| **4** | A3 | `refactor/adr003-course-detail` | `refactor(web-next): course detail to use REST API` | 20 min |
| **5** | A4 | `feat/adr003-types` | `feat(web-next): add minimal CMS types` | 15 min |
| **6** | A6 | `test/adr003-api-tests` | `test(web-next): add payloadClient tests` | 30 min |
| **7** | A7 | `chore/adr003-cleanup` | `chore(web-next): remove Payload internals` | 10 min |
| **8** | A8 | `chore/adr003-deps` | `chore(web-next): remove Payload dependencies` | 10 min |

---

## 🚀 Execution Steps

### Step 1: Launch All Agents (Simultáneamente)

**Para cada sesión de Claude Code Web:**

1. Abre https://claude.ai/code
2. Navega al proyecto: `www.cepcomunicacion.com`
3. Lee el archivo: `docs/AGENT_PROMPTS_ADR003.md`
4. Copia el prompt completo del agente correspondiente
5. Añade al final del prompt:

```
BRANCH STRATEGY:
Create a new branch: [branch-name-from-table-above]
When finished:
1. Commit your changes with conventional commit message
2. Push to origin
3. Create Pull Request with title: [PR-title-from-table-above]
4. Include in PR description:
   - What was changed
   - Acceptance criteria checklist (all checked)
   - Any issues encountered
```

**Ejemplo para Agent A1:**
```
[Prompt completo de A1 del archivo...]

BRANCH STRATEGY:
Create a new branch: feature/adr003-api-client
When finished:
1. Commit your changes with message: "feat(web-next): implement Payload API client"
2. Push to origin
3. Create Pull Request with title: "feat(web-next): implement Payload API client"
4. Include in PR description:
   - Implemented PayloadClient class with find() and findByID() methods
   - Added TypeScript interfaces for API responses
   - Error handling with descriptive messages
   - All acceptance criteria: ✅ (list each one)
```

---

### Step 2: Monitor Agent Progress

Cada agente trabajará independientemente y creará su PR cuando termine.

**Puedes monitorear:**
- GitHub: https://github.com/SOLARIA-AGENCY/www.cepcomunicacion.com/pulls
- Verás PRs aparecer a medida que agentes completen

**Tiempo estimado para primeros PRs:**
- A5 (verify CMS): ~15 min
- A4 (types): ~15 min
- A7 (cleanup): ~10 min
- A2, A3 (refactors): ~20 min
- A1, A6 (implementation + tests): ~30 min

---

### Step 3: Review and Merge PRs

**Cuando cada PR esté listo:**

1. **Review automático (GitHub Actions si configurado)**
2. **Review manual:**
   - Verifica que acceptance criteria estén completos
   - Revisa que no haya conflictos
   - Confirma que cambios sean solo los esperados

3. **Merge strategy:**
   - **Opción A:** Merge individual (a medida que llegan)
   - **Opción B:** Merge todos al final (después de revisión completa)

**Recomendación:** Merge individual para agilizar. Solo hay 1 posible conflicto:
- A2 y A3 ambos modifican imports (pero en archivos diferentes)
- A7 depende de que A2 y A3 estén mergeados (pero si hay conflicto, se resuelve fácil)

---

### Step 4: Notify Coordinator (Me avisas)

**Cuando TODOS los PRs estén mergeados:**

Simplemente escribe en el chat:
```
"Todos los PRs mergeados. Pull y procede con rebuild."
```

Yo ejecutaré:
1. `git pull origin main`
2. Verificar que todos los cambios estén integrados
3. Rebuild frontend Docker image
4. Deploy a producción
5. Verificación completa
6. Actualizar documentación

---

## 📝 Prompts Completos por Agente

### 🤖 AGENT A1: API Client Implementation
**Branch:** `feature/adr003-api-client`
**PR Title:** `feat(web-next): implement Payload API client`

**Prompt completo:** Ver líneas 35-204 de `docs/AGENT_PROMPTS_ADR003.md`

**Archivo a crear:**
- `apps/web-next/lib/payloadClient.ts`

---

### 🤖 AGENT A5: Verify CMS Endpoints
**Branch:** `chore/adr003-verify-cms`
**PR Title:** `chore(cms): verify API endpoints for frontend`

**Prompt completo:** Ver líneas 206-302 de `docs/AGENT_PROMPTS_ADR003.md`

**Nota:** Este agente solo verifica, no crea archivos. El PR puede ser un README o documento de verificación.

---

### 🤖 AGENT A2: Refactor Homepage
**Branch:** `refactor/adr003-homepage`
**PR Title:** `refactor(web-next): homepage to use REST API`

**Prompt completo:** Ver líneas 304-424 de `docs/AGENT_PROMPTS_ADR003.md`

**Archivo a modificar:**
- `apps/web-next/app/(frontend)/page.tsx`

---

### 🤖 AGENT A3: Refactor Course Detail
**Branch:** `refactor/adr003-course-detail`
**PR Title:** `refactor(web-next): course detail to use REST API`

**Prompt completo:** Ver líneas 426-541 de `docs/AGENT_PROMPTS_ADR003.md`

**Archivo a modificar:**
- `apps/web-next/app/(frontend)/cursos/[slug]/page.tsx`

---

### 🤖 AGENT A4: Create Types
**Branch:** `feat/adr003-types`
**PR Title:** `feat(web-next): add minimal CMS types`

**Prompt completo:** Ver líneas 543-709 de `docs/AGENT_PROMPTS_ADR003.md`

**Archivo a crear:**
- `apps/web-next/lib/types.ts`

---

### 🤖 AGENT A6: API Client Tests
**Branch:** `test/adr003-api-tests`
**PR Title:** `test(web-next): add payloadClient tests`

**Prompt completo:** Ver líneas 711-864 de `docs/AGENT_PROMPTS_ADR003.md`

**Archivo a crear:**
- `apps/web-next/lib/__tests__/payloadClient.test.ts`

---

### 🤖 AGENT A7: Cleanup
**Branch:** `chore/adr003-cleanup`
**PR Title:** `chore(web-next): remove Payload internals`

**Prompt completo:** Ver líneas 866-963 de `docs/AGENT_PROMPTS_ADR003.md`

**Archivos a eliminar:**
- `apps/web-next/payload.config.ts`
- `apps/web-next/collections/` (directorio completo)
- `apps/web-next/access/`
- `apps/web-next/utils/slugify.ts`
- `apps/web-next/utils/testHelpers.ts`
- `apps/web-next/payload-types.ts`

---

### 🤖 AGENT A8: Update Dependencies
**Branch:** `chore/adr003-deps`
**PR Title:** `chore(web-next): remove Payload dependencies`

**Prompt completo:** Ver líneas 965-1058 de `docs/AGENT_PROMPTS_ADR003.md`

**Archivos a modificar:**
- `apps/web-next/package.json`
- `apps/web-next/tsconfig.json`

---

## ⚠️ Posibles Conflictos y Resolución

### Conflicto Potencial 1: package.json
**Agents:** A8 (dependencies) podría tener conflicto si otros agentes modifican package.json

**Resolución:**
- A8 debe mergear último
- Si hay conflicto, aceptar cambios de A8 (que remueve deps)

### Conflicto Potencial 2: Imports en pages
**Agents:** A2 y A3 modifican imports similares

**Resolución:**
- Archivos diferentes (page.tsx vs cursos/[slug]/page.tsx)
- No debería haber conflicto real

### Conflicto Potencial 3: Types
**Agents:** A2, A3 usan types de A4

**Resolución:**
- A2 y A3 usan `any[]` temporalmente
- Después de merge de A4, se pueden actualizar (opcional)

---

## ✅ Success Criteria

**Cuando todos los PRs estén mergeados, debes tener:**

- [ ] 8 PRs mergeados en `main`
- [ ] No conflictos sin resolver
- [ ] Git history limpio con 8 commits (uno por PR)
- [ ] Todos los archivos esperados creados/modificados/eliminados

**Archivos nuevos esperados:**
- `apps/web-next/lib/payloadClient.ts`
- `apps/web-next/lib/types.ts`
- `apps/web-next/lib/__tests__/payloadClient.test.ts`

**Archivos modificados esperados:**
- `apps/web-next/app/(frontend)/page.tsx`
- `apps/web-next/app/(frontend)/cursos/[slug]/page.tsx`
- `apps/web-next/package.json`
- `apps/web-next/tsconfig.json`

**Archivos eliminados esperados:**
- `apps/web-next/payload.config.ts`
- `apps/web-next/collections/` (todo)
- `apps/web-next/access/` (todo)
- `apps/web-next/utils/slugify.ts`
- `apps/web-next/payload-types.ts`

---

## 🎯 Timeline Real (Parallel)

```
T+0:00  ──► Launch all 8 agents simultaneously
T+0:10  ──► A7 completes (cleanup - simple)
T+0:10  ──► A8 completes (deps - simple)
T+0:15  ──► A5 completes (verify - check only)
T+0:15  ──► A4 completes (types - straightforward)
T+0:20  ──► A2 completes (homepage refactor)
T+0:20  ──► A3 completes (detail refactor)
T+0:30  ──► A1 completes (API client - most complex)
T+0:30  ──► A6 completes (tests - depends on A1 mentally but can work in parallel)
T+0:35  ──► All PRs created
T+0:50  ──► All PRs reviewed and merged
T+0:50  ──► Notify coordinator: "Todos los PRs mergeados. Pull y procede."
T+0:55  ──► Coordinator: git pull + verify
T+1:05  ──► Coordinator: docker compose build frontend
T+1:10  ──► Coordinator: deploy + verify
T+1:20  ──► ✅ MIGRATION COMPLETE
```

**Total Time: ~1 hour 20 minutes** (vs 3 hours sequential, vs 2h 15min phased)

---

## 🚨 Emergency Rollback

Si algo sale mal durante merge o después del deploy:

```bash
# Coordinador ejecuta:
cd /Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com
git log --oneline -10  # Identificar commit antes de migración
git reset --hard <commit-hash-before-migration>
git push origin main --force

# En servidor:
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138
cd /var/www/cepcomunicacion
git pull origin main
docker compose build frontend --no-cache
docker compose up -d frontend
```

**Rollback Time:** < 10 minutes

---

## 📞 Coordinator Contact

**Cuando estés listo para que yo proceda:**

Escribe exactamente:
```
"Todos los PRs mergeados. Pull y procede con rebuild."
```

O si hay problemas:
```
"PR conflicto en [branch-name]. Necesito ayuda."
```

---

**Status:** Ready for execution
**Platform:** Claude Code Web
**Execution Mode:** Full Parallel (8 agents simultaneously)
**Estimated Time:** 1 hour 20 minutes total
