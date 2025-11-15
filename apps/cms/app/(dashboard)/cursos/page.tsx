'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@payload-config/components/ui/card'
import { Button } from '@payload-config/components/ui/button'
import { Input } from '@payload-config/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@payload-config/components/ui/select'
import { Plus, Search, Lock, Briefcase, Building2, Monitor, List, BookOpen } from 'lucide-react'
import { CourseTemplateCard } from '@payload-config/components/ui/CourseTemplateCard'
import { CourseListItem } from '@payload-config/components/ui/CourseListItem'
import { ViewToggle } from '@payload-config/components/ui/ViewToggle'
import { useViewPreference } from '@payload-config/hooks/useViewPreference'
// TODO: Import from Payload API
// import { plantillasCursosData, plantillasStats } from '@payload-config/data/mockCourseTemplatesData'

export default function CursosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams.get('tipo')

  // View preference
  const [view, setView] = useViewPreference('cursos')

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState(tipo || 'all')
  const [filterArea, setFilterArea] = useState('all')

  // State para cursos y carga
  const [cursos, setCursos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar cursos desde API con retry logic
  useEffect(() => {
    const fetchCursosWithRetry = async (retries = 2) => {
      console.log(`[CURSOS] Iniciando fetch de cursos (intentos restantes: ${retries})`)
      try {
        setLoading(true)

        // Timeout de 15 segundos
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort(new Error('Timeout de 15 segundos alcanzado'))
        }, 15000)

        const startTime = Date.now()
        const response = await fetch('/api/cursos', {
          signal: controller.signal,
          cache: 'no-cache', // Forzar fresh data en primera carga
        })
        clearTimeout(timeoutId)
        const elapsed = Date.now() - startTime
        console.log(`[CURSOS] Respuesta recibida en ${elapsed}ms`)

        const result = await response.json()
        console.log(`[CURSOS] Datos recibidos:`, {
          success: result.success,
          total: result.total,
          count: result.data?.length,
        })

        if (result.success) {
          // La API ya retorna los datos en el formato correcto
          setCursos(result.data)
          setError(null)
          console.log(`[CURSOS] ✅ ${result.data.length} cursos cargados exitosamente`)
        } else {
          console.error('[CURSOS] ❌ Error en respuesta:', result.error)
          setError(result.error || 'Error al cargar cursos')
        }
      } catch (err: any) {
        console.error('[CURSOS] ❌ Error fetching courses:', err)

        // Retry en caso de timeout o error de red
        if (retries > 0 && (err.name === 'AbortError' || err.message.includes('fetch'))) {
          console.log(`[CURSOS] 🔄 Reintentando... (${retries} intentos restantes)`)
          setTimeout(() => fetchCursosWithRetry(retries - 1), 1000)
          return
        }

        setError(
          err.name === 'AbortError'
            ? 'Tiempo de espera agotado. El servidor está tardando demasiado.'
            : 'Error de conexión al cargar cursos'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCursosWithRetry()
  }, [])

  // Calcular estadísticas desde los cursos cargados
  const cursosStats = {
    total: cursos.length,
    activos: cursos.length,
    privados: cursos.filter((c) => c.tipo === 'privado').length,
    ocupados: cursos.filter((c) => c.tipo === 'ocupados').length,
    desempleados: cursos.filter((c) => c.tipo === 'desempleados').length,
    teleformacion: cursos.filter((c) => c.tipo === 'teleformacion').length,
    totalConvocatorias: 0,
    porArea: {
      marketing: 0,
      desarrollo: 0,
      diseno: 0,
      audiovisual: 0,
      gestion: 0,
    },
  }

  const handleAdd = () => {
    // Redirigir a la página de creación de curso
    router.push('/cursos/nuevo')
  }

  const handleViewCourse = (course: any) => {
    router.push(`/cursos/${course.id}`)
  }

  // Filtrado de cursos
  const filteredCourses = cursos.filter((course) => {
    const matchesSearch =
      course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.descripcion && course.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.area && course.area.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === 'all' || course.tipo === filterType
    const matchesArea = filterArea === 'all' || course.area === filterArea

    return matchesSearch && matchesType && matchesArea
  })

  // Configure header based on filter
  const tiposConfig = {
    privados: {
      title: 'Cursos Privados',
      description: 'Cursos de formación privada para empresas y particulares',
      icon: Lock,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    ocupados: {
      title: 'Cursos Ocupados',
      description: 'Formación para trabajadores ocupados con financiación FUNDAE',
      icon: Briefcase,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    desempleados: {
      title: 'Cursos Desempleados',
      description: 'Formación gratuita para personas en situación de desempleo',
      icon: Building2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    teleformacion: {
      title: 'Cursos Teleformación',
      description: 'Cursos 100% online con certificación oficial',
      icon: Monitor,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  }

  const config = tipo && tiposConfig[tipo as keyof typeof tiposConfig]
  const Icon = config?.icon || List

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-950 p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${config?.bgColor || 'bg-primary/10'}`}
          >
            <Icon className={`h-6 w-6 ${config?.color || 'text-primary'}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {config?.title || 'Catálogo de Cursos'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {config?.description ||
                `${filteredCourses.length} cursos de ${cursos.length} totales`}
            </p>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Curso
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {/* Filtros principales */}
            <div className="flex-1 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative md:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, descripción o área..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los cursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los cursos</SelectItem>
                  <SelectItem value="privados">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600" />
                      Privados
                    </div>
                  </SelectItem>
                  <SelectItem value="teleformacion">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-600" />
                      Teleformación
                    </div>
                  </SelectItem>
                  <SelectItem value="ocupados">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                      Ocupados
                    </div>
                  </SelectItem>
                  <SelectItem value="desempleados">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      Desempleados
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por Área */}
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Áreas de cursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Áreas de cursos</SelectItem>
                  <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                  <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                  <SelectItem value="Diseño Gráfico">Diseño Gráfico</SelectItem>
                  <SelectItem value="Audiovisual">Audiovisual</SelectItem>
                  <SelectItem value="Gestión Empresarial">Gestión Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="hidden lg:block">
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>

          {(searchTerm || filterType !== 'all' || filterArea !== 'all') && (
            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('all')
                  setFilterArea('all')
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats - Resumen de Cursos */}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen de Cursos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
              <p className="text-3xl font-bold text-red-600">{cursosStats.privados}</p>
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">Cursos Privados</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
              <p className="text-3xl font-bold text-green-600">{cursosStats.ocupados}</p>
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Cursos Ocupados</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="text-3xl font-bold text-blue-600">{cursosStats.desempleados}</p>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Cursos Desempleados</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-900">
              <p className="text-3xl font-bold text-orange-600">{cursosStats.teleformacion}</p>
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide">Teleformación</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Cargando cursos...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">❌ {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Grid o Lista de Cursos */}
      {!loading && !error && view === 'grid' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseTemplateCard
              key={course.id}
              template={course}
              onClick={() => handleViewCourse(course)}
            />
          ))}
        </div>
      )}

      {!loading && !error && view === 'list' && (
        <div className="flex flex-col gap-2">
          {filteredCourses.map((course) => (
            <CourseListItem
              key={course.id}
              course={course}
              onClick={() => handleViewCourse(course)}
            />
          ))}
        </div>
      )}

      {/* Si no hay resultados */}
      {!loading && !error && filteredCourses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No se encontraron cursos que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
