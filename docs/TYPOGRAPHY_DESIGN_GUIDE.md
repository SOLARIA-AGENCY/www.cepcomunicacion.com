# Guía de Diseño Tipográfico - CEP Formación

## Filosofía de Diseño

Esta guía establece las mejores prácticas para el uso de tipografía en el sitio web de CEP Formación, con énfasis en **Montserrat** como familia tipográfica principal y el uso estratégico de **MAYÚSCULAS** para crear jerarquía visual y profesionalismo.

---

## Familia Tipográfica Principal

### Montserrat - Tipografía Institucional

**Razón de Selección:**
- Diseño moderno y profesional
- Excelente legibilidad en pantallas digitales
- 18 variantes de peso (100-900)
- Geometría humanista que transmite confianza
- Compatible con caracteres españoles (á, é, í, ó, ú, ñ, ü)
- Gratuita y open-source (Google Fonts)

**Implementación:**
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');

--font-sans: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Pesos Utilizados:**
- **300 (Light)**: Subtextos, disclaimers
- **400 (Regular)**: Cuerpo de texto, párrafos
- **500 (Medium)**: Labels, metadatos
- **600 (SemiBold)**: Énfasis, destacados
- **700 (Bold)**: Títulos principales
- **800 (ExtraBold)**: Hero headings, títulos de impacto

---

## Sistema de Mayúsculas - Jerarquía Visual

### ¿Por qué MAYÚSCULAS en títulos?

**Beneficios del Diseño:**

1. **Jerarquía Clara**: Diferencia inmediata entre títulos y cuerpo de texto
2. **Profesionalismo**: Transmite seriedad y confianza institucional
3. **Escaneabilidad**: Los usuarios identifican secciones rápidamente
4. **Consistencia Visual**: Unifica el diseño en toda la web
5. **Impacto Visual**: Genera mayor atención sin aumentar el tamaño

**Elementos que SIEMPRE van en MAYÚSCULAS:**

✅ **Navegación Principal**
- Menú desktop y mobile
- Enlaces del header
- Botones de CTA en navegación

✅ **Títulos de Secciones (H2)**
- "CURSOS DESTACADOS"
- "SOBRE NOSOTROS"
- "ÚLTIMAS NOTICIAS"

✅ **Títulos de Tarjetas (H3)**
- Títulos de cursos en CourseCard
- Títulos de artículos en BlogCard
- Títulos de FAQs

✅ **Footer**
- Títulos de columnas
- Categorías de enlaces

❌ **Elementos que NO van en MAYÚSCULAS:**
- Cuerpo de texto (párrafos)
- Descripciones de cursos
- Contenido de artículos
- Formularios (labels e inputs)
- Mensajes de error/éxito
- Botones con textos largos (más de 3 palabras)

---

## Escala Tipográfica

### Sistema de Tamaños - Fluid Responsive

Utilizamos `clamp()` para escalado fluido sin breakpoints:

#### 1. Hero Heading (H1)
```css
.text-fluid-hero {
  font-size: clamp(1.75rem, 5vw, 3.75rem); /* 28px → 60px */
  line-height: 1.2;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
```

**Uso:**
- Título principal de Home
- Landing pages de campañas
- Anuncios de eventos

#### 2. Section Title (H2)
```css
.text-fluid-section-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem); /* 24px → 40px */
  line-height: 1.3;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Uso:**
- Títulos de secciones en Home
- Títulos de páginas internas
- Categorías principales

#### 3. Card Title (H3)
```css
.text-card-title {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem); /* 18px → 24px */
  line-height: 1.4;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
```

**Uso:**
- Títulos de CourseCard
- Títulos de BlogCard
- Títulos de FAQ

#### 4. Navigation (Menu)
```css
.text-nav {
  font-size: 0.875rem; /* 14px desktop */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

**Uso:**
- Menú principal
- Menú mobile
- Breadcrumbs

#### 5. Body Text (Párrafos)
```css
.text-fluid-body {
  font-size: clamp(0.875rem, 1.5vw, 1.125rem); /* 14px → 18px */
  line-height: 1.6;
  font-weight: 400;
  letter-spacing: 0;
}
```

**Uso:**
- Descripciones de cursos
- Contenido de artículos
- Texto informativo

---

## Letter-Spacing (Tracking)

**Regla de Oro:** El text-transform uppercase SIEMPRE requiere letter-spacing aumentado.

| Elemento | Letter-Spacing | Razón |
|----------|---------------|-------|
| Hero (H1) | 0.02em | Ligeramente espaciado para impacto |
| Section (H2) | 0.05em | Mayor espacio mejora legibilidad |
| Card (H3) | 0.03em | Balance entre compacto y legible |
| Nav Menu | 0.08em | Muy espaciado para distinción clara |
| Body Text | 0 | Legibilidad óptima sin espaciado |

**Ejemplo Visual:**

```
❌ MAL: CURSOS DESTACADOS (sin letter-spacing)
✅ BIEN: C U R S O S   D E S T A C A D O S (0.05em)
```

---

## Mejores Prácticas

### 1. Contraste y Legibilidad

**Tamaños Mínimos:**
- Desktop: 14px (0.875rem) para body text
- Mobile: 14px (0.875rem) nunca menos
- Títulos uppercase: Mínimo 18px (1.125rem)

**Ratios de Contraste WCAG AA:**
- Texto normal: 4.5:1 mínimo
- Texto grande (≥18px): 3:1 mínimo
- Títulos importantes: 7:1 recomendado

### 2. Longitud de Línea

**Óptimo:** 45-75 caracteres por línea

```css
.content-block {
  max-width: 65ch; /* ~65 caracteres */
}
```

### 3. Altura de Línea (Line-Height)

| Tipo de Texto | Line-Height | Razón |
|---------------|-------------|-------|
| Títulos (H1-H3) | 1.2 - 1.3 | Compacto para impacto |
| Body Text | 1.6 | Legibilidad óptima |
| Footer Text | 1.5 | Balance entre espacio y contenido |

### 4. Jerarquía de Peso (Font-Weight)

**Sistema de 3 Niveles:**

1. **Normal (400)**: Cuerpo de texto, descripciones
2. **SemiBold (600)**: Énfasis inline, labels
3. **Bold (700-800)**: Títulos, navegación

❌ **Evitar:**
- Más de 3 pesos diferentes en una misma sección
- Saltos de peso muy grandes (300 → 800)
- Light (300) en textos pequeños (<16px)

### 5. Uso de Color con Tipografía

**Títulos:**
- Primary (--color-neutral-900): Títulos principales
- Secondary (--color-primary): Títulos con énfasis
- Accent (--color-accent): CTAs y destacados

**Body Text:**
- Dark (--color-neutral-900): Contenido principal
- Medium (--color-neutral-600): Texto secundario
- Light (--color-neutral-400): Metadatos, disclaimers

### 6. Accesibilidad (a11y)

✅ **Checklist de Accesibilidad:**

- [ ] Textos en uppercase incluyen `aria-label` con capitalización normal
- [ ] Contraste de color cumple WCAG AA (4.5:1 mínimo)
- [ ] Tamaño de fuente escalable con zoom del navegador
- [ ] No usar solo mayúsculas para transmitir información crítica
- [ ] Proporcionar alternativas textuales para iconos

**Ejemplo:**
```tsx
<h2 className="text-fluid-section-title" aria-label="Cursos destacados">
  CURSOS DESTACADOS
</h2>
```

### 7. Responsive Typography

**Breakpoints Recomendados:**

```css
/* Mobile First */
h1 { font-size: clamp(1.75rem, 5vw, 3.75rem); }

/* Ajustes Específicos si es necesario */
@media (max-width: 640px) {
  .text-nav {
    font-size: 1rem; /* Más grande en mobile para touch */
    letter-spacing: 0.05em; /* Reducir en pantallas pequeñas */
  }
}
```

### 8. Performance

**Optimización de Carga:**

```html
<!-- Preconnect a Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Cargar solo pesos necesarios con display=swap -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

**Fallback Stack:**
```css
font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---

## Clases Utility para Uppercase

### Sistema de Clases Predefinidas

```css
/* Títulos con Uppercase */
.title-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.title-hero {
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-weight: 800;
}

.nav-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  font-size: 0.875rem;
}

.card-title-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-weight: 700;
}
```

**Uso en Componentes:**

```tsx
// Navegación
<Link to="/cursos" className="nav-uppercase text-neutral-700 hover:text-primary">
  Cursos
</Link>

// Título de Sección
<h2 className="text-fluid-section-title title-uppercase mb-6">
  Cursos Destacados
</h2>

// Título de Tarjeta
<h3 className="text-card-title card-title-uppercase mb-3">
  {course.title}
</h3>
```

---

## Ejemplos de Implementación

### Ejemplo 1: Hero Section

```tsx
<section className="hero bg-gradient-to-r from-primary to-primary-light text-white">
  <div className="container">
    <h1 className="text-fluid-hero title-hero mb-6">
      Formación Profesional de Calidad
    </h1>
    <p className="text-fluid-hero-sub mb-8">
      Cursos presenciales, online y semipresenciales
    </p>
  </div>
</section>
```

### Ejemplo 2: Navegación

```tsx
<nav className="container py-4">
  <div className="flex gap-6">
    <Link to="/" className="nav-uppercase">Inicio</Link>
    <Link to="/cursos" className="nav-uppercase">Cursos</Link>
    <Link to="/blog" className="nav-uppercase">Blog</Link>
    <Link to="/contacto" className="btn-primary nav-uppercase">Contacto</Link>
  </div>
</nav>
```

### Ejemplo 3: Course Card

```tsx
<div className="card">
  <h3 className="text-card-title card-title-uppercase mb-3">
    Desarrollo Web Full Stack
  </h3>
  <p className="text-fluid-body text-neutral-600 mb-4">
    Aprende a crear aplicaciones web modernas con React y Node.js
  </p>
  <button className="btn-primary">Ver Detalles</button>
</div>
```

---

## Anti-Patrones a Evitar

❌ **NO HACER:**

1. **Todo en mayúsculas:**
```tsx
// MAL: Dificulta la lectura
<p className="uppercase">
  ESTE ES UN PÁRRAFO COMPLETO EN MAYÚSCULAS. ES MUY DIFÍCIL DE LEER PORQUE NO HAY DIFERENCIACIÓN VISUAL.
</p>
```

2. **Mayúsculas sin letter-spacing:**
```css
/* MAL: Las letras se juntan */
.title {
  text-transform: uppercase;
  /* Falta letter-spacing! */
}
```

3. **Mezclar demasiados pesos:**
```tsx
// MAL: Inconsistencia visual
<h2 className="font-light">TÍTULO LIGHT</h2>
<h3 className="font-bold">Título Bold</h3>
<h4 className="font-extrabold">TÍTULO EXTRABOLD</h4>
```

4. **Ignorar accesibilidad:**
```tsx
// MAL: Los screen readers leerán letra por letra
<h2 className="uppercase">
  C U R S O S
</h2>
```

5. **Longitud de línea excesiva:**
```css
/* MAL: Más de 100 caracteres dificulta la lectura */
p {
  max-width: 100%;
}
```

---

## Checklist de Implementación

✅ **Antes de Deployar:**

- [ ] Montserrat importada desde Google Fonts
- [ ] Títulos principales (H1, H2) en uppercase con letter-spacing adecuado
- [ ] Navegación en uppercase
- [ ] Course cards con títulos en uppercase
- [ ] Footer headings en uppercase
- [ ] Body text sin uppercase (lowercase/capitalize normal)
- [ ] Contraste de color verificado (WCAG AA)
- [ ] Fallback fonts configurados
- [ ] Responsive typography con clamp() funcional
- [ ] Accesibilidad aria-labels donde sea necesario

---

## Referencias y Recursos

### Herramientas Útiles

- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Google Fonts**: https://fonts.google.com/specimen/Montserrat
- **Type Scale Generator**: https://typescale.com/
- **Fluid Type Calculator**: https://modern-fluid-typography.vercel.app/

### Documentación Relacionada

- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Material Design Typography: https://m3.material.io/styles/typography
- CSS Text Module Level 3: https://www.w3.org/TR/css-text-3/

---

**Última Actualización:** 2025-11-09
**Versión:** 1.0
**Mantenido por:** SOLARIA AGENCY
**Proyecto:** CEP Formación v2
