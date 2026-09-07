import { useState, useEffect } from 'react'
import { Form } from 'antd'
import { Save, Eye, Megaphone } from 'lucide-react'
import Notification from '@/components/Notification'
import { ContentPageSkeleton } from '@/components/Skeletons'
import PageSectionTabs from '@/components/PageSectionTabs'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

/** Shape konten halaman Course Catalog (dicocokkan dengan compro). */
interface CourseCatalogContent {
  title_page: string
  description_page: string
  cta: {
    title: string
    description: string
    label: string
    link: string
  }
}

const PAGE_CODE = 'course-catalog'

const EMPTY_CONTENT: CourseCatalogContent = {
  title_page: '',
  description_page: '',
  cta: {
    title: '',
    description: '',
    label: '',
    link: '',
  },
}

function SectionCard({
  icon: Icon,
  title,
  description,
  active = true,
  children,
}: {
  icon: any
  title: string
  description?: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${
        active ? '' : 'hidden'
      }`}
    >
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
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900'
const textareaCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 resize-y'

const SECTION_TABS = [
  { key: 'hero', label: 'Hero / Jumbotron', icon: Eye },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

export default function CourseCatalogPageContent() {
  const [form] = Form.useForm()
  const [content, setContent] = useState<CourseCatalogContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged: CourseCatalogContent = {
        ...EMPTY_CONTENT,
        ...(page.content || {}),
        cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
      }
      form.setFieldsValue({ ...merged, cta: undefined })
      setContent(merged)
      setHasChanges(false)
    }
  }, [page, form])

  const patch = (partial: Partial<CourseCatalogContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchCta = (partial: Partial<CourseCatalogContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'Course Catalog', content },
        {
          onSuccess: () => {
            Notification('success', 'Course Catalog page updated successfully')
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification(
              'error',
              error.message || 'Failed to update Course Catalog page',
            )
          },
        },
      )
    } catch {
      Notification('error', 'Please fill in all required fields')
    }
  }

  if (isLoading) {
    return <ContentPageSkeleton />
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Course Catalog Page
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage Course Catalog page copywriting — hero and CTA
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
              if (page) {
                const merged: CourseCatalogContent = {
                  ...EMPTY_CONTENT,
                  ...(page.content || {}),
                  cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
                }
                form.setFieldsValue({ ...merged, cta: undefined })
                setContent(merged)
              }
              setHasChanges(false)
            }}
            className="text-yellow-600 hover:text-yellow-800 transition-colors text-sm font-medium"
          >
            Discard
          </button>
        </div>
      )}

      <PageSectionTabs
        items={SECTION_TABS}
        activeKey={activeSection}
        onChange={setActiveSection}
      />

      <Form form={form} layout="vertical" requiredMark={false}>
        {/* Hero (Jumbotron) */}
        <SectionCard
          active={activeSection === 'hero'}
          icon={Eye}
          title="Hero / Jumbotron"
          description="Tampil di bagian paling atas halaman Course Catalog"
        >
          <Field label="Title Page">
            <input
              className={inputCls}
              value={content.title_page}
              onChange={(e) => patch({ title_page: e.target.value })}
              placeholder="Course Catalog"
            />
          </Field>
          <Field
            label="Description Page"
            hint="Gunakan baris baru (Enter) untuk membuat paragraf baru."
          >
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="Whether you want to master a new software, sharpen your leadership abilities..."
            />
          </Field>
        </SectionCard>

        {/* CTA */}
        <SectionCard
          active={activeSection === 'cta'}
          icon={Megaphone}
          title="CTA"
          description="Call-to-action di akhir halaman Course Catalog"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title CTA">
              <input
                className={inputCls}
                value={content.cta.title}
                onChange={(e) => patchCta({ title: e.target.value })}
                placeholder="Ready to Train Your Team?"
              />
            </Field>
            <Field label="Description CTA">
              <input
                className={inputCls}
                value={content.cta.description}
                onChange={(e) => patchCta({ description: e.target.value })}
                placeholder="Get the full proposal and training details by clicking the button below."
              />
            </Field>
            <Field label="Label CTA">
              <input
                className={inputCls}
                value={content.cta.label}
                onChange={(e) => patchCta({ label: e.target.value })}
                placeholder="Request Proposal"
              />
            </Field>
            <Field
              label="Link CTA"
              hint="Isi URL lengkap (https://wa.me/..., /contact, mailto:...). Kosongkan agar memakai WhatsApp default."
            >
              <input
                className={inputCls}
                value={content.cta.link}
                onChange={(e) => patchCta({ link: e.target.value })}
                placeholder="https://wa.me/62812..."
              />
            </Field>
          </div>
        </SectionCard>
      </Form>
    </div>
  )
}