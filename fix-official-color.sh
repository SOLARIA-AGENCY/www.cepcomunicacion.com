#!/bin/bash
# Corrección de color corporativo oficial CEP FORMACIÓN
# Color oficial: #F2014B (en lugar de #ec008c incorrecto)

echo "======================================================================"
echo "CEP FORMACIÓN - ACTUALIZACIÓN COLOR CORPORATIVO OFICIAL"
echo "======================================================================"
echo ""
echo "Color oficial: #F2014B"
echo "Reemplazando: #ec008c → #F2014B"
echo "Reemplazando: #c7006f → #d01040 (oscuro derivado)"
echo ""

# Lista de archivos HTML
FILES=(
  "index.html"
  "sedes.html"
  "blog.html"
  "ciclos.html"
  "contacto.html"
  "cursos.html"
  "faq.html"
  "sobre-nosotros.html"
  "acceso-alumnos.html"
  "aviso-legal.html"
  "politica-privacidad.html"
  "politica-cookies.html"
  "cursos/desempleados.html"
  "cursos/ocupados.html"
  "cursos/privados.html"
  "cursos/teleformacion.html"
)

total=0
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -n "Procesando: $file ... "

    # Contar ocurrencias antes
    count_old=$(grep -c "#ec008c" "$file" 2>/dev/null || echo "0")
    count_dark=$(grep -c "#c7006f" "$file" 2>/dev/null || echo "0")

    # Reemplazar color principal
    sed -i '' 's/#ec008c/#F2014B/g' "$file"

    # Reemplazar color oscuro
    sed -i '' 's/#c7006f/#d01040/g' "$file"

    changes=$((count_old + count_dark))
    total=$((total + changes))

    echo "✓ ($changes cambios)"
  else
    echo "⚠ No encontrado: $file"
  fi
done

echo ""
echo "======================================================================"
echo "RESUMEN: $total reemplazos realizados"
echo "======================================================================"
echo ""
echo "Color corporativo #F2014B aplicado en:"
echo "  - Variables CSS :root"
echo "  - Estilos inline background-color"
echo "  - Gradientes lineales"
echo "  - Clases de texto"
echo ""
