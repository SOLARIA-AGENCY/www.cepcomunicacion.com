#!/usr/bin/env python3
"""
Script de corrección de menús EMPLEO
====================================

CAMBIOS SOLICITADOS:
1. Eliminar "Agencia de Empleo" del menú superior (acabamos de agregarlo por error)
2. Mantener solo "EMPLEO" en el menú superior después de "Nosotros"
3. Agregar "Empleo" al menú del footer en la sección "Institución"
"""

import re
import os
from pathlib import Path

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
    "aviso-legal.html",
    "politica-privacidad.html",
    "politica-cookies.html",
    "cursos/desempleados.html",
    "cursos/ocupados.html",
    "cursos/privados.html",
    "cursos/teleformacion.html",
]

def remove_agencia_empleo_from_menu(content):
    """Elimina el enlace 'Agencia de Empleo' del menú superior."""
    # Pattern para el enlace "Agencia de Empleo" completo
    pattern = r'\s*<a\s+href="https://cursostenerife\.agenciascolocacion\.com/candidatos/registro"\s+target="_blank"\s+class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide"\s*>\s*Agencia de Empleo\s*</a>\s*'

    matches = list(re.finditer(pattern, content, re.DOTALL))

    if matches:
        content = re.sub(pattern, '', content, flags=re.DOTALL)
        print(f"  → Eliminado enlace 'Agencia de Empleo' ({len(matches)} ocurrencias)")

    return content

def add_empleo_to_footer(content):
    """Agrega enlace 'Empleo' al footer en la sección Institución."""
    # Buscar la sección "Institución" en el footer
    # Pattern: después de </li> que contiene "Sedes" y antes de </ul>

    # Primero, verificar si ya existe "Empleo" en el footer
    if re.search(r'<li>\s*<a[^>]*>\s*Empleo\s*</a>\s*</li>', content, re.IGNORECASE):
        print("  → 'Empleo' ya existe en footer")
        return content

    # Buscar el </li> que cierra el enlace de "FAQ" en la sección Institución
    # Y agregar el nuevo enlace justo después
    pattern = r'(<li><a href="/faq"[^>]*>FAQ</a></li>)'
    empleo_link = '''
              <li>
                <a
                  href="https://cursostenerife.agenciascolocacion.com/candidatos/registro"
                  target="_blank"
                  class="text-white opacity-90 hover:opacity-100 hover:underline"
                >
                  Empleo
                </a>
              </li>'''

    if re.search(pattern, content):
        content = re.sub(pattern, r'\1' + empleo_link, content, count=1)
        print("  → Agregado enlace 'Empleo' al footer después de FAQ")
    else:
        # Intentar otra posición: después de "Blog"
        pattern = r'(<li><a href="/blog"[^>]*>Blog</a></li>)'
        if re.search(pattern, content):
            content = re.sub(pattern, r'\1' + empleo_link, content, count=1)
            print("  → Agregado enlace 'Empleo' al footer después de Blog")

    return content

def process_file(filepath):
    """Procesa un archivo HTML aplicando todas las correcciones."""
    print(f"\nProcesando: {filepath}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_length = len(content)

        # Aplicar correcciones
        content = remove_agencia_empleo_from_menu(content)
        content = add_empleo_to_footer(content)

        # Guardar
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
    print("CEP COMUNICACIÓN - CORRECCIÓN DE MENÚS EMPLEO")
    print("=" * 70)
    print("\nCambios:")
    print("  1. Eliminar 'Agencia de Empleo' del menú superior")
    print("  2. Mantener solo 'EMPLEO' después de 'Nosotros'")
    print("  3. Agregar 'Empleo' al footer\n")

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
