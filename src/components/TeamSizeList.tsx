import { Plus, Trash2, Move } from 'lucide-react'

export interface TeamSizeItem {
  quantity: number
  type: string
}

interface TeamSizeListProps {
  value?: TeamSizeItem[]
  onChange?: (value: TeamSizeItem[]) => void
  label?: string
}

export default function TeamSizeList({
  value = [],
  onChange,
  label = 'Team Size',
}: TeamSizeListProps) {
  const update = (index: number, patch: Partial<TeamSizeItem>) => {
    const next = [...value]
    next[index] = { ...next[index], ...patch }
    onChange?.(next)
  }

  const add = () => {
    onChange?.([...value, { quantity: 1, type: '' }])
  }

  const remove = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index))
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
          {label}
        </label>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add role
        </button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
          No team size yet. Click "Add role" to start.
        </p>
      ) : (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              <input
                type="text"
                inputMode="numeric"
                value={item.quantity || ''}
                onChange={(e) =>
                  update(index, {
                    quantity: e.target.value ? parseInt(e.target.value, 10) : 0,
                  })
                }
                placeholder="Qty"
                className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
              />
              <input
                type="text"
                value={item.type}
                onChange={(e) => update(index, { type: e.target.value })}
                placeholder="Role (e.g. Developer)"
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Remove role"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}