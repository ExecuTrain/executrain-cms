import { Link } from 'react-router-dom'
import { FileStack } from 'lucide-react'

import { useMyMenus } from '@/hooks/useAccess'
import { getMenuIcon, type MenuItem } from '@/lib/menu'

/**
 * Halaman index semua halaman CMS (PageContent) — pola yang sama dengan
 * Master Data: satu menu di sidebar, di sini menampilkan grid semua page.
 * Klik kartu → menuju halaman edit masing-masing.
 */
export default function PagesIndex() {
  const { data: myMenus, isLoading } = useMyMenus()

  const pagesNode = myMenus?.menus?.find((m: any) => m.code === 'pages')
  const pages: MenuItem[] = (pagesNode?.children ?? []).map((child: any) => ({
    id: 0,
    text: child.label,
    icon: getMenuIcon(child.code),
    href: child.path || undefined,
  }))

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Pages</h1>
        <p className="text-xs text-gray-600 mt-0.5">
          Pilih halaman untuk mengelola copywriting kontennya
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-28 rounded-2xl" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <FileStack className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Belum ada halaman yang dapat diakses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => {
            const Icon = page.icon
            return (
              <Link
                key={page.text}
                to={page.href || '#'}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                    {Icon && (
                      <Icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
                    )}
                  </div>
                </div>
                <h2 className="text-sm font-semibold text-gray-900">{page.text}</h2>
                <p className="text-[11px] text-gray-500 mt-0.5 break-all">
                  {page.href}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}