'use client';

import React from 'react';
import Link from 'next/link';

export function HeroCarouselSimple() {
  return (
    <div className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gradient-to-br from-primary to-primary-dark">
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              El momento es ahora
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6 text-cep-rosa">
              Formación Profesional de Calidad
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-neutral-100 max-w-3xl mx-auto leading-relaxed">
              Impulsa tu carrera profesional con nuestros cursos presenciales, online y
              semipresenciales con ayudas disponibles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cursos"
                className="btn-cep-rosa px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2"
              >
                Ver Cursos
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </Link>
              <Link
                href="/contacto"
                className="btn-outline-white px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2"
              >
                Solicitar Información
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
