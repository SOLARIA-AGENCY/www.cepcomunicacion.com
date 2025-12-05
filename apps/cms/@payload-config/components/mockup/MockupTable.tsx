'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@payload-config/components/ui/card'
import { Button } from '@payload-config/components/ui/button'
import { Input } from '@payload-config/components/ui/input'
import { Search, Plus, Download } from 'lucide-react'

interface MockupTableProps {
  title: string
  description?: string
  columns: string[]
  rows: any[][]
  onAdd?: () => void
  addButtonText?: string
  onExport?: () => void
  showSearch?: boolean
}

export function MockupTable({
  title,
  description,
  columns,
  rows,
  onAdd,
  addButtonText = 'Añadir',
  onExport,
  showSearch = true,
}: MockupTableProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          )}
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showSearch && (
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-9"
                disabled
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left text-sm font-medium text-muted-foreground"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className="px-6 py-4 text-sm">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer note */}
      <div className="text-sm text-muted-foreground text-center">
        <p>Vista preliminar • Datos de ejemplo para demostración</p>
      </div>
    </div>
  )
}
