import { useState, useEffect } from 'react'
import { Form } from 'antd'
import { Save, Eye } from 'lucide-react'
import Notification from '@/components/Notification'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

interface HeroContent {
  title_page: string
  description_page: string
}

const EMPTY_CONTENT: HeroContent = { title_page: '', description_page: '' }

const inputCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900'
const textareaCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 resize-y'

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

/**
 * Form generik untuk halaman yang hanya butuh jumbotron dinamis
 * (title page + description page). Dipakai Case Study & Article pages.
 */
export default function HeroOnlyPageContent({
  pageCode,
  pageTitle,
  saveMessage,
}: {
  pageCode: string
  pageTitle: string
  saveMessage?: string
}) {
  const [form] = Form.useForm()
  const [content, setContent] = useState<HeroContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)

  const { data: page, isLoading, refetch } = usePageDetail(pageCode)
  const { mutate: update, isPending } = useUpdatePage(pageCode)

  useEffect(() => {
    if (page) {
      setContent({ ...EMPTY_CONTENT, ...(page.content || {}) })
      setHasChanges(false)
    }
  }, [page])

  const patch = (partial: Partial<HeroContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? pageTitle, content },
        {
          onSuccess: () => {
            Notification('success', saveMessage || `${pageTitle} updated successfully`)
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification(
              'error',
              error.message || `Failed to update ${pageTitle} page`,
            )
          },
        },
      )
    } catch {
      Notification('error', 'Please fill in all required fields')
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-100 rounded-xl" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{pageTitle} Page</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage {pageTitle} page copywriting — jumbotron (hero)
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-start gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-yellow-900 mb-1">
              Unsaved Changes
            </h4>
            <p className="text-sm text-yellow-800">
              You have unsaved changes. Click "Save Changes" to persist your
              modifications.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (page) setContent({ ...EMPTY_CONTENT, ...(page.content || {}) })
              setHasChanges(false)
            }}
            className="text-yellow-600 hover:text-yellow-800 transition-colors text-sm font-medium"
          >
            Discard
          </button>
        </div>
      )}

      <Form form={form} layout="vertical" requiredMark={false}>
        <SectionCard
          icon={Eye}
          title="Hero / Jumbotron"
          description="Tampil di bagian paling atas halaman"
        >
          <Field label="Title Page">
            <input
              className={inputCls}
              value={content.title_page}
              onChange={(e) => patch({ title_page: e.target.value })}
              placeholder={pageTitle}
            />
          </Field>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder={`Short description of ${pageTitle} page`}
            />
          </Field>
        </SectionCard>
      </Form>
    </div>
  )
}