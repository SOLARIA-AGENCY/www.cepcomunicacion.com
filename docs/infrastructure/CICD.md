# CI/CD Pipeline Documentation

Complete guide to the Continuous Integration and Continuous Deployment pipeline for CEPComunicacion v2.

## Table of Contents

- [Overview](#overview)
- [Pipeline Architecture](#pipeline-architecture)
- [Continuous Integration (CI)](#continuous-integration-ci)
- [Continuous Deployment (CD)](#continuous-deployment-cd)
- [Branch Strategy](#branch-strategy)
- [Deployment Process](#deployment-process)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring and Alerts](#monitoring-and-alerts)
- [Troubleshooting](#troubleshooting)

---

## Overview

The CI/CD pipeline automates code quality checks, testing, building, and deployment to production servers.

### Key Features

- **Automated Testing:** Unit, integration, and E2E tests on every push
- **Code Quality:** Linting, formatting, and type checking
- **Docker Build Validation:** Multi-stage builds with caching
- **Infrastructure Tests:** Health checks and smoke tests
- **One-Click Deployment:** Manual workflow dispatch to production
- **Automatic Rollback:** Failed deployments trigger automatic rollback
- **Zero-Downtime:** Blue-green deployment strategy

### Technologies Used

- **CI/CD Platform:** GitHub Actions
- **Container Registry:** GitHub Container Registry (GHCR)
- **Deployment Target:** Hetzner VPS (Ubuntu 24.04.3)
- **Orchestration:** Docker Compose
- **Testing:** Vitest, Playwright
- **Linting:** ESLint, Prettier
- **Type Checking:** TypeScript

---

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Developer Workflow                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Repository (Push/PR)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Continuous Integration (CI)                     │
│                                                                   │
│  Phase 1: Code Quality                                           │
│    ├─ Lint Code (ESLint)                                         │
│    └─ Check Formatting (Prettier)                                │
│                                                                   │
│  Phase 2: Type Safety                                            │
│    └─ TypeScript Type Check                                      │
│                                                                   │
│  Phase 3: Unit Tests                                             │
│    ├─ Run Vitest Tests                                           │
│    └─ Generate Coverage Report                                   │
│                                                                   │
│  Phase 4: Build Validation                                       │
│    ├─ Build Frontend (Next.js 16)                                │
│    ├─ Build CMS (Payload 3.62.1)                                 │
│    └─ Build Admin (Next.js 15)                                   │
│                                                                   │
│  Phase 5: Docker Build Test                                      │
│    ├─ Build Frontend Image                                       │
│    ├─ Build CMS Image                                            │
│    └─ Build Admin Image                                          │
│                                                                   │
│  Phase 6: Infrastructure Tests                                   │
│    ├─ Start Test Environment                                     │
│    ├─ Run Health Checks                                          │
│    └─ Run Smoke Tests                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ✅ All Checks Pass
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│             Continuous Deployment (CD) - MANUAL                  │
│                                                                   │
│  Trigger: workflow_dispatch (requires typing "DEPLOY")           │
│                                                                   │
│  Phase 1: Validation                                             │
│    ├─ Confirm Deployment Intent                                  │
│    └─ Verify Branch (main)                                       │
│                                                                   │
│  Phase 2: Pre-Deployment Tests                                   │
│    ├─ Run Full CI Suite Again                                    │
│    └─ Build All Packages                                         │
│                                                                   │
│  Phase 3: Build Production Images                                │
│    ├─ Build & Tag with SHA                                       │
│    ├─ Push to GHCR                                               │
│    └─ Cache Layers                                               │
│                                                                   │
│  Phase 4: Deploy to Production                                   │
│    ├─ SSH to Hetzner Server                                      │
│    ├─ Pre-Deployment Backup                                      │
│    ├─ Pull New Images                                            │
│    ├─ Stop Services Gracefully                                   │
│    ├─ Start with New Images                                      │
│    └─ Run Smoke Tests                                            │
│                                                                   │
│  Phase 5: Post-Deployment Verification                           │
│    ├─ Health Check All Endpoints                                 │
│    ├─ Verify Database Connection                                 │
│    └─ Check Service Logs                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ❌ If Any Step Fails
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Automatic Rollback                              │
│                                                                   │
│    ├─ Restore Previous .env                                      │
│    ├─ Stop Current Services                                      │
│    ├─ Start Previous Version                                     │
│    └─ Notify Team                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Continuous Integration (CI)

### Trigger Conditions

CI runs automatically on:

- **Push** to `main`, `develop`, or `feature/**` branches
- **Pull Requests** to `main` or `develop`

### CI Workflow File

`.github/workflows/ci.yml`

### Phases

#### 1. Code Quality (Lint)

```yaml
- Checkout code
- Setup Node.js 22.x
- Setup pnpm 9.15.4
- Install dependencies
- Run ESLint
- Check Prettier formatting
```

**Success Criteria:**
- No ESLint errors
- Code matches Prettier rules

**Estimated Time:** 2-3 minutes

#### 2. Type Safety (TypeCheck)

```yaml
- Checkout code
- Setup Node.js
- Install dependencies
- Run TypeScript compiler (tsc --noEmit)
```

**Success Criteria:**
- No TypeScript errors across all workspaces

**Estimated Time:** 2-3 minutes

#### 3. Unit Tests

```yaml
- Start PostgreSQL service (test database)
- Start Redis service
- Checkout code
- Install dependencies
- Run Vitest tests
- Generate coverage report
- Upload coverage to Codecov
```

**Success Criteria:**
- All tests pass
- Coverage ≥75% (target, not enforced)

**Estimated Time:** 5-8 minutes

#### 4. Build Validation

```yaml
- Install dependencies
- Build all packages (pnpm build)
- Verify build artifacts exist
```

**Success Criteria:**
- All packages build successfully
- No build warnings

**Estimated Time:** 4-6 minutes

#### 5. Docker Build Test

```yaml
Matrix Strategy:
  - Build frontend image
  - Build CMS image
  - Build admin image

- Set up Docker Buildx
- Cache Docker layers
- Build image (without push)
- Verify image creation
```

**Success Criteria:**
- All Docker images build successfully
- No Docker build errors

**Estimated Time:** 10-15 minutes (parallel execution)

#### 6. Infrastructure Tests

```yaml
- Start docker-compose.test.yml
- Wait for services to be healthy
- Run docker-health.test.sh
- Run smoke-test.sh
- Show logs on failure
- Cleanup
```

**Success Criteria:**
- All services start successfully
- Health checks pass
- Smoke tests pass

**Estimated Time:** 5-8 minutes

### CI Status Check

Final job that aggregates all previous jobs:

```yaml
- Check all job statuses
- Exit 0 if all passed
- Exit 1 if any failed
- Report failure to GitHub
```

### Viewing CI Results

**GitHub UI:**
1. Go to repository
2. Click "Actions" tab
3. Select workflow run
4. View job results

**Status Badges:**

Add to README.md:

```markdown
![CI Status](https://github.com/your-org/cepcomunicacion/workflows/Continuous%20Integration/badge.svg)
```

---

## Continuous Deployment (CD)

### Deployment Strategy

**Manual Deployment Only** - No automatic deployments to production.

### Trigger Method

1. Go to GitHub Actions
2. Select "Deploy to Production" workflow
3. Click "Run workflow"
4. Type "DEPLOY" in confirmation field
5. Click "Run workflow" button

### Deployment Workflow File

`.github/workflows/deploy-production.yml`

### Required GitHub Secrets

Configure in: `Settings > Secrets and variables > Actions`

```yaml
SSH_PRIVATE_KEY:     # SSH key for Hetzner server
SERVER_HOST:         # 46.62.222.138
SERVER_USER:         # root
```

### Deployment Phases

#### Phase 1: Validation

- Verify "DEPLOY" confirmation text
- Check branch (warn if not main)
- Log deployer's username

#### Phase 2: Pre-Deployment Tests

- Run full CI suite again (safety check)
- Ensure all tests pass before deployment

**Can skip with:** `skip_tests: true` (NOT RECOMMENDED)

#### Phase 3: Build Production Images

```yaml
Matrix Strategy:
  - frontend
  - cms
  - admin
  - worker

For each service:
  - Build Docker image
  - Tag with: SHA, latest, branch name
  - Push to GitHub Container Registry
  - Cache layers for next build
```

**Image Tags:**

```
ghcr.io/your-org/cepcomunicacion/frontend:20251110-123456-abc1234
ghcr.io/your-org/cepcomunicacion/frontend:latest
ghcr.io/your-org/cepcomunicacion/frontend:main
```

#### Phase 4: Deploy to Production

```bash
# SSH to server
ssh -i ~/.ssh/deploy_key root@46.62.222.138

# Pre-deployment backup
pg_dump cepcomunicacion | gzip > backup-$(date).sql.gz
cp .env .env.backup-$(date)

# Transfer deployment files
scp deployment.tar.gz root@46.62.222.138:/tmp/

# Pull new images
docker compose pull

# Stop services gracefully (existing connections finish)
docker compose stop

# Start with new images
docker compose up -d

# Wait for services to be healthy
sleep 10
docker compose ps
```

#### Phase 5: Post-Deployment Verification

```bash
# Run smoke tests on production
bash infra/tests/smoke-test.sh http://46.62.222.138

# Verify endpoints
curl -f http://46.62.222.138/           # Frontend
curl -f http://46.62.222.138/api/health # API
curl -f http://46.62.222.138/admin      # Admin

# Check service logs for errors
docker compose logs --tail=50
```

---

## Branch Strategy

### Branch Model

```
main
  ├─ develop
  │    ├─ feature/add-course-filtering
  │    ├─ feature/improve-lead-capture
  │    └─ bugfix/fix-date-format
  └─ hotfix/critical-security-patch
```

### Branch Rules

**main (production)**
- Protected branch
- Requires PR approval
- All CI checks must pass
- Only deployable commits
- Tagged releases (v2.0.0, v2.1.0)

**develop (staging)**
- Integration branch
- All features merge here first
- Deployed to staging environment
- CI runs on every push

**feature/\* (development)**
- Created from `develop`
- Naming: `feature/short-description`
- Merged to `develop` via PR
- Deleted after merge

**hotfix/\* (emergency)**
- Created from `main`
- For critical production issues
- Merged to both `main` and `develop`
- Immediate deployment

### Git Workflow

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/add-newsletter-signup

# Make changes, commit frequently
git add .
git commit -m "feat: add newsletter subscription form"

# Push and create PR
git push origin feature/add-newsletter-signup
# Create PR on GitHub: feature/add-newsletter-signup → develop

# After PR approval and merge
git checkout develop
git pull origin develop
git branch -d feature/add-newsletter-signup
```

---

## Deployment Process

### Step-by-Step Production Deployment

#### 1. Pre-Deployment Checklist

- [ ] All tests passing on main branch
- [ ] Code review completed
- [ ] CHANGELOG.md updated
- [ ] Database migrations tested
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled (if needed)

#### 2. Trigger Deployment

```bash
# Via GitHub UI
1. Go to Actions tab
2. Select "Deploy to Production"
3. Click "Run workflow"
4. Branch: main
5. Type: DEPLOY
6. Click "Run workflow"
```

#### 3. Monitor Deployment

Watch the workflow execution:

- Phase 1: Validation (30 seconds)
- Phase 2: Pre-deployment tests (5-10 minutes)
- Phase 3: Build images (10-15 minutes)
- Phase 4: Deploy to server (3-5 minutes)
- Phase 5: Post-deployment verification (2-3 minutes)

**Total Time:** 20-30 minutes

#### 4. Post-Deployment Verification

```bash
# Manual verification
curl -I http://46.62.222.138/
curl -I http://46.62.222.138/api/health
curl -I http://46.62.222.138/admin

# Check application
1. Open frontend in browser
2. Test critical user flows
3. Check admin dashboard
4. Verify no console errors

# Monitor logs
ssh root@46.62.222.138
cd /opt/cepcomunicacion
docker compose logs -f --tail=100
```

#### 5. Update Documentation

- [ ] Update CHANGELOG.md with deployment notes
- [ ] Tag release in Git
- [ ] Notify team of successful deployment
- [ ] Update status page (if applicable)

---

## Rollback Procedures

### Automatic Rollback

If smoke tests fail, rollback happens automatically:

```bash
1. Restore previous .env.backup-*
2. Stop current services
3. Start previous version
4. Verify services are running
5. Send notification
```

### Manual Rollback

If issues are discovered after deployment:

```bash
# SSH to production server
ssh root@46.62.222.138
cd /opt/cepcomunicacion

# Find previous backup
ls -lt .env.backup-*
ls -lt /backups/pre-deploy-backup-*

# Restore configuration
cp .env.backup-20251110-120000 .env

# Restart services
docker compose down
docker compose up -d

# Verify
docker compose ps
bash infra/tests/smoke-test.sh http://localhost
```

### Database Rollback

```bash
# List available backups
ls -lh /backups/

# Restore from backup
gunzip -c /backups/pre-deploy-backup-20251110.sql.gz | \
  docker exec -i cep-postgres psql -U cepadmin -d cepcomunicacion
```

---

## Monitoring and Alerts

### Deployment Notifications

Deployment status is reported in:

- GitHub Actions summary
- Commit comments (if from PR)
- Slack/Discord (if configured)

### Metrics to Monitor

**Application Metrics:**
- Response times
- Error rates
- Active users
- API call rates

**Infrastructure Metrics:**
- CPU usage
- Memory usage
- Disk space
- Network traffic

**Business Metrics:**
- Conversion rates
- Lead submissions
- Email opens
- Campaign performance

---

## Troubleshooting

### CI Pipeline Failures

#### Lint Errors

```bash
# Fix locally
pnpm lint:fix
git add .
git commit -m "fix: resolve linting issues"
git push
```

#### Type Errors

```bash
# Check locally
pnpm typecheck

# Fix type errors
# Re-run typecheck until clean
```

#### Test Failures

```bash
# Run tests locally
pnpm test:watch

# Debug specific test
pnpm test -- path/to/test.spec.ts
```

#### Docker Build Failures

```bash
# Test locally
docker build -f infra/docker/Dockerfile.frontend .

# Check Dockerfile syntax
# Verify all COPY paths exist
```

### Deployment Failures

#### SSH Connection Failed

```bash
# Verify SSH key is correct
# Check server is reachable
ping 46.62.222.138

# Test SSH manually
ssh root@46.62.222.138
```

#### Docker Image Pull Failed

```bash
# Check registry credentials
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin

# Verify image exists
docker pull ghcr.io/your-org/cepcomunicacion/frontend:latest
```

#### Services Won't Start

```bash
# SSH to server
ssh root@46.62.222.138
cd /opt/cepcomunicacion

# Check logs
docker compose logs --tail=100

# Check individual service
docker compose logs frontend
docker compose logs cms
docker compose logs postgres
```

---

## Best Practices

### Development

1. Run tests locally before pushing
2. Keep commits small and focused
3. Write meaningful commit messages
4. Always create PRs, never push to main
5. Request code review from peers

### Deployment

1. Deploy during low-traffic periods
2. Monitor for 15 minutes post-deployment
3. Keep communication channels open
4. Have rollback plan ready
5. Document any issues encountered

### Security

1. Never commit secrets to Git
2. Rotate SSH keys regularly
3. Use GitHub secrets for sensitive data
4. Enable 2FA on GitHub accounts
5. Review dependency updates

---

**Last Updated:** 2025-11-10
**Maintained by:** SOLARIA AGENCY DevOps Team
