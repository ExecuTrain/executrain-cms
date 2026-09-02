import { Link, Navigate, useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, X, ChevronRight, ArrowLeft, Database } from 'lucide-react'
import { useEffect, useState } from 'react'

import Notification from '@/components/Notification'
import { useAuth } from '@/lib/auth'
import {
  useMasterDataByType,
  useMasterDataCreate,
  useMasterDataUpdate,
  useMasterDataDelete,
} from '@/hooks/useMasterData'
import { useMasterData } from '@/hooks/useMasterData'
import { MASTER_DATA_TYPES } from '@/lib/masterDataTypes'

const emptyForm = { label: '', value: '' }

/** Halaman index: daftar semua tipe master data */
function MasterDataIndex() {
  const { data: allData, isLoading } = useMasterData()
  const allItems: any[] = allData?.data ?? []

  const countByType = (type: string) =>
    allItems.filter((i) => i.type === type).length

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Master Data</h1>
        <p className="text-xs text-gray-600 mt-0.5">
          Pilih kategori untuk mengelola dropdown options yang tersedia
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MASTER_DATA_TYPES.map((m) => {
            const Icon = m.icon
            const count = countByType(m.type)
            return (
              <Link
                key={m.type}
                to={`/master-data/${m.path}`}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                    <Icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-primary-50 text-primary-700 rounded-full">
                    {count} options
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-gray-900">{m.label}</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">{m.type}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Halaman detail satu tipe master data */
function MasterDataTypePage() {
  const { type } = useParams<{ type: string }>()
  const meta = MASTER_DATA_TYPES.find((m) => m.path === type)

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<any>(null)

  const { state } = useAuth()
  const { data, isLoading, refetch } = useMasterDataByType(meta?.type)
  const { mutate: createItem, isPending: createPending } = useMasterDataCreate()
  const { mutate: updateItem, isPending: updatePending } = useMasterDataUpdate()
  const { mutate: deleteItem, isPending: deletePending } = useMasterDataDelete()

  const items: any[] = data?.data ?? []

  useEffect(() => {
    formReset()
  }, [meta?.type])

  const formReset = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(false)
  }

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditing(item)
    setForm({ label: item.label, value: item.value })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.label.trim() || !form.value.trim()) {
      Notification('error', 'Label and Value are required')
      return
    }
    const payload = {
      type: meta!.type,
      label: form.label.trim(),
      value: form.value.trim(),
      sort_order: items.length,
    }

    if (editing) {
      updateItem(
        { id: editing.id, payload },
        {
          onSuccess: () => {
            Notification('success', 'Success to Update Master Data')
            formReset()
            refetch()
          },
          onError: () => Notification('error', 'Failed to Update Master Data'),
        },
      )
    } else {
      createItem(payload, {
        onSuccess: () => {
          Notification('success', 'Success to Create Master Data')
          formReset()
          refetch()
        },
        onError: () => Notification('error', 'Failed to Create Master Data'),
      })
    }
  }

  const handleDelete = () => {
    if (!confirmDelete?.id) return
    deleteItem(confirmDelete.id, {
      onSuccess: () => {
        Notification('success', 'Success to Delete Master Data')
        setConfirmDelete(null)
        refetch()
      },
      onError: () => Notification('error', 'Failed to Delete Master Data'),
    })
  }

  if (!state.user || state.user.role !== 'SUPERADMIN') {
    return <Navigate to="/" replace />
  }

  if (!meta) {
    return <Navigate to="/master-data" replace />
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link to="/master-data" className="hover:text-primary-600 inline-flex items-center gap-1">
              <Database className="w-3.5 h-3.5" /> Master Data
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium">{meta.label}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{meta.label}</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage options for <span className="font-medium">{meta.type}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/master-data"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Types
          </Link>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Option
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">{meta.label}</h2>

        {isLoading ? (
          <div className="animate-pulse bg-gray-100 w-full h-40 rounded-xl" />
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-600 text-sm">
            No options yet for this type
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase text-[11px]">
                <th className="py-2 pr-4 font-medium">Value</th>
                <th className="py-2 pr-4 font-medium">Label</th>
                <th className="py-2 pr-4 font-medium">Order</th>
                <th className="py-2 pr-4 font-medium">Created</th>
                <th className="py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[11px] font-medium">
                      {item.value}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-700">{item.label}</td>
                  <td className="py-2.5 pr-4 text-gray-700">{item.sort_order}</td>
                  <td className="py-2.5 pr-4 text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-primary-600 border border-primary-200 hover:bg-primary-50 rounded-lg mr-1"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(item)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-red-500 border border-red-200 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">
                {editing ? 'Edit Option' : 'Add Option'}
              </h2>
              <button
                type="button"
                onClick={formReset}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Value
                </label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) =>
                    setForm((prev: any) => ({ ...prev, value: e.target.value }))
                  }
                  placeholder="e.g. DATA_ANALYTICS"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) =>
                    setForm((prev: any) => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="e.g. Data Analytics"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100 text-gray-900"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={formReset}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createPending || updatePending}
                className="flex-1 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
              >
                {createPending || updatePending
                  ? 'Saving...'
                  : editing
                    ? 'Update'
                    : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md text-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1.5">
              Delete Option
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Delete "<span className="font-semibold">{confirmDelete.label}</span>"
              from {meta.label}?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                disabled={deletePending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
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

export default function MasterDataPage() {
  const { type } = useParams<{ type: string }>()
  return type ? <MasterDataTypePage /> : <MasterDataIndex />
}
