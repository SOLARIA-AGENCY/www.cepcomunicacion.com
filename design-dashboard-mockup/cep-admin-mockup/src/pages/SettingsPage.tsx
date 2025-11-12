import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import {
  Building2,
  Bell,
  Plug,
  Shield,
  Save,
  Upload,
  X
} from "lucide-react"

export function SettingsPage() {
  // Estados para configuración general
  const [generalSettings, setGeneralSettings] = useState({
    centerName: 'CEP Comunicación',
    centerDescription: 'Centro de Estudios Profesionales especializado en formación en comunicación, marketing digital y desarrollo web. Más de 15 años formando profesionales en Tenerife.',
    email: 'info@cepcomunicacion.com',
    phone: '+34 922 123 456',
    website: 'https://www.cepcomunicacion.com',
    address: 'Calle Principal 123, Santa Cruz de Tenerife',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6'
  })

  // Estado para el logotipo
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Estados para notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewLead: true,
    emailNewEnrollment: true,
    emailCampaignComplete: false,
    smsNewLead: false,
    smsEnrollmentReminder: true,
    pushBrowserEnabled: true
  })

  // Estados para integraciones
  const [integrationSettings, setIntegrationSettings] = useState({
    metaAdsEnabled: true,
    metaAdsAccessToken: '••••••••••••••••',
    metaAdsPixelId: '123456789012345',
    mailchimpEnabled: true,
    mailchimpApiKey: '••••••••••••••••',
    mailchimpListId: 'abc123def456',
    whatsappEnabled: false,
    whatsappPhoneId: '',
    whatsappToken: '',
    gaEnabled: true,
    gaTrackingId: 'G-XXXXXXXXXX'
  })

  // Estados para seguridad
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    twoFactorEnabled: false
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        alert('Por favor, sube un archivo PNG, JPG o SVG')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB')
        return
      }

      setLogoFile(file)

      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleSaveGeneral = () => {
    console.log('Guardar configuración general (MOCKUP):', {
      ...generalSettings,
      logo: logoFile
    })
  }

  const handleSaveNotifications = () => {
    console.log('Guardar configuración de notificaciones (MOCKUP):', notificationSettings)
  }

  const handleSaveIntegrations = () => {
    console.log('Guardar configuración de integraciones (MOCKUP):', integrationSettings)
  }

  const handleSaveSecurity = () => {
    console.log('Guardar configuración de seguridad (MOCKUP):', securitySettings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona la configuración general del sistema
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="h-4 w-4 mr-2" />
            Integraciones
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: GENERAL */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Información General del Centro</CardTitle>
              <CardDescription>
                Configuración básica que aparecerá en toda la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="centerName">Nombre del Centro *</Label>
                  <Input
                    id="centerName"
                    value={generalSettings.centerName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, centerName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contacto *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web *</Label>
                  <Input
                    id="website"
                    type="url"
                    value={generalSettings.website}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="centerDescription">Descripción del Centro *</Label>
                <Textarea
                  id="centerDescription"
                  rows={4}
                  value={generalSettings.centerDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, centerDescription: e.target.value })}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección Principal *</Label>
                <Input
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="logo">Logotipo de la Academia</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Formatos aceptados: PNG, JPG, SVG. Tamaño máximo: 5MB
                </p>

                {logoPreview ? (
                  <div className="space-y-2">
                    <div className="relative inline-block">
                      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                        <img
                          src={logoPreview}
                          alt="Preview del logotipo"
                          className="max-h-24 max-w-xs object-contain"
                        />
                      </div>
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        title="Eliminar logotipo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {logoFile?.name} ({(logoFile!.size / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      id="logo"
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Logotipo
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground italic">
                  El logotipo se mostrará en la esquina superior izquierda de la barra lateral
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Color Primario</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={generalSettings.primaryColor}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, primaryColor: e.target.value })}
                      className="w-20"
                    />
                    <Input
                      value={generalSettings.primaryColor}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, primaryColor: e.target.value })}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Color Secundario</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={generalSettings.secondaryColor}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, secondaryColor: e.target.value })}
                      className="w-20"
                    />
                    <Input
                      value={generalSettings.secondaryColor}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, secondaryColor: e.target.value })}
                      placeholder="#8b5cf6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveGeneral}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración General
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: NOTIFICACIONES */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>
                Gestiona cómo y cuándo recibes notificaciones del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notificaciones por Email</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevo Lead Capturado</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe un email cada vez que se captura un nuevo lead
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNewLead}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNewLead: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nueva Matriculación</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe un email cuando un alumno se matricula
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNewEnrollment}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNewEnrollment: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Campaña Finalizada</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe un resumen cuando una campaña llega a su fecha de fin
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailCampaignComplete}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailCampaignComplete: checked })}
                  />
                </div>
              </div>

              {/* SMS */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium">Notificaciones por SMS</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevo Lead Prioritario</Label>
                    <p className="text-xs text-muted-foreground">
                      SMS para leads de campañas de alto presupuesto
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNewLead}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNewLead: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorio de Matrícula</Label>
                    <p className="text-xs text-muted-foreground">
                      SMS recordatorio 24h antes del cierre de matrícula
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsEnrollmentReminder}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsEnrollmentReminder: checked })}
                  />
                </div>
              </div>

              {/* Push */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium">Notificaciones Push (Navegador)</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Habilitar Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe notificaciones en tiempo real en el navegador
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushBrowserEnabled}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushBrowserEnabled: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Notificaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: INTEGRACIONES */}
        <TabsContent value="integrations">
          <div className="space-y-4">
            {/* Meta Ads */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Meta Ads (Facebook & Instagram)</CardTitle>
                    <CardDescription>
                      Integración con Meta Business Suite para captura de leads
                    </CardDescription>
                  </div>
                  <Switch
                    checked={integrationSettings.metaAdsEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, metaAdsEnabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="metaToken">Access Token</Label>
                    <Input
                      id="metaToken"
                      type="password"
                      value={integrationSettings.metaAdsAccessToken}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, metaAdsAccessToken: e.target.value })}
                      disabled={!integrationSettings.metaAdsEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaPixel">Pixel ID</Label>
                    <Input
                      id="metaPixel"
                      value={integrationSettings.metaAdsPixelId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, metaAdsPixelId: e.target.value })}
                      disabled={!integrationSettings.metaAdsEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mailchimp */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mailchimp</CardTitle>
                    <CardDescription>
                      Email marketing y automatizaciones
                    </CardDescription>
                  </div>
                  <Switch
                    checked={integrationSettings.mailchimpEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, mailchimpEnabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mailchimpKey">API Key</Label>
                    <Input
                      id="mailchimpKey"
                      type="password"
                      value={integrationSettings.mailchimpApiKey}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, mailchimpApiKey: e.target.value })}
                      disabled={!integrationSettings.mailchimpEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mailchimpList">List ID</Label>
                    <Input
                      id="mailchimpList"
                      value={integrationSettings.mailchimpListId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, mailchimpListId: e.target.value })}
                      disabled={!integrationSettings.mailchimpEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>WhatsApp Cloud API</CardTitle>
                    <CardDescription>
                      Mensajería automatizada por WhatsApp
                    </CardDescription>
                  </div>
                  <Switch
                    checked={integrationSettings.whatsappEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, whatsappEnabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappPhone">Phone Number ID</Label>
                    <Input
                      id="whatsappPhone"
                      value={integrationSettings.whatsappPhoneId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, whatsappPhoneId: e.target.value })}
                      disabled={!integrationSettings.whatsappEnabled}
                      placeholder="123456789012345"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappToken">Access Token</Label>
                    <Input
                      id="whatsappToken"
                      type="password"
                      value={integrationSettings.whatsappToken}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, whatsappToken: e.target.value })}
                      disabled={!integrationSettings.whatsappEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Analytics */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Google Analytics 4</CardTitle>
                    <CardDescription>
                      Analítica web y seguimiento de conversiones
                    </CardDescription>
                  </div>
                  <Switch
                    checked={integrationSettings.gaEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, gaEnabled: checked })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gaId">Tracking ID (G-XXXXXXXXXX)</Label>
                  <Input
                    id="gaId"
                    value={integrationSettings.gaTrackingId}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, gaTrackingId: e.target.value })}
                    disabled={!integrationSettings.gaEnabled}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveIntegrations}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Integraciones
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: SEGURIDAD */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>
                Políticas de contraseñas y seguridad de sesiones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Políticas de Contraseña */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Políticas de Contraseña</h3>

                <div className="space-y-2">
                  <Label htmlFor="passwordLength">Longitud Mínima</Label>
                  <Select
                    value={securitySettings.passwordMinLength.toString()}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 caracteres</SelectItem>
                      <SelectItem value="8">8 caracteres (recomendado)</SelectItem>
                      <SelectItem value="10">10 caracteres</SelectItem>
                      <SelectItem value="12">12 caracteres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requireUppercase"
                      checked={securitySettings.passwordRequireUppercase}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireUppercase: checked as boolean })}
                    />
                    <Label htmlFor="requireUppercase" className="cursor-pointer">
                      Requerir al menos una mayúscula
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requireNumbers"
                      checked={securitySettings.passwordRequireNumbers}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireNumbers: checked as boolean })}
                    />
                    <Label htmlFor="requireNumbers" className="cursor-pointer">
                      Requerir al menos un número
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requireSpecial"
                      checked={securitySettings.passwordRequireSpecial}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireSpecial: checked as boolean })}
                    />
                    <Label htmlFor="requireSpecial" className="cursor-pointer">
                      Requerir caracteres especiales (!@#$%^&*)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Sesiones */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium">Gestión de Sesiones</h3>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sesión (minutos)</Label>
                  <Select
                    value={securitySettings.sessionTimeout.toString()}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">60 minutos (recomendado)</SelectItem>
                      <SelectItem value="120">120 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Máximo Intentos de Login</Label>
                  <Select
                    value={securitySettings.maxLoginAttempts.toString()}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 intentos</SelectItem>
                      <SelectItem value="5">5 intentos (recomendado)</SelectItem>
                      <SelectItem value="10">10 intentos</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Después de este número de intentos fallidos, la cuenta se bloqueará temporalmente
                  </p>
                </div>
              </div>

              {/* Autenticación de Dos Factores */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium">Autenticación de Dos Factores</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Habilitar 2FA (Próximamente)</Label>
                    <p className="text-xs text-muted-foreground">
                      Requiere código de verificación por SMS o app
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })}
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSecurity}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración de Seguridad
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
