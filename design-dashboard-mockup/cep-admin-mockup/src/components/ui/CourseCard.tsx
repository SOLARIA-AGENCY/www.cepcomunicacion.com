import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, Euro, MapPin, User } from "lucide-react"
import { COURSE_TYPE_CONFIG, type CourseType } from "@/lib/courseTypeConfig"

interface CourseCardProps {
  course: {
    id: string
    name: string
    code: string
    type: CourseType
    modality: string
    duration_hours: number
    price: number
    max_students: number
    current_students: number
    description: string
    campuses: Array<{ id: string; name: string }>
    teachers?: Array<{ id: string; name: string; photo?: string }>
  }
  onClick?: () => void
  className?: string
}

export function CourseCard({ course, onClick, className }: CourseCardProps) {
  const typeConfig = COURSE_TYPE_CONFIG[course.type] || COURSE_TYPE_CONFIG.privados
  const occupancyPercentage = Math.round((course.current_students / course.max_students) * 100)

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
      onClick={onClick}
    >
      <div className={`h-2 ${typeConfig.bgColor}`} />

      <CardContent className="p-6 space-y-4">
        {/* Header with Type Badge */}
        <div className="space-y-3">
          <Badge
            className={`${typeConfig.bgColor} ${typeConfig.hoverColor} text-white text-xs font-bold uppercase tracking-wide`}
          >
            {typeConfig.label}
          </Badge>

          <div>
            <h3 className="font-bold text-lg leading-tight uppercase line-clamp-2">
              {course.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{course.code}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-bold">{course.duration_hours}H</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Euro className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className={`font-bold ${typeConfig.textColor}`}>
              {course.price === 0 ? 'GRATIS' : `${course.price}€`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs">
              {course.current_students}/{course.max_students}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs">
              {course.campuses.length} {course.campuses.length === 1 ? 'sede' : 'sedes'}
            </span>
          </div>
        </div>

        {/* Teachers Section */}
        {course.teachers && course.teachers.length > 0 && (
          <div className="flex items-center gap-2 py-2 border-t">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              {course.teachers.slice(0, 2).map((teacher) => (
                <div key={teacher.id} className="flex items-center gap-1.5">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={teacher.photo} alt={teacher.name} />
                    <AvatarFallback className="text-[10px]">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium truncate">
                    {teacher.name}
                  </span>
                </div>
              ))}
              {course.teachers.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{course.teachers.length - 2} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Modality Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs uppercase">
            {course.modality}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {occupancyPercentage}% ocupado
          </span>
        </div>

        {/* CTA Button with Type Color */}
        <Button
          className={`w-full ${typeConfig.bgColor} ${typeConfig.hoverColor} text-white font-bold uppercase tracking-wide shadow-md transition-all duration-300`}
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
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
    >
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
