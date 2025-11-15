'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@payload-config/components/ui/card'
import { Button } from '@payload-config/components/ui/button'
import { Input } from '@payload-config/components/ui/input'
import { Label } from '@payload-config/components/ui/label'
import { 
  FileText, 
  User, 
  Calendar,
  Filter,
  Download,
  Search,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  RefreshCw,
  Shield
} from 'lucide-react'

interface ActivityLog {
  id: number
  user: string
  userId: number
  action: string
  entity: string
  entityType: string
  entityId?: number
  timestamp: string
  ip: string
  userAgent: string
  severity: 'info' | 'warning' | 'critical'
  details?: string
}

export default function ActividadPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterUser, setFilterUser] = useState('all')
  const [filterAction, setFilterAction] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Simulated real activity logs - In production, this would come from database
  const [activities] = useState<ActivityLog[]>([
    {
      id: 1,
      user: 'Admin User',
      userId: 1,
      action: 'create',
      entity: 'Marketing Digital Avanzado',
      entityType: 'course',
      entityId: 45,
      timestamp: '2025-01-15 14:32:15',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      severity: 'info',
      details: 'Creó nuevo curso con 12 módulos y 3 convocatorias programadas',
    },
    {
      id: 2,
      user: 'Juan García',
      userId: 2,
      action: 'update',
      entity: 'Community Manager Profesional',
      entityType: 'course',
      entityId: 23,
      timestamp: '2025-01-15 14:25:03',
      ip: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'info',
      details: 'Actualizó descripción y precio del curso',
    },
    {
      id: 3,
      user: 'María López',
      userId: 3,
      action: 'delete',
      entity: 'Campaña Facebook Q1 2025',
      entityType: 'campaign',
      entityId: 12,
      timestamp: '2025-01-15 13:58:47',
      ip: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)',
      severity: 'warning',
      details: 'Eliminó campaña con 145 leads asociados (datos exportados previamente)',
    },
    {
      id: 4,
      user: 'Admin User',
      userId: 1,
      action: 'update',
      entity: 'Configuración General',
      entityType: 'config',
      timestamp: '2025-01-15 12:15:22',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      severity: 'critical',
      details: 'Modificó API keys de Facebook Pixel y Google Analytics',
    },
    {
      id: 5,
      user: 'Juan García',
      userId: 2,
      action: 'create',
      entity: 'Pedro Martínez (Profesor)',
      entityType: 'staff',
      entityId: 8,
      timestamp: '2025-01-15 11:45:33',
      ip: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'info',
      details: 'Añadió nuevo profesor con especialidad en Marketing Digital',
    },
    {
      id: 6,
      user: 'María López',
      userId: 3,
      action: 'create',
      entity: 'Lead: Ana García Pérez',
      entityType: 'lead',
      entityId: 234,
      timestamp: '2025-01-15 10:30:18',
      ip: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)',
      severity: 'info',
      details: 'Nuevo lead desde formulario web - Curso: Marketing Digital',
    },
    {
      id: 7,
      user: 'Admin User',
      userId: 1,
      action: 'update',
      entity: 'Roles y Permisos - Gestor',
      entityType: 'role',
      timestamp: '2025-01-15 09:15:44',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      severity: 'critical',
      details: 'Modificó permisos del rol Gestor: añadió acceso a configuración de APIs',
    },
    {
      id: 8,
      user: 'Juan García',
      userId: 2,
      action: 'view',
      entity: 'Dashboard Principal',
      entityType: 'dashboard',
      timestamp: '2025-01-15 08:30:12',
      ip: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'info',
      details: 'Accedió al dashboard con métricas generales',
    },
  ])

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="h-4 w-4" />
      case 'update': return <Edit className="h-4 w-4" />
      case 'delete': return <Trash2 className="h-4 w-4" />
      case 'view': return <Eye className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'text-success'
      case 'update': return 'text-primary'
      case 'delete': return 'text-destructive'
      case 'view': return 'text-muted-foreground'
      default: return 'text-foreground'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-destructive/10 text-destructive rounded">
            <AlertTriangle className="h-3 w-3" />
            Crítico
          </span>
        )
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-warning/10 text-warning rounded">
            <AlertTriangle className="h-3 w-3" />
            Advertencia
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded">
            <CheckCircle className="h-3 w-3" />
            Info
          </span>
        )
    }
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesUser = filterUser === 'all' || activity.user === filterUser
    const matchesAction = filterAction === 'all' || activity.action === filterAction
    const matchesSeverity = filterSeverity === 'all' || activity.severity === filterSeverity

    return matchesSearch && matchesUser && matchesAction && matchesSeverity
  })

  const uniqueUsers = Array.from(new Set(activities.map(a => a.user)))
  const uniqueActions = Array.from(new Set(activities.map(a => a.action)))

  const handleExport = () => {
    // TODO: Export to CSV/Excel
    console.log('Exporting activity logs:', filteredActivities)
    alert('Exportando registros de actividad...')
  }

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log)
    setShowDetailsModal(true)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Registro de Actividad</h1>
          <p className="text-muted-foreground">Auditoría completa de acciones en el sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Acciones Registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activities.filter(a => a.severity === 'critical').length}</div>
            <p className="text-xs text-muted-foreground">Acciones Críticas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{uniqueUsers.length}</div>
            <p className="text-xs text-muted-foreground">Usuarios Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">Hoy</div>
            <p className="text-xs text-muted-foreground">Última Actualización</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Búsqueda</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-user">Usuario</Label>
              <select
                id="filter-user"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full h-10 px-3 rounded border bg-card"
              >
                <option value="all">Todos</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-action">Acción</Label>
              <select
                id="filter-action"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full h-10 px-3 rounded border bg-card"
              >
                <option value="all">Todas</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action} className="capitalize">{action}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-severity">Severidad</Label>
              <select
                id="filter-severity"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full h-10 px-3 rounded border bg-card"
              >
                <option value="all">Todas</option>
                <option value="info">Info</option>
                <option value="warning">Advertencia</option>
                <option value="critical">Crítico</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Actividad Reciente ({filteredActivities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No se encontraron registros con los filtros aplicados</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(activity)}
                >
                  <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 ${getActionColor(activity.action)}`}>
                    {getActionIcon(activity.action)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium">
                        <span className="text-primary">{activity.user}</span>
                        {' '}
                        <span className="text-muted-foreground capitalize">{activity.action === 'create' ? 'creó' : activity.action === 'update' ? 'modificó' : activity.action === 'delete' ? 'eliminó' : 'visualizó'}</span>
                        {' '}
                        <span className="font-semibold">{activity.entity}</span>
                      </p>
                      {getSeverityBadge(activity.severity)}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {activity.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {activity.ip}
                      </span>
                      <span className="px-2 py-0.5 bg-muted rounded capitalize">
                        {activity.entityType}
                      </span>
                    </div>

                    {activity.details && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                        {activity.details}
                      </p>
                    )}
                  </div>

                  <Button variant="ghost" size="sm" className="shrink-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Detalles de la Actividad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Usuario</Label>
                  <p className="font-medium">{selectedLog.user}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Acción</Label>
                  <p className="font-medium capitalize flex items-center gap-2">
                    {getActionIcon(selectedLog.action)}
                    {selectedLog.action}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Entidad</Label>
                  <p className="font-medium">{selectedLog.entity}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tipo</Label>
                  <p className="font-medium capitalize">{selectedLog.entityType}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Fecha y Hora</Label>
                  <p className="font-medium">{selectedLog.timestamp}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Severidad</Label>
                  <div>{getSeverityBadge(selectedLog.severity)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Dirección IP</Label>
                  <p className="font-mono text-sm">{selectedLog.ip}</p>
                </div>
                {selectedLog.entityId && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">ID de Entidad</Label>
                    <p className="font-mono text-sm">#{selectedLog.entityId}</p>
                  </div>
                )}
              </div>

              {selectedLog.details && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Detalles</Label>
                  <p className="p-3 bg-muted rounded-lg text-sm">{selectedLog.details}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-muted-foreground">User Agent</Label>
                <p className="font-mono text-xs p-3 bg-muted rounded-lg break-all">
                  {selectedLog.userAgent}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setShowDetailsModal(false)}>Cerrar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
