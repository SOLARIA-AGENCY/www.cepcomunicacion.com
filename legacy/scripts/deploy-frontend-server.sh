#!/bin/bash

# CEP Formación Frontend Deployment Script
# Execute this script on the server to update the frontend

echo "🚀 Starting CEP Formación Frontend Deployment..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Navigate to nginx directory
cd /usr/share/nginx/html/

# Backup current files
echo "📦 Creating backup..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r * "$BACKUP_DIR/" 2>/dev/null || true

# Create new frontend files
echo "📝 Creating new frontend files..."

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CEP Formación - Centro de Estudios Profesionales</title>
    <meta name="description" content="CEP Formación - Cursos profesionales, privados, ocupados, desempleados y teleformación">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom CEP Colors - Maintaining current server style */
        :root {
            --cep-pink: #ec008c;
            --cep-pink-dark: #c7006f;
            --cep-green: #00a651;
            --cep-blue: #0056b3;
            --cep-orange: #ff6b35;
        }
        
        .cep-pink { background-color: var(--cep-pink); }
        .cep-pink-dark { background-color: var(--cep-pink-dark); }
        .text-cep-pink { color: var(--cep-pink); }
        
        /* System typography - no custom fonts */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Smooth transitions */
        * {
            transition: all 0.3s ease;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-md sticky top-0 z-50">
        <nav class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <a href="/" class="text-2xl font-bold text-cep-pink">
                    CEP Formación
                </a>

                <!-- Desktop Navigation -->
                <div class="hidden lg:flex gap-6 items-center">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Inicio
                    </a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Ciclos
                    </a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Sedes
                    </a>
                    
                    <!-- Cursos Dropdown -->
                    <div class="relative group">
                        <button class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide flex items-center gap-1">
                            Cursos
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M6 8L2 4h8z"/>
                            </svg>
                        </button>
                        <div class="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                            <a href="/cursos/privados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Teleformación</a>
                        </div>
                    </div>

                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Nosotros
                    </a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        FAQ
                    </a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Blog
                    </a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Contacto
                    </a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Acceso Alumnos
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button class="lg:hidden p-2" onclick="toggleMobileMenu()">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu -->
            <div id="mobileMenu" class="hidden lg:hidden mt-4 pb-4 border-t pt-4">
                <div class="flex flex-col gap-4">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold">Inicio</a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold">Ciclos</a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold">Sedes</a>
                    <div>
                        <button class="text-gray-700 hover:text-cep-pink font-semibold w-full text-left" onclick="toggleMobileDropdown()">
                            Cursos ▼
                        </button>
                        <div id="mobileDropdown" class="hidden pl-4 mt-2 space-y-2">
                            <a href="/cursos/privados" class="block text-gray-700 hover:text-cep-pink">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block text-gray-700 hover:text-cep-pink">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block text-gray-700 hover:text-cep-pink">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block text-gray-700 hover:text-cep-pink">Cursos Teleformación</a>
                        </div>
                    </div>
                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold">Nosotros</a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold">FAQ</a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold">Blog</a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-center">Contacto</a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-center">Acceso Alumnos</a>
                </div>
            </div>
        </nav>
    </header>

    <!-- Hero Carousel -->
    <section class="relative h-[600px] overflow-hidden">
        <div class="carousel-container relative h-full">
            <!-- Slide 1 -->
            <div class="carousel-slide absolute inset-0 transition-opacity duration-1000" data-slide="0">
                <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
                <img src="https://www.cursostenerife.es/slideshow/slideshow-1.jpg.webp" alt="Formación Profesional" class="w-full h-full object-cover">
                <div class="absolute inset-0 flex items-center justify-center z-20">
                    <div class="text-center text-white px-4">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                            FORMACIÓN PROFESIONAL
                        </h1>
                        <p class="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6 text-pink-400">
                            Impulsa tu carrera con nuestros cursos especializados
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/cursos" class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform rounded-lg">
                                Ver Cursos
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                            <a href="/contacto" class="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform rounded-lg">
                                Contactar
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2 -->
            <div class="carousel-slide absolute inset-0 transition-opacity duration-1000 opacity-0" data-slide="1">
                <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
                <img src="https://www.cursostenerife.es/slideshow/slideshow-2.jpg.webp" alt="Cursos para Empresas" class="w-full h-full object-cover">
                <div class="absolute inset-0 flex items-center justify-center z-20">
                    <div class="text-center text-white px-4">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                            CURSOS PARA EMPRESAS
                        </h1>
                        <p class="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6 text-pink-400">
                            Formación a medida para tu equipo
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/cursos/ocupados" class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform rounded-lg">
                                Empresas
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                            <a href="/contacto" class="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform rounded-lg">
                                Información
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3 -->
            <div class="carousel-slide absolute inset-0 transition-opacity duration-1000 opacity-0" data-slide="2">
                <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
                <img src="https://www.cursostenerife.es/slideshow/slideshow-3.jpg.webp" alt="Teleformación" class="w-full h-full object-cover">
                <div class="absolute inset-0 flex items-center justify-center z-20">
                    <div class="text-center text-white px-4">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                            TELEFORMACIÓN
                        </h1>
                        <p class="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6 text-pink-400">
                            Aprende desde donde quieras, cuando quieras
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/cursos/teleformacion" class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform rounded-lg">
                                Online
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                            <a href="/contacto" class="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform rounded-lg">
                                Más Info
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Carousel Navigation -->
            <button class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-30" onclick="previousSlide()">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </button>
            <button class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-30" onclick="nextSlide()">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </button>

            <!-- Carousel Indicators -->
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                <button class="w-3 h-3 bg-white rounded-full carousel-indicator" data-slide="0" onclick="goToSlide(0)"></button>
                <button class="w-3 h-3 bg-white/50 rounded-full carousel-indicator" data-slide="1" onclick="goToSlide(1)"></button>
                <button class="w-3 h-3 bg-white/50 rounded-full carousel-indicator" data-slide="2" onclick="goToSlide(2)"></button>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 md:py-20 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                    ¿Por qué elegir CEP Formación?
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Te ofrecemos las mejores herramientas para tu desarrollo profesional
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center p-6">
                    <div class="w-16 h-16 bg-cep-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-cep-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Formación de Calidad</h3>
                    <p class="text-gray-600">
                        Cursos homologados con docentes expertos y contenidos actualizados
                    </p>
                </div>

                <div class="text-center p-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Ayudas Disponibles</h3>
                    <p class="text-gray-600">
                        Acceso a becas y financiación para facilitar tu formación profesional
                    </p>
                </div>

                <div class="text-center p-6">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Flexibilidad</h3>
                    <p class="text-gray-600">
                        Modalidades presencial, online y semipresencial para adaptarnos a ti
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-20 bg-cep-pink text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para dar el siguiente paso?
            </h2>
            <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Contacta con nosotros y te ayudaremos a encontrar el curso perfecto para impulsar tu carrera profesional
            </p>
            <a href="/contacto" class="bg-white text-cep-pink hover:bg-gray-100 px-8 py-4 text-lg font-bold inline-block rounded-lg hover:scale-105 transition-transform">
                Solicitar Información
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4 text-cep-pink">CEP Formación</h3>
                    <p class="text-gray-300">
                        Centro de estudios profesionales dedicado a tu desarrollo y crecimiento laboral.
                    </p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Cursos</h4>
                    <ul class="space-y-2">
                        <li><a href="/cursos/privados" class="text-gray-300 hover:text-cep-pink">Cursos Privados</a></li>
                        <li><a href="/cursos/ocupados" class="text-gray-300 hover:text-cep-pink">Cursos Ocupados</a></li>
                        <li><a href="/cursos/desempleados" class="text-gray-300 hover:text-cep-pink">Cursos Desempleados</a></li>
                        <li><a href="/cursos/teleformacion" class="text-gray-300 hover:text-cep-pink">Teleformación</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Institución</h4>
                    <ul class="space-y-2">
                        <li><a href="/sobre-nosotros" class="text-gray-300 hover:text-cep-pink">Sobre Nosotros</a></li>
                        <li><a href="/sedes" class="text-gray-300 hover:text-cep-pink">Sedes</a></li>
                        <li><a href="/faq" class="text-gray-300 hover:text-cep-pink">FAQ</a></li>
                        <li><a href="/blog" class="text-gray-300 hover:text-cep-pink">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Contacto</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li>Teléfono: 922 123 456</li>
                        <li>Email: info@cepformacion.com</li>
                        <li>
                            <a href="/contacto" class="text-cep-pink hover:text-cep-pink-dark">
                                Formulario de contacto →
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 CEP Formación. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile menu functionality
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function toggleMobileDropdown() {
            const dropdown = document.getElementById('mobileDropdown');
            dropdown.classList.toggle('hidden');
        }

        // Carousel functionality
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.opacity = i === index ? '1' : '0';
            });
            
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('bg-white', i === index);
                indicator.classList.toggle('bg-white/50', i !== index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function previousSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        function goToSlide(index) {
            currentSlide = index;
            showSlide(currentSlide);
        }

        // Auto-advance carousel
        setInterval(nextSlide, 5000);

        // Initialize
        showSlide(0);
    </script>
</body>
</html>
EOF

echo "✅ index.html created successfully"

# Create cursos.html
echo "📝 Creating cursos.html..."
cat > cursos.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cursos - CEP Formación</title>
    <meta name="description" content="Catálogo completo de cursos de CEP Formación">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --cep-pink: #ec008c;
            --cep-pink-dark: #c7006f;
            --cep-green: #00a651;
            --cep-blue: #0056b3;
            --cep-orange: #ff6b35;
        }
        
        .cep-pink { background-color: var(--cep-pink); }
        .cep-pink-dark { background-color: var(--cep-pink-dark); }
        .text-cep-pink { color: var(--cep-pink); }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        * {
            transition: all 0.3s ease;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-md sticky top-0 z-50">
        <nav class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <a href="/" class="text-2xl font-bold text-cep-pink">
                    CEP Formación
                </a>

                <!-- Desktop Navigation -->
                <div class="hidden lg:flex gap-6 items-center">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Inicio
                    </a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Ciclos
                    </a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Sedes
                    </a>
                    
                    <!-- Cursos Dropdown -->
                    <div class="relative group">
                        <button class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide flex items-center gap-1">
                            Cursos
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M6 8L2 4h8z"/>
                            </svg>
                        </button>
                        <div class="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                            <a href="/cursos/privados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Teleformación</a>
                        </div>
                    </div>

                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Nosotros
                    </a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        FAQ
                    </a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Blog
                    </a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Contacto
                    </a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Acceso Alumnos
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button class="lg:hidden p-2" onclick="toggleMobileMenu()">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu -->
            <div id="mobileMenu" class="hidden lg:hidden mt-4 pb-4 border-t pt-4">
                <div class="flex flex-col gap-4">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold">Inicio</a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold">Ciclos</a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold">Sedes</a>
                    <div>
                        <button class="text-gray-700 hover:text-cep-pink font-semibold w-full text-left" onclick="toggleMobileDropdown()">
                            Cursos ▼
                        </button>
                        <div id="mobileDropdown" class="hidden pl-4 mt-2 space-y-2">
                            <a href="/cursos/privados" class="block text-gray-700 hover:text-cep-pink">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block text-gray-700 hover:text-cep-pink">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block text-gray-700 hover:text-cep-pink">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block text-gray-700 hover:text-cep-pink">Cursos Teleformación</a>
                        </div>
                    </div>
                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold">Nosotros</a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold">FAQ</a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold">Blog</a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-center">Contacto</a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-center">Acceso Alumnos</a>
                </div>
            </div>
        </nav>
    </header>

    <!-- Page Header -->
    <section class="py-16 md:py-20 bg-gradient-to-r from-cep-pink to-cep-pink-dark text-white">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
                NUESTROS CURSOS
            </h1>
            <p class="text-xl opacity-90 max-w-3xl mx-auto">
                Descubre nuestra amplia oferta formativa y encuentra el curso perfecto para ti
            </p>
        </div>
    </section>

    <!-- Course Categories -->
    <section class="py-16 md:py-20">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Cursos Privados -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105">
                    <div class="h-48 bg-gradient-to-br from-cep-pink to-cep-pink-dark flex items-center justify-center">
                        <div class="text-white text-center">
                            <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                            <h3 class="text-xl font-bold">Cursos Privados</h3>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-600 mb-4">
                            Formación especializada con certificación propia y garantía de calidad.
                        </p>
                        <ul class="space-y-2 text-sm text-gray-600 mb-6">
                            <li>• Certificación propia</li>
                            <li>• Flexibilidad de horarios</li>
                            <li>• Prácticas profesionales</li>
                            <li>• Acceso a plataforma online</li>
                        </ul>
                        <a href="/contacto" class="w-full bg-cep-pink hover:bg-cep-pink-dark text-white py-3 rounded-lg font-semibold text-center block">
                            Ver Cursos Privados
                        </a>
                    </div>
                </div>

                <!-- Cursos Ocupados -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105">
                    <div class="h-48 bg-gradient-to-br from-cep-green to-green-700 flex items-center justify-center">
                        <div class="text-white text-center">
                            <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <h3 class="text-xl font-bold">Cursos Ocupados</h3>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-600 mb-4">
                            Formación para trabajadores ocupados con subvenciones y bonificaciones.
                        </p>
                        <ul class="space-y-2 text-sm text-gray-600 mb-6">
                            <li>• Bonificados para empresas</li>
                            <li>• Formación continua</li>
                            <li>• Actualización profesional</li>
                            <li>• Certificados oficiales</li>
                        </ul>
                        <a href="/contacto" class="w-full bg-cep-green hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-center block">
                            Ver Cursos Ocupados
                        </a>
                    </div>
                </div>

                <!-- Cursos Desempleados -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105">
                    <div class="h-48 bg-gradient-to-br from-cep-blue to-blue-700 flex items-center justify-center">
                        <div class="text-white text-center">
                            <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <h3 class="text-xl font-bold">Cursos Desempleados</h3>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-600 mb-4">
                            Formación gratuita para desempleados con inserción laboral garantizada.
                        </p>
                        <ul class="space-y-2 text-sm text-gray-600 mb-6">
                            <li>• Formación gratuita</li>
                            <li>• Inserción laboral</li>
                            <li>• Orientación profesional</li>
                            <li>• Prácticas en empresas</li>
                        </ul>
                        <a href="/contacto" class="w-full bg-cep-blue hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-center block">
                            Ver Cursos Desempleados
                        </a>
                    </div>
                </div>

                <!-- Teleformación -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105">
                    <div class="h-48 bg-gradient-to-br from-cep-orange to-orange-700 flex items-center justify-center">
                        <div class="text-white text-center">
                            <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <h3 class="text-xl font-bold">Teleformación</h3>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-600 mb-4">
                            Aprende desde casa con nuestra plataforma de formación online.
                        </p>
                        <ul class="space-y-2 text-sm text-gray-600 mb-6">
                            <li>• Aprende a tu ritmo</li>
                            <li>• Sin horarios fijos</li>
                            <li>• Tutorías online</li>
                            <li>• Acceso 24/7</li>
                        </ul>
                        <a href="/contacto" class="w-full bg-cep-orange hover:bg-orange-700 text-white py-3 rounded-lg font-semibold text-center block">
                            Ver Teleformación
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-20 bg-cep-pink text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">
                ¿Necesitas ayuda para elegir?
            </h2>
            <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Nuestro equipo de orientadores te ayudará a encontrar el curso perfecto para tus objetivos profesionales
            </p>
            <a href="/contacto" class="bg-white text-cep-pink hover:bg-gray-100 px-8 py-4 text-lg font-bold inline-block rounded-lg hover:scale-105 transition-transform">
                Solicitar Orientación
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4 text-cep-pink">CEP Formación</h3>
                    <p class="text-gray-300">
                        Centro de estudios profesionales dedicado a tu desarrollo y crecimiento laboral.
                    </p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Cursos</h4>
                    <ul class="space-y-2">
                        <li><a href="/cursos/privados" class="text-gray-300 hover:text-cep-pink">Cursos Privados</a></li>
                        <li><a href="/cursos/ocupados" class="text-gray-300 hover:text-cep-pink">Cursos Ocupados</a></li>
                        <li><a href="/cursos/desempleados" class="text-gray-300 hover:text-cep-pink">Cursos Desempleados</a></li>
                        <li><a href="/cursos/teleformacion" class="text-gray-300 hover:text-cep-pink">Teleformación</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Institución</h4>
                    <ul class="space-y-2">
                        <li><a href="/sobre-nosotros" class="text-gray-300 hover:text-cep-pink">Sobre Nosotros</a></li>
                        <li><a href="/sedes" class="text-gray-300 hover:text-cep-pink">Sedes</a></li>
                        <li><a href="/faq" class="text-gray-300 hover:text-cep-pink">FAQ</a></li>
                        <li><a href="/blog" class="text-gray-300 hover:text-cep-pink">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Contacto</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li>Teléfono: 922 123 456</li>
                        <li>Email: info@cepformacion.com</li>
                        <li>
                            <a href="/contacto" class="text-cep-pink hover:text-cep-pink-dark">
                                Formulario de contacto →
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 CEP Formación. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function toggleMobileDropdown() {
            const dropdown = document.getElementById('mobileDropdown');
            dropdown.classList.toggle('hidden');
        }
    </script>
</body>
</html>
EOF

echo "✅ cursos.html created successfully"

# Create contacto.html
echo "📝 Creating contacto.html..."
cat > contacto.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contacto - CEP Formación</title>
    <meta name="description" content="Contacta con CEP Formación para más información sobre nuestros cursos">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --cep-pink: #ec008c;
            --cep-pink-dark: #c7006f;
            --cep-green: #00a651;
            --cep-blue: #0056b3;
            --cep-orange: #ff6b35;
        }
        
        .cep-pink { background-color: var(--cep-pink); }
        .cep-pink-dark { background-color: var(--cep-pink-dark); }
        .text-cep-pink { color: var(--cep-pink); }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        * {
            transition: all 0.3s ease;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-md sticky top-0 z-50">
        <nav class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <a href="/" class="text-2xl font-bold text-cep-pink">
                    CEP Formación
                </a>

                <!-- Desktop Navigation -->
                <div class="hidden lg:flex gap-6 items-center">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Inicio
                    </a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Ciclos
                    </a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Sedes
                    </a>
                    
                    <!-- Cursos Dropdown -->
                    <div class="relative group">
                        <button class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide flex items-center gap-1">
                            Cursos
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M6 8L2 4h8z"/>
                            </svg>
                        </button>
                        <div class="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                            <a href="/cursos/privados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Teleformación</a>
                        </div>
                    </div>

                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Nosotros
                    </a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        FAQ
                    </a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Blog
                    </a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Contacto
                    </a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Acceso Alumnos
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button class="lg:hidden p-2" onclick="toggleMobileMenu()">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu -->
            <div id="mobileMenu" class="hidden lg:hidden mt-4 pb-4 border-t pt-4">
                <div class="flex flex-col gap-4">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold">Inicio</a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold">Ciclos</a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold">Sedes</a>
                    <div>
                        <button class="text-gray-700 hover:text-cep-pink font-semibold w-full text-left" onclick="toggleMobileDropdown()">
                            Cursos ▼
                        </button>
                        <div id="mobileDropdown" class="hidden pl-4 mt-2 space-y-2">
                            <a href="/cursos/privados" class="block text-gray-700 hover:text-cep-pink">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block text-gray-700 hover:text-cep-pink">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block text-gray-700 hover:text-cep-pink">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block text-gray-700 hover:text-cep-pink">Cursos Teleformación</a>
                        </div>
                    </div>
                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold">Nosotros</a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold">FAQ</a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold">Blog</a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-center">Contacto</a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-center">Acceso Alumnos</a>
                </div>
            </div>
        </nav>
    </header>

    <!-- Page Header -->
    <section class="py-16 md:py-20 bg-gradient-to-r from-cep-pink to-cep-pink-dark text-white">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
                CONTACTO
            </h1>
            <p class="text-xl opacity-90 max-w-3xl mx-auto">
                Estamos aquí para ayudarte a encontrar la formación que buscas
            </p>
        </div>
    </section>

    <!-- Contact Content -->
    <section class="py-16 md:py-20">
        <div class="container mx-auto px-4">
            <div class="grid lg:grid-cols-2 gap-12">
                <!-- Contact Form -->
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <h2 class="text-2xl font-bold mb-6 text-gray-900">
                        Envíanos un mensaje
                    </h2>
                    <form class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre *
                                </label>
                                <input type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cep-pink focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Apellidos *
                                </label>
                                <input type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cep-pink focus:border-transparent">
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cep-pink focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono
                                </label>
                                <input type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cep-pink focus:border-transparent">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de curso interesado
                            </label>
                            <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cep-pink focus:border-transparent">
                                <option value="">Selecciona una opción</option>
                                <option value="privados">Cursos Privados</option>
                                <option value="ocupados">Cursos Ocupados</option>
                                <option value="desempleados">Cursos Desempleados</option>
                                <option value="teleformacion">Teleformación</option>
                                <option value="no-seguro">No estoy seguro</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Mensaje *
                            </label>
                            <textarea required rows="5" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cep-pink focus:border-transparent"></textarea>
                        </div>

                        <div class="flex items-start">
                            <input type="checkbox" required class="mt-1 mr-3">
                            <label class="text-sm text-gray-600">
                                Acepto la <a href="#" class="text-cep-pink hover:underline">política de privacidad</a> y autorizo el tratamiento de mis datos.
                            </label>
                        </div>

                        <button type="submit" class="w-full bg-cep-pink hover:bg-cep-pink-dark text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                            Enviar Mensaje
                        </button>
                    </form>
                </div>

                <!-- Contact Information -->
                <div class="space-y-8">
                    <!-- Contact Info Card -->
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold mb-6 text-gray-900">
                            Información de Contacto
                        </h2>
                        
                        <div class="space-y-6">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 bg-cep-pink/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-cep-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900 mb-1">Teléfono</h3>
                                    <p class="text-gray-600">922 123 456</p>
                                    <p class="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 bg-cep-pink/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-cep-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
                                    <p class="text-gray-600">info@cepformacion.com</p>
                                    <p class="text-gray-600">admisiones@cepformacion.com</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 bg-cep-pink/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-cep-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900 mb-1">Sede Principal</h3>
                                    <p class="text-gray-600">Calle Principal, 123</p>
                                    <p class="text-gray-600">38001 Santa Cruz de Tenerife</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Info -->
                    <div class="bg-gradient-to-r from-cep-pink to-cep-pink-dark rounded-xl p-8 text-white">
                        <h3 class="text-xl font-bold mb-4">
                            ¿Prefieres que te llamemos?
                        </h3>
                        <p class="mb-6 opacity-90">
                            Déjanos tu número y te contactaremos lo antes posible para resolver tus dudas.
                        </p>
                        <button class="bg-white text-cep-pink hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                            Solicitar Llamada
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4 text-cep-pink">CEP Formación</h3>
                    <p class="text-gray-300">
                        Centro de estudios profesionales dedicado a tu desarrollo y crecimiento laboral.
                    </p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Cursos</h4>
                    <ul class="space-y-2">
                        <li><a href="/cursos/privados" class="text-gray-300 hover:text-cep-pink">Cursos Privados</a></li>
                        <li><a href="/cursos/ocupados" class="text-gray-300 hover:text-cep-pink">Cursos Ocupados</a></li>
                        <li><a href="/cursos/desempleados" class="text-gray-300 hover:text-cep-pink">Cursos Desempleados</a></li>
                        <li><a href="/cursos/teleformacion" class="text-gray-300 hover:text-cep-pink">Teleformación</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Institución</h4>
                    <ul class="space-y-2">
                        <li><a href="/sobre-nosotros" class="text-gray-300 hover:text-cep-pink">Sobre Nosotros</a></li>
                        <li><a href="/sedes" class="text-gray-300 hover:text-cep-pink">Sedes</a></li>
                        <li><a href="/faq" class="text-gray-300 hover:text-cep-pink">FAQ</a></li>
                        <li><a href="/blog" class="text-gray-300 hover:text-cep-pink">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Contacto</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li>Teléfono: 922 123 456</li>
                        <li>Email: info@cepformacion.com</li>
                        <li>
                            <a href="/contacto" class="text-cep-pink hover:text-cep-pink-dark">
                                Formulario de contacto →
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 CEP Formación. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function toggleMobileDropdown() {
            const dropdown = document.getElementById('mobileDropdown');
            dropdown.classList.toggle('hidden');
        }
    </script>
</body>
</html>
EOF

echo "✅ contacto.html created successfully"

# Create sedes.html
echo "📝 Creating sedes.html..."
cat > sedes.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sedes - CEP Formación</title>
    <meta name="description" content="Conoce nuestras sedes y centros de formación">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --cep-pink: #ec008c;
            --cep-pink-dark: #c7006f;
            --cep-green: #00a651;
            --cep-blue: #0056b3;
            --cep-orange: #ff6b35;
        }
        
        .cep-pink { background-color: var(--cep-pink); }
        .cep-pink-dark { background-color: var(--cep-pink-dark); }
        .text-cep-pink { color: var(--cep-pink); }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        * {
            transition: all 0.3s ease;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-md sticky top-0 z-50">
        <nav class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <a href="/" class="text-2xl font-bold text-cep-pink">
                    CEP Formación
                </a>

                <!-- Desktop Navigation -->
                <div class="hidden lg:flex gap-6 items-center">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Inicio
                    </a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Ciclos
                    </a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Sedes
                    </a>
                    
                    <!-- Cursos Dropdown -->
                    <div class="relative group">
                        <button class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide flex items-center gap-1">
                            Cursos
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M6 8L2 4h8z"/>
                            </svg>
                        </button>
                        <div class="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                            <a href="/cursos/privados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Teleformación</a>
                        </div>
                    </div>

                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Nosotros
                    </a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        FAQ
                    </a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Blog
                    </a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Contacto
                    </a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Acceso Alumnos
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button class="lg:hidden p-2" onclick="toggleMobileMenu()">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu -->
            <div id="mobileMenu" class="hidden lg:hidden mt-4 pb-4 border-t pt-4">
                <div class="flex flex-col gap-4">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold">Inicio</a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold">Ciclos</a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold">Sedes</a>
                    <div>
                        <button class="text-gray-700 hover:text-cep-pink font-semibold w-full text-left" onclick="toggleMobileDropdown()">
                            Cursos ▼
                        </button>
                        <div id="mobileDropdown" class="hidden pl-4 mt-2 space-y-2">
                            <a href="/cursos/privados" class="block text-gray-700 hover:text-cep-pink">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block text-gray-700 hover:text-cep-pink">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block text-gray-700 hover:text-cep-pink">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block text-gray-700 hover:text-cep-pink">Cursos Teleformación</a>
                        </div>
                    </div>
                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold">Nosotros</a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold">FAQ</a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold">Blog</a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-center">Contacto</a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-center">Acceso Alumnos</a>
                </div>
            </div>
        </nav>
    </header>

    <!-- Page Header -->
    <section class="py-16 md:py-20 bg-gradient-to-r from-cep-pink to-cep-pink-dark text-white">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
                NUETRAS SEDES
            </h1>
            <p class="text-xl opacity-90 max-w-3xl mx-auto">
                Encuentra el centro CEP Formación más cercano a ti
            </p>
        </div>
    </section>

    <!-- Locations -->
    <section class="py-16 md:py-20">
        <div class="container mx-auto px-4">
            <div class="grid lg:grid-cols-2 gap-12">
                <!-- Santa Cruz de Tenerife -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl">
                    <div class="h-64 bg-gradient-to-br from-cep-pink to-cep-pink-dark flex items-center justify-center">
                        <div class="text-white text-center">
                            <svg class="w-20 h-20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <h3 class="text-2xl font-bold">Santa Cruz de Tenerife</h3>
                            <p class="text-lg opacity-90">Sede Principal</p>
                        </div>
                    </div>
                    <div class="p-8">
                        <div class="space-y-4 mb-6">
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-cep-pink mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <div>
                                    <h4 class="font-semibold">Dirección</h4>
                                    <p class="text-gray-600">Calle Principal, 123<br>38001 Santa Cruz de Tenerife</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-cep-pink mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                <div>
                                    <h4 class="font-semibold">Teléfono</h4>
                                    <p class="text-gray-600">922 123 456</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-cep-pink mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <div>
                                    <h4 class="font-semibold">Horario</h4>
                                    <p class="text-gray-600">Lunes a Viernes: 9:00 - 18:00<br>Sábados: 9:00 - 13:00</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex gap-3">
                            <button class="flex-1 bg-cep-pink hover:bg-cep-pink-dark text-white py-3 rounded-lg font-semibold">
                                Ver Mapa
                            </button>
                            <button class="flex-1 border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white py-3 rounded-lg font-semibold">
                                Contactar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- San Cristóbal de La Laguna -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl">
                    <div class="h-64 bg-gradient-to-br from-cep-green to-green-700 flex items-center justify-center">
                        <div class="text-white text-center">
                            <svg class="w-20 h-20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <h3 class="text-2xl font-bold">San Cristóbal de La Laguna</h3>
                            <p class="text-lg opacity-90">Sede Secundaria</p>
                        </div>
                    </div>
                    <div class="p-8">
                        <div class="space-y-4 mb-6">
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-cep-green mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <div>
                                    <h4 class="font-semibold">Dirección</h4>
                                    <p class="text-gray-600">Avenida Universidad, 45<br>38201 San Cristóbal de La Laguna</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-cep-green mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                <div>
                                    <h4 class="font-semibold">Teléfono</h4>
                                    <p class="text-gray-600">922 987 654</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-cep-green mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <div>
                                    <h4 class="font-semibold">Horario</h4>
                                    <p class="text-gray-600">Lunes a Viernes: 10:00 - 20:00<br>Sábados: 10:00 - 14:00</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex gap-3">
                            <button class="flex-1 bg-cep-green hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
                                Ver Mapa
                            </button>
                            <button class="flex-1 border-2 border-cep-green text-cep-green hover:bg-cep-green hover:text-white py-3 rounded-lg font-semibold">
                                Contactar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-20 bg-cep-pink text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">
                ¿Visitarás alguna de nuestras sedes?
            </h2>
            <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Te invitamos a conocer nuestras instalaciones y hablar con nuestro equipo de orientación
            </p>
            <a href="/contacto" class="bg-white text-cep-pink hover:bg-gray-100 px-8 py-4 text-lg font-bold inline-block rounded-lg hover:scale-105 transition-transform">
                Solicitar Visita
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4 text-cep-pink">CEP Formación</h3>
                    <p class="text-gray-300">
                        Centro de estudios profesionales dedicado a tu desarrollo y crecimiento laboral.
                    </p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Cursos</h4>
                    <ul class="space-y-2">
                        <li><a href="/cursos/privados" class="text-gray-300 hover:text-cep-pink">Cursos Privados</a></li>
                        <li><a href="/cursos/ocupados" class="text-gray-300 hover:text-cep-pink">Cursos Ocupados</a></li>
                        <li><a href="/cursos/desempleados" class="text-gray-300 hover:text-cep-pink">Cursos Desempleados</a></li>
                        <li><a href="/cursos/teleformacion" class="text-gray-300 hover:text-cep-pink">Teleformación</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Institución</h4>
                    <ul class="space-y-2">
                        <li><a href="/sobre-nosotros" class="text-gray-300 hover:text-cep-pink">Sobre Nosotros</a></li>
                        <li><a href="/sedes" class="text-gray-300 hover:text-cep-pink">Sedes</a></li>
                        <li><a href="/faq" class="text-gray-300 hover:text-cep-pink">FAQ</a></li>
                        <li><a href="/blog" class="text-gray-300 hover:text-cep-pink">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Contacto</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li>Teléfono: 922 123 456</li>
                        <li>Email: info@cepformacion.com</li>
                        <li>
                            <a href="/contacto" class="text-cep-pink hover:text-cep-pink-dark">
                                Formulario de contacto →
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 CEP Formación. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function toggleMobileDropdown() {
            const dropdown = document.getElementById('mobileDropdown');
            dropdown.classList.toggle('hidden');
        }
    </script>
</body>
</html>
EOF

echo "✅ sedes.html created successfully"

# Create design-hub.html
echo "📝 Creating design-hub.html..."
cat > design-hub.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design Hub - CEP Formación</title>
    <meta name="description" content="Sistema de diseño interactivo de CEP Formación">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --cep-pink: #ec008c;
            --cep-pink-dark: #c7006f;
            --cep-green: #00a651;
            --cep-blue: #0056b3;
            --cep-orange: #ff6b35;
        }
        
        .cep-pink { background-color: var(--cep-pink); }
        .cep-pink-dark { background-color: var(--cep-pink-dark); }
        .text-cep-pink { color: var(--cep-pink); }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        * {
            transition: all 0.3s ease;
        }
        
        .color-swatch {
            width: 120px;
            height: 120px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .color-swatch:hover {
            transform: scale(1.05);
        }
        
        .typography-sample {
            line-height: 1.6;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-md sticky top-0 z-50">
        <nav class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <a href="/" class="text-2xl font-bold text-cep-pink">
                    CEP Formación
                </a>

                <!-- Desktop Navigation -->
                <div class="hidden lg:flex gap-6 items-center">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Inicio
                    </a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Ciclos
                    </a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Sedes
                    </a>
                    
                    <!-- Cursos Dropdown -->
                    <div class="relative group">
                        <button class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide flex items-center gap-1">
                            Cursos
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M6 8L2 4h8z"/>
                            </svg>
                        </button>
                        <div class="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                            <a href="/cursos/privados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cep-pink hover:text-white">Cursos Teleformación</a>
                        </div>
                    </div>

                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Nosotros
                    </a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        FAQ
                    </a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold text-sm uppercase tracking-wide">
                        Blog
                    </a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Contacto
                    </a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide">
                        Acceso Alumnos
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button class="lg:hidden p-2" onclick="toggleMobileMenu()">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu -->
            <div id="mobileMenu" class="hidden lg:hidden mt-4 pb-4 border-t pt-4">
                <div class="flex flex-col gap-4">
                    <a href="/" class="text-gray-700 hover:text-cep-pink font-semibold">Inicio</a>
                    <a href="/ciclos" class="text-gray-700 hover:text-cep-pink font-semibold">Ciclos</a>
                    <a href="/sedes" class="text-gray-700 hover:text-cep-pink font-semibold">Sedes</a>
                    <div>
                        <button class="text-gray-700 hover:text-cep-pink font-semibold w-full text-left" onclick="toggleMobileDropdown()">
                            Cursos ▼
                        </button>
                        <div id="mobileDropdown" class="hidden pl-4 mt-2 space-y-2">
                            <a href="/cursos/privados" class="block text-gray-700 hover:text-cep-pink">Cursos Privados</a>
                            <a href="/cursos/ocupados" class="block text-gray-700 hover:text-cep-pink">Cursos Ocupados</a>
                            <a href="/cursos/desempleados" class="block text-gray-700 hover:text-cep-pink">Cursos Desempleados</a>
                            <a href="/cursos/teleformacion" class="block text-gray-700 hover:text-cep-pink">Cursos Teleformación</a>
                        </div>
                    </div>
                    <a href="/sobre-nosotros" class="text-gray-700 hover:text-cep-pink font-semibold">Nosotros</a>
                    <a href="/faq" class="text-gray-700 hover:text-cep-pink font-semibold">FAQ</a>
                    <a href="/blog" class="text-gray-700 hover:text-cep-pink font-semibold">Blog</a>
                    <a href="/contacto" class="bg-cep-pink hover:bg-cep-pink-dark text-white px-4 py-2 rounded-lg font-semibold text-center">Contacto</a>
                    <a href="/acceso-alumnos" class="border-2 border-cep-pink text-cep-pink hover:bg-cep-pink hover:text-white px-4 py-2 rounded-lg font-semibold text-center">Acceso Alumnos</a>
                </div>
            </div>
        </nav>
    </header>

    <!-- Page Header -->
    <section class="py-16 md:py-20 bg-gradient-to-r from-cep-pink to-cep-pink-dark text-white">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
                DESIGN HUB
            </h1>
            <p class="text-xl opacity-90 max-w-3xl mx-auto">
                Sistema de diseño interactivo de CEP Formación - Explora nuestra identidad visual
            </p>
        </div>
    </section>

    <!-- Design System Content -->
    <section class="py-16 md:py-20">
        <div class="container mx-auto px-4">
            <!-- Color Palette -->
            <div class="mb-16">
                <h2 class="text-3xl font-bold mb-8 text-center text-gray-900">
                    Paleta de Colores
                </h2>
                <p class="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                    Nuestra paleta de colores está diseñada para transmitir profesionalismo, energía y confianza en cada interacción.
                </p>
                
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
                    <div class="text-center">
                        <div class="color-swatch cep-pink" onclick="copyColor('#ec008c')">
                            CEP Pink
                        </div>
                        <p class="mt-2 font-mono text-sm">#ec008c</p>
                        <p class="text-xs text-gray-500">Principal</p>
                    </div>
                    
                    <div class="text-center">
                        <div class="color-swatch cep-pink-dark" onclick="copyColor('#c7006f')">
                            CEP Pink Dark
                        </div>
                        <p class="mt-2 font-mono text-sm">#c7006f</p>
                        <p class="text-xs text-gray-500">Variante</p>
                    </div>
                    
                    <div class="text-center">
                        <div class="color-swatch bg-green-600" style="background-color: var(--cep-green)" onclick="copyColor('#00a651')">
                            CEP Green
                        </div>
                        <p class="mt-2 font-mono text-sm">#00a651</p>
                        <p class="text-xs text-gray-500">Ocupados</p>
                    </div>
                    
                    <div class="text-center">
                        <div class="color-swatch bg-blue-600" style="background-color: var(--cep-blue)" onclick="copyColor('#0056b3')">
                            CEP Blue
                        </div>
                        <p class="mt-2 font-mono text-sm">#0056b3</p>
                        <p class="text-xs text-gray-500">Desempleados</p>
                    </div>
                    
                    <div class="text-center">
                        <div class="color-swatch bg-orange-500" style="background-color: var(--cep-orange)" onclick="copyColor('#ff6b35')">
                            CEP Orange
                        </div>
                        <p class="mt-2 font-mono text-sm">#ff6b35</p>
                        <p class="text-xs text-gray-500">Teleformación</p>
                    </div>
                    
                    <div class="text-center">
                        <div class="color-swatch bg-gray-900" onclick="copyColor('#111827')">
                            Neutral Dark
                        </div>
                        <p class="mt-2 font-mono text-sm">#111827</p>
                        <p class="text-xs text-gray-500">Texto</p>
                    </div>
                </div>
            </div>

            <!-- Typography -->
            <div class="mb-16">
                <h2 class="text-3xl font-bold mb-8 text-center text-gray-900">
                    Tipografía
                </h2>
                <p class="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                    Utilizamos la tipografía del sistema para garantizar legibilidad y consistencia en todas las plataformas.
                </p>
                
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="space-y-8 typography-sample">
                        <div>
                            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                                Título Principal
                            </h1>
                            <p class="text-sm text-gray-500">H1 - 4xl/5xl/6xl - Font Bold</p>
                        </div>
                        
                        <div>
                            <h2 class="text-3xl md:text-4xl font-bold mb-2">
                                Título Secundario
                            </h2>
                            <p class="text-sm text-gray-500">H2 - 3xl/4xl - Font Bold</p>
                        </div>
                        
                        <div>
                            <h3 class="text-2xl md:text-3xl font-bold mb-2">
                                Título Terciario
                            </h3>
                            <p class="text-sm text-gray-500">H3 - 2xl/3xl - Font Bold</p>
                        </div>
                        
                        <div>
                            <h4 class="text-xl md:text-2xl font-semibold mb-2">
                                Subtítulo
                            </h4>
                            <p class="text-sm text-gray-500">H4 - xl/2xl - Font Semibold</p>
                        </div>
                        
                        <div>
                            <p class="text-lg mb-2">
                                Texto grande para párrafos importantes o destacados. Mantiene buena legibilidad y jerarquía visual.
                            </p>
                            <p class="text-sm text-gray-500">Large - Text Large</p>
                        </div>
                        
                        <div>
                            <p class="text-base mb-2">
                                Texto regular para contenido general. Este es el tamaño estándar para la mayoría de los párrafos y descripciones en el sitio.
                            </p>
                            <p class="text-sm text-gray-500">Base - Text Base</p>
                        </div>
                        
                        <div>
                            <p class="text-sm mb-2">
                                Texto pequeño para información secundaria, leyendas y notas. Manteniendo legibilidad óptima incluso en tamaños reducidos.
                            </p>
                            <p class="text-sm text-gray-500">Small - Text Small</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Interactive Demo -->
            <div>
                <h2 class="text-3xl font-bold mb-8 text-center text-gray-900">
                    Demo Interactiva
                </h2>
                <p class="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                    Experimenta con nuestros componentes y estilos en tiempo real.
                </p>
                
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="text-center">
                        <h3 class="text-2xl font-bold mb-6">Personaliza tu experiencia</h3>
                        
                        <div class="mb-8">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Elige un color de tema:</label>
                            <div class="flex justify-center gap-4">
                                <button onclick="changeTheme('cep-pink')" class="w-12 h-12 cep-pink rounded-full"></button>
                                <button onclick="changeTheme('cep-green')" class="w-12 h-12 bg-green-600 rounded-full" style="background-color: var(--cep-green)"></button>
                                <button onclick="changeTheme('cep-blue')" class="w-12 h-12 bg-blue-600 rounded-full" style="background-color: var(--cep-blue)"></button>
                                <button onclick="changeTheme('cep-orange')" class="w-12 h-12 bg-orange-500 rounded-full" style="background-color: var(--cep-orange)"></button>
                            </div>
                        </div>
                        
                        <div id="demoComponent" class="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                            <h4 class="text-xl font-bold mb-3">Componente de Ejemplo</h4>
                            <p class="text-gray-600 mb-4">Este componente cambiará de color según tu selección.</p>
                            <button id="demoButton" class="cep-pink text-white py-2 px-6 rounded-lg font-semibold">
                                Botón de Ejemplo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4 text-cep-pink">CEP Formación</h3>
                    <p class="text-gray-300">
                        Centro de estudios profesionales dedicado a tu desarrollo y crecimiento laboral.
                    </p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Cursos</h4>
                    <ul class="space-y-2">
                        <li><a href="/cursos/privados" class="text-gray-300 hover:text-cep-pink">Cursos Privados</a></li>
                        <li><a href="/cursos/ocupados" class="text-gray-300 hover:text-cep-pink">Cursos Ocupados</a></li>
                        <li><a href="/cursos/desempleados" class="text-gray-300 hover:text-cep-pink">Cursos Desempleados</a></li>
                        <li><a href="/cursos/teleformacion" class="text-gray-300 hover:text-cep-pink">Teleformación</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Institución</h4>
                    <ul class="space-y-2">
                        <li><a href="/sobre-nosotros" class="text-gray-300 hover:text-cep-pink">Sobre Nosotros</a></li>
                        <li><a href="/sedes" class="text-gray-300 hover:text-cep-pink">Sedes</a></li>
                        <li><a href="/faq" class="text-gray-300 hover:text-cep-pink">FAQ</a></li>
                        <li><a href="/blog" class="text-gray-300 hover:text-cep-pink">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Contacto</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li>Teléfono: 922 123 456</li>
                        <li>Email: info@cepformacion.com</li>
                        <li>
                            <a href="/contacto" class="text-cep-pink hover:text-cep-pink-dark">
                                Formulario de contacto →
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 CEP Formación. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function toggleMobileDropdown() {
            const dropdown = document.getElementById('mobileDropdown');
            dropdown.classList.toggle('hidden');
        }

        function copyColor(color) {
            navigator.clipboard.writeText(color);
            
            // Create temporary notification
            const notification = document.createElement('div');
            notification.textContent = `Color ${color} copiado!`;
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        }

        function changeTheme(colorClass) {
            const button = document.getElementById('demoButton');
            const component = document.getElementById('demoComponent');
            
            // Remove all color classes
            button.className = button.className.replace(/cep-\w+|bg-\w+-\d+/g, '');
            component.className = component.className.replace(/border-\w+-\d+/g, '');
            
            // Add new color class
            button.className += ` ${colorClass} text-white py-2 px-6 rounded-lg font-semibold`;
            component.className += ` border-2 border-dashed border-${colorClass.replace('cep-', '').replace('-dark', '')}-500 rounded-lg`;
        }
    </script>
</body>
</html>
EOF

echo "✅ design-hub.html created successfully"

# Set proper permissions
echo "🔒 Setting permissions..."
chmod 644 *.html
chown www-data:www-data *.html

# Restart nginx to apply changes
echo "🔄 Restarting nginx..."
systemctl restart nginx

# Verify deployment
echo "🧪 Verifying deployment..."
if curl -s http://localhost/ | grep -q "DESIGN HUB"; then
    echo "✅ Deployment successful - New frontend is live!"
    echo "🌐 Site available at: http://46.62.222.138"
    echo "📋 Pages created:"
    echo "   • / - Homepage with HeroCarousel"
    echo "   • /cursos - Course catalog"
    echo "   • /contacto - Contact page"
    echo "   • /sedes - Our locations"
    echo "   • /design-hub - Design system playground"
else
    echo "❌ Deployment failed - Checking nginx status..."
    systemctl status nginx
    tail -20 /var/log/nginx/error.log
fi

echo "🎉 CEP Formación Frontend Deployment Complete!"