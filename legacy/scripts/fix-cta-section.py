#!/usr/bin/env python3
"""
Script de corrección de sección CTA
====================================

CORRECCIÓN SOLICITADA:
- Sección "¿Listo para dar el siguiente paso?" debe tener:
  * Fondo BLANCO (no magenta)
  * Texto en color oficial #F2014B
  * Botón: fondo #F2014B con texto blanco (inversión)
"""

import re
import os
from pathlib import Path

HTML_FILES = [
    "index.html",
    "sobre-nosotros.html",
    # Agregar otros archivos que tengan esta sección CTA
]

def fix_cta_section(content):
    """Corrige la sección CTA para tener fondo blanco con texto #F2014B."""

    # Pattern para encontrar la sección CTA actual
    # La sección tiene class="py-16 md:py-20 ... text-white" y style="background-color: #F2014B"

    # Buscar la sección con "¿Listo para dar el siguiente paso?"
    pattern = r'(<section class="py-16 md:py-20[^"]*"[^>]*style="background-color: #F2014B"[^>]*>)\s*(<div class="container mx-auto px-4 text-center">)\s*(<h2[^>]*>¿Listo para dar el siguiente paso\?</h2>)\s*(<p[^>]*>.*?carrera profesional\s*</p>)\s*(<a[^>]*class="[^"]*bg-white text-cep-pink[^"]*"[^>]*>.*?Solicitar Información.*?</a>)'

    # Nueva versión: fondo blanco, texto #F2014B, botón invertido
    replacement = r'''<section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6" style="color: #F2014B">¿Listo para dar el siguiente paso?</h2>
        <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto" style="color: #333">
          Contacta con nosotros y te ayudaremos a encontrar el curso perfecto para impulsar tu
          carrera profesional
        </p>
        <a
          href="/contacto"
          class="px-8 py-4 text-lg font-bold inline-block rounded-lg hover:scale-105 transition-transform text-white"
          style="background-color: #F2014B"
        >
          Solicitar Información
        </a>'''

    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        print("  → Sección CTA corregida (fondo blanco, texto #F2014B)")
        return content

    # Intentar pattern más simple
    # Buscar section que contiene "¿Listo para dar el siguiente paso?"
    pattern2 = r'<section class="py-16 md:py-20[^>]*>.*?¿Listo para dar el siguiente paso\?.*?</section>'

    if re.search(pattern2, content, re.DOTALL):
        match = re.search(pattern2, content, re.DOTALL)
        old_section = match.group(0)

        new_section = '''<section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6" style="color: #F2014B">¿Listo para dar el siguiente paso?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto" style="color: #333">
          Contacta con nosotros y te ayudaremos a encontrar el curso perfecto para impulsar tu
          carrera profesional
        </p>
        <a
          href="/contacto"
          class="px-8 py-4 text-lg font-bold inline-block rounded-lg hover:scale-105 transition-transform text-white"
          style="background-color: #F2014B"
        >
          Solicitar Información
        </a>
      </div>
    </section>'''

        content = content.replace(old_section, new_section)
        print("  → Sección CTA corregida con pattern alternativo")
        return content

    print("  ⚠ Sección CTA no encontrada")
    return content

def process_file(filepath):
    """Procesa un archivo HTML aplicando corrección de CTA."""
    print(f"\nProcesando: {filepath}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_length = len(content)
        content = fix_cta_section(content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        new_length = len(content)
        delta = new_length - original_length
        if delta != 0:
            print(f"  ✓ Completado (Δ {delta:+d} bytes)")
        else:
            print(f"  ✓ Sin cambios")

        return True

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def main():
    """Función principal."""
    print("=" * 70)
    print("CEP FORMACIÓN - CORRECCIÓN SECCIÓN CTA")
    print("=" * 70)
    print("\nCambios:")
    print("  - Fondo: magenta → BLANCO")
    print("  - Título: blanco → #F2014B")
    print("  - Texto: blanco → gris oscuro #333")
    print("  - Botón: fondo #F2014B + texto blanco\n")

    base_dir = Path(__file__).parent
    os.chdir(base_dir)

    success_count = 0
    fail_count = 0

    for filename in HTML_FILES:
        filepath = base_dir / filename
        if filepath.exists():
            if process_file(filepath):
                success_count += 1
            else:
                fail_count += 1
        else:
            print(f"\n⚠ Archivo no encontrado: {filename}")
            fail_count += 1

    print("\n" + "=" * 70)
    print(f"RESUMEN: {success_count} éxitos, {fail_count} fallos")
    print("=" * 70)

if __name__ == "__main__":
    main()
