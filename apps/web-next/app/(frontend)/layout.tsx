import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CEP Comunicación - Formación Profesional',
  description: 'Plataforma educativa con Payload CMS 3.61.1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
