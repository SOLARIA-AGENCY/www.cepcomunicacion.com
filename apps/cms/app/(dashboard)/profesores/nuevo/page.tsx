'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@payload-config/components/ui/card'
import { Button } from '@payload-config/components/ui/button'
import { Input } from '@payload-config/components/ui/input'
import { Label } from '@payload-config/components/ui/label'
import { Textarea } from '@payload-config/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@payload-config/components/ui/select'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function NewProfesorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    contractType: 'full_time',
    employmentStatus: 'active',
    bio: '',
    hireDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // TODO: Implement actual API call to create professor
      // For now, redirect to Payload CMS admin
      router.push('/admin/collections/staff/create?staffType=profesor')
    } catch (err) {
      console.error('Error creating professor:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Profesor</h1>
          <p className="text-muted-foreground mt-1">Añade un nuevo profesor al sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Profesor</CardTitle>
            <CardDescription>
              Completa los datos del nuevo profesor. Los campos marcados con * son obligatorios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
                <p className="font-semibold">Error al crear profesor</p>
                <p>{error}</p>
              </div>
            )}

            {/* Personal Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                  placeholder="Juan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Apellidos <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                  placeholder="Pérez García"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  placeholder="juan.perez@cepcomunicacion.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+34 922 123 456"
                />
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">
                Posición <span className="text-destructive">*</span>
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                required
                placeholder="Profesor de Marketing Digital"
              />
            </div>

            {/* Employment Details */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="contractType">Tipo de Contrato</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) => handleChange('contractType', value)}
                >
                  <SelectTrigger id="contractType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Tiempo Completo</SelectItem>
                    <SelectItem value="part_time">Medio Tiempo</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Estado</Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) => handleChange('employmentStatus', value)}
                >
                  <SelectTrigger id="employmentStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="temporary_leave">Baja Temporal</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">Fecha de Contratación</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleChange('hireDate', e.target.value)}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
                placeholder="Breve descripción profesional del profesor..."
              />
            </div>

            {/* Info Note */}
            <div className="p-4 rounded-md bg-muted/50 text-sm">
              <p className="font-semibold mb-2">Nota:</p>
              <p>
                Después de crear el profesor, podrás asignar sedes, subir foto y añadir más
                detalles desde la página de edición o el panel de administración de Payload CMS.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Crear Profesor
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Alternativa: Usar Payload CMS Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Para una experiencia de creación más completa con todas las funcionalidades (subida de
            fotos, asignación de sedes, etc.), puedes usar el panel de administración de Payload
            CMS.
          </p>
          <Button variant="outline" onClick={() => router.push('/admin/collections/staff/create')}>
            Abrir en Payload CMS Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
