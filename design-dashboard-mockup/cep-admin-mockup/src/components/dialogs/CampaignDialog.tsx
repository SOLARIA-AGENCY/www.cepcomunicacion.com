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
import { cn } from "@/lib/utils"
import {
  Trash,
  TrendingUp,
  DollarSign,
  Users,
  Target
} from "lucide-react"
import { coursesData, campusesData, type CampaignDetailed } from "@/data/mockData"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  campaign?: CampaignDetailed
}

export function CampaignDialog({ open, onOpenChange, mode, campaign }: CampaignDialogProps) {
  const isEdit = mode === 'edit'

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    code: campaign?.code || '',
    type: campaign?.type || 'paid_ads',
    status: campaign?.status || 'borrador',
    description: campaign?.description || '',
    start_date: campaign?.start_date || '',
    end_date: campaign?.end_date || '',
    budget: campaign?.budget || 0,
    spent: campaign?.spent || 0,
    target_leads: campaign?.objectives.target_leads || 0,
    target_enrollments: campaign?.objectives.target_enrollments || 0,
    utm_source: campaign?.utm_params.utm_source || '',
    utm_medium: campaign?.utm_params.utm_medium || '',
    utm_campaign: campaign?.utm_params.utm_campaign || '',
    utm_term: campaign?.utm_params.utm_term || '',
    utm_content: campaign?.utm_params.utm_content || '',
    course_ids: campaign?.courses?.map(c => c.id) || [],
    campus_ids: campaign?.campuses?.map(c => c.id) || []
  })

  const handleSave = () => {
    console.log('Guardar campaña (MOCKUP):', formData)
    onOpenChange(false)
  }

  const handleDelete = () => {
    console.log('Eliminar campaña (MOCKUP):', campaign?.id)
    onOpenChange(false)
  }

  const toggleCourse = (courseId: string) => {
    setFormData({
      ...formData,
      course_ids: formData.course_ids.includes(courseId)
        ? formData.course_ids.filter(id => id !== courseId)
        : [...formData.course_ids, courseId]
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
            {isEdit ? 'Editar Campaña' : 'Crear Nueva Campaña'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
            <TabsTrigger value="cursos">Cursos y Sedes</TabsTrigger>
          </TabsList>

          {/* TAB 1: GENERAL */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Campaña *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Lanzamiento Cursos Marketing Digital 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ej: MKT-LAUNCH-2025-Q1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Campaña *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="paid_ads">Paid Ads (Meta/Google)</SelectItem>
                    <SelectItem value="organic">Orgánico</SelectItem>
                    <SelectItem value="event">Evento/Webinar</SelectItem>
                    <SelectItem value="referral">Programa de Referencias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="pausada">Pausada</SelectItem>
                    <SelectItem value="finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Fecha de Inicio *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Fecha de Fin *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto Total (€) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  placeholder="3500"
                />
              </div>

              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="spent">Gastado (€) - Solo lectura</Label>
                  <Input
                    id="spent"
                    type="number"
                    value={formData.spent}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}
            </div>

            {/* Descripción - OBLIGATORIA */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción de la Campaña * (OBLIGATORIA)</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe los objetivos, público objetivo, estrategia, canales utilizados y expectativas de la campaña..."
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 100 caracteres recomendado. Incluye público objetivo y estrategia.
              </p>
            </div>
          </TabsContent>

          {/* TAB 2: CONFIGURACIÓN */}
          <TabsContent value="configuracion" className="space-y-4">
            {/* Objetivos */}
            <div className="space-y-3">
              <Label>Objetivos de la Campaña</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="target_leads">Leads Objetivo *</Label>
                  <Input
                    id="target_leads"
                    type="number"
                    value={formData.target_leads}
                    onChange={(e) => setFormData({ ...formData, target_leads: parseInt(e.target.value) || 0 })}
                    placeholder="150"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_enrollments">Matriculaciones Objetivo *</Label>
                  <Input
                    id="target_enrollments"
                    type="number"
                    value={formData.target_enrollments}
                    onChange={(e) => setFormData({ ...formData, target_enrollments: parseInt(e.target.value) || 0 })}
                    placeholder="25"
                  />
                </div>
              </div>
            </div>

            {/* Parámetros UTM */}
            <div className="space-y-3 border-t pt-4">
              <Label>Parámetros UTM (Tracking)</Label>
              <p className="text-xs text-muted-foreground">
                Configuración de parámetros para seguimiento de tráfico en Google Analytics
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="utm_source">UTM Source *</Label>
                  <Input
                    id="utm_source"
                    value={formData.utm_source}
                    onChange={(e) => setFormData({ ...formData, utm_source: e.target.value })}
                    placeholder="Ej: meta, google, mailchimp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_medium">UTM Medium *</Label>
                  <Input
                    id="utm_medium"
                    value={formData.utm_medium}
                    onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value })}
                    placeholder="Ej: cpc, email, organic"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_campaign">UTM Campaign *</Label>
                  <Input
                    id="utm_campaign"
                    value={formData.utm_campaign}
                    onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value })}
                    placeholder="Ej: mkt-launch-2025-q1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_term">UTM Term (opcional)</Label>
                  <Input
                    id="utm_term"
                    value={formData.utm_term}
                    onChange={(e) => setFormData({ ...formData, utm_term: e.target.value })}
                    placeholder="Ej: certificacion-ccna"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="utm_content">UTM Content (opcional)</Label>
                  <Input
                    id="utm_content"
                    value={formData.utm_content}
                    onChange={(e) => setFormData({ ...formData, utm_content: e.target.value })}
                    placeholder="Ej: carousel-testimonials, video-ad"
                  />
                </div>
              </div>

              {/* Preview URL */}
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs font-medium mb-1">Vista Previa URL de Tracking:</p>
                <code className="text-xs break-all">
                  https://cepcomunicacion.com/?utm_source={formData.utm_source || 'SOURCE'}&utm_medium={formData.utm_medium || 'MEDIUM'}&utm_campaign={formData.utm_campaign || 'CAMPAIGN'}
                  {formData.utm_term && `&utm_term=${formData.utm_term}`}
                  {formData.utm_content && `&utm_content=${formData.utm_content}`}
                </code>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: MÉTRICAS */}
          <TabsContent value="metricas" className="space-y-4">
            {isEdit && campaign ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Total Leads */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{campaign.metrics.total_leads}</div>
                      <p className="text-xs text-muted-foreground">
                        Objetivo: {campaign.objectives.target_leads} ({Math.round((campaign.metrics.total_leads / campaign.objectives.target_leads) * 100)}% alcanzado)
                      </p>
                    </CardContent>
                  </Card>

                  {/* Total Matriculaciones */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Matriculaciones</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{campaign.metrics.total_enrollments}</div>
                      <p className="text-xs text-muted-foreground">
                        Objetivo: {campaign.objectives.target_enrollments} ({Math.round((campaign.metrics.total_enrollments / campaign.objectives.target_enrollments) * 100)}% alcanzado)
                      </p>
                    </CardContent>
                  </Card>

                  {/* Tasa de Conversión */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{campaign.metrics.conversion_rate.toFixed(2)}%</div>
                      <p className="text-xs text-muted-foreground">
                        {campaign.metrics.conversion_rate > 15 ? 'Excelente rendimiento' : 'Por debajo del objetivo (15%)'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Coste por Lead */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Coste por Lead</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{campaign.metrics.cost_per_lead.toFixed(2)}€</div>
                      <p className="text-xs text-muted-foreground">
                        CPE: {campaign.metrics.cost_per_enrollment.toFixed(2)}€
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Presupuesto */}
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Presupuesto y Gasto</span>
                    <Badge variant={campaign.spent > campaign.budget ? 'destructive' : 'default'}>
                      {Math.round((campaign.spent / campaign.budget) * 100)}% utilizado
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        campaign.spent > campaign.budget ? "bg-destructive" : "bg-primary"
                      )}
                      style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Gastado: {campaign.spent.toLocaleString('es-ES')}€</span>
                    <span>Presupuesto: {campaign.budget.toLocaleString('es-ES')}€</span>
                  </div>
                </div>

                {/* ROI Estimado */}
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">ROI Estimado</p>
                  <p className="text-xs text-muted-foreground">
                    Asumiendo precio medio de 800€ por matrícula:
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs">
                      Ingresos estimados: {(campaign.metrics.total_enrollments * 800).toLocaleString('es-ES')}€
                    </p>
                    <p className="text-xs">
                      Gasto: {campaign.spent.toLocaleString('es-ES')}€
                    </p>
                    <p className="text-sm font-medium mt-2">
                      ROI: {(((campaign.metrics.total_enrollments * 800 - campaign.spent) / campaign.spent) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Las métricas estarán disponibles una vez creada la campaña</p>
              </div>
            )}
          </TabsContent>

          {/* TAB 4: CURSOS Y SEDES */}
          <TabsContent value="cursos" className="space-y-6">
            {/* Cursos */}
            <div className="space-y-3">
              <Label>Cursos Asociados ({formData.course_ids.length})</Label>
              <p className="text-xs text-muted-foreground">
                Selecciona los cursos que se promocionan en esta campaña
              </p>
              <div className="grid gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {coursesData.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => toggleCourse(course.id)}
                  >
                    <Checkbox
                      checked={formData.course_ids.includes(course.id)}
                      onCheckedChange={() => toggleCourse(course.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.code}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {course.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Sedes */}
            <div className="space-y-3">
              <Label>Sedes de Impartición ({formData.campus_ids.length})</Label>
              <p className="text-xs text-muted-foreground">
                Selecciona las sedes donde se impartirán los cursos promocionados
              </p>
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
                {isEdit ? 'Guardar Cambios' : 'Crear Campaña'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
