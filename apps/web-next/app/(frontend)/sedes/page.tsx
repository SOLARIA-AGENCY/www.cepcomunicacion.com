/**
 * Sedes Page
 *
 * Displays information about CEP Formación's two locations in Tenerife
 * - CEP Norte (Santa Cruz de Tenerife - Zona Norte)
 * - CEP Santa Cruz (Santa Cruz de Tenerife - Centro Ciudad)
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nuestras Sedes - CEP Formación Tenerife',
  description: 'Sedes de CEP Formación en Tenerife: CEP Norte y CEP Santa Cruz. Encuentra nuestra ubicación, horarios y cómo llegar.',
};

// Icon components
const LocationIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

const DirectionsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

interface InfoBlockProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function InfoBlock({ icon, title, children }: InfoBlockProps) {
  return (
    <div className="bg-neutral-50 p-6 rounded-xl border-l-4 border-primary">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary">{icon}</div>
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="text-neutral-700 text-sm space-y-2">
        {children}
      </div>
    </div>
  );
}

interface SedeCardProps {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeVariant: 'primary' | 'secondary';
  imageUrl: string;
  imageAlt: string;
  direccion: string[];
  telefono: string;
  telefonoWhatsapp: string;
  email: string;
  horario: { label: string; value: string }[];
  transporte: { label: string; value: string }[];
  mapUrl: string;
  mapEmbedUrl: string;
  contactUrl: string;
}

function SedeCard({
  title,
  subtitle,
  badgeText,
  badgeVariant,
  imageUrl,
  imageAlt,
  direccion,
  telefono,
  telefonoWhatsapp,
  email,
  horario,
  transporte,
  mapUrl,
  mapEmbedUrl,
  contactUrl,
}: SedeCardProps) {
  const badgeClasses = badgeVariant === 'primary'
    ? 'bg-primary text-white'
    : 'bg-blue-500 text-white';

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Image with Badge */}
      <div className="relative h-[350px] overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-6 left-6">
          <span className={`${badgeClasses} px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg`}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-10">
        <h2 className="text-3xl font-extrabold text-neutral-900 uppercase mb-2">{title}</h2>
        <p className="text-lg text-neutral-600 mb-10">{subtitle}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <InfoBlock icon={<LocationIcon />} title="Dirección">
            {direccion.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </InfoBlock>

          <InfoBlock icon={<PhoneIcon />} title="Teléfono">
            <p><a href={`tel:${telefono}`} className="text-primary hover:underline font-semibold">{telefono}</a></p>
            <p><a href={`tel:${telefonoWhatsapp}`} className="text-primary hover:underline font-semibold">{telefonoWhatsapp}</a> (WhatsApp)</p>
          </InfoBlock>

          <InfoBlock icon={<EmailIcon />} title="Email">
            <p><a href={`mailto:${email}`} className="text-primary hover:underline font-semibold">{email}</a></p>
          </InfoBlock>

          <InfoBlock icon={<ClockIcon />} title="Horario">
            {horario.map((item, i) => (
              <p key={i}>
                <strong className="text-neutral-900 font-semibold">{item.label}:</strong> {item.value}
              </p>
            ))}
          </InfoBlock>

          <InfoBlock icon={<DirectionsIcon />} title="Cómo Llegar">
            {transporte.map((item, i) => (
              <p key={i}>
                <strong className="text-neutral-900 font-semibold">{item.label}:</strong> {item.value}
              </p>
            ))}
          </InfoBlock>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-10">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold text-sm uppercase rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <MapPinIcon />
            Ver en Google Maps
          </a>
          <Link
            href={contactUrl}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold text-sm uppercase rounded-lg border-2 border-primary shadow-md hover:bg-primary hover:text-white hover:-translate-y-1 transition-all"
          >
            Contactar Sede
          </Link>
        </div>
      </div>

      {/* Map */}
      <div className="border-t border-neutral-200">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ubicación ${title}`}
          className="w-full"
        />
      </div>
    </article>
  );
}

export default function SedesPage() {
  const sedeNorte: SedeCardProps = {
    title: 'CEP NORTE',
    subtitle: 'Santa Cruz de Tenerife - Zona Norte',
    badgeText: 'SEDE PRINCIPAL',
    badgeVariant: 'primary',
    imageUrl: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'CEP Norte - Instalaciones modernas en Santa Cruz de Tenerife',
    direccion: [
      'Calle Ejemplo Norte, 123',
      '38001 Santa Cruz de Tenerife',
      'Islas Canarias, España'
    ],
    telefono: '+34 922 123 456',
    telefonoWhatsapp: '+34 622 123 456',
    email: 'norte@cepformacion.com',
    horario: [
      { label: 'Lunes a Viernes', value: '9:00 - 20:00' },
      { label: 'Sábados', value: '9:00 - 14:00' },
      { label: 'Domingos', value: 'Cerrado' }
    ],
    transporte: [
      { label: 'Guagua (Bus)', value: 'Líneas 910, 920, 925' },
      { label: 'Tranvía', value: 'Parada "La Trinidad"' },
      { label: 'Parking', value: 'Parking gratuito disponible' }
    ],
    mapUrl: 'https://maps.google.com/?q=CEP+Norte+Tenerife',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.123456789012!2d-16.2546568!3d28.4636296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzQ5LjEiTiAxNsKwMTUnMTYuOCJX!5e0!3m2!1ses!2ses!4v1234567890123!5m2!1ses!2ses',
    contactUrl: '/contacto?sede=norte'
  };

  const sedeSantaCruz: SedeCardProps = {
    title: 'CEP SANTA CRUZ',
    subtitle: 'Santa Cruz de Tenerife - Centro Ciudad',
    badgeText: 'SEDE CENTRO',
    badgeVariant: 'secondary',
    imageUrl: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'CEP Santa Cruz - Centro de formación en pleno centro de la ciudad',
    direccion: [
      'Avenida Principal Centro, 45',
      '38003 Santa Cruz de Tenerife',
      'Islas Canarias, España'
    ],
    telefono: '+34 922 654 321',
    telefonoWhatsapp: '+34 622 654 321',
    email: 'santacruz@cepformacion.com',
    horario: [
      { label: 'Lunes a Viernes', value: '8:30 - 21:00' },
      { label: 'Sábados', value: '9:00 - 15:00' },
      { label: 'Domingos', value: 'Cerrado' }
    ],
    transporte: [
      { label: 'Guagua (Bus)', value: 'Líneas 101, 102, 103, 105' },
      { label: 'Tranvía', value: 'Parada "Weyler"' },
      { label: 'Parking', value: 'Parking público cercano' }
    ],
    mapUrl: 'https://maps.google.com/?q=CEP+Santa+Cruz+Tenerife',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.987654321098!2d-16.2513568!3d28.4678296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzA0LjIiTiAxNsKwMTUnMDQuOSJX!5e0!3m2!1ses!2ses!4v1234567890124!5m2!1ses!2ses',
    contactUrl: '/contacto?sede=santacruz'
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-[#d6013f] text-white py-20 px-4 text-center">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-6 tracking-tight">
            Nuestras Sedes en Tenerife
          </h1>
          <p className="text-lg md:text-xl opacity-95 leading-relaxed">
            Dos centros estratégicamente ubicados en Santa Cruz de Tenerife
            para ofrecerte la mejor formación profesional cerca de ti.
          </p>
        </div>
      </section>

      {/* Sedes Section */}
      <section className="bg-neutral-50 py-20 px-4">
        <div className="container max-w-6xl mx-auto space-y-12">
          <SedeCard {...sedeNorte} />
          <SedeCard {...sedeSantaCruz} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-20 px-4 text-center">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase mb-6">
            ¿No sabes cuál sede te queda más cerca?
          </h2>
          <p className="text-lg md:text-xl opacity-95 mb-8">
            Contáctanos y te ayudaremos a encontrar la mejor opción para ti
          </p>
          <Link
            href="/contacto"
            className="inline-block px-12 py-5 bg-primary text-white font-bold text-lg uppercase rounded-lg shadow-xl hover:bg-primary/90 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Contactar Ahora
          </Link>
        </div>
      </section>
    </>
  );
}
