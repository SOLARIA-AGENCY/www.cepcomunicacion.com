# PROMPT COMPLETO PARTE FINAL - Dashboard CEP Comunicación

## 🎯 OBJETIVO

Implementar las **3 ÚLTIMAS SECCIONES** del dashboard mockup:
1. **Campañas** (CampaignsPage + CampaignDialog)
2. **Configuración** (SettingsPage con tabs inline)
3. **Perfil de Usuario** (UserProfilePage + UserProfileDialog)

**Ubicación del proyecto:**
```
/Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup/
```

---

## 📋 FASE 1: Expandir Mock Data para Campañas (15 min)

### Archivo: `src/data/mockData.ts`

**AGREGAR AL FINAL del archivo (después de `coursesData`):**

```typescript
// ============================================
// CAMPAÑAS (10 registros)
// ============================================
export interface Campaign {
  id: string
  name: string
  code: string
  type: 'email' | 'social' | 'paid_ads' | 'organic' | 'event' | 'referral'
  status: 'draft' | 'active' | 'paused' | 'completed'
  description: string // OBLIGATORIA
  start_date: string
  end_date: string
  budget: number
  spent: number
  objectives: {
    target_leads: number
    target_enrollments: number
  }
  metrics: {
    total_leads: number
    total_enrollments: number
    conversion_rate: number
    cost_per_lead: number
    cost_per_enrollment: number
  }
  utm_params: {
    utm_source: string
    utm_medium: string
    utm_campaign: string
    utm_term?: string
    utm_content?: string
  }
  courses: {
    id: string
    name: string
    code: string
  }[]
  campuses: {
    id: string
    name: string
    code: string
  }[]
  created_by: string
  created_at: string
}

export const campaignsData: Campaign[] = [
  {
    id: "CAMP001",
    name: "Lanzamiento Cursos Marketing Digital 2025",
    code: "MKT-LAUNCH-2025-Q1",
    type: "paid_ads",
    status: "active",
    description: "Campaña de lanzamiento de cursos de marketing digital para el primer trimestre 2025. Incluye Meta Ads (Facebook e Instagram), Google Ads y remarketing. Objetivo: captar 150 leads cualificados con tasa de conversión mínima del 15%. Público objetivo: profesionales de 25-45 años interesados en upskilling digital.",
    start_date: "2025-01-15",
    end_date: "2025-03-31",
    budget: 3500,
    spent: 1850,
    objectives: {
      target_leads: 150,
      target_enrollments: 25
    },
    metrics: {
      total_leads: 87,
      total_enrollments: 14,
      conversion_rate: 16.1,
      cost_per_lead: 21.26,
      cost_per_enrollment: 132.14
    },
    utm_params: {
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "mkt-launch-2025-q1",
      utm_content: "carousel-testimonials"
    },
    courses: [
      {
        id: "CURSO001",
        name: "Community Manager Profesional",
        code: "CM-PRO-2025"
      },
      {
        id: "CURSO002",
        name: "SEO y SEM Avanzado",
        code: "SEO-SEM-ADV"
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
    created_by: "María García Pérez",
    created_at: "2025-01-10"
  },
  {
    id: "CAMP002",
    name: "Email Nurturing - Cursos Desarrollo Web",
    code: "EMAIL-DEV-NURTURE-Q1",
    type: "email",
    status: "active",
    description: "Secuencia de 8 emails automatizada para leads que descargaron el ebook 'Guía de Desarrollo Web 2025'. Segmentación por nivel de experiencia (principiante, intermedio, avanzado). Contenido educativo + ofertas exclusivas de cursos React y Node.js. Objetivo: conversión del 8% de la lista.",
    start_date: "2025-02-01",
    end_date: "2025-04-30",
    budget: 450,
    spent: 180,
    objectives: {
      target_leads: 300,
      target_enrollments: 24
    },
    metrics: {
      total_leads: 156,
      total_enrollments: 11,
      conversion_rate: 7.05,
      cost_per_lead: 1.15,
      cost_per_enrollment: 16.36
    },
    utm_params: {
      utm_source: "mailchimp",
      utm_medium: "email",
      utm_campaign: "dev-nurture-q1",
      utm_content: "ebook-download"
    },
    courses: [
      {
        id: "CURSO004",
        name: "Desarrollo Frontend con React",
        code: "REACT-2025"
      },
      {
        id: "CURSO005",
        name: "Backend con Node.js y PostgreSQL",
        code: "NODE-PSQL"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    created_by: "Carlos Rodríguez Martínez",
    created_at: "2025-01-25"
  },
  {
    id: "CAMP003",
    name: "Webinar Gratuito - Introducción a UX/UI",
    code: "WEBINAR-UX-FEB",
    type: "event",
    status: "completed",
    description: "Webinar online gratuito de 90 minutos sobre fundamentos de diseño UX/UI. Incluye demostración en vivo con Figma y Q&A. Estrategia de lead magnet para conversión posterior a curso completo de UX/UI. Promoción vía redes sociales orgánicas (LinkedIn, Instagram) + email marketing a base de datos existente.",
    start_date: "2025-02-15",
    end_date: "2025-02-15",
    budget: 150,
    spent: 150,
    objectives: {
      target_leads: 100,
      target_enrollments: 8
    },
    metrics: {
      total_leads: 142,
      total_enrollments: 12,
      conversion_rate: 8.45,
      cost_per_lead: 1.06,
      cost_per_enrollment: 12.50
    },
    utm_params: {
      utm_source: "linkedin",
      utm_medium: "organic",
      utm_campaign: "webinar-ux-feb",
      utm_content: "event-post"
    },
    courses: [
      {
        id: "CURSO003",
        name: "Diseño UX/UI con Figma",
        code: "UX-UI-FIG"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    created_by: "Laura Martínez Sosa",
    created_at: "2025-01-30"
  },
  {
    id: "CAMP004",
    name: "Campaña Orgánica Instagram - Cursos Audiovisuales",
    code: "INSTA-AV-ORGANIC-Q1",
    type: "organic",
    status: "active",
    description: "Estrategia de contenido orgánico en Instagram enfocada en cursos audiovisuales (edición vídeo, fotografía, motion graphics). Publicación diaria: carruseles educativos, reels con tips, testimonios de alumnos. Uso de hashtags específicos del sector audiovisual. Colaboraciones con influencers locales del sector creativo. Objetivo: crecimiento de 500 seguidores mensuales y 50 leads orgánicos.",
    start_date: "2025-01-01",
    end_date: "2025-03-31",
    budget: 200,
    spent: 120,
    objectives: {
      target_leads: 150,
      target_enrollments: 10
    },
    metrics: {
      total_leads: 68,
      total_enrollments: 5,
      conversion_rate: 7.35,
      cost_per_lead: 1.76,
      cost_per_enrollment: 24.00
    },
    utm_params: {
      utm_source: "instagram",
      utm_medium: "organic",
      utm_campaign: "av-organic-q1",
      utm_content: "bio-link"
    },
    courses: [
      {
        id: "CURSO007",
        name: "Edición de Vídeo con Premiere Pro",
        code: "PREMIERE-PRO"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    created_by: "Ana López Ruiz",
    created_at: "2024-12-20"
  },
  {
    id: "CAMP005",
    name: "Programa de Referencias - Alumnos Actuales",
    code: "REFERRAL-2025-CONTINUOUS",
    type: "referral",
    status: "active",
    description: "Programa de incentivos para alumnos actuales que recomienden CEP a amigos/conocidos. Por cada referido matriculado, el alumno recibe 50€ de descuento en su próximo curso + el nuevo alumno recibe 25€ de descuento. Sistema de tracking mediante códigos únicos. Comunicación vía email mensual + cartelería en sedes físicas.",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    budget: 1000,
    spent: 175,
    objectives: {
      target_leads: 80,
      target_enrollments: 30
    },
    metrics: {
      total_leads: 23,
      total_enrollments: 9,
      conversion_rate: 39.13,
      cost_per_lead: 7.61,
      cost_per_enrollment: 19.44
    },
    utm_params: {
      utm_source: "referral",
      utm_medium: "word-of-mouth",
      utm_campaign: "referral-2025",
      utm_content: "student-code"
    },
    courses: [], // Aplica a todos los cursos
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
      },
      {
        id: "C003",
        name: "CEP Sur",
        code: "SUR"
      }
    ],
    created_by: "Pedro Sánchez Díaz",
    created_at: "2024-12-15"
  },
  {
    id: "CAMP006",
    name: "Google Ads - Certificaciones Cisco",
    code: "GOOGLE-CISCO-Q1",
    type: "paid_ads",
    status: "paused",
    description: "Campaña de búsqueda en Google Ads enfocada en keywords de certificaciones Cisco (CCNA, CCNP). Incluye Display Ads con remarketing. Segmentación: profesionales IT de 25-50 años. Landing page específica con testimonios de alumnos certificados + comparativa de precios vs competencia. Pausada temporalmente por optimización de landing page.",
    start_date: "2025-01-20",
    end_date: "2025-04-20",
    budget: 2000,
    spent: 650,
    objectives: {
      target_leads: 60,
      target_enrollments: 15
    },
    metrics: {
      total_leads: 18,
      total_enrollments: 3,
      conversion_rate: 16.67,
      cost_per_lead: 36.11,
      cost_per_enrollment: 216.67
    },
    utm_params: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "cisco-q1",
      utm_term: "certificacion-ccna"
    },
    courses: [
      {
        id: "CURSO006",
        name: "Redes Cisco CCNA",
        code: "CCNA-2025"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    created_by: "Miguel Hernández Castro",
    created_at: "2025-01-12"
  },
  {
    id: "CAMP007",
    name: "Social Media - Cursos Desempleados Gratuitos",
    code: "SOCIAL-DESEMP-Q1",
    type: "social",
    status: "active",
    description: "Campaña social orgánica + paid para promocionar cursos gratuitos subvencionados para desempleados. Contenido empático enfocado en reinserción laboral y mejora de empleabilidad. Publicaciones en Facebook (orgánico + ads) + Instagram Stories. Colaboración con oficinas de empleo del Cabildo. Público: desempleados inscritos en DARDE de 30-55 años.",
    start_date: "2025-02-01",
    end_date: "2025-03-15",
    budget: 800,
    spent: 420,
    objectives: {
      target_leads: 120,
      target_enrollments: 40
    },
    metrics: {
      total_leads: 78,
      total_enrollments: 28,
      conversion_rate: 35.90,
      cost_per_lead: 5.38,
      cost_per_enrollment: 15.00
    },
    utm_params: {
      utm_source: "facebook",
      utm_medium: "cpc",
      utm_campaign: "desemp-q1",
      utm_content: "carousel-testimonials"
    },
    courses: [
      {
        id: "CURSO008",
        name: "Marketing Digital para Desempleados",
        code: "MKT-DESEMP"
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
    created_by: "María García Pérez",
    created_at: "2025-01-22"
  },
  {
    id: "CAMP008",
    name: "Email FUNDAE - Empresas Sector Tech",
    code: "EMAIL-FUNDAE-TECH",
    type: "email",
    status: "draft",
    description: "Campaña de email marketing B2B dirigida a responsables de RRHH de empresas tecnológicas locales. Promoción de cursos bonificables FUNDAE (Excel, Power BI, Python). Base de datos segmentada: 200 empresas del sector tech con más de 10 empleados. Email personalizado por nombre de empresa. Incluye calculadora de bonificación FUNDAE. Próximo lanzamiento en marzo 2025.",
    start_date: "2025-03-01",
    end_date: "2025-05-31",
    budget: 300,
    spent: 0,
    objectives: {
      target_leads: 40,
      target_enrollments: 15
    },
    metrics: {
      total_leads: 0,
      total_enrollments: 0,
      conversion_rate: 0,
      cost_per_lead: 0,
      cost_per_enrollment: 0
    },
    utm_params: {
      utm_source: "mailchimp",
      utm_medium: "email",
      utm_campaign: "fundae-tech",
      utm_content: "b2b-cold"
    },
    courses: [
      {
        id: "CURSO009",
        name: "Excel Avanzado para Empresas",
        code: "EXCEL-ADV-EMP"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    created_by: "Pedro Sánchez Díaz",
    created_at: "2025-02-10"
  },
  {
    id: "CAMP009",
    name: "Retargeting - Abandonos Carrito Matrícula",
    code: "RETARGET-CART-ABANDON",
    type: "paid_ads",
    status: "active",
    description: "Campaña de retargeting en Meta Ads (Facebook + Instagram) dirigida a usuarios que iniciaron proceso de matrícula pero no completaron pago. Audiencia custom de píxel de Meta. Creatividades con incentivo: 10% descuento por finalizar matrícula en 48h. Secuencia de 3 impactos en 7 días. ROI esperado: 300%.",
    start_date: "2025-02-05",
    end_date: "2025-12-31",
    budget: 1200,
    spent: 380,
    objectives: {
      target_leads: 0,
      target_enrollments: 35
    },
    metrics: {
      total_leads: 0,
      total_enrollments: 18,
      conversion_rate: 0,
      cost_per_lead: 0,
      cost_per_enrollment: 21.11
    },
    utm_params: {
      utm_source: "meta",
      utm_medium: "retargeting",
      utm_campaign: "cart-abandon",
      utm_content: "discount-10pct"
    },
    courses: [], // Aplica a todos
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
      },
      {
        id: "C003",
        name: "CEP Sur",
        code: "SUR"
      }
    ],
    created_by: "Laura Martínez Sosa",
    created_at: "2025-01-28"
  },
  {
    id: "CAMP010",
    name: "LinkedIn Organic - Thought Leadership IT",
    code: "LINKEDIN-IT-ORGANIC",
    type: "organic",
    status: "completed",
    description: "Estrategia de contenido orgánico en LinkedIn para posicionar a CEP como referente en formación IT. Publicaciones semanales con artículos técnicos, casos de éxito de alumnos empleados tras cursos, tendencias del sector. Engagement con comunidad IT local. Objetivo: generar autoridad de marca y leads cualificados de alto valor (empresas grandes).",
    start_date: "2024-12-01",
    end_date: "2025-01-31",
    budget: 100,
    spent: 100,
    objectives: {
      target_leads: 25,
      target_enrollments: 8
    },
    metrics: {
      total_leads: 31,
      total_enrollments: 10,
      conversion_rate: 32.26,
      cost_per_lead: 3.23,
      cost_per_enrollment: 10.00
    },
    utm_params: {
      utm_source: "linkedin",
      utm_medium: "organic",
      utm_campaign: "it-thought-leadership",
      utm_content: "article-post"
    },
    courses: [
      {
        id: "CURSO004",
        name: "Desarrollo Frontend con React",
        code: "REACT-2025"
      },
      {
        id: "CURSO005",
        name: "Backend con Node.js y PostgreSQL",
        code: "NODE-PSQL"
      },
      {
        id: "CURSO006",
        name: "Redes Cisco CCNA",
        code: "CCNA-2025"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    created_by: "Carlos Rodríguez Martínez",
    created_at: "2024-11-25"
  }
]
```

---

## 📋 FASE 2: Crear CampaignsPage.tsx (30 min)

### Archivo: `src/pages/CampaignsPage.tsx`

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Edit,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar
} from "lucide-react"
import { CampaignDialog } from "@/components/dialogs/CampaignDialog"
import { campaignsData } from "@/data/mockData"

export function CampaignsPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [selected, setSelected] = useState<typeof campaignsData[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const handleAdd = () => {
    setDialogMode('create')
    setSelected(null)
    setShowDialog(true)
  }

  const handleEdit = (campaign: typeof campaignsData[0]) => {
    setDialogMode('edit')
    setSelected(campaign)
    setShowDialog(true)
  }

  // Filtrado
  const filteredCampaigns = campaignsData.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || campaign.type === filterType
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'email': 'Email',
      'social': 'Social Media',
      'paid_ads': 'Paid Ads',
      'organic': 'Orgánico',
      'event': 'Evento',
      'referral': 'Referencias'
    }
    return labels[type] || type
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'draft': 'secondary',
      'active': 'default',
      'paused': 'outline',
      'completed': 'secondary'
    }
    return colors[status] || 'secondary'
  }

  // Calcular totales
  const totalBudget = campaignsData.reduce((acc, c) => acc + c.budget, 0)
  const totalSpent = campaignsData.reduce((acc, c) => acc + c.spent, 0)
  const totalLeads = campaignsData.reduce((acc, c) => acc + c.metrics.total_leads, 0)
  const totalEnrollments = campaignsData.reduce((acc, c) => acc + c.metrics.total_enrollments, 0)
  const avgConversionRate = campaignsData.reduce((acc, c) => acc + c.metrics.conversion_rate, 0) / campaignsData.length
  const avgCostPerLead = totalLeads > 0 ? totalSpent / totalLeads : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campañas de Marketing</h1>
          <p className="text-muted-foreground">
            Gestión y análisis de rendimiento de campañas
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Campaña
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBudget.toLocaleString('es-ES')}€</div>
            <p className="text-xs text-muted-foreground">
              Gastado: {totalSpent.toLocaleString('es-ES')}€ ({Math.round((totalSpent / totalBudget) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Coste por lead: {avgCostPerLead.toFixed(2)}€
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matriculados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              De {totalLeads} leads generados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversión Media</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Promedio de todas las campañas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
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
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="paid_ads">Paid Ads</SelectItem>
                <SelectItem value="organic">Orgánico</SelectItem>
                <SelectItem value="event">Evento</SelectItem>
                <SelectItem value="referral">Referencias</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="paused">Pausadas</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Campañas */}
      <Card>
        <CardHeader>
          <CardTitle>Todas las Campañas ({filteredCampaigns.length})</CardTitle>
          <CardDescription>
            Gestión completa de campañas de marketing con métricas en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaña</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead className="text-right">Presupuesto</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Matriculados</TableHead>
                <TableHead className="text-right">Conversión</TableHead>
                <TableHead className="text-right">CPL</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(campaign.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(campaign.status) as any} className="text-xs">
                      {campaign.status === 'active' && 'Activa'}
                      {campaign.status === 'paused' && 'Pausada'}
                      {campaign.status === 'completed' && 'Completada'}
                      {campaign.status === 'draft' && 'Borrador'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(campaign.start_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        {' - '}
                        {new Date(campaign.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="text-sm font-medium">{campaign.budget.toLocaleString('es-ES')}€</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.spent.toLocaleString('es-ES')}€ ({Math.round((campaign.spent / campaign.budget) * 100)}%)
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="text-sm font-medium">{campaign.metrics.total_leads}</p>
                      <p className="text-xs text-muted-foreground">
                        obj: {campaign.objectives.target_leads}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="text-sm font-medium">{campaign.metrics.total_enrollments}</p>
                      <p className="text-xs text-muted-foreground">
                        obj: {campaign.objectives.target_enrollments}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm font-medium">
                        {campaign.metrics.conversion_rate.toFixed(1)}%
                      </span>
                      {campaign.metrics.conversion_rate > 15 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-orange-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm">
                      {campaign.metrics.cost_per_lead > 0
                        ? `${campaign.metrics.cost_per_lead.toFixed(2)}€`
                        : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <CampaignDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode={dialogMode}
        campaign={selected || undefined}
      />
    </div>
  )
}
```

---

## 📋 FASE 3: Crear CampaignDialog.tsx (35 min)

### Archivo: `src/components/dialogs/CampaignDialog.tsx`

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
import { cn } from "@/lib/utils"
import {
  Trash,
  TrendingUp,
  DollarSign,
  Users,
  Target
} from "lucide-react"
import { campaignsData, coursesData, campusesData, type Campaign } from "@/data/mockData"

interface CampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  campaign?: Campaign
}

export function CampaignDialog({ open, onOpenChange, mode, campaign }: CampaignDialogProps) {
  const isEdit = mode === 'edit'

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    code: campaign?.code || '',
    type: campaign?.type || 'paid_ads',
    status: campaign?.status || 'draft',
    description: campaign?.description || '',
    start_date: campaign?.start_date || '',
    end_date: campaign?.end_date || '',
    budget: campaign?.budget || 0,
    spent: campaign?.spent || 0,
    target_leads: campaign?.objectives.target_leads || 0,
    target_enrollments: campaign?.objectives.target_enrollments || 0,
    utm_source: campaign?.utm_params.utm_source || '',
    utm_medium: campaign?.utm_params.utm_medium || '',
    utm_campaign: campaign?.utm_params.utm_campaign || '',
    utm_term: campaign?.utm_params.utm_term || '',
    utm_content: campaign?.utm_params.utm_content || '',
    course_ids: campaign?.courses?.map(c => c.id) || [],
    campus_ids: campaign?.campuses?.map(c => c.id) || []
  })

  const handleSave = () => {
    console.log('Guardar campaña (MOCKUP):', formData)
    onOpenChange(false)
  }

  const handleDelete = () => {
    console.log('Eliminar campaña (MOCKUP):', campaign?.id)
    onOpenChange(false)
  }

  const toggleCourse = (courseId: string) => {
    setFormData({
      ...formData,
      course_ids: formData.course_ids.includes(courseId)
        ? formData.course_ids.filter(id => id !== courseId)
        : [...formData.course_ids, courseId]
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
            {isEdit ? 'Editar Campaña' : 'Crear Nueva Campaña'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
            <TabsTrigger value="cursos">Cursos y Sedes</TabsTrigger>
          </TabsList>

          {/* TAB 1: GENERAL */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Campaña *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Lanzamiento Cursos Marketing Digital 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ej: MKT-LAUNCH-2025-Q1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Campaña *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="paid_ads">Paid Ads (Meta/Google)</SelectItem>
                    <SelectItem value="organic">Orgánico</SelectItem>
                    <SelectItem value="event">Evento/Webinar</SelectItem>
                    <SelectItem value="referral">Programa de Referencias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="paused">Pausada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Fecha de Inicio *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Fecha de Fin *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto Total (€) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  placeholder="3500"
                />
              </div>

              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="spent">Gastado (€) - Solo lectura</Label>
                  <Input
                    id="spent"
                    type="number"
                    value={formData.spent}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}
            </div>

            {/* Descripción - OBLIGATORIA */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción de la Campaña * (OBLIGATORIA)</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe los objetivos, público objetivo, estrategia, canales utilizados y expectativas de la campaña..."
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 100 caracteres recomendado. Incluye público objetivo y estrategia.
              </p>
            </div>
          </TabsContent>

          {/* TAB 2: CONFIGURACIÓN */}
          <TabsContent value="configuracion" className="space-y-4">
            {/* Objetivos */}
            <div className="space-y-3">
              <Label>Objetivos de la Campaña</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="target_leads">Leads Objetivo *</Label>
                  <Input
                    id="target_leads"
                    type="number"
                    value={formData.target_leads}
                    onChange={(e) => setFormData({ ...formData, target_leads: parseInt(e.target.value) || 0 })}
                    placeholder="150"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_enrollments">Matriculaciones Objetivo *</Label>
                  <Input
                    id="target_enrollments"
                    type="number"
                    value={formData.target_enrollments}
                    onChange={(e) => setFormData({ ...formData, target_enrollments: parseInt(e.target.value) || 0 })}
                    placeholder="25"
                  />
                </div>
              </div>
            </div>

            {/* Parámetros UTM */}
            <div className="space-y-3 border-t pt-4">
              <Label>Parámetros UTM (Tracking)</Label>
              <p className="text-xs text-muted-foreground">
                Configuración de parámetros para seguimiento de tráfico en Google Analytics
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="utm_source">UTM Source *</Label>
                  <Input
                    id="utm_source"
                    value={formData.utm_source}
                    onChange={(e) => setFormData({ ...formData, utm_source: e.target.value })}
                    placeholder="Ej: meta, google, mailchimp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_medium">UTM Medium *</Label>
                  <Input
                    id="utm_medium"
                    value={formData.utm_medium}
                    onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value })}
                    placeholder="Ej: cpc, email, organic"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_campaign">UTM Campaign *</Label>
                  <Input
                    id="utm_campaign"
                    value={formData.utm_campaign}
                    onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value })}
                    placeholder="Ej: mkt-launch-2025-q1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_term">UTM Term (opcional)</Label>
                  <Input
                    id="utm_term"
                    value={formData.utm_term}
                    onChange={(e) => setFormData({ ...formData, utm_term: e.target.value })}
                    placeholder="Ej: certificacion-ccna"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="utm_content">UTM Content (opcional)</Label>
                  <Input
                    id="utm_content"
                    value={formData.utm_content}
                    onChange={(e) => setFormData({ ...formData, utm_content: e.target.value })}
                    placeholder="Ej: carousel-testimonials, video-ad"
                  />
                </div>
              </div>

              {/* Preview URL */}
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs font-medium mb-1">Vista Previa URL de Tracking:</p>
                <code className="text-xs break-all">
                  https://cepcomunicacion.com/?utm_source={formData.utm_source || 'SOURCE'}&utm_medium={formData.utm_medium || 'MEDIUM'}&utm_campaign={formData.utm_campaign || 'CAMPAIGN'}
                  {formData.utm_term && `&utm_term=${formData.utm_term}`}
                  {formData.utm_content && `&utm_content=${formData.utm_content}`}
                </code>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: MÉTRICAS */}
          <TabsContent value="metricas" className="space-y-4">
            {isEdit && campaign ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Total Leads */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{campaign.metrics.total_leads}</div>
                      <p className="text-xs text-muted-foreground">
                        Objetivo: {campaign.objectives.target_leads} ({Math.round((campaign.metrics.total_leads / campaign.objectives.target_leads) * 100)}% alcanzado)
                      </p>
                    </CardContent>
                  </Card>

                  {/* Total Matriculaciones */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Matriculaciones</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{campaign.metrics.total_enrollments}</div>
                      <p className="text-xs text-muted-foreground">
                        Objetivo: {campaign.objectives.target_enrollments} ({Math.round((campaign.metrics.total_enrollments / campaign.objectives.target_enrollments) * 100)}% alcanzado)
                      </p>
                    </CardContent>
                  </Card>

                  {/* Tasa de Conversión */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{campaign.metrics.conversion_rate.toFixed(2)}%</div>
                      <p className="text-xs text-muted-foreground">
                        {campaign.metrics.conversion_rate > 15 ? 'Excelente rendimiento' : 'Por debajo del objetivo (15%)'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Coste por Lead */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Coste por Lead</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{campaign.metrics.cost_per_lead.toFixed(2)}€</div>
                      <p className="text-xs text-muted-foreground">
                        CPE: {campaign.metrics.cost_per_enrollment.toFixed(2)}€
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Presupuesto */}
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Presupuesto y Gasto</span>
                    <Badge variant={campaign.spent > campaign.budget ? 'destructive' : 'default'}>
                      {Math.round((campaign.spent / campaign.budget) * 100)}% utilizado
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        campaign.spent > campaign.budget ? "bg-destructive" : "bg-primary"
                      )}
                      style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Gastado: {campaign.spent.toLocaleString('es-ES')}€</span>
                    <span>Presupuesto: {campaign.budget.toLocaleString('es-ES')}€</span>
                  </div>
                </div>

                {/* ROI Estimado */}
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">ROI Estimado</p>
                  <p className="text-xs text-muted-foreground">
                    Asumiendo precio medio de 800€ por matrícula:
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs">
                      Ingresos estimados: {(campaign.metrics.total_enrollments * 800).toLocaleString('es-ES')}€
                    </p>
                    <p className="text-xs">
                      Gasto: {campaign.spent.toLocaleString('es-ES')}€
                    </p>
                    <p className="text-sm font-medium mt-2">
                      ROI: {(((campaign.metrics.total_enrollments * 800 - campaign.spent) / campaign.spent) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Las métricas estarán disponibles una vez creada la campaña</p>
              </div>
            )}
          </TabsContent>

          {/* TAB 4: CURSOS Y SEDES */}
          <TabsContent value="cursos" className="space-y-6">
            {/* Cursos */}
            <div className="space-y-3">
              <Label>Cursos Asociados ({formData.course_ids.length})</Label>
              <p className="text-xs text-muted-foreground">
                Selecciona los cursos que se promocionan en esta campaña
              </p>
              <div className="grid gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {coursesData.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => toggleCourse(course.id)}
                  >
                    <Checkbox
                      checked={formData.course_ids.includes(course.id)}
                      onCheckedChange={() => toggleCourse(course.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.code}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {course.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Sedes */}
            <div className="space-y-3">
              <Label>Sedes de Impartición ({formData.campus_ids.length})</Label>
              <p className="text-xs text-muted-foreground">
                Selecciona las sedes donde se impartirán los cursos promocionados
              </p>
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
                {isEdit ? 'Guardar Cambios' : 'Crear Campaña'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Importar Card components necesarios
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

---

## 📋 FASE 4: Crear SettingsPage.tsx (25 min)

### Archivo: `src/pages/SettingsPage.tsx`

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
import { Switch } from "@/components/ui/switch"
import {
  Building2,
  Bell,
  Plug,
  Shield,
  Save
} from "lucide-react"

export function SettingsPage() {
  // Estados para configuración general
  const [generalSettings, setGeneralSettings] = useState({
    centerName: 'CEP Comunicación',
    centerDescription: 'Centro de Estudios Profesionales especializado en formación en comunicación, marketing digital y desarrollo web. Más de 15 años formando profesionales en Tenerife.',
    email: 'info@cepcomunicacion.com',
    phone: '+34 922 123 456',
    website: 'https://www.cepcomunicacion.com',
    address: 'Calle Principal 123, Santa Cruz de Tenerife',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6'
  })

  // Estados para notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewLead: true,
    emailNewEnrollment: true,
    emailCampaignComplete: false,
    smsNewLead: false,
    smsEnrollmentReminder: true,
    pushBrowserEnabled: true
  })

  // Estados para integraciones
  const [integrationSettings, setIntegrationSettings] = useState({
    metaAdsEnabled: true,
    metaAdsAccessToken: '••••••••••••••••',
    metaAdsPixelId: '123456789012345',
    mailchimpEnabled: true,
    mailchimpApiKey: '••••••••••••••••',
    mailchimpListId: 'abc123def456',
    whatsappEnabled: false,
    whatsappPhoneId: '',
    whatsappToken: '',
    gaEnabled: true,
    gaTrackingId: 'G-XXXXXXXXXX'
  })

  // Estados para seguridad
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    twoFactorEnabled: false
  })

  const handleSaveGeneral = () => {
    console.log('Guardar configuración general (MOCKUP):', generalSettings)
  }

  const handleSaveNotifications = () => {
    console.log('Guardar configuración de notificaciones (MOCKUP):', notificationSettings)
  }

  const handleSaveIntegrations = () => {
    console.log('Guardar configuración de integraciones (MOCKUP):', integrationSettings)
  }

  const handleSaveSecurity = () => {
    console.log('Guardar configuración de seguridad (MOCKUP):', securitySettings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona la configuración general del sistema
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="h-4 w-4 mr-2" />
            Integraciones
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: GENERAL */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Información General del Centro</CardTitle>
              <CardDescription>
                Configuración básica que aparecerá en toda la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="centerName">Nombre del Centro *</Label>
                  <Input
                    id="centerName"
                    value={generalSettings.centerName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, centerName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contacto *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web *</Label>
                  <Input
                    id="website"
                    type="url"
                    value={generalSettings.website}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="centerDescription">Descripción del Centro *</Label>
                <Textarea
                  id="centerDescription"
                  rows={4}
                  value={generalSettings.centerDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, centerDescription: e.target.value })}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección Principal *</Label>
                <Input
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Color Primario</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={generalSettings.primaryColor}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, primaryColor: e.target.value })}
                      className="w-20"
                    />
                    <Input
                      value={generalSettings.primaryColor}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, primaryColor: e.target.value })}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Color Secundario</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={generalSettings.secondaryColor}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, secondaryColor: e.target.value })}
                      className="w-20"
                    />
                    <Input
                      value={generalSettings.secondaryColor}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, secondaryColor: e.target.value })}
                      placeholder="#8b5cf6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveGeneral}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración General
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: NOTIFICACIONES */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>
                Gestiona cómo y cuándo recibes notificaciones del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notificaciones por Email</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevo Lead Capturado</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe un email cada vez que se captura un nuevo lead
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNewLead}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNewLead: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nueva Matriculación</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe un email cuando un alumno se matricula
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNewEnrollment}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNewEnrollment: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Campaña Finalizada</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe un resumen cuando una campaña llega a su fecha de fin
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailCampaignComplete}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailCampaignComplete: checked })}
                  />
                </div>
              </div>

              {/* SMS */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium">Notificaciones por SMS</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevo Lead Prioritario</Label>
                    <p className="text-xs text-muted-foreground">
                      SMS para leads de campañas de alto presupuesto
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNewLead}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNewLead: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorio de Matrícula</Label>
                    <p className="text-xs text-muted-foreground">
                      SMS recordatorio 24h antes del cierre de matrícula
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsEnrollmentReminder}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsEnrollmentReminder: checked })}
                  />
                </div>
              </div>

              {/* Push */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium">Notificaciones Push (Navegador)</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Habilitar Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe notificaciones en tiempo real en el navegador
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushBrowserEnabled}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushBrowserEnabled: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Notificaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: INTEGRACIONES */}
        <TabsContent value="integrations">
          <div className="space-y-4">
            {/* Meta Ads */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Meta Ads (Facebook & Instagram)</CardTitle>
                    <CardDescription>
                      Integración con Meta Business Suite para captura de leads
                    </CardDescription>
                  </div>
                  <Switch
                    checked={integrationSettings.metaAdsEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, metaAdsEnabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="metaToken">Access Token</Label>
                    <Input
                      id="metaToken"
                      type="password"
                      value={integrationSettings.metaAdsAccessToken}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, metaAdsAccessToken: e.target.value })}
                      disabled={!integrationSettings.metaAdsEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaPixel">Pixel ID</Label>
                    <Input
                      id="metaPixel"
                      value={integrationSettings.metaAdsPixelId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, metaAdsPixelId: e.target.value })}
                      disabled={!integrationSettings.metaAdsEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mailchimp */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mailchimp</CardTitle>
                    <CardDescription>
                      Email marketing y automatizaciones
                    </CardDescription>
                  </div>
                  <Switch
                    checked={integrationSettings.mailchimpEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, mailchimpEnabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mailchimpKey">API Key</Label>
                    <Input
                      id="mailchimpKey"
                      type="password"
                      value={integrationSettings.mailchimpApiKey}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, mailchimpApiKey: e.target.value })}
                      disabled={!integrationSettings.mailchimpEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mailchimpList">List ID</Label>
                    <Input
                      id="mailchimpList"
                      value={integrationSettings.mailchimpListId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, mailchimpListId: e.target.value })}
                      disabled={!integrationSettings.mailchimpEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>WhatsApp Cloud API</CardTitle>
                    <CardDescription>
                      Mensajería automatizada por WhatsApp
                    </CardDescription>
                  </div>
                  <Switch
                    checked={integrationSettings.whatsappEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, whatsappEnabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappPhone">Phone Number ID</Label>
                    <Input
                      id="whatsappPhone"
                      value={integrationSettings.whatsappPhoneId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, whatsappPhoneId: e.target.value })}
                      disabled={!integrationSettings.whatsappEnabled}
                      placeholder="123456789012345"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappToken">Access Token</Label>
                    <Input
                      id="whatsappToken"
                      type="password"
                      value={integrationSettings.whatsappToken}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, whatsappToken: e.target.value })}
                      disabled={!integrationSettings.whatsappEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Analytics */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Google Analytics 4</CardTitle>
                    <CardDescription>
                      Analítica web y seguimiento de conversiones
                    </CardDescription>
                  </div>
                  <Switch
                    checked={integrationSettings.gaEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, gaEnabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gaId">Tracking ID (G-XXXXXXXXXX)</Label>
                  <Input
                    id="gaId"
                    value={integrationSettings.gaTrackingId}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, gaTrackingId: e.target.value })}
                    disabled={!integrationSettings.gaEnabled}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveIntegrations}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Integraciones
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: SEGURIDAD */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>
                Políticas de contraseñas y seguridad de sesiones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Políticas de Contraseña */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Políticas de Contraseña</h3>

                <div className="space-y-2">
                  <Label htmlFor="passwordLength">Longitud Mínima</Label>
                  <Select
                    value={securitySettings.passwordMinLength.toString()}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 caracteres</SelectItem>
                      <SelectItem value="8">8 caracteres (recomendado)</SelectItem>
                      <SelectItem value="10">10 caracteres</SelectItem>
                      <SelectItem value="12">12 caracteres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requireUppercase"
                      checked={securitySettings.passwordRequireUppercase}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireUppercase: checked as boolean })}
                    />
                    <Label htmlFor="requireUppercase" className="cursor-pointer">
                      Requerir al menos una mayúscula
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requireNumbers"
                      checked={securitySettings.passwordRequireNumbers}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireNumbers: checked as boolean })}
                    />
                    <Label htmlFor="requireNumbers" className="cursor-pointer">
                      Requerir al menos un número
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requireSpecial"
                      checked={securitySettings.passwordRequireSpecial}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireSpecial: checked as boolean })}
                    />
                    <Label htmlFor="requireSpecial" className="cursor-pointer">
                      Requerir caracteres especiales (!@#$%^&*)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Sesiones */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium">Gestión de Sesiones</h3>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sesión (minutos)</Label>
                  <Select
                    value={securitySettings.sessionTimeout.toString()}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">60 minutos (recomendado)</SelectItem>
                      <SelectItem value="120">120 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Máximo Intentos de Login</Label>
                  <Select
                    value={securitySettings.maxLoginAttempts.toString()}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 intentos</SelectItem>
                      <SelectItem value="5">5 intentos (recomendado)</SelectItem>
                      <SelectItem value="10">10 intentos</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Después de este número de intentos fallidos, la cuenta se bloqueará temporalmente
                  </p>
                </div>
              </div>

              {/* Autenticación de Dos Factores */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium">Autenticación de Dos Factores</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Habilitar 2FA (Próximamente)</Label>
                    <p className="text-xs text-muted-foreground">
                      Requiere código de verificación por SMS o app
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })}
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSecurity}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración de Seguridad
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## 📋 FASE 5: Crear UserProfilePage.tsx + UserProfileDialog.tsx (20 min)

### Archivo: `src/pages/UserProfilePage.tsx`

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
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Shield
} from "lucide-react"
import { UserProfileDialog } from "@/components/dialogs/UserProfileDialog"
import { currentUserProfile } from "@/data/mockData"

export function UserProfilePage() {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y preferencias
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar Perfil
        </Button>
      </div>

      {/* Perfil Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentUserProfile.photo} />
              <AvatarFallback className="text-2xl">
                {currentUserProfile.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {currentUserProfile.first_name} {currentUserProfile.last_name}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {currentUserProfile.role}
              </CardDescription>
              <div className="flex gap-2 mt-2">
                <Badge variant="default">Activo</Badge>
                {currentUserProfile.role === 'Admin' && (
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    Administrador
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{currentUserProfile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Teléfono</p>
                <p className="text-sm text-muted-foreground">{currentUserProfile.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Departamento</p>
                <p className="text-sm text-muted-foreground">{currentUserProfile.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Fecha de Registro</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(currentUserProfile.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biografía */}
        <Card>
          <CardHeader>
            <CardTitle>Biografía</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {currentUserProfile.bio}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <CardDescription>
            Configuración de idioma y notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Idioma</p>
              <p className="text-sm text-muted-foreground">Español (España)</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Zona Horaria</p>
              <p className="text-sm text-muted-foreground">UTC+1 (Canarias)</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notificaciones por Email</p>
              <p className="text-sm text-muted-foreground">Habilitadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <UserProfileDialog
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </div>
  )
}
```

### Archivo: `src/components/dialogs/UserProfileDialog.tsx`

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
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Upload,
  Save
} from "lucide-react"
import { currentUserProfile } from "@/data/mockData"

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
  const [formData, setFormData] = useState({
    first_name: currentUserProfile.first_name,
    last_name: currentUserProfile.last_name,
    email: currentUserProfile.email,
    phone: currentUserProfile.phone,
    bio: currentUserProfile.bio,
    photo: currentUserProfile.photo,
    language: 'es',
    timezone: 'UTC+1',
    emailNotifications: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSave = () => {
    console.log('Guardar perfil (MOCKUP):', formData)
    onOpenChange(false)
  }

  const handlePhotoUpload = () => {
    console.log('Cargar foto (MOCKUP)')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Mi Perfil</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          </TabsList>

          {/* TAB 1: INFORMACIÓN PERSONAL */}
          <TabsContent value="personal" className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.photo} />
                <AvatarFallback className="text-lg">
                  {formData.first_name[0]}{formData.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handlePhotoUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Cambiar Foto
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Apellidos *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Biografía - OBLIGATORIA */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía * (OBLIGATORIA)</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Describe brevemente tu experiencia profesional, especialidades y responsabilidades..."
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 50 caracteres. Será visible para otros usuarios del sistema.
              </p>
            </div>
          </TabsContent>

          {/* TAB 2: SEGURIDAD */}
          <TabsContent value="security" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deja los campos vacíos si no deseas cambiar la contraseña
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="••••••••"
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres, incluye mayúsculas, números y caracteres especiales
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="text-sm text-destructive">Las contraseñas no coinciden</p>
            )}
          </TabsContent>

          {/* TAB 3: PREFERENCIAS */}
          <TabsContent value="preferences" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español (España)</SelectItem>
                    <SelectItem value="en">English (UK)</SelectItem>
                    <SelectItem value="ca">Català</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC+1">UTC+1 (Canarias)</SelectItem>
                    <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                    <SelectItem value="UTC+2">UTC+2 (CEST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label>Notificaciones por Email</Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe actualizaciones importantes por correo
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## ✅ VERIFICACIÓN FINAL

### Archivos creados (7 nuevos):
1. ✅ Mock Data expandido (campaignsData con 10 campañas)
2. ✅ CampaignsPage.tsx (tabla con métricas y filtros)
3. ✅ CampaignDialog.tsx (4 tabs con UTM tracking)
4. ✅ SettingsPage.tsx (4 tabs inline sin dialog)
5. ✅ UserProfilePage.tsx (perfil del usuario actual)
6. ✅ UserProfileDialog.tsx (3 tabs para edición)

---

## 🎯 RESUMEN EJECUTIVO

### Lo que acabas de implementar:

**3 Secciones Finales del Dashboard**

#### CAMPAÑAS (Marketing Analytics):
- 10 campañas de ejemplo con métricas reales
- Tabla con filtros (tipo, estado, búsqueda)
- Stats cards (presupuesto, leads, conversión, CPL)
- CampaignDialog con 4 tabs:
  - General (info básica, descripción OBLIGATORIA)
  - Configuración (objetivos, UTM tracking con preview)
  - Métricas (visualización de rendimiento, ROI)
  - Cursos y Sedes (multi-select)

#### CONFIGURACIÓN (Settings):
- Tabs inline (NO dialog separado)
- 4 secciones:
  - General (info centro, colores)
  - Notificaciones (email, SMS, push)
  - Integraciones (Meta Ads, Mailchimp, WhatsApp, GA4)
  - Seguridad (políticas contraseña, sesiones, 2FA)

#### PERFIL USUARIO (User Profile):
- Vista de perfil con avatar grande
- UserProfileDialog con 3 tabs:
  - Información Personal (biografía OBLIGATORIA, upload avatar)
  - Seguridad (cambio contraseña)
  - Preferencias (idioma, zona horaria, notificaciones)

---

## 📊 Líneas de Código Generadas:

- **FASE 1 (Mock Data Campañas):** ~700 líneas
- **FASE 2 (CampaignsPage):** ~420 líneas
- **FASE 3 (CampaignDialog):** ~620 líneas
- **FASE 4 (SettingsPage):** ~680 líneas
- **FASE 5 (UserProfile + Dialog):** ~450 líneas
- **TOTAL:** ~2,870 líneas

---

## 🚀 SIGUIENTE PASO

**DASHBOARD 100% COMPLETO** ✅

Una vez ejecutado este prompt:
- ✅ 10 secciones implementadas
- ✅ Todas las páginas con mockup visual
- ✅ Todos los dialogs siguiendo el patrón establecido
- ✅ Descripción/Biografía OBLIGATORIA en todas las entidades
- ✅ Listas dinámicas en lugar de checkboxes fijos
- ✅ Delete button dentro de dialogs

**Dashboard Completado:**
1. ✅ Profesores (PARTE 1)
2. ✅ Aulas (PARTE 1)
3. ✅ Alumnos (PARTE 2)
4. ✅ Personal Administrativo (PARTE 2)
5. ✅ Sedes (PARTE 2B)
6. ✅ Ciclos (PARTE 2B)
7. ✅ Cursos (STANDALONE)
8. **✅ Campañas (PARTE FINAL)**
9. **✅ Configuración (PARTE FINAL)**
10. **✅ Perfil Usuario (PARTE FINAL)**

---

**PROMPT LISTO PARA EJECUTAR EN CLAUDE CODE WEB** ✅

Copiar este archivo completo y pegarlo en Claude Code Web para implementar las 3 secciones finales.

---

**Creado:** 2025-11-11
**Proyecto:** CEP Comunicación Dashboard Mockup
**Sección:** Parte Final (Campañas, Configuración, Perfil)
**Versión:** Completo v1.0
