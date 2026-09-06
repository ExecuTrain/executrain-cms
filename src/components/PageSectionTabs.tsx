import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface PageSectionTabItem {
  key: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * Tab navigasi untuk halaman CMS yang punya banyak section. Tiap tab
 * menampilkan satu section form sehingga user tidak perlu scroll panjang
 * untuk mencari section yang ingin diperbarui.
 */
export default function PageSectionTabs({
  items,
  activeKey,
  onChange,
}: {
  items: PageSectionTabItem[]
  activeKey: string
  onChange: (key: string) => void
}) {
  const firstRender = useRef(true)

  // Kembali ke atas halaman setiap pindah tab agar section baru langsung
  // terlihat dari awal.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeKey])

  return (
    <div className="flex flex-wrap gap-1.5 bg-white rounded-2xl border border-gray-200 p-1.5 sticky top-4 z-10 shadow-sm">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = item.key === activeKey
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors',
              isActive
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
