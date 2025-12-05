#!/usr/bin/env python3
"""
Script de corrección masiva para CEP Comunicación
Corrige todos los problemas identificados:
1. Elimina enlaces EMPLEO duplicados
2. Agrega "Agencia de Empleo" después de Sedes
3. Reemplaza logo en header
4. Agrega logo con círculo blanco en footer
5. Elimina "agencia de colocación" del footer
"""

import re
import os
from pathlib import Path

# Lista de archivos HTML a procesar (excluye index.html que ya está correcto)
HTML_FILES = [
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

def fix_duplicated_empleo_links(content):
    """
    Elimina todos los enlaces EMPLEO duplicados que aparecen entre items del menú.
    Solo debe quedar UN enlace EMPLEO en la posición correcta (después de Nosotros).
    """
    # Pattern para enlaces EMPLEO standalone (no dentro de dropdown)
    empleo_pattern = r'\s*<a\s+href="https://cursostenerife\.agenciascolocacion\.com/candidatos/registro"\s+target="_blank"\s+class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide"\s*>\s*EMPLEO\s*</a>\s*'

    # Encontrar todos los matches
    matches = list(re.finditer(empleo_pattern, content, re.DOTALL))

    print(f"  → Encontrados {len(matches)} enlaces EMPLEO")

    if len(matches) <= 1:
        return content

    # Eliminar todos excepto el que está después de "Nosotros"
    # Primero, vamos a eliminar todos y luego insertar uno en la posición correcta
    content = re.sub(empleo_pattern, '', content, flags=re.DOTALL)

    # Insertar el enlace EMPLEO después del enlace "Nosotros"
    nosotros_pattern = r'(<a\s+href="/sobre-nosotros"[^>]*>\s*Nosotros\s*</a>)'
    empleo_link = '''
            <a
              href="https://cursostenerife.agenciascolocacion.com/candidatos/registro"
              target="_blank"
              class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide"
            >
              EMPLEO
            </a>'''

    content = re.sub(nosotros_pattern, r'\1' + empleo_link, content, count=1)

    return content

def add_agencia_empleo_link(content):
    """
    Agrega el enlace "Agencia de Empleo" después de "Sedes" en el menú.
    """
    # Buscar el enlace de Sedes en desktop menu
    sedes_pattern = r'(<a\s+href="/sedes"[^>]*>\s*Sedes\s*</a>)'
    agencia_link = '''
            <a
              href="https://cursostenerife.agenciascolocacion.com/candidatos/registro"
              target="_blank"
              class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide"
            >
              Agencia de Empleo
            </a>'''

    # Solo agregar si no existe ya
    if 'Agencia de Empleo' not in content:
        content = re.sub(sedes_pattern, r'\1' + agencia_link, content, count=1)
        print("  → Agregado enlace 'Agencia de Empleo' después de Sedes")

    return content

def replace_header_logo(content):
    """
    Reemplaza el texto "CEP Formación" por el logo en el header.
    """
    # Pattern para el logo text
    logo_text_pattern = r'<a href="/" class="text-2xl font-bold text-cep-pink">\s*CEP Formación\s*</a>'
    logo_img = '''<a href="/" class="flex items-center">
            <img src="/cep-logo.png" alt="CEP Formación" class="h-12 w-auto" />
          </a>'''

    if re.search(logo_text_pattern, content):
        content = re.sub(logo_text_pattern, logo_img, content)
        print("  → Reemplazado texto del header por logo")

    return content

def add_footer_logo_with_circle(content):
    """
    Agrega el logo con círculo blanco en el footer de la sección principal.
    """
    # Buscar la sección del footer que tiene "Centro de estudios profesionales..."
    footer_pattern = r'(<div>\s*<h4 class="text-lg font-semibold mb-4">CEP Formación</h4>\s*<p class="text-white opacity-90">)'

    # Reemplazar con logo + círculo blanco
    footer_with_logo = r'''<div>
            <div class="bg-white rounded-full p-3 w-20 h-20 flex items-center justify-center mb-4">
              <img src="/cep-logo.png" alt="CEP Formación" class="w-full h-full object-contain" />
            </div>
            <p class="text-white opacity-90">'''

    if re.search(footer_pattern, content):
        content = re.sub(footer_pattern, footer_with_logo, content)
        print("  → Agregado logo con círculo blanco en footer")

    return content

def remove_agencia_colocacion(content):
    """
    Elimina el enlace "agencia de colocación" del footer.
    """
    # Pattern para el <li> completo que contiene "agencia de colocación"
    pattern = r'\s*<li>\s*<a[^>]*>\s*agencia de colocación\s*</a>\s*</li>\s*'

    if re.search(pattern, content, re.IGNORECASE):
        content = re.sub(pattern, '', content, flags=re.IGNORECASE)
        print("  → Eliminado enlace 'agencia de colocación' del footer")

    # También buscar variantes
    pattern2 = r'\s*<li>\s*<a[^>]*>\s*Agencia de Colocación\s*</a>\s*</li>\s*'
    if re.search(pattern2, content):
        content = re.sub(pattern2, '', content)
        print("  → Eliminado enlace 'Agencia de Colocación' del footer")

    return content

def process_file(filepath):
    """Procesa un archivo HTML aplicando todas las correcciones."""
    print(f"\nProcesando: {filepath}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_length = len(content)

        # Aplicar todas las correcciones en secuencia
        content = fix_duplicated_empleo_links(content)
        content = add_agencia_empleo_link(content)
        content = replace_header_logo(content)
        content = add_footer_logo_with_circle(content)
        content = remove_agencia_colocacion(content)

        # Guardar archivo modificado
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
    print("CEP COMUNICACIÓN - SCRIPT DE CORRECCIÓN MASIVA")
    print("=" * 70)

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

    # También procesar index.html solo para agregar "Agencia de Empleo" y logo en footer
    print(f"\nProcesando: index.html (solo ajustes específicos)")
    index_path = base_dir / "index.html"
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Solo aplicar estas correcciones a index.html
        content = add_agencia_empleo_link(content)
        content = add_footer_logo_with_circle(content)
        content = remove_agencia_colocacion(content)

        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print("  ✓ Completado")
        success_count += 1

    print("\n" + "=" * 70)
    print(f"RESUMEN: {success_count} éxitos, {fail_count} fallos")
    print("=" * 70)

if __name__ == "__main__":
    main()
