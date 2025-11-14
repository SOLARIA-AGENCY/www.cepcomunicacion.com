'use client'

import { Badge } from '@payload-config/components/ui/badge'
import { Button } from '@payload-config/components/ui/button'
import { BookOpen, Calendar } from 'lucide-react'
import { COURSE_TYPE_CONFIG } from '@payload-config/lib/courseTypeConfig'
import type { PlantillaCurso } from '@/types'

interface CourseListItemProps {
  course: PlantillaCurso
  onClick?: () => void
  className?: string
}

export function CourseListItem({ course, onClick, className }: CourseListItemProps) {
  const typeConfig = COURSE_TYPE_CONFIG[course.tipo] || COURSE_TYPE_CONFIG.privados

  return (
    <div
      className={`flex items-center h-20 pr-4 bg-card border-y border-r rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-150 cursor-pointer ${className || ''}`}
      onClick={onClick}
    >
      {/* Borde de color como div separado - PEGADO a la imagen */}
      <div className={`h-full w-1 flex-shrink-0 ${typeConfig.bgColor}`} />

      {/* Thumbnail - Pegada al borde sin gap */}
      <div className="flex-shrink-0 h-full">
        <img
          src={course.imagenPortada}
          alt={course.nombre}
          className="h-full w-20 object-cover"
        />
      </div>

      {/* Contenido con padding interno */}
      <div className="flex items-center flex-1 gap-3 pl-4">
        {/* Title + Area */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate leading-tight mb-0.5" title={course.nombre}>
            {course.nombre}
          </h3>
          <p className="text-xs text-muted-foreground truncate">{course.area}</p>
        </div>

        {/* Duration + Convocations - Compacto */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{course.duracionReferencia}H</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {course.totalConvocatorias} conv.
            </span>
          </div>
        </div>

        {/* Type Badge - Más pequeño */}
        <div className="hidden lg:block w-[160px] flex justify-center">
          <Badge
            className={`${typeConfig.bgColor} ${typeConfig.hoverColor} text-white text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap px-2.5 py-1 leading-tight`}
          >
            {typeConfig.label}
          </Badge>
        </div>

        {/* Price - Compacto */}
        <div className="hidden md:block w-[140px] text-right">
          {course.precioReferencia !== undefined && course.precioReferencia > 0 ? (
            <span className={`font-bold text-base ${typeConfig.textColor}`}>
              {course.precioReferencia}€
            </span>
          ) : (
            <span className="text-green-600 font-semibold text-xs whitespace-nowrap leading-tight">
              100% SUBVENCIONADO
            </span>
          )}
        </div>

        {/* Action Button - Compacto */}
        <Button
          size="sm"
          className={`${typeConfig.bgColor} ${typeConfig.hoverColor} text-white text-xs font-semibold uppercase tracking-wide shrink-0 h-7 px-3`}
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        >
          VER
        </Button>
      </div>
    </div>
  )
}
