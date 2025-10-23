# Next Session Preparation Guide
## Strapi 4.x Migration - Phase 1, Day 1

**Session Goal:** Install and configure Strapi 4.x (Foundation)
**Estimated Duration:** 1.5 - 2 hours
**Prerequisites:** This guide

---

## 📚 DOCUMENTS TO READ BEFORE SESSION

### Priority 1: MUST READ (30-40 minutes)

**1. STRAPI_MIGRATION_PLAN.md** (Focus on Phase 1)
- **Location:** `/STRAPI_MIGRATION_PLAN.md`
- **What to read:** Lines 1-500 (Executive Summary + Phase 1)
- **Why:** Understand Day 1 tasks and deliverables
- **Key sections:**
  - Executive Summary
  - Phase 1: Foundation (Days 1-5)
  - Day 1 tasks specifically

**2. SESSION_SUMMARY_2025-10-23.md** (This session recap)
- **Location:** `/SESSION_SUMMARY_2025-10-23.md`
- **What to read:** Full document (18,000 lines, but skim-readable)
- **Why:** Understand what was decided and why
- **Key sections:**
  - Key Achievements
  - Critical Decisions Made
  - Next Session Preparation

### Priority 2: SHOULD READ (20-30 minutes)

**3. ARCHITECTURE_DECISION_RECORD.md** (ADR-001)
- **Location:** `/ARCHITECTURE_DECISION_RECORD.md`
- **What to read:** Decision Rationale + Consequences sections
- **Why:** Understand why Strapi was chosen
- **Key sections:**
  - Decision Rationale (Why Strapi 4.x Won)
  - Consequences (Positive and Negative)
  - Migration Plan overview

### Priority 3: OPTIONAL (For deeper understanding)

**4. STACK_EVALUATION.md**
- **Location:** `/STACK_EVALUATION.md`
- **What to read:** Comparison Matrix + Final Recommendation
- **Why:** See all alternatives that were considered
- **Key sections:**
  - Comparison Matrix
  - Final Recommendation (Strapi 4.x)

---

## 🔑 CREDENTIALS & KEYS TO PREPARE

### 1. PostgreSQL Database Credentials

**What you need:**
```env
DATABASE_HOST=localhost          # or your server IP
DATABASE_PORT=5432               # default PostgreSQL port
DATABASE_NAME=cepcomunicacion    # database name
DATABASE_USERNAME=cepcomunicacion # database user
DATABASE_PASSWORD=<your-password> # secure password
```

**How to generate password (if needed):**
```bash
# Generate secure random password (20 characters)
node -e "console.log(require('crypto').randomBytes(15).toString('base64'))"
```

**Verify PostgreSQL is running:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres
# OR
psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "SELECT version();"
```

---

### 2. Strapi Security Keys (5 keys needed)

**Generate ALL 5 keys NOW:**
```bash
# Run this command 5 times to get 5 different keys
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Save them as:**
```env
APP_KEYS=key1,key2,key3,key4      # First 4 keys (comma-separated)
API_TOKEN_SALT=key5               # Fifth key
ADMIN_JWT_SECRET=key6             # Generate 6th
TRANSFER_TOKEN_SALT=key7          # Generate 7th
JWT_SECRET=key8                   # Generate 8th
```

**Actually, you need 8 keys total. Generate 8 now:**
```bash
# Copy this output for later
for i in {1..8}; do
  echo "KEY $i: $(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
done
```

---

### 3. AWS S3 Credentials (for file uploads)

**What you need:**
```env
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_ACCESS_SECRET=<your-secret-key>
AWS_REGION=eu-west-1              # or your preferred region
AWS_BUCKET_NAME=cepcomunicacion   # your S3 bucket name
```

**If you don't have S3 yet:**
- We can use local file storage for Day 1
- S3 configuration is Phase 7 (Day 15)
- For now, just note that we'll need it later

---

## 📋 PRE-SESSION CHECKLIST

### Environment Setup

- [ ] Node.js 22+ installed (`node --version`)
- [ ] pnpm 9+ installed (`pnpm --version`)
- [ ] PostgreSQL 16 running (Docker or native)
- [ ] Redis running (for BullMQ later)
- [ ] Git working directory clean
- [ ] Terminal ready in project root

### Documentation Ready

- [ ] STRAPI_MIGRATION_PLAN.md open in editor (Phase 1 section)
- [ ] SESSION_SUMMARY_2025-10-23.md read
- [ ] ARCHITECTURE_DECISION_RECORD.md skimmed
- [ ] This guide (NEXT_SESSION_GUIDE.md) reviewed

### Credentials Prepared

- [ ] PostgreSQL credentials available
- [ ] 8 secure keys generated and saved
- [ ] AWS S3 credentials noted (or decided to use local storage)
- [ ] .env template ready

### Mental Preparation

- [ ] Understand why we're migrating (Payload incompatibility)
- [ ] Understand what Strapi is (Express-based CMS)
- [ ] Understand Day 1 goal (get Strapi running)
- [ ] Ready to follow TDD methodology

---

## 🚀 DAY 1 OVERVIEW (Quick Reference)

### What We'll Do (1.5 hours total)

**Step 1: Install Strapi** (~15 min)
```bash
cd apps/cms
npx create-strapi-app@latest . --quickstart --no-run
```

**Step 2: Configure PostgreSQL** (~10 min)
- Edit `config/database.ts`
- Set environment variables

**Step 3: Configure TypeScript** (~5 min)
- Update `tsconfig.json` (strict mode)
- Verify compilation

**Step 4: Environment Variables** (~10 min)
- Create `.env` file
- Add all keys and credentials

**Step 5: Start Strapi** (~5 min)
```bash
pnpm develop
```

**Step 6: Create Admin User** (~5 min)
- Access http://localhost:1337/admin
- Create first admin account

**Step 7: Verify** (~5 min)
- Check PostgreSQL connection
- Verify admin UI works

**Contingency:** (~25 min buffer)
- Troubleshoot any issues
- Adjust configuration if needed

### Success Criteria (Day 1)

- ✅ Strapi 4.x installed and running
- ✅ PostgreSQL connected successfully
- ✅ TypeScript strict mode enabled
- ✅ Admin UI accessible at http://localhost:1337/admin
- ✅ Admin user created
- ✅ No TypeScript errors

---

## 🎯 SESSION OBJECTIVES

### Primary Goal
**Get Strapi 4.x running with PostgreSQL**

### Secondary Goals
- Understand Strapi architecture
- Verify TypeScript strict mode works
- Prepare for Day 2 (Users collection)

### Learning Objectives
- Strapi project structure
- Configuration patterns
- Database connection setup
- Environment variable management

---

## 💡 TIPS FOR SUCCESS

### During Session

1. **Follow the plan strictly**
   - STRAPI_MIGRATION_PLAN.md is your guide
   - Don't skip steps
   - Document any deviations

2. **Test incrementally**
   - After each configuration, test
   - Don't change multiple things at once
   - If something breaks, you know what caused it

3. **Document issues**
   - Note any errors encountered
   - Document solutions applied
   - Will help with future troubleshooting

4. **Ask questions**
   - If something is unclear, ask
   - Better to understand than to guess
   - Claude AI is here to help

### Common Pitfalls to Avoid

❌ **Don't:**
- Skip TypeScript strict mode configuration
- Use weak passwords or keys
- Ignore errors in logs
- Rush through configuration

✅ **Do:**
- Generate secure keys
- Test each step
- Read error messages carefully
- Follow TDD methodology

---

## 🔍 QUICK REFERENCE

### Important Commands

```bash
# Navigate to CMS directory
cd apps/cms

# Install Strapi
npx create-strapi-app@latest . --quickstart --no-run

# Install dependencies
pnpm install

# Start development server
pnpm develop

# Build for production
pnpm build

# Start production server
pnpm start

# Run TypeScript check
pnpm typecheck
```

### Important Files

```
apps/cms/
├── config/
│   ├── database.ts       # PostgreSQL configuration
│   ├── server.ts         # Server settings
│   └── plugins.ts        # Plugin configuration
├── src/
│   ├── api/              # API routes (collections will go here)
│   ├── extensions/       # Extend default functionality
│   └── index.ts          # Entry point
├── .env                  # Environment variables (CREATE THIS)
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

### Important URLs

```
Admin UI:    http://localhost:1337/admin
API Base:    http://localhost:1337/api
Health:      http://localhost:1337/_health
GraphQL:     http://localhost:1337/graphql (if enabled)
```

---

## 🎓 LEARNING RESOURCES

### Strapi Documentation

**Official Docs:**
- Main: https://docs.strapi.io/
- TypeScript: https://docs.strapi.io/dev-docs/typescript
- Database: https://docs.strapi.io/dev-docs/configurations/database
- Deployment: https://docs.strapi.io/dev-docs/deployment

**Key Concepts:**
- Content Types: https://docs.strapi.io/dev-docs/backend-customization/models
- Controllers: https://docs.strapi.io/dev-docs/backend-customization/controllers
- Services: https://docs.strapi.io/dev-docs/backend-customization/services
- Policies: https://docs.strapi.io/dev-docs/backend-customization/policies
- Middlewares: https://docs.strapi.io/dev-docs/backend-customization/middlewares

### TDD Resources

**Vitest (our testing framework):**
- Docs: https://vitest.dev/
- API: https://vitest.dev/api/

**Supertest (API testing):**
- Docs: https://github.com/ladjs/supertest
- Examples: https://github.com/ladjs/supertest#example

---

## 📞 NEED HELP?

### Before Session

**Questions about:**
- Documentation → Re-read relevant sections
- Credentials → Generate using commands above
- Environment → Verify Node.js, PostgreSQL, pnpm versions

### During Session

**If stuck:**
1. Check error message carefully
2. Consult STRAPI_MIGRATION_PLAN.md
3. Ask Claude AI (I'm here to help!)
4. Check Strapi documentation
5. Google specific error (with "Strapi 4" in query)

### After Session

**Document:**
- What worked well
- What was challenging
- Questions for next session
- Ideas for improvement

---

## ✅ FINAL CHECKLIST

### Right Now (Before Closing This Document)

- [ ] Read SESSION_SUMMARY_2025-10-23.md (at least skim)
- [ ] Read STRAPI_MIGRATION_PLAN.md Phase 1
- [ ] Generate 8 secure keys (save them somewhere safe)
- [ ] Verify PostgreSQL credentials
- [ ] Understand Day 1 objective (Strapi installation)

### Day of Session (Before Starting)

- [ ] Read this guide again (refresh memory)
- [ ] Have credentials ready (PostgreSQL, keys)
- [ ] Terminal open in project root
- [ ] Documentation open in editor
- [ ] Ready to start with `cd apps/cms`

### During Session

- [ ] Follow STRAPI_MIGRATION_PLAN.md strictly
- [ ] Test after each step
- [ ] Document any issues
- [ ] Ask questions if unclear

### End of Session

- [ ] Strapi running ✅
- [ ] PostgreSQL connected ✅
- [ ] Admin user created ✅
- [ ] Commit work
- [ ] Document progress

---

## 🎉 YOU'RE READY!

Everything is prepared for a smooth Day 1 session:

✅ **Documentation:** 25,000+ lines of specifications
✅ **Plan:** 8-phase migration plan with TDD
✅ **Decision:** ADR-001 approved
✅ **Stack:** Strapi 4.x selected
✅ **Timeline:** 20 days planned
✅ **Tests:** 200+ specified
✅ **Philosophy:** Zero technical debt

**Next Step:** Begin Day 1 (Strapi Installation)

**Estimated Time:** 1.5 - 2 hours

**Success Criteria:** Strapi running with PostgreSQL

---

## 💬 MOTIVATIONAL NOTE

> "We're not just migrating a CMS. We're building a solid foundation for 5+ years of sustainable development. Day 1 is the first brick in that foundation."

**Remember:**
- We chose Strapi after thorough evaluation
- We have a complete plan (15,000+ lines)
- We're following TDD methodology
- We're maintaining zero technical debt

**You've got this!** 🚀

---

**Document Status:** ✅ READY FOR USE
**Session:** Strapi Installation - Phase 1, Day 1
**Duration:** ~1.5 - 2 hours
**Prerequisite:** This guide + documentation reading

---

_Prepared by Claude AI (Anthropic)_
_SOLARIA AGENCY - Zero Technical Debt Philosophy_
_October 23, 2025_
