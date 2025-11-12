# ÍNDICE COMPLETO - Prompts Dashboard CEP Comunicación

## 📚 Documentación Creada

**Ubicación:** `/Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/`

---

## 📄 DOCUMENTOS DISPONIBLES

### 1. RESUMEN_PROMPT_OPTIMIZADO.md
**Propósito:** Guía ejecutiva
**Contenido:**
- Resumen de mejoras vs versión original
- Instrucciones de ejecución
- Checklist de fases

### 2. PROMPT_DESARROLLO_COMPLETO_OPTIMIZADO.md (PARTE 1) ⭐
**Tamaño:** ~6,800 líneas
**Tiempo estimado:** 35-40 min
**Contenido:**
- ✅ **Fase 1:** Mock Data actualizado (interfaces mejoradas)
- ✅ **Fase 2:** 3 componentes UI nuevos
  - `WeeklyCalendar.tsx` - Calendario semanal visual
  - `CourseCardMini.tsx` - Ficha curso clicable
  - `EditableList.tsx` - Lista dinámica agregar/quitar
- ✅ **Fase 3:** TeachersPage.tsx optimizado
- ✅ **Fase 4:** TeacherDialog.tsx con tabs
- ✅ **Fase 5:** 3 ClassroomsPages con calendario visual
- ✅ **Fase 6:** ClassroomDialog.tsx con lista dinámica

**Mejoras clave:**
- Biografía OBLIGATORIA (no opcional)
- Certificaciones completas
- Sedes asignadas
- Cursos desglosados con fichas clicables
- Calendario semanal visual (NO badge general ocupado/libre)
- Equipamiento lista dinámica (NO checkboxes fijos)

### 3. PROMPT_DESARROLLO_COMPLETO_OPTIMIZADO_PARTE2.md (PARTE 2) ⭐
**Tamaño:** ~4,500 líneas
**Tiempo estimado:** 35-40 min
**Contenido:**
- ✅ **Fase 7:** StudentsPage + StudentDialog
  - Tabla + vista cards
  - Cursos matriculados desglosados
  - Notas académicas OBLIGATORIAS
  - Sede asignada
- ✅ **Fase 8:** AdministrativePage + AdministrativeDialog
  - Similar a profesores
  - Certificaciones y formación
  - Sedes múltiples
  - Responsabilidades específicas

### 4. PROMPT_DESARROLLO_COMPLETO_OPTIMIZADO_PARTE2B.md (PARTE 2B) ⭐
**Tamaño:** ~3,800 líneas
**Tiempo estimado:** 25-30 min
**Contenido:**
- ✅ **Fase 9:** CampusPage + CampusDialog
  - Cards grandes con imagen banner
  - Descripción OBLIGATORIA
  - Instalaciones (lista dinámica)
  - Integración con aulas
- ✅ **Fase 10:** CyclesPage + CycleDialog
  - Accordion expandible
  - Cursos asociados desglosados
  - Salidas profesionales

### 5. PROMPT_CURSOS_COMPLETO_DETALLADO.md (CURSOS - STANDALONE) ⭐
**Tamaño:** ~2,315 líneas
**Tiempo estimado:** 80 min
**Contenido:**
- ✅ **Fase 1:** Mock Data con 10 cursos completos
  - Temarios detallados (módulos + temas)
  - Todos los tipos de curso
  - Relaciones completas
- ✅ **Fase 2:** CoursesPage.tsx con filtros avanzados
- ✅ **Fase 3:** CourseDialog.tsx (el más complejo - 4 tabs)
  - General, Contenido, Profesores y Sedes, Temario
  - Listas dinámicas para objetivos, requisitos, módulos
  - Descripción OBLIGATORIA

### 6. PROMPT_DESARROLLO_PARTE_FINAL.md (PARTE FINAL) ⭐
**Tamaño:** ~2,870 líneas
**Tiempo estimado:** 90 min
**Contenido:**
- ✅ **Fase 1-3:** CampaignsPage + CampaignDialog
  - 10 campañas con métricas reales
  - Tabla con stats cards (presupuesto, leads, conversión, ROI)
  - Dialog con 4 tabs (General, Configuración UTM, Métricas, Cursos/Sedes)
- ✅ **Fase 4:** SettingsPage (tabs inline, sin dialog)
  - General, Notificaciones, Integraciones, Seguridad
- ✅ **Fase 5:** UserProfilePage + UserProfileDialog
  - Perfil con avatar, biografía OBLIGATORIA
  - Dialog con 3 tabs (Personal, Seguridad, Preferencias)

---

## 🚀 ORDEN DE EJECUCIÓN

### Paso 1: Ejecutar PARTE 1 (Profesores + Aulas)
```bash
cat design-dashboard-mockup/PROMPT_DESARROLLO_COMPLETO_OPTIMIZADO.md
```
**Pegar en Claude Code Web → Ejecutar**

**Resultado esperado:**
- TeachersPage optimizado ✅
- 3 ClassroomsPages con calendario visual ✅
- 3 componentes UI nuevos ✅
- Mock data expandido ✅

### Paso 2: Ejecutar PARTE 2 (Alumnos + Personal)
```bash
cat design-dashboard-mockup/PROMPT_DESARROLLO_COMPLETO_OPTIMIZADO_PARTE2.md
```
**Pegar en Claude Code Web → Ejecutar**

**Resultado esperado:**
- StudentsPage (tabla + cards) ✅
- AdministrativePage ✅
- Dialogs correspondientes ✅

### Paso 3: Ejecutar PARTE 2B (Sedes + Ciclos)
```bash
cat design-dashboard-mockup/PROMPT_DESARROLLO_COMPLETO_OPTIMIZADO_PARTE2B.md
```
**Pegar en Claude Code Web → Ejecutar**

**Resultado esperado:**
- CampusPage con banners ✅
- CyclesPage con accordion ✅

### Paso 4: Ejecutar CURSOS (Sección Más Importante)
```bash
cat design-dashboard-mockup/PROMPT_CURSOS_COMPLETO_DETALLADO.md
```
**Pegar en Claude Code Web → Ejecutar**

**Resultado esperado:**
- 10 cursos con temarios completos ✅
- CoursesPage con filtros avanzados ✅
- CourseDialog (4 tabs - el más complejo) ✅

### Paso 5: Ejecutar PARTE FINAL (Campañas, Configuración, Perfil)
```bash
cat design-dashboard-mockup/PROMPT_DESARROLLO_PARTE_FINAL.md
```
**Pegar en Claude Code Web → Ejecutar**

**Resultado esperado:**
- CampaignsPage + CampaignDialog con métricas ✅
- SettingsPage con 4 tabs inline ✅
- UserProfilePage + UserProfileDialog ✅
- **DASHBOARD 100% COMPLETO** 🎉

---

## ✅ CHECKLIST DE PROGRESO

### PARTE 1 (Profesores + Aulas)
- [ ] Mock data actualizado con interfaces mejoradas
- [ ] WeeklyCalendar.tsx creado
- [ ] CourseCardMini.tsx creado
- [ ] EditableList.tsx creado
- [ ] TeachersPage.tsx actualizado con biografía, certificaciones, sedes, cursos
- [ ] TeacherDialog.tsx con 3 tabs
- [ ] ClassroomsNortePage.tsx con calendario
- [ ] ClassroomsSantaCruzPage.tsx con calendario
- [ ] ClassroomsSurPage.tsx con calendario
- [ ] ClassroomDialog.tsx con lista dinámica equipamiento

### PARTE 2 (Alumnos + Personal)
- [ ] StudentsPage.tsx con tabla y cards
- [ ] StudentDialog.tsx con 3 tabs
- [ ] AdministrativePage.tsx
- [ ] AdministrativeDialog.tsx con 3 tabs

### PARTE 2B (Sedes + Ciclos)
- [ ] CampusPage.tsx con cards grandes
- [ ] CampusDialog.tsx
- [ ] CyclesPage.tsx con accordion
- [ ] CycleDialog.tsx

### CURSOS (Sección Más Importante)
- [ ] Mock data con 10 cursos completos (temarios detallados)
- [ ] CoursesPage.tsx con filtros avanzados
- [ ] CourseDialog.tsx con 4 tabs (el más complejo)

### PARTE FINAL (Campañas, Configuración, Perfil)
- [ ] Mock data con 10 campañas
- [ ] CampaignsPage.tsx con tabla de métricas
- [ ] CampaignDialog.tsx con 4 tabs (UTM tracking)
- [ ] SettingsPage.tsx con 4 tabs inline
- [ ] UserProfilePage.tsx
- [ ] UserProfileDialog.tsx con 3 tabs

---

## 🎯 CARACTERÍSTICAS IMPLEMENTADAS

### Patrón General Aplicado

#### ✅ Información Completa
- Biografía/Descripción OBLIGATORIA (no opcional)
- Certificaciones visibles y editables
- Sedes/Campuses asignados (múltiples)
- Relaciones expandidas visualmente

#### ✅ Componentes Dinámicos
- Listas editables (agregar/quitar items)
- NO checkboxes fijos
- Campos que crecen según necesidad

#### ✅ Visualización Temporal
- Calendario semanal con grid horario
- Colores por curso para identificar
- Franjas horarias detalladas

#### ✅ Navegación Contextual
- Fichas de cursos clicables → llevan a página de curso
- Botones "Ver Aulas" → navegan a sección aulas
- Enlaces entre entidades relacionadas

#### ✅ Vistas Múltiples
- Tabla (para muchos registros)
- Cards/Grid (visual detallado)
- Accordion (para jerarquías)
- Toggle entre vistas

---

## 📊 ESTADÍSTICAS

### Líneas de Código Generadas
- PARTE 1: ~6,800 líneas
- PARTE 2: ~4,500 líneas
- PARTE 2B: ~3,800 líneas
- CURSOS: ~2,315 líneas
- PARTE FINAL: ~2,870 líneas
- **TOTAL: ~20,285 líneas**

### Archivos Creados/Modificados
- **Páginas:** 14 archivos
  - TeachersPage, 3 ClassroomsPages, StudentsPage, AdministrativePage
  - CampusPage, CyclesPage, CoursesPage
  - CampaignsPage, SettingsPage, UserProfilePage
- **Diálogos:** 11 archivos
  - TeacherDialog, ClassroomDialog, StudentDialog, AdministrativeDialog
  - CampusDialog, CycleDialog, CourseDialog
  - CampaignDialog, UserProfileDialog
- **Componentes UI:** 3 archivos
  - WeeklyCalendar, CourseCardMini, EditableList
- **Mock Data:** 1 archivo expandido (incluye 10 cursos + 10 campañas)
- **TOTAL: 29 archivos**

### Tiempo Estimado
- PARTE 1: 35-40 min
- PARTE 2: 35-40 min
- PARTE 2B: 25-30 min
- CURSOS: 80 min
- PARTE FINAL: 90 min
- **TOTAL: ~265-280 minutos** (4h 25min - 4h 40min)

---

## 🎨 PATRÓN DE DISEÑO ESTABLECIDO

### Card Structure
```tsx
<Card hover:shadow-lg>
  <CardHeader>
    {/* Avatar/Image + Nombre + Edit button */}
  </CardHeader>
  <CardContent>
    {/* Contacto */}
    {/* Detalles específicos */}
    {/* Certificaciones */}
    {/* Sedes/Campuses */}
    {/* Relaciones expandidas (cursos, etc.) */}
    {/* Biografía/Descripción SIEMPRE visible */}
    {/* Estado */}
  </CardContent>
</Card>
```

### Dialog Structure
```tsx
<Dialog>
  <Tabs>
    <Tab "General">
      {/* Avatar upload */}
      {/* Campos básicos */}
      {/* Biografía OBLIGATORIA */}
    </Tab>
    <Tab "Detalles">
      {/* Certificaciones/Especialidades */}
      {/* Listas dinámicas */}
    </Tab>
    <Tab "Asignaciones">
      {/* Sedes (checkboxes) */}
      {/* Cursos (checkboxes) */}
    </Tab>
  </Tabs>
  <DialogFooter>
    {isEdit && <Button variant="destructive">Eliminar</Button>}
    <Button variant="outline">Cancelar</Button>
    <Button>Guardar</Button>
  </DialogFooter>
</Dialog>
```

---

## 🔧 COMPONENTES REUTILIZABLES

### WeeklyCalendar
```tsx
<WeeklyCalendar schedule={classroomSchedule} />
```
- Grid 7 días × horarios
- Colores por curso
- Nombre profesor visible
- Leyenda automática

### CourseCardMini
```tsx
<CourseCardMini course={courseData} />
```
- Ficha compacta
- Clicable (navega a curso)
- Muestra: nombre, código, tipo, modalidad, alumnos

### EditableList
```tsx
<EditableList
  items={items}
  label="Equipamiento"
  placeholder="Agregar ítem..."
/>
```
- Agregar/quitar items dinámicamente
- Badges con botón X para eliminar
- Input + botón Plus para agregar

---

## 📝 NOTAS IMPORTANTES

### Biografía/Descripción
**SIEMPRE OBLIGATORIA** en:
- Profesores
- Personal Administrativo
- Sedes
- Ciclos
- Cursos
- Campañas
- Perfil de Usuario

### Calendario Visual
**Implementado en:**
- Aulas (ocupación semanal)
- NO usar badge general "Ocupado/Libre"
- Mostrar franjas horarias específicas con colores

### Listas Dinámicas
**Usar en lugar de checkboxes fijos:**
- Equipamiento de aulas
- Instalaciones de sedes
- Responsabilidades del personal
- Requisitos de ciclos
- Salidas profesionales

---

## 🚀 SIGUIENTE PASO

Una vez ejecutadas las **5 partes**, el dashboard estará **100% completo** en modo mockup visual.

### Dashboard Completo Incluye:

**10 Secciones Principales:**
1. ✅ Profesores (biografía, certificaciones, cursos, calendario)
2. ✅ Aulas (calendario semanal visual, equipamiento dinámico)
3. ✅ Alumnos (tabla + cards, notas académicas)
4. ✅ Personal Administrativo (certificaciones, sedes, responsabilidades)
5. ✅ Sedes (banners, instalaciones dinámicas, descripción obligatoria)
6. ✅ Ciclos (accordion, cursos asociados, salidas profesionales)
7. ✅ Cursos (filtros avanzados, temario completo, 4 tabs)
8. ✅ Campañas (métricas ROI, UTM tracking, stats cards)
9. ✅ Configuración (4 tabs: general, notificaciones, integraciones, seguridad)
10. ✅ Perfil Usuario (biografía obligatoria, cambio contraseña, preferencias)

**Componentes Reutilizables:**
- WeeklyCalendar (calendario semanal con colores por curso)
- CourseCardMini (ficha clicable de curso)
- EditableList (listas dinámicas agregar/quitar)

**Patrón Establecido:**
- Biografía/Descripción SIEMPRE obligatoria
- Delete button dentro de dialogs
- Listas dinámicas (NO checkboxes fijos)
- Tabs para formularios complejos
- Multi-select para relaciones
- Visualización temporal (calendarios)

**Para implementar funcionalidad real:**
1. Conectar con Payload CMS backend
2. Implementar API calls con React Query
3. Agregar validación de formularios con Zod
4. Conectar calendario con base de datos
5. Implementar autenticación JWT
6. Agregar persistencia de datos

---

**Creado:** 2025-11-11
**Última actualización:** 2025-11-11
**Proyecto:** CEP Comunicación Dashboard Mockup
**Versión:** Índice Completo v2.0 (Dashboard 100% Completo)
