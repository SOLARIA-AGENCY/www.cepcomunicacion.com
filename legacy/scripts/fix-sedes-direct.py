#!/usr/bin/env python3
"""
Direct fix for sedes.html - replace the entire location section
"""

import re
from pathlib import Path

CEP_PINK = "#F2014B"

SEDES_HTML = '''    <!-- Sedes Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4" style="color: #F2014B">NUESTRAS SEDES</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra la sede CEP Formación más cercana a ti en Canarias y Andalucía
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- CEP NORTE -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div class="h-64 bg-cover bg-center relative"
                 style="background-image: url('https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800')">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-2xl font-bold">CEP NORTE</h3>
                <p class="text-lg opacity-90">La Orotava, Tenerife</p>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Dirección</h4>
                    <p class="text-gray-600">Calle La Villa, 25<br/>38300 La Orotava, Tenerife</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Teléfono</h4>
                    <p class="text-gray-600">922 330 123</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Email</h4>
                    <p class="text-gray-600">norte@cepformacion.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CEP SUR -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div class="h-64 bg-cover bg-center relative"
                 style="background-image: url('https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=800')">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-2xl font-bold">CEP SUR</h3>
                <p class="text-lg opacity-90">Arona, Tenerife</p>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Dirección</h4>
                    <p class="text-gray-600">Avenida Los Cristianos, 45<br/>38640 Arona, Tenerife</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Teléfono</h4>
                    <p class="text-gray-600">922 755 456</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Email</h4>
                    <p class="text-gray-600">sur@cepformacion.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CEP SANTA CRUZ -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div class="h-64 bg-cover bg-center relative"
                 style="background-image: url('https://images.pexels.com/photos/161764/tenerife-palm-road-tourist-161764.jpeg?auto=compress&cs=tinysrgb&w=800')">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-2xl font-bold">CEP SANTA CRUZ</h3>
                <p class="text-lg opacity-90">Santa Cruz de Tenerife</p>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Dirección</h4>
                    <p class="text-gray-600">Calle Ramón y Cajal, 78<br/>38001 Santa Cruz de Tenerife</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Teléfono</h4>
                    <p class="text-gray-600">922 240 789</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Email</h4>
                    <p class="text-gray-600">santacruz@cepformacion.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CEP CÁDIZ (Próximamente) -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all opacity-75">
            <div class="h-64 bg-cover bg-center relative"
                 style="background-image: url('https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800')">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
              <div class="absolute top-4 right-4">
                <span class="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">Próximamente</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-2xl font-bold">CEP CÁDIZ</h3>
                <p class="text-lg opacity-90">Cádiz, Andalucía</p>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Dirección</h4>
                    <p class="text-gray-600">Próximamente<br/>Cádiz, Andalucía</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Información</h4>
                    <p class="text-gray-600">Nueva sede en preparación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
'''

def main():
    filepath = Path("sedes.html")
    content = filepath.read_text(encoding='utf-8')

    # Find the section with Santa Cruz and replace everything until next section or footer
    pattern = r'<section class="py-16 md:py-20">.*?</section>'

    match = re.search(pattern, content, re.DOTALL)
    if match:
        # Replace the matched section
        content = content[:match.start()] + SEDES_HTML + content[match.end():]
        filepath.write_text(content, encoding='utf-8')
        print("✅ Sedes section replaced successfully")
        print("   • CEP NORTE (La Orotava)")
        print("   • CEP SUR (Arona)")
        print("   • CEP SANTA CRUZ")
        print("   • CEP CÁDIZ (Próximamente)")
    else:
        print("❌ Could not find section to replace")

if __name__ == "__main__":
    main()
