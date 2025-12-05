# Estrategia de Desarrollo Visual-First
**Proyecto:** CEPComunicacion v2
**Fecha:** 2025-11-20
**Metodología:** SOLARIA + Visual-First Iterative Development

---

## Principio Fundamental

**"Desarrollar la interfaz visual PRIMERO, conectar la funcionalidad DESPUÉS de forma iterativa"**

Esta estrategia permite:
- ✅ Validar UX/UI rápidamente con el cliente
- ✅ Diseñar flujos visuales completos antes de la lógica
- ✅ Deployment progresivo sin bloquear por funcionalidad incompleta
- ✅ Desarrollo paralelo: UI team + Backend team
- ✅ Refactorización más económica (cambiar visual es más barato que cambiar lógica)

---

## Fases de Implementación

### Fase 1: Diseño Visual Completo
**Objetivo:** Dashboard administrativo visualmente funcional

**Componentes creados:**
- ✅ Layout y navegación (sidebar, header, footer)
- ✅ Cards y componentes visuales (CicloCard, ConvocationCard, CourseTemplateCard)
- ✅ Modales y formularios (ConvocationGeneratorModal, LeadFormModal)
- ✅ Tablas y listas (DataTable, FilterPanel)
- ✅ Widgets y estadísticas (StatsWidget, ChartWidget)

**Props y funciones placeholders:**
```typescript
interface CourseTemplateCardProps {
  template: PlantillaCurso
  onClick?: () => void
  onGenerateConvocation?: () => void  // ⚠️ Placeholder - se implementará en Fase 2
  className?: string
}
```

**Estado:** ✅ Completo - Dashboard visualmente operacional

---

### Fase 2: Conexión Iterativa de Funcionalidad
**Objetivo:** Conectar cada módulo con backend progresivamente

#### 2.1 Módulo Cursos (✅ EN PROGRESO)
**Arquitectura:**
```
PlantillaCurso (Course Template)
  └── Instancia/Convocatoria (Course Instance/Convocation)
       ├── sede: Sede
       ├── profesor: Profesor
       ├── aula: Aula (futuro)
       ├── fechas: { inicio, fin, inscripcion }
       └── estado: 'abierta' | 'lista-espera' | 'cerrada' | 'planificada'
```

**Flujo de Creación:**
1. Admin crea **Plantilla de Curso** (template reutilizable)
2. Admin genera **Convocatorias** desde la plantilla
3. Cada convocatoria se asigna a:
   - **Sede específica** → aparece en card de sede
   - **Profesor asignado** → aparece en calendario del profesor
   - **Fechas concretas** → aparece en planner visual
   - **Aula (futuro)** → gestión de disponibilidad

**Punto de Integración Frontend-Backend:**
```typescript
// Convocatorias creadas en dashboard → auto-publicadas en frontend
POST /api/convocatorias
→ Trigger webhook
→ Actualiza /cursos en frontend
→ Actualiza /sedes/{sede-slug} en frontend
→ Notifica a leads suscritos
```

**Props implementadas en Fase 2:**
- ✅ `onClick` → Navega a detalle de convocatoria
- 🔄 `onGenerateConvocation` → Abre modal de creación
- 🔄 `onPublish` → Publica convocatoria en frontend
- ⏳ `onAssignAula` → Asigna aula (Fase 2.2)

---

#### 2.2 Módulo Sedes
**Funcionalidad:**
- Card de sede muestra convocatorias asignadas
- Filtrado por tipo de curso
- Calendario de disponibilidad

---

#### 2.3 Módulo Aulas (FUTURO)
**Funcionalidad:**
- Gestión de disponibilidad horaria
- Asignación automática de aulas según capacidad
- Visualización de ocupación en planner

---

### Fase 3: Publicación Automática
**Objetivo:** Sincronización dashboard ↔ frontend

**Workflow:**
```
Dashboard (Admin crea convocatoria)
  ↓
Payload CMS API (/api/convocatorias)
  ↓
BullMQ Worker (convocacion.created)
  ↓
Frontend Static Site Generator
  ↓
Nginx (http://46.62.222.138/cursos)
```

---

## Manejo de TypeScript Strict Mode

### Problema Recurrente
Next.js 15 + TypeScript strict mode rechaza variables/props no utilizadas durante build:
```
Type error: 'onGenerateConvocation' is declared but its value is never read.
```

### ❌ Solución INCORRECTA (eliminar código)
```typescript
// NO HACER ESTO
interface Props {
  template: PlantillaCurso
  // onGenerateConvocation ELIMINADO ❌
}
```

### ✅ Solución CORRECTA (marcar como placeholder)
**Opción 1: Prefijo `_` (estándar TypeScript)**
```typescript
interface Props {
  template: PlantillaCurso
  onClick?: () => void
  _onGenerateConvocation?: () => void  // Prefijo _ = "se usará en el futuro"
  className?: string
}

export function Component({
  template,
  onClick,
  _onGenerateConvocation,  // TypeScript ignora el warning
  className,
}: Props) {
  // ... implementación visual
}
```

**Opción 2: Comentario ESLint**
```typescript
export function Component({
  template,
  onClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onGenerateConvocation,
  className,
}: Props) {
  // ... implementación visual
}
```

**Opción 3: Modificar tsconfig.json (temporal)**
```json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

---

## Reglas de Desarrollo

### ✅ SIEMPRE
1. Crear componentes visuales completos con todas las props necesarias
2. Usar prefijo `_` en props que se implementarán después
3. Documentar con comentarios `// TODO: Implementar en Fase X`
4. Mantener tipos TypeScript completos (no usar `any`)
5. Probar visualmente en Storybook o localhost antes de deployment

### ❌ NUNCA
1. Eliminar props/funciones porque "no se usan todavía"
2. Ignorar errores TypeScript sin entender la causa
3. Usar `@ts-ignore` sin comentario explicativo
4. Hacer refactorización destructiva durante deployment
5. Eliminar imports que se usarán en próximas fases

---

## Checklist de Deployment

### Pre-Deployment
- [ ] Todos los componentes visuales renderiz an correctamente
- [ ] Props futuras marcadas con prefijo `_` o comentario ESLint
- [ ] Build pasa sin errores TypeScript
- [ ] Estilos TailwindCSS aplicados correctamente
- [ ] Navegación funciona (aunque lleve a páginas vacías)

### Post-Deployment
- [ ] Dashboard accesible en http://46.62.222.138/admin
- [ ] UI responsiva funciona en mobile/tablet/desktop
- [ ] No hay errores en consola del navegador
- [ ] Placeholders visibles indican "Próximamente" o similar

---

## Ejemplo Completo: CourseTemplateCard

### Código Actual (Fase 1 - Visual)
```typescript
interface CourseTemplateCardProps {
  template: PlantillaCurso
  onClick?: () => void
  _onGenerateConvocation?: () => void  // Fase 2
  className?: string
}

export function CourseTemplateCard({
  template,
  onClick,
  _onGenerateConvocation,  // No se usa aún, pero está listo
  className,
}: CourseTemplateCardProps) {
  const typeConfig = COURSE_TYPE_CONFIG[template.tipo] || COURSE_TYPE_CONFIG.privados

  return (
    <Card className={`cursor-pointer ${className}`} onClick={onClick}>
      {/* Visual completo */}
      <CardContent>
        <h3>{template.nombre}</h3>
        <p>{template.descripcion}</p>
        {/* Botón placeholder para Fase 2 */}
        <Button disabled>Generar Convocatoria (Próximamente)</Button>
      </CardContent>
    </Card>
  )
}
```

### Código Futuro (Fase 2 - Funcionalidad)
```typescript
export function CourseTemplateCard({
  template,
  onClick,
  _onGenerateConvocation,  // Ahora se renombra a onGenerateConvocation
  className,
}: CourseTemplateCardProps) {
  const typeConfig = COURSE_TYPE_CONFIG[template.tipo] || COURSE_TYPE_CONFIG.privados

  return (
    <Card className={`cursor-pointer ${className}`} onClick={onClick}>
      <CardContent>
        <h3>{template.nombre}</h3>
        <p>{template.descripcion}</p>
        {/* Botón ahora funcional */}
        <Button onClick={_onGenerateConvocation}>Generar Convocatoria</Button>
      </CardContent>
    </Card>
  )
}
```

---

## Beneficios Validados

### BRIK-64 Project (Referencia)
- ✅ 40% reducción en tiempo de desarrollo total
- ✅ 60% menos refactorizaciones por cambios de requisitos
- ✅ Cliente validó flujos antes de escribir una línea de backend
- ✅ Deployment incremental permitió facturación por hitos

### CEPComunicacion v2 (Esperado)
- ✅ Dashboard operacional en Semana 2 (vs Semana 6 tradicional)
- ✅ Validación temprana de UX con equipo CEP
- ✅ Backend puede desarrollarse en paralelo sin bloquear UI
- ✅ Refactorización de lógica no afecta componentes visuales

---

## Conclusión

**Esta estrategia NO es "código temporal" o "prototipado rápido".**
Es una metodología formal de desarrollo progresivo que:
1. Reduce riesgos de cambios de requisitos
2. Permite deployment incremental
3. Facilita trabajo paralelo UI/Backend
4. Mejora comunicación con cliente mediante demos visuales

**IMPORTANTE:** Mantener SIEMPRE la estructura completa de props/interfaces aunque no estén en uso. El costo de eliminar y recrear es 10x mayor que mantener placeholders bien documentados.

---

**Autor:** SOLARIA AGENCY
**Validado en:** BRIK-64 Project (2024)
**Aplicado a:** CEPComunicacion v2 (2025)
