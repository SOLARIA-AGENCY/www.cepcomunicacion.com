import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, GraduationCap } from 'lucide-react'
import { CicloCard } from '@/components/ui/CicloCard'
import { CICLOS_PLANTILLA_MOCK } from '@/data/mockCiclos'
import { TipoCiclo } from '@/types'

export function CiclosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState<TipoCiclo | 'todos'>('todos')

  const ciclosFiltrados = CICLOS_PLANTILLA_MOCK.filter((ciclo) => {
    const matchSearch =
      ciclo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ciclo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ciclo.familia_profesional.toLowerCase().includes(searchTerm.toLowerCase())

    const matchTipo = tipoFiltro === 'todos' || ciclo.tipo === tipoFiltro

    return matchSearch && matchTipo
  })

  const totalAlumnos = CICLOS_PLANTILLA_MOCK.reduce((sum, c) => sum + c.total_alumnos, 0)
  const totalInstancias = CICLOS_PLANTILLA_MOCK.reduce((sum, c) => sum + c.total_instancias, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ciclos Formativos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los ciclos de formación profesional (Grado Medio y Superior)
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          NUEVO CICLO
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ciclos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{CICLOS_PLANTILLA_MOCK.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Convocatorias Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalInstancias}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Alumnos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAlumnos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Grado Superior / Medio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {CICLOS_PLANTILLA_MOCK.filter((c) => c.tipo === 'superior').length} /{' '}
              {CICLOS_PLANTILLA_MOCK.filter((c) => c.tipo === 'medio').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, código o familia profesional..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipoFiltro} onValueChange={(v) => setTipoFiltro(v as TipoCiclo | 'todos')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de ciclo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="superior">Grado Superior</SelectItem>
                <SelectItem value="medio">Grado Medio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ciclos Grid (3 columnas, cards ocupan 2) */}
      <div className="grid grid-cols-6 gap-6">
        {ciclosFiltrados.map((ciclo) => (
          <CicloCard key={ciclo.id} ciclo={ciclo} />
        ))}
      </div>

      {ciclosFiltrados.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold">No se encontraron ciclos</p>
            <p className="text-sm text-muted-foreground">
              Prueba a ajustar los filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
