import { useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'

export const FRAMEWORK_SCOPES = [
  { id: 'ai', label: 'Artificial Intelligence' },
  { id: 'data', label: 'Data Management, Analytics & Engineering' },
  { id: 'auto', label: 'Automation' },
  { id: 'cyber', label: 'Cybersecurity' },
  { id: 'governance', label: 'Governance Control, Risk Management' },
  { id: 'service', label: 'Service Management' },
  { id: 'pm', label: 'Project Management' },
  { id: 'ea', label: 'Enterprise Architecture' },
  { id: 'core', label: 'People Skill Development (Core)' },
]

export const FRAMEWORK_SCOPE_IDS = FRAMEWORK_SCOPES.map((s) => s.id)

const inputCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900'

/**
 * Editor item framework wheel. Scope (judul) tetap; hanya daftar item
 * di dalam setiap scope yang bisa diedit (tambah/hapus/ubah).
 */
export default function FrameworkScopeEditor({
  value = {},
  onChange,
}: {
  value?: Record<string, string[]>
  onChange: (next: Record<string, string[]>) => void
}) {
  const [expanded, setExpanded] = useState<string[]>([])

  const isOpen = (id: string) => expanded.includes(id)
  const toggle = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  const expandAll = () => setExpanded(FRAMEWORK_SCOPE_IDS)
  const collapseAll = () => setExpanded([])

  const patchScope = (id: string, items: string[]) =>
    onChange({ ...value, [id]: items })

  const setItem = (id: string, index: number, text: string) => {
    const items = [...(value[id] || [])]
    items[index] = text
    patchScope(id, items)
  }

  const addItem = (id: string) =>
    patchScope(id, [...(value[id] || []), ''])

  const removeItem = (id: string, index: number) =>
    patchScope(id, (value[id] || []).filter((_, i) => i !== index))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={expandAll}
          className="text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          Expand all
        </button>
        <span className="text-gray-300">•</span>
        <button
          type="button"
          onClick={collapseAll}
          className="text-xs font-medium text-gray-500 hover:text-gray-700"
        >
          Collapse all
        </button>
      </div>

      {FRAMEWORK_SCOPES.map((scope, scopeIndex) => {
        const items = value[scope.id] || []
        const open = isOpen(scope.id)
        return (
          <div
            key={scope.id}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(scope.id)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50/60 hover:bg-gray-100 transition-colors text-left"
            >
              <span className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-semibold shrink-0">
                {scopeIndex + 1}
              </span>
              <span className="flex-1 text-sm font-semibold text-gray-800">
                {scope.label}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                {items.length} item
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>

            {open && (
              <div className="p-4 space-y-2">
                {items.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2 text-center border border-dashed border-gray-200 rounded-lg">
                    No items yet. Click "Add item" to start.
                  </p>
                ) : (
                  items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 w-5 text-right shrink-0">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        className={inputCls}
                        value={item}
                        onChange={(e) => setItem(scope.id, index, e.target.value)}
                        placeholder={`Item ${index + 1} — mis. CompTIA Security+`}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(scope.id, index)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))
                )}
                <button
                  type="button"
                  onClick={() => addItem(scope.id)}
                  className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add item
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}