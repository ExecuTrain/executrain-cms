import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Trash2,
  Pencil,
  FileSpreadsheet,
} from 'lucide-react'
import dayjs from 'dayjs'

import Notification from '@/components/Notification'
import { useScheduleList, useScheduleDelete } from '@/hooks/useSchedule'

type EntityFilter = 'ALL' | 'COURSE' | 'SKILL_ACCELERATOR'

const formatRange = (start: string, end: string) => {
  const s = dayjs(start)
  const e = dayjs(end)
  if (start === end || s.isSame(e, 'day')) return s.format('DD MMMM YYYY')
  if (s.isSame(e, 'month'))
    return `${s.format('DD')} – ${e.format('DD MMMM YYYY')}`
  if (s.isSame(e, 'year'))
    return `${s.format('DD MMM')} – ${e.format('DD MMMM YYYY')}`
  return `${s.format('DD MMMM YYYY')} – ${e.format('DD MMMM YYYY')}`
}

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'))
  const [entityFilter, setEntityFilter] = useState<EntityFilter>('ALL')
  const [deleteTarget, setDeleteTarget] = useState<any>(null)

  const monthKey = currentMonth.format('YYYY-MM')
  const { data = [], isLoading, refetch } = useScheduleList(monthKey)
  const { mutate: deleteSchedule, isPending: deletePending } =
    useScheduleDelete()

  const changeMonth = (offset: number) =>
    setCurrentMonth((prev) => prev.add(offset, 'month'))
  const goToday = () => setCurrentMonth(dayjs().startOf('month'))

  const filtered = useMemo(() => {
    const rows = Array.isArray(data) ? data : []
    return entityFilter === 'ALL'
      ? rows
      : rows.filter((r: any) => r.entity_type === entityFilter)
  }, [data, entityFilter])

  // Urutkan: tanggal mulai ascending
  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a: any, b: any) =>
          dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf(),
      ),
    [filtered],
  )

  const handleDelete = () => {
    if (!deleteTarget?.id) return
    // Hapus SEMUA baris dalam range (bukan hanya baris pertama).
    // `session_ids` berisi id tiap tanggal di klaster berurutan utk program tsb.
    const ids = Array.isArray(deleteTarget.session_ids) && deleteTarget.session_ids.length
      ? deleteTarget.session_ids
      : [deleteTarget.id]
    deleteSchedule(ids, {
      onSuccess: () => {
        Notification('success', 'Schedule deleted successfully')
        setDeleteTarget(null)
        refetch()
      },
      onError: () => Notification('error', 'Failed to delete schedule'),
    })
  }

  const entityIcon = (type: string) =>
    type === 'COURSE' ? GraduationCap : BookOpen

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Schedule</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage class schedules — course catalog & skill accelerator per
            month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/schedule/import"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Bulk Import
          </Link>
          <Link
            to="/schedule/create"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </Link>
        </div>
      </div>

      {/* Toolbar: month nav + entity filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg hover:bg-white transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={goToday}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg hover:bg-white transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 md:ml-2">
          <CalendarDays className="w-4 h-4 text-primary-600" />
          {currentMonth.format('MMMM YYYY')}
          <span className="text-xs font-normal text-gray-400">
            {sorted.length} schedule{sorted.length !== 1 ? 's' : ''} ·{' '}
            {sorted.reduce((n: number, r: any) => n + (r.session_count || 1), 0)}{' '}
            session(s)
          </span>
        </div>

        <div className="md:ml-auto flex items-center gap-1">
          {(['ALL', 'COURSE', 'SKILL_ACCELERATOR'] as EntityFilter[]).map(
            (f) => (
              <button
                key={f}
                type="button"
                onClick={() => setEntityFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  entityFilter === f
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f === 'ALL'
                  ? 'All'
                  : f === 'COURSE'
                    ? 'Course'
                    : 'Skill Accelerator'}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-gray-100 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-40 bg-gray-100 rounded-md" />
                  <div className="h-3 w-24 bg-gray-100 rounded-md" />
                </div>
              </div>
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            No schedule found for {currentMonth.format('MMMM YYYY')}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Click "Add Schedule" to create the first schedule of the month.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sorted.map((r: any) => {
            const Icon = entityIcon(r.entity_type)
            const dates = Array.isArray(r.session_dates) ? r.session_dates : []
            const isPast =
              dayjs(r.end_date).isBefore(dayjs().startOf('day'), 'day')
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow flex flex-col"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      r.entity_type === 'COURSE'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-violet-50 text-violet-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {r.program_name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {r.entity_type === 'COURSE'
                        ? 'Course'
                        : 'Skill Accelerator'}
                      {r.category ? ` · ${r.category}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      to={`/schedule/${r.id}/edit`}
                      className="p-1.5 text-primary-600 border border-primary-200 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(r)}
                      className="p-1.5 text-red-500 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Date range */}
                <div className="px-5 py-3 flex items-center justify-between gap-2 bg-gray-50/60">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <CalendarDays
                      className={`w-4 h-4 ${
                        isPast ? 'text-gray-400' : 'text-primary-600'
                      }`}
                    />
                    {formatRange(r.start_date, r.end_date)}
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      isPast
                        ? 'bg-gray-100 text-gray-400'
                        : r.session_count > 1
                          ? 'bg-primary-50 text-primary-600'
                          : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {r.session_count || 1} session
                    {(r.session_count || 1) > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Tanggal list */}
                {dates.length > 1 && (
                  <div className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {dates.map((d: string, i: number) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded-lg"
                        >
                          {dayjs(d).format('DD MMM')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md text-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1.5">
              Delete Schedule
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Delete "
              <span className="font-semibold">{deleteTarget.program_name}</span>
              " ({formatRange(deleteTarget.start_date, deleteTarget.end_date)}
              ){' '}
              —{' '}
              <span className="font-semibold">
                {deleteTarget.session_count || 1} session
                {(deleteTarget.session_count || 1) > 1 ? 's' : ''}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                disabled={deletePending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
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
