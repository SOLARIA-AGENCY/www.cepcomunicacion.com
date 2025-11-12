import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  Star,
} from "lucide-react"
// import { CourseDialog } from "@/components/dialogs/CourseDialog" // DESHABILITADO: Necesita adaptación
import { CourseCard } from "@/components/ui/CourseCard"
import { instanciasData, instanciasStats } from "@/data/mockData"

export function CoursesPage() {
  const navigate = useNavigate()

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterModality, setFilterModality] = useState('all')
  const [filterSede, setFilterSede] = useState('all') // NUEVO
  const [filterEstado, setFilterEstado] = useState('all') // NUEVO
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const handleAdd = () => {
    // TODO: Implementar diálogo de creación de instancia
    console.log('Agregar convocatoria')
  }

  const handleViewInstance = (instance: typeof instanciasData[0]) => {
    navigate(`/cursos/${instance.plantillaId}/instancia/${instance.id}`)
  }

  // Filtrado de instancias
  const filteredInstances = instanciasData.filter(instance => {
    const matchesSearch =
      instance.nombreCurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.codigoCompleto.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || instance.tipo === filterType
    const matchesModality = filterModality === 'all' || instance.modalidad === filterModality
    const matchesSede = filterSede === 'all' || instance.sedeId === filterSede // NUEVO
    const matchesEstado = filterEstado === 'all' || instance.estado === filterEstado // NUEVO

    return matchesSearch && matchesType && matchesModality && matchesSede && matchesEstado
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Cursos</h1>
          <p className="text-muted-foreground">
            {filteredInstances.length} convocatorias disponibles
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Convocatoria
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
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
                <SelectItem value="ciclo-medio">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    Ciclo Medio
                  </div>
                </SelectItem>
                <SelectItem value="ciclo-superior">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600" />
                    Ciclo Superior
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterModality} onValueChange={setFilterModality}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las modalidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las modalidades</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="semipresencial">Semipresencial</SelectItem>
                <SelectItem value="telematico">Telemático</SelectItem>
              </SelectContent>
            </Select>

            {/* NUEVO: Filtro por Sede */}
            <Select value={filterSede} onValueChange={setFilterSede}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las sedes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las sedes</SelectItem>
                <SelectItem value="sede-norte">CEP Norte</SelectItem>
                <SelectItem value="sede-sur">CEP Sur</SelectItem>
                <SelectItem value="sede-santa-cruz">CEP Santa Cruz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Segunda fila de filtros */}
          <div className="flex items-center gap-4 mt-4">
            {/* NUEVO: Filtro por Estado */}
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="abierta">Inscripciones abiertas</SelectItem>
                <SelectItem value="planificada">Próximamente</SelectItem>
                <SelectItem value="en_curso">En curso</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            >
              <Star className="h-4 w-4 mr-2" />
              Solo Destacados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Instancias */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInstances.map((instance) => (
          <CourseCard
            key={instance.id}
            instance={instance}
            onClick={() => handleViewInstance(instance)}
          />
        ))}
      </div>

      {/* Si no hay resultados */}
      {filteredInstances.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No se encontraron convocatorias que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats - Estadísticas de instancias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen de Convocatorias</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{instanciasStats.total}</p>
            <p className="text-xs text-muted-foreground">Convocatorias totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{instanciasStats.abiertas}</p>
            <p className="text-xs text-muted-foreground">Inscripciones abiertas</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{instanciasStats.planificadas}</p>
            <p className="text-xs text-muted-foreground">Próximamente</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {instanciasStats.plazasOcupadas}/{instanciasStats.plazasTotales}
            </p>
            <p className="text-xs text-muted-foreground">Plazas ocupadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{instanciasStats.ocupacionPromedio}%</p>
            <p className="text-xs text-muted-foreground">Ocupación promedio</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog - TEMPORALMENTE DESHABILITADO: Necesita adaptación para instancias */}
      {/*
      <CourseDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode={dialogMode}
        course={selected || undefined}
      />
      */}
    </div>
  )
}
