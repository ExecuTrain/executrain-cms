import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Search, Plus, Newspaper, CalendarDays } from 'lucide-react'
import dayjs from 'dayjs'

import Notification from '@/components/Notification'
import { useAuth } from '@/lib/auth'
import { useDebounce } from '@/hooks/useDebounce'
import { useArticle, useArticleDelete } from '@/hooks/useArticle'
import { useMasterDataByType } from '@/hooks/useMasterData'

function masterLabel(value: string, options: any[]) {
  const found = options.find((o: any) => o.value === value)
  return found ? found.label : value?.replace(/_/g, ' ')
}

/** Strip HTML untuk preview di kartu */
function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html')
  return doc.body.textContent || ''
}

export default function ArticlePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const debouncedSearchName = useDebounce(searchTerm, 500)

  const { state } = useAuth()
  const { data = [], isLoading, refetch } = useArticle(debouncedSearchName)
  const { mutate: deleteItem, isPending: deletePending } = useArticleDelete()
  const { data: catData } = useMasterDataByType('ARTICLE_CATEGORY')
  const catOptions: any[] = catData?.data ?? []

  const handleDelete = async () => {
    if (!selectedItem?._id) return
    deleteItem(selectedItem._id, {
      onSuccess: () => {
        Notification('success', 'Success to Delete Article')
        refetch()
        setShowDeleteModal(false)
        setSelectedItem(null)
      },
      onError: () => {
        Notification('error', 'Failed to Delete Article')
      },
    })
  }

  if (!state.user || state.user.role !== 'SUPERADMIN') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Article</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage your articles & insights content
          </p>
        </div>
        <Link
          to="/article/create"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-100 text-gray-900 placeholder:text-gray-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        {debouncedSearchName && (
          <p className="text-xs text-gray-600 mt-2">
            Searching for:{' '}
            <span className="font-medium">{debouncedSearchName}</span>
          </p>
        )}
      </div>

      {/* Card Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-64 rounded-2xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center text-gray-600">
          {debouncedSearchName
            ? 'No article found matching your search'
            : 'No article found'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="h-24 w-full bg-primary-600 flex items-center justify-center relative">
                <Newspaper className="w-10 h-10 text-white" />
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                {/* Category badges */}
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  {(item.category ?? []).slice(0, 3).map((cat: string) => (
                    <span
                      key={cat}
                      className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 text-primary-700"
                    >
                      {masterLabel(cat, catOptions)}
                    </span>
                  ))}
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 mb-3 flex-1">
                  {stripHtml(item.content) || 'No content yet'}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <CalendarDays className="w-3 h-3" />
                    {dayjs(item.created_at).format('DD MMM YYYY')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/article/${item._id}/edit`}
                      className="px-3 py-1 text-xs text-primary-600 border border-primary-200 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedItem(item)
                        setShowDeleteModal(true)
                      }}
                      type="button"
                      className="px-3 py-1 text-xs text-red-500 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md text-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Newspaper className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1.5">
              Delete Article
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete "
              <span className="font-semibold">{selectedItem?.title}</span>"?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedItem(null)
                }}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                disabled={deletePending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete()}
                className="flex-1 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deletePending}
              >
                {deletePending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
