'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@payload-config/components/ui/card'
import { Button } from '@payload-config/components/ui/button'
import { Input } from '@payload-config/components/ui/input'
import { Label } from '@payload-config/components/ui/label'
import { 
  Plus, 
  Shield, 
  UserCheck, 
  UserX, 
  Edit2, 
  Key, 
  Smartphone,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: string
  active: boolean
  linkedStaff: string | null
  twoFactorEnabled: boolean
  lastLogin?: string
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: 'Admin User', 
      email: 'admin@cepcomunicacion.com', 
      role: 'Admin', 
      active: true, 
      linkedStaff: null,
      twoFactorEnabled: true,
      lastLogin: '2025-01-15 14:30'
    },
    { 
      id: 2, 
      name: 'Juan García', 
      email: 'juan@cepcomunicacion.com', 
      role: 'Gestor', 
      active: true, 
      linkedStaff: 'STAFF-001',
      twoFactorEnabled: false,
      lastLogin: '2025-01-15 10:15'
    },
    { 
      id: 3, 
      name: 'María López', 
      email: 'maria@cepcomunicacion.com', 
      role: 'Marketing', 
      active: true, 
      linkedStaff: 'STAFF-002',
      twoFactorEnabled: true,
      lastLogin: '2025-01-14 16:45'
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Lectura',
    password: '',
    confirmPassword: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  })

  const [qrCode] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/CEPAdmin:user@example.com?secret=BASE32SECRET&issuer=CEPAdmin')
  const [verificationCode, setVerificationCode] = useState('')

  const roles = ['Admin', 'Gestor', 'Marketing', 'Asesor', 'Lectura']

  const handleCreateUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    const user: User = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      active: true,
      linkedStaff: null,
      twoFactorEnabled: false,
    }
    setUsers([...users, user])
    setShowCreateModal(false)
    setNewUser({ name: '', email: '', role: 'Lectura', password: '', confirmPassword: '' })
    showSuccessToast('Usuario creado correctamente')
  }

  const handleEditUser = () => {
    if (!selectedUser) return
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u))
    setShowEditModal(false)
    setSelectedUser(null)
    showSuccessToast('Usuario actualizado correctamente')
  }

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Las contraseñas no coinciden')
      return
    }
    // TODO: Validate current password and update
    setShowPasswordModal(false)
    setPasswordForm({ current: '', new: '', confirm: '', showCurrent: false, showNew: false, showConfirm: false })
    showSuccessToast('Contraseña actualizada correctamente')
  }

  const handleEnable2FA = () => {
    if (!selectedUser) return
    if (verificationCode.length !== 6) {
      alert('Ingresa el código de 6 dígitos')
      return
    }
    setUsers(users.map(u => 
      u.id === selectedUser.id ? { ...u, twoFactorEnabled: true } : u
    ))
    setShow2FAModal(false)
    setSelectedUser(null)
    setVerificationCode('')
    showSuccessToast('2FA activado correctamente')
  }

  const handleDisable2FA = (user: User) => {
    if (confirm('¿Estás seguro de desactivar la autenticación de dos factores?')) {
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, twoFactorEnabled: false } : u
      ))
      showSuccessToast('2FA desactivado')
    }
  }

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra usuarios, roles, permisos y seguridad</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      {showSuccess && (
        <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Total Usuarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.filter(u => u.active).length}</div>
            <p className="text-xs text-muted-foreground">Usuarios Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.filter(u => u.linkedStaff).length}</div>
            <p className="text-xs text-muted-foreground">Vinculados a Staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.filter(u => u.twoFactorEnabled).length}</div>
            <p className="text-xs text-muted-foreground">Con 2FA Activo</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {user.name}
                    {user.active ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium">{user.role}</span>
                </div>
                {user.linkedStaff && (
                  <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    <UserCheck className="h-3 w-3" />
                    {user.linkedStaff}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-muted-foreground">2FA:</span>
                  {user.twoFactorEnabled ? (
                    <span className="text-success font-medium">Activado</span>
                  ) : (
                    <span className="text-warning font-medium">Desactivado</span>
                  )}
                </div>
                {user.lastLogin && (
                  <span className="text-xs text-muted-foreground">
                    Último acceso: {user.lastLogin}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user)
                    setShowEditModal(true)
                  }}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user)
                    setShowPasswordModal(true)
                  }}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Contraseña
                </Button>
              </div>

              <Button 
                variant={user.twoFactorEnabled ? 'outline' : 'default'}
                size="sm"
                className="w-full"
                onClick={() => {
                  if (user.twoFactorEnabled) {
                    handleDisable2FA(user)
                  } else {
                    setSelectedUser(user)
                    setShow2FAModal(true)
                  }
                }}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                {user.twoFactorEnabled ? 'Desactivar 2FA' : 'Activar 2FA'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Crear Nuevo Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Nombre Completo</Label>
                <Input
                  id="create-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@cepcomunicacion.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Rol</Label>
                <select
                  id="create-role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full h-10 px-3 rounded border bg-card"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">Contraseña</Label>
                <Input
                  id="create-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-confirm">Confirmar Contraseña</Label>
                <Input
                  id="create-confirm"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateUser} 
                  className="flex-1"
                  disabled={!newUser.name || !newUser.email || !newUser.password || newUser.password !== newUser.confirmPassword}
                >
                  Crear Usuario
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre Completo</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rol</Label>
                <select
                  id="edit-role"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full h-10 px-3 rounded border bg-card"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={selectedUser.active}
                  onChange={(e) => setSelectedUser({ ...selectedUser, active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-active" className="cursor-pointer">Usuario activo</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleEditUser} className="flex-1">
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Cambiar Contraseña - {selectedUser.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={passwordForm.showCurrent ? 'text' : 'password'}
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm({ ...passwordForm, showCurrent: !passwordForm.showCurrent })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {passwordForm.showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={passwordForm.showNew ? 'text' : 'password'}
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm({ ...passwordForm, showNew: !passwordForm.showNew })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {passwordForm.showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={passwordForm.showConfirm ? 'text' : 'password'}
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm({ ...passwordForm, showConfirm: !passwordForm.showConfirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {passwordForm.showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {passwordForm.new && passwordForm.confirm && passwordForm.new !== passwordForm.confirm && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">Las contraseñas no coinciden</p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowPasswordModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleChangePassword} 
                  className="flex-1"
                  disabled={!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
                >
                  Cambiar Contraseña
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Activar Autenticación de Dos Factores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>1. Instala una app de autenticación como Google Authenticator o Authy</p>
                <p>2. Escanea el código QR con la app</p>
                <p>3. Ingresa el código de 6 dígitos para verificar</p>
              </div>

              <div className="flex justify-center p-4 bg-white rounded-lg">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Código de Verificación</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShow2FAModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleEnable2FA} 
                  className="flex-1"
                  disabled={verificationCode.length !== 6}
                >
                  Activar 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
