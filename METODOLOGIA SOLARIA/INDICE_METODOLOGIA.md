# Índice Maestro: Metodología de Desarrollo SOLARIA

**Versión**: 1.0.0
**Última actualización**: 2025-10-28

---

## 📚 Guía de Navegación

Este índice te ayudará a encontrar exactamente lo que necesitas según tu objetivo.

---

## 🎯 Por Objetivo

### "Quiero entender qué es esta metodología"
**Comienza aquí** ⬇️
1. Leer: [`RESUMEN_EJECUTIVO_METODOLOGIA.md`](#resumen-ejecutivo) (15 min)
2. Revisar: Caso de éxito BRIK-64
3. Decidir: Si aplica a tu proyecto

### "Quiero implementar la metodología en mi proyecto"
**Ruta de implementación** ⬇️
1. Leer: [`README_METODOLOGIA.md`](#readme-guía-de-uso) (20 min)
2. Seguir: Quick Start para tu stack
3. Copiar: Templates y estructura
4. Usar: [`PROMPT_INTEGRACION_IA.md`](#prompt-de-integración) con tu IA

### "Quiero aprender los detalles técnicos"
**Estudio profundo** ⬇️
1. Leer: [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) (2 horas)
2. Estudiar: Patrones y Antipatrones
3. Revisar: ADRs del proyecto BRIK-64
4. Practicar: En proyecto pequeño

### "Quiero presentar esto a mi equipo/cliente"
**Presentación profesional** ⬇️
1. Usar: [`RESUMEN_EJECUTIVO_METODOLOGIA.md`](#resumen-ejecutivo)
2. Mostrar: Métricas de BRIK-64
3. Destacar: ROI de 400%
4. Proponer: Proyecto pilot

---

## 📄 Documentos Principales

### 1. RESUMEN_EJECUTIVO_METODOLOGIA.md
**Para**: Stakeholders, managers, clientes
**Tiempo de lectura**: 15 minutos
**Contenido**:
- Propuesta de valor
- Caso de éxito BRIK-64
- ROI medido (400%)
- Métricas de calidad
- Modelo de costos
- Paquetes disponibles

**Cuándo usar**:
- Presentación a cliente
- Pitch a management
- Evaluación de adopción
- Propuesta comercial

### 2. DESARROLLO_METODOLOGIA_SOLARIA.md
**Para**: Developers, tech leads, architects
**Tiempo de lectura**: 2 horas (estudio completo)
**Contenido**:
- Filosofía de desarrollo completa
- 6 Patrones fundamentales (PAT-001 a PAT-006)
- 6 Antipatrones identificados (ANTI-001 a ANTI-006)
- Sistema de 10 agentes especializados
- Workflow de desarrollo detallado
- Gestión de calidad
- Proceso de auditoría
- Decisiones arquitectónicas (ADRs)
- Integración con IA

**Cuándo usar**:
- Setup inicial de proyecto
- Onboarding de developer nuevo
- Referencia durante desarrollo
- Resolver dudas técnicas
- Crear nuevos patrones

### 3. PROMPT_INTEGRACION_IA.md
**Para**: Developers usando IA assistants
**Tiempo de lectura**: 30 minutos
**Contenido**:
- Prompt completo listo para copiar/pegar
- Reglas fundamentales (MANDATORY)
- Workflow por fase
- Antipatrones a evitar
- Quality gates
- Comportamiento ante errores
- Ejemplos de sesiones

**Cuándo usar**:
- **SIEMPRE** al inicio de proyecto con IA
- Al cambiar de IA assistant
- Cuando IA no sigue metodología
- Para recordar protocolos

**Cómo usar**:
1. Copiar prompt completo
2. Pegar en nueva conversación con IA
3. Decir: "Activa Metodología SOLARIA"
4. Confirmar activación
5. Comenzar desarrollo

### 4. README_METODOLOGIA.md
**Para**: Quick start y casos de uso
**Tiempo de lectura**: 30 minutos
**Contenido**:
- Introducción a la metodología
- Archivos incluidos (explicación)
- Cómo usar paso a paso
- Quick start por stack (Python, Rust, JavaScript)
- Casos de uso detallados
- FAQ

**Cuándo usar**:
- Primera vez usando metodología
- Setup de proyecto nuevo
- Migración de proyecto existente
- Resolver dudas de uso
- Casos específicos

### 5. INDICE_METODOLOGIA.md (este archivo)
**Para**: Navegación y referencia rápida
**Tiempo de lectura**: 10 minutos
**Contenido**:
- Guía de navegación por objetivo
- Descripción de todos los documentos
- Quick reference de conceptos clave
- Decisiones rápidas

**Cuándo usar**:
- Primera vez en la documentación
- No sé qué documento leer
- Referencia rápida de conceptos
- Encontrar respuesta rápida

---

## 🔑 Quick Reference

### Conceptos Clave

#### PAT-006: API Verification Protocol
**Qué es**: Protocolo MANDATORY antes de cualquier integración
**Cuándo**: Siempre que dependas de APIs externas
**Tiempo**: 20-30 min
**ROI**: 2+ horas ahorradas, 0 errores de especulación
**Documento**: [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Sección "Protocolo PAT-006"

#### ANTI-004: Speculation-Driven API Design
**Qué es**: Antipatrón crítico - asumir APIs sin verificar
**Consecuencia**: 39 errores de compilación (experiencia real)
**Solución**: Aplicar PAT-006
**Documento**: [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Sección "Antipatrones"

#### ADR (Architecture Decision Record)
**Qué es**: Documento de decisión arquitectónica crítica
**Cuándo crear**: Trade-offs importantes, decisiones mandatory
**Template**: En [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Sección "Decisiones Arquitectónicas"
**Ejemplos**: `docs/ADR/ADR-003-*.md`, `ADR-004-*.md`

#### Learning Log
**Qué es**: Log incremental de lecciones aprendidas
**Formato**: `.memory/learning_log.jsonl` (JSON Lines)
**Cuándo actualizar**: Al descubrir patrón/antipatrón/lección
**Documento**: [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Sección "Integración con IA"

#### Session Summary
**Qué es**: Resumen de sesión al finalizar fase
**Contenido**: Logros, métricas, aprendizajes, próximos pasos
**Cuándo crear**: Final de cada fase/milestone
**Template**: Ver `docs/RESUMEN_SESION_PHASE*.md` en proyecto
**Documento**: [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Sección "Workflow de Desarrollo"

---

## 🎓 Por Experiencia

### "Soy nuevo en desarrollo"
**Ruta sugerida** ⬇️
1. [`RESUMEN_EJECUTIVO_METODOLOGIA.md`](#resumen-ejecutivo) - Contexto general
2. [`README_METODOLOGIA.md`](#readme-guía-de-uso) - Quick start para tu stack
3. [`PROMPT_INTEGRACION_IA.md`](#prompt-de-integración) - Usar IA como mentor
4. Practicar en proyecto pequeño

**Por qué**: La metodología + IA te guiarán paso a paso

### "Soy developer experimentado"
**Ruta sugerida** ⬇️
1. [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Detalles técnicos
2. Revisar ADRs y patterns en proyecto BRIK-64
3. Aplicar en refactor de código legacy
4. Contribuir nuevos patrones

**Por qué**: Apreciarás los detalles formales y matemáticos

### "Soy tech lead / architect"
**Ruta sugerida** ⬇️
1. [`RESUMEN_EJECUTIVO_METODOLOGIA.md`](#resumen-ejecutivo) - Business case
2. [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Framework completo
3. Estudiar sistema de 10 agentes
4. Planear adopción en equipo

**Por qué**: Necesitas visión completa para liderar adopción

### "Soy manager / product owner"
**Ruta sugerida** ⬇️
1. [`RESUMEN_EJECUTIVO_METODOLOGIA.md`](#resumen-ejecutivo) - ROI y métricas
2. Caso de éxito BRIK-64
3. Modelo de costos
4. Proponer pilot project

**Por qué**: Necesitas justificar inversión con números

---

## 🛠️ Por Stack Tecnológico

### Python / FastAPI / Django
**Documentos relevantes**:
1. [`README_METODOLOGIA.md`](#readme-guía-de-uso) - Quick Start Python
2. [`PROMPT_INTEGRACION_IA.md`](#prompt-de-integración) - Adaptar comandos
3. [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - PAT-006 para dependencias

**Comandos adaptados**:
```python
# Tests:    pytest --cov
# Lint:     pylint src/
# Format:   black src/
# Type:     mypy src/
```

### Rust / Axum / Tokio
**Documentos relevantes**:
1. [`README_METODOLOGIA.md`](#readme-guía-de-uso) - Quick Start Rust
2. Proyecto BRIK-64 completo (ejemplo real)
3. [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Todos los patrones

**Comandos estándar**:
```rust
// Tests:    cargo test --all
// Lint:     cargo clippy -- -D warnings
// Format:   cargo fmt --check
// Build:    cargo build --release
```

### JavaScript / Node.js / React
**Documentos relevantes**:
1. [`README_METODOLOGIA.md`](#readme-guía-de-uso) - Quick Start JavaScript
2. [`PROMPT_INTEGRACION_IA.md`](#prompt-de-integración) - Adaptar para npm
3. [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Patrones universales

**Comandos adaptados**:
```javascript
// Tests:    npm test
// Lint:     npm run lint (eslint)
// Format:   npm run format (prettier)
// Build:    npm run build
```

---

## 📊 Por Tipo de Proyecto

### Proyecto Nuevo (Greenfield)
**Documentos**:
1. [`README_METODOLOGIA.md`](#readme-guía-de-uso) - Setup inicial
2. [`PROMPT_INTEGRACION_IA.md`](#prompt-de-integración) - Activar desde día 1
3. [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Referencia completa

**Ventaja**: 0 deuda técnica desde inicio

### Proyecto Legacy (Brownfield)
**Documentos**:
1. [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Proceso de auditoría
2. [`README_METODOLOGIA.md`](#readme-guía-de-uso) - Integración gradual
3. ADRs - Documentar decisiones de refactor

**Estrategia**: Aplicar a código nuevo, refactor incremental

### Integración / API Client
**Documentos**:
1. **MANDATORY**: PAT-006 en [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa)
2. [`PROMPT_INTEGRACION_IA.md`](#prompt-de-integración) - IA aplicará PAT-006
3. ADR-004 - Por qué PAT-006 es mandatory

**Critical**: PAT-006 ahorra 2+ horas y evita 30-50 errores

### Microservicios / Distributed
**Documentos**:
1. [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Sistema de agentes
2. PAT-006 para cada servicio
3. ADRs para decisiones de integración

**Beneficio**: Consistency across services

---

## 🚀 Decisiones Rápidas

### ¿Debo aplicar PAT-006?
```
¿Tu código depende de APIs externas?
  ├─ SÍ → PAT-006 MANDATORY
  └─ NO → Opcional (pero recomendado para consistency)
```
**Documento**: [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Protocolo PAT-006

### ¿Necesito crear ADR?
```
¿Es decisión arquitectónica crítica con trade-offs?
  ├─ SÍ → Crear ADR
  └─ NO → Session summary es suficiente
```
**Documento**: [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Decisiones Arquitectónicas

### ¿Cuándo hacer auditoría?
```
¿Fase completada con >10 errores?
  ├─ SÍ → Auditoría MANDATORY
  └─ NO → Auditoría opcional (recomendada)
```
**Documento**: [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Proceso de Auditoría

### ¿Cuál es el coverage mínimo?
```
Target: ≥75%
  ├─ < 75% → Agregar tests
  └─ ≥ 75% → OK, mantener
```
**Documento**: [`DESARROLLO_METODOLOGIA_SOLARIA.md`](#metodología-completa) - Gestión de Calidad

---

## 🔗 Enlaces a Recursos

### Proyecto BRIK-64 (Ejemplo Real)
- **GitHub**: https://github.com/NAZCAMEDIA/BRIK-64
- **Métricas**: 292 tests, 82% coverage, 0 technical debt
- **ADRs**: `docs/ADR/ADR-003-*.md`, `ADR-004-*.md`
- **Session Summaries**: `docs/RESUMEN_SESION_PHASE*.md`
- **Learning Log**: `.memory/learning_log.jsonl`

### SOLARIA AGENCY
- **Website**: https://www.solaria.agency
- **Email**: charlie@solaria.agency
- **Servicios**: Consultoría, Training, Auditoría

### Documentación Externa
- **Rust Book**: Rust best practices
- **SeL4 Paper**: Formal verification precedent
- **GitHub Actions**: CI/CD examples

---

## 📝 Checklist de Navegación

### Primera Vez Usando la Metodología
- [ ] Leí RESUMEN_EJECUTIVO_METODOLOGIA.md
- [ ] Decidí si aplica a mi proyecto
- [ ] Leí README_METODOLOGIA.md
- [ ] Copié PROMPT_INTEGRACION_IA.md
- [ ] Activé metodología con IA
- [ ] Setup estructura de directorios
- [ ] Creé CLAUDE.md para mi proyecto

### Durante el Desarrollo
- [ ] Apliqué PAT-006 (si integración)
- [ ] Creé spec document antes de código
- [ ] Tests passing antes de continuar
- [ ] Quality gates pasados
- [ ] Learning log actualizado

### Al Final de Fase
- [ ] Session summary creado
- [ ] Métricas documentadas
- [ ] ADR creado (si decisión crítica)
- [ ] Learning log actualizado
- [ ] Commit descriptivo
- [ ] PHASE_STATUS.md actualizado

---

## 🎯 Próximos Pasos Sugeridos

### Si eres nuevo aquí:
1. Leer: [`RESUMEN_EJECUTIVO_METODOLOGIA.md`](#resumen-ejecutivo) (15 min)
2. Decidir: ¿Aplica a mi proyecto?
3. Si SÍ → Leer: [`README_METODOLOGIA.md`](#readme-guía-de-uso)
4. Quick Start: Para tu stack
5. Activar: Metodología con IA

### Si ya decidiste adoptar:
1. Setup: Estructura de directorios
2. Copiar: Templates necesarios
3. Activar: [`PROMPT_INTEGRACION_IA.md`](#prompt-de-integración)
4. Comenzar: Primer proyecto/fase
5. Documentar: Aprendizajes propios

### Si quieres contribuir:
1. Usar: Metodología en tu proyecto
2. Documentar: Nuevos patrones/antipatrones
3. Actualizar: Learning log
4. Compartir: Con comunidad
5. Pull Request: Con mejoras

---

## 📞 Soporte

### ¿Dónde encontrar ayuda?

**Documentación**:
- Este índice (navegación)
- README_METODOLOGIA.md (FAQ)
- DESARROLLO_METODOLOGIA_SOLARIA.md (detalles técnicos)

**Ejemplos**:
- Proyecto BRIK-64 en GitHub
- ADRs del proyecto
- Session summaries

**Comunidad**:
- GitHub Discussions (próximamente)
- SOLARIA AGENCY (consultoría)

**Comercial**:
- Email: charlie@solaria.agency
- Website: https://www.solaria.agency

---

## 📚 Glosario Rápido

- **PAT-006**: API Verification Protocol (MANDATORY para integraciones)
- **ANTI-004**: Speculation-Driven API Design (antipatrón crítico)
- **ADR**: Architecture Decision Record
- **Learning Log**: `.memory/learning_log.jsonl` (lecciones aprendidas)
- **Session Summary**: Resumen al final de fase
- **Quality Gates**: Tests, lint, coverage, documentation
- **Technical Debt**: Código que necesita refactor (target: 0)
- **Coverage**: % de código cubierto por tests (target: ≥75%)
- **Spec-Driven**: Specification → Design → Implementation

---

**Última actualización**: 2025-10-28
**Versión**: 1.0.0
**Licencia**: MIT
**Autor**: SOLARIA AGENCY

---

*¿Listo para comenzar? → [`README_METODOLOGIA.md`](#readme-guía-de-uso)*
