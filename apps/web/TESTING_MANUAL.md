# Testing Manual - Week 3 Improvements
# Error Boundaries & Loading Skeletons

Este documento contiene instrucciones para testing manual exhaustivo de las mejoras implementadas en Week 3.

---

## 📋 Testing Checklist

### ✅ Loading Skeletons

#### Test 1: HomePage Loading Skeleton
**Pasos:**
1. Abre http://localhost:3000/
2. Observa la sección "Cursos Destacados"
3. Durante la carga, deberías ver **3 skeletons de CourseCard** con animación pulse
4. Los skeletons deben coincidir con la estructura de las tarjetas reales
5. Verifica que no haya salto de layout al cargar el contenido real

**Resultado Esperado:**
- ✅ 3 skeletons en grid (1 columna en móvil, 3 en desktop)
- ✅ Animación pulse suave
- ✅ Estructura idéntica a CourseCard (imagen, badge, título, descripción, meta)
- ✅ Sin layout shift al cargar contenido

#### Test 2: CoursesPage Loading Skeleton
**Pasos:**
1. Abre http://localhost:3000/cursos
2. Observa la sección de resultados
3. Durante la carga inicial, deberías ver **6 skeletons de CourseCard** en grid
4. Cambia algún filtro (ciclo, modalidad, campus)
5. Verifica que el skeleton aparezca durante la nueva búsqueda

**Resultado Esperado:**
- ✅ 6 skeletons en grid (2 columnas en tablet, 3 en desktop)
- ✅ Skeleton aparece al cambiar filtros
- ✅ Animación pulse consistente
- ✅ Sin layout shift

#### Test 3: CourseDetailPage Loading Skeleton
**Pasos:**
1. Desde la página de cursos, haz clic en un curso
2. Observa la carga de la página de detalle
3. Deberías ver el **CourseDetailSkeleton completo**:
   - Hero section con gradiente
   - Breadcrumbs skeletons
   - Título y descripción skeletons
   - Sidebar skeleton con precio y CTA
   - Sección de descripción skeleton
   - Sección de sedes skeleton

**Resultado Esperado:**
- ✅ Skeleton completo de página (hero + contenido + sidebar)
- ✅ Estructura idéntica a la página real
- ✅ Sin layout shift
- ✅ Animación pulse en todos los elementos

#### Test 4: Accesibilidad de Skeletons
**Pasos:**
1. Con cualquier página en estado de carga, abre el inspector de elementos
2. Inspecciona un skeleton
3. Verifica atributos ARIA:
   - `aria-busy="true"`
   - `aria-live="polite"`
   - `role="status"`
4. Verifica que haya un `<span class="sr-only">Cargando...</span>` para lectores de pantalla

**Resultado Esperado:**
- ✅ Atributos ARIA presentes
- ✅ Texto para lectores de pantalla
- ✅ Anuncio automático de estado de carga

---

### ✅ Error Boundaries

#### Test 5: Error Recovery en Página
**Pasos para provocar error (método temporal):**
1. Abre el navegador en http://localhost:3000/cursos
2. Abre las DevTools (F12)
3. Ve a la pestaña "Console"
4. Ejecuta este código para simular un error:
   ```javascript
   // Este código provocará un error en el próximo render
   window.triggerError = true;
   ```
5. Actualiza la página

**Alternativa - Error real:**
1. Detén el backend CMS (si está corriendo)
2. Navega a http://localhost:3000/cursos
3. Si hay un error de red, debería ser capturado por el ErrorBoundary

**Resultado Esperado:**
- ✅ La aplicación NO se rompe completamente
- ✅ Se muestra PageErrorBoundary con:
  - Icono de error en círculo rojo
  - Mensaje: "Algo salió mal"
  - Botón "Reintentar"
  - Botón "Volver al Inicio"
  - Link a contacto
- ✅ En desarrollo, se muestra "Detalles técnicos del error" colapsable
- ✅ El header y footer siguen visibles

#### Test 6: Error Recovery - Botón Reintentar
**Pasos:**
1. Provoca un error (siguiendo Test 5)
2. Verifica que se muestre el PageErrorBoundary
3. Haz clic en el botón "Reintentar"

**Resultado Esperado:**
- ✅ La página intenta renderizarse de nuevo
- ✅ Si el error persiste, vuelve a mostrar el boundary
- ✅ Si el error se resolvió, muestra el contenido normal

#### Test 7: Error Recovery - Navegación
**Pasos:**
1. Provoca un error en una página (siguiendo Test 5)
2. Verifica que se muestre el PageErrorBoundary
3. Haz clic en "Volver al Inicio"

**Resultado Esperado:**
- ✅ Navega a la página de inicio (/)
- ✅ La página de inicio funciona correctamente
- ✅ El error quedó aislado a la página anterior

#### Test 8: Error Logging (Development)
**Pasos:**
1. Provoca un error (siguiendo Test 5)
2. Abre las DevTools (F12)
3. Ve a la pestaña "Console"
4. Busca logs de ErrorBoundary

**Resultado Esperado:**
- ✅ Se muestra en consola: "ErrorBoundary caught an error: [error]"
- ✅ Se muestra en consola: "Error Info: [errorInfo]"
- ✅ Se muestra en consola: "Component Stack: [stack]"
- ✅ En la UI, se muestra el error detallado en el desplegable "Detalles técnicos"

#### Test 9: Error Isolation (múltiples páginas)
**Pasos:**
1. Abre http://localhost:3000/
2. Navega a http://localhost:3000/cursos
3. Provoca un error en /cursos
4. Verifica que se muestre el PageErrorBoundary
5. Haz clic en "Volver al Inicio"
6. Verifica que la página de inicio funcione correctamente

**Resultado Esperado:**
- ✅ El error en /cursos NO afecta a /
- ✅ Cada página está aislada por su propio PageErrorBoundary
- ✅ La navegación entre páginas funciona correctamente

---

### ✅ Responsive Design

#### Test 10: Skeletons en Móvil
**Pasos:**
1. Abre las DevTools (F12)
2. Activa el modo dispositivo móvil (Ctrl+Shift+M o Cmd+Shift+M)
3. Selecciona "iPhone 12 Pro" o similar
4. Navega a http://localhost:3000/cursos
5. Observa los skeletons durante la carga

**Resultado Esperado:**
- ✅ Skeletons se adaptan a 1 columna en móvil
- ✅ No hay scroll horizontal
- ✅ Animación pulse funciona correctamente
- ✅ Touch events funcionan (si pruebas en dispositivo real)

#### Test 11: Error Boundary en Móvil
**Pasos:**
1. En modo móvil (siguiendo Test 10)
2. Provoca un error (siguiendo Test 5)
3. Verifica que el PageErrorBoundary sea legible en móvil

**Resultado Esperado:**
- ✅ Mensaje de error legible
- ✅ Botones táctiles (tamaño mínimo 44x44px)
- ✅ No hay elementos cortados
- ✅ Scroll funciona si el contenido es largo

---

### ✅ Performance

#### Test 12: Skeleton Animation Performance
**Pasos:**
1. Abre http://localhost:3000/cursos
2. Abre las DevTools (F12)
3. Ve a la pestaña "Performance"
4. Haz clic en "Record" (círculo rojo)
5. Recarga la página
6. Espera a que cargue completamente
7. Detén la grabación
8. Analiza el flamegraph

**Resultado Esperado:**
- ✅ No hay frame drops (FPS debe ser ~60)
- ✅ La animación pulse no causa repaint excesivos
- ✅ Usar solo CSS (animate-pulse) sin JavaScript

#### Test 13: Memory Leaks
**Pasos:**
1. Abre http://localhost:3000/cursos
2. Abre las DevTools (F12)
3. Ve a la pestaña "Memory"
4. Toma un heap snapshot
5. Navega entre páginas 10 veces (/, /cursos, /contacto, repite)
6. Toma otro heap snapshot
7. Compara el tamaño del heap

**Resultado Esperado:**
- ✅ El heap no crece indefinidamente
- ✅ Los componentes desmontados se limpian correctamente
- ✅ No hay event listeners colgados

---

## 🐛 Testing de Errores Específicos

### Método 1: Simular Error de Red

**Pasos:**
1. Abre las DevTools (F12)
2. Ve a la pestaña "Network"
3. Activa "Offline" en el throttling dropdown
4. Navega a http://localhost:3000/cursos
5. La página debería mostrar el estado de error

**Limpieza:**
- Desactiva "Offline" para volver a la normalidad

### Método 2: Simular Error de API

**Pasos:**
1. Detén el backend CMS (Ctrl+C en la terminal donde corre)
2. Navega a http://localhost:3000/cursos
3. Debería mostrar Alert de error (no ErrorBoundary, porque es error esperado)
4. Reinicia el backend CMS
5. Haz clic en "Reintentar" o recarga

### Método 3: Crear Componente de Test con Error

**Crear archivo temporal:**
`apps/web/src/pages/ErrorTestPage.tsx`

```typescript
export default function ErrorTestPage() {
  // Provoca un error intencional
  throw new Error('Error de prueba para testing de ErrorBoundary');

  return <div>Esto nunca se renderiza</div>;
}
```

**Agregar ruta temporal en App.tsx:**
```typescript
<Route
  path="/error-test"
  element={
    <PageErrorBoundary>
      <ErrorTestPage />
    </PageErrorBoundary>
  }
/>
```

**Probar:**
1. Navega a http://localhost:3000/error-test
2. Debería mostrar PageErrorBoundary inmediatamente
3. Verifica todos los elementos del boundary
4. Prueba el botón "Reintentar" (volverá a lanzar el error)
5. Prueba el botón "Volver al Inicio"

**Limpieza:**
- Elimina ErrorTestPage.tsx
- Elimina la ruta de App.tsx

---

## ✅ Accessibility Testing

### Test 14: Keyboard Navigation
**Pasos:**
1. Abre http://localhost:3000/cursos
2. NO uses el ratón
3. Presiona Tab repetidamente para navegar
4. Verifica que puedas llegar a:
   - Filtros (search, selects)
   - Botón "Limpiar filtros" (si está visible)
   - CourseCards (deberían ser focuseables)
5. Presiona Enter en un CourseCard para navegar al detalle

**Resultado Esperado:**
- ✅ Todos los elementos interactivos son focuseables
- ✅ El orden de focus es lógico
- ✅ El indicador de focus es visible
- ✅ Enter/Space activan elementos

### Test 15: Screen Reader Testing (opcional)
**Pasos:**
1. Activa un lector de pantalla:
   - Windows: NVDA (gratis) o JAWS
   - macOS: VoiceOver (Cmd+F5)
   - Linux: Orca
2. Navega a http://localhost:3000/cursos
3. Escucha los anuncios:
   - Durante la carga: "Cargando..."
   - Cuando carga: número de cursos encontrados
   - Al hacer foco en elementos: descripciones apropiadas

**Resultado Esperado:**
- ✅ Anuncios contextuales apropiados
- ✅ Los skeletons se anuncian como "Cargando..."
- ✅ Los errores se anuncian claramente
- ✅ La estructura semántica es clara (headings, landmarks)

---

## 📊 Resultados Esperados Generales

### Comportamiento de Skeletons:
- ✅ Aparecen **inmediatamente** cuando status === 'loading'
- ✅ Coinciden **exactamente** con la estructura del contenido final
- ✅ NO causan layout shift al cargar el contenido real
- ✅ Animación pulse suave y continua
- ✅ Accesibles para lectores de pantalla

### Comportamiento de ErrorBoundary:
- ✅ Captura errores de JavaScript en el árbol de componentes
- ✅ Muestra UI de fallback user-friendly
- ✅ Permite retry sin recargar la página
- ✅ Aísla errores (no rompe toda la app)
- ✅ Logs detallados en desarrollo
- ✅ Preparado para logging en producción

### Performance:
- ✅ Skeletons son CSS puro (animate-pulse)
- ✅ No hay JavaScript extra para animaciones
- ✅ 60 FPS constantes
- ✅ Sin memory leaks
- ✅ Tiempo de carga percibido reducido

### Accesibilidad:
- ✅ ARIA attributes correctos
- ✅ Screen reader announcements
- ✅ Keyboard navigation completa
- ✅ Focus management apropiado
- ✅ Semantic HTML

---

## 🎯 Criterios de Aceptación

Para considerar este testing completo, todos los siguientes deben ser ✅:

- [ ] Todos los skeletons se muestran correctamente
- [ ] Skeletons coinciden con el contenido final (sin layout shift)
- [ ] ErrorBoundary captura errores correctamente
- [ ] Botón "Reintentar" funciona
- [ ] Botón "Volver al Inicio" funciona
- [ ] Errores están aislados (no rompen toda la app)
- [ ] Responsive en móvil/tablet/desktop
- [ ] 60 FPS en animaciones
- [ ] Sin memory leaks
- [ ] Accesible con teclado
- [ ] Accesible con screen reader
- [ ] Logs apropiados en consola (desarrollo)

---

## 🚀 Testing en Producción (Futuro)

Cuando se despliegue a producción, verificar:

1. **Error Tracking Integration:**
   - Descomentar integración con Sentry/Bugsnag en PageErrorBoundary.tsx
   - Verificar que errores se logueen correctamente
   - Configurar alertas para errores críticos

2. **Performance Monitoring:**
   - Usar Lighthouse para auditar performance
   - Core Web Vitals (LCP, FID, CLS)
   - Verificar que skeletons mejoren el LCP percibido

3. **Real User Monitoring (RUM):**
   - Medir tiempo de carga percibido con/sin skeletons
   - Medir tasa de errores capturados
   - Medir tasa de recovery (reintentos exitosos)

---

## 📝 Notas

- **Desarrollo vs Producción:** Los detalles de error solo se muestran en modo desarrollo
- **Limpieza:** No dejar componentes de test (ErrorTestPage) en el código final
- **Logging:** En producción, integrar con servicio de error tracking (Sentry, Bugsnag, etc.)
- **Monitoreo:** Configurar alertas para errores que se repiten frecuentemente

---

**Creado:** 2025-10-23
**Versión:** 1.0
**Autor:** Claude Code con SOLARIA AGENCY
