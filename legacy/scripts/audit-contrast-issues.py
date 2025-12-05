#!/usr/bin/env python3
"""
Audit and fix contrast issues: white text on white backgrounds
"""

import re
from pathlib import Path

def find_contrast_issues(filepath):
    """Find sections with white/light background AND white text"""
    content = filepath.read_text(encoding='utf-8')
    issues = []

    # Pattern 1: bg-white with text-white
    pattern1 = r'class="[^"]*bg-white[^"]*text-white[^"]*"'
    for match in re.finditer(pattern1, content):
        issues.append({
            'type': 'bg-white + text-white',
            'match': match.group(0),
            'position': match.start()
        })

    # Pattern 2: text-white with bg-white (order reversed)
    pattern2 = r'class="[^"]*text-white[^"]*bg-white[^"]*"'
    for match in re.finditer(pattern2, content):
        issues.append({
            'type': 'text-white + bg-white',
            'match': match.group(0),
            'position': match.start()
        })

    # Pattern 3: bg-gray-50 or bg-gray-100 with text-white
    pattern3 = r'class="[^"]*bg-gray-(50|100)[^"]*text-white[^"]*"'
    for match in re.finditer(pattern3, content):
        issues.append({
            'type': 'bg-gray-light + text-white',
            'match': match.group(0),
            'position': match.start()
        })

    return issues

def fix_contrast_issues(filepath):
    """Fix contrast issues by changing text color"""
    content = filepath.read_text(encoding='utf-8')
    original = content
    fixes = []

    # Fix 1: bg-white + text-white → bg-white + text-gray-900
    pattern1 = r'class="([^"]*bg-white[^"]*)text-white([^"]*)"'
    if re.search(pattern1, content):
        content = re.sub(pattern1, r'class="\1text-gray-900\2"', content)
        fixes.append('bg-white + text-white → text-gray-900')

    # Fix 2: text-white + bg-white → text-gray-900 + bg-white
    pattern2 = r'class="([^"]*)text-white([^"]*)bg-white([^"]*)"'
    if re.search(pattern2, content):
        content = re.sub(pattern2, r'class="\1text-gray-900\2bg-white\3"', content)
        fixes.append('text-white + bg-white → text-gray-900')

    # Fix 3: bg-gray-50/100 + text-white → text-gray-900
    pattern3 = r'class="([^"]*bg-gray-(?:50|100)[^"]*)text-white([^"]*)"'
    if re.search(pattern3, content):
        content = re.sub(pattern3, r'class="\1text-gray-900\2"', content)
        fixes.append('bg-gray-light + text-white → text-gray-900')

    if content != original:
        filepath.write_text(content, encoding='utf-8')
        return True, fixes
    return False, []

def main():
    """Main execution"""
    print("=" * 75)
    print("AUDITORÍA: CONTRASTE TEXTO BLANCO SOBRE FONDO BLANCO")
    print("=" * 75)
    print()

    # Get all HTML files
    html_files = list(Path(".").glob("*.html")) + list(Path("cursos").glob("*.html"))

    # Phase 1: Audit
    print("FASE 1: AUDITORÍA")
    print("-" * 75)

    total_issues = 0
    files_with_issues = []

    for filepath in sorted(html_files):
        issues = find_contrast_issues(filepath)
        if issues:
            print(f"\n❌ {filepath}")
            for issue in issues:
                print(f"   • {issue['type']}")
                print(f"     {issue['match'][:80]}...")
            total_issues += len(issues)
            files_with_issues.append(filepath)

    print()
    print(f"Total Issues Found: {total_issues} en {len(files_with_issues)} archivos")
    print()

    # Phase 2: Fix
    print("FASE 2: CORRECCIÓN")
    print("-" * 75)

    fixed_count = 0
    for filepath in files_with_issues:
        fixed, fixes = fix_contrast_issues(filepath)
        if fixed:
            print(f"✓ {filepath}")
            for fix in fixes:
                print(f"   • {fix}")
            fixed_count += 1

    print()
    print("=" * 75)
    print(f"✅ COMPLETADO: {fixed_count} archivos corregidos")
    print()
    print("Cambios aplicados:")
    print("  • bg-white + text-white → text-gray-900 (negro)")
    print("  • bg-gray-50/100 + text-white → text-gray-900")
    print()
    print("WCAG AA Compliance: Texto oscuro sobre fondo claro")
    print("=" * 75)

if __name__ == "__main__":
    main()
