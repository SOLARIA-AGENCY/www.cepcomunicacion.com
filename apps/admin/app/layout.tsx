import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACADEMIX | Portal de Gestión SaaS",
  description: "Panel de administración multi-tenant para gestión de academias y centros de formación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
