import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  GraduationCap,
  Building2,
  PieChart,
} from "lucide-react"
import { dashboardMetrics, convocations, campaigns } from "@/data/mockData"
import { Badge } from "@/components/ui/badge"

export function DashboardPage() {
  const metrics = dashboardMetrics

  const kpiCards = [
    {
      title: "Cursos Activos",
      value: metrics.active_courses,
      total: metrics.total_courses,
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Alumnos",
      value: metrics.active_students,
      total: metrics.total_students,
      icon: GraduationCap,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Leads este Mes",
      value: metrics.leads_this_month,
      total: metrics.total_leads,
      icon: FileText,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Tasa de Conversión",
      value: `${metrics.conversion_rate}%`,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Ingresos Totales",
      value: `${(metrics.total_revenue / 1000).toFixed(0)}k €`,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Convocatorias Activas",
      value: metrics.active_convocations,
      icon: Calendar,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      title: "Profesores",
      value: metrics.total_teachers,
      icon: Users,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      title: "Sedes",
      value: metrics.total_campuses,
      icon: Building2,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "Ocupación Aulas",
      value: `${metrics.classroom_utilization}%`,
      icon: PieChart,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      abierta: "default",
      planificada: "secondary",
      lista_espera: "outline",
      cerrada: "destructive",
    }
    return variants[status] || "default"
  }

  const getCampaignStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      activa: "default",
      pausada: "secondary",
      finalizada: "destructive",
    }
    return variants[status] || "default"
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vista general de la operativa de CEP Comunicación
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <div className={`${kpi.bgColor} rounded-full p-2`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                {"total" in kpi && kpi.total && (
                  <p className="text-xs text-muted-foreground">
                    de {kpi.total} totales
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Próximas Convocatorias */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Convocatorias</CardTitle>
            <CardDescription>
              Cursos programados en los próximos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {convocations.slice(0, 5).map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {conv.course_title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conv.campus_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(conv.start_date).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getStatusBadge(conv.status)}>
                      {conv.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {conv.enrolled}/{conv.capacity_max} plazas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campañas Activas */}
        <Card>
          <CardHeader>
            <CardTitle>Campañas de Marketing</CardTitle>
            <CardDescription>
              Rendimiento de campañas publicitarias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {campaign.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.leads_generated} leads • {campaign.conversion_rate}%
                      conversión
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.cost_per_lead.toFixed(2)}€ por lead
                    </p>
                  </div>
                  <Badge variant={getCampaignStatusBadge(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen Rápido */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Actividad</CardTitle>
          <CardDescription>
            Estadísticas clave de operación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Tasa de Ocupación
              </p>
              <p className="text-2xl font-bold">78.5%</p>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "78.5%" }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Ratio Profesor/Alumno
              </p>
              <p className="text-2xl font-bold">
                1:{Math.floor(metrics.total_students / metrics.total_teachers)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Ingresos por Alumno
              </p>
              <p className="text-2xl font-bold">
                {Math.floor(metrics.total_revenue / metrics.total_students)}€
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Promedio por Sede
              </p>
              <p className="text-2xl font-bold">
                {Math.floor(metrics.total_students / metrics.total_campuses)}{" "}
                alumnos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
