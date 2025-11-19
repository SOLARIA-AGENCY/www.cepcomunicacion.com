#!/bin/bash
# Corrección de colores en blog.html y ciclos.html
# Estas páginas tienen colores azules incorrectos, deben usar #F2014B

echo "======================================================================"
echo "CEP FORMACIÓN - CORRECCIÓN COLORES BLOG Y CICLOS"
echo "======================================================================"
echo ""
echo "Reemplazando colores azules por #F2014B en blog.html y ciclos.html"
echo ""

# Backup
cp blog.html blog.html.backup 2>/dev/null
cp ciclos.html ciclos.html.backup 2>/dev/null

# Crear el bloque <style> correcto
cat > /tmp/correct_style.txt << 'EOF'
    <style>
      /* Custom CEP Colors */
      :root {
        --cep-pink: #F2014B;
        --cep-pink-dark: #d01040;
        --cep-green: #00a651;
        --cep-blue: #0056b3;
        --cep-orange: #ff6b35;
      }

      .cep-pink {
        background-color: var(--cep-pink);
      }
      .cep-pink-dark {
        background-color: var(--cep-pink-dark);
      }
      .text-cep-pink {
        color: var(--cep-pink);
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      * {
        transition: all 0.3s ease;
      }
    </style>
EOF

# Para blog.html y ciclos.html, reemplazar el bloque <style>
for file in blog.html ciclos.html; do
  if [ -f "$file" ]; then
    echo "Procesando: $file"

    # Usar sed para reemplazar el bloque de estilos
    # Buscar desde <style> hasta </style> y reemplazar
    perl -0777 -i -pe 's/<style>.*?<\/style>/`cat \/tmp\/correct_style.txt`/se' "$file"

    echo "  ✓ Estilos actualizados"
  fi
done

# Limpiar
rm /tmp/correct_style.txt

echo ""
echo "======================================================================"
echo "COMPLETADO"
echo "======================================================================"
echo ""
echo "Nota: blog.html y ciclos.html pueden necesitar actualización manual"
echo "de su estructura para coincidir con el resto del sitio."
