/**
 * FAQ Page
 *
 * Frequently Asked Questions page with search and accordion components.
 * Optimized with useMemo for filtered FAQs.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Accordion } from '@components/ui';

// FAQ data structure
interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

// FAQ data (hardcoded for now, can be moved to backend later)
const faqsData: FAQ[] = [
  // Inscripciones
  {
    id: 1,
    category: 'Inscripciones',
    question: '¿Cómo me inscribo en un curso?',
    answer:
      'Para inscribirte en un curso, puedes hacerlo a través de nuestra página web rellenando el formulario de contacto, o bien llamándonos directamente. Te proporcionaremos toda la información necesaria y te guiaremos en el proceso de matriculación.',
  },
  {
    id: 2,
    category: 'Inscripciones',
    question: '¿Cuál es el plazo de inscripción?',
    answer:
      'El plazo de inscripción permanece abierto hasta el inicio del curso, siempre que haya plazas disponibles. Te recomendamos inscribirte con antelación para asegurar tu plaza, especialmente en los cursos más demandados.',
  },
  {
    id: 3,
    category: 'Inscripciones',
    question: '¿Puedo inscribirme en varios cursos a la vez?',
    answer:
      'Sí, puedes inscribirte en varios cursos simultáneamente siempre que los horarios sean compatibles. Nuestro equipo de atención al estudiante te ayudará a planificar tu calendario de formación.',
  },

  // Pagos y Ayudas
  {
    id: 4,
    category: 'Pagos y Ayudas',
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos diferentes métodos de pago: transferencia bancaria, tarjeta de crédito/débito, y financiación sin intereses. También tramitamos ayudas y subvenciones disponibles para facilitar el acceso a la formación.',
  },
  {
    id: 5,
    category: 'Pagos y Ayudas',
    question: '¿Ofrecen planes de financiación?',
    answer:
      'Sí, disponemos de planes de financiación flexibles sin intereses que puedes personalizar según tus necesidades. Consulta con nuestro departamento de administración para conocer las opciones disponibles.',
  },
  {
    id: 6,
    category: 'Pagos y Ayudas',
    question: '¿Hay becas o ayudas disponibles?',
    answer:
      'Sí, muchos de nuestros cursos cuentan con becas y subvenciones públicas. Dependiendo del curso y tu situación (ocupado, desempleado), podrías acceder a financiación parcial o total. Te asesoramos sobre las ayudas disponibles en cada momento.',
  },

  // Cursos y Modalidades
  {
    id: 7,
    category: 'Cursos y Modalidades',
    question: '¿Qué modalidades de estudio ofrecen?',
    answer:
      'Ofrecemos tres modalidades de estudio: presencial (clases en nuestras sedes), online (100% telemático con acceso a plataforma virtual), y semipresencial (combinación de ambas). Tú eliges la que mejor se adapte a tu disponibilidad.',
  },
  {
    id: 8,
    category: 'Cursos y Modalidades',
    question: '¿Los cursos online son en directo o grabados?',
    answer:
      'Nuestros cursos online combinan clases en directo (con posibilidad de interacción con el docente) y contenido pregrabado disponible 24/7 en nuestra plataforma. Así tienes flexibilidad y también el apoyo del profesorado.',
  },
  {
    id: 9,
    category: 'Cursos y Modalidades',
    question: '¿Cuánto duran los cursos?',
    answer:
      'La duración varía según el tipo de formación. Los cursos de Formación Profesional para el Empleo suelen durar entre 100 y 600 horas, mientras que los Ciclos Formativos tienen una duración de 1 o 2 años académicos. Consulta cada programa específico para más detalles.',
  },

  // Certificaciones
  {
    id: 10,
    category: 'Certificaciones',
    question: '¿Los cursos están homologados?',
    answer:
      'Sí, todos nuestros cursos están homologados por las autoridades educativas correspondientes. Los Ciclos Formativos están reconocidos por el Ministerio de Educación y los cursos de Formación para el Empleo por el SEPE.',
  },
  {
    id: 11,
    category: 'Certificaciones',
    question: '¿Qué certificado obtendré al finalizar?',
    answer:
      'Al finalizar el curso con aprovechamiento, recibirás un certificado oficial que acredita las competencias adquiridas. En el caso de los Ciclos Formativos, obtendrás un título de FP oficial con validez en toda Europa.',
  },
  {
    id: 12,
    category: 'Certificaciones',
    question: '¿El certificado tiene validez internacional?',
    answer:
      'Los títulos de Formación Profesional tienen validez en toda la Unión Europea gracias al Marco Europeo de Cualificaciones. Para otros países, depende de los acuerdos bilaterales y puede requerir homologación.',
  },

  // Requisitos
  {
    id: 13,
    category: 'Requisitos',
    question: '¿Qué requisitos necesito para inscribirme?',
    answer:
      'Los requisitos varían según el curso. Para cursos de Formación para el Empleo, generalmente no hay requisitos previos. Para Ciclos Formativos de Grado Medio se requiere ESO o equivalente, y para Grado Superior, Bachillerato o equivalente. Consulta los requisitos específicos de cada programa.',
  },
  {
    id: 14,
    category: 'Requisitos',
    question: '¿Necesito experiencia previa?',
    answer:
      'No es necesario tener experiencia previa en la mayoría de nuestros cursos. Nuestros programas están diseñados para adaptarse a diferentes niveles, desde principiantes hasta profesionales que buscan especialización.',
  },

  // Soporte
  {
    id: 15,
    category: 'Soporte',
    question: '¿Ofrecen orientación laboral?',
    answer:
      'Sí, disponemos de un departamento de orientación laboral que te asesora en la búsqueda de empleo, elaboración de CV, preparación de entrevistas y acceso a nuestra bolsa de trabajo con ofertas de empresas colaboradoras.',
  },
  {
    id: 16,
    category: 'Soporte',
    question: '¿Puedo contactar con los profesores fuera del horario de clase?',
    answer:
      'Sí, nuestros profesores están disponibles a través de la plataforma virtual para resolver dudas mediante foros, mensajería o tutorías programadas. También puedes solicitar tutorías individuales según la disponibilidad del docente.',
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqsData.map((faq) => faq.category)));
    return ['all', ...cats];
  }, []);

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqsData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Group FAQs by category for display
  const groupedFAQs = useMemo(() => {
    const groups: Record<string, FAQ[]> = {};

    filteredFAQs.forEach((faq) => {
      if (!groups[faq.category]) {
        groups[faq.category] = [];
      }
      groups[faq.category].push(faq);
    });

    return groups;
  }, [filteredFAQs]);

  return (
    <div className="faq-page py-12">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-neutral-900">Preguntas Frecuentes</h1>
          <p className="text-xl text-neutral-600">
            Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros cursos y
            servicios
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-3xl mx-auto mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <label htmlFor="faq-search" className="form-label">
              Buscar en las FAQs
            </label>
            <div className="relative">
              <input
                id="faq-search"
                type="text"
                className="form-input pl-10"
                placeholder="Escribe tu pregunta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
          <div className="flex flex-wrap gap-2">
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
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Display */}
        <div className="max-w-3xl mx-auto">
          {filteredFAQs.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-neutral-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
            // Display grouped FAQs
            <div className="space-y-8">
              {Object.entries(groupedFAQs).map(([category, faqs]) => (
                <div key={category}>
                  {/* Category Header */}
                  {selectedCategory === 'all' && (
                    <h2 className="text-2xl font-bold mb-4 text-neutral-900">{category}</h2>
                  )}

                  {/* Accordions */}
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <Accordion key={faq.id} title={faq.question}>
                        <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
                      </Accordion>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto mt-12 p-8 bg-neutral-50 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-2 text-neutral-900">¿No encuentras tu respuesta?</h3>
          <p className="text-neutral-600 mb-6">
            Nuestro equipo está disponible para ayudarte con cualquier duda adicional
          </p>
          <Link to="/contacto" className="btn-primary">
            Contactar con Nosotros
          </Link>
        </div>
      </div>
    </div>
  );
}
