import { useState } from 'react'
import { Form } from 'antd'
import { Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react'
import InputForm from '@/components/Form'
import FileUpload from '@/components/FileUpload'
import Notification from '@/components/Notification'
import {
  useGallery,
  useCreateGallery,
  useUpdateGallery,
  useDeleteGallery,
} from '@/hooks/useContentManagement'

export default function GalleryTab() {
  const [showModal, setShowModal] = useState<'NONE' | 'DELETE' | 'INPUT'>('NONE')
  const [formAction, setFormAction] = useState<any>({})
  const [form] = Form.useForm()

  const { data: galleries = [], isLoading, refetch } = useGallery()
  const { mutate: add, isPending: isCreating } = useCreateGallery()
  const { mutate: update, isPending: isUpdating } = useUpdateGallery()
  const { mutate: deleteGallery, isPending: isDeleting } = useDeleteGallery()

  const handleDelete = () => {
    deleteGallery(formAction?._id, {
      onSuccess: () => {
        Notification('success', 'Gallery image deleted successfully')
        setShowModal('NONE')
        setFormAction({})
        refetch()
      },
      onError: (error: any) => {
        Notification('error', error.message || 'Failed to delete gallery image')
      },
    })
  }

  async function addGallery() {
    try {
      await form.validateFields()

      const formData = new FormData()
      if (formAction.title) {
        formData.append('title', formAction.title)
      }
      if (formAction.order) {
        formData.append('order', formAction.order)
      }

      if (formAction?.image?.file) {
        formData.append('file', formAction?.image?.file ?? null)
      }

      add(formData, {
        onSuccess: () => {
          Notification('success', 'Success to add gallery image')
          setShowModal('NONE')
          setFormAction({})
          form.resetFields()
          refetch()
        },
        onError: () => {
          Notification('error', 'Failed to add gallery image')
        },
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function updateGallery() {
    try {
      await form.validateFields()

      const formData = new FormData()
      if (formAction.title !== undefined) {
        formData.append('title', formAction.title)
      }
      if (formAction.order !== undefined) {
        formData.append('order', formAction.order)
      }
      formData.append('is_active', formAction.is_active ?? true)

      if (formAction?.image?.file) {
        formData.append('file', formAction?.image?.file ?? null)
      } else if (formAction?.image) {
        const parsed = JSON.stringify(formAction?.image)
        formData.append('image', parsed)
      }

      update(
        { id: formAction._id, data: formData },
        {
          onSuccess: () => {
            Notification('success', 'Success to update gallery image')
            setShowModal('NONE')
            setFormAction({})
            form.resetFields()
            refetch()
          },
          onError: () => {
            Notification('error', 'Failed to update gallery image')
          },
        },
      )
    } catch (e) {
      console.log(e)
    }
  }

  const isPending = isCreating || isUpdating

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse h-48 bg-gray-100 rounded-xl"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-primary-200">
          <ImageIcon className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-primary-700">Gallery Slider</h3>
        </div>
        <button
          onClick={() => setShowModal('INPUT')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Image
        </button>
      </div>

      {(galleries?.length ?? 0) > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleries.map((gallery: any) => (
            <div
              key={gallery._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                {gallery?.image?.url ? (
                  <img
                    src={gallery?.image?.url}
                    alt={gallery.title || 'Gallery image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  #{gallery.order || 0}
                </div>
                {!gallery.is_active && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Inactive
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm">
                  {gallery?.title || 'Untitled'}
                </h3>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setShowModal('INPUT')
                      setFormAction(gallery)
                      form.setFieldsValue(gallery)
                    }}
                    className="flex-1 p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => {
                      setShowModal('DELETE')
                      setFormAction(gallery)
                    }}
                    className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No gallery images yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first gallery image
          </p>
          <button
            onClick={() => setShowModal('INPUT')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Image
          </button>
        </div>
      )}

      {showModal === 'INPUT' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-base font-bold text-gray-900 mb-6">
              {formAction?._id ? 'Edit Gallery Image' : 'Add New Gallery Image'}
            </h2>

            <Form form={form} layout="vertical" requiredMark={false}>
              <InputForm
                type="text"
                name="title"
                label="Title"
                placeholder="Enter title (optional)"
                form={formAction}
                setForm={setFormAction}
              />

              <InputForm
                type="number"
                name="order"
                label="Order"
                placeholder="Enter display order"
                form={formAction}
                setForm={setFormAction}
              />

              {formAction?.image?.data || formAction?.image?.url ? (
                <div className="mb-4">
                  <span className="block text-xs font-medium text-gray-600 mb-2">
                    Current Image
                  </span>
                  <div className="relative mb-5 flex items-center justify-center bg-gray-100 rounded-lg p-4">
                    <img
                      src={formAction?.image?.data || formAction?.image?.url}
                      alt={formAction.title || 'Gallery image'}
                      className="max-h-32 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormAction((prev: any) => ({
                          ...prev,
                          image: undefined,
                        }))
                      }
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <FileUpload
                  value={formAction?.image}
                  onChange={(val) =>
                    setFormAction((prev: any) => ({ ...prev, image: val }))
                  }
                  label="Image"
                  required={!formAction?._id}
                  aspectClass="h-32"
                />
              )}

              {formAction?._id && (
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formAction.is_active ?? true}
                      onChange={(e) =>
                        setFormAction((prev: any) => ({
                          ...prev,
                          is_active: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormAction({})
                    setShowModal('NONE')
                    form.resetFields()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    formAction?._id ? updateGallery() : addGallery()
                  }
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : formAction?._id ? 'Update' : 'Add'}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {showModal === 'DELETE' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Delete Gallery Image
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this gallery image? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal('NONE')
                  setFormAction({})
                }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete()}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
