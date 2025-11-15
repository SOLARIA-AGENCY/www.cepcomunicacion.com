'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@payload-config/components/ui/card'
import { Button } from '@payload-config/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function EditProfesorPage() {
  const router = useRouter()
  const params = useParams()
  const professorId = params.id as string

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect to Payload CMS admin for editing
    // This provides the full editing experience with file uploads, etc.
    if (professorId) {
      router.push(`/admin/collections/staff/${professorId}`)
    }
  }, [professorId, router])

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Profesor</h1>
            <p className="text-muted-foreground mt-1">Modificar información del profesor</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Redirigiendo...</CardTitle>
            <CardDescription>
              Te estamos redirigiendo al editor de Payload CMS para una experiencia completa de edición.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">
                  Cargando editor de Payload CMS...
                </p>
              </div>
            </div>

            <div className="p-4 rounded-md bg-muted/50 text-sm">
              <p className="font-semibold mb-2">¿Por qué usar Payload CMS?</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Subida de archivos e imágenes</li>
                <li>Asignación de sedes y relaciones</li>
                <li>Validación completa de formularios</li>
                <li>Historial de cambios y versionado</li>
                <li>Gestión de permisos y roles</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => router.back()}>
                Volver
              </Button>
              <Button onClick={() => router.push(`/admin/collections/staff/${professorId}`)}>
                Ir a Payload CMS
              </Button>
            </div>
          </CardContent>
        </Card>
      </Card>
    </div>
  )

  return null
}
