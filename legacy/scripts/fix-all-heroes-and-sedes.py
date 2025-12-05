#!/usr/bin/env python3
"""
Complete Fix: Heroes + Sedes
1. Reduce overlay opacity from 0.85 to 0.5 (make images visible)
2. Replace sedes photos with real city images
3. Add hero sections to cursos/ subpages
"""

import re
from pathlib import Path

CEP_PINK = "#F2014B"
DARK_PINK = "#d01040"

# Real city photos from Pexels
SEDES_PHOTOS = {
    "CEP NORTE": "https://images.pexels.com/photos/17930048/pexels-photo-17930048.jpeg?auto=compress&cs=tinysrgb&w=800",  # La Orotava, Tenerife
    "CEP SUR": "https://images.pexels.com/photos/6031667/pexels-photo-6031667.jpeg?auto=compress&cs=tinysrgb&w=800",  # Arona/Los Cristianos
    "CEP SANTA CRUZ": "https://images.pexels.com/photos/19004386/pexels-photo-19004386.jpeg?auto=compress&cs=tinysrgb&w=800",  # Santa Cruz cityscape
    "CEP CADIZ": "https://images.pexels.com/photos/28967850/pexels-photo-28967850.jpeg?auto=compress&cs=tinysrgb&w=800"  # Cádiz
}

# Hero images for cursos subpages
CURSOS_HEROES = {
    "desempleados": {
        "title": "CURSOS PARA DESEMPLEADOS",
        "subtitle": "Formación gratuita financiada para impulsar tu reinserción laboral",
        "image": "https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=1920"
    },
    "ocupados": {
        "title": "CURSOS PARA TRABAJADORES",
        "subtitle": "Formación continua para profesionales en activo. Mejora tus competencias",
        "image": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920"
    },
    "privados": {
        "title": "CURSOS PRIVADOS",
        "subtitle": "Formación personalizada y certificada para alcanzar tus objetivos profesionales",
        "image": "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920"
    },
    "teleformacion": {
        "title": "TELEFORMACIÓN",
        "subtitle": "Aprende desde cualquier lugar con nuestra plataforma online de formación",
        "image": "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=1920"
    }
}

def reduce_overlay_opacity(content):
    """Reduce overlay opacity from 0.85 to 0.5 to make images visible"""
    # Replace rgba with 0.85 to 0.5
    content = re.sub(
        r'rgba\(242, 1, 75, 0\.85\)',
        'rgba(242, 1, 75, 0.5)',
        content
    )
    content = re.sub(
        r'rgba\(208, 16, 64, 0\.85\)',
        'rgba(208, 16, 64, 0.5)',
        content
    )
    return content

def update_sedes_photos():
    """Update sedes.html with real city photos"""
    filepath = Path("sedes.html")
    if not filepath.exists():
        print("❌ sedes.html not found")
        return False

    print("Updating sedes photos with real city images...")
    content = filepath.read_text(encoding='utf-8')

    # Update each sede photo URL
    # CEP NORTE
    content = re.sub(
        r'background-image: url\([\'"]https://images\.pexels\.com/photos/2166559/[^"\']+[\'"]\)',
        f"background-image: url('{SEDES_PHOTOS['CEP NORTE']}')",
        content
    )

    # CEP SUR
    content = re.sub(
        r'background-image: url\([\'"]https://images\.pexels\.com/photos/1647962/[^"\']+[\'"]\)',
        f"background-image: url('{SEDES_PHOTOS['CEP SUR']}')",
        content
    )

    # CEP SANTA CRUZ
    content = re.sub(
        r'background-image: url\([\'"]https://images\.pexels\.com/photos/161764/[^"\']+[\'"]\)',
        f"background-image: url('{SEDES_PHOTOS['CEP SANTA CRUZ']}')",
        content
    )

    # CEP CÁDIZ
    content = re.sub(
        r'background-image: url\([\'"]https://images\.pexels\.com/photos/1388030/[^"\']+[\'"]\)',
        f"background-image: url('{SEDES_PHOTOS['CEP CADIZ']}')",
        content
    )

    # Also reduce opacity in sedes hero
    content = reduce_overlay_opacity(content)

    filepath.write_text(content, encoding='utf-8')
    print("  ✓ sedes.html updated with real city photos")
    return True

def add_hero_to_cursos_page(filename, curso_type):
    """Add hero section to cursos subpage"""
    filepath = Path(f"cursos/{filename}")
    if not filepath.exists():
        print(f"  ❌ {filename} not found")
        return False

    content = filepath.read_text(encoding='utf-8')

    hero_data = CURSOS_HEROES[curso_type]

    # Create hero HTML
    hero_html = f'''
    <!-- Page Hero -->
    <section class="py-16 md:py-20 text-white" style="background: linear-gradient(rgba(242, 1, 75, 0.5), rgba(208, 16, 64, 0.5)), url('{hero_data["image"]}') center/cover no-repeat">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{hero_data["title"]}</h1>
        <p class="text-xl opacity-90 max-w-3xl mx-auto">
          {hero_data["subtitle"]}
        </p>
      </div>
    </section>

'''

    # Insert hero before breadcrumb
    if "<!-- Breadcrumb -->" in content:
        content = content.replace("<!-- Breadcrumb -->", hero_html + "    <!-- Breadcrumb -->")
    else:
        # Try to insert after </header>
        content = re.sub(
            r'(</header>\s*\n)',
            r'\1' + hero_html,
            content,
            count=1
        )

    filepath.write_text(content, encoding='utf-8')
    print(f"  ✓ {filename} - Hero added")
    return True

def reduce_opacity_main_pages():
    """Reduce overlay opacity in main pages"""
    pages = ["blog.html", "ciclos.html", "cursos.html", "sobre-nosotros.html"]
    count = 0

    for page in pages:
        filepath = Path(page)
        if not filepath.exists():
            continue

        content = filepath.read_text(encoding='utf-8')
        updated = reduce_overlay_opacity(content)

        if updated != content:
            filepath.write_text(updated, encoding='utf-8')
            print(f"  ✓ {page} - Overlay opacity reduced")
            count += 1

    return count

def main():
    """Main execution"""
    print("=" * 75)
    print("COMPLETE FIX: HEROES + SEDES")
    print("=" * 75)
    print()

    # Step 1: Update sedes with real photos
    print("STEP 1: Updating Sedes with Real City Photos")
    print("-" * 75)
    print("Cities:")
    print("  • CEP NORTE → La Orotava, Tenerife")
    print("  • CEP SUR → Arona/Los Cristianos, Tenerife")
    print("  • CEP SANTA CRUZ → Santa Cruz de Tenerife")
    print("  • CEP CÁDIZ → Cádiz, Andalucía")
    print()
    sedes_updated = update_sedes_photos()
    print()

    # Step 2: Reduce opacity in main pages
    print("STEP 2: Reducing Overlay Opacity (0.85 → 0.5)")
    print("-" * 75)
    opacity_count = reduce_opacity_main_pages()
    print(f"  → {opacity_count} pages updated")
    print()

    # Step 3: Add heroes to cursos subpages
    print("STEP 3: Adding Hero Sections to Cursos Subpages")
    print("-" * 75)
    cursos_files = {
        "desempleados.html": "desempleados",
        "ocupados.html": "ocupados",
        "privados.html": "privados",
        "teleformacion.html": "teleformacion"
    }

    cursos_count = 0
    for filename, curso_type in cursos_files.items():
        if add_hero_to_cursos_page(filename, curso_type):
            cursos_count += 1

    print()

    # Summary
    print("=" * 75)
    print("✅ COMPLETED")
    print()
    print(f"Sedes Photos:     {'Updated' if sedes_updated else 'Failed'}")
    print(f"Overlay Opacity:  {opacity_count} pages (0.85 → 0.5)")
    print(f"Cursos Heroes:    {cursos_count}/4 pages")
    print()
    print("Changes Applied:")
    print("  • Real city photos for all 4 sedes")
    print("  • Overlay transparency increased (images now visible)")
    print("  • Hero sections added to cursos subpages")
    print("=" * 75)

if __name__ == "__main__":
    main()
