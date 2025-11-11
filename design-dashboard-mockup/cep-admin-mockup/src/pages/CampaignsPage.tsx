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
      'borrador': 'secondary',
      'activa': 'default',
      'pausada': 'outline',
      'finalizada': 'secondary'
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
                <SelectItem value="activa">Activas</SelectItem>
                <SelectItem value="pausada">Pausadas</SelectItem>
                <SelectItem value="finalizada">Completadas</SelectItem>
                <SelectItem value="borrador">Borradores</SelectItem>
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
                      {campaign.status === 'activa' && 'Activa'}
                      {campaign.status === 'pausada' && 'Pausada'}
                      {campaign.status === 'finalizada' && 'Completada'}
                      {campaign.status === 'borrador' && 'Borrador'}
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
