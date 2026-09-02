import { useState, useEffect, useRef } from 'react'
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom'
import { Form } from 'antd'
import { ArrowLeft } from 'lucide-react'

import InputForm from '@/components/Form'
import RichTextEditor, {
  extractImageUrls,
} from '@/components/RichTextEditor'
import Notification from '@/components/Notification'
import { useAuth } from '@/lib/auth'
import {
  useArticleCreate,
  useArticleUpdate,
  useArticleDetail,
} from '@/hooks/useArticle'
import { ArticleImageDeleteService } from '@/services/article'
import { useMasterDataByType } from '@/hooks/useMasterData'

function toOptions(list: any[]) {
  return (list ?? []).map((m: any) => ({ label: m.label, value: m.value }))
}

export default function ArticleFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formAction, setFormAction] = useState<any>()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { state } = useAuth()
  const editorContent = useRef('')
  // URL gambar yang di-upload selama sesi ini (untuk cleanup yang tidak dipakai)
  const uploadedUrls = useRef<Set<string>>(new Set())

  const { data: detailData, isLoading: detailLoading } = useArticleDetail(
    isEdit ? id : undefined,
  )
  const { mutate: createItem, isPending: createPending } = useArticleCreate()
  const { mutate: updateItem, isPending: updatePending } = useArticleUpdate()
  const { data: catData } = useMasterDataByType('ARTICLE_CATEGORY')
  const catOptions = toOptions(catData?.data)

  // Prefill saat mode edit
  useEffect(() => {
    if (isEdit && detailData) {
      const item = detailData
      if (item) {
        const values = {
          title: item.title,
          category: Array.isArray(item.category) ? item.category : [],
        }
        setFormAction(values)
        form.setFieldsValue(values)
        editorContent.current = item.content || ''
      }
    }
  }, [isEdit, id, detailData, form])

  /** Hapus gambar dari storage jika tidak dipakai konten final */
  const cleanupOrphanImages = async (finalHtml: string) => {
    const finalUrls = new Set(extractImageUrls(finalHtml))
    const orphans = [...uploadedUrls.current].filter((u) => !finalUrls.has(u))
    if (orphans.length === 0) return
    uploadedUrls.current = new Set(
      [...uploadedUrls.current].filter((u) => finalUrls.has(u)),
    )
    // Fire-and-forget, tidak blokir navigasi
    orphans.forEach((url) => ArticleImageDeleteService(url))
  }

  const buildPayload = () => ({
    title: formAction?.title,
    category: Array.isArray(formAction?.category) ? formAction.category : [],
    content: editorContent.current || '',
  })

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      if (!editorContent.current.trim()) {
        Notification('error', 'Content is required')
        return
      }

      if (isEdit) {
        updateItem(
          { id: id!, payload: buildPayload() },
          {
            onSuccess: () => {
              Notification('success', 'Success to Update Article')
              cleanupOrphanImages(editorContent.current)
              navigate('/article')
            },
            onError: () => {
              Notification('error', 'Failed to Update Article')
            },
          },
        )
      } else {
        createItem(buildPayload(), {
          onSuccess: () => {
            Notification('success', 'Success to Create Article')
            cleanupOrphanImages(editorContent.current)
            navigate('/article')
          },
          onError: () => {
            Notification('error', 'Failed to Create Article')
          },
        })
      }
    } catch (e) {
      Notification('error', 'Please fill all required fields')
    }
  }

  /** Cancel: bersihkan gambar yang diupload tapi tidak tersimpan */
  const handleCancel = () => {
    const finalUrls = new Set(extractImageUrls(editorContent.current))
    const orphans = [...uploadedUrls.current].filter((u) => !finalUrls.has(u))
    orphans.forEach((url) => ArticleImageDeleteService(url))
    navigate('/article')
  }

  // Cleanup saat unmount (misal klik link lain) — hapus gambar upload yang
  // tidak ada di konten tersimpan
  useEffect(() => {
    const currentUrls = new Set(
      extractImageUrls(isEdit && detailData ? detailData.content : ''),
    )
    return () => {
      const orphans = [...uploadedUrls.current].filter(
        (u) => !currentUrls.has(u),
      )
      orphans.forEach((url) => ArticleImageDeleteService(url))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!state.user || state.user.role !== 'SUPERADMIN') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/article"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to list
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Article' : 'Add Article'}
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {isEdit
              ? 'Update the details of your article'
              : 'Create a new article with rich text content'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {isEdit && detailLoading ? (
          <div className="animate-pulse bg-gray-100 w-full min-h-[40dvh] rounded-xl" />
        ) : (
          <Form form={form} layout="vertical" requiredMark={false}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
              <InputForm
                type="text"
                name="title"
                label="Title"
                placeholder="Enter article title"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="category"
                label="Category"
                placeholder="Select categories"
                required
                multiple
                options={catOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Content <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={isEdit ? editorContent.current : ''}
                onChange={(html) => {
                  editorContent.current = html
                }}
                onUploaded={(url) => {
                  uploadedUrls.current.add(url)
                }}
                placeholder="Write your article content here..."
                minHeight={320}
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Supports headings, bold, italic, lists, quotes, code & images
              </p>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleCancel()}
                className="px-5 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={createPending || updatePending}
                className="px-5 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {createPending || updatePending
                  ? 'Saving...'
                  : isEdit
                    ? 'Update'
                    : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </div>
    </div>
  )
}
