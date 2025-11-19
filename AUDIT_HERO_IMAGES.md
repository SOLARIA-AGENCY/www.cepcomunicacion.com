# AUDITORÍA: Hero Images y Sedes

## Fecha: 2025-11-19
## Problema Reportado: Heroes con fotos no visibles + Fotos sedes incorrectas

---

## AUDITORÍA REALIZADA

### 1. Estado de Hero Images en Producción

**Verificación HTML:**
```bash
✓ sedes.html         - Hero image PRESENTE en HTML
✓ sobre-nosotros.html - Hero image PRESENTE en HTML
✓ cursos.html        - Hero image PRESENTE en HTML
✓ blog.html          - Hero image PRESENTE en HTML
✓ ciclos.html        - Hero image PRESENTE en HTML
```

**Código HTML Desplegado:**
```html
style="background: linear-gradient(rgba(242, 1, 75, 0.85), rgba(208, 16, 64, 0.85)),
       url('https://images.pexels.com/photos/[ID].jpeg?auto=compress&cs=tinysrgb&w=1920')
       center/cover no-repeat"
```

**DIAGNÓSTICO:**
- ✅ HTML correcto en producción
- ❌ Imágenes NO visibles para el usuario
- **Causa:** Overlay con opacity 0.85 demasiado opaco, tapa completamente la foto
- **Solución:** Reducir opacity a 0.5 o 0.6 para que se vea la imagen de fondo

---

### 2. Páginas de Cursos sin Hero

**Missing Hero Sections:**
```
❌ cursos/desempleados.html  - Solo breadcrumb, sin hero
❌ cursos/ocupados.html      - Solo breadcrumb, sin hero
❌ cursos/privados.html      - Solo breadcrumb, sin hero
❌ cursos/teleformacion.html - Solo breadcrumb, sin hero
```

**Solución:** Añadir hero section antes de breadcrumb en las 4 páginas

---

### 3. Fotos de Sedes - Incorrectas

**Problema:**
- Actualmente usando fotos genéricas de Pexels
- Necesitan fotos REALES de las ciudades específicas

**Requerido:**
1. **CEP NORTE** - La Orotava, Tenerife (foto real de La Orotava)
2. **CEP SUR** - Arona, Tenerife (foto real de Arona/Los Cristianos)
3. **CEP SANTA CRUZ** - Santa Cruz de Tenerife (foto real de la capital)
4. **CEP CÁDIZ** - Cádiz, Andalucía (foto real de Cádiz)

---

## ACCIONES CORRECTIVAS

### Acción 1: Reducir opacity de overlays
- Cambiar de `rgba(..., 0.85)` a `rgba(..., 0.5)`
- Aplicar en: 5 páginas principales + 4 páginas cursos

### Acción 2: Reemplazar fotos de sedes
- Buscar fotos reales en Pexels de cada ciudad
- Aplicar a sedes.html

### Acción 3: Añadir heroes a cursos/
- Crear hero sections para las 4 páginas de cursos
- Con fotos temáticas específicas por tipo de curso

---

## URLs de Fotos Reales (Pexels)

### Sedes (Ciudades reales):
- **La Orotava**: https://images.pexels.com/photos/17930048/pexels-photo-17930048.jpeg (Tenerife architecture)
- **Arona/Los Cristianos**: https://images.pexels.com/photos/6031667/pexels-photo-6031667.jpeg (Tenerife coastal)
- **Santa Cruz de Tenerife**: https://images.pexels.com/photos/19004386/pexels-photo-19004386.jpeg (Santa Cruz cityscape)
- **Cádiz**: https://images.pexels.com/photos/28967850/pexels-photo-28967850.jpeg (Cádiz beach/city)

### Cursos Heroes:
- **Desempleados**: https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg (job search/career)
- **Ocupados**: https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg (professionals working)
- **Privados**: https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg (private tutoring)
- **Teleformación**: https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg (online learning)

---

## RESUMEN EJECUTIVO

**Problemas Identificados:** 3
1. Overlay demasiado opaco (heroes no visibles)
2. Fotos de sedes genéricas (no de ciudades reales)
3. Páginas cursos/ sin hero sections

**Archivos a Modificar:** 9
- 5 páginas principales (reducir opacity)
- 1 sedes.html (cambiar fotos)
- 4 cursos/* (añadir heroes)

**Impacto:** Alto - Afecta experiencia visual en 9 páginas
