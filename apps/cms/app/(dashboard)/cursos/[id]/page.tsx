'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@payload-config/components/ui/card'
import { Button } from '@payload-config/components/ui/button'
import { Badge } from '@payload-config/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@payload-config/components/ui/tabs'
import {
  ArrowLeft,
  Edit,
  Plus,
  BookOpen,
  Target,
  FileText,
  Euro,
  Clock,
  Users,
  Calendar,
  MapPin,
  GraduationCap,
} from 'lucide-react'
import { COURSE_TYPE_CONFIG } from '@payload-config/lib/courseTypeConfig'
// TODO: Fetch from Payload API
// import { plantillasCursosData } from '@payload-config/data/mockCourseTemplatesData'
// import { instanciasData } from '@payload-config/data/mockCoursesData'
const plantillasCursosData: any[] = []
const instanciasData: any[] = []
import { ConvocationCard } from '@payload-config/components/ui/ConvocationCard'
import {
  ConvocationGeneratorModal,
  type ConvocationFormData,
} from '@payload-config/components/ui/ConvocationGeneratorModal'

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const router = useRouter()

  // Unwrap params (Next.js 15 pattern)
  const { id } = React.use(params)

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Find course template by ID
  const courseTemplate = plantillasCursosData.find((c) => c.id === id)

  if (!courseTemplate) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Curso no encontrado</CardTitle>
            <CardDescription>El curso con ID {id} no existe</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/cursos')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const typeConfig = COURSE_TYPE_CONFIG[courseTemplate.tipo] || COURSE_TYPE_CONFIG.privados

  // Find all convocations (instances) for this course
  const courseConvocations = instanciasData.filter(
    (instance) => instance.plantillaId === courseTemplate.id
  )

  const handleViewConvocation = (convocationId: string) => {
    router.push(`/cursos/${id}/convocatoria/${convocationId}`)
  }

  const handleCreateConvocation = (formData: ConvocationFormData) => {
    // In real implementation, this would call API to create convocation
    console.log('Creating convocation:', formData)
    // After successful creation, could show toast notification or refresh convocations list
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/cursos')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{courseTemplate.nombre}</h1>
              <p className="text-muted-foreground">
                {courseTemplate.area} • Detalle de la plantilla del curso
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/cursos/${id}/editar`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Curso
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Convocatoria
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-6">
            <Badge
              className={`${typeConfig.bgColor} ${typeConfig.hoverColor} text-white text-sm font-bold uppercase`}
            >
              {typeConfig.label}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Área:</span>
              <Badge variant="outline">{courseTemplate.area}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Convocatorias:</span>
              <Badge variant="secondary">{courseTemplate.totalConvocatorias} activas</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content: 2/3 + 1/3 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE: 2/3 - Course Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image - Reduced height for better reading space */}
          <Card>
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-t-lg">
                <img
                  src={courseTemplate.imagenPortada}
                  alt={courseTemplate.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs with Course Details */}
          <Card>
            <Tabs defaultValue="info" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
                  <TabsTrigger value="contenidos">Contenidos</TabsTrigger>
                  <TabsTrigger value="recursos">Recursos</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                {/* INFO TAB */}
                <TabsContent value="info" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {courseTemplate.descripcion}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Duración</p>
                        <p className="font-semibold">{courseTemplate.duracionReferencia}H</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Euro className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Precio</p>
                        <p className="font-semibold">
                          {courseTemplate.precioReferencia && courseTemplate.precioReferencia > 0
                            ? `${courseTemplate.precioReferencia}€`
                            : 'SUBVENCIONADO'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Área</p>
                        <p className="font-semibold text-xs">{courseTemplate.area}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* OBJETIVOS TAB */}
                <TabsContent value="objetivos" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Objetivos del Curso
                    </h3>
                    <ul className="space-y-2">
                      {courseTemplate.objetivos.map((objetivo, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground">{objetivo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* CONTENIDOS TAB */}
                <TabsContent value="contenidos" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Contenidos del Programa
                    </h3>
                    <ul className="space-y-2">
                      {courseTemplate.contenidos.map((contenido, index) => (
                        <li key={index} className="flex gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span>{contenido}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* RECURSOS TAB */}
                <TabsContent value="recursos" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recursos Disponibles
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Aquí se mostrarán los PDFs, documentos y materiales del curso
                    </p>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Recurso
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* RIGHT SIDE: 1/3 - Convocations List */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Convocatorias Generadas</span>
                <Badge variant="secondary">{courseConvocations.length}</Badge>
              </CardTitle>
              <CardDescription>
                Instancias programadas de este curso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseConvocations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No hay convocatorias programadas
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Nueva Convocatoria
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courseConvocations.map((convocation) => (
                    <Card
                      key={convocation.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleViewConvocation(convocation.id)}
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <Badge
                            variant={
                              convocation.estado === 'abierta'
                                ? 'default'
                                : convocation.estado === 'planificada'
                                  ? 'secondary'
                                  : 'outline'
                            }
                            className="text-xs"
                          >
                            {convocation.estado}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {convocation.porcentajeOcupacion}% ocupado
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {new Date(convocation.fechaInicio).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{convocation.sedeNombre}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {convocation.plazasOcupadas}/{convocation.plazasTotales} plazas
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Convocation Generator Modal */}
      <ConvocationGeneratorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        courseTemplate={courseTemplate}
        onSubmit={handleCreateConvocation}
      />
    </div>
  )
}
