import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSedeDetalle } from '@/data/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Users,
  BookOpen,
  DoorOpen,
  TrendingUp,
  GraduationCap,
  Euro,
  CheckCircle,
  Edit
} from 'lucide-react'

export function SedeDetailPage() {
  const { sedeId } = useParams<{ sedeId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('informacion')

  const sede = sedeId ? getSedeDetalle(sedeId) : undefined

  // Scroll suave al cambiar hash en URL
  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash) {
      setActiveTab(hash)
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    }
  }, [])

  if (!sede) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Sede no encontrada</h1>
        <Button onClick={() => navigate('/sedes')}>
          Volver a Sedes
        </Button>
      </div>
    )
  }

  return (
    <div className="sede-detail-page space-y-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/sedes" className="hover:text-primary">
          Sedes
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{sede.nombre}</span>
      </div>

      {/* Header */}
      <div className="relative h-64 rounded-lg overflow-hidden">
        <img
          src={sede.imagenPrincipal}
          alt={sede.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">{sede.nombre}</h1>
            <div className="flex items-center gap-3">
              <Badge variant={sede.activa ? "default" : "secondary"}>
                {sede.activa ? 'Activa' : 'Inactiva'}
              </Badge>
              <span className="text-sm opacity-90">Código: {sede.codigo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(`/sedes/${sedeId}/editar`)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar Sede
        </Button>
      </div>

      {/* Tabs de navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="aulas">Aulas ({sede.cantidadAulas})</TabsTrigger>
          <TabsTrigger value="personal">Personal ({sede.cantidadPersonal})</TabsTrigger>
          <TabsTrigger value="alumnos">Alumnos ({sede.cantidadAlumnos})</TabsTrigger>
          <TabsTrigger value="cursos">Cursos ({sede.cantidadCursosActivos})</TabsTrigger>
        </TabsList>

        {/* Tab: Información General */}
        <TabsContent value="informacion" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Datos de contacto */}
            <Card>
              <CardHeader>
                <CardTitle>Datos de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Dirección</p>
                    <p className="text-sm text-muted-foreground">
                      {sede.direccion}, {sede.ciudad}
                      <br />
                      {sede.codigoPostal}, {sede.provincia}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Teléfono</p>
                    <a href={`tel:${sede.telefono}`} className="text-sm text-primary">
                      {sede.telefono}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a href={`mailto:${sede.email}`} className="text-sm text-primary">
                      {sede.email}
                    </a>
                  </div>
                </div>

                {sede.sitioWeb && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Sitio Web</p>
                      <a
                        href={sede.sitioWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary"
                      >
                        {sede.sitioWeb}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Horario de Atención</p>
                    <p className="text-sm text-muted-foreground">
                      {sede.horarioAtencion}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsable de sede */}
            <Card>
              <CardHeader>
                <CardTitle>Responsable de Sede</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={sede.responsable.avatar} />
                    <AvatarFallback>
                      {sede.responsable.nombre.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{sede.responsable.nombre}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {sede.responsable.cargo}
                    </p>
                    <div className="space-y-1">
                      <a
                        href={`mailto:${sede.responsable.email}`}
                        className="block text-sm text-primary"
                      >
                        {sede.responsable.email}
                      </a>
                      <a
                        href={`tel:${sede.responsable.telefono}`}
                        className="block text-sm text-primary"
                      >
                        {sede.responsable.telefono}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Descripción */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre la Sede</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {sede.descripcion}
              </p>
            </CardContent>
          </Card>

          {/* Instalaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Instalaciones y Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sede.instalaciones.map(instalacion => (
                  <div
                    key={instalacion.id}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{instalacion.nombre}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mapa */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden mb-4">
                <iframe
                  src={`https://www.google.com/maps?q=${sede.latitud},${sede.longitud}&output=embed`}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full"
                />
              </div>
              <Button variant="outline" asChild>
                <a
                  href={`https://www.google.com/maps?q=${sede.latitud},${sede.longitud}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Abrir en Google Maps
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Aulas */}
        <TabsContent value="aulas" id="aulas" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Aulas de {sede.nombre}</h2>
            <Button>
              <DoorOpen className="h-4 w-4 mr-2" />
              Añadir Aula
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sede.aulas.map(aula => (
              <Card key={aula.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{aula.nombre}</CardTitle>
                    <Badge variant={aula.disponible ? "default" : "destructive"}>
                      {aula.disponible ? 'Disponible' : 'Ocupada'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Capacidad: {aula.capacidad} personas</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{aula.planta} · {aula.metrosCuadrados}m²</span>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Equipamiento:</p>
                    <div className="flex flex-wrap gap-1">
                      {aula.equipamiento.map((equipo, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {equipo}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {aula.cursoActual && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium mb-1">Curso actual:</p>
                      <p className="text-sm text-muted-foreground">
                        {aula.cursoActual.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {aula.cursoActual.horario}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Horario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Personal */}
        <TabsContent value="personal" id="personal" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Personal de {sede.nombre}</h2>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Asignar Personal
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Rol</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Teléfono</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Horario</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sede.personal.map(persona => (
                      <tr key={persona.id} className="border-t">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={persona.avatar} />
                              <AvatarFallback>
                                {persona.nombre.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{persona.nombre}</p>
                              {persona.especialidad && (
                                <p className="text-xs text-muted-foreground">
                                  {persona.especialidad}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{persona.rol}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{persona.email}</td>
                        <td className="px-4 py-3 text-sm">{persona.telefono}</td>
                        <td className="px-4 py-3 text-sm">{persona.horario}</td>
                        <td className="px-4 py-3">
                          <Badge variant={persona.activo ? "default" : "secondary"}>
                            {persona.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Alumnos */}
        <TabsContent value="alumnos" id="alumnos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Alumnos Matriculados</h2>
            <Button variant="outline">
              Exportar Listado
            </Button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sede.estadisticas.total}</p>
                    <p className="text-sm text-muted-foreground">Total Alumnos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sede.estadisticas.activos}</p>
                    <p className="text-sm text-muted-foreground">Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sede.estadisticas.nuevosMes}</p>
                    <p className="text-sm text-muted-foreground">Nuevos Este Mes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sede.estadisticas.graduados}</p>
                    <p className="text-sm text-muted-foreground">Graduados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de alumnos (mostrar primeros 10) */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Curso Actual</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Estado Pago</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Asistencia</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sede.alumnos.slice(0, 10).map(alumno => (
                      <tr key={alumno.id} className="border-t">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {alumno.nombre.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{alumno.nombre}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{alumno.email}</td>
                        <td className="px-4 py-3 text-sm">
                          {alumno.cursoActual?.nombre || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              alumno.estadoPago === 'pagado' ? 'default' :
                              alumno.estadoPago === 'parcial' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {alumno.estadoPago}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {alumno.porcentajeAsistencia}%
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={alumno.estado === 'activo' ? 'default' : 'secondary'}>
                            {alumno.estado}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {sede.alumnos.length > 10 && (
            <p className="text-sm text-muted-foreground text-center">
              Mostrando 10 de {sede.alumnos.length} alumnos
            </p>
          )}
        </TabsContent>

        {/* Tab: Cursos */}
        <TabsContent value="cursos" id="cursos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Cursos Impartidos en {sede.nombre}</h2>
          </div>

          {/* Estadísticas de cursos */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sede.estadisticas.cursosActivos}</p>
                    <p className="text-sm text-muted-foreground">Cursos Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sede.estadisticas.proximasConvocatorias}</p>
                    <p className="text-sm text-muted-foreground">Próximas Convocatorias</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sede.estadisticas.alumnosTotales}</p>
                    <p className="text-sm text-muted-foreground">Alumnos Totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sede.estadisticas.ocupacionMedia}%</p>
                    <p className="text-sm text-muted-foreground">Ocupación Media</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grid de cursos - Placeholder */}
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Los cursos de esta sede se mostrarán aquí cuando se integre con el sistema de instancias.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
