import { Plus, Trash2, Move } from 'lucide-react'

interface FeatureListProps {
  value?: string[]
  onChange?: (value: string[]) => void
  label?: string
}

export default function FeatureList({
  value = [],
  onChange,
  label = 'Features',
}: FeatureListProps) {
  const update = (index: number, text: string) => {
    const next = [...value]
    next[index] = text
    onChange?.(next)
  }

  const add = () => {
    onChange?.([...value, ''])
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
          Add feature
        </button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
          No features yet. Click "Add feature" to start.
        </p>
      ) : (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              <input
                type="text"
                value={item}
                onChange={(e) => update(index, e.target.value)}
                placeholder={`Feature ${index + 1}`}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Remove feature"
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