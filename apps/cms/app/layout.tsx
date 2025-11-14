import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { ClientLayout } from './ClientLayout'

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
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
