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
