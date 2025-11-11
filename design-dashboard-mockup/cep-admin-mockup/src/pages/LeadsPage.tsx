import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { leads } from "@/data/mockData"

// Extender leads con información adicional
const leadsExtended = leads.slice(0, 30).map((lead, index) => ({
  ...lead,
  course_interest: ["Marketing Digital", "Desarrollo Web", "Diseño Gráfico", "Community Manager", "SEO y SEM"][index % 5],
  lead_source: ["Meta Ads", "Google Ads", "Web Orgánica", "Email", "Referido"][index % 5],
  lead_status: (index % 4 === 0 ? "nuevo" : index % 4 === 1 ? "contactado" : index % 4 === 2 ? "inscrito" : "descartado") as string,
  created_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}))

export function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          Registro automático de leads desde formularios y Meta Ads
        </p>
      </div>

      {/* Alert informativo */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Datos automáticos - No editables.</strong> Los leads se capturan automáticamente desde formularios web, Meta Ads y otras fuentes. Esta vista es de solo lectura para consulta y exportación.
        </AlertDescription>
      </Alert>

      {/* Filtros */}
      <div className="flex items-center gap-4 flex-wrap">
        <Input placeholder="Buscar por nombre o email..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Fuente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="meta">Meta Ads</SelectItem>
            <SelectItem value="google">Google Ads</SelectItem>
            <SelectItem value="web">Web Orgánica</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="nuevo">Nuevo</SelectItem>
            <SelectItem value="contactado">Contactado</SelectItem>
            <SelectItem value="inscrito">Inscrito</SelectItem>
            <SelectItem value="descartado">Descartado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de leads (READ-ONLY) */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Leads ({leadsExtended.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Interés</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadsExtended.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {lead.created_date}
                  </TableCell>
                  <TableCell className="font-medium">
                    {lead.first_name} {lead.last_name}
                  </TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.course_interest}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{lead.lead_source}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lead.lead_status === "inscrito"
                          ? "default"
                          : lead.lead_status === "contactado"
                          ? "secondary"
                          : lead.lead_status === "nuevo"
                          ? "default"
                          : "outline"
                      }
                    >
                      {lead.lead_status === "inscrito"
                        ? "Inscrito"
                        : lead.lead_status === "contactado"
                        ? "Contactado"
                        : lead.lead_status === "nuevo"
                        ? "Nuevo"
                        : "Descartado"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
