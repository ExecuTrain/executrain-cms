import { useEffect, useMemo, useState } from 'react'

export interface PaginationResult<T> {
  /** Potongan item untuk halaman aktif */
  paginated: T[]
  page: number
  setPage: (page: number) => void
  totalPages: number
  total: number
  from: number
  to: number
  pageSize: number
}

/**
 * Pagination sisi klien untuk list di CMS.
 *
 * @param items      seluruh item (sudah difilter bila perlu)
 * @param pageSize   jumlah item per halaman
 * @param resetDeps  daftar nilai yang mengubah hasil filter/pencarian —
 *                   saat berubah, halaman otomatis kembali ke 1
 */
export function usePagination<T>(
  items: T[],
  pageSize = 9,
  resetDeps: readonly unknown[] = [],
): PaginationResult<T> {
  const [page, setPage] = useState(1)

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)

  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, total)

  const paginated = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  )

  // Reset ke halaman 1 saat filter/pencarian berubah
  useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps)

  return {
    paginated,
    page: currentPage,
    setPage,
    totalPages,
    total,
    from,
    to,
    pageSize,
  }
}
