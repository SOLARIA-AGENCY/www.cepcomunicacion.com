/**
 * Design Hub Page
 *
 * Interactive design system playground for adjusting:
 * - Typography
 * - Colors
 * - Spacing
 * - Border Radius
 * - Shadows
 * - Component previews
 */

'use client';

import { useState, useEffect } from 'react';
import { CourseCard } from '@/components/ui';
import type { Course } from '@/lib/payloadClient';

// Mock course for preview
const mockCourse: Course = {
  id: 'mock-1',
  name: 'Desarrollo Web Full Stack',
  description: 'Aprende a desarrollar aplicaciones web completas con las tecnologías más demandadas del mercado.',
  slug: 'desarrollo-web-full-stack',
  modality: 'presencial',
  course_type: 'telematico',
  cycle: 'mock-cycle' as any,
  featured: true,
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function DesignHubPage() {
  // Typography State
  const [h1Size, setH1Size] = useState(40);
  const [h2Size, setH2Size] = useState(32);
  const [h3Size, setH3Size] = useState(24);
  const [bodySize, setBodySize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [fontWeight, setFontWeight] = useState('normal');

  // Color State
  const [primaryColor, setPrimaryColor] = useState('#1e40af');
  const [secondaryColor, setSecondaryColor] = useState('#059669');
  const [accentColor, setAccentColor] = useState('#ea580c');

  // Spacing State
  const [spacing, setSpacing] = useState(16);

  // Border Radius State
  const [borderRadius, setBorderRadius] = useState(12);

  // Shadow State
  const [shadowIntensity, setShadowIntensity] = useState(0.1);

  // Apply styles dynamically to root
  useEffect(() => {
    const root = document.documentElement;

    // Typography
    root.style.setProperty('--h1-size', `${h1Size}px`);
    root.style.setProperty('--h2-size', `${h2Size}px`);
    root.style.setProperty('--h3-size', `${h3Size}px`);
    root.style.setProperty('--body-size', `${bodySize}px`);
    root.style.setProperty('--line-height', `${lineHeight}`);

    // Colors
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-secondary', secondaryColor);
    root.style.setProperty('--color-accent', accentColor);

    // Spacing
    root.style.setProperty('--spacing-md', `${spacing}px`);

    // Border Radius
    root.style.setProperty('--radius-xl', `${borderRadius}px`);

    // Shadows
    root.style.setProperty('--shadow-md', `0 4px 6px -1px rgb(0 0 0 / ${shadowIntensity})`);
  }, [h1Size, h2Size, h3Size, bodySize, lineHeight, primaryColor, secondaryColor, accentColor, spacing, borderRadius, shadowIntensity]);

  const resetDefaults = () => {
    setH1Size(40);
    setH2Size(32);
    setH3Size(24);
    setBodySize(16);
    setLineHeight(1.6);
    setFontWeight('normal');
    setPrimaryColor('#1e40af');
    setSecondaryColor('#059669');
    setAccentColor('#ea580c');
    setSpacing(16);
    setBorderRadius(12);
    setShadowIntensity(0.1);
  };

  const exportCSS = () => {
    const css = `
/* CEP Formación - Custom Design System */
:root {
  /* Typography */
  --h1-size: ${h1Size}px;
  --h2-size: ${h2Size}px;
  --h3-size: ${h3Size}px;
  --body-size: ${bodySize}px;
  --line-height: ${lineHeight};

  /* Colors */
  --color-primary: ${primaryColor};
  --color-secondary: ${secondaryColor};
  --color-accent: ${accentColor};

  /* Spacing */
  --spacing-md: ${spacing}px;

  /* Border Radius */
  --radius-xl: ${borderRadius}px;

  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / ${shadowIntensity});
}

h1 { font-size: var(--h1-size); }
h2 { font-size: var(--h2-size); }
h3 { font-size: var(--h3-size); }
body { font-size: var(--body-size); line-height: var(--line-height); }
`;
    navigator.clipboard.writeText(css);
    alert('CSS copiado al portapapeles!');
  };

  return (
    <div className="design-hub bg-neutral-50 min-h-screen py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-left">🎨 Design Hub</h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 mb-4 sm:mb-6 text-left">
            Playground interactivo para ajustar el sistema de diseño
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start">
            <button onClick={resetDefaults} className="btn-secondary text-sm md:text-base">
              Resetear Valores
            </button>
            <button onClick={exportCSS} className="btn-primary text-sm md:text-base">
              Exportar CSS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Typography Controls */}
            <div className="card bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-primary">📝 Tipografía</h2>

              <div className="space-y-4">
                <div>
                  <label className="form-label">H1 Size: {h1Size}px</label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={h1Size}
                    onChange={(e) => setH1Size(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="form-label">H2 Size: {h2Size}px</label>
                  <input
                    type="range"
                    min="20"
                    max="56"
                    value={h2Size}
                    onChange={(e) => setH2Size(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="form-label">H3 Size: {h3Size}px</label>
                  <input
                    type="range"
                    min="16"
                    max="40"
                    value={h3Size}
                    onChange={(e) => setH3Size(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="form-label">Body Size: {bodySize}px</label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={bodySize}
                    onChange={(e) => setBodySize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="form-label">Line Height: {lineHeight}</label>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="form-label">Font Weight</label>
                  <select
                    value={fontWeight}
                    onChange={(e) => setFontWeight(e.target.value)}
                    className="form-input"
                  >
                    <option value="300">Light (300)</option>
                    <option value="normal">Normal (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="bold">Bold (700)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Color Controls */}
            <div className="card bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-primary">🎨 Colores</h2>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10 border-2 border-neutral-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-16 h-10 border-2 border-neutral-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-16 h-10 border-2 border-neutral-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing Controls */}
            <div className="card bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-primary">📏 Espaciado</h2>

              <div>
                <label className="form-label">Base Spacing: {spacing}px</label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={spacing}
                  onChange={(e) => setSpacing(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Border Radius Controls */}
            <div className="card bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-primary">🔲 Border Radius</h2>

              <div>
                <label className="form-label">Card Radius: {borderRadius}px</label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Shadow Controls */}
            <div className="card bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-primary">💫 Sombras</h2>

              <div>
                <label className="form-label">Shadow Intensity: {(shadowIntensity * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={shadowIntensity}
                  onChange={(e) => setShadowIntensity(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-6 sm:space-y-8">
            {/* Typography Preview */}
            <div className="card bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-primary text-left">Vista Previa: Tipografía</h2>
              <div className="space-y-4" style={{ fontWeight }}>
                <h1 style={{ fontSize: `${h1Size}px`, lineHeight }} className="text-left">
                  Heading 1: Formación Profesional de Calidad
                </h1>
                <h2 style={{ fontSize: `${h2Size}px`, lineHeight }} className="text-left">
                  Heading 2: Cursos Destacados
                </h2>
                <h3 style={{ fontSize: `${h3Size}px`, lineHeight }} className="text-left">
                  Heading 3: Desarrollo Web Full Stack
                </h3>
                <p style={{ fontSize: `${bodySize}px`, lineHeight }} className="text-neutral-600 text-left">
                  Cuerpo de texto: Aprende a desarrollar aplicaciones web completas con las tecnologías más
                  demandadas del mercado. Este curso te preparará para trabajar como desarrollador Full Stack
                  con React, Node.js, bases de datos y servicios en la nube.
                </p>
              </div>
            </div>

            {/* Color Preview */}
            <div className="card bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-primary text-left">Vista Previa: Colores</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div
                    className="h-24 rounded-lg mb-2"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <p className="text-sm font-semibold text-left">Primary</p>
                  <p className="text-xs text-neutral-600 text-left">{primaryColor}</p>
                </div>
                <div>
                  <div
                    className="h-24 rounded-lg mb-2"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  <p className="text-sm font-semibold text-left">Secondary</p>
                  <p className="text-xs text-neutral-600 text-left">{secondaryColor}</p>
                </div>
                <div>
                  <div
                    className="h-24 rounded-lg mb-2"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <p className="text-sm font-semibold text-left">Accent</p>
                  <p className="text-xs text-neutral-600 text-left">{accentColor}</p>
                </div>
              </div>
            </div>

            {/* Buttons Preview */}
            <div className="card bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-primary text-left">Vista Previa: Botones</h2>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-secondary">Secondary Button</button>
                <button
                  className="px-6 py-3 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Accent Button
                </button>
              </div>
            </div>

            {/* Course Card Preview */}
            <div className="card bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-primary text-left">Vista Previa: Course Card</h2>
              <div className="max-w-md">
                <CourseCard course={mockCourse} />
              </div>
            </div>

            {/* Form Elements Preview */}
            <div className="card bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-primary text-left">Vista Previa: Formularios</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="form-label text-left block">Nombre</label>
                  <input type="text" placeholder="Tu nombre" className="form-input text-left" />
                </div>
                <div>
                  <label className="form-label text-left block">Email</label>
                  <input type="email" placeholder="tu@email.com" className="form-input text-left" />
                </div>
                <div>
                  <label className="form-label text-left block">Mensaje</label>
                  <textarea placeholder="Tu mensaje" className="form-input text-left" rows={4}></textarea>
                </div>
                <button className="btn-primary w-full">Enviar</button>
              </div>
            </div>

            {/* Spacing Preview */}
            <div className="card bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-primary text-left">Vista Previa: Espaciado</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary h-12 rounded" style={{ width: `${spacing * 2}px` }}></div>
                  <span className="text-sm text-left">2x spacing = {spacing * 2}px</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-secondary h-12 rounded" style={{ width: `${spacing * 3}px` }}></div>
                  <span className="text-sm text-left">3x spacing = {spacing * 3}px</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-accent h-12 rounded" style={{ width: `${spacing * 4}px` }}></div>
                  <span className="text-sm text-left">4x spacing = {spacing * 4}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
