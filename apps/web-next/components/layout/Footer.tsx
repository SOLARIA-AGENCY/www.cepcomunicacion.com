/**
 * Footer Component
 *
 * Multi-column footer with links, legal info, and contact details
 * Adapted for Next.js with Link component
 */

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white" style={{ padding: 'clamp(1.5rem, 4vw, 3rem) 0' }}>
      <div className="container">
        <div className="grid-fluid-footer">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">CEP Formación</h3>
            <p className="text-neutral-400 text-xs md:text-sm">
              Centro de formación profesional de calidad con cursos presenciales, online y semipresenciales.
            </p>
          </div>
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/cursos" className="text-neutral-400 hover:text-white transition-colors text-sm">Cursos</Link></li>
              <li><Link href="/sobre-nosotros" className="text-neutral-400 hover:text-white transition-colors text-sm">Sobre Nosotros</Link></li>
              <li><Link href="/blog" className="text-neutral-400 hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><Link href="/contacto" className="text-neutral-400 hover:text-white transition-colors text-sm">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/politica-privacidad" className="text-neutral-400 hover:text-white transition-colors text-sm">Política de Privacidad</Link></li>
              <li><Link href="/aviso-legal" className="text-neutral-400 hover:text-white transition-colors text-sm">Aviso Legal</Link></li>
              <li><Link href="/cookies" className="text-neutral-400 hover:text-white transition-colors text-sm">Política de Cookies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contacto</h4>
            <ul className="space-y-2 text-neutral-400 text-xs md:text-sm">
              <li>Tel: +34 900 000 000</li>
              <li>info@cepcomunicacion.com</li>
              <li>Lunes a Viernes: 9:00 - 19:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-neutral-400 text-xs md:text-sm">
          <p>&copy; {currentYear} CEP Formación. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
