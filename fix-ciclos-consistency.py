#!/usr/bin/env python3
"""
Fix ciclos.html card consistency:
1. 2-line fixed height for titles
2. Only 2 colors: Grado Superior (#F2014B) and Grado Medio (#d01040)
"""

import re
from pathlib import Path

CEP_PINK = "#F2014B"  # Grado Superior
CEP_PINK_DARK = "#d01040"  # Grado Medio

def fix_ciclos_cards():
    """Fix all cycle cards for consistency"""

    content = Path("ciclos.html").read_text(encoding='utf-8')

    # Define card patterns for each cycle with their grade
    cycles = [
        {
            "name": "Desarrollo de Aplicaciones Web",
            "grade": "Superior",
            "icon": "fa-laptop-code",
            "color": CEP_PINK
        },
        {
            "name": "Administración y Finanzas",
            "grade": "Superior",
            "icon": "fa-chart-line",
            "color": CEP_PINK
        },
        {
            "name": "Cuidados Auxiliares de Enfermería",
            "grade": "Medio",
            "icon": "fa-heartbeat",
            "color": CEP_PINK_DARK
        },
        {
            "name": "Instalaciones Eléctricas y Automáticas",
            "grade": "Medio",
            "icon": "fa-bolt",
            "color": CEP_PINK_DARK
        },
        {
            "name": "Marketing y Publicidad",
            "grade": "Superior",
            "icon": "fa-bullhorn",
            "color": CEP_PINK
        },
        {
            "name": "Sistemas Microinformáticos y Redes",
            "grade": "Medio",
            "icon": "fa-network-wired",
            "color": CEP_PINK_DARK
        }
    ]

    for cycle in cycles:
        # Find the card for this cycle
        pattern = rf'(<div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">)\s*<div class="[^"]*">.*?<i class="fas {cycle["icon"]}.*?</i>.*?<h3[^>]*>{cycle["name"]}</h3>.*?<p[^>]*>Grado {cycle["grade"]}</p>\s*</div>'

        # Create standardized card header with fixed height title
        new_header = f'''<div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col">
            <div class="p-6 text-white" style="background-color: {cycle['color']}">
              <i class="fas {cycle['icon']} text-4xl mb-4"></i>
              <h3 class="text-2xl font-bold min-h-[4rem] flex items-center">{cycle['name']}</h3>
              <p class="text-white opacity-90">Grado {cycle['grade']}</p>
            </div>'''

        # Try to find and replace
        match = re.search(pattern, content, re.DOTALL | re.MULTILINE)
        if match:
            # Find the full card structure (from opening div to the card body start)
            full_card_pattern = rf'(<div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">)\s*<div class="[^"]*">.*?<h3[^>]*>{cycle["name"]}</h3>.*?<p[^>]*>Grado {cycle["grade"]}</p>\s*</div>\s*(<div class="p-6">)'

            replacement = new_header + r'            \2'
            content = re.sub(full_card_pattern, replacement, content, count=1, flags=re.DOTALL | re.MULTILINE)
            print(f"  ✓ Fixed {cycle['name']} card")

    # Fix all badges and icons in card bodies to use appropriate color
    # Fix category badges (Informática, Administración, etc.)
    content = re.sub(
        r'<span\s+class="[^"]*(?:bg-blue-100 text-blue-800|bg-green-100 text-green-800|bg-red-100 text-red-800|bg-yellow-100 text-yellow-800|bg-purple-100 text-purple-800|bg-indigo-100 text-indigo-800)[^"]*"[^>]*>',
        '<span class="text-xs font-semibold px-3 py-1 rounded-full text-white" style="background-color: rgba(242, 1, 75, 0.2); color: #F2014B">',
        content
    )

    # Fix icon colors in card body (clock, users, certificate icons)
    content = re.sub(
        r'<i class="fas fa-(clock|users|certificate) (?:text-blue-600|text-green-600|text-red-600|text-yellow-600|text-purple-600|text-indigo-600) mr-2"></i>',
        r'<i class="fas fa-\1 mr-2" style="color: #F2014B"></i>',
        content
    )

    # Fix button colors - make them match card header color
    # This is trickier since we need context, so we'll make them all CEP pink
    content = re.sub(
        r'<button\s+class="w-full (?:bg-blue-600|bg-green-600|bg-red-600|bg-yellow-600|bg-purple-600|bg-indigo-600) text-white py-3 rounded-lg hover:[^ ]+ transition-all font-semibold"',
        f'<button class="w-full text-white py-3 rounded-lg hover:opacity-90 transition-all font-semibold" style="background-color: {CEP_PINK}"',
        content
    )

    Path("ciclos.html").write_text(content, encoding='utf-8')
    print(f"\n✅ ciclos.html fixed successfully")
    return True

def main():
    print("=" * 60)
    print("🎨 ESTANDARIZACIÓN CARDS DE CICLOS")
    print("=" * 60)
    print(f"\nColor Grado Superior: {CEP_PINK}")
    print(f"Color Grado Medio: {CEP_PINK_DARK}")
    print("\nCambios aplicados:")
    print("  • Altura fija de título (2 líneas)")
    print("  • Solo 2 colores según grado")
    print("  • Cards flex para alineación uniforme")
    print("")

    if fix_ciclos_cards():
        print("\n" + "=" * 60)
        print("✅ COMPLETADO")
        print("=" * 60)

if __name__ == "__main__":
    main()
