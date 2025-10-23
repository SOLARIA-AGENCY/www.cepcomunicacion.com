/**
 * Blog Detail Page
 *
 * Displays full blog post content with metadata, related posts, and CTAs.
 * Uses useParams to get slug from URL.
 * Includes 404 handling for non-existent posts.
 */

import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost, BlogPostCard } from '@components/ui';

// Static blog posts data (same as BlogPage - would be shared in production)
const blogPostsData: BlogPost[] = [
  {
    id: '1',
    slug: 'guia-completa-formacion-profesional-2025',
    title: 'Guía Completa de Formación Profesional 2025',
    excerpt:
      'Todo lo que necesitas saber sobre la Formación Profesional en España: tipos de ciclos, requisitos de acceso, salidas laborales y tendencias para 2025.',
    content: `
# Guía Completa de Formación Profesional 2025

La Formación Profesional (FP) en España se ha consolidado como una de las vías educativas más valoradas tanto por estudiantes como por empresas. En 2025, la demanda de profesionales con titulación de FP sigue en aumento, especialmente en sectores tecnológicos y de servicios.

## ¿Qué es la Formación Profesional?

La Formación Profesional es un conjunto de enseñanzas del sistema educativo español cuyo objetivo es preparar al alumnado para la actividad en un campo profesional, proporcionando una formación polivalente que permita adaptarse a las modificaciones laborales que pueden producirse a lo largo de su vida.

## Tipos de Ciclos Formativos

### Ciclos de Grado Medio

Los Ciclos Formativos de Grado Medio tienen una duración de 2.000 horas (2 años académicos) y preparan para el desempeño cualificado de las distintas profesiones, el acceso al empleo y la participación activa en la vida social, cultural y económica.

**Requisitos de acceso:**
- Título de Graduado en ESO
- Título Profesional Básico
- Superar una prueba de acceso
- Tener un título de Técnico o Técnico Superior

### Ciclos de Grado Superior

Los Ciclos Formativos de Grado Superior también tienen una duración de 2.000 horas y proporcionan una formación más especializada y compleja.

**Requisitos de acceso:**
- Título de Bachiller
- Título de Técnico (FP Grado Medio)
- Haber superado el segundo curso de Bachillerato
- Superar una prueba de acceso
- Tener un título universitario

## Salidas Laborales

La empleabilidad de los titulados en FP es muy alta. Según datos del Ministerio de Educación, más del 70% de los graduados en FP encuentran empleo en los primeros 6 meses tras finalizar sus estudios.

Los sectores con mayor demanda son:
- Desarrollo de aplicaciones (DAM, DAW)
- Marketing y comunicación digital
- Administración y finanzas
- Sanidad y servicios sociales
- Energías renovables

## Ventajas de la Formación Profesional

1. **Formación práctica:** 400 horas de prácticas en empresas
2. **Alta empleabilidad:** Conexión directa con el mercado laboral
3. **Flexibilidad:** Modalidades presencial, online y semipresencial
4. **Titulación oficial:** Válida en toda Europa
5. **Acceso a universidad:** Posibilidad de convalidación de créditos

## Conclusión

La Formación Profesional es una excelente opción para quienes buscan una formación práctica, orientada al empleo y con altas tasas de inserción laboral. En CEP Formación te ayudamos a elegir el ciclo que mejor se adapte a tus necesidades y objetivos profesionales.

¿Listo para empezar tu formación? [Explora nuestros ciclos](/cursos) o [solicita información](/contacto).
    `,
    featured_image: 'https://placehold.co/1200x600/3b82f6/ffffff?text=Formación+Profesional',
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
    content: `
# Becas y Ayudas para Cursos: Ocupados y Desempleados

Financiar tu formación profesional es más accesible de lo que piensas. En España existen múltiples programas de becas y subvenciones destinadas tanto a personas ocupadas como desempleadas que desean mejorar sus competencias profesionales.

## Ayudas para Ocupados

### Fundae (Fundación Estatal para la Formación en el Empleo)

Las empresas tienen crédito de formación que pueden destinar a la formación de sus empleados. Esta es la vía más común para acceder a formación gratuita si estás trabajando.

**Características:**
- 100% subvencionado para la empresa
- Sin coste para el trabajador
- Amplio catálogo de cursos
- Certificación oficial

### Bonificaciones de la Seguridad Social

Las empresas pueden bonificar la formación de sus trabajadores descontándola de las cuotas de la Seguridad Social.

## Ayudas para Desempleados

### Cursos del SEPE

El Servicio Público de Empleo Estatal (SEPE) ofrece formación gratuita para personas desempleadas en sectores con alta demanda laboral.

**Ventajas:**
- Formación 100% gratuita
- Certificado de profesionalidad oficial
- Posibilidad de beca de transporte
- Orientación laboral incluida

### Programas Autonómicos

Cada comunidad autónoma tiene sus propios programas de ayudas. En general, cubren:
- Matrícula completa
- Material didáctico
- Transporte (en algunos casos)
- Comidas (en formación presencial)

## Becas Generales

### Becas del Ministerio de Educación

Para ciclos formativos de grado medio y superior, puedes solicitar:
- Beca de matrícula
- Beca de material
- Beca de transporte
- Beca de residencia (si estudias fuera de tu localidad)

**Requisitos:**
- Cumplir requisitos académicos
- Cumplir requisitos económicos
- Matricularse en centro oficial

### Becas de Entidades Privadas

Fundaciones y empresas ofrecen becas específicas:
- Fundación Telefónica
- Fundación ONCE
- Fundación La Caixa
- Becas de colegios profesionales

## Cómo Solicitar las Ayudas

1. **Identifica tu situación:** Ocupado, desempleado, estudiante
2. **Consulta los plazos:** Las convocatorias tienen fechas específicas
3. **Reúne la documentación:** DNI, certificado de empadronamiento, vida laboral, etc.
4. **Presenta la solicitud:** Online o presencialmente según la ayuda
5. **Haz seguimiento:** Verifica el estado de tu solicitud

## Consejos Importantes

- **Solicita con antelación:** Los plazos son limitados
- **No dejes pasar las fechas:** Muchas ayudas se pierden por presentación tardía
- **Consulta con nosotros:** En CEP Formación te asesoramos sobre las ayudas disponibles
- **Mantén toda la documentación:** Será necesaria para justificaciones posteriores

## Contacta con Nosotros

¿Necesitas ayuda para solicitar becas o subvenciones? Nuestro equipo de orientación está disponible para asesorarte de forma gratuita. [Contacta con nosotros](/contacto) y te ayudaremos a encontrar la mejor opción de financiación para tu formación.
    `,
    featured_image: 'https://placehold.co/1200x600/10b981/ffffff?text=Becas+y+Ayudas',
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
    content: `
# Presencial vs Online vs Híbrida: ¿Qué Modalidad Elegir?

Elegir la modalidad de formación adecuada es crucial para el éxito de tus estudios. Cada modalidad tiene sus ventajas y desventajas, y la elección depende de tu situación personal, estilo de aprendizaje y objetivos profesionales.

## Formación Presencial

### Ventajas
- **Interacción directa** con profesores y compañeros
- **Networking** natural en el aula
- **Estructura fija** que facilita la disciplina
- **Acceso inmediato** a instalaciones y equipamiento
- **Resolución instantánea** de dudas

### Desventajas
- Requiere desplazamiento
- Horarios menos flexibles
- Mayor inversión de tiempo total
- Dependencia de la ubicación geográfica

### ¿Para quién es ideal?
- Personas con horarios regulares
- Quienes valoran la interacción social
- Estudiantes que aprenden mejor en entorno estructurado
- Profesiones que requieren práctica con equipamiento específico

## Formación Online (Telemática)

### Ventajas
- **Flexibilidad total** de horarios
- **Ahorro de tiempo** en desplazamientos
- **Acceso desde cualquier lugar**
- Ritmo de estudio personalizado
- Compatibilidad con trabajo y vida personal

### Desventajas
- Requiere autodisciplina
- Menos interacción social
- Necesita buena conexión a internet
- Puede generar sensación de aislamiento

### ¿Para quién es ideal?
- Profesionales que trabajan
- Personas con responsabilidades familiares
- Estudiantes de zonas rurales
- Quienes prefieren autonomía en el aprendizaje

## Formación Semipresencial (Híbrida)

### Ventajas
- **Lo mejor de ambos mundos**
- Flexibilidad con estructura
- Networking ocasional
- Prácticas presenciales + teoría online
- Equilibrio trabajo-estudio-vida

### Desventajas
- Requiere organización adicional
- Algunos desplazamientos necesarios
- Necesita adaptación a dos formatos

### ¿Para quién es ideal?
- Personas con cierta flexibilidad horaria
- Quienes buscan equilibrio
- Estudiantes que necesitan práctica supervisada
- Profesionales que valoran networking pero necesitan flexibilidad

## Comparativa Rápida

| Aspecto | Presencial | Online | Semipresencial |
|---------|-----------|--------|----------------|
| Flexibilidad | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Interacción | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Autonomía necesaria | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Coste tiempo | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Networking | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |

## Cómo Elegir

### Hazte estas preguntas:

1. **¿Cuánto tiempo puedo dedicar?**
   - Mucho tiempo → Presencial
   - Poco tiempo → Online
   - Tiempo intermitente → Semipresencial

2. **¿Cómo aprendo mejor?**
   - Con guía constante → Presencial
   - De forma autónoma → Online
   - Combinando ambos → Semipresencial

3. **¿Qué es prioritario para mí?**
   - Networking → Presencial
   - Flexibilidad → Online
   - Equilibrio → Semipresencial

## Nuestra Recomendación

En CEP Formación ofrecemos las tres modalidades para que elijas la que mejor se adapte a ti. No hay una opción "mejor" universal, sino la mejor opción **para tu situación específica**.

¿Necesitas ayuda para decidir? [Contacta con nuestro equipo de orientación](/contacto) y te ayudaremos a elegir la modalidad ideal para tus circunstancias.
    `,
    featured_image: 'https://placehold.co/1200x600/f59e0b/ffffff?text=Modalidades',
    category: 'Consejos',
    author: 'Laura Martínez',
    published_at: '2025-03-05',
    reading_time: 5,
  },
  // Add remaining posts with minimal content placeholders
  {
    id: '4',
    slug: 'testimonios-exito-graduados-cep-formacion',
    title: 'Casos de Éxito: Historias de Nuestros Graduados',
    excerpt:
      'Conoce las historias inspiradoras de estudiantes que transformaron sus carreras profesionales tras completar su formación en CEP Formación.',
    content: 'Contenido completo del artículo aquí...',
    featured_image: 'https://placehold.co/1200x600/ec4899/ffffff?text=Casos+Éxito',
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
    content: 'Contenido completo del artículo aquí...',
    featured_image: 'https://placehold.co/1200x600/8b5cf6/ffffff?text=Mercado+Laboral',
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
    content: 'Contenido completo del artículo aquí...',
    featured_image: 'https://placehold.co/1200x600/06b6d4/ffffff?text=Entrevistas',
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
    content: 'Contenido completo del artículo aquí...',
    featured_image: 'https://placehold.co/1200x600/3b82f6/ffffff?text=Nuevos+Ciclos',
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
    content: 'Contenido completo del artículo aquí...',
    featured_image: 'https://placehold.co/1200x600/10b981/ffffff?text=Formación+Continua',
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
    content: 'Contenido completo del artículo aquí...',
    featured_image: 'https://placehold.co/1200x600/f59e0b/ffffff?text=Inscripción',
    category: 'Guías',
    author: 'Rosa Fernández',
    published_at: '2025-01-30',
    reading_time: 7,
  },
];

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // Find the blog post by slug
  const post = useMemo(() => {
    return blogPostsData.find((p) => p.slug === slug);
  }, [slug]);

  // Get related posts (same category, excluding current post)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogPostsData
      .filter((p) => p.category === post.category && p.id !== post.id)
      .slice(0, 3);
  }, [post]);

  // Memoized formatted date
  const formattedDate = useMemo(() => {
    if (!post) return '';
    const date = new Date(post.published_at);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, [post]);

  // 404 - Post not found
  if (!post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-neutral-900">404 - Artículo No Encontrado</h1>
        <p className="text-xl text-neutral-600 mb-8">
          Lo sentimos, el artículo que buscas no existe o ha sido eliminado.
        </p>
        <Link to="/blog" className="btn-primary">
          Volver al Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${post.featured_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-neutral-300">
                <li>
                  <Link to="/" className="hover:text-white">
                    Inicio
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link to="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white font-semibold">{post.category}</li>
              </ol>
            </nav>

            {/* Category Badge */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-neutral-300">
              {/* Author */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{post.author}</span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time dateTime={post.published_at}>{formattedDate}</time>
              </div>

              {/* Reading Time */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{post.reading_time} min de lectura</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Excerpt */}
            <div className="text-xl text-neutral-700 mb-8 p-6 bg-neutral-50 rounded-lg border-l-4 border-primary">
              {post.excerpt}
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none text-neutral-800">
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900">Compartir artículo</h3>
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Compartir en Facebook"
                >
                  Facebook
                </button>
                <button
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  aria-label="Compartir en Twitter"
                >
                  Twitter
                </button>
                <button
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  aria-label="Compartir en LinkedIn"
                >
                  LinkedIn
                </button>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-primary text-white rounded-xl text-center">
              <h3 className="text-2xl font-bold mb-2">¿Te ha gustado este artículo?</h3>
              <p className="text-lg mb-6 opacity-90">
                Explora nuestros cursos y da el siguiente paso en tu carrera profesional
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/cursos" className="btn-primary bg-white text-primary hover:bg-neutral-100">
                  Ver Cursos
                </Link>
                <Link
                  to="/contacto"
                  className="btn-secondary border-white text-white hover:bg-white hover:text-primary"
                >
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-neutral-50">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-neutral-900">Artículos Relacionados</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
