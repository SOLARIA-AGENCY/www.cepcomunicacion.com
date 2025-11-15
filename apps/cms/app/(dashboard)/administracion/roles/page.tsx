'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@payload-config/components/ui/card'
import { Button } from '@payload-config/components/ui/button'
import { Shield, ChevronDown, ChevronUp, Users, CheckCircle, XCircle, Eye } from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

interface Role {
  name: string
  permissions: string[]
  icon: typeof Shield
  users: Array<{ id: number; name: string; email: string; active: boolean }>
  color: string
  description: string
}

const ALL_PERMISSIONS: Permission[] = [
  // Cursos
  { id: 'courses.view', name: 'Ver Cursos', description: 'Acceso de lectura a cursos', category: 'Cursos' },
  { id: 'courses.create', name: 'Crear Cursos', description: 'Crear nuevos cursos', category: 'Cursos' },
  { id: 'courses.edit', name: 'Editar Cursos', description: 'Modificar cursos existentes', category: 'Cursos' },
  { id: 'courses.delete', name: 'Eliminar Cursos', description: 'Eliminar cursos', category: 'Cursos' },
  { id: 'courses.publish', name: 'Publicar Cursos', description: 'Publicar/despublicar cursos', category: 'Cursos' },
  
  // Staff
  { id: 'staff.view', name: 'Ver Staff', description: 'Acceso de lectura al personal', category: 'Staff' },
  { id: 'staff.create', name: 'Crear Staff', description: 'Añadir nuevo personal', category: 'Staff' },
  { id: 'staff.edit', name: 'Editar Staff', description: 'Modificar datos del personal', category: 'Staff' },
  { id: 'staff.delete', name: 'Eliminar Staff', description: 'Eliminar personal', category: 'Staff' },
  
  // Leads
  { id: 'leads.view', name: 'Ver Leads', description: 'Acceso a contactos y leads', category: 'Leads' },
  { id: 'leads.create', name: 'Crear Leads', description: 'Añadir nuevos leads', category: 'Leads' },
  { id: 'leads.edit', name: 'Editar Leads', description: 'Modificar leads', category: 'Leads' },
  { id: 'leads.export', name: 'Exportar Leads', description: 'Exportar datos de leads', category: 'Leads' },
  
  // Campañas
  { id: 'campaigns.view', name: 'Ver Campañas', description: 'Acceso a campañas de marketing', category: 'Campañas' },
  { id: 'campaigns.create', name: 'Crear Campañas', description: 'Crear nuevas campañas', category: 'Campañas' },
  { id: 'campaigns.edit', name: 'Editar Campañas', description: 'Modificar campañas', category: 'Campañas' },
  { id: 'campaigns.analytics', name: 'Analytics', description: 'Ver análisis de campañas', category: 'Campañas' },
  
  // Configuración
  { id: 'config.view', name: 'Ver Configuración', description: 'Acceso a configuración', category: 'Configuración' },
  { id: 'config.edit', name: 'Editar Configuración', description: 'Modificar configuración', category: 'Configuración' },
  { id: 'config.apis', name: 'Gestionar APIs', description: 'Configurar APIs e integraciones', category: 'Configuración' },
  
  // Usuarios
  { id: 'users.view', name: 'Ver Usuarios', description: 'Acceso a lista de usuarios', category: 'Usuarios' },
  { id: 'users.create', name: 'Crear Usuarios', description: 'Añadir nuevos usuarios', category: 'Usuarios' },
  { id: 'users.edit', name: 'Editar Usuarios', description: 'Modificar usuarios', category: 'Usuarios' },
  { id: 'users.delete', name: 'Eliminar Usuarios', description: 'Eliminar usuarios', category: 'Usuarios' },
  { id: 'users.roles', name: 'Gestionar Roles', description: 'Asignar y modificar roles', category: 'Usuarios' },
  
  // Sistema
  { id: 'system.audit', name: 'Registro de Auditoría', description: 'Ver logs del sistema', category: 'Sistema' },
  { id: 'system.backup', name: 'Backups', description: 'Gestionar copias de seguridad', category: 'Sistema' },
]

export default function RolesPage() {
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const roles: Role[] = [
    {
      name: 'Admin',
      permissions: ALL_PERMISSIONS.map(p => p.id),
      icon: Shield,
      color: 'bg-red-500',
      description: 'Acceso total al sistema sin restricciones',
      users: [
        { id: 1, name: 'Admin User', email: 'admin@cepcomunicacion.com', active: true },
      ],
    },
    {
      name: 'Gestor',
      permissions: [
        'courses.view', 'courses.create', 'courses.edit', 'courses.publish',
        'staff.view', 'staff.create', 'staff.edit',
        'leads.view', 'leads.create', 'leads.edit',
        'config.view',
      ],
      icon: Shield,
      color: 'bg-blue-500',
      description: 'Gestión de cursos, personal y contenido',
      users: [
        { id: 2, name: 'Juan García', email: 'juan@cepcomunicacion.com', active: true },
        { id: 4, name: 'Carlos Ruiz', email: 'carlos@cepcomunicacion.com', active: true },
      ],
    },
    {
      name: 'Marketing',
      permissions: [
        'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.analytics',
        'leads.view', 'leads.create', 'leads.edit', 'leads.export',
        'courses.view',
      ],
      icon: Shield,
      color: 'bg-purple-500',
      description: 'Gestión de campañas, leads y análisis',
      users: [
        { id: 3, name: 'María López', email: 'maria@cepcomunicacion.com', active: true },
      ],
    },
    {
      name: 'Asesor',
      permissions: [
        'leads.view', 'leads.create', 'leads.edit',
        'courses.view',
        'staff.view',
      ],
      icon: Shield,
      color: 'bg-green-500',
      description: 'Gestión de leads y consulta de información',
      users: [
        { id: 5, name: 'Ana Martínez', email: 'ana@cepcomunicacion.com', active: true },
        { id: 6, name: 'Pedro Sánchez', email: 'pedro@cepcomunicacion.com', active: false },
      ],
    },
    {
      name: 'Lectura',
      permissions: [
        'courses.view',
        'staff.view',
        'leads.view',
        'campaigns.view',
      ],
      icon: Shield,
      color: 'bg-gray-500',
      description: 'Solo lectura en todas las secciones',
      users: [],
    },
  ]

  const toggleRole = (roleName: string) => {
    setExpandedRole(expandedRole === roleName ? null : roleName)
  }

  const groupPermissionsByCategory = (permissionIds: string[]) => {
    const grouped: Record<string, Permission[]> = {}
    permissionIds.forEach(id => {
      const permission = ALL_PERMISSIONS.find(p => p.id === id)
      if (permission) {
        if (!grouped[permission.category]) {
          grouped[permission.category] = []
        }
        grouped[permission.category].push(permission)
      }
    })
    return grouped
  }

  const handleViewUsers = (role: Role) => {
    setSelectedRole(role)
    setShowUsersModal(true)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold">Roles y Permisos</h1>
        <p className="text-muted-foreground">Sistema de control de acceso basado en roles (RBAC)</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-3 w-3 rounded-full ${role.color}`} />
                <p className="font-medium">{role.name}</p>
              </div>
              <div className="text-2xl font-bold">{role.users.length}</div>
              <p className="text-xs text-muted-foreground">usuarios</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => {
          const isExpanded = expandedRole === role.name
          const groupedPermissions = groupPermissionsByCategory(role.permissions)

          return (
            <Card key={role.name} className="overflow-hidden">
              <CardHeader className="cursor-pointer" onClick={() => toggleRole(role.name)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`h-10 w-10 rounded-lg ${role.color} flex items-center justify-center`}>
                      <role.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {role.name}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({role.permissions.length} permisos)
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {role.users.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewUsers(role)
                        }}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {role.users.length} {role.users.length === 1 ? 'usuario' : 'usuarios'}
                      </Button>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="border-t pt-6">
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                      <div key={category}>
                        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                          {category}
                        </h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-start gap-3 p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                            >
                              <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{permission.name}</p>
                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {role.users.length > 0 && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3 text-sm">Usuarios con este Rol</h4>
                        <div className="space-y-2">
                          {role.users.slice(0, 3).map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium">{user.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                              {user.active ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                          {role.users.length > 3 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleViewUsers(role)}
                            >
                              Ver todos ({role.users.length})
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Users Modal */}
      {showUsersModal && selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg ${selectedRole.color} flex items-center justify-center`}>
                  <selectedRole.icon className="h-4 w-4 text-white" />
                </div>
                Usuarios con rol {selectedRole.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedRole.users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay usuarios con este rol</p>
                </div>
              ) : (
                selectedRole.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {user.active ? (
                        <span className="text-xs px-2 py-1 bg-success/10 text-success rounded">Activo</span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">Inactivo</span>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
              <div className="flex justify-end pt-4">
                <Button onClick={() => setShowUsersModal(false)}>Cerrar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
