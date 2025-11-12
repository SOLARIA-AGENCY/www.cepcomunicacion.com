import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Trash,
  Plus,
  X,
  Users,
  MapPin,
  BookOpen,
  Clock
} from "lucide-react"
import { teachersData, campusesData, cyclesData, type CourseDetailed } from "@/data/mockData"
import { COURSE_TYPE_CONFIG, type CourseType } from "@/lib/courseTypeConfig"

interface CourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  course?: CourseDetailed
}

export function CourseDialog({ open, onOpenChange, mode, course }: CourseDialogProps) {
  const isEdit = mode === 'edit'

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: course?.name || '',
    code: course?.code || '',
    type: course?.type || 'privados',
    modality: course?.modality || 'presencial',
    cycle_id: course?.cycle_id || '',
    duration_hours: course?.duration_hours || 0,
    price: course?.price || 0,
    max_students: course?.max_students || 0,
    current_students: course?.current_students || 0,
    description: course?.description || '',
    objectives: course?.objectives || [],
    requirements: course?.requirements || [],
    syllabus: course?.syllabus || [],
    teacher_ids: course?.teachers?.map(t => t.id) || [],
    campus_ids: course?.campuses?.map(c => c.id) || [],
    status: course?.status || 'draft',
    featured: course?.featured || false,
    start_date: course?.start_date || '',
    end_date: course?.end_date || '',
    enrollment_deadline: course?.enrollment_deadline || '',
    certificate_name: course?.certificate_name || ''
  })

  // Estados para agregar items dinámicos
  const [newObjective, setNewObjective] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newModule, setNewModule] = useState({ module: '', hours: 0, topics: [] as string[] })
  const [newTopic, setNewTopic] = useState('')

  const handleSave = () => {
    console.log('Guardar curso (MOCKUP):', formData)
    onOpenChange(false)
  }

  const handleDelete = () => {
    console.log('Eliminar curso (MOCKUP):', course?.id)
    onOpenChange(false)
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives, newObjective.trim()]
      })
      setNewObjective('')
    }
  }

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index)
    })
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()]
      })
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    })
  }

  const addModule = () => {
    if (newModule.module.trim() && newModule.hours > 0) {
      setFormData({
        ...formData,
        syllabus: [...formData.syllabus, { ...newModule }]
      })
      setNewModule({ module: '', hours: 0, topics: [] })
    }
  }

  const removeModule = (index: number) => {
    setFormData({
      ...formData,
      syllabus: formData.syllabus.filter((_, i) => i !== index)
    })
  }

  const addTopicToNewModule = () => {
    if (newTopic.trim()) {
      setNewModule({
        ...newModule,
        topics: [...newModule.topics, newTopic.trim()]
      })
      setNewTopic('')
    }
  }

  const removeTopicFromNewModule = (index: number) => {
    setNewModule({
      ...newModule,
      topics: newModule.topics.filter((_, i) => i !== index)
    })
  }

  const toggleTeacher = (teacherId: string) => {
    setFormData({
      ...formData,
      teacher_ids: formData.teacher_ids.includes(teacherId)
        ? formData.teacher_ids.filter(id => id !== teacherId)
        : [...formData.teacher_ids, teacherId]
    })
  }

  const toggleCampus = (campusId: string) => {
    setFormData({
      ...formData,
      campus_ids: formData.campus_ids.includes(campusId)
        ? formData.campus_ids.filter(id => id !== campusId)
        : [...formData.campus_ids, campusId]
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
            <TabsTrigger value="asignaciones">Profesores y Sedes</TabsTrigger>
            <TabsTrigger value="temario">Temario</TabsTrigger>
          </TabsList>

          {/* TAB 1: GENERAL */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Curso *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Community Manager Profesional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ej: CM-PRO-2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Curso *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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

                {/* Color Preview Badge */}
                {formData.type && COURSE_TYPE_CONFIG[formData.type as CourseType] && (
                  <Badge className={`${COURSE_TYPE_CONFIG[formData.type as CourseType].bgColor} text-white text-xs font-bold uppercase tracking-wide mt-2`}>
                    Vista Previa: {COURSE_TYPE_CONFIG[formData.type as CourseType].label}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="modality">Modalidad *</Label>
                <Select value={formData.modality} onValueChange={(value) => setFormData({ ...formData, modality: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="semipresencial">Semipresencial</SelectItem>
                    <SelectItem value="telematico">Telemático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycle">Ciclo Formativo (opcional)</Label>
                <Select value={formData.cycle_id} onValueChange={(value) => setFormData({ ...formData, cycle_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sin ciclo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin ciclo</SelectItem>
                    {cyclesData.map((cycle) => (
                      <SelectItem key={cycle.id} value={cycle.id}>
                        {cycle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_hours">Duración (horas) *</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 0 })}
                  placeholder="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_students">Máximo de Alumnos *</Label>
                <Input
                  id="max_students"
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 0 })}
                  placeholder="25"
                />
              </div>

              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="current_students">Alumnos Actuales (solo lectura)</Label>
                  <Input
                    id="current_students"
                    type="number"
                    value={formData.current_students}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="start_date">Fecha de Inicio</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Fecha de Fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment_deadline">Plazo de Matrícula</Label>
                <Input
                  id="enrollment_deadline"
                  type="date"
                  value={formData.enrollment_deadline}
                  onChange={(e) => setFormData({ ...formData, enrollment_deadline: e.target.value })}
                />
              </div>
            </div>

            {/* Certificado */}
            <div className="space-y-2">
              <Label htmlFor="certificate_name">Nombre del Certificado (opcional)</Label>
              <Input
                id="certificate_name"
                value={formData.certificate_name}
                onChange={(e) => setFormData({ ...formData, certificate_name: e.target.value })}
                placeholder="Ej: Certificado Profesional en Community Management"
              />
            </div>

            {/* Destacado */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Marcar como curso destacado (aparecerá en portada)
              </Label>
            </div>
          </TabsContent>

          {/* TAB 2: CONTENIDO */}
          <TabsContent value="contenido" className="space-y-4">
            {/* Descripción - OBLIGATORIA */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Curso * (OBLIGATORIA)</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción completa del curso, qué aprenderán los alumnos, metodología, certificación incluida..."
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 100 caracteres recomendado. Esta descripción se mostrará en la web pública.
              </p>
            </div>

            {/* Objetivos */}
            <div className="space-y-2">
              <Label>Objetivos del Curso</Label>
              <div className="flex gap-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Agregar objetivo..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addObjective()
                    }
                  }}
                />
                <Button type="button" size="icon" onClick={addObjective}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.objectives.map((obj, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {obj}
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Requisitos */}
            <div className="space-y-2">
              <Label>Requisitos Previos</Label>
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Agregar requisito..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addRequirement()
                    }
                  }}
                />
                <Button type="button" size="icon" onClick={addRequirement}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requirements.map((req, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: PROFESORES Y SEDES */}
          <TabsContent value="asignaciones" className="space-y-6">
            {/* Profesores */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Profesores Asignados ({formData.teacher_ids.length})
              </Label>
              <div className="grid gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {teachersData.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => toggleTeacher(teacher.id)}
                  >
                    <Checkbox
                      checked={formData.teacher_ids.includes(teacher.id)}
                      onCheckedChange={() => toggleTeacher(teacher.id)}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={teacher.photo} />
                      <AvatarFallback>{teacher.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {teacher.first_name} {teacher.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{teacher.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sedes */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Sedes Donde se Imparte ({formData.campus_ids.length})
              </Label>
              <div className="grid gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {campusesData.map((campus) => (
                  <div
                    key={campus.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => toggleCampus(campus.id)}
                  >
                    <Checkbox
                      checked={formData.campus_ids.includes(campus.id)}
                      onCheckedChange={() => toggleCampus(campus.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{campus.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {campus.address}, {campus.city}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {campus.code}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: TEMARIO */}
          <TabsContent value="temario" className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Módulos del Temario ({formData.syllabus.length})
              </Label>

              {/* Módulos existentes */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {formData.syllabus.map((module, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{module.module}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{module.hours} horas</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeModule(index)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    {module.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {module.topics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Agregar nuevo módulo */}
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium">Agregar Nuevo Módulo</p>

                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Nombre del módulo..."
                    value={newModule.module}
                    onChange={(e) => setNewModule({ ...newModule, module: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Horas"
                    value={newModule.hours || ''}
                    onChange={(e) => setNewModule({ ...newModule, hours: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Temas del módulo */}
                <div className="space-y-2">
                  <Label className="text-xs">Temas del Módulo (opcional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Agregar tema..."
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTopicToNewModule()
                        }
                      }}
                    />
                    <Button type="button" size="icon" onClick={addTopicToNewModule}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {newModule.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                        <button
                          type="button"
                          onClick={() => removeTopicFromNewModule(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button type="button" onClick={addModule} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Módulo
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog Footer */}
        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {isEdit ? 'Guardar Cambios' : 'Crear Curso'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
