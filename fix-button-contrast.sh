#!/bin/bash
# Corrección de botones con problemas de contraste
# Problema: text-cep-pink (#F2014B) sobre background-color: #F2014B

echo "======================================================================"
echo "CEP FORMACIÓN - CORRECCIÓN CONTRASTE BOTONES"
echo "======================================================================"
echo ""

FILES=(
  "index.html"
  "sedes.html"
  "contacto.html"
  "cursos.html"
  "faq.html"
  "sobre-nosotros.html"
  "blog.html"
  "ciclos.html"
)

total=0
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -n "Procesando: $file ... "

    # Contar problemas antes
    before=$(grep -c 'text-cep-pink.*background-color: #F2014B' "$file" 2>/dev/null || echo "0")

    # Corregir: reemplazar text-cep-pink por text-white cuando hay background #F2014B
    sed -i '' 's/text-cep-pink \(.*\)background-color: #F2014B/text-white \1background-color: #F2014B/g' "$file"

    # También corregir hover: hover:bg-cep-pink con texto del mismo color
    sed -i '' 's/hover:bg-cep-pink hover:text-cep-pink/hover:bg-cep-pink hover:text-white/g' "$file"

    after=$(grep -c 'text-cep-pink.*background-color: #F2014B' "$file" 2>/dev/null || echo "0")
    changes=$((before - after))

    if [ $changes -gt 0 ]; then
      echo "✓ ($changes correcciones)"
      total=$((total + changes))
    else
      echo "✓ (sin problemas)"
    fi
  fi
done

echo ""
echo "======================================================================"
echo "RESUMEN: $total correcciones realizadas"
echo "======================================================================"
