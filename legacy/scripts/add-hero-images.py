#!/usr/bin/env python3
"""
Add Pexels hero images to page headers
"""

import re
from pathlib import Path

HERO_REPLACEMENTS = {
    "sedes.html": {
        "old": 'style="background: linear-gradient(to right, #F2014B, #d01040)"',
        "new": 'style="background: linear-gradient(rgba(242, 1, 75, 0.85), rgba(208, 16, 64, 0.85)), url(\'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1920\') center/cover no-repeat"'
    },
    "sobre-nosotros.html": {
        "old": 'style="background: linear-gradient(to right, #F2014B, #d01040)"',
        "new": 'style="background: linear-gradient(rgba(242, 1, 75, 0.85), rgba(208, 16, 64, 0.85)), url(\'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920\') center/cover no-repeat"'
    },
    "cursos.html": {
        "old": 'style="background: linear-gradient(to right, #F2014B, #d01040)"',
        "new": 'style="background: linear-gradient(rgba(242, 1, 75, 0.85), rgba(208, 16, 64, 0.85)), url(\'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920\') center/cover no-repeat"'
    }
}

def main():
    print("=" * 70)
    print("ADDING HERO BACKGROUND IMAGES FROM PEXELS")
    print("=" * 70)
    print()

    updated_count = 0

    for filename, replacement in HERO_REPLACEMENTS.items():
        filepath = Path(filename)
        if not filepath.exists():
            print(f"❌ {filename} not found")
            continue

        content = filepath.read_text(encoding='utf-8')

        if replacement["old"] in content:
            content = content.replace(replacement["old"], replacement["new"])
            filepath.write_text(content, encoding='utf-8')
            print(f"✓ {filename}: Hero image added")
            updated_count += 1
        else:
            print(f"- {filename}: Pattern not found")

    print()
    print("=" * 70)
    print(f"✅ COMPLETED: {updated_count}/{len(HERO_REPLACEMENTS)} pages updated")
    print()
    print("Hero images added:")
    print("  • sedes.html: Modern building entrance")
    print("  • sobre-nosotros.html: Team collaboration")
    print("  • cursos.html: Students learning")
    print("=" * 70)

if __name__ == "__main__":
    main()
