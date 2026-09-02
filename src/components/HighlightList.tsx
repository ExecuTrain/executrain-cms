import { Plus, Trash2, Move } from 'lucide-react'

import ImageUpload from '@/components/ImageUpload'

export interface HighlightItem {
  image: string
  title: string
  description: string
}

interface HighlightListProps {
  value?: HighlightItem[]
  onChange?: (value: HighlightItem[]) => void
  label?: string
}

export default function HighlightList({
  value = [],
  onChange,
  label = 'Highlights',
}: HighlightListProps) {
  const update = (index: number, patch: Partial<HighlightItem>) => {
    const next = [...value]
    next[index] = { ...next[index], ...patch }
    onChange?.(next)
  }

  const add = () => {
    onChange?.([...value, { image: '', title: '', description: '' }])
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
          Add highlight
        </button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
          No highlights yet. Click "Add highlight" to start.
        </p>
      ) : (
        <div className="space-y-4">
          {value.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 relative"
            >
              <div className="flex items-center gap-2 mb-3">
                <Move className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-500">
                  Highlight {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove highlight"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <ImageUpload
                  label="Highlight Image"
                  value={
                    item.image
                      ? { url: item.image, public_id: '' }
                      : null
                  }
                  onChange={(img) =>
                    update(index, {
                      image: img?.url ?? '',
                    })
                  }
                  folder="it-product"
                  aspectClass="h-28"
                />
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => update(index, { title: e.target.value })}
                      placeholder={`Highlight title ${index + 1}`}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        update(index, { description: e.target.value })
                      }
                      placeholder="Highlight description"
                      rows={3}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}