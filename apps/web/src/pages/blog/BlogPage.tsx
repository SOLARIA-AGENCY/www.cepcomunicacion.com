/**
 * Blog Page
 *
 * Blog listing page with category filtering and search.
 * Uses static blog post data (can be migrated to backend later).
 * Optimized with useMemo for filtered posts.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '@components/ui';
import { BlogPostCard } from '@components/ui';

// Static blog posts data (will be replaced with API calls in future)
const blogPostsData: BlogPost[] = [
  {
    id: '1',
    slug: 'guia-completa-formacion-profesional-2025',
    title: 'Guía Completa de Formación Profesional 2025',
    excerpt:
      'Todo lo que necesitas saber sobre la Formación Profesional en España: tipos de ciclos, requisitos de acceso, salidas laborales y tendencias para 2025.',
    content: '...',
    featured_image: 'https://placehold.co/600x400/3b82f6/ffffff?text=Formación+Profesional',
    category: 'Guías',
    author: 'María García',
    published_at: '2025-03-15',
    reading_time: 8,
  },
  {
    id: '2',
    slug: 'becas-ayudas-cursos-ocupados-desempleados',
    title: 'Becas y Ayudas para Cursos: Ocupados y Desempleados',
    excerpt:
      'Descubre todas las becas, subvenciones y ayudas disponibles para financiar tu formación profesional en 2025, tanto si estás trabajando como en búsqueda de empleo.',
    content: '...',
    featured_image: 'https://placehold.co/600x400/10b981/ffffff?text=Becas+y+Ayudas',
    category: 'Guías',
    author: 'Carlos Pérez',
    published_at: '2025-03-10',
    reading_time: 6,
  },
  {
    id: '3',
    slug: 'diferencias-formacion-presencial-online-hibrida',
    title: 'Presencial vs Online vs Híbrida: ¿Qué Modalidad Elegir?',
    excerpt:
      'Comparamos las tres modalidades de formación disponibles: presencial, online y semipresencial. Ventajas, desventajas y consejos para elegir la mejor opción según tu situación.',
    content: '...',
    featured_image: 'https://placehold.co/600x400/f59e0b/ffffff?text=Modalidades',
    category: 'Consejos',
    author: 'Laura Martínez',
    published_at: '2025-03-05',
    reading_time: 5,
  },
  {
    id: '4',
    slug: 'testimonios-exito-graduados-cep-formacion',
    title: 'Casos de Éxito: Historias de Nuestros Graduados',
    excerpt:
      'Conoce las historias inspiradoras de estudiantes que transformaron sus carreras profesionales tras completar su formación en CEP Formación.',
    content: '...',
    featured_image: 'https://placehold.co/600x400/ec4899/ffffff?text=Casos+Éxito',
    category: 'Casos de Éxito',
    author: 'Ana López',
    published_at: '2025-02-28',
    reading_time: 7,
  },
  {
    id: '5',
    slug: 'tendencias-mercado-laboral-2025-sectores-demanda',
    title: 'Tendencias del Mercado Laboral 2025: Sectores en Alta Demanda',
    excerpt:
      'Análisis de los sectores profesionales con mayor demanda en 2025 y cómo prepararte para aprovechar las mejores oportunidades laborales.',
    content: '...',
    featured_image: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Mercado+Laboral',
    category: 'Noticias',
    author: 'David Sánchez',
    published_at: '2025-02-20',
    reading_time: 10,
  },
  {
    id: '6',
    slug: 'como-preparar-entrevista-trabajo-fp',
    title: 'Cómo Preparar una Entrevista de Trabajo tras tu FP',
    excerpt:
      'Consejos prácticos para afrontar entrevistas de trabajo después de completar tu Formación Profesional: qué destacar, qué evitar y cómo impresionar al reclutador.',
    content: '...',
    featured_image: 'https://placehold.co/600x400/06b6d4/ffffff?text=Entrevistas',
    category: 'Consejos',
    author: 'Elena Ruiz',
    published_at: '2025-02-15',
    reading_time: 6,
  },
  {
    id: '7',
    slug: 'nuevos-ciclos-formativos-cep-2025',
    title: 'Nuevos Ciclos Formativos Disponibles en CEP para 2025',
    excerpt:
      'Anunciamos la apertura de nuevos ciclos formativos en áreas de alta demanda: Desarrollo de Aplicaciones, Marketing Digital y Gestión Administrativa.',
    content: '...',
    featured_image: 'https://placehold.co/600x400/3b82f6/ffffff?text=Nuevos+Ciclos',
    category: 'Noticias',
    author: 'CEP Formación',
    published_at: '2025-02-10',
    reading_time: 4,
  },
  {
    id: '8',
    slug: 'importancia-formacion-continua-profesionales',
    title: 'La Importancia de la Formación Continua para Profesionales',
    excerpt:
      'Por qué la formación continua es clave para mantenerte competitivo en el mercado laboral y cómo puede impulsar tu carrera profesional.',
    content: '...',
    featured_image: 'https://placehold.co/600x400/10b981/ffffff?text=Formación+Continua',
    category: 'Opinión',
    author: 'Miguel Torres',
    published_at: '2025-02-05',
    reading_time: 5,
  },
  {
    id: '9',
    slug: 'proceso-inscripcion-paso-paso',
    title: 'Proceso de Inscripción Paso a Paso en CEP Formación',
    excerpt:
      'Guía detallada del proceso de inscripción en CEP Formación: desde la consulta inicial hasta la confirmación de plaza. Todo lo que necesitas saber.',
    content: '...',
    featured_image: 'https://placehold.co/600x400/f59e0b/ffffff?text=Inscripción',
    category: 'Guías',
    author: 'Rosa Fernández',
    published_at: '2025-01-30',
    reading_time: 7,
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPostsData.map((post) => post.category)));
    return ['all', ...cats.sort()];
  }, []);

  // Filter blog posts based on category and search
  const filteredPosts = useMemo(() => {
    let filtered = blogPostsData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="blog-page py-12">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-neutral-900">Blog de CEP Formación</h1>
          <p className="text-xl text-neutral-600">
            Noticias, consejos y guías sobre formación profesional, mercado laboral y desarrollo de
            carrera
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <label htmlFor="blog-search" className="form-label">
              Buscar artículos
            </label>
            <div className="relative">
              <input
                id="blog-search"
                type="text"
                className="form-input pl-10"
                placeholder="Buscar por título, contenido o autor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat === 'all' ? 'Todas las Categorías' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center text-neutral-600">
          {filteredPosts.length === 0 ? (
            <p>No se encontraron artículos</p>
          ) : (
            <p>
              Mostrando {filteredPosts.length} {filteredPosts.length === 1 ? 'artículo' : 'artículos'}
            </p>
          )}
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-neutral-600 mb-4">
              Intenta con otros términos de búsqueda o selecciona otra categoría
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-primary hover:underline font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          // Blog Posts Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 max-w-3xl mx-auto p-8 bg-neutral-50 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-2 text-neutral-900">
            ¿Listo para dar el siguiente paso?
          </h3>
          <p className="text-neutral-600 mb-6">
            Explora nuestros cursos y encuentra la formación perfecta para tu carrera profesional
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cursos" className="btn-primary">
              Ver Todos los Cursos
            </Link>
            <Link to="/contacto" className="btn-secondary">
              Solicitar Información
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
