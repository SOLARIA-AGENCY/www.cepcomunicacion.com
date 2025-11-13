import { Button } from "@payload-config/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@payload-config/components/ui/card"
import { Badge } from "@payload-config/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard CEP Admin</h1>
          <p className="text-muted-foreground">Sistema de gestión de contenidos - Migración en progreso</p>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tailwind CSS</CardTitle>
                <Badge variant="default">✓ Instalado</Badge>
              </div>
              <CardDescription>Versión 4.0 con CSS variables</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sistema de diseño configurado con todas las variables CSS del mockup.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>shadcn/ui</CardTitle>
                <Badge variant="default">✓ Instalado</Badge>
              </div>
              <CardDescription>Biblioteca de componentes UI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Componentes: Button, Card, Badge, Input, DropdownMenu instalados.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Next.js</CardTitle>
                <Badge variant="default">✓ Running</Badge>
              </div>
              <CardDescription>Framework React 19 + TypeScript</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                App Router configurado con rutas (dashboard).
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Test Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Prueba de Componentes</CardTitle>
            <CardDescription>Verificación de estilos y funcionalidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Próximos Pasos</CardTitle>
            <CardDescription>Migración del diseño completo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">✅ Tailwind CSS configurado</p>
            <p className="text-sm">✅ shadcn/ui inicializado</p>
            <p className="text-sm">✅ Componentes base instalados</p>
            <p className="text-sm text-muted-foreground">⏳ Implementar DashboardLayout del mockup</p>
            <p className="text-sm text-muted-foreground">⏳ Implementar AppSidebar con menús</p>
            <p className="text-sm text-muted-foreground">⏳ Migrar páginas de cursos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
