#!/usr/bin/env python3
"""
Complete Implementation:
1. Replace Sedes page with 4 locations + Pexels images
2. Add hero background images from Pexels to all sections
"""

import re
from pathlib import Path

CEP_PINK = "#F2014B"

# Pexels images for sedes
SEDES_IMAGES = {
    "CEP NORTE": "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800",
    "CEP SUR": "https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=800",
    "CEP SANTA CRUZ": "https://images.pexels.com/photos/161764/tenerife-palm-road-tourist-161764.jpeg?auto=compress&cs=tinysrgb&w=800",
    "CEP CADIZ": "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800"
}

# Hero images from Pexels
HERO_IMAGES = {
    "blog": "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "ciclos": "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "sedes": "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "sobre-nosotros": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "cursos": "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920"
}

def create_sedes_grid():
    """Create complete 4-sedes grid with Pexels images"""
    return f'''
    <!-- Sedes Grid -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4" style="color: {CEP_PINK}">NUESTRAS SEDES</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra la sede CEP Formación más cercana a ti en Canarias y Andalucía
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- CEP NORTE -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div class="h-64 bg-cover bg-center relative"
                 style="background-image: url('{SEDES_IMAGES["CEP NORTE"]}')">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-2xl font-bold">CEP NORTE</h3>
                <p class="text-lg opacity-90">La Orotava, Tenerife</p>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Dirección</h4>
                    <p class="text-gray-600">Calle La Villa, 25<br/>38300 La Orotava, Tenerife</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Teléfono</h4>
                    <p class="text-gray-600">922 330 123</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                 style="background-image: url('{SEDES_IMAGES["CEP SUR"]}')">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-2xl font-bold">CEP SUR</h3>
                <p class="text-lg opacity-90">Arona, Tenerife</p>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Dirección</h4>
                    <p class="text-gray-600">Avenida Los Cristianos, 45<br/>38640 Arona, Tenerife</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Teléfono</h4>
                    <p class="text-gray-600">922 755 456</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                 style="background-image: url('{SEDES_IMAGES["CEP SANTA CRUZ"]}')">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-2xl font-bold">CEP SANTA CRUZ</h3>
                <p class="text-lg opacity-90">Santa Cruz de Tenerife</p>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Dirección</h4>
                    <p class="text-gray-600">Calle Ramón y Cajal, 78<br/>38001 Santa Cruz de Tenerife</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Teléfono</h4>
                    <p class="text-gray-600">922 240 789</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                 style="background-image: url('{SEDES_IMAGES["CEP CADIZ"]}')">
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
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Dirección</h4>
                    <p class="text-gray-600">Próximamente<br/>Cádiz, Andalucía</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-1" style="color: {CEP_PINK}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

def add_hero_image_to_page(content, page_name):
    """Add hero background image from Pexels to page"""
    if page_name not in HERO_IMAGES:
        return content

    image_url = HERO_IMAGES[page_name]

    # Find hero section and add background image
    # Pattern 1: Hero with gradient background
    content = re.sub(
        r'(<section[^>]*class="[^"]*py-\d+[^"]*"[^>]*)(>)',
        lambda m: f'{m.group(1)} style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(\'{image_url}\') center/cover no-repeat"{m.group(2)}'
        if 'Hero' in content[max(0, m.start()-100):m.start()] or 'hero' in content[max(0, m.start()-100):m.start()]
        else m.group(0),
        content,
        count=1
    )

    return content

def fix_sedes_page():
    """Replace entire sedes grid section"""
    filepath = Path("sedes.html")
    if not filepath.exists():
        print(f"❌ {filepath} not found")
        return False

    print(f"Processing {filepath.name}...")
    content = filepath.read_text(encoding='utf-8')

    # Find and replace the sedes grid section
    # Look for the section after carousel/hero and before footer
    pattern = r'(<!-- Sedes Grid -->.*?</section>)'

    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, create_sedes_grid().strip(), content, flags=re.DOTALL)
    else:
        # Try alternative: find section after hero
        pattern2 = r'(<section class="py-20[^>]*>.*?</section>)(\s*<!-- Footer -->)'
        if re.search(pattern2, content, re.DOTALL):
            content = re.sub(
                pattern2,
                create_sedes_grid().strip() + r'\2',
                content,
                flags=re.DOTALL,
                count=1
            )

    filepath.write_text(content, encoding='utf-8')
    print(f"  ✓ Updated {filepath.name} with 4 sedes + images")
    return True

def add_hero_images():
    """Add Pexels hero images to all section pages"""
    pages = {
        "blog.html": "blog",
        "ciclos.html": "ciclos",
        "sedes.html": "sedes",
        "sobre-nosotros.html": "sobre-nosotros",
        "cursos.html": "cursos"
    }

    count = 0
    for filename, page_key in pages.items():
        filepath = Path(filename)
        if not filepath.exists():
            continue

        print(f"Adding hero image to {filename}...")
        content = filepath.read_text(encoding='utf-8')
        updated = add_hero_image_to_page(content, page_key)

        if updated != content:
            filepath.write_text(updated, encoding='utf-8')
            print(f"  ✓ Added hero image to {filename}")
            count += 1
        else:
            print(f"  - No hero section found in {filename}")

    return count

def main():
    """Main execution"""
    print("=" * 70)
    print("COMPLETE SEDES AND HERO IMAGES IMPLEMENTATION")
    print("=" * 70)
    print()

    # Fix sedes page
    print("STEP 1: Updating Sedes Page with 4 Locations")
    print("-" * 70)
    sedes_updated = fix_sedes_page()
    print()

    # Add hero images
    print("STEP 2: Adding Hero Images from Pexels")
    print("-" * 70)
    hero_count = add_hero_images()
    print()

    # Summary
    print("=" * 70)
    print("✅ COMPLETED")
    print()
    if sedes_updated:
        print("Sedes Page:")
        print("  • CEP NORTE (La Orotava)")
        print("  • CEP SUR (Arona)")
        print("  • CEP SANTA CRUZ")
        print("  • CEP CÁDIZ (Próximamente)")
    print()
    print(f"Hero Images: {hero_count} pages updated")
    print("=" * 70)

if __name__ == "__main__":
    main()
