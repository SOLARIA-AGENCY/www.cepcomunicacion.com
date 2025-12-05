#!/usr/bin/env python3
"""
Fix Hero and Footer Color Issues
- Remove duplicate style attributes from buttons
- Fix footer background color
- Fix malformed hover classes
"""

import re
from pathlib import Path

CEP_PINK = "#F2014B"

def fix_duplicate_styles(content):
    """Remove duplicate style attributes and fix hover classes"""
    # Fix duplicate style attributes: remove first one, keep second
    content = re.sub(
        r'style="background-color: #d01040"\s+style="background-color: #F2014B"',
        f'style="background-color: {CEP_PINK}"',
        content
    )

    # Fix malformed hover class ` hover: ` - remove it
    content = re.sub(
        r'class="\s*hover:\s+',
        'class="',
        content
    )

    return content

def fix_footer_background(content):
    """Fix footer background from class to inline style"""
    # Replace footer class="cep-pink" with inline style
    content = re.sub(
        r'<footer\s+class="cep-pink\s+text-white\s+py-12">',
        f'<footer class="text-white py-12" style="background-color: {CEP_PINK}">',
        content
    )

    return content

def process_file(filepath):
    """Process a single HTML file"""
    print(f"Processing {filepath.name}...")

    content = filepath.read_text(encoding='utf-8')
    original = content

    # Apply fixes
    content = fix_duplicate_styles(content)
    content = fix_footer_background(content)

    if content != original:
        filepath.write_text(content, encoding='utf-8')
        print(f"  ✓ Fixed {filepath.name}")
        return True
    else:
        print(f"  - No changes needed for {filepath.name}")
        return False

def main():
    """Main execution"""
    print("=" * 60)
    print("FIXING HERO AND FOOTER COLORS")
    print("=" * 60)

    # Get all HTML files
    html_files = [
        Path("index.html"),
        Path("blog.html"),
        Path("ciclos.html"),
        Path("sedes.html"),
        Path("cursos.html"),
        Path("contacto.html"),
        Path("faq.html"),
        Path("sobre-nosotros.html"),
        Path("acceso-alumnos.html"),
        Path("aviso-legal.html"),
        Path("politica-cookies.html"),
        Path("politica-privacidad.html"),
        Path("cursos/desempleados.html"),
        Path("cursos/ocupados.html"),
        Path("cursos/privados.html"),
        Path("cursos/teleformacion.html"),
    ]

    fixed_count = 0
    for filepath in html_files:
        if filepath.exists():
            if process_file(filepath):
                fixed_count += 1

    print()
    print("=" * 60)
    print(f"✅ COMPLETED: {fixed_count}/{len(html_files)} files fixed")
    print()
    print("Changes applied:")
    print("  • Removed duplicate style attributes from buttons")
    print("  • Fixed malformed hover classes")
    print(f"  • Fixed footer background: {CEP_PINK}")
    print("=" * 60)

if __name__ == "__main__":
    main()
