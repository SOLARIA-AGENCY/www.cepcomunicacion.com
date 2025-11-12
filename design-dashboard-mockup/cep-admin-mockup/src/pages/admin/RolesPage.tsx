import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Shield, Edit, Trash2, Eye, Users, Lock } from 'lucide-react'
import { ROLES_MOCK } from '@/data/mockAdministracion'
import type { Rol, ModuloSistema, AccionPermiso } from '@/types'
import { Switch } from '@/components/ui/switch'

const MODULOS: { id: ModuloSistema; label: string }[] = [
  { id: 'cursos', label: 'Cursos' },
  { id: 'programacion', label: 'Programación' },
  { id: 'ciclos', label: 'Ciclos' },
  { id: 'sedes', label: 'Sedes' },
  { id: 'aulas', label: 'Aulas' },
  { id: 'profesores', label: 'Profesores' },
  { id: 'administrativos', label: 'Administrativos' },
  { id: 'alumnos', label: 'Alumnos' },
  { id: 'leads', label: 'Leads' },
  { id: 'matriculas', label: 'Matrículas' },
  { id: 'campanas', label: 'Campañas' },
  { id: 'creatividades', label: 'Creatividades' },
  { id: 'contenido', label: 'Contenido' },
  { id: 'analiticas', label: 'Analíticas' },
  { id: 'administracion', label: 'Administración' },
]

const ACCIONES: { id: AccionPermiso; label: string; icon: typeof Eye }[] = [
  { id: 'ver', label: 'Ver', icon: Eye },
  { id: 'crear', label: 'Crear', icon: Shield },
  { id: 'editar', label: 'Editar', icon: Edit },
  { id: 'eliminar', label: 'Eliminar', icon: Trash2 },
  { id: 'exportar', label: 'Exportar', icon: Shield },
]

export function RolesPage() {
  const [roles] = useState<Rol[]>(ROLES_MOCK)
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null)
  const [isPermisoDialogOpen, setIsPermisoDialogOpen] = useState(false)

  const tienePermiso = (rol: Rol, modulo: ModuloSistema, accion: AccionPermiso) => {
    const permisoModulo = rol.permisos.find((p) => p.modulo === modulo)
    return permisoModulo?.acciones.includes(accion) || false
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Roles y Permisos</h1>
          <p className="text-muted-foreground mt-1">
            Configura los roles del sistema y sus permisos granulares
          </p>
        </div>
        <Button className="gap-2">
          <Shield className="h-4 w-4" />
          NUEVO ROL
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Roles del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {roles.filter((r) => r.es_sistema).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Roles Personalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {roles.filter((r) => !r.es_sistema).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles del Sistema</CardTitle>
          <CardDescription>
            Los roles marcados como "Sistema" no pueden ser editados ni eliminados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((rol) => (
                <TableRow key={rol.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={rol.color}>{rol.nombre}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {rol.descripcion}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{rol.usuarios_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {rol.es_sistema ? (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        <Lock className="h-3 w-3 mr-1" />
                        Sistema
                      </Badge>
                    ) : (
                      <Badge variant="outline">Personalizado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRol(rol)
                          setIsPermisoDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Permisos
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={rol.es_sistema}
                        title="Editar rol"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={rol.es_sistema || rol.usuarios_count > 0}
                        title="Eliminar rol"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permission Matrix Dialog */}
      <Dialog open={isPermisoDialogOpen} onOpenChange={setIsPermisoDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge className={selectedRol?.color}>{selectedRol?.nombre}</Badge>
              - Matriz de Permisos
            </DialogTitle>
            <DialogDescription>{selectedRol?.descripcion}</DialogDescription>
          </DialogHeader>

          {selectedRol && (
            <div className="space-y-4 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Módulo</TableHead>
                    {ACCIONES.map((accion) => (
                      <TableHead key={accion.id} className="text-center">
                        {accion.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODULOS.map((modulo) => (
                    <TableRow key={modulo.id}>
                      <TableCell className="font-medium">{modulo.label}</TableCell>
                      {ACCIONES.map((accion) => (
                        <TableCell key={accion.id} className="text-center">
                          <Switch
                            checked={tienePermiso(selectedRol, modulo.id, accion.id)}
                            disabled={selectedRol.es_sistema}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {!selectedRol.es_sistema && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsPermisoDialogOpen(false)}>
                    CANCELAR
                  </Button>
                  <Button onClick={() => setIsPermisoDialogOpen(false)}>
                    GUARDAR CAMBIOS
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
