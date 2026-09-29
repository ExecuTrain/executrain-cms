import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Map, Layers, Route } from 'lucide-react'
import dayjs from 'dayjs'

import Notification from '@/components/Notification'
import Pagination from '@/components/Pagination'
import { MediaGridSkeleton } from '@/components/Skeletons'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import { useLearningPath, useLearningPathDelete } from '@/hooks/useLearningPath'
import { FRAMEWORK_SCOPES } from '@/lib/frameworkScopes'

export default function LearningPathPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const debouncedSearchName = useDebounce(searchTerm, 500)

  const { data = [], isLoading, refetch } = useLearningPath(debouncedSearchName)
  const { mutate: deleteItem, isPending: deletePending } = useLearningPathDelete()

  const {
    paginated,
    page,
    setPage,
    totalPages,
    total,
    from,
    to,
  } = usePagination(data, 9, [debouncedSearchName])

  const scopeLabel = (scope?: string) =>
    FRAMEWORK_SCOPES.find((s) => s.id === scope)?.label ?? scope ?? '-'

  const handleDelete = async () => {
    if (!selectedItem?.id) return
    deleteItem(selectedItem.id, {
      onSuccess: () => {
        Notification('success', 'Success to Delete Learning Path')
        refetch()
        setShowDeleteModal(false)
        setSelectedItem(null)
      },
      onError: () => {
        Notification('error', 'Failed to Delete Learning Path')
      },
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Learning Path</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Kelompokkan course terkait ke dalam jalur belajar berdasarkan framework & kategori
          </p>
        </div>
        <Link
          to="/learning-path/create"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Learning Path
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search by title..."
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
            Searching for: <span className="font-medium">{debouncedSearchName}</span>
          </p>
        )}
      </div>

      {/* Card Grid */}
      {isLoading ? (
        <MediaGridSkeleton count={3} />
      ) : total === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center text-gray-600">
          {debouncedSearchName
            ? 'No learning path found matching your search'
            : 'No learning path found'}
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((item: any) => {
            const stageCount = Array.isArray(item.stages) ? item.stages.length : 0
            const courseCount = Array.isArray(item.stages)
              ? item.stages.reduce((acc: number, s: any) => acc + (Array.isArray(s.course_ids) ? s.course_ids.length : 0), 0)
              : 0
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Header (tanpa banner/deskripsi — modul tidak memakai gambar) */}
                <div className="h-36 w-full bg-primary-600 flex items-center justify-center">
                  <Route className="w-10 h-10 text-white" />
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700">
                      {scopeLabel(item.framework)}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 text-primary-700">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {stageCount} scope
                    </span>
                    <span className="flex items-center gap-1">
                      <Map className="w-3.5 h-3.5" />
                      {courseCount} course
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-[11px] text-gray-400">
                      {dayjs(item.created_at).format('DD MMM YYYY')}
                    </span>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/learning-path/${item.id}/edit`}
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
            )
          })}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          from={from}
          to={to}
          onChange={setPage}
          label="learning paths"
        />
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md text-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Route className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1.5">
              Delete Learning Path
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
