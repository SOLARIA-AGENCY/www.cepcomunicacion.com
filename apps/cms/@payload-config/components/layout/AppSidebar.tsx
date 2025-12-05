'use client'

import * as React from 'react'
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
  Image,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MapPin,
  Shield,
  List,
  Lock,
  Briefcase,
  Monitor,
  Globe,
  FileInput,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { MenuItem } from '@/types'
import { LogoutButton } from '@payload-config/components/ui/LogoutButton'

// Menu structure
// FORCED MODULE INVALIDATION - timestamp: 18:20:00
const menuItems: MenuItem[] = [
  {
    title: '🔴 DASHBOARD ACTUALIZADO 🔴',
    icon: LayoutDashboard,
    url: '/',
  },
  {
    title: 'Programación',
    icon: Calendar,
    url: '/programacion',
  },
  {
    title: 'Planner Visual',
    icon: CalendarDays,
    url: '/planner',
  },
  {
    title: 'Cursos',
    icon: BookOpen,
    items: [
      { title: 'Todos los Cursos', icon: List, url: '/cursos' },
      { title: 'Cursos Privados', icon: Lock, url: '/cursos?tipo=privados' },
      { title: 'Cursos Ocupados', icon: Briefcase, url: '/cursos?tipo=ocupados' },
      { title: 'Cursos Desempleados', icon: Building2, url: '/cursos?tipo=desempleados' },
      { title: 'Cursos Teleformación', icon: Monitor, url: '/cursos?tipo=teleformacion' },
    ],
  },
  {
    title: 'Ciclos',
    icon: GraduationCap,
    items: [
      { title: 'Todos los Ciclos', icon: List, url: '/ciclos' },
      { title: 'Ciclo Medio', icon: GraduationCap, url: '/ciclos-medio' },
      { title: 'Ciclo Superior', icon: GraduationCap, url: '/ciclos-superior' },
    ],
  },
  {
    title: 'Sedes',
    icon: Building2,
    url: '/sedes',
  },
  {
    title: 'Personal',
    icon: Users,
    items: [
      { title: 'Profesores', icon: UserCircle, url: '/profesores' },
      { title: 'Administrativos', icon: UserPlus, url: '/administrativo' },
      { title: 'Alumnos', icon: Users, url: '/alumnos' },
    ],
  },
  {
    title: 'Leads e Inscripciones',
    icon: FileText,
    items: [
      { title: 'Leads', icon: FileText, url: '/leads' },
      { title: 'Matrículas', icon: UserPlus, url: '/matriculas' },
      { title: 'Lista de Espera', icon: ListTodo, url: '/lista-espera' },
    ],
  },
  {
    title: 'Marketing',
    icon: Megaphone,
    items: [
      { title: 'Campañas', icon: Megaphone, url: '/campanas' },
      { title: 'Creatividades', icon: Sparkles, url: '/creatividades' },
    ],
  },
  {
    title: 'Contenido Web',
    icon: Globe,
    items: [
      {
        title: 'Cursos Publicados',
        icon: BookOpen,
        items: [
          { title: 'Todos los Cursos Web', icon: Globe, url: '/web/cursos' },
          { title: 'Privados Web', icon: Lock, url: '/web/cursos?tipo=privados' },
          { title: 'Ocupados Web', icon: Briefcase, url: '/web/cursos?tipo=ocupados' },
          {
            title: 'Desempleados Web',
            icon: Building2,
            url: '/web/cursos?tipo=desempleados',
          },
          { title: 'Teleformación Web', icon: Monitor, url: '/web/cursos?tipo=teleformacion' },
        ],
      },
      {
        title: 'Ciclos Publicados',
        icon: GraduationCap,
        items: [
          { title: 'Ciclo Medio Web', icon: GraduationCap, url: '/web/ciclos/medio' },
          { title: 'Ciclo Superior Web', icon: GraduationCap, url: '/web/ciclos/superior' },
        ],
      },
      { title: 'Noticias/Blog', icon: Newspaper, url: '/contenido/blog' },
      { title: 'Páginas', icon: FileEdit, url: '/contenido/paginas' },
      { title: 'FAQs', icon: HelpCircle, url: '/contenido/faqs' },
      {
        title: 'Testimonios',
        icon: MessageSquareQuote,
        url: '/contenido/testimonios',
      },
      { title: 'Formularios', icon: FileInput, url: '/contenido/formularios' },
      { title: 'Medios', icon: Image, url: '/contenido/medios' },
      { title: 'Visitantes', icon: Eye, url: '/contenido/visitantes' },
    ],
  },
  {
    title: 'Analíticas',
    icon: BarChart3,
    url: '/analiticas',
  },
  {
    title: 'Administración',
    icon: Shield,
    items: [
      { title: 'Usuarios', icon: Users, url: '/administracion/usuarios' },
      { title: 'Roles y Permisos', icon: Shield, url: '/administracion/roles' },
      { title: 'Registro de Actividad', icon: FileText, url: '/administracion/actividad' },
    ],
  },
  {
    title: 'Configuración',
    icon: Settings,
    items: [
      { title: 'General', icon: Settings, url: '/configuracion/general' },
      { title: 'Áreas de Estudio', icon: BookOpen, url: '/configuracion/areas' },
      { title: 'APIs y Webhooks', icon: Globe, url: '/configuracion/apis' },
      { title: 'Personalización', icon: Sparkles, url: '/configuracion/personalizacion' },
    ],
  },
]

interface SubMenuItemProps {
  subItem: MenuItem
  pathname: string
}

function SubMenuItem({ subItem, pathname }: SubMenuItemProps) {
  const [nestedOpen, setNestedOpen] = React.useState(false)
  const SubIcon = subItem.icon
  const isSubActive = pathname === subItem.url
  const hasNestedItems = subItem.items && subItem.items.length > 0

  if (hasNestedItems) {
    return (
      <>
        <button
          onClick={() => setNestedOpen(!nestedOpen)}
          className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-base transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <SubIcon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{subItem.title}</span>
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              nestedOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {nestedOpen && (
          <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
            {subItem.items?.map((nestedItem) => {
              const NestedIcon = nestedItem.icon
              const isNestedActive = pathname === nestedItem.url
              return (
                <li key={nestedItem.title}>
                  <Link
                    href={nestedItem.url!}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                      isNestedActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : ''
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
    )
  }

  return (
    <Link
      href={subItem.url!}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-base transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
        isSubActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : ''
      }`}
    >
      <SubIcon className="h-4 w-4 shrink-0" />
      <span>{subItem.title}</span>
    </Link>
  )
}

interface AppSidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function AppSidebar({ isCollapsed = false, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = React.useState<string[]>([])
  const [logoUrl, setLogoUrl] = React.useState('/logos/cep-logo-alpha.png')
  const [academyName, setAcademyName] = React.useState('CEP Formación')

  // Fetch logo config from API
  React.useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config?section=logos')
        if (response.ok) {
          const { data } = await response.json()
          setLogoUrl(data.claro || '/logos/cep-logo-alpha.png')
        }

        const academyResponse = await fetch('/api/config?section=academia')
        if (academyResponse.ok) {
          const { data } = await academyResponse.json()
          setAcademyName(data.nombre || 'CEP Formación')
        }
      } catch (error) {
        console.error('Error fetching sidebar config:', error)
      }
    }
    fetchConfig()
  }, [])

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
      {/* Header - Logo Only */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        {isCollapsed ? (
          <div className="flex items-center justify-center">
            <NextImage
              src={logoUrl}
              alt={academyName}
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <NextImage
              src={logoUrl}
              alt={academyName}
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              style={{ height: "auto" }}
            />
          </div>
        )}
      </div>

      {/* Menu Content */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url
            const hasSubItems = item.items && item.items.length > 0
            const isOpen = openSections.includes(item.title)

            if (!hasSubItems) {
              return (
                <li key={item.title}>
                  <Link
                    href={item.url!}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                      isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              )
            }

            return (
              <li key={item.title}>
                <button
                  onClick={() => toggleSection(item.title)}
                  className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </>
                  )}
                </button>
                {!isCollapsed && isOpen && (
                  <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                    {item.items?.map((subItem) => (
                      <li key={subItem.title}>
                        <SubMenuItem subItem={subItem} pathname={pathname} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer - Always Visible */}
      <div className="border-t border-sidebar-border">
        {/* Logout Button */}
        {!isCollapsed && (
          <div className="px-4 py-2 border-b border-sidebar-border">
            <LogoutButton />
          </div>
        )}

        {/* Help Section */}
        {!isCollapsed && (
          <Link
            href="/ayuda"
            className="flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent transition-colors border-b border-sidebar-border"
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="text-base">Ayuda y Documentación</p>
              <p className="text-sm opacity-70">Guías y soporte técnico</p>
            </div>
          </Link>
        )}

        {/* Copyright and Toggle */}
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <p className="text-sm opacity-70">© 2025 CEP Comunicación</p>
          )}
          {/* Toggle Button */}
          {onToggle && (
            <button
              onClick={onToggle}
              className={`flex h-9 w-9 items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors ${
                isCollapsed ? 'mx-auto' : 'ml-auto'
              }`}
              title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
