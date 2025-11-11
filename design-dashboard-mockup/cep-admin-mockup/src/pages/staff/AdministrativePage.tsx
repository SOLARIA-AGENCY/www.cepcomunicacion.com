import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash, Mail, Phone, Building2 } from "lucide-react"
import { staff } from "@/data/mockData"

export function AdministrativePage() {
  const [showStaffDialog, setShowStaffDialog] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Administrativo</h1>
          <p className="text-muted-foreground">
            Gestión del equipo administrativo y de coordinación
          </p>
        </div>
        <Button onClick={() => setShowStaffDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Personal
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <Input placeholder="Buscar por nombre..." className="max-w-sm" />
      </div>

      {/* Grid de personal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.photo} alt={member.first_name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {member.first_name} {member.last_name}
                    </CardTitle>
                    <Badge variant="default" className="mt-1">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" title="Editar">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title="Eliminar">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {member.email}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {member.phone}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {member.campus}
                </p>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Departamento:</span> {member.department}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
