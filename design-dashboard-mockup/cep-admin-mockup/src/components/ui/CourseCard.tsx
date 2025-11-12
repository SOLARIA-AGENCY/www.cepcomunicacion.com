import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, Euro, MapPin, User, Calendar, DoorOpen } from "lucide-react"
import { COURSE_TYPE_CONFIG } from "@/lib/courseTypeConfig"
import type { InstanciaVistaCompleta } from "@/types/courses"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CourseCardProps {
  instance: InstanciaVistaCompleta
  onClick?: () => void
  className?: string
}

export function CourseCard({ instance, onClick, className }: CourseCardProps) {
  const typeConfig = COURSE_TYPE_CONFIG[instance.tipo] || COURSE_TYPE_CONFIG.privados
  const occupancyPercentage = instance.porcentajeOcupacion

  return (
    <Card
      className={`course-instance-card cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-2 ${typeConfig.borderColor} ${className}`}
      onClick={onClick}
    >
      <div className={`h-2 ${typeConfig.bgColor}`} />

      <CardContent className="p-6 space-y-3 flex flex-col">
        {/* Header with Type Badge */}
        <div className="space-y-2">
          <Badge
            className={`${typeConfig.bgColor} ${typeConfig.hoverColor} text-white text-xs font-bold uppercase tracking-wide`}
          >
            {typeConfig.label}
          </Badge>

          {/* Título - ALTURA FIJA, 1 LÍNEA con ellipsis */}
          <div className="h-7 overflow-hidden">
            <h3
              className="font-bold text-lg leading-7 uppercase truncate"
              title={instance.nombreCurso}
            >
              {instance.nombreCurso}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">{instance.codigoCompleto}</p>
        </div>

        {/* Description - 3 líneas máx */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed h-16">
          {instance.descripcionCurso}
        </p>

        {/* NUEVOS CAMPOS: Fechas, Horario, Sede */}
        <div className="space-y-2">
          {/* Fechas */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-xs">
              {format(instance.fechaInicio, "dd/MM/yyyy", { locale: es })} -{" "}
              {format(instance.fechaFin, "dd/MM/yyyy", { locale: es })}
            </span>
          </div>

          {/* Horario */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-xs">{instance.horario}</span>
          </div>

          {/* Sede específica */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-xs">{instance.sedeNombre}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-bold">{instance.duracionHoras}H</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Euro className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {instance.precioConDescuento ? (
              <div className="flex items-center gap-1">
                <del className="text-xs text-gray-400">{instance.precio}€</del>
                <span className="font-bold text-red-600">{instance.precioConDescuento}€</span>
              </div>
            ) : (
              <span className={`font-bold ${typeConfig.textColor}`}>
                {instance.precio === 0 ? "GRATIS" : `${instance.precio}€`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs">
              {instance.plazasOcupadas}/{instance.plazasTotales}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DoorOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs">{instance.aulaNombre}</span>
          </div>
        </div>

        {/* Profesor */}
        <div className="flex items-center gap-2 py-2 border-t">
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            {instance.profesorAvatar && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={instance.profesorAvatar} alt={instance.profesorNombre} />
                <AvatarFallback className="text-[10px]">
                  {instance.profesorNombre
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="text-xs font-medium truncate">{instance.profesorNombre}</span>
          </div>
        </div>

        {/* Modalidad y Ocupación */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-xs uppercase">
            {instance.modalidad}
          </Badge>
          <span className="text-xs text-muted-foreground">{occupancyPercentage}% ocupado</span>
        </div>

        {/* Logos de Entidades Financiadoras */}
        {instance.subvencionado !== "no" && instance.entidadesFinanciadoras.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Financiado por:</p>
            <div className="flex gap-2 flex-wrap items-center">
              {instance.entidadesFinanciadoras.map((entidad) => (
                <img
                  key={entidad.id}
                  src={entidad.logo}
                  alt={entidad.nombre}
                  title={entidad.nombre}
                  className="entity-logo h-5 w-auto opacity-80 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Button with Type Color */}
        <Button
          className={`w-full ${typeConfig.bgColor} ${typeConfig.hoverColor} text-white font-bold uppercase tracking-wide shadow-md transition-all duration-300 mt-auto`}
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        >
          VER CURSO
        </Button>
      </CardContent>
    </Card>
  )
}

// Mini course card for compact views (teacher assignments, etc.)
interface CourseCardMiniProps {
  course: {
    id: string
    name: string
    code: string
    type: string
    modality: string
    students: number
  }
  className?: string
}

export function CourseCardMini({ course, className }: CourseCardMiniProps) {
  return (
    <Card className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-semibold text-sm leading-tight">{course.name}</p>
            <p className="text-xs text-muted-foreground">{course.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{course.students}</span>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {course.modality}
          </Badge>
        </div>
        <Badge variant="outline" className="text-[10px]">
          {course.type}
        </Badge>
      </CardContent>
    </Card>
  )
}
