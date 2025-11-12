# PROMPT COMPLETO - CoursesPage (Cursos) - Dashboard CEP Comunicación

## 🎯 OBJETIVO

Implementar la sección **MÁS IMPORTANTE** del dashboard: **Gestión de Cursos** con todos los detalles, relaciones y funcionalidad visual.

**Ubicación del proyecto:**
```
/Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup/
```

---

## 📋 FASE 1: Expandir Mock Data de Cursos (10 min)

### Archivo: `src/data/mockData.ts`

**AGREGAR AL FINAL del archivo (después de `currentUserProfile`):**

```typescript
// ============================================
// CURSOS EXPANDIDOS (15 registros)
// ============================================
export interface Course {
  id: string
  name: string
  code: string
  type: 'telematico' | 'ocupados' | 'desempleados' | 'privados' | 'ciclo-medio' | 'ciclo-superior'
  modality: 'presencial' | 'semipresencial' | 'telematico'
  cycle_id?: string
  cycle_name?: string
  duration_hours: number
  price: number
  max_students: number
  current_students: number
  description: string // OBLIGATORIO
  objectives: string[]
  requirements: string[]
  syllabus: {
    module: string
    hours: number
    topics: string[]
  }[]
  teachers: {
    id: string
    name: string
    photo: string
  }[]
  campuses: {
    id: string
    name: string
    code: string
  }[]
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  start_date?: string
  end_date?: string
  enrollment_deadline?: string
  certificate_name?: string
}

export const coursesData: Course[] = [
  {
    id: "CURSO001",
    name: "Community Manager Profesional",
    code: "CM-PRO-2025",
    type: "privados",
    modality: "semipresencial",
    cycle_id: "CY001",
    cycle_name: "Técnico Superior en Marketing y Publicidad",
    duration_hours: 120,
    price: 890,
    max_students: 25,
    current_students: 18,
    description: "Curso completo de gestión de redes sociales, estrategia de contenidos y analítica digital. Aprenderás a crear, implementar y medir estrategias efectivas en todas las plataformas sociales principales. Incluye prácticas reales con empresas colaboradoras y certificación reconocida por la industria.",
    objectives: [
      "Crear y gestionar estrategias de contenido para redes sociales (Facebook, Instagram, TikTok, LinkedIn, Twitter/X)",
      "Dominar herramientas de programación y analítica (Hootsuite, Buffer, Meta Business Suite, Google Analytics)",
      "Diseñar y ejecutar campañas publicitarias en Meta Ads y LinkedIn Ads con presupuesto controlado",
      "Gestionar crisis de reputación online y protocolo de respuesta en redes sociales",
      "Crear contenido visual atractivo con Canva y herramientas de edición básicas",
      "Interpretar métricas y elaborar informes de rendimiento para clientes"
    ],
    requirements: [
      "Conocimientos básicos de informática y navegación en internet",
      "Acceso a ordenador personal (Windows o Mac) e internet estable",
      "Tener perfiles personales activos en al menos 3 redes sociales",
      "Edad mínima: 16 años"
    ],
    syllabus: [
      {
        module: "Introducción al Social Media Marketing",
        hours: 15,
        topics: [
          "Ecosistema digital actual y evolución de redes sociales",
          "Principales plataformas: características y públicos objetivos",
          "Rol y responsabilidades del Community Manager",
          "Casos de éxito y fracasos en redes sociales"
        ]
      },
      {
        module: "Estrategia de Contenidos",
        hours: 20,
        topics: [
          "Definición de buyer persona y audiencia objetivo",
          "Creación de calendario editorial y plan de publicaciones",
          "Tipos de contenido: educativo, entretenimiento, promocional",
          "Copywriting para redes sociales y técnicas de engagement",
          "Storytelling de marca y voz de la empresa"
        ]
      },
      {
        module: "Gestión de Plataformas",
        hours: 25,
        topics: [
          "Facebook e Instagram: algoritmo, formatos, mejores prácticas",
          "LinkedIn: estrategia B2B y personal branding",
          "TikTok: tendencias, challenges y contenido viral",
          "Twitter/X: actualidad, engagement y gestión de crisis",
          "YouTube: estrategia de vídeo marketing y optimización SEO"
        ]
      },
      {
        module: "Publicidad en Redes Sociales",
        hours: 25,
        topics: [
          "Meta Ads Manager: configuración de campañas completas",
          "Segmentación avanzada y públicos personalizados",
          "Creatividades publicitarias: imágenes, vídeos, carruseles",
          "Presupuestos, pujas y optimización de costes",
          "LinkedIn Ads: campañas B2B y lead generation"
        ]
      },
      {
        module: "Herramientas y Analítica",
        hours: 20,
        topics: [
          "Hootsuite, Buffer y herramientas de programación",
          "Meta Business Suite y estadísticas nativas",
          "Google Analytics 4 para tráfico desde redes sociales",
          "Elaboración de informes y dashboards con Looker Studio",
          "KPIs clave: alcance, engagement, conversión, ROI"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 15,
        topics: [
          "Desarrollo de estrategia completa para marca real",
          "Presentación de plan de contenidos mensual",
          "Configuración y lanzamiento de campaña publicitaria",
          "Defensa del proyecto ante tribunal y compañeros"
        ]
      }
    ],
    teachers: [
      {
        id: "1",
        name: "María García Pérez",
        photo: "https://i.pravatar.cc/150?img=1"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      },
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      }
    ],
    status: "published",
    featured: true,
    start_date: "2025-02-01",
    end_date: "2025-05-30",
    enrollment_deadline: "2025-01-25",
    certificate_name: "Certificado Profesional en Community Management"
  },
  {
    id: "CURSO002",
    name: "SEO y SEM Avanzado",
    code: "SEO-SEM-ADV",
    type: "privados",
    modality: "presencial",
    cycle_id: "CY001",
    cycle_name: "Técnico Superior en Marketing y Publicidad",
    duration_hours: 80,
    price: 750,
    max_students: 20,
    current_students: 15,
    description: "Posicionamiento web orgánico (SEO) y campañas de pago (SEM) con Google Ads. Aprenderás a optimizar sitios web para aparecer en las primeras posiciones de Google y a crear campañas rentables de publicidad en buscadores. Incluye certificación oficial de Google Ads.",
    objectives: [
      "Optimizar sitios web para buscadores siguiendo las directrices de Google",
      "Realizar auditorías SEO técnicas completas con herramientas profesionales",
      "Investigar palabras clave y crear estrategias de contenido SEO",
      "Construir estrategias de link building éticas y efectivas",
      "Crear y optimizar campañas SEM rentables en Google Ads",
      "Analizar y mejorar el ROI de campañas de búsqueda pagada"
    ],
    requirements: [
      "Conocimientos básicos de marketing digital",
      "Comprensión de HTML y CSS (nivel básico)",
      "Acceso a un sitio web propio o de prueba (se puede proporcionar)"
    ],
    syllabus: [
      {
        module: "Fundamentos SEO",
        hours: 15,
        topics: [
          "Cómo funcionan los motores de búsqueda",
          "Algoritmos de Google y actualizaciones principales",
          "SEO On-Page vs Off-Page vs Técnico",
          "Herramientas esenciales: Google Search Console, Analytics, Ahrefs, SEMrush"
        ]
      },
      {
        module: "SEO Técnico",
        hours: 20,
        topics: [
          "Arquitectura web y estructura de URLs",
          "Velocidad de carga y Core Web Vitals",
          "Indexabilidad y rastreo: robots.txt, sitemap.xml",
          "Mobile-first indexing y responsive design",
          "Datos estructurados y rich snippets"
        ]
      },
      {
        module: "SEO On-Page",
        hours: 15,
        topics: [
          "Investigación de palabras clave con herramientas profesionales",
          "Optimización de títulos, meta descripciones y encabezados",
          "Contenido de calidad y estrategia de contenidos",
          "Imágenes: alt text, compresión, lazy loading",
          "Enlaces internos y siloing"
        ]
      },
      {
        module: "SEO Off-Page",
        hours: 10,
        topics: [
          "Link building: estrategias white-hat",
          "Guest posting y colaboraciones",
          "Digital PR y menciones de marca",
          "Análisis de backlinks y desautorización"
        ]
      },
      {
        module: "Google Ads (SEM)",
        hours: 20,
        topics: [
          "Estructura de cuentas y campañas en Google Ads",
          "Tipos de concordancia de palabras clave",
          "Redacción de anuncios efectivos y extensiones",
          "Estrategias de puja y presupuestos",
          "Quality Score y optimización de landing pages",
          "Remarketing y audiencias personalizadas"
        ]
      }
    ],
    teachers: [
      {
        id: "1",
        name: "María García Pérez",
        photo: "https://i.pravatar.cc/150?img=1"
      }
    ],
    campuses: [
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      }
    ],
    status: "published",
    featured: true,
    start_date: "2025-02-15",
    end_date: "2025-04-30",
    enrollment_deadline: "2025-02-08",
    certificate_name: "Certificado en SEO y SEM Avanzado + Google Ads Certification"
  },
  {
    id: "CURSO003",
    name: "Diseño UX/UI con Figma",
    code: "UX-UI-FIG",
    type: "privados",
    modality: "telematico",
    cycle_id: "CY001",
    cycle_name: "Técnico Superior en Marketing y Publicidad",
    duration_hours: 100,
    price: 680,
    max_students: 30,
    current_students: 22,
    description: "Diseño de interfaces y experiencias de usuario con metodologías ágiles y herramientas profesionales. Aprenderás a crear prototipos interactivos, realizar pruebas de usabilidad y aplicar principios de diseño centrado en el usuario. 100% online con clases en directo y proyecto final real.",
    objectives: [
      "Crear prototipos interactivos profesionales en Figma",
      "Aplicar principios de diseño centrado en el usuario (UCD)",
      "Realizar investigación de usuarios con entrevistas y encuestas",
      "Diseñar wireframes, mockups y prototipos de alta fidelidad",
      "Realizar pruebas de usabilidad y analizar resultados",
      "Implementar design systems y componentes reutilizables"
    ],
    requirements: [
      "Conocimientos básicos de diseño gráfico (recomendado pero no obligatorio)",
      "Ordenador con al menos 8GB RAM",
      "Cuenta gratuita en Figma"
    ],
    syllabus: [
      {
        module: "Fundamentos UX",
        hours: 20,
        topics: [
          "Qué es UX y por qué es importante",
          "Diferencias entre UX, UI y CX",
          "Metodología Design Thinking",
          "Investigación de usuarios: entrevistas, encuestas, personas",
          "Customer Journey Maps y User Flows"
        ]
      },
      {
        module: "Fundamentos UI",
        hours: 20,
        topics: [
          "Principios de diseño visual: jerarquía, contraste, espacio",
          "Teoría del color aplicada a interfaces",
          "Tipografía para pantallas",
          "Sistemas de grids y layouts responsivos",
          "Accesibilidad web (WCAG 2.1)"
        ]
      },
      {
        module: "Figma Avanzado",
        hours: 25,
        topics: [
          "Herramientas y atajos de Figma",
          "Auto Layout y constraints",
          "Componentes, variantes y propiedades",
          "Prototipos interactivos con animaciones",
          "Colaboración en tiempo real",
          "Plugins esenciales y flujo de trabajo optimizado"
        ]
      },
      {
        module: "Design Systems",
        hours: 15,
        topics: [
          "Qué es un design system y por qué crearlo",
          "Atomic Design: átomos, moléculas, organismos",
          "Creación de biblioteca de componentes",
          "Tokens de diseño y consistencia visual",
          "Documentación y handoff a desarrollo"
        ]
      },
      {
        module: "Testing y Validación",
        hours: 10,
        topics: [
          "Pruebas de usabilidad moderadas y no moderadas",
          "A/B testing y test multivariante",
          "Heatmaps y análisis de comportamiento",
          "Herramientas: Hotjar, Maze, UserTesting"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 10,
        topics: [
          "Desarrollo de app móvil o web completa",
          "Research, wireframes, diseño y prototipo",
          "Pruebas de usabilidad con usuarios reales",
          "Presentación del proyecto"
        ]
      }
    ],
    teachers: [
      {
        id: "3",
        name: "Laura Martínez Sosa",
        photo: "https://i.pravatar.cc/150?img=3"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-03-01",
    end_date: "2025-06-15",
    enrollment_deadline: "2025-02-22",
    certificate_name: "Certificado Profesional en Diseño UX/UI"
  },
  {
    id: "CURSO004",
    name: "Desarrollo Frontend con React",
    code: "REACT-2025",
    type: "ciclo-superior",
    modality: "presencial",
    cycle_id: "CY002",
    cycle_name: "Técnico Superior en Desarrollo de Aplicaciones Web",
    duration_hours: 150,
    price: 1200,
    max_students: 18,
    current_students: 12,
    description: "Desarrollo de aplicaciones web modernas con React, TypeScript, TailwindCSS y despliegue en producción. Aprenderás a crear SPAs escalables, gestionar estado complejo y desplegar aplicaciones en la nube. Incluye prácticas con proyectos reales de empresas.",
    objectives: [
      "Crear aplicaciones SPA con React 18+ y React Router",
      "Dominar TypeScript para desarrollo type-safe",
      "Gestionar estado con Context API, Zustand y React Query",
      "Estilizar componentes con TailwindCSS y CSS Modules",
      "Implementar autenticación JWT y protección de rutas",
      "Desplegar aplicaciones en Vercel/Netlify con CI/CD"
    ],
    requirements: [
      "JavaScript ES6+ nivel intermedio-avanzado",
      "HTML5 y CSS3 nivel avanzado",
      "Conocimientos de Git y GitHub",
      "Comprensión de conceptos de programación orientada a objetos"
    ],
    syllabus: [
      {
        module: "Fundamentos React",
        hours: 25,
        topics: [
          "JSX, componentes funcionales y hooks básicos",
          "useState, useEffect y ciclo de vida",
          "Props, children y composición de componentes",
          "Renderizado condicional y listas",
          "Eventos y formularios controlados"
        ]
      },
      {
        module: "TypeScript para React",
        hours: 20,
        topics: [
          "Tipos básicos e interfaces",
          "Tipado de props y hooks",
          "Generics y utility types",
          "Configuración de tsconfig.json"
        ]
      },
      {
        module: "Estado y Routing",
        hours: 30,
        topics: [
          "Context API y useContext",
          "React Router v6: rutas, navegación, parámetros",
          "Zustand para estado global ligero",
          "React Query para gestión de datos asíncronos",
          "Optimistic updates y cache"
        ]
      },
      {
        module: "Estilos y UI",
        hours: 25,
        topics: [
          "TailwindCSS: configuración y customización",
          "Componentes reutilizables con shadcn/ui",
          "CSS Modules y Styled Components",
          "Responsive design y mobile-first",
          "Animaciones con Framer Motion"
        ]
      },
      {
        module: "Autenticación y Seguridad",
        hours: 20,
        topics: [
          "JSON Web Tokens (JWT)",
          "Protected routes y roles",
          "OAuth 2.0 con Google/GitHub",
          "Secure storage y XSS prevention"
        ]
      },
      {
        module: "Testing y Deployment",
        hours: 20,
        topics: [
          "Vitest y React Testing Library",
          "Unit tests y integration tests",
          "GitHub Actions para CI/CD",
          "Deployment en Vercel y Netlify",
          "Environment variables y secrets"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 10,
        topics: [
          "Desarrollo de aplicación full-stack completa",
          "Integración con backend (Node.js/Express)",
          "Deploy a producción",
          "Presentación y defensa"
        ]
      }
    ],
    teachers: [
      {
        id: "2",
        name: "Carlos Rodríguez Martínez",
        photo: "https://i.pravatar.cc/150?img=2"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    status: "published",
    featured: true,
    start_date: "2025-02-10",
    end_date: "2025-07-15",
    enrollment_deadline: "2025-02-03",
    certificate_name: "Certificado Profesional en Desarrollo Frontend React"
  },
  {
    id: "CURSO005",
    name: "Backend con Node.js y PostgreSQL",
    code: "NODE-PSQL",
    type: "ciclo-superior",
    modality: "semipresencial",
    cycle_id: "CY002",
    cycle_name: "Técnico Superior en Desarrollo de Aplicaciones Web",
    duration_hours: 140,
    price: 1150,
    max_students: 18,
    current_students: 9,
    description: "Desarrollo de APIs REST con Node.js, Express, autenticación JWT y bases de datos relacionales. Aprenderás a construir backends escalables, seguros y bien documentados. Incluye integración con frontend React y despliegue en servidores cloud.",
    objectives: [
      "Diseñar y desarrollar APIs RESTful escalables con Express.js",
      "Implementar autenticación y autorización segura con JWT",
      "Trabajar con PostgreSQL y ORMs (Prisma/TypeORM)",
      "Validar datos con Zod y manejar errores correctamente",
      "Documentar APIs con Swagger/OpenAPI",
      "Desplegar en Railway/Render con Docker"
    ],
    requirements: [
      "JavaScript avanzado y comprensión de asincronía (Promises, async/await)",
      "Conocimientos de bases de datos SQL (SELECT, JOIN, WHERE)",
      "Git y terminal de comandos",
      "Conceptos de HTTP y arquitectura cliente-servidor"
    ],
    syllabus: [
      {
        module: "Node.js y Express",
        hours: 25,
        topics: [
          "Introducción a Node.js y el event loop",
          "NPM, package.json y gestión de dependencias",
          "Express: routing, middleware, controllers",
          "Request/Response cycle y manejo de errores",
          "CORS y seguridad básica"
        ]
      },
      {
        module: "PostgreSQL y ORMs",
        hours: 30,
        topics: [
          "Diseño de esquemas relacionales",
          "Prisma ORM: modelos, migraciones, relaciones",
          "Queries complejas y optimización",
          "Transacciones y atomicidad",
          "Indexación y performance"
        ]
      },
      {
        module: "Autenticación y Autorización",
        hours: 25,
        topics: [
          "Hashing de contraseñas con bcrypt",
          "JSON Web Tokens (JWT): creación y verificación",
          "Refresh tokens y token rotation",
          "Role-Based Access Control (RBAC)",
          "Rate limiting y brute-force protection"
        ]
      },
      {
        module: "Validación y Seguridad",
        hours: 20,
        topics: [
          "Validación de schemas con Zod",
          "SQL injection prevention",
          "XSS y CSRF protection",
          "Helmet.js y security headers",
          "Environment variables y secrets management"
        ]
      },
      {
        module: "Testing y Documentación",
        hours: 20,
        topics: [
          "Unit tests con Vitest",
          "Integration tests con Supertest",
          "Mocking de base de datos",
          "Swagger/OpenAPI para documentación",
          "Postman collections"
        ]
      },
      {
        module: "Deployment",
        hours: 20,
        topics: [
          "Docker: Dockerfile, docker-compose",
          "Deploy en Railway/Render",
          "PostgreSQL en Supabase/Neon",
          "Monitoring con Sentry",
          "CI/CD con GitHub Actions"
        ]
      }
    ],
    teachers: [
      {
        id: "2",
        name: "Carlos Rodríguez Martínez",
        photo: "https://i.pravatar.cc/150?img=2"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-03-15",
    end_date: "2025-07-30",
    enrollment_deadline: "2025-03-08"
  },
  {
    id: "CURSO006",
    name: "Redes Cisco CCNA",
    code: "CCNA-2025",
    type: "ciclo-medio",
    modality: "presencial",
    cycle_id: "CY003",
    cycle_name: "Técnico en Sistemas Microinformáticos y Redes",
    duration_hours: 200,
    price: 1500,
    max_students: 15,
    current_students: 15,
    description: "Preparación para certificación CCNA con configuración de routers, switches y protocolos de enrutamiento. Incluye laboratorios con equipos reales Cisco y simulador Packet Tracer. Al finalizar estarás preparado para el examen oficial CCNA 200-301.",
    objectives: [
      "Configurar dispositivos Cisco IOS mediante CLI",
      "Implementar VLANs, trunking y enrutamiento inter-VLAN",
      "Configurar protocolos de enrutamiento dinámico (OSPF, EIGRP)",
      "Implementar NAT, ACLs y seguridad básica",
      "Troubleshooting de redes complejas",
      "Aprobar el examen CCNA 200-301"
    ],
    requirements: [
      "Conocimientos básicos de redes TCP/IP",
      "Comprensión del modelo OSI",
      "Familiaridad con sistemas operativos (Windows/Linux)"
    ],
    syllabus: [
      {
        module: "Fundamentos de Redes",
        hours: 30,
        topics: [
          "Modelo OSI y TCP/IP",
          "Direccionamiento IPv4 y subnetting",
          "Introducción a IPv6",
          "Cables, conectores y medios de transmisión"
        ]
      },
      {
        module: "Switching",
        hours: 40,
        topics: [
          "Operación de switches y tabla MAC",
          "VLANs: creación, asignación, beneficios",
          "Trunking (802.1Q) y VTP",
          "STP, RSTP y PortFast",
          "EtherChannel y agregación de enlaces"
        ]
      },
      {
        module: "Routing",
        hours: 50,
        topics: [
          "Enrutamiento estático",
          "Routing dinámico: RIP, OSPF, EIGRP",
          "Default routes y rutas sumarias",
          "Inter-VLAN routing (router-on-a-stick, SVI)",
          "Métricas y administrative distance"
        ]
      },
      {
        module: "Servicios de Red",
        hours: 30,
        topics: [
          "DHCP: servidor, relay, snooping",
          "NAT: estática, dinámica, PAT",
          "ACLs: estándar y extendidas",
          "DNS y resolución de nombres"
        ]
      },
      {
        module: "Seguridad y Gestión",
        hours: 25,
        topics: [
          "Seguridad de switches (port security, DHCP snooping)",
          "SSH y acceso seguro a dispositivos",
          "SNMP para monitorización",
          "Syslog y troubleshooting"
        ]
      },
      {
        module: "Preparación Examen",
        hours: 25,
        topics: [
          "Repaso de todos los temas del temario CCNA",
          "Exámenes de práctica",
          "Laboratorios intensivos",
          "Estrategias para el examen oficial"
        ]
      }
    ],
    teachers: [
      {
        id: "6",
        name: "Miguel Hernández Castro",
        photo: "https://i.pravatar.cc/150?img=6"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-02-01",
    end_date: "2025-08-31",
    enrollment_deadline: "2025-01-25",
    certificate_name: "Preparación Certificación Cisco CCNA 200-301"
  },
  {
    id: "CURSO007",
    name: "Edición de Vídeo con Premiere Pro",
    code: "PREMIERE-PRO",
    type: "privados",
    modality: "presencial",
    cycle_id: "CY005",
    cycle_name: "Técnico Superior en Producción Audiovisual",
    duration_hours: 90,
    price: 820,
    max_students: 20,
    current_students: 14,
    description: "Edición profesional de vídeo, corrección de color, efectos visuales y exportación para diferentes plataformas. Aprenderás a editar vídeos profesionales para YouTube, redes sociales, publicidad y cine. Incluye proyecto final con material real de producción.",
    objectives: [
      "Dominar la interfaz y flujo de trabajo de Adobe Premiere Pro",
      "Aplicar transiciones, efectos y corrección de color profesional",
      "Editar audio: limpieza, mezcla, sincronización",
      "Trabajar con multicámara y proxies para proyectos 4K",
      "Exportar vídeos optimizados para YouTube, Instagram, TikTok",
      "Integración con After Effects y Adobe Audition"
    ],
    requirements: [
      "Conocimientos básicos de edición de vídeo (opcional)",
      "Ordenador potente: Intel i7/AMD Ryzen 7, 16GB RAM, GPU dedicada",
      "Adobe Creative Cloud (se puede usar versión de prueba)"
    ],
    syllabus: [
      {
        module: "Interfaz y Flujo de Trabajo",
        hours: 15,
        topics: [
          "Panels, workspaces y personalización",
          "Importación de medios y organización",
          "Secuencias y ajustes de proyecto",
          "Atajos de teclado esenciales",
          "Proxies y transcoding para rendimiento"
        ]
      },
      {
        module: "Edición Básica",
        hours: 20,
        topics: [
          "Herramientas de corte: razor, ripple, rolling",
          "Inserts, overwrite y tres puntos de edición",
          "Trim mode y refinamiento de cortes",
          "Transiciones: cortes, fundidos, wipes",
          "Velocidad y tiempo: slow motion, time remapping"
        ]
      },
      {
        module: "Color Grading",
        hours: 20,
        topics: [
          "Lumetri Color: ruedas, curvas, HSL",
          "Corrección de color primaria y secundaria",
          "LUTs y looks cinematográficos",
          "Matching de color entre clips",
          "Scopes: waveform, vectorscope, histogram"
        ]
      },
      {
        module: "Audio",
        hours: 15,
        topics: [
          "Sincronización de audio y vídeo",
          "Limpieza de audio con Essential Sound",
          "Mezcla de audio: música, diálogos, efectos",
          "Keyframes y automatización de volumen",
          "Integración con Adobe Audition"
        ]
      },
      {
        module: "Efectos y Motion Graphics",
        hours: 10,
        topics: [
          "Efectos de vídeo: estabilización, desenfoques",
          "Keyframes y animación de efectos",
          "Títulos y gráficos esenciales",
          "Dynamic Link con After Effects",
          "Masking y composición básica"
        ]
      },
      {
        module: "Exportación y Entrega",
        hours: 10,
        topics: [
          "Codecs y formatos: H.264, ProRes, DNxHD",
          "Ajustes para YouTube (1080p, 4K)",
          "Optimización para Instagram, TikTok, Facebook",
          "Media Encoder para batch export",
          "Archivado de proyectos"
        ]
      }
    ],
    teachers: [
      {
        id: "7",
        name: "Ana López Ruiz",
        photo: "https://i.pravatar.cc/150?img=7"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    status: "published",
    featured: true,
    start_date: "2025-02-20",
    end_date: "2025-05-15",
    enrollment_deadline: "2025-02-13",
    certificate_name: "Certificado Profesional en Edición de Vídeo"
  },
  {
    id: "CURSO008",
    name: "Marketing Digital para Desempleados",
    code: "MKT-DESEMP",
    type: "desempleados",
    modality: "semipresencial",
    duration_hours: 60,
    price: 0,
    max_students: 25,
    current_students: 20,
    description: "Curso gratuito de marketing digital básico para personas desempleadas con certificación oficial. Subvencionado 100% por el Servicio Canario de Empleo. Aprenderás los fundamentos del marketing digital, redes sociales y herramientas básicas para mejorar tu empleabilidad.",
    objectives: [
      "Conocer los fundamentos del marketing digital y sus canales",
      "Crear perfiles profesionales optimizados en LinkedIn",
      "Gestionar páginas de empresa en redes sociales",
      "Realizar campañas básicas en Facebook e Instagram",
      "Utilizar Google My Business para negocios locales",
      "Obtener certificación oficial de empleabilidad digital"
    ],
    requirements: [
      "Estar en situación de desempleo inscrito en el DARDE (Servicio Canario de Empleo)",
      "Conocimientos básicos de informática y navegación web",
      "Disponer de ordenador e internet para clases online"
    ],
    syllabus: [
      {
        module: "Introducción al Marketing Digital",
        hours: 10,
        topics: [
          "Qué es el marketing digital y sus ventajas",
          "Canales principales: web, email, redes, buscadores",
          "Casos de éxito de pequeñas empresas",
          "Herramientas gratuitas esenciales"
        ]
      },
      {
        module: "Redes Sociales Básicas",
        hours: 20,
        topics: [
          "Creación y optimización de perfil de LinkedIn",
          "Páginas de Facebook para negocios",
          "Instagram Business y publicaciones efectivas",
          "Estrategia básica de contenidos",
          "Programación con Meta Business Suite"
        ]
      },
      {
        module: "Google My Business",
        hours: 10,
        topics: [
          "Creación de ficha de empresa en Google",
          "Optimización para búsquedas locales",
          "Gestión de reseñas",
          "Publicaciones y actualizaciones"
        ]
      },
      {
        module: "Email Marketing Básico",
        hours: 10,
        topics: [
          "Herramientas gratuitas: Mailchimp, Brevo",
          "Creación de campañas sencillas",
          "Listas de contactos y segmentación básica",
          "Análisis de resultados"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 10,
        topics: [
          "Desarrollo de estrategia digital para negocio propio o simulado",
          "Presentación de plan de acción",
          "Obtención de certificado oficial"
        ]
      }
    ],
    teachers: [
      {
        id: "1",
        name: "María García Pérez",
        photo: "https://i.pravatar.cc/150?img=1"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      },
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-03-01",
    end_date: "2025-04-15",
    enrollment_deadline: "2025-02-20",
    certificate_name: "Certificado Oficial de Empleabilidad Digital (SCE)"
  },
  {
    id: "CURSO009",
    name: "Excel Avanzado para Empresas",
    code: "EXCEL-ADV-EMP",
    type: "ocupados",
    modality: "telematico",
    duration_hours: 40,
    price: 0,
    max_students: 35,
    current_students: 28,
    description: "Bonificado por FUNDAE para trabajadores en activo. Tablas dinámicas, macros y automatización con VBA. Aprenderás a dominar Excel a nivel profesional para análisis de datos, informes automáticos y dashboards interactivos. 100% bonificable por la Seguridad Social.",
    objectives: [
      "Crear tablas dinámicas y gráficos avanzados para análisis de datos",
      "Automatizar tareas repetitivas con macros y VBA básico",
      "Trabajar con bases de datos en Excel: filtros, tablas, Power Query",
      "Crear dashboards interactivos con segmentadores y gráficos dinámicos",
      "Dominar funciones avanzadas: BUSCARV, SI.ERROR, SUMAR.SI.CONJUNTO",
      "Proteger y compartir libros de trabajo de forma segura"
    ],
    requirements: [
      "Estar dado de alta en el régimen general de la Seguridad Social (trabajador en activo)",
      "Excel nivel básico-intermedio (conocer fórmulas básicas, formato de celdas)",
      "Microsoft Excel 2016 o superior (Office 365 recomendado)"
    ],
    syllabus: [
      {
        module: "Funciones Avanzadas",
        hours: 10,
        topics: [
          "BUSCARV, BUSCARH, INDICE, COINCIDIR",
          "Funciones lógicas avanzadas: SI.ERROR, Y, O",
          "Funciones de fecha y hora",
          "Funciones de texto: CONCATENAR, EXTRAE, ENCONTRAR",
          "Funciones estadísticas: CONTAR.SI, SUMAR.SI.CONJUNTO"
        ]
      },
      {
        module: "Tablas Dinámicas",
        hours: 10,
        topics: [
          "Creación y configuración de tablas dinámicas",
          "Agrupación de datos por fechas, rangos, categorías",
          "Campos calculados y elementos calculados",
          "Gráficos dinámicos y segmentadores",
          "Actualización y refresh de datos"
        ]
      },
      {
        module: "Power Query y Power Pivot",
        hours: 10,
        topics: [
          "Importación de datos desde múltiples fuentes",
          "Transformación y limpieza de datos con Power Query",
          "Combinar consultas (merge y append)",
          "Introducción a Power Pivot y modelo de datos",
          "Medidas DAX básicas"
        ]
      },
      {
        module: "Automatización con Macros",
        hours: 10,
        topics: [
          "Grabadora de macros",
          "Edición básica de código VBA",
          "Automatización de tareas repetitivas",
          "Botones y controles de formulario",
          "Debugging y gestión de errores"
        ]
      }
    ],
    teachers: [
      {
        id: "5",
        name: "Pedro Sánchez Díaz",
        photo: "https://i.pravatar.cc/150?img=5"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-03-10",
    end_date: "2025-04-10",
    enrollment_deadline: "2025-03-03",
    certificate_name: "Certificado FUNDAE Excel Avanzado Empresarial"
  },
  {
    id: "CURSO010",
    name: "Inteligencia Artificial para Marketing",
    code: "AI-MKT-2025",
    type: "privados",
    modality: "telematico",
    duration_hours: 50,
    price: 590,
    max_students: 40,
    current_students: 0,
    description: "Uso de ChatGPT, Midjourney y herramientas IA para automatizar tareas de marketing y crear contenido. Aprenderás a utilizar las últimas herramientas de inteligencia artificial para generar textos, imágenes, vídeos y automatizar workflows completos de marketing. Próximamente en marzo 2025.",
    objectives: [
      "Generar textos publicitarios profesionales con ChatGPT y Claude",
      "Crear imágenes para redes sociales con Midjourney y DALL-E 3",
      "Automatizar workflows de marketing con Make y Zapier + IA",
      "Generar vídeos con IA: scripts, locución, edición",
      "Análisis de datos y predicciones con herramientas IA",
      "Ética y limitaciones de la IA en marketing"
    ],
    requirements: [
      "Conocimientos básicos de marketing digital",
      "Familiaridad con redes sociales y creación de contenido",
      "No se requieren conocimientos técnicos o programación"
    ],
    syllabus: [
      {
        module: "Fundamentos IA para Marketing",
        hours: 8,
        topics: [
          "Qué es la IA generativa y cómo funciona",
          "Principales herramientas: ChatGPT, Claude, Gemini",
          "Prompt engineering: técnicas y mejores prácticas",
          "Limitaciones y sesgos de los modelos de IA",
          "Aspectos legales: derechos de autor, privacidad"
        ]
      },
      {
        module: "Generación de Textos",
        hours: 12,
        topics: [
          "ChatGPT para copywriting: ads, emails, landing pages",
          "Creación de calendarios de contenido automatizados",
          "Generación de artículos de blog optimizados para SEO",
          "Personalización masiva de mensajes",
          "Traducción y adaptación multiidioma"
        ]
      },
      {
        module: "Generación de Imágenes",
        hours: 10,
        topics: [
          "Midjourney: prompts avanzados y estilos",
          "DALL-E 3 y Adobe Firefly",
          "Generación de logos, mockups y diseños",
          "Edición de imágenes con IA: remove.bg, Photoshop IA",
          "Consideraciones éticas y watermarks"
        ]
      },
      {
        module: "Vídeo y Audio",
        hours: 8,
        topics: [
          "Generación de scripts de vídeo con IA",
          "Text-to-speech profesional: ElevenLabs, Play.ht",
          "Generación de vídeos con IA: Synthesia, D-ID",
          "Subtitulado automático y traducción",
          "Edición automatizada con IA"
        ]
      },
      {
        module: "Automatización y Análisis",
        hours: 10,
        topics: [
          "Zapier y Make para workflows automáticos",
          "Integración de IA en CRM y email marketing",
          "Análisis predictivo y segmentación con IA",
          "Chatbots inteligentes para atención al cliente",
          "A/B testing automatizado con IA"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 2,
        topics: [
          "Desarrollo de campaña completa con herramientas IA",
          "Presentación de resultados y ROI",
          "Mejores prácticas y lecciones aprendidas"
        ]
      }
    ],
    teachers: [
      {
        id: "1",
        name: "María García Pérez",
        photo: "https://i.pravatar.cc/150?img=1"
      },
      {
        id: "3",
        name: "Laura Martínez Sosa",
        photo: "https://i.pravatar.cc/150?img=3"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    status: "draft",
    featured: false,
    start_date: "2025-03-15",
    enrollment_deadline: "2025-03-08",
    certificate_name: "Certificado Profesional en IA para Marketing"
  }
]
```

---

## 📋 FASE 2: Crear CoursesPage.tsx (30 min)

### Archivo: `src/pages/CoursesPage.tsx`

**CREAR NUEVO:**

```typescript
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BookOpen,
  Users,
  Clock,
  Euro,
  Plus,
  Edit,
  Search,
  Star,
  MapPin,
  GraduationCap,
  Calendar
} from "lucide-react"
import { CourseDialog } from "@/components/dialogs/CourseDialog"
import { coursesData } from "@/data/mockData"
import { useNavigate } from "react-router-dom"

export function CoursesPage() {
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(false)
  const [selected, setSelected] = useState<typeof coursesData[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterModality, setFilterModality] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const handleAdd = () => {
    setDialogMode('create')
    setSelected(null)
    setShowDialog(true)
  }

  const handleEdit = (course: typeof coursesData[0]) => {
    setDialogMode('edit')
    setSelected(course)
    setShowDialog(true)
  }

  // Filtrado
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || course.type === filterType
    const matchesModality = filterModality === 'all' || course.modality === filterModality
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus
    const matchesFeatured = !showFeaturedOnly || course.featured

    return matchesSearch && matchesType && matchesModality && matchesStatus && matchesFeatured
  })

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'telematico': 'Telemático',
      'ocupados': 'Ocupados',
      'desempleados': 'Desempleados',
      'privados': 'Privados',
      'ciclo-medio': 'Ciclo Medio',
      'ciclo-superior': 'Ciclo Superior'
    }
    return labels[type] || type
  }

  const getModalityLabel = (modality: string) => {
    const labels: Record<string, string> = {
      'presencial': 'Presencial',
      'semipresencial': 'Semipresencial',
      'telematico': 'Telemático'
    }
    return labels[modality] || modality
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground">
            Gestión del catálogo de cursos de CEP Comunicación
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Curso
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="privados">Privados</SelectItem>
                <SelectItem value="telematico">Telemático</SelectItem>
                <SelectItem value="ocupados">Ocupados</SelectItem>
                <SelectItem value="desempleados">Desempleados</SelectItem>
                <SelectItem value="ciclo-medio">Ciclo Medio</SelectItem>
                <SelectItem value="ciclo-superior">Ciclo Superior</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterModality} onValueChange={setFilterModality}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las modalidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las modalidades</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="semipresencial">Semipresencial</SelectItem>
                <SelectItem value="telematico">Telemático</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="archived">Archivados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            >
              <Star className="h-4 w-4 mr-2" />
              Solo Destacados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Cursos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {course.featured && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                    <CardTitle className="text-base leading-tight">
                      {course.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {course.code}
                  </CardDescription>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(course)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Badges de Tipo y Modalidad */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {getTypeLabel(course.type)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getModalityLabel(course.modality)}
                </Badge>
              </div>

              {/* Ciclo */}
              {course.cycle_name && (
                <div className="flex items-start gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">{course.cycle_name}</span>
                </div>
              )}

              {/* Descripción - OBLIGATORIA */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {course.description}
              </p>

              {/* Métricas Clave */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{course.duration_hours}h</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">
                    {course.price === 0 ? 'Gratis' : `${course.price}€`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">
                    {course.current_students}/{course.max_students}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{course.campuses.length} {course.campuses.length === 1 ? 'sede' : 'sedes'}</span>
                </div>
              </div>

              {/* Profesores */}
              <div>
                <p className="text-xs font-medium mb-2">Profesores:</p>
                <div className="flex -space-x-2">
                  {course.teachers.slice(0, 3).map((teacher) => (
                    <Avatar key={teacher.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={teacher.photo} />
                      <AvatarFallback className="text-xs">{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  ))}
                  {course.teachers.length > 3 && (
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                      <span className="text-xs">+{course.teachers.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fechas */}
              {course.start_date && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(course.start_date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
                    {course.end_date && ` - ${new Date(course.end_date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}`}
                  </span>
                </div>
              )}

              {/* Estado */}
              <div className="flex items-center justify-between pt-2 border-t">
                {course.status === 'published' && (
                  <Badge variant="default" className="text-xs">Publicado</Badge>
                )}
                {course.status === 'draft' && (
                  <Badge variant="secondary" className="text-xs">Borrador</Badge>
                )}
                {course.status === 'archived' && (
                  <Badge variant="outline" className="text-xs">Archivado</Badge>
                )}

                <span className="text-xs text-muted-foreground">
                  {Math.round((course.current_students / course.max_students) * 100)}% ocupado
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{coursesData.length}</p>
            <p className="text-xs text-muted-foreground">Cursos totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {coursesData.filter(c => c.status === 'published').length}
            </p>
            <p className="text-xs text-muted-foreground">Publicados</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {coursesData.reduce((acc, c) => acc + c.current_students, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Alumnos matriculados</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {coursesData.filter(c => c.featured).length}
            </p>
            <p className="text-xs text-muted-foreground">Destacados</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <CourseDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode={dialogMode}
        course={selected || undefined}
      />
    </div>
  )
}
```

---

## 📋 FASE 3: Crear CourseDialog.tsx (EL MÁS COMPLEJO - 40 min)

### Archivo: `src/components/dialogs/CourseDialog.tsx`

**CREAR NUEVO:**

```typescript
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Trash,
  Plus,
  X,
  Users,
  MapPin,
  BookOpen,
  Clock
} from "lucide-react"
import { coursesData, teachersData, campusesData, cyclesData, type Course } from "@/data/mockData"

interface CourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  course?: Course
}

export function CourseDialog({ open, onOpenChange, mode, course }: CourseDialogProps) {
  const isEdit = mode === 'edit'

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: course?.name || '',
    code: course?.code || '',
    type: course?.type || 'privados',
    modality: course?.modality || 'presencial',
    cycle_id: course?.cycle_id || '',
    duration_hours: course?.duration_hours || 0,
    price: course?.price || 0,
    max_students: course?.max_students || 0,
    current_students: course?.current_students || 0,
    description: course?.description || '',
    objectives: course?.objectives || [],
    requirements: course?.requirements || [],
    syllabus: course?.syllabus || [],
    teacher_ids: course?.teachers?.map(t => t.id) || [],
    campus_ids: course?.campuses?.map(c => c.id) || [],
    status: course?.status || 'draft',
    featured: course?.featured || false,
    start_date: course?.start_date || '',
    end_date: course?.end_date || '',
    enrollment_deadline: course?.enrollment_deadline || '',
    certificate_name: course?.certificate_name || ''
  })

  // Estados para agregar items dinámicos
  const [newObjective, setNewObjective] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newModule, setNewModule] = useState({ module: '', hours: 0, topics: [] as string[] })
  const [newTopic, setNewTopic] = useState('')

  const handleSave = () => {
    console.log('Guardar curso (MOCKUP):', formData)
    onOpenChange(false)
  }

  const handleDelete = () => {
    console.log('Eliminar curso (MOCKUP):', course?.id)
    onOpenChange(false)
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives, newObjective.trim()]
      })
      setNewObjective('')
    }
  }

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index)
    })
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()]
      })
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    })
  }

  const addModule = () => {
    if (newModule.module.trim() && newModule.hours > 0) {
      setFormData({
        ...formData,
        syllabus: [...formData.syllabus, { ...newModule }]
      })
      setNewModule({ module: '', hours: 0, topics: [] })
    }
  }

  const removeModule = (index: number) => {
    setFormData({
      ...formData,
      syllabus: formData.syllabus.filter((_, i) => i !== index)
    })
  }

  const addTopicToNewModule = () => {
    if (newTopic.trim()) {
      setNewModule({
        ...newModule,
        topics: [...newModule.topics, newTopic.trim()]
      })
      setNewTopic('')
    }
  }

  const removeTopicFromNewModule = (index: number) => {
    setNewModule({
      ...newModule,
      topics: newModule.topics.filter((_, i) => i !== index)
    })
  }

  const toggleTeacher = (teacherId: string) => {
    setFormData({
      ...formData,
      teacher_ids: formData.teacher_ids.includes(teacherId)
        ? formData.teacher_ids.filter(id => id !== teacherId)
        : [...formData.teacher_ids, teacherId]
    })
  }

  const toggleCampus = (campusId: string) => {
    setFormData({
      ...formData,
      campus_ids: formData.campus_ids.includes(campusId)
        ? formData.campus_ids.filter(id => id !== campusId)
        : [...formData.campus_ids, campusId]
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
            <TabsTrigger value="asignaciones">Profesores y Sedes</TabsTrigger>
            <TabsTrigger value="temario">Temario</TabsTrigger>
          </TabsList>

          {/* TAB 1: GENERAL */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Curso *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Community Manager Profesional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ej: CM-PRO-2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Curso *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="privados">Privados</SelectItem>
                    <SelectItem value="telematico">Telemático</SelectItem>
                    <SelectItem value="ocupados">Ocupados</SelectItem>
                    <SelectItem value="desempleados">Desempleados</SelectItem>
                    <SelectItem value="ciclo-medio">Ciclo Medio</SelectItem>
                    <SelectItem value="ciclo-superior">Ciclo Superior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modality">Modalidad *</Label>
                <Select value={formData.modality} onValueChange={(value) => setFormData({ ...formData, modality: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="semipresencial">Semipresencial</SelectItem>
                    <SelectItem value="telematico">Telemático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycle">Ciclo Formativo (opcional)</Label>
                <Select value={formData.cycle_id} onValueChange={(value) => setFormData({ ...formData, cycle_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sin ciclo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin ciclo</SelectItem>
                    {cyclesData.map((cycle) => (
                      <SelectItem key={cycle.id} value={cycle.id}>
                        {cycle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_hours">Duración (horas) *</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 0 })}
                  placeholder="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_students">Máximo de Alumnos *</Label>
                <Input
                  id="max_students"
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 0 })}
                  placeholder="25"
                />
              </div>

              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="current_students">Alumnos Actuales (solo lectura)</Label>
                  <Input
                    id="current_students"
                    type="number"
                    value={formData.current_students}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="start_date">Fecha de Inicio</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Fecha de Fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment_deadline">Plazo de Matrícula</Label>
                <Input
                  id="enrollment_deadline"
                  type="date"
                  value={formData.enrollment_deadline}
                  onChange={(e) => setFormData({ ...formData, enrollment_deadline: e.target.value })}
                />
              </div>
            </div>

            {/* Certificado */}
            <div className="space-y-2">
              <Label htmlFor="certificate_name">Nombre del Certificado (opcional)</Label>
              <Input
                id="certificate_name"
                value={formData.certificate_name}
                onChange={(e) => setFormData({ ...formData, certificate_name: e.target.value })}
                placeholder="Ej: Certificado Profesional en Community Management"
              />
            </div>

            {/* Destacado */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Marcar como curso destacado (aparecerá en portada)
              </Label>
            </div>
          </TabsContent>

          {/* TAB 2: CONTENIDO */}
          <TabsContent value="contenido" className="space-y-4">
            {/* Descripción - OBLIGATORIA */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Curso * (OBLIGATORIA)</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción completa del curso, qué aprenderán los alumnos, metodología, certificación incluida..."
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 100 caracteres recomendado. Esta descripción se mostrará en la web pública.
              </p>
            </div>

            {/* Objetivos */}
            <div className="space-y-2">
              <Label>Objetivos del Curso</Label>
              <div className="flex gap-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Agregar objetivo..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addObjective()
                    }
                  }}
                />
                <Button type="button" size="icon" onClick={addObjective}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.objectives.map((obj, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {obj}
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Requisitos */}
            <div className="space-y-2">
              <Label>Requisitos Previos</Label>
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Agregar requisito..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addRequirement()
                    }
                  }}
                />
                <Button type="button" size="icon" onClick={addRequirement}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requirements.map((req, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: PROFESORES Y SEDES */}
          <TabsContent value="asignaciones" className="space-y-6">
            {/* Profesores */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Profesores Asignados ({formData.teacher_ids.length})
              </Label>
              <div className="grid gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {teachersData.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => toggleTeacher(teacher.id)}
                  >
                    <Checkbox
                      checked={formData.teacher_ids.includes(teacher.id)}
                      onCheckedChange={() => toggleTeacher(teacher.id)}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={teacher.photo} />
                      <AvatarFallback>{teacher.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {teacher.first_name} {teacher.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{teacher.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sedes */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Sedes Donde se Imparte ({formData.campus_ids.length})
              </Label>
              <div className="grid gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {campusesData.map((campus) => (
                  <div
                    key={campus.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => toggleCampus(campus.id)}
                  >
                    <Checkbox
                      checked={formData.campus_ids.includes(campus.id)}
                      onCheckedChange={() => toggleCampus(campus.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{campus.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {campus.address}, {campus.city}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {campus.code}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: TEMARIO */}
          <TabsContent value="temario" className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Módulos del Temario ({formData.syllabus.length})
              </Label>

              {/* Módulos existentes */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {formData.syllabus.map((module, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{module.module}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{module.hours} horas</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeModule(index)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    {module.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {module.topics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Agregar nuevo módulo */}
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium">Agregar Nuevo Módulo</p>

                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Nombre del módulo..."
                    value={newModule.module}
                    onChange={(e) => setNewModule({ ...newModule, module: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Horas"
                    value={newModule.hours || ''}
                    onChange={(e) => setNewModule({ ...newModule, hours: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Temas del módulo */}
                <div className="space-y-2">
                  <Label className="text-xs">Temas del Módulo (opcional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Agregar tema..."
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTopicToNewModule()
                        }
                      }}
                    />
                    <Button type="button" size="icon" onClick={addTopicToNewModule}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {newModule.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                        <button
                          type="button"
                          onClick={() => removeTopicFromNewModule(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button type="button" onClick={addModule} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Módulo
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog Footer */}
        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {isEdit ? 'Guardar Cambios' : 'Crear Curso'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## ✅ VERIFICACIÓN Y TESTING

### Antes de ejecutar, verificar:

1. **Mock Data actualizado** ✅
   - `coursesData` exportado desde `mockData.ts`
   - 10 cursos con todos los campos completos
   - Interfaces `Course` correctamente definida

2. **CoursesPage.tsx** ✅
   - Filtros avanzados: búsqueda, tipo, modalidad, estado, destacados
   - Grid responsive con cards detalladas
   - Integración con CourseDialog

3. **CourseDialog.tsx** ✅
   - 4 tabs: General, Contenido, Profesores y Sedes, Temario
   - Listas dinámicas para objetivos, requisitos, módulos
   - Multi-select para profesores y sedes
   - Delete button solo en modo edición
   - Descripción OBLIGATORIA (campo destacado)

---

## 🎯 RESUMEN EJECUTIVO

### Lo que acabas de implementar:

**Cursos - La sección MÁS IMPORTANTE del dashboard**

#### Componentes creados:
1. **Mock Data expandido** (10 cursos completos con temarios detallados)
2. **CoursesPage.tsx** (grid con filtros avanzados)
3. **CourseDialog.tsx** (el dialog más complejo con 4 tabs)

#### Características implementadas:
- ✅ 10 cursos de ejemplo realistas (privados, telemático, ocupados, desempleados, ciclos)
- ✅ Filtros múltiples: búsqueda, tipo, modalidad, estado, destacados
- ✅ Temarios completos con módulos y temas
- ✅ Asignación de múltiples profesores y sedes
- ✅ Objetivos y requisitos como listas dinámicas
- ✅ Descripción OBLIGATORIA (nunca opcional)
- ✅ Sistema de fechas completo (inicio, fin, plazo matrícula)
- ✅ Certificación personalizada
- ✅ Sistema de destacados (featured)
- ✅ Visualización de ocupación (X/Y alumnos)
- ✅ Stats resumen (total cursos, publicados, alumnos, destacados)

#### Líneas de código generadas:
- **FASE 1 (Mock Data):** ~1,200 líneas
- **FASE 2 (CoursesPage):** ~370 líneas
- **FASE 3 (CourseDialog):** ~650 líneas
- **TOTAL:** ~2,220 líneas

---

## 📝 NOTAS IMPORTANTES

### Patrón aplicado:

1. **Descripción OBLIGATORIA** - Campo destacado, nunca opcional
2. **Listas dinámicas** - Objetivos, requisitos, módulos con agregar/eliminar
3. **Multi-select visual** - Profesores y sedes con checkboxes
4. **4 tabs organizados** - Separación lógica de contenido complejo
5. **Delete button interno** - Dentro del dialog, solo en modo edición
6. **Temario expandible** - Módulos con horas + temas opcionales

### Diferencias con otros dialogs:

- **Más complejo:** 4 tabs vs 3 tabs de otros dialogs
- **Más campos:** 20+ campos vs 10-12 de otros
- **Más relaciones:** Profesores + Sedes + Ciclo + Temario
- **Más validaciones:** Fechas, ocupación, precios, duración

---

## 🚀 SIGUIENTE PASO

Una vez ejecutado este prompt en Claude Code Web:

1. ✅ Cursos completamente implementado
2. ✅ Todos los componentes reutilizables creados
3. ✅ Patrón establecido para secciones complejas

**Siguientes secciones a implementar:**
- CampaignsPage + CampaignDialog (métricas y UTM)
- SettingsPage (configuración general)
- UserProfilePage (perfil del usuario)

---

**PROMPT LISTO PARA EJECUTAR EN CLAUDE CODE WEB** ✅

Copiar este archivo completo y pegarlo en Claude Code Web para implementar la sección de Cursos.

---

**Creado:** 2025-11-11
**Proyecto:** CEP Comunicación Dashboard Mockup
**Sección:** Cursos (MÁS IMPORTANTE)
**Versión:** Completo con CourseDialog.tsx v1.0