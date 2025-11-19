#!/bin/bash

# Script para aplicar correcciones masivas a todas las páginas HTML
# CEP Formación - Correcciones corporativas

echo "=== Aplicando correcciones corporativas a todas las páginas HTML ==="

# Lista de archivos a corregir
FILES="acceso-alumnos.html aviso-legal.html blog.html ciclos.html contacto.html cursos.html faq.html politica-cookies.html politica-privacidad.html sedes.html sobre-nosotros.html"

for file in $FILES; do
  if [ -f "$file" ]; then
    echo "Corrigiendo: $file"

    # 1. Actualizar copyright
    sed -i '' 's/© 2024 CEP Formación/© 2025 CEP Comunicación/g' "$file"

    # 2. Cambiar footer de bg-gray-900 a cep-pink
    sed -i '' 's/bg-gray-900 text-white/cep-pink text-white/g' "$file"
    sed -i '' 's/<footer class="bg-gray-900/<footer class="cep-pink/g' "$file"

    # 3. Actualizar enlaces footer de text-gray-300 a text-white opacity-90
    sed -i '' 's/text-gray-300 hover:text-white/text-white opacity-90 hover:opacity-100 hover:underline/g' "$file"
    sed -i '' 's/text-gray-400 hover:text-white/text-white opacity-90 hover:opacity-100/g' "$file"

    # 4. Actualizar bordes del footer
    sed -i '' 's/border-gray-700/border-white border-opacity-20/g' "$file"
    sed -i '' 's/border-gray-800/border-white border-opacity-20/g' "$file"

    echo "  ✓ Copyright actualizado"
    echo "  ✓ Footer corporativo aplicado"
  else
    echo "  ✗ Archivo no encontrado: $file"
  fi
done

# Corregir también las páginas de cursos
cd cursos 2>/dev/null
if [ $? -eq 0 ]; then
  echo "Corrigiendo páginas en cursos/"
  for file in *.html; do
    if [ -f "$file" ]; then
      echo "Corrigiendo: cursos/$file"
      sed -i '' 's/© 2024 CEP Formación/© 2025 CEP Comunicación/g' "$file"
      sed -i '' 's/bg-gray-900 text-white/cep-pink text-white/g' "$file"
      sed -i '' 's/<footer class="bg-gray-900/<footer class="cep-pink/g' "$file"
      sed -i '' 's/text-gray-300 hover:text-white/text-white opacity-90 hover:opacity-100 hover:underline/g' "$file"
      sed -i '' 's/border-gray-700/border-white border-opacity-20/g' "$file"
    fi
  done
  cd ..
fi

echo "=== Correcciones completadas ==="
