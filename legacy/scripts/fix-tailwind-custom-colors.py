#!/usr/bin/env python3
"""
Script de corrección de colores custom CEP con TailwindCSS CDN
==============================================================

PROBLEMA IDENTIFICADO:
- TailwindCSS CDN no reconoce clases custom CSS (.cep-pink, .cep-green, etc.)
- Las clases como 'bg-cep-pink', 'from-cep-pink', etc. no funcionan
- Resultado: Fondos blancos/transparentes en lugar de colores corporativos

SOLUCIÓN:
- Reemplazar clases custom por estilos inline con colores hexadecimales
- Mantener colores corporativos: pink=#ec008c, green=#00a651, blue=#0056b3, orange=#ff6b35
"""

import re
import os
from pathlib import Path

# Colores corporativos CEP
COLORS = {
    'cep-pink': '#ec008c',
    'cep-pink-dark': '#c7006f',
    'cep-green': '#00a651',
    'cep-blue': '#0056b3',
    'cep-orange': '#ff6b35',
}

HTML_FILES = [
    "index.html",
    "sedes.html",
    "blog.html",
    "ciclos.html",
    "contacto.html",
    "cursos.html",
    "faq.html",
    "sobre-nosotros.html",
    "acceso-alumnos.html",
    "cursos/desempleados.html",
    "cursos/ocupados.html",
    "cursos/privados.html",
    "cursos/teleformacion.html",
]

def fix_bg_classes(content):
    """Reemplaza clases bg-cep-* por estilos inline."""
    replacements = 0

    # bg-cep-pink
    pattern = r'class="([^"]*?)bg-cep-pink([^"]*?)"'
    matches = list(re.finditer(pattern, content))
    for match in matches:
        before_classes = match.group(1)
        after_classes = match.group(2)

        # Si ya tiene style, necesitamos agregarlo
        # Por ahora, simple replacement
        new_value = f'class="{before_classes}{after_classes}" style="background-color: {COLORS["cep-pink"]}"'
        content = content.replace(match.group(0), new_value, 1)
        replacements += 1

    # bg-cep-pink-dark
    pattern = r'class="([^"]*?)bg-cep-pink-dark([^"]*?)"'
    matches = list(re.finditer(pattern, content))
    for match in matches:
        before_classes = match.group(1)
        after_classes = match.group(2)
        new_value = f'class="{before_classes}{after_classes}" style="background-color: {COLORS["cep-pink-dark"]}"'
        content = content.replace(match.group(0), new_value, 1)
        replacements += 1

    # bg-cep-green
    pattern = r'class="([^"]*?)bg-cep-green([^"]*?)"'
    matches = list(re.finditer(pattern, content))
    for match in matches:
        before_classes = match.group(1)
        after_classes = match.group(2)
        new_value = f'class="{before_classes}{after_classes}" style="background-color: {COLORS["cep-green"]}"'
        content = content.replace(match.group(0), new_value, 1)
        replacements += 1

    # bg-cep-orange
    pattern = r'class="([^"]*?)bg-cep-orange([^"]*?)"'
    matches = list(re.finditer(pattern, content))
    for match in matches:
        before_classes = match.group(1)
        after_classes = match.group(2)
        new_value = f'class="{before_classes}{after_classes}" style="background-color: {COLORS["cep-orange"]}"'
        content = content.replace(match.group(0), new_value, 1)
        replacements += 1

    if replacements > 0:
        print(f"  → {replacements} clases bg-cep-* reemplazadas")

    return content

def fix_gradient_classes(content):
    """Reemplaza gradientes de Tailwind con clases custom por estilos inline."""
    replacements = 0

    # from-cep-pink to-cep-pink-dark
    pattern = r'class="([^"]*?)bg-gradient-to-r from-cep-pink to-cep-pink-dark([^"]*?)"'
    matches = list(re.finditer(pattern, content))
    for match in matches:
        before_classes = match.group(1)
        after_classes = match.group(2)
        gradient_style = f'background: linear-gradient(to right, {COLORS["cep-pink"]}, {COLORS["cep-pink-dark"]})'
        new_value = f'class="{before_classes}{after_classes}" style="{gradient_style}"'
        content = content.replace(match.group(0), new_value, 1)
        replacements += 1

    # from-cep-pink to-cep-pink-dark (sin bg-gradient-to-r)
    pattern = r'class="([^"]*?)from-cep-pink to-cep-pink-dark([^"]*?)"'
    matches = list(re.finditer(pattern, content))
    for match in matches:
        before_classes = match.group(1)
        after_classes = match.group(2)
        # Asumir gradient-to-br por defecto
        gradient_style = f'background: linear-gradient(to bottom right, {COLORS["cep-pink"]}, {COLORS["cep-pink-dark"]})'
        new_value = f'class="{before_classes}{after_classes}" style="{gradient_style}"'
        content = content.replace(match.group(0), new_value, 1)
        replacements += 1

    # from-cep-green to-green-700
    pattern = r'class="([^"]*?)from-cep-green to-green-700([^"]*?)"'
    matches = list(re.finditer(pattern, content))
    for match in matches:
        before_classes = match.group(1)
        after_classes = match.group(2)
        gradient_style = f'background: linear-gradient(to bottom right, {COLORS["cep-green"]}, #15803d)'
        new_value = f'class="{before_classes}{after_classes}" style="{gradient_style}"'
        content = content.replace(match.group(0), new_value, 1)
        replacements += 1

    # from-cep-orange to-orange-700
    pattern = r'class="([^"]*?)from-cep-orange to-orange-700([^"]*?)"'
    matches = list(re.finditer(pattern, content))
    for match in matches:
        before_classes = match.group(1)
        after_classes = match.group(2)
        gradient_style = f'background: linear-gradient(to bottom right, {COLORS["cep-orange"]}, #c2410c)'
        new_value = f'class="{before_classes}{after_classes}" style="{gradient_style}"'
        content = content.replace(match.group(0), new_value, 1)
        replacements += 1

    # from-cep-blue to-blue-700
    pattern = r'class="([^"]*?)from-cep-blue to-blue-700([^"]*?)"'
    matches = list(re.finditer(pattern, content))
    for match in matches:
        before_classes = match.group(1)
        after_classes = match.group(2)
        gradient_style = f'background: linear-gradient(to bottom right, {COLORS["cep-blue"]}, #1d4ed8)'
        new_value = f'class="{before_classes}{after_classes}" style="{gradient_style}"'
        content = content.replace(match.group(0), new_value, 1)
        replacements += 1

    if replacements > 0:
        print(f"  → {replacements} gradientes reemplazados")

    return content

def fix_hover_classes(content):
    """
    Reemplaza clases hover:bg-cep-* por inline styles.
    NOTA: Los hovers inline requieren JavaScript o mantener las clases Tailwind estándar.
    Por ahora, mantenemos las clases hover pero agregamos el color base.
    """
    # Esta función se puede extender si es necesario
    # Por ahora, los hovers deberían funcionar si los colores base están correctos
    return content

def process_file(filepath):
    """Procesa un archivo HTML aplicando todas las correcciones."""
    print(f"\nProcesando: {filepath}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_length = len(content)

        # Aplicar correcciones
        content = fix_gradient_classes(content)
        content = fix_bg_classes(content)
        content = fix_hover_classes(content)

        # Guardar
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        new_length = len(content)
        print(f"  ✓ Completado (Δ {new_length - original_length:+d} bytes)")

        return True

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def main():
    """Función principal."""
    print("=" * 70)
    print("CEP COMUNICACIÓN - CORRECCIÓN DE COLORES CUSTOM CON TAILWIND CDN")
    print("=" * 70)
    print("\nProblema: TailwindCSS CDN no reconoce clases custom CSS")
    print("Solución: Reemplazar por estilos inline con colores corporativos\n")

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
    print("\nValidar visualmente:")
    print("  - http://46.62.222.138/ (CTA section debe tener fondo magenta)")
    print("  - http://46.62.222.138/cursos (Hero debe tener fondo magenta)")
    print("  - Tarjetas de cursos deben tener gradientes de color")

if __name__ == "__main__":
    main()
