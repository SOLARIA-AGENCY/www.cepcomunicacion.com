import * as React from "react"
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CalendarDays,
  Users,
  UserCircle,
  Building2,
  DoorOpen,
  FileText,
  UserPlus,
  ListTodo,
  Megaphone,
  Sparkles,
  FileEdit,
  Newspaper,
  HelpCircle,
  MessageSquareQuote,
  Handshake,
  Image,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MapPin,
  Shield,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

// Menu structure
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Cursos",
    icon: BookOpen,
    url: "/cursos",
  },
  {
    title: "Programación",
    icon: Calendar,
    url: "/cursos/programacion",
  },
  {
    title: "Planner Visual",
    icon: CalendarDays,
    url: "/cursos/planner",
  },
  {
    title: "Ciclos",
    icon: GraduationCap,
    items: [
      { title: "Ciclo Medio", icon: GraduationCap, url: "/ciclos/medio" },
      { title: "Ciclo Superior", icon: GraduationCap, url: "/ciclos/superior" },
    ],
  },
  {
    title: "Sedes",
    icon: MapPin,
    items: [
      { title: "Todas las Sedes", icon: Building2, url: "/sedes" },
      {
        title: "CEP Norte",
        icon: MapPin,
        url: "/sedes/cep-norte",
        items: [
          { title: "Aulas CEP Norte", icon: DoorOpen, url: "/aulas/cep-norte" }
        ]
      },
      {
        title: "CEP Santa Cruz",
        icon: MapPin,
        url: "/sedes/cep-santa-cruz",
        items: [
          { title: "Aulas CEP Santa Cruz", icon: DoorOpen, url: "/aulas/cep-santa-cruz" }
        ]
      },
      {
        title: "CEP Sur",
        icon: MapPin,
        url: "/sedes/cep-sur",
        items: [
          { title: "Aulas CEP Sur", icon: DoorOpen, url: "/aulas/cep-sur" }
        ]
      },
    ],
  },
  {
    title: "Personal",
    icon: Users,
    items: [
      { title: "Profesores", icon: UserCircle, url: "/profesores" },
      { title: "Administrativos", icon: UserPlus, url: "/administrativo" },
      { title: "Alumnos", icon: Users, url: "/alumnos" },
    ],
  },
  {
    title: "Leads e Inscripciones",
    icon: FileText,
    items: [
      { title: "Leads", icon: FileText, url: "/leads" },
      { title: "Matrículas", icon: UserPlus, url: "/matriculas" },
      { title: "Lista de Espera", icon: ListTodo, url: "/lista-espera" },
    ],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    items: [
      { title: "Campañas", icon: Megaphone, url: "/campanas" },
      { title: "Creatividades", icon: Sparkles, url: "/creatividades" },
    ],
  },
  {
    title: "Contenido Web",
    icon: FileEdit,
    items: [
      { title: "Páginas", icon: FileEdit, url: "/contenido/paginas" },
      { title: "Blog", icon: Newspaper, url: "/contenido/blog" },
      { title: "FAQs", icon: HelpCircle, url: "/contenido/faqs" },
      { title: "Testimonios", icon: MessageSquareQuote, url: "/contenido/testimonios" },
      { title: "Sponsors", icon: Handshake, url: "/contenido/sponsors" },
      { title: "Medios", icon: Image, url: "/contenido/medios" },
    ],
  },
  {
    title: "Analíticas",
    icon: BarChart3,
    url: "/analiticas",
  },
  {
    title: "Configuración",
    icon: Settings,
    url: "/configuracion",
  },
  {
    title: "Administración",
    icon: Shield,
    items: [
      { title: "Usuarios", icon: Users, url: "/admin/usuarios" },
      { title: "Roles y Permisos", icon: Shield, url: "/admin/roles" },
      { title: "Registro de Actividad", icon: FileText, url: "/admin/actividad" },
    ],
  },
]

interface AppSidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function AppSidebar({ isCollapsed = false, onToggle }: AppSidebarProps) {
  const location = useLocation()
  const [openSections, setOpenSections] = React.useState<string[]>([])

  // Accordion behavior: only one section open at a time
  const toggleSection = (title: string) => {
    if (isCollapsed) return
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [title] // Only keep the new section open, close all others
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {isCollapsed ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mx-auto">
            <BookOpen className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">CEP Admin</span>
              <span className="text-xs opacity-70">Dashboard v2.0</span>
            </div>
          </div>
        )}
        {/* Toggle Button */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors"
            title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Menu Content */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.url
            const hasSubItems = item.items && item.items.length > 0
            const isOpen = openSections.includes(item.title)

            if (!hasSubItems) {
              return (
                <li key={item.title}>
                  <Link
                    to={item.url!}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="font-bold">{item.title}</span>}
                  </Link>
                </li>
              )
            }

            return (
              <li key={item.title}>
                <button
                  onClick={() => toggleSection(item.title)}
                  className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-bold">{item.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>
                {!isCollapsed && isOpen && (
                  <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                    {item.items?.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = location.pathname === subItem.url
                      const hasNestedItems = subItem.items && subItem.items.length > 0
                      const [nestedOpen, setNestedOpen] = React.useState(false)

                      return (
                        <li key={subItem.title}>
                          {hasNestedItems ? (
                            <>
                              <button
                                onClick={() => setNestedOpen(!nestedOpen)}
                                className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              >
                                <SubIcon className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-left">{subItem.title}</span>
                                <ChevronDown
                                  className={`h-3 w-3 transition-transform ${
                                    nestedOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              {nestedOpen && (
                                <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                                  {subItem.items?.map((nestedItem) => {
                                    const NestedIcon = nestedItem.icon
                                    const isNestedActive = location.pathname === nestedItem.url
                                    return (
                                      <li key={nestedItem.title}>
                                        <Link
                                          to={nestedItem.url}
                                          className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                                            isNestedActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                                          }`}
                                        >
                                          <NestedIcon className="h-3 w-3 shrink-0" />
                                          <span>{nestedItem.title}</span>
                                        </Link>
                                      </li>
                                    )
                                  })}
                                </ul>
                              )}
                            </>
                          ) : (
                            <Link
                              to={subItem.url}
                              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                                isSubActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                              }`}
                            >
                              <SubIcon className="h-4 w-4 shrink-0" />
                              <span>{subItem.title}</span>
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs opacity-70">© 2025 CEP Comunicación</p>
        </div>
      )}
    </div>
  )
}
