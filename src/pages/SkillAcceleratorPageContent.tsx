import { useState, useEffect } from 'react'
import { Form } from 'antd'
import {
  Save,
  Eye,
  ListChecks,
  Megaphone,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react'
import Notification from '@/components/Notification'
import PageSectionTabs from '@/components/PageSectionTabs'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

/** Shape konten halaman Skill Accelerator (dicocokkan dengan compro). */
interface SkillAcceleratorContent {
  title_page: string
  description_page: string
  title_about_psa: string
  description_about_psa: string
  points: string[]
  cta: {
    title: string
    description: string
    label: string
    link: string
  }
}

const PAGE_CODE = 'skill-accelerator'

const EMPTY_CONTENT: SkillAcceleratorContent = {
  title_page: '',
  description_page: '',
  title_about_psa: '',
  description_about_psa: '',
  points: [],
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
  { key: 'about', label: 'About PSA', icon: Zap },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

export default function SkillAcceleratorPageContent() {
  const [form] = Form.useForm()
  const [content, setContent] =
    useState<SkillAcceleratorContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged: SkillAcceleratorContent = {
        ...EMPTY_CONTENT,
        ...(page.content || {}),
        cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
      }
      form.setFieldsValue({ ...merged, cta: undefined })
      setContent(merged)
      setHasChanges(false)
    }
  }, [page, form])

  const patch = (partial: Partial<SkillAcceleratorContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchCta = (partial: Partial<SkillAcceleratorContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  const setPoint = (index: number, value: string) => {
    const next = [...content.points]
    next[index] = value
    patch({ points: next })
  }

  const addPoint = () => patch({ points: [...content.points, ''] })
  const removePoint = (index: number) =>
    patch({ points: content.points.filter((_, i) => i !== index) })

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'Skill Accelerator', content },
        {
          onSuccess: () => {
            Notification('success', 'Skill Accelerator page updated successfully')
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification(
              'error',
              error.message || 'Failed to update Skill Accelerator page',
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
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Skill Accelerator Page
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage Skill Accelerator page copywriting — hero, about PSA section,
            and CTA
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
                const merged: SkillAcceleratorContent = {
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
          description="Tampil di bagian paling atas halaman Skill Accelerator"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title Page">
              <input
                className={inputCls}
                value={content.title_page}
                onChange={(e) => patch({ title_page: e.target.value })}
                placeholder="Skill Accelerator"
              />
            </Field>
          </div>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="An intensive, outcome-focused program designed to rapidly build or upgrade a specific set of competencies."
            />
          </Field>
        </SectionCard>

        {/* About PSA */}
        <SectionCard
          active={activeSection === 'about'}
          icon={Zap}
          title="About PSA"
          description="Card 'What is Professional Skill Accelerator Program?'"
        >
          <Field label="Title About PSA">
            <input
              className={inputCls}
              value={content.title_about_psa}
              onChange={(e) => patch({ title_about_psa: e.target.value })}
              placeholder="What is Professional Skill Accelerator Program?"
            />
          </Field>
          <Field
            label="Description About PSA"
            hint="Gunakan baris baru (Enter) untuk membuat paragraf baru."
          >
            <textarea
              rows={5}
              className={textareaCls}
              value={content.description_about_psa}
              onChange={(e) =>
                patch({ description_about_psa: e.target.value })
              }
              placeholder="Skill Accelerator provide a fast, practical learning experience..."
            />
          </Field>
          <Field label="Points">
            <div className="space-y-2">
              {content.points.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
                  No points yet. Click "Add point" to start.
                </p>
              ) : (
                content.points.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ListChecks className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    <input
                      type="text"
                      className={inputCls}
                      value={point}
                      onChange={(e) => setPoint(index, e.target.value)}
                      placeholder={`Point ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removePoint(index)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove point"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={addPoint}
              className="mt-3 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add point
            </button>
          </Field>
        </SectionCard>

        {/* CTA */}
        <SectionCard
          active={activeSection === 'cta'}
          icon={Megaphone}
          title="CTA"
          description="Call-to-action di akhir halaman Skill Accelerator"
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
