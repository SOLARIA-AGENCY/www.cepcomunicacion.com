'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@payload-config/components/ui/card'
import { Button } from '@payload-config/components/ui/button'
import { Input } from '@payload-config/components/ui/input'
import { Label } from '@payload-config/components/ui/label'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  GraduationCap,
  Shield,
  Loader2
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoUrl, setLogoUrl] = useState('/logos/cep-logo-alpha.png')
  const [academyName, setAcademyName] = useState('CEP Formación')
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    remember: false,
  })

  // Fetch logo and academy config from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config?section=logos')
        if (response.ok) {
          const { data } = await response.json()
          setLogoUrl(data.claro || '/logos/cep-logo-alpha.png')
        }

        const academyResponse = await fetch('/api/config?section=academia')
        if (academyResponse.ok) {
          const { data } = await academyResponse.json()
          setAcademyName(data.nombre || 'CEP Formación')
        }
      } catch (error) {
        console.error('Error fetching config:', error)
      }
    }
    fetchConfig()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulated authentication - Replace with actual API call
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        // TODO: Implement actual authentication
        // For now, simulate successful login
        localStorage.setItem('cep_auth_token', 'demo_token_12345')
        localStorage.setItem('cep_user', JSON.stringify({
          id: 1,
          name: 'Admin User',
          email: credentials.email,
          role: 'Admin',
        }))
        router.push('/')
      } else {
        setError('Por favor completa todos los campos')
        setIsLoading(false)
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative rounded-full border-4 border-[#f2014b] p-6 bg-white shadow-xl shadow-[#f2014b]/30">
              <Image
                src={logoUrl}
                alt={academyName}
                width={280}
                height={112}
                className="h-28 w-auto"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold">{academyName}</h1>
          <p className="text-muted-foreground mt-2">Panel de Administración</p>
        </div>

        <Card className="shadow-2xl border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@cepcomunicacion.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a 
                    href="/auth/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={credentials.remember}
                  onChange={(e) => setCredentials({ ...credentials, remember: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="remember" className="cursor-pointer text-sm">
                  Recordar mi sesión
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Credenciales de demostración
                </p>
                <div className="bg-muted p-3 rounded-lg text-xs font-mono space-y-1">
                  <p>Email: admin@cepcomunicacion.com</p>
                  <p>Password: (cualquier contraseña)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 CEP FORMACIÓN Y COMUNICACIÓN S.L. Todos los derechos reservados.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a href="/legal/privacidad" className="hover:text-foreground transition-colors">
              Política de Privacidad
            </a>
            <span>•</span>
            <a href="/legal/terminos" className="hover:text-foreground transition-colors">
              Términos y Condiciones
            </a>
            <span>•</span>
            <a href="/legal/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
