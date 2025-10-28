# Fluid Responsive Design System

## Overview

The CEP Formación frontend uses a **fluid responsive design system** that adapts smoothly to ANY viewport width, not just discrete breakpoints. This ensures optimal user experience across all device sizes, from 320px mobile phones to 2560px+ ultra-wide displays.

## Key Principles

### 1. CSS Grid Auto-Fit
Cards and content blocks reorganize dynamically based on available space:

```css
.grid-fluid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}
```

**Behavior:**
- Mobile (375px): 1 column
- Tablet (768px): 2 columns
- Desktop (1280px): 3-4 columns
- Ultra-wide (2560px): 5+ columns

**Adaptability:** Columns reorganize at ANY width, not just breakpoints.

### 2. Clamp() Typography
Text scales proportionally with viewport using CSS clamp():

```css
.text-fluid-hero {
  font-size: clamp(1.75rem, 5vw, 3.75rem);
  /* Min: 28px, Ideal: 5% viewport, Max: 60px */
}
```

**Available Classes:**
- `.text-fluid-hero` - Hero headlines (28px → 60px)
- `.text-fluid-hero-sub` - Hero subtitles (16px → 24px)
- `.text-fluid-section-title` - Section titles (24px → 40px)
- `.text-fluid-body` - Body text (14px → 18px)

### 3. Fluid Spacing
Padding and gaps scale with viewport:

```jsx
<section style={{ padding: 'clamp(2.5rem, 8vw, 6rem) 0' }}>
  {/* Content */}
</section>
```

**Result:** Spacing adapts from 40px (mobile) to 96px (desktop).

## Grid Utilities

### Course Cards Grid
```css
.grid-fluid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}
```

**Use Case:** Course listings, blog posts, product grids

### Features Grid
```css
.grid-fluid-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2.5rem);
}
```

**Use Case:** Feature sections (max 3-4 items)

### Footer Grid
```css
.grid-fluid-footer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  gap: clamp(1.5rem, 4vw, 2.5rem);
}
```

**Use Case:** Footer columns (1-6 columns depending on width)

## Usage Examples

### Hero Section (HomePage.tsx)
```tsx
<section
  className="hero bg-gradient-to-r from-primary to-primary-light text-white"
  style={{ padding: 'clamp(2.5rem, 8vw, 6rem) 0' }}
>
  <div className="container">
    <div className="max-w-3xl xl:max-w-4xl mx-auto text-center">
      <h1 className="text-fluid-hero font-bold mb-4 md:mb-6">
        Formación Profesional de Calidad
      </h1>
      <p className="text-fluid-hero-sub mb-6 md:mb-8 opacity-90">
        Cursos presenciales, online y semipresenciales.
      </p>
    </div>
  </div>
</section>
```

### Course Cards Section
```tsx
<section className="bg-neutral-50" style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
  <div className="container">
    <h2 className="text-fluid-section-title font-bold mb-2">Cursos Destacados</h2>
    <p className="text-fluid-body text-neutral-600">
      Descubre nuestros cursos más populares
    </p>

    <div className="grid-fluid-cards">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  </div>
</section>
```

### Footer (App.tsx)
```tsx
<footer
  className="bg-neutral-900 text-white"
  style={{ padding: 'clamp(1.5rem, 4vw, 3rem) 0' }}
>
  <div className="container">
    <div className="grid-fluid-footer">
      <div>{/* Column 1 */}</div>
      <div>{/* Column 2 */}</div>
      <div>{/* Column 3 */}</div>
      <div>{/* Column 4 */}</div>
    </div>
  </div>
</footer>
```

## Testing Coverage

### Tested Viewports
- ✅ iPhone SE (375px) - 1 card column
- ✅ Intermediate (500px) - 1-2 card columns
- ✅ iPad Mini (768px) - 2 card columns
- ✅ Intermediate (950px) - 2-3 card columns
- ✅ MacBook Air (1280px) - 3-4 card columns
- ✅ Desktop (1440px) - 4 card columns
- ✅ iMac 27" (2560px) - 5+ card columns

### Zero Issues
- ✅ No horizontal scroll at any width
- ✅ Typography scales smoothly (no jumps)
- ✅ Gaps scale proportionally
- ✅ All elements readable at all sizes

## Advantages Over Discrete Breakpoints

### Traditional Approach (sm:/md:/lg:)
```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
  Title
</h1>
```
**Problems:**
- Only changes at specific widths (640px, 768px, 1024px, 1280px, 1536px)
- Awkward intermediate sizes (e.g., 950px, 1100px)
- Requires many class combinations

### Fluid Approach (clamp())
```tsx
<h1 className="text-fluid-hero">
  Title
</h1>
```
**Benefits:**
- Scales continuously at ANY width
- Single class, cleaner code
- Proportional to viewport (5vw)
- Guaranteed min/max bounds

## Browser Support

### CSS Grid auto-fit
- ✅ Chrome 57+ (2017)
- ✅ Firefox 52+ (2017)
- ✅ Safari 10.1+ (2017)
- ✅ Edge 16+ (2017)

### CSS clamp()
- ✅ Chrome 79+ (2019)
- ✅ Firefox 75+ (2020)
- ✅ Safari 13.1+ (2020)
- ✅ Edge 79+ (2020)

**Fallback Strategy:** Modern browsers only (95%+ coverage). For older browsers, consider graceful degradation or polyfills.

## Migration Guide

### Converting Existing Components

**Before (Discrete Breakpoints):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

**After (Fluid Responsive):**
```tsx
<div className="grid-fluid-cards">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

**Before (Typography):**
```tsx
<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
  Section Title
</h2>
```

**After (Fluid Typography):**
```tsx
<h2 className="text-fluid-section-title font-bold">
  Section Title
</h2>
```

## Performance Considerations

### CSS Grid Performance
- **Excellent:** CSS Grid is hardware-accelerated
- **No JavaScript:** Pure CSS, zero runtime cost
- **Reflow Optimized:** Browsers optimize grid layouts

### Clamp() Performance
- **Excellent:** Calculated once per viewport change
- **No JavaScript:** Pure CSS calculation
- **Low CPU Impact:** Minimal browser overhead

## Customization

### Creating New Fluid Classes

Add to `apps/web/src/index.css`:

```css
@layer utilities {
  /* Custom fluid text size */
  .text-fluid-custom {
    font-size: clamp(1rem, 3vw, 2rem);
    line-height: 1.4;
  }

  /* Custom fluid grid */
  .grid-fluid-custom {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
    gap: clamp(0.75rem, 2vw, 1.5rem);
  }
}
```

### Adjusting Existing Classes

**text-fluid-hero:** Change max size from 3.75rem (60px) to 4rem (64px):
```css
.text-fluid-hero {
  font-size: clamp(1.75rem, 5vw, 4rem); /* Changed from 3.75rem */
  line-height: 1.2;
}
```

**grid-fluid-cards:** Change min card width from 280px to 300px:
```css
.grid-fluid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); /* Changed from 280px */
  gap: clamp(1rem, 3vw, 2rem);
}
```

## Testing Tools

### Automated Testing
```bash
# Test all breakpoints (375px to 2560px)
node test-all-breakpoints.js

# Test fluid responsiveness (7 viewports)
node test-fluid-responsive.js

# Verify hero section (centering + colors)
node verify-hero.js
```

### Manual Testing
1. Open http://localhost:3001/ in Chrome DevTools
2. Use responsive design mode
3. Drag viewport to arbitrary widths (e.g., 500px, 950px, 1350px)
4. Verify:
   - Typography scales smoothly
   - Cards reorganize dynamically
   - No horizontal scroll
   - Gaps adapt proportionally

## Troubleshooting

### Issue: Cards Not Reorganizing
**Check:** Ensure parent has `.grid-fluid-cards` class
**Fix:** Verify no conflicting grid classes

### Issue: Text Too Small/Large
**Check:** Clamp() min/max values
**Fix:** Adjust values in index.css utility class

### Issue: Horizontal Scroll
**Check:** Elements exceeding viewport width
**Fix:** Use `max-width: 100%` on images/videos

### Issue: Gaps Not Scaling
**Check:** Fixed gap values (gap-4, gap-6)
**Fix:** Use clamp() in style prop or utility class

## Best Practices

1. **Use Fluid Classes First:** Default to `.grid-fluid-cards` and `.text-fluid-*` classes
2. **Discrete Breakpoints for UI Changes:** Use sm:/md:/lg: for showing/hiding navigation, sidebars
3. **Test Intermediate Widths:** Don't just test 375px, 768px, 1920px - try 500px, 950px, 1350px
4. **Avoid Fixed Widths:** Use max-width with percentage or clamp()
5. **Combine Approaches:** Fluid layout + breakpoint-based component visibility

## Future Enhancements

- [ ] Add fluid margin utilities (`.mt-fluid`, `.mb-fluid`)
- [ ] Create fluid container width (scales with viewport)
- [ ] Add fluid border-radius utilities
- [ ] Document component-specific patterns (forms, modals)
- [ ] Create Design Hub preview for fluid classes

---

**Last Updated:** 2025-10-28
**Status:** Production Ready
**Browser Support:** 95%+ (modern browsers)
