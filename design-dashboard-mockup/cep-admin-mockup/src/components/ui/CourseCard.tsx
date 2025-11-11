import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={() => navigate(`/cursos?highlight=${course.id}`)}
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
