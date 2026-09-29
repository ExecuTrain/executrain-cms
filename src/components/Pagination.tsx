import { ChevronLeft, ChevronRight } from 'lucide-react'

type PageItem = number | 'dots'

/** Daftar nomor halaman dengan ellipsis untuk halaman banyak. */
function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const items: PageItem[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  if (start > 2) items.push('dots')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < totalPages - 1) items.push('dots')
  items.push(totalPages)
  return items
}

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  from: number
  to: number
  onChange: (page: number) => void
  /** label satuan item, default "items" */
  label?: string
}

export default function Pagination({
  page,
  totalPages,
  total,
  from,
  to,
  onChange,
  label = 'items',
}: PaginationProps) {
  if (total === 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-gray-600">
        Showing <span className="font-medium text-gray-900">{from}</span>–
        <span className="font-medium text-gray-900">{to}</span> of{' '}
        <span className="font-medium text-gray-900">{total}</span> {label}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {getPageItems(page, totalPages).map((p, i) =>
            p === 'dots' ? (
              <span key={`dots-${i}`} className="px-1.5 text-xs text-gray-400">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={
                  p === page
                    ? 'inline-flex items-center justify-center min-w-7 h-7 px-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white'
                    : 'inline-flex items-center justify-center min-w-7 h-7 px-1.5 rounded-lg text-xs font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors'
                }
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
