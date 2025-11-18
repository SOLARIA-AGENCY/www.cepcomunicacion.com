/**
 * FAQ Page
 *
 * Frequently Asked Questions
 */

'use client';

import Link from 'next/link';
import { Accordion } from '@/components/ui';

const faqs = [
  {
    question: '¿Cómo puedo inscribirme en un curso?',
    answer:
      'Puedes inscribirte directamente a través de nuestra página web seleccionando el curso de tu interés y completando el formulario de inscripción. También puedes contactarnos por teléfono o email para recibir asistencia personalizada.',
  },
  {
    question: '¿Qué modalidades de formación ofrecen?',
    answer:
      'Ofrecemos tres modalidades de formación: presencial (en nuestras instalaciones), online (100% a distancia) y semipresencial (combinando clases presenciales y online). Cada curso indica claramente su modalidad disponible.',
  },
  {
    question: '¿Hay ayudas o becas disponibles?',
    answer:
      'Sí, muchos de nuestros cursos cuentan con opciones de financiación y ayudas disponibles. Los cursos que tienen ayudas disponibles están claramente identificados. Contacta con nosotros para más información sobre las opciones de financiación específicas.',
  },
  {
    question: '¿Los cursos tienen certificación oficial?',
    answer:
      'Sí, todos nuestros cursos cuentan con certificación oficial homologada. Los ciclos formativos otorgan titulaciones de FP oficiales reconocidas por el Ministerio de Educación.',
  },
  {
    question: '¿Cuál es la duración típica de los cursos?',
    answer:
      'La duración varía según el tipo de curso. Los cursos de formación para el empleo pueden durar desde 40 hasta 400 horas. Los ciclos formativos de grado medio y superior tienen una duración de 2 años académicos.',
  },
  {
    question: '¿Puedo trabajar mientras estudio?',
    answer:
      'Sí, especialmente en las modalidades online y semipresencial que están diseñadas para adaptarse a horarios laborales. Los ciclos formativos también pueden cursarse en modalidad dual, combinando formación y trabajo.',
  },
  {
    question: '¿Qué requisitos necesito para inscribirme?',
    answer:
      'Los requisitos varían según el curso. Los cursos de formación para el empleo generalmente no tienen requisitos previos. Los ciclos formativos de grado medio requieren ESO o equivalente, y los de grado superior requieren Bachillerato o grado medio.',
  },
  {
    question: '¿Ofrecen prácticas en empresas?',
    answer:
      'Sí, muchos de nuestros programas incluyen períodos de prácticas en empresas del sector. Esto permite a nuestros estudiantes aplicar sus conocimientos en entornos reales de trabajo y mejorar su empleabilidad.',
  },
];

export default function FAQPage() {
  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-primary to-primary-light text-white"
        style={{ padding: 'clamp(2rem, 6vw, 4rem) 0' }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-fluid-section-title font-bold mb-4">Preguntas Frecuentes</h1>
            <p className="text-fluid-body opacity-90">
              Encuentra respuestas a las preguntas más comunes sobre nuestros cursos y servicios
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Accordion key={index} title={faq.question}>
                <p>{faq.answer}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-50" style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              ¿No encuentras tu respuesta?
            </h2>
            <p className="text-neutral-600 mb-6">
              Nuestro equipo está disponible para ayudarte con cualquier duda adicional
            </p>
            <Link href="/contacto" className="btn-primary inline-block">
              Contactar con nosotros
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
