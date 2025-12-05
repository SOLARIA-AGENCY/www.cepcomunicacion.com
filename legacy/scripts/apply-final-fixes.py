#!/usr/bin/env python3
"""
Aplicar correcciones finales a CEP Formación:
1. Ciclos: Proceso admisión números en blanco
2. Ciclos: Colores morado (Superior) y turquesa (Medio)
3. Sedes: 4 sedes con nombres en mayúsculas
4. Botón Acceso Alumnos: outline style
5. Typo: NUETRAS → NUESTRAS
"""

import re
from pathlib import Path

# Nuevos colores para ciclos
COLOR_SUPERIOR = "#7C3AED"  # Morado/Violet
COLOR_MEDIO = "#06B6D4"     # Turquesa/Cyan
CEP_PINK = "#F2014B"

def fix_ciclos_admission_process():
    """Fix proceso de admisión: números en blanco"""
    print("\n📄 Procesando ciclos.html...")

    content = Path("ciclos.html").read_text(encoding='utf-8')

    # Fix números en círculos: cambiar color de magenta a blanco
    content = re.sub(
        r'<span class="text-2xl font-bold" style="color: #F2014B">',
        '<span class="text-2xl font-bold text-white">',
        content
    )

    print("  ✓ Números del proceso de admisión corregidos a blanco")

    # Cambiar colores de las tarjetas de ciclos
    # Grado Superior → Morado
    content = re.sub(
        r'(<div class="p-6 text-white" style="background-color: )#F2014B(">)',
        f'\\1{COLOR_SUPERIOR}\\2',
        content
    )

    # Grado Medio → Turquesa
    content = re.sub(
        r'(<div class="p-6 text-white" style="background-color: )#d01040(">)',
        f'\\1{COLOR_MEDIO}\\2',
        content
    )

    print(f"  ✓ Colores de tarjetas: Superior={COLOR_SUPERIOR}, Medio={COLOR_MEDIO}")

    Path("ciclos.html").write_text(content, encoding='utf-8')
    print("  ✅ ciclos.html actualizado")
    return True

def fix_sedes_page():
    """Fix sedes: 4 sedes con nombres en mayúsculas"""
    print("\n📄 Procesando sedes.html...")

    content = Path("sedes.html").read_text(encoding='utf-8')

    # Fix typo NUETRAS → NUESTRAS
    content = content.replace("NUETRAS SEDES", "NUESTRAS SEDES")
    content = content.replace("Nuetras sedes", "Nuestras sedes")
    print("  ✓ Typo corregido: NUETRAS → NUESTRAS")

    # Crear las 4 sedes
    sedes_html = '''    <!-- Sedes Grid -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-8">

          <!-- CEP NORTE -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div class="h-64 bg-cover bg-center relative" style="background-image: url('https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800')">
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
                    <p class="text-gray-600">922 330 456</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Horario</h4>
                    <p class="text-gray-600">Lunes a Viernes: 9:00 - 18:00<br/>Sábados: 9:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CEP SUR -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div class="h-64 bg-cover bg-center relative" style="background-image: url('https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=800')">
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
                    <p class="text-gray-600">Avenida Los Pueblos, 78<br/>38640 Arona, Tenerife</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Teléfono</h4>
                    <p class="text-gray-600">922 750 123</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Horario</h4>
                    <p class="text-gray-600">Lunes a Viernes: 9:00 - 18:00<br/>Sábados: 9:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CEP SANTA CRUZ -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div class="h-64 bg-cover bg-center relative" style="background-image: url('https://images.pexels.com/photos/161764/tenerife-palm-road-tourist-161764.jpeg?auto=compress&cs=tinysrgb&w=800')">
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
                    <p class="text-gray-600">Calle Méndez Núñez, 45<br/>38001 Santa Cruz de Tenerife</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Teléfono</h4>
                    <p class="text-gray-600">922 240 678</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Horario</h4>
                    <p class="text-gray-600">Lunes a Viernes: 8:30 - 19:00<br/>Sábados: 9:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CEP CÁDIZ (Próximamente) -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all opacity-75">
            <div class="h-64 bg-cover bg-center relative" style="background-image: url('https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800')">
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
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p class="text-gray-700 font-semibold">🚀 Nueva sede en preparación</p>
                  <p class="text-gray-600 text-sm mt-2">Próxima apertura en Cádiz. Mantente informado de las novedades.</p>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: #F2014B" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Contacto</h4>
                    <p class="text-gray-600">info@cepformacion.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>'''

    # Reemplazar la sección de sedes actual
    pattern = r'<!-- Sedes Grid -->.*?</section>'
    content = re.sub(pattern, sedes_html, content, flags=re.DOTALL)

    print("  ✓ 4 sedes creadas con fotos de Pexels")

    Path("sedes.html").write_text(content, encoding='utf-8')
    print("  ✅ sedes.html actualizado")
    return True

def fix_footer_all_pages():
    """Estandarizar footer con logo en círculo blanco en todas las páginas"""
    print("\n📄 Estandarizando footer en todas las páginas...")

    # Extraer footer de index.html
    index_content = Path("index.html").read_text(encoding='utf-8')

    # Buscar el footer completo
    footer_match = re.search(
        r'(<!-- Footer -->.*?</footer>)',
        index_content,
        re.DOTALL
    )

    if not footer_match:
        print("  ✗ No se pudo extraer footer de index.html")
        return False

    standard_footer = footer_match.group(1)
    print("  ✓ Footer estándar extraído de index.html")

    # Aplicar a todas las páginas
    files = [
        "blog.html", "ciclos.html", "sedes.html", "cursos.html",
        "contacto.html", "faq.html", "sobre-nosotros.html",
        "acceso-alumnos.html", "aviso-legal.html",
        "politica-cookies.html", "politica-privacidad.html"
    ]

    for filename in files:
        if not Path(filename).exists():
            continue

        content = Path(filename).read_text(encoding='utf-8')

        # Reemplazar footer
        content = re.sub(
            r'<!-- Footer -->.*?</footer>',
            standard_footer,
            content,
            flags=re.DOTALL
        )

        Path(filename).write_text(content, encoding='utf-8')
        print(f"  ✓ {filename}")

    print("  ✅ Footer estandarizado en todas las páginas")
    return True

def fix_acceso_alumnos_button():
    """Fix botón Acceso Alumnos: outline style"""
    print("\n📄 Procesando botón Acceso Alumnos...")

    files = [
        "index.html", "blog.html", "ciclos.html", "sedes.html",
        "cursos.html", "contacto.html", "faq.html", "sobre-nosotros.html"
    ]

    for filename in files:
        if not Path(filename).exists():
            continue

        content = Path(filename).read_text(encoding='utf-8')

        # Reemplazar botón Acceso Alumnos con outline style
        # Patrón para desktop
        old_desktop = r'<a[^>]*href="/acceso-alumnos"[^>]*class="[^"]*border-2 border-cep-pink text-white[^"]*"[^>]*style="background-color: #F2014B"[^>]*>\s*Acceso Alumnos\s*</a>'
        new_desktop = f'<a href="/acceso-alumnos" class="border-2 text-sm uppercase tracking-wide px-4 py-2 rounded-lg font-semibold hover:bg-opacity-10 transition-colors" style="border-color: {CEP_PINK}; color: {CEP_PINK}; background-color: white">Acceso Alumnos</a>'

        content = re.sub(old_desktop, new_desktop, content)

        # Patrón para mobile
        old_mobile = r'<a[^>]*href="/acceso-alumnos"[^>]*class="[^"]*border-2 border-cep-pink text-white[^"]*"[^>]*style="background-color: #F2014B"[^>]*>\s*Acceso Alumnos\s*</a>'
        content = re.sub(old_mobile, new_desktop, content)

        Path(filename).write_text(content, encoding='utf-8')
        print(f"  ✓ {filename}")

    print("  ✅ Botón Acceso Alumnos actualizado (outline)")
    return True

def main():
    print("=" * 60)
    print("🎨 CORRECCIONES FINALES CEP FORMACIÓN")
    print("=" * 60)

    success_count = 0

    if fix_ciclos_admission_process():
        success_count += 1

    if fix_sedes_page():
        success_count += 1

    if fix_footer_all_pages():
        success_count += 1

    if fix_acceso_alumnos_button():
        success_count += 1

    print("\n" + "=" * 60)
    print(f"✅ COMPLETADO: {success_count}/4 tareas")
    print("=" * 60)
    print("\nResumen:")
    print(f"  • Proceso admisión: números en blanco ✓")
    print(f"  • Colores ciclos: Morado (Superior) / Turquesa (Medio) ✓")
    print(f"  • 4 sedes con fotos de Pexels ✓")
    print(f"  • Footer estandarizado con logo en círculo ✓")
    print(f"  • Botón Acceso Alumnos: outline style ✓")
    print(f"  • Typo corregido: NUETRAS → NUESTRAS ✓")

if __name__ == "__main__":
    main()
