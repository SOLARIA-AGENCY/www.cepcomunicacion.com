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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Mail, Phone, Plus, Edit, Building2, Award, Search } from "lucide-react"
import { AdministrativeDialog } from "@/components/dialogs/AdministrativeDialog"
import { administrativeStaffData } from "@/data/mockData"

export function AdministrativePage() {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<typeof administrativeStaffData[0] | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const handleAdd = () => {
    setDialogMode('create')
    setSelectedStaff(null)
    setShowDialog(true)
  }

  const handleEdit = (staff: typeof administrativeStaffData[0]) => {
    setDialogMode('edit')
    setSelectedStaff(staff)
    setShowDialog(true)
  }

  // Filtrado
  const filteredStaff = administrativeStaffData.filter(staff => {
    const matchesSearch = staff.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = filterDepartment === 'all' || staff.department === filterDepartment
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && staff.active) ||
                         (filterStatus === 'inactive' && !staff.active)
    return matchesSearch && matchesDept && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Administrativo</h1>
          <p className="text-muted-foreground">
            Gestión del equipo administrativo de CEP Comunicación
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Personal
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                <SelectItem value="Administración">Administración</SelectItem>
                <SelectItem value="Secretaría Académica">Secretaría Académica</SelectItem>
                <SelectItem value="Recepción">Recepción</SelectItem>
                <SelectItem value="Informática">Informática</SelectItem>
                <SelectItem value="Contabilidad">Contabilidad</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Personal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={staff.photo} />
                    <AvatarFallback>{staff.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {staff.first_name} {staff.last_name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {staff.position}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEdit(staff)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contacto */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{staff.phone}</span>
                  {staff.extension && (
                    <Badge variant="secondary" className="text-[10px]">
                      Ext. {staff.extension}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Departamento */}
              <div>
                <p className="text-xs font-medium mb-1">Departamento:</p>
                <Badge variant="outline">{staff.department}</Badge>
              </div>

              {/* Sedes Asignadas */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  Sedes asignadas:
                </p>
                <div className="flex flex-wrap gap-1">
                  {staff.campuses.map(campusId => (
                    <Badge key={campusId} variant="outline" className="text-xs">
                      {campusId === 'C001' ? 'CEP Norte' :
                       campusId === 'C002' ? 'CEP Santa Cruz' :
                       campusId === 'C003' ? 'CEP Sur' : campusId}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Responsabilidades */}
              <div>
                <p className="text-xs font-medium mb-2">Responsabilidades:</p>
                <ul className="space-y-1">
                  {staff.responsibilities.slice(0, 3).map((resp, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-primary">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                  {staff.responsibilities.length > 3 && (
                    <li className="text-xs text-muted-foreground">
                      +{staff.responsibilities.length - 3} más
                    </li>
                  )}
                </ul>
              </div>

              {/* Certificaciones */}
              {staff.certifications.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    Certificaciones:
                  </p>
                  <div className="space-y-1">
                    {staff.certifications.slice(0, 2).map((cert, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground">
                        <p className="font-medium">{cert.title}</p>
                        <p className="text-[10px]">{cert.institution} ({cert.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Biografía - OBLIGATORIA */}
              <div>
                <p className="text-xs font-medium mb-1">Biografía:</p>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {staff.bio}
                </p>
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between pt-2 border-t">
                {staff.active ? (
                  <Badge variant="default" className="text-xs">Activo</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{administrativeStaffData.length}</p>
            <p className="text-xs text-muted-foreground">Personal total</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {administrativeStaffData.filter(s => s.active).length}
            </p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {Array.from(new Set(administrativeStaffData.flatMap(s => s.campuses))).length}
            </p>
            <p className="text-xs text-muted-foreground">Sedes cubiertas</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <AdministrativeDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode={dialogMode}
        staff={selectedStaff || undefined}
      />
    </div>
  )
}
