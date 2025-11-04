import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CEP Comunicación - Admin',
  description: 'Sistema de gestión de contenidos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
