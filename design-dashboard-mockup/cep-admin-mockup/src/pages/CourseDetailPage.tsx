import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { coursesData, campuses, type CourseDetailed } from "@/data/mockData"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  Plus,
  X,
  Eye,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Star,
} from "lucide-react"
import { COURSE_TYPE_CONFIG, type CourseType } from "@/lib/courseTypeConfig"

export function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find course by ID
  const course = coursesData.find((c) => c.id === id)

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Curso no encontrado</CardTitle>
            <CardDescription>El curso con ID {id} no existe</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/cursos")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [formData, setFormData] = useState<CourseDetailed>(course)
  const [hasChanges, setHasChanges] = useState(false)
  const [newModule, setNewModule] = useState({ module: "", hours: 0, topics: [""] })

  const typeConfig = COURSE_TYPE_CONFIG[course.type] || COURSE_TYPE_CONFIG.privados

  const handleInputChange = (field: keyof CourseDetailed, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log("Saving course:", formData)
    setHasChanges(false)
    // TODO: API call to save course
  }

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      console.log("Deleting course:", course.id)
      navigate("/cursos")
    }
  }

  const addObjective = () => {
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }))
    setHasChanges(true)
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives]
    newObjectives[index] = value
    setFormData((prev) => ({ ...prev, objectives: newObjectives }))
    setHasChanges(true)
  }

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }))
    setHasChanges(true)
  }

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }))
    setHasChanges(true)
  }

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData((prev) => ({ ...prev, requirements: newRequirements }))
    setHasChanges(true)
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
    setHasChanges(true)
  }

  const addModule = () => {
    if (newModule.module && newModule.hours > 0) {
      setFormData((prev) => ({
        ...prev,
        syllabus: [...prev.syllabus, { ...newModule, topics: newModule.topics.filter(t => t.trim()) }],
      }))
      setNewModule({ module: "", hours: 0, topics: [""] })
      setHasChanges(true)
    }
  }

  const removeModule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index),
    }))
    setHasChanges(true)
  }

  const occupancyPercentage = Math.round(
    (formData.current_students / formData.max_students) * 100
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cursos")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
                {formData.featured && (
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <p className="text-muted-foreground">
                {course.code} • Edición y gestión del curso
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.open(`/cursos/${course.id}/preview`, '_blank')}>
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            {hasChanges ? "Guardar Cambios" : "Guardado"}
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
              <span className="text-sm text-muted-foreground">Estado:</span>
              <Badge
                variant={
                  formData.status === "published"
                    ? "default"
                    : formData.status === "draft"
                    ? "secondary"
                    : "outline"
                }
              >
                {formData.status === "published"
                  ? "Publicado"
                  : formData.status === "draft"
                  ? "Borrador"
                  : "Archivado"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ocupación:</span>
              <span className="text-sm font-bold">
                {formData.current_students}/{formData.max_students} ({occupancyPercentage}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {hasChanges && (
              <Alert className="py-2 px-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Cambios sin guardar</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="media">Fotografía y Media</TabsTrigger>
          <TabsTrigger value="capacity">Capacidad y Fechas</TabsTrigger>
          <TabsTrigger value="assignment">Asignación</TabsTrigger>
          <TabsTrigger value="syllabus">Temario</TabsTrigger>
          <TabsTrigger value="pricing">Precios y Becas</TabsTrigger>
          <TabsTrigger value="advertising">Publicidad</TabsTrigger>
        </TabsList>

        {/* Tab 1: Información Básica */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica del Curso</CardTitle>
              <CardDescription>
                Datos principales del curso: nombre, código, descripción, objetivos y requisitos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Curso *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ej: Community Manager Profesional"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.name.length}/120 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Código del Curso *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="Ej: CM-PRO-2025"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Curso *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      handleInputChange("type", value as CourseType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="privados">Privados</SelectItem>
                      <SelectItem value="ocupados">Ocupados</SelectItem>
                      <SelectItem value="desempleados">Desempleados</SelectItem>
                      <SelectItem value="teleformacion">Teleformación</SelectItem>
                      <SelectItem value="ciclo-medio">Ciclo Medio</SelectItem>
                      <SelectItem value="ciclo-superior">Ciclo Superior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidad *</Label>
                  <Select
                    value={formData.modality}
                    onValueChange={(value) => handleInputChange("modality", value)}
                  >
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
                  <Label htmlFor="duration_hours">Duración (horas) *</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    value={formData.duration_hours}
                    onChange={(e) =>
                      handleInputChange("duration_hours", parseInt(e.target.value))
                    }
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción del Curso *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={5}
                  placeholder="Descripción completa del curso, qué aprenderán los alumnos, beneficios, etc."
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/600 caracteres •{" "}
                  {formData.description.length < 150 && (
                    <span className="text-orange-600">
                      Mínimo recomendado: 150 caracteres
                    </span>
                  )}
                  {formData.description.length >= 150 && (
                    <span className="text-green-600">Longitud adecuada</span>
                  )}
                </p>
              </div>

              {/* Objectives */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Objetivos del Curso</Label>
                  <Button variant="outline" size="sm" onClick={addObjective}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Objetivo
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground min-w-6">
                        {index + 1}.
                      </span>
                      <Input
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        placeholder="Ej: Crear estrategias de contenido para redes sociales"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeObjective(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Requisitos de Acceso</Label>
                  <Button variant="outline" size="sm" onClick={addRequirement}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Requisito
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground min-w-6">
                        {index + 1}.
                      </span>
                      <Input
                        value={requirement}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder="Ej: Conocimientos básicos de informática"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Fotografía y Media */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fotografía y Materiales</CardTitle>
              <CardDescription>
                Imagen destacada del curso y materiales descargables (PDFs, documentos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Imagen Destacada del Curso</Label>
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleInputChange("image", undefined)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No hay imagen. Arrastra una imagen aquí o haz clic para subir.
                    </p>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Imagen
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Formato recomendado: JPG o PNG, 1200x800px, máximo 2MB
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Galería de Imágenes (Adicionales)</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Imágenes
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="border-2 border-dashed rounded-lg aspect-square flex items-center justify-center">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Materiales PDF / Documentos</Label>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Documentos
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <FileText className="mr-2 h-5 w-5" />
                    No hay documentos subidos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Capacidad y Fechas */}
        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Capacidad y Fechas</CardTitle>
              <CardDescription>
                Gestión de plazas disponibles y calendario del curso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="max_students">Plazas Máximas *</Label>
                  <Input
                    id="max_students"
                    type="number"
                    value={formData.max_students}
                    onChange={(e) =>
                      handleInputChange("max_students", parseInt(e.target.value))
                    }
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current_students">Plazas Ocupadas</Label>
                  <Input
                    id="current_students"
                    type="number"
                    value={formData.current_students}
                    onChange={(e) =>
                      handleInputChange("current_students", parseInt(e.target.value))
                    }
                    min="0"
                    max={formData.max_students}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Disponibilidad</Label>
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted">
                    <span className="text-sm font-medium">
                      {formData.max_students - formData.current_students} plazas libres
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({occupancyPercentage}% ocupado)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Fecha de Inicio</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={(e) => handleInputChange("start_date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Fecha de Finalización</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date || ""}
                    onChange={(e) => handleInputChange("end_date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollment_deadline">
                    Fecha Límite de Inscripción
                  </Label>
                  <Input
                    id="enrollment_deadline"
                    type="date"
                    value={formData.enrollment_deadline || ""}
                    onChange={(e) =>
                      handleInputChange("enrollment_deadline", e.target.value)
                    }
                  />
                </div>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Las fechas son orientativas. Las convocatorias específicas se gestionan en la
                  sección de Programación.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Asignación */}
        <TabsContent value="assignment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asignación de Recursos</CardTitle>
              <CardDescription>
                Sedes, aulas y profesores asignados a este curso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Sedes Disponibles</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {campuses.map((campus) => (
                    <div
                      key={campus.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.campuses.some((c) => c.id === campus.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange("campuses", [
                                ...formData.campuses,
                                { id: campus.id, name: campus.name, code: campus.name.split(" ")[1].toUpperCase() },
                              ])
                            } else {
                              handleInputChange(
                                "campuses",
                                formData.campuses.filter((c) => c.id !== campus.id)
                              )
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <div>
                          <p className="font-medium">{campus.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {campus.city} • {campus.classrooms_count} aulas
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{campus.active ? "Activo" : "Inactivo"}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Profesores Asignados</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Asignar Profesor
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.photo}
                          alt={teacher.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">Profesor asignado</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Aula Asignada (Opcional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar aula" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    <SelectItem value="101">Aula 101 - CEP Norte</SelectItem>
                    <SelectItem value="102">Aula 102 - CEP Norte</SelectItem>
                    <SelectItem value="lab">Laboratorio de Medios - CEP Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Temario */}
        <TabsContent value="syllabus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temario y Plan de Estudios</CardTitle>
              <CardDescription>
                Módulos, temas y contenido del curso (visible en la web pública)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing modules */}
              <div className="space-y-4">
                {formData.syllabus.map((module, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{module.module}</CardTitle>
                          <CardDescription>
                            {module.hours} horas • {module.topics.length} temas
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeModule(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="text-sm text-muted-foreground">
                            • {topic}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add new module */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">Agregar Nuevo Módulo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nombre del Módulo</Label>
                      <Input
                        value={newModule.module}
                        onChange={(e) =>
                          setNewModule((prev) => ({ ...prev, module: e.target.value }))
                        }
                        placeholder="Ej: Fundamentos de Marketing Digital"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horas del Módulo</Label>
                      <Input
                        type="number"
                        value={newModule.hours}
                        onChange={(e) =>
                          setNewModule((prev) => ({
                            ...prev,
                            hours: parseInt(e.target.value) || 0,
                          }))
                        }
                        min="1"
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Temas del Módulo</Label>
                    {newModule.topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={topic}
                          onChange={(e) => {
                            const newTopics = [...newModule.topics]
                            newTopics[index] = e.target.value
                            setNewModule((prev) => ({ ...prev, topics: newTopics }))
                          }}
                          placeholder="Ej: Introducción al marketing digital"
                        />
                        {index === newModule.topics.length - 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setNewModule((prev) => ({
                                ...prev,
                                topics: [...prev.topics, ""],
                              }))
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                        {newModule.topics.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setNewModule((prev) => ({
                                ...prev,
                                topics: prev.topics.filter((_, i) => i !== index),
                              }))
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button onClick={addModule} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Módulo
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Precios y Becas */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Precios y Becas</CardTitle>
              <CardDescription>
                Configuración de precios, descuentos y ayudas disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio del Curso (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange("price", parseFloat(e.target.value))
                    }
                    min="0"
                    step="0.01"
                  />
                  {formData.price === 0 && (
                    <p className="text-xs text-green-600">
                      Curso gratuito o 100% subvencionado
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate_name">Nombre del Certificado</Label>
                  <Input
                    id="certificate_name"
                    value={formData.certificate_name || ""}
                    onChange={(e) =>
                      handleInputChange("certificate_name", e.target.value)
                    }
                    placeholder="Ej: Certificado Profesional en..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Descuentos y Promociones</Label>
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      No hay descuentos configurados para este curso
                    </p>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Descuento
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Label>Becas y Ayudas</Label>
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      No hay becas configuradas para este curso
                    </p>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Beca
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {formData.type === "ocupados" && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Este curso es bonificable por FUNDAE para trabajadores en activo
                  </AlertDescription>
                </Alert>
              )}

              {formData.type === "desempleados" && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Este curso está subvencionado al 100% por el Servicio Canario de Empleo
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7: Publicidad */}
        <TabsContent value="advertising" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publicidad y Marketing</CardTitle>
              <CardDescription>
                Configuración SEO, destacados y materiales publicitarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="featured">Curso Destacado</Label>
                  <p className="text-sm text-muted-foreground">
                    Aparecerá en la portada y tendrá prioridad en búsquedas
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Descripción SEO</Label>
                <Textarea
                  id="meta_description"
                  rows={3}
                  placeholder="Descripción corta para motores de búsqueda (recomendado: 150-160 caracteres)"
                  defaultValue={formData.description.substring(0, 160)}
                />
                <p className="text-xs text-muted-foreground">
                  Esta descripción aparecerá en resultados de Google
                </p>
              </div>

              <div className="space-y-4">
                <Label>Anuncios Generados con IA</Label>
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      No hay anuncios generados todavía
                    </p>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Generar Anuncios con IA
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Label>Materiales Promocionales</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Banners Web</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Subir Banners
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Posts Redes Sociales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Posts
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
