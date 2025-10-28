# Metodología de Desarrollo SOLARIA - Guía de Uso

**Versión**: 1.0.0
**Fecha**: 2025-10-28
**Autor**: SOLARIA AGENCY

---

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Archivos Incluidos](#archivos-incluidos)
- [Cómo Usar Esta Metodología](#cómo-usar-esta-metodología)
- [Quick Start](#quick-start)
- [Casos de Uso](#casos-de-uso)
- [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

Esta metodología fue desarrollada y validada durante el desarrollo del proyecto **BRIK-64** (Digital Circuitality Framework), un proyecto complejo de ~20,000 líneas de código Rust con:

- ✅ 292 tests (100% passing)
- ✅ 82% code coverage
- ✅ 0 technical debt
- ✅ 0 speculation errors
- ✅ Arquitectura formal validada matemáticamente

**Resultado medible**: ~10 horas ahorradas en debugging, 0 errores de especulación después de aplicar los protocolos.

---

## Archivos Incluidos

### 1. `DESARROLLO_METODOLOGIA_SOLARIA.md`
**Qué es**: Documentación completa de la metodología
**Cuándo usar**: Como referencia general para entender la metodología
**Contenido**:
- Filosofía de desarrollo
- Patrones fundamentales (PAT-001 a PAT-006)
- Antipatrones identificados (ANTI-001 a ANTI-006)
- Sistema de 10 agentes especializados
- Workflow de desarrollo
- Gestión de calidad
- Proceso de auditoría
- ADRs críticos

### 2. `PROMPT_INTEGRACION_IA.md`
**Qué es**: Prompt listo para copiar/pegar en asistentes IA
**Cuándo usar**: Al inicio de CUALQUIER proyecto nuevo con IA
**Contenido**:
- Prompt completo para activar metodología
- Reglas fundamentales (MANDATORY)
- Workflow por fase
- Antipatrones a evitar
- Quality gates
- Comportamiento ante errores
- Ejemplo de sesión

### 3. `README_METODOLOGIA.md` (este archivo)
**Qué es**: Guía de uso de la metodología
**Cuándo usar**: Primera vez usando la metodología
**Contenido**:
- Instrucciones de uso
- Quick start
- Casos de uso
- FAQ

---

## Cómo Usar Esta Metodología

### Para Proyectos Nuevos

#### Paso 1: Setup Inicial
```bash
# 1. Copiar estructura de directorios
mkdir -p .memory docs/specs docs/ADR docs/audits

# 2. Crear archivos base
touch CLAUDE.md
touch PHASE_STATUS.md
touch .memory/learning_log.jsonl
```

#### Paso 2: Configurar CLAUDE.md
```markdown
# [Nombre del Proyecto]

## Descripción
[Qué hace este proyecto]

## Stack Tecnológico
- Lenguaje: [Python/Rust/JavaScript/etc.]
- Framework: [FastAPI/Axum/Express/etc.]
- Base de datos: [PostgreSQL/MongoDB/etc.]

## Estructura del Proyecto
[Árbol de directorios]

## Comandos de Desarrollo
# Build
[comando para compilar/build]

# Test
[comando para tests]

# Lint
[comando para linter]

## Metodología
Este proyecto sigue la **Metodología SOLARIA**:
- Cero deuda técnica
- PAT-006 mandatory para integraciones
- Spec-driven development
- Quality gates estrictos
```

#### Paso 3: Activar Metodología con IA
```
1. Abrir asistente IA (Claude, ChatGPT, etc.)
2. Copiar contenido completo de PROMPT_INTEGRACION_IA.md
3. Pegar en la conversación
4. Decir: "Activa Metodología SOLARIA"
5. Confirmar activación
```

#### Paso 4: Comenzar Desarrollo
```
Usuario: "Necesito implementar [feature]"

Asistente (esperado):
"Entendido. Siguiendo Metodología SOLARIA:
1. ¿Es integración con dependencias? → PAT-006
2. Crear spec document
3. Implementar con TDD
4. Quality checks
5. Documentation

¿Procedo?"
```

---

### Para Proyectos Existentes

#### Paso 1: Auditoría Inicial
```bash
# 1. Evaluar estado actual
[comando de tests]    # ¿Cuántos tests passing?
[comando de lint]     # ¿Cuántos warnings?
[comando de build]    # ¿Compila sin errores?

# 2. Medir coverage
[comando de coverage]  # ¿Qué % de cobertura?

# 3. Documentar deuda técnica
cat > docs/audits/initial_audit.md << 'EOF'
# Initial Audit

## Current State
- Tests: X passing / Y total
- Coverage: Z%
- Warnings: W
- Technical Debt: [High/Medium/Low]

## Action Plan
1. [ ] Reduce warnings to 0
2. [ ] Increase coverage to ≥75%
3. [ ] Document critical decisions
4. [ ] Setup PAT-006 for new features
EOF
```

#### Paso 2: Integrar Metodología Gradualmente
```
1. Nuevas features → Usar metodología completa
2. Bug fixes → Aplicar workflow de error fixing
3. Refactors → Documentar en ADRs
4. Integraciones → MANDATORY PAT-006
```

#### Paso 3: Reducir Deuda Técnica
```
Plan de 4 semanas:

Semana 1: Quality gates
- [ ] Setup linter
- [ ] Fix all warnings
- [ ] Format todo el código

Semana 2: Tests
- [ ] Agregar tests a código crítico
- [ ] Target: 50% coverage
- [ ] Fix failing tests

Semana 3: Documentation
- [ ] Crear CLAUDE.md
- [ ] Documentar ADRs críticos
- [ ] Setup .memory/

Semana 4: Proceso
- [ ] Activar metodología con IA
- [ ] Aplicar PAT-006 en nuevas features
- [ ] Target: 75% coverage
```

---

## Quick Start

### Caso 1: Proyecto Nuevo en Python

```bash
# 1. Setup
mkdir my_project && cd my_project
mkdir -p .memory docs/{specs,ADR,audits}
touch CLAUDE.md PHASE_STATUS.md .memory/learning_log.jsonl

# 2. CLAUDE.md
cat > CLAUDE.md << 'EOF'
# My Project

## Stack
- Python 3.11
- FastAPI
- PostgreSQL

## Commands
# Test: pytest --cov
# Lint: pylint src/
# Format: black src/
EOF

# 3. Setup Python
python -m venv venv
source venv/bin/activate
pip install fastapi pytest pytest-cov pylint black

# 4. Activar Metodología
# [Copiar PROMPT_INTEGRACION_IA.md en IA]
# "Activa Metodología SOLARIA"

# 5. Comenzar desarrollo
# "Implementa API REST con FastAPI"
```

### Caso 2: Proyecto Nuevo en Rust

```bash
# 1. Setup
cargo new my_project --bin
cd my_project
mkdir -p .memory docs/{specs,ADR,audits}

# 2. CLAUDE.md
cat > CLAUDE.md << 'EOF'
# My Project

## Stack
- Rust 1.70+
- Axum (API server)

## Commands
# Build: cargo build
# Test: cargo test
# Lint: cargo clippy -- -D warnings
# Format: cargo fmt --check
EOF

# 3. Workspace structure (si aplica)
# [Seguir PAT-001 para cargo workspace]

# 4. Activar Metodología
# [Copiar PROMPT_INTEGRACION_IA.md en IA]
# "Activa Metodología SOLARIA"
```

### Caso 3: Feature Nueva en Proyecto Existente

```bash
# 1. PAT-006 (si depende de otros módulos)
grep -r "^pub \|^def \|^export " src/*/lib.* > docs/api_inventory_feature_X.md

# 2. Spec document
cat > docs/specs/feature_X_spec.md << 'EOF'
# Feature X

## Objetivo
[Qué hace]

## APIs Necesarias
[De api_inventory_feature_X.md]

## Criterios de Éxito
- [ ] Tests passing
- [ ] Coverage ≥75%
- [ ] Documentation complete
EOF

# 3. Desarrollo con IA
# "Implementa Feature X siguiendo el spec"
# [IA aplicará PAT-006, creará tests, etc.]

# 4. Post-implementación
[run tests]
[run lint]
cat > docs/RESUMEN_SESION_FEATURE_X.md  # Session summary
```

---

## Casos de Uso

### Caso 1: Integración con API Externa

**Problema**: Necesito integrar con API de terceros
**Solución**:

```
1. PAT-006 MANDATORY
   - Leer documentación de API
   - Documentar endpoints disponibles
   - Crear api_inventory_external_api.md

2. Spec Document
   - Definir wrapper/adapter
   - Especificar error handling
   - Bounded interfaces

3. Implementation
   - Implementar adapter
   - Tests con mocks
   - Error handling completo

4. Documentation
   - ADR explicando decisiones
   - Ejemplos de uso
```

### Caso 2: Refactor Grande

**Problema**: Necesito refactorizar módulo crítico
**Solución**:

```
1. Pre-Refactor Audit
   - Documentar estado actual
   - Identificar technical debt
   - Definir objetivos claros

2. ADR
   - Crear ADR-XXX explicando:
     * Por qué refactor
     * Qué se cambiará
     * Alternativas consideradas

3. Refactor Incremental
   - Pequeños cambios
   - Tests passing siempre
   - Commits frecuentes

4. Post-Refactor Validation
   - All tests passing
   - Performance no degradada
   - Documentation actualizada
```

### Caso 3: Bug Crítico en Producción

**Problema**: Bug en producción afectando usuarios
**Solución**:

```
1. Root Cause Analysis (15 min)
   - Reproducir bug
   - Identificar causa raíz
   - Documentar en docs/audits/bug_XXX.md

2. Hot Fix (30 min)
   - Fix mínimo viable
   - Test específico para bug
   - Deploy rápido

3. Proper Fix (2 horas)
   - Fix completo y robusto
   - Tests comprehensivos
   - Regression test

4. Post-Mortem
   - Crear ADR si decisión importante
   - Actualizar learning log
   - Prevención futura
```

---

## Preguntas Frecuentes

### ¿PAT-006 es realmente necesario siempre?

**R**: PAT-006 es MANDATORY para integraciones con dependencias externas. No aplicarlo resultó en 39 errores de compilación en nuestro proyecto. Con PAT-006: 0 errores.

**Excepción**: Código que NO depende de otras librerías puede omitir PAT-006.

### ¿Cuánto tiempo toma aplicar la metodología?

**R**:
- PAT-006: 20-30 min
- Spec document: 15-20 min
- Extra overhead: ~10%
- **Tiempo ahorrado**: 80% menos debugging

**ROI positivo** después de la primera integración.

### ¿Funciona con cualquier lenguaje?

**R**: Sí. Los principios son agnósticos del lenguaje:
- Spec-Driven Development
- PAT-006 (API verification)
- Zero Technical Debt
- Quality Gates

Solo cambiar los comandos:
- Rust: `cargo test` → Python: `pytest`
- Rust: `cargo clippy` → Python: `pylint`
- etc.

### ¿Qué hago si el asistente IA no sigue la metodología?

**R**:
1. Re-activar con el prompt completo
2. Recordar: "Estamos usando Metodología SOLARIA"
3. Señalar: "Esto viola PAT-006" o "Necesito spec document primero"

Si persiste:
4. Reportar como issue
5. Mejorar el prompt con ese caso específico

### ¿Cómo adaptar para mi equipo?

**R**: Personalizar:

1. **Stack tecnológico**: Cambiar comandos en CLAUDE.md
2. **Convenciones**: Agregar a prompt de integración
3. **Métricas**: Ajustar targets de coverage, etc.
4. **Proceso**: Adaptar workflow a CI/CD existente

**Mantener fijo**:
- Zero Technical Debt
- PAT-006 para integraciones
- Spec-Driven Development
- Quality Gates

### ¿Cómo medir el éxito?

**R**: Métricas clave:

**Código**:
- Coverage: ≥75%
- Tests passing: 100%
- Warnings: 0
- Technical debt: 0

**Proceso**:
- Time debugging: -80%
- Rework: -90%
- Errors from speculation: 0

**Equipo**:
- Confidence: Alta
- Documentation quality: Alta
- Onboarding time: -50%

---

## Soporte

### Documentación Adicional

- `DESARROLLO_METODOLOGIA_SOLARIA.md`: Metodología completa
- `PROMPT_INTEGRACION_IA.md`: Prompt para IA
- `.memory/learning_log.jsonl`: Lecciones del proyecto
- `docs/ADR/`: Architecture Decision Records

### Contacto

- **Website**: https://www.solaria.agency
- **Proyecto Base**: BRIK-64 (https://github.com/NAZCAMEDIA/BRIK-64)
- **Licencia**: MIT

### Contribuciones

¿Descubriste un nuevo patrón o antipatrón?

1. Documentar en `.memory/learning_log.jsonl`
2. Crear PR con actualización a metodología
3. Compartir con comunidad

---

## Changelog

### v1.0.0 (2025-10-28)
- Initial release
- Validado en proyecto BRIK-64
- 292 tests, 82% coverage, 0 technical debt
- PAT-006 probado empíricamente

---

**¡Bienvenido a la Metodología SOLARIA!**

Desarrolla con:
- ✅ Cero deuda técnica
- ✅ Confianza total en tu código
- ✅ Documentación completa
- ✅ Calidad medible

---

*"Es mejor verificar una vez que asumir mil veces"* — PAT-006
