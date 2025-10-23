/**
 * Contact Page Component
 *
 * Contact form with GDPR compliance
 */

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented
    console.log('Form submitted');
  };

  return (
    <div className="contact-page py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Contacto</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Solicita Información</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Nombre *</label>
                <input type="text" className="form-input" required />
              </div>

              <div className="mb-4">
                <label className="form-label">Apellidos *</label>
                <input type="text" className="form-input" required />
              </div>

              <div className="mb-4">
                <label className="form-label">Email *</label>
                <input type="email" className="form-input" required />
              </div>

              <div className="mb-4">
                <label className="form-label">Teléfono *</label>
                <input type="tel" className="form-input" required />
              </div>

              <div className="mb-4">
                <label className="form-label">Curso de interés</label>
                <select className="form-input">
                  <option>Selecciona un curso</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Mensaje</label>
                <textarea className="form-input" rows={4}></textarea>
              </div>

              {/* GDPR Compliance */}
              <div className="mb-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    required
                  />
                  <span className="text-sm">
                    Acepto la{' '}
                    <a href="/politica-privacidad" className="text-primary hover:underline">
                      política de privacidad
                    </a>{' '}
                    *
                  </span>
                </label>
              </div>

              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    required
                  />
                  <span className="text-sm">
                    Consiento el tratamiento de mis datos para recibir información sobre cursos *
                  </span>
                </label>
              </div>

              <button type="submit" className="btn-primary w-full">
                Enviar Solicitud
              </button>

              <p className="text-xs text-neutral-500 mt-4">
                * Campos obligatorios
              </p>
            </form>
          </div>

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
