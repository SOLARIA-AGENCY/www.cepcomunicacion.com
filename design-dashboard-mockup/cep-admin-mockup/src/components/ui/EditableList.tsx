import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface EditableListProps {
  items: string[]
  onItemsChange?: (items: string[]) => void
  placeholder?: string
  label: string
}

export function EditableList({ items, onItemsChange, placeholder = "Agregar ítem...", label }: EditableListProps) {
  const [newItem, setNewItem] = useState("")
  const [currentItems, setCurrentItems] = useState(items)

  const addItem = () => {
    if (newItem.trim()) {
      const updated = [...currentItems, newItem.trim()]
      setCurrentItems(updated)
      onItemsChange?.(updated)
      setNewItem("")
    }
  }

  const removeItem = (index: number) => {
    const updated = currentItems.filter((_, i) => i !== index)
    setCurrentItems(updated)
    onItemsChange?.(updated)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {/* Lista de items actuales */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
        {currentItems.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {item}
            <button
              onClick={() => removeItem(index)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      {/* Input para agregar nuevo */}
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <Button type="button" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
