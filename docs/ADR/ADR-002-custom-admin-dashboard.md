# ADR-002: Implementar Custom Admin Dashboard

**Date**: 2025-11-04
**Status**: ✅ Accepted
**Deciders**: CTO, Development Team
**Consulted**: SOLARIA Methodology, Payload CMS Team

---

## Context

Payload CMS 3.62.1 presenta incompatibilidad crítica con Next.js 15.2.3 en el admin UI:

**Error**:
```
TypeError: Cannot destructure property 'config' of 'G(...)' as it is undefined
```

**Root Cause**:
- Payload 3.62.1 requiere Next.js ≥15.2.3 (peer dependency)
- Next.js 15.2.3 + React 19.2.0 tienen bug en React Server Components
- Admin UI de Payload falla al importar config en páginas RSC
- API REST de Payload funciona perfectamente

**Intentos de Solución** (20+ iteraciones):
1. ❌ Rebuild completo de Next.js
2. ❌ Downgrade a Next.js 15.1.6 (error persiste)
3. ❌ Downgrade a React 18.3.1 (conflicto de peer dependencies)
4. ❌ Modificación de payload.config.ts export pattern
5. ❌ Regeneración de import map de Payload

**Conclusión**: Bug estructural de Payload 3.62.1, no solucionable sin downgrade completo a Payload 2.x (EOL próximo).

---

## Decision

**Implementar Custom Admin Dashboard** usando Next.js + React que consume la API REST de Payload.

### Arquitectura Elegida

```
apps/
├── cms/          # Payload CMS (Backend API) ✅ Funcional
├── web/          # Frontend público (React+Vite) ✅ Funcional
└── admin/        # 🆕 Custom Admin Dashboard (Next.js)
                  #     - Consume API de Payload
                  #     - UI adaptada 100% a CEP
                  #     - Sin dependencia del admin UI de Payload
```

### Stack Técnico

**Frontend Dashboard**:
- Next.js 15.2.3 (App Router)
- React 19.2.0
- TailwindCSS 4.x
- shadcn/ui (component library)
- TanStack Query (API caching)
- React Hook Form + Zod (forms & validation)

**Backend** (sin cambios):
- Payload CMS API (REST)
- PostgreSQL 16.10
- Authentication: JWT tokens

---

## Consequences

### ✅ Positive

1. **Control Total del UX**
   - Diseño adaptado 100% a flujos de CEP
   - Calendario integrado de convocatorias
   - Dashboard analytics personalizado
   - Workflow optimizado para gestores del centro

2. **Independencia de Payload UI**
   - No bloqueados por bugs de Payload admin
   - Actualizaciones de Payload no afectan dashboard
   - API de Payload es estable (v3.x → v4.x mantiene compatibilidad)

3. **Performance Mejorado**
   - TanStack Query: cache inteligente, offline support
   - Optimistic updates
   - Lazy loading de módulos
   - Lighthouse score objetivo: ≥90

4. **Escalabilidad**
   - Fácil agregar módulos custom (ej: chat interno, sistema de notificaciones)
   - Integraciones con servicios externos
   - Reportes avanzados y analytics

5. **SOLARIA Methodology Compliant**
   - Spec-driven development (especificación completa)
   - TDD: tests antes de implementación
   - Zero technical debt
   - Quality gates estrictos

### ⚠️ Negative

1. **Desarrollo Inicial**
   - Estimación: 6 semanas (vs esperar fix de Payload = tiempo incierto)
   - Esfuerzo: ~240 horas de desarrollo

2. **Mantenimiento**
   - Dashboard custom requiere mantenimiento propio
   - Actualizaciones de API de Payload requieren ajustes
   - **Mitigación**: API de Payload es backward compatible, breaking changes mínimos

3. **Curva de Aprendizaje**
   - Equipo debe conocer tanto Payload API como dashboard custom
   - **Mitigación**: Documentación exhaustiva, API intuitiva

### 🔄 Neutral

1. **Sin Payload Admin UI**
   - Ya no disponible, no es una pérdida adicional
   - Custom dashboard reemplaza 100% funcionalidad

2. **Costos de Desarrollo**
   - Inversión inicial alta, pero ROI positivo a medio plazo
   - Dashboard adaptado > Payload admin genérico

---

## Alternatives Considered

### Alternative 1: Esperar Fix de Payload
**Descripción**: Continuar con admin UI roto, esperar actualización de Payload que resuelva incompatibilidad.

**Pros**:
- Sin esfuerzo de desarrollo
- Eventual solución automática

**Cons**:
- ❌ Timing incierto (podría ser semanas/meses)
- ❌ Bloquea trabajo de gestores del centro
- ❌ No hay garantía de fix (Payload podría priorizar v4.x)

**Decisión**: ❌ Rechazado (inviable para producción)

---

### Alternative 2: Downgrade a Payload 2.x
**Descripción**: Volver a Payload 2.x (última versión estable sin Next.js).

**Pros**:
- Payload admin UI funcional
- Sin necesidad de desarrollo custom

**Cons**:
- ❌ Payload 2.x End-of-Life próximo (2025-Q2 estimado)
- ❌ Rehacer migraciones completas (27 tablas)
- ❌ Perder features de Payload 3.x (lexical editor, mejor performance)
- ❌ Esfuerzo: ~40 horas de migración
- ❌ Deuda técnica futura (forzados a migrar a 3.x o 4.x)

**Decisión**: ❌ Rechazado (crea más deuda técnica)

---

### Alternative 3: Custom Admin Dashboard (ELEGIDA)
**Descripción**: Implementar dashboard Next.js custom consumiendo API de Payload.

**Pros**:
- ✅ Control total del UX/UI
- ✅ Adaptado 100% a CEP
- ✅ Independiente de Payload UI
- ✅ Escalable y mantenible
- ✅ SOLARIA methodology compliant

**Cons**:
- ⚠️ Desarrollo inicial: 6 semanas
- ⚠️ Mantenimiento custom

**Decisión**: ✅ **ACEPTADO** (máximo ROI a medio/largo plazo)

---

### Alternative 4: Headless CMS Alternativo (Strapi, Directus)
**Descripción**: Migrar a otro CMS headless.

**Pros**:
- Admin UI funcional de serie

**Cons**:
- ❌ Migración completa (120+ horas estimadas)
- ❌ Reaprender CMS diferente
- ❌ Reimplementar 13 colecciones
- ❌ Configurar RBAC desde cero
- ❌ Payload API es superior en features

**Decisión**: ❌ Rechazado (esfuerzo desproporcionado)

---

## Implementation Plan

### Phase 1: Setup & Auth (Semana 1)
**Objetivo**: Estructura base + login funcional

**Tasks**:
- [ ] Crear `apps/admin/` con Next.js 15.2.3
- [ ] Configurar TailwindCSS + shadcn/ui
- [ ] Implementar login (POST /api/users/login)
- [ ] JWT token storage (httpOnly cookie)
- [ ] Middleware de autenticación
- [ ] Layout base (Sidebar + Header)
- [ ] Protección de rutas por rol

**Tests**:
- [ ] Login flow E2E (Playwright)
- [ ] Token refresh automático
- [ ] Logout y limpieza de sesión
- [ ] Redirección si no autenticado

**Deliverables**:
- Dashboard accesible en `http://46.62.222.138/dashboard`
- Login funcional con credenciales de Payload
- Roles RBAC funcionando

---

### Phase 2: Módulos Core (Semanas 2-3)

#### Semana 2: Cursos & Convocatorias
**Tasks**:
- [ ] Dashboard principal (KPIs + widgets)
- [ ] Gestión de Cursos (CRUD completo)
  - Lista con filtros (tabla)
  - Formulario crear/editar
  - Vista detalle
- [ ] Gestión de Convocatorias
  - Lista + calendario
  - CRUD completo

**Tests**:
- [ ] CRUD cursos E2E
- [ ] Filtros y búsqueda
- [ ] Validación de formularios (Zod)

#### Semana 3: Estudiantes & Inscripciones
**Tasks**:
- [ ] Gestión de Estudiantes
  - Lista con búsqueda avanzada
  - CRUD completo (15+ campos PII)
  - Historial académico
- [ ] Gestión de Inscripciones
  - CRUD + workflow de estados
  - Gestión de pagos
  - Emisión de certificados

**Tests**:
- [ ] CRUD estudiantes E2E
- [ ] GDPR compliance (export/delete)
- [ ] Workflow de inscripciones

---

### Phase 3: Módulos Secundarios (Semana 4)
**Tasks**:
- [ ] Gestión de Leads
- [ ] Gestión de Campañas (analytics)
- [ ] Sedes y Ciclos (CRUD)

**Tests**:
- [ ] Lead assignment flow
- [ ] Campaign analytics cálculo
- [ ] Sedes CRUD

---

### Phase 4: Content & Advanced (Semana 5)
**Tasks**:
- [ ] Blog posts (rich text editor)
- [ ] FAQs (ordenación drag & drop)
- [ ] Calendario integrado de convocatorias
- [ ] Reportes y exportación (CSV/PDF)

**Tests**:
- [ ] Rich text editor
- [ ] Export functionality
- [ ] Calendario navegación

---

### Phase 5: Polish & Deploy (Semana 6)
**Tasks**:
- [ ] Optimización de performance
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Security hardening
- [ ] Complete test suite (≥75% coverage)
- [ ] Deploy a producción

**Tests**:
- [ ] Lighthouse score ≥90
- [ ] E2E tests completos
- [ ] Load testing (50 usuarios concurrentes)

**Quality Gates**:
- ✅ Tests passing: 100%
- ✅ Coverage: ≥75%
- ✅ TypeScript errors: 0
- ✅ Lighthouse: ≥90
- ✅ WCAG 2.1 AA compliance

---

## Monitoring & Success Criteria

### KPIs Técnicos
- **Performance**: Lighthouse score ≥90, FCP <1.5s, TTI <3s
- **Quality**: Test coverage ≥75%, 0 TypeScript errors
- **Security**: HTTPS, JWT httpOnly, CSRF protection, Rate limiting

### KPIs de Negocio
- **Adopción**: 100% de gestores usando dashboard (vs 0% con Payload admin roto)
- **Eficiencia**: Reducción ≥30% en tiempo de tareas administrativas
- **Satisfacción**: NPS ≥8/10 de gestores del centro

### Timeline de Éxito
- **Week 1**: Login funcional ✅
- **Week 3**: Módulos core operativos ✅
- **Week 6**: Dashboard completo en producción ✅

---

## Risks & Mitigation

### Risk 1: Payload API Changes
**Probabilidad**: Media
**Impacto**: Medio
**Mitigación**:
- Usar versionado de API (si disponible)
- Tests E2E detectan breaking changes
- Monitorear changelog de Payload releases

### Risk 2: Timeline Overrun
**Probabilidad**: Media
**Impacto**: Bajo
**Mitigación**:
- Metodología SOLARIA: TDD reduce rework
- MVP en Phase 1-2 (gestión de cursos/estudiantes)
- Fases 3-5 son nice-to-have, no críticas

### Risk 3: Security Vulnerabilities
**Probabilidad**: Baja
**Impacto**: Alto
**Mitigación**:
- Security audit en Phase 5
- OWASP Top 10 checklist
- Payload API ya tiene seguridad robusta (JWT, RBAC)

---

## References

- Payload CMS v3 API Docs: https://payloadcms.com/docs/rest-api/overview
- Next.js 15 App Router: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com/
- TanStack Query: https://tanstack.com/query/latest
- SOLARIA Methodology: `METODOLOGIA SOLARIA/DESARROLLO_METODOLOGIA_SOLARIA.md`

---

## Notes

### Lessons Learned (from 20+ debugging iterations)

1. **Payload 3.x Admin UI** tiene dependencias frágiles con Next.js
2. **API-first approach** es más resiliente que depender de admin UI
3. **Custom dashboards** ofrecen mejor UX que UIs genéricos
4. **TDD methodology** (SOLARIA) evita rework masivo

### Future Considerations

- Cuando Payload 4.x salga, evaluar si admin UI mejoró
- Si admin UI de Payload se arregla, mantener custom dashboard (mejor UX)
- Custom dashboard puede evolucionar a "CEP Platform" con features adicionales

---

**Decision Made**: 2025-11-04
**Approved By**: CTO
**Implementation Start**: 2025-11-04 (Phase 1)
**Expected Completion**: 2025-12-16 (6 weeks)

---

## Appendix A: Technical Debt Created

**None**.

Esta decisión **elimina** deuda técnica existente:
- ❌ **Antes**: Admin UI roto, bloqueando gestión de contenido
- ✅ **Después**: Dashboard funcional, testeable, mantenible

---

## Appendix B: Cost-Benefit Analysis

### Costs
- Desarrollo inicial: ~240 horas (6 semanas × 40h)
- Mantenimiento anual: ~40 horas

### Benefits
- **Año 1**: Desbloqu administración de contenido (ROI inmediato)
- **Año 2+**: Eficiencia mejorada (30% reducción tiempo admin)
- **Largo plazo**: Dashboard adaptado > Payload admin genérico

**ROI**: Positivo desde Año 1

---

**Status**: ✅ ACCEPTED AND IN PROGRESS
