# Dashboard Administrativo CEP - Mockup de Diseño

## 🎯 Estado Actual

**Dashboard Funcional en Navegador:**
- ✅ **URL:** http://localhost:5174/
- ✅ **Estado:** Corriendo y accesible
- ✅ **Stack:** React 19 + TypeScript + Vite + TailwindCSS 4 + shadcn/ui

---

## 📋 Características Implementadas

### ✅ Fase 1: Layout y Navegación
- **Sidebar Colapsable** con todas las secciones del dashboard
- **Header Superior** con búsqueda, notificaciones y menú de usuario
- **Breadcrumbs** para navegación contextual
- **9 Secciones Principales:**
  - Dashboard (Overview)
  - Cursos (Lista, Programación, Planner Visual)
  - Personas (Profesores, Asesores, Alumnos)
  - Recursos (Sedes/Campus, Aulas)
  - Leads e Inscripciones (Leads, Matrículas, Lista de Espera)
  - Marketing (Campañas, Creatividades)
  - Contenido Web (Páginas, Blog, FAQs, Testimonios, Sponsors, Medios)
  - Analíticas
  - Configuración

### ✅ Fase 2: Dashboard Principal
- **9 KPI Cards** con métricas clave:
  - Cursos Activos (32/48)
  - Alumnos (856/1247)
  - Leads este Mes (187/2341)
  - Tasa de Conversión (34.5%)
  - Ingresos Totales (488k €)
  - Convocatorias Activas (18)
  - Profesores (45)
  - Sedes (5)
  - Ocupación Aulas (78.5%)

- **Próximas Convocatorias** con estado y ocupación
- **Campañas de Marketing** con rendimiento
- **Resumen de Actividad** con ratios y métricas calculadas

### ✅ Fase 3: Módulo de Cursos
- **Tabla Completa** con todos los cursos
- **Filtros** por tipo, modalidad, estado
- **Búsqueda** en tiempo real
- **Badges Visuales** para categorización
- **Botón Crear** nuevo curso

### ✅ Fase 4: Datos Mock Realistas
- **48 Cursos** de diferentes tipos
- **5 Sedes** (Madrid, Barcelona, Valencia, Sevilla, Online)
- **20+ Aulas** con equipamiento
- **45 Profesores** con especialidades
- **1247 Alumnos** activos e inactivos
- **2341 Leads** con diferentes estados
- **5 Campañas** publicitarias con métricas
- **Tipos de Cursos:** telemático, ocupados, desempleados, privados, ciclo-medio, ciclo-superior

---

## 🚀 Cómo Usar

### Iniciar el Dashboard
```bash
cd design-dashboard-mockup/cep-admin-mockup
pnpm dev
```

Abrir en navegador: **http://localhost:5174/**

### Navegación
- **Sidebar:** Click en cualquier sección para navegar
- **Secciones con Subsecciones:** Se expanden automáticamente
- **Breadcrumbs:** Muestran la ubicación actual
- **Búsqueda Global:** Header superior derecha
- **Notificaciones:** Icono de campana (mockup)
- **Usuario:** Icono de usuario con menú dropdown

---

## 📂 Estructura del Proyecto

```
cep-admin-mockup/
├── src/
│   ├── components/
│   │   └── ui/              # 13 componentes shadcn/ui
│   ├── layouts/
│   │   ├── DashboardLayout.tsx  # Layout principal con header
│   │   └── AppSidebar.tsx       # Sidebar colapsable con menú
│   ├── pages/
│   │   ├── DashboardPage.tsx    # Dashboard con KPIs
│   │   ├── CoursesPage.tsx      # Tabla de cursos
│   │   ├── ProgrammingPage.tsx  # (Placeholder)
│   │   ├── PlannerPage.tsx      # (Placeholder)
│   │   ├── TeachersPage.tsx     # (Placeholder)
│   │   ├── StudentsPage.tsx     # (Placeholder)
│   │   ├── CampusPage.tsx       # (Placeholder)
│   │   ├── ClassroomsPage.tsx   # (Placeholder)
│   │   ├── LeadsPage.tsx        # (Placeholder)
│   │   └── AnalyticsPage.tsx    # (Placeholder)
│   ├── data/
│   │   └── mockData.ts          # Datos mock realistas
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript
│   ├── lib/
│   │   └── utils.ts             # Utilidades (cn)
│   └── App.tsx                  # Router principal
├── components.json              # Configuración shadcn/ui
└── README_DASHBOARD.md          # Esta documentación
```

---

## 🎨 Componentes shadcn/ui Instalados

1. **Button** - Botones con variantes
2. **Card** - Tarjetas de contenido
3. **Table** - Tablas de datos
4. **Badge** - Etiquetas de estado
5. **Dialog** - Modales
6. **Dropdown Menu** - Menús desplegables
7. **Sheet** - Panel lateral
8. **Sidebar** - Barra lateral colapsable
9. **Separator** - Separadores visuales
10. **Tooltip** - Tooltips informativos
11. **Input** - Campos de entrada
12. **Breadcrumb** - Navegación de migas
13. **Collapsible** - Secciones colapsables

---

## 📊 Datos Mock Disponibles

### DashboardMetrics
- Métricas generales de la academia
- KPIs calculados en tiempo real

### Courses (48 cursos)
- Todos los tipos de cursos CEP
- Modalidades: presencial, semipresencial, telemático
- Estados: borrador, publicado, archivado

### Convocations (Programación)
- Fechas de inicio y fin
- Capacidad (min/max)
- Alumnos inscritos
- Estado: abierta, lista_espera, cerrada, planificada

### Campuses (5 sedes)
- Madrid Centro, Barcelona, Valencia, Sevilla, Online
- Datos de contacto completos
- Número de aulas por sede

### Classrooms (20+ aulas)
- Capacidades variables
- Equipamiento detallado
- Asignación a sede

### Teachers (45 profesores)
- Datos personales
- Especialidades
- Número de cursos asignados

### Students (1247 alumnos)
- 20 ejemplos detallados en array
- Estados activo/inactivo
- Historial de inscripciones

### Leads (2341 leads)
- 5 ejemplos detallados
- Estados: nuevo, contactado, inscrito, descartado
- Fuentes: web, meta_ads, whatsapp, referido
- UTM tracking

### Campaigns (5 campañas)
- Presupuestos
- Leads generados
- Tasas de conversión
- Cost per lead

---

## 🔧 Próximos Pasos (Roadmap)

### Fase 5: Planner Visual de Horarios
- [ ] Vista de calendario semanal/mensual
- [ ] Drag & Drop para asignación
- [ ] Código de colores por tipo de curso
- [ ] Detección de conflictos
- [ ] Vista por sede/profesor/aula

### Fase 6: Módulo de Leads con Kanban
- [ ] Vista kanban por estado
- [ ] Drag & Drop entre columnas
- [ ] Filtros avanzados
- [ ] Formulario de seguimiento
- [ ] Asignación a asesores

### Fase 7: Módulo de Programación
- [ ] Calendario de convocatorias
- [ ] Formulario de creación
- [ ] Gestión de capacidad
- [ ] Asignación de sedes y precios

### Fase 8: Gestión de Personas
- [ ] CRUD completo profesores
- [ ] CRUD completo alumnos
- [ ] CRUD completo asesores
- [ ] Disponibilidad de profesores
- [ ] Historial de asignaciones

### Fase 9: Gestión de Recursos
- [ ] CRUD sedes/campus
- [ ] CRUD aulas
- [ ] Calendario de ocupación
- [ ] Mapa de ubicaciones

### Fase 10: Marketing
- [ ] Dashboard de campañas
- [ ] Gráficos de rendimiento
- [ ] Creatividades con preview
- [ ] Integración LLM (generación)

### Fase 11: Contenido Web
- [ ] Editor de páginas
- [ ] Gestión de blog posts
- [ ] CRUD FAQs
- [ ] CRUD testimonios
- [ ] CRUD sponsors
- [ ] Media library

### Fase 12: Analíticas
- [ ] Gráficos con Recharts
- [ ] Exportación CSV/PDF
- [ ] Filtros de rango de fechas
- [ ] Reportes personalizados

---

## 🎯 Guía de Integración al Dashboard Real

### 1. Copiar Componentes UI
```bash
# Copiar todos los componentes shadcn/ui
cp -r design-dashboard-mockup/cep-admin-mockup/src/components/ui/* apps/admin/components/ui/
```

### 2. Adaptar Layouts
- **DashboardLayout.tsx** → Integrar con autenticación real
- **AppSidebar.tsx** → Conectar con permisos RBAC
- Reemplazar datos mock con llamadas API

### 3. Conectar con Backend
```typescript
// Reemplazar:
import { courses } from "@/data/mockData"

// Por:
import { useQuery } from "@tanstack/react-query"
const { data: courses } = useQuery({
  queryKey: ["courses"],
  queryFn: () => fetch("/api/courses").then(r => r.json())
})
```

### 4. Implementar Autenticación
- Context de usuario
- Protección de rutas
- Permisos por rol (Admin, Gestor, Marketing, Asesor, Lectura)

### 5. Añadir Validación
- React Hook Form
- Zod schemas
- Mensajes de error

### 6. Testing
- Unit tests para componentes
- Integration tests para flujos
- E2E tests con Playwright

---

## 🛠️ Tecnologías Utilizadas

- **React 19.2.0** - Framework frontend
- **TypeScript 5.9.3** - Tipado estático
- **Vite 7.2.2** - Build tool y dev server
- **TailwindCSS 4.1.17** - Styling
- **shadcn/ui** - Componentes UI
- **React Router 7.9.5** - Routing
- **Lucide React** - Iconos
- **class-variance-authority** - Variantes de clases
- **tailwind-merge** - Merge de clases Tailwind
- **clsx** - Utilidad de clases condicionales

---

## 📝 Notas Importantes

### Colores del Branding CEP
- **Primario:** #0066CC (azul corporativo)
- **Secundario:** #FF6600 (naranja acento)
- **Neutros:** Slate de Tailwind
- **Estados:** success (green), warning (yellow), error (red)

### Principios de Diseño
- Clean y minimalista
- Whitespace generoso
- Jerarquía visual clara
- Mobile-first responsive
- Accesibilidad WCAG 2.1 AA
- Animaciones sutiles

### Performance
- Code splitting por ruta
- Lazy loading de componentes
- Optimización de imágenes
- Memoización estratégica

---

## 🐛 Troubleshooting

### El servidor no inicia
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
pnpm install
pnpm dev
```

### Errores de TypeScript
```bash
# Verificar tipos
pnpm exec tsc --noEmit
```

### Conflictos de estilos
```bash
# Reconstruir Tailwind
rm -rf .vite
pnpm dev
```

---

## 📞 Contacto

**Proyecto:** CEPComunicacion v2
**Cliente:** CEP FORMACIÓN
**Agencia:** SOLARIA AGENCY
**Fecha:** 2025-11-11
**Estado:** Mockup Fase 1 Completo ✅

---

**Última Actualización:** 2025-11-11 12:40 UTC
**Versión Dashboard:** 1.0.0-mockup
