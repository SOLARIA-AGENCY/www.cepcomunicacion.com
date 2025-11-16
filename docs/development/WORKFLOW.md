# Development Workflow Guide

This document describes the development workflow for the CEPComunicacion v2 project, from feature development to production deployment.

## Table of Contents

- [Git Workflow](#git-workflow)
- [Feature Development](#feature-development)
- [Code Quality](#code-quality)
- [Pull Request Process](#pull-request-process)
- [Deployment Process](#deployment-process)
- [Hotfix Workflow](#hotfix-workflow)

## Git Workflow

We follow a **Trunk-Based Development** approach with short-lived feature branches.

### Branch Strategy

```
main (production)
  ├── develop (staging)
  │   ├── feature/add-course-filter
  │   ├── feature/meta-ads-integration
  │   └── fix/course-validation
  └── hotfix/critical-login-bug
```

### Branch Types

| Type | Pattern | Base | Description |
|------|---------|------|-------------|
| Feature | `feature/<description>` | `develop` | New features or enhancements |
| Fix | `fix/<description>` | `develop` | Bug fixes |
| Hotfix | `hotfix/<description>` | `main` | Critical production fixes |
| Release | `release/v<version>` | `develop` | Release preparation |
| Chore | `chore/<description>` | `develop` | Refactoring, deps updates |

### Naming Conventions

```bash
# Good branch names
feature/course-filter-by-modality
fix/lead-form-validation
hotfix/critical-database-connection
chore/update-dependencies
docs/improve-setup-guide

# Bad branch names
new-feature
bug-fix
carlos-branch
test
```

## Feature Development

### 1. Start New Feature

```bash
# Pull latest changes
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/course-filter

# Or use username prefix for team clarity
git checkout -b carlosjperez/feature/course-filter
```

### 2. Development Cycle

```bash
# Start local development environment
pnpm dev:docker:minimal

# Make changes, test locally
# ... code, test, repeat ...

# Commit frequently with clear messages
git add .
git commit -m "feat(courses): add filter by modality"

# Keep branch up-to-date
git fetch origin develop
git rebase origin/develop
```

### 3. Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring (no functionality change)
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Build process, dependencies, tooling
- `ci`: CI/CD configuration

#### Examples

```bash
# Feature
git commit -m "feat(courses): add modality filter to course list"

# Bug fix
git commit -m "fix(leads): validate phone number format"

# Breaking change
git commit -m "feat(api)!: change course endpoint structure

BREAKING CHANGE: Course API response format changed from flat to nested"

# Multiple changes
git commit -m "chore: update dependencies and fix linting issues

- Update Next.js to 15.2.4
- Fix ESLint warnings in admin dashboard
- Update TypeScript to 5.7.3"
```

## Code Quality

### Pre-Commit Checks

Husky runs automatically before each commit:

```bash
# Runs automatically on git commit
1. Lint staged files (ESLint)
2. Format code (Prettier)
3. Type check (TypeScript)
4. Run affected tests (Vitest)
```

### Manual Quality Checks

```bash
# Linting
pnpm lint              # Check for issues
pnpm lint:fix          # Auto-fix issues

# Formatting
pnpm format:check      # Check formatting
pnpm format            # Auto-format all files

# Type checking
pnpm typecheck         # Check TypeScript errors

# Testing
pnpm test              # Run all tests
pnpm test:coverage     # With coverage report
pnpm test:cms          # Specific workspace

# Build test
pnpm build             # Ensure production build works
```

### Quality Standards

All code must meet these standards before PR approval:

- **Linting**: 0 ESLint errors or warnings
- **Formatting**: 100% Prettier compliant
- **Type Safety**: 0 TypeScript errors
- **Tests**: All tests passing, coverage ≥75%
- **Build**: Production build succeeds
- **Security**: No high/critical vulnerabilities

## Pull Request Process

### 1. Prepare Pull Request

```bash
# Ensure branch is up-to-date
git checkout develop
git pull origin develop
git checkout feature/course-filter
git rebase origin/develop

# Run quality checks locally
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Push to remote
git push origin feature/course-filter
```

### 2. Create Pull Request

Use the GitHub UI or CLI:

```bash
# Using GitHub CLI (recommended)
gh pr create \
  --title "feat(courses): add modality filter" \
  --body "Closes #123

## Summary
- Adds dropdown filter for course modality (Presencial, Semipresencial, Telemático)
- Filters courses in real-time on selection
- Persists filter state in URL query params

## Test Plan
- [x] Unit tests for filter logic
- [x] Integration test with API
- [x] Manual testing on all modalities
- [x] Responsive design verified

## Screenshots
![Filter UI](https://...)

## Breaking Changes
None" \
  --base develop \
  --assignee @me \
  --label "feature"
```

### 3. Pull Request Template

Include in PR description:

```markdown
## Summary
Brief description of changes (3-5 bullet points)

## Related Issue
Closes #123

## Type of Change
- [ ] New feature (non-breaking)
- [ ] Bug fix (non-breaking)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Test Plan
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] E2E tests added/updated (if applicable)

## Screenshots (if UI changes)
Before: ...
After: ...

## Checklist
- [ ] Code follows project style guide
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Tests passing locally
- [ ] Dependent PRs merged (if any)

## Breaking Changes
List any breaking changes or "None"

## Migration Guide (if breaking)
Steps to migrate from old to new version
```

### 4. Code Review Process

#### For Authors

1. **Self-review first** - Review your own PR before requesting review
2. **Request reviewers** - Tag 1-2 team members
3. **Address feedback** - Respond to all comments
4. **Keep updated** - Rebase if develop advances
5. **Notify when ready** - Comment when review feedback is addressed

#### For Reviewers

Review checklist:

- [ ] Code quality and readability
- [ ] Follows project conventions
- [ ] No unnecessary complexity
- [ ] Tests are comprehensive
- [ ] Documentation is clear
- [ ] No security vulnerabilities
- [ ] Performance considerations
- [ ] Backward compatibility (if applicable)

#### Review Comments

```markdown
# Requesting changes
**MUST FIX**: This breaks backward compatibility. Needs migration guide.

# Suggestions
**NIT**: Consider extracting this into a separate function for reusability.

# Approval
LGTM! Great work on the test coverage.
```

### 5. CI/CD Checks

All PRs must pass automated checks:

1. **Linting & Formatting** (1 min)
   - ESLint
   - Prettier
   - TypeScript compilation

2. **Unit Tests** (2-3 min)
   - All tests passing
   - Coverage ≥75%

3. **Build Test** (3-5 min)
   - Docker image builds successfully
   - No build warnings

4. **Integration Tests** (5-7 min)
   - API endpoint tests
   - Database integration

5. **Security Scan** (2-3 min)
   - npm audit
   - Trivy container scan
   - Snyk (if configured)

### 6. Merge Strategies

**Squash and Merge** (preferred)

```bash
# Squashes all commits into one clean commit
# Use for feature branches with many WIP commits
```

**Rebase and Merge** (for clean history)

```bash
# Preserves individual commits
# Use when commits are well-organized and meaningful
```

**Never use "Create a merge commit"** - Pollutes history

## Deployment Process

### Deployment Environments

| Environment | Branch | URL | Auto-Deploy | Purpose |
|-------------|--------|-----|-------------|---------|
| **Development** | `develop` | https://dev.cepcomunicacion.com | Yes | QA testing |
| **Staging** | `develop` | https://staging.cepcomunicacion.com | Yes | Pre-production |
| **Production** | `main` | https://cepcomunicacion.com | Manual | Live site |

### Staging Deployment (Automatic)

```bash
# 1. Merge PR to develop
gh pr merge <PR-NUMBER> --squash

# 2. GitHub Actions automatically:
#    - Builds Docker images
#    - Pushes to GitHub Container Registry
#    - Deploys to staging server
#    - Runs smoke tests
#    - Notifies team in Slack

# 3. Verify deployment
curl https://staging.cepcomunicacion.com/api/health
```

### Production Deployment (Manual)

```bash
# 1. Create release PR (develop → main)
gh pr create \
  --title "Release v2.3.0" \
  --body "$(cat CHANGELOG.md)" \
  --base main \
  --head develop \
  --label "release"

# 2. Get approvals from 2+ team members

# 3. Merge release PR
gh pr merge <PR-NUMBER> --squash

# 4. Create Git tag
git checkout main
git pull origin main
git tag -a v2.3.0 -m "Release v2.3.0 - Course filter feature"
git push origin v2.3.0

# 5. Manual deploy trigger via GitHub Actions
gh workflow run deploy-production.yml \
  --ref v2.3.0 \
  --field environment=production

# 6. Monitor deployment
gh run watch

# 7. Verify production
curl https://cepcomunicacion.com/api/health
pnpm test:e2e:production
```

### Rollback Procedure

```bash
# 1. Identify last working version
git tag -l

# 2. Trigger rollback deployment
gh workflow run deploy-production.yml \
  --ref v2.2.9 \
  --field environment=production

# 3. Verify rollback
curl https://cepcomunicacion.com/api/health

# 4. Investigate and fix issue
git checkout -b hotfix/critical-issue
# ... fix and test ...
git push origin hotfix/critical-issue

# 5. Emergency merge to main (skip normal PR process)
gh pr create --base main --title "hotfix: critical issue" --label "hotfix"
gh pr merge <PR-NUMBER> --admin --squash

# 6. Deploy hotfix
git tag -a v2.2.10 -m "Hotfix: Critical issue"
git push origin v2.2.10
gh workflow run deploy-production.yml --ref v2.2.10
```

## Hotfix Workflow

For critical production bugs requiring immediate fix:

```bash
# 1. Create hotfix branch from main (NOT develop)
git checkout main
git pull origin main
git checkout -b hotfix/critical-login-bug

# 2. Fix the issue
# ... implement fix ...

# 3. Test thoroughly
pnpm test
pnpm build

# 4. Create PR directly to main
gh pr create \
  --title "hotfix: fix critical login bug" \
  --body "Emergency fix for production login issue" \
  --base main \
  --label "hotfix" \
  --assignee @me

# 5. Get expedited review (1 approver minimum)

# 6. Merge and deploy immediately
gh pr merge <PR-NUMBER> --admin --squash
git tag -a v2.3.1 -m "Hotfix: Login bug"
git push origin v2.3.1
gh workflow run deploy-production.yml --ref v2.3.1

# 7. Backport to develop
git checkout develop
git pull origin develop
git cherry-pick <COMMIT-HASH>
git push origin develop
```

## Best Practices

### Do's

- ✅ Commit frequently with clear messages
- ✅ Keep PRs small and focused (< 400 lines)
- ✅ Write tests for all new features
- ✅ Update documentation with code changes
- ✅ Rebase on develop before creating PR
- ✅ Respond to PR feedback within 24 hours
- ✅ Delete merged branches

### Don'ts

- ❌ Don't commit directly to main or develop
- ❌ Don't merge your own PRs without review
- ❌ Don't skip tests or linting
- ❌ Don't push secrets or .env files
- ❌ Don't leave commented-out code
- ❌ Don't merge without CI passing
- ❌ Don't rewrite public branch history

## Tools

### GitHub CLI

```bash
# Install
brew install gh  # macOS
# or download from https://cli.github.com/

# Authenticate
gh auth login

# Common commands
gh pr create
gh pr list
gh pr view <NUMBER>
gh pr checkout <NUMBER>
gh pr merge <NUMBER>
gh pr diff <NUMBER>
gh pr review <NUMBER> --approve
gh pr review <NUMBER> --request-changes
```

### Git Aliases (Optional)

Add to `~/.gitconfig`:

```ini
[alias]
  st = status
  co = checkout
  br = branch
  ci = commit
  cp = cherry-pick
  lg = log --oneline --graph --decorate --all
  unstage = reset HEAD --
  last = log -1 HEAD
  amend = commit --amend --no-edit
  pushf = push --force-with-lease
  sync = !git fetch origin && git rebase origin/develop
```

## Support

- **Questions**: Team Slack/Discord
- **Bugs**: GitHub Issues
- **Documentation**: `/docs`
- **CI/CD Issues**: DevOps team
