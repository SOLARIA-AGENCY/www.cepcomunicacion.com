'use client'

import { Play, Users, Video, BookOpen, ClipboardCheck, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@payload-config/components/ui/card'
import { PageHeader } from '@payload-config/components/ui/PageHeader'

// Mock data for dashboard stats
const stats = [
  { label: 'Alumnos Activos', value: '248', change: '+12%', icon: Users },
  { label: 'Cursos en Curso', value: '15', change: '+3', icon: BookOpen },
  { label: 'Sesiones Hoy', value: '4', change: '', icon: Video },
  { label: 'Tareas Pendientes', value: '32', change: '-8', icon: ClipboardCheck },
]

const recentActivity = [
  { type: 'enrollment', message: 'María García se matriculó en "Inglés B2"', time: 'Hace 5 min' },
  { type: 'submission', message: 'Juan Pérez entregó tarea de "Marketing Digital"', time: 'Hace 15 min' },
  { type: 'live', message: 'Sesión en vivo iniciada: "Contabilidad Avanzada"', time: 'Hace 1h' },
  { type: 'announcement', message: 'Nuevo anuncio publicado: "Horarios de exámenes"', time: 'Hace 2h' },
]

const upcomingSessions = [
  { course: 'Marketing Digital', time: '10:00', instructor: 'Prof. Ana López' },
  { course: 'Inglés B2', time: '12:00', instructor: 'Prof. John Smith' },
  { course: 'Contabilidad', time: '16:00', instructor: 'Prof. Carlos Ruiz' },
]

export default function CampusDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Virtual"
        description="Panel de control del portal de alumnos"
        icon={Play}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <p className="text-xs text-muted-foreground">
                    {stat.change} vs. mes anterior
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" style={{ color: '#F2014B' }} />
              Próximas Sesiones
            </CardTitle>
            <CardDescription>Clases en vivo programadas para hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{session.course}</p>
                    <p className="text-sm text-muted-foreground">{session.instructor}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {session.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" style={{ color: '#F2014B' }} />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimas acciones en el campus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Status Banner */}
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Campus Virtual - Fase A (Mocks)</h3>
              <p className="text-sm text-muted-foreground">
                Esta es una versión mock del módulo. Los datos son de demostración.
                La funcionalidad completa se implementará en las fases B, C y D.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
