/**
 * Contact Page Component
 *
 * Contact form with GDPR compliance using LeadForm component
 */

import { LeadForm } from '@components/forms';

export default function ContactPage() {
  return (
    <div className="contact-page py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Contacto</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <LeadForm />

          {/* Contact Info */}
          <div>
            <div className="card mb-6">
              <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold">Teléfono</div>
                  <a href="tel:+34900000000" className="text-primary hover:underline">
                    +34 900 000 000
                  </a>
                </div>
                <div>
                  <div className="font-semibold">Email</div>
                  <a href="mailto:info@cepcomunicacion.com" className="text-primary hover:underline">
                    info@cepcomunicacion.com
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Horario de Atención</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Lunes a Viernes:</span>
                  <span className="ml-2">9:00 - 14:00 | 16:00 - 19:00</span>
                </div>
                <div>
                  <span className="font-semibold">Sábados y Domingos:</span>
                  <span className="ml-2">Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
