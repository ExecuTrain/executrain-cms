import { useState, useEffect } from 'react'
import { Form } from 'antd'
import {
  Save,
  Eye,
  Workflow,
  Headphones,
  HelpCircle,
  Shield,
  Megaphone,
  Plus,
  Trash2,
} from 'lucide-react'
import Notification from '@/components/Notification'
import PageSectionTabs from '@/components/PageSectionTabs'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

/** Shape konten halaman Tech Advisory (dicocokkan dengan compro). */
interface AdvisoryItem {
  title: string
  description: string
}

interface FaqItem {
  question: string
  answer: string
}

interface TechAdvisoryContent {
  title_page: string
  description_page: string
  advisory_work: {
    title: string
    items: AdvisoryItem[]
  }
  advisory_support: {
    title: string
    points: string[]
  }
  faq: {
    title: string
    questions: FaqItem[]
  }
  boundaries: {
    points: string[]
  }
  cta: {
    title: string
    description: string
    label: string
    link: string
  }
}

const PAGE_CODE = 'tech-advisory'

const EMPTY_CONTENT: TechAdvisoryContent = {
  title_page: '',
  description_page: '',
  advisory_work: {
    title: '',
    items: [],
  },
  advisory_support: {
    title: '',
    points: [],
  },
  faq: {
    title: '',
    questions: [],
  },
  boundaries: {
    points: [],
  },
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
  { key: 'hero', label: 'Hero', icon: Eye },
  { key: 'work', label: 'How Advisory Work', icon: Workflow },
  { key: 'support', label: 'Advisory Support', icon: Headphones },
  { key: 'faq', label: 'FAQ', icon: HelpCircle },
  { key: 'boundaries', label: 'Boundaries', icon: Shield },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

export default function TechAdvisoryPageContent() {
  const [form] = Form.useForm()
  const [content, setContent] = useState<TechAdvisoryContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged: TechAdvisoryContent = {
        ...EMPTY_CONTENT,
        ...(page.content || {}),
        advisory_work: {
          ...EMPTY_CONTENT.advisory_work,
          ...(page.content?.advisory_work || {}),
        },
        advisory_support: {
          ...EMPTY_CONTENT.advisory_support,
          ...(page.content?.advisory_support || {}),
        },
        faq: { ...EMPTY_CONTENT.faq, ...(page.content?.faq || {}) },
        boundaries: {
          ...EMPTY_CONTENT.boundaries,
          ...(page.content?.boundaries || {}),
        },
        cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
      }
      form.setFieldsValue({
        ...merged,
        advisory_work: undefined,
        advisory_support: undefined,
        faq: undefined,
        boundaries: undefined,
        cta: undefined,
      })
      setContent(merged)
      setHasChanges(false)
    }
  }, [page, form])

  const patch = (partial: Partial<TechAdvisoryContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchCta = (partial: Partial<TechAdvisoryContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  // --- Advisory Work items (fix 3) ---
  const patchWorkItem = (index: number, partial: Partial<AdvisoryItem>) => {
    const items = [...content.advisory_work.items]
    items[index] = { ...items[index], ...partial }
    patch({
      advisory_work: { ...content.advisory_work, items },
    })
  }

  // --- Advisory Support points ---
  const setSupportPoint = (index: number, value: string) => {
    const points = [...content.advisory_support.points]
    points[index] = value
    patch({ advisory_support: { ...content.advisory_support, points } })
  }

  const addSupportPoint = () =>
    patch({
      advisory_support: {
        ...content.advisory_support,
        points: [...content.advisory_support.points, ''],
      },
    })
  const removeSupportPoint = (index: number) =>
    patch({
      advisory_support: {
        ...content.advisory_support,
        points: content.advisory_support.points.filter((_, i) => i !== index),
      },
    })

  // --- FAQ ---
  const patchQuestion = (index: number, partial: Partial<FaqItem>) => {
    const questions = [...content.faq.questions]
    questions[index] = { ...questions[index], ...partial }
    patch({ faq: { ...content.faq, questions } })
  }

  const addQuestion = () =>
    patch({
      faq: {
        ...content.faq,
        questions: [...content.faq.questions, { question: '', answer: '' }],
      },
    })
  const removeQuestion = (index: number) =>
    patch({
      faq: {
        ...content.faq,
        questions: content.faq.questions.filter((_, i) => i !== index),
      },
    })

  // --- Boundaries points ---
  const setBoundaryPoint = (index: number, value: string) => {
    const points = [...content.boundaries.points]
    points[index] = value
    patch({ boundaries: { ...content.boundaries, points } })
  }

  const addBoundaryPoint = () =>
    patch({
      boundaries: {
        ...content.boundaries,
        points: [...content.boundaries.points, ''],
      },
    })
  const removeBoundaryPoint = (index: number) =>
    patch({
      boundaries: {
        ...content.boundaries,
        points: content.boundaries.points.filter((_, i) => i !== index),
      },
    })

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'Tech Advisory', content },
        {
          onSuccess: () => {
            Notification('success', 'Tech Advisory page updated successfully')
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification(
              'error',
              error.message || 'Failed to update Tech Advisory page',
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
          <h1 className="text-xl font-bold text-gray-900">Tech Advisory Page</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage Tech Advisory page copywriting — hero, advisory work, support,
            FAQ, boundaries, and CTA
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
                const merged: TechAdvisoryContent = {
                  ...EMPTY_CONTENT,
                  ...(page.content || {}),
                  advisory_work: {
                    ...EMPTY_CONTENT.advisory_work,
                    ...(page.content?.advisory_work || {}),
                  },
                  advisory_support: {
                    ...EMPTY_CONTENT.advisory_support,
                    ...(page.content?.advisory_support || {}),
                  },
                  faq: { ...EMPTY_CONTENT.faq, ...(page.content?.faq || {}) },
                  boundaries: {
                    ...EMPTY_CONTENT.boundaries,
                    ...(page.content?.boundaries || {}),
                  },
                  cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
                }
                form.setFieldsValue({
                  ...merged,
                  advisory_work: undefined,
                  advisory_support: undefined,
                  faq: undefined,
                  boundaries: undefined,
                  cta: undefined,
                })
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
          description="Tampil di bagian paling atas halaman Tech Advisory"
        >
          <Field label="Title Page">
            <input
              className={inputCls}
              value={content.title_page}
              onChange={(e) => patch({ title_page: e.target.value })}
              placeholder="Tech Advisory"
            />
          </Field>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="Independent technical guidance for teams choosing an architecture..."
            />
          </Field>
        </SectionCard>

        {/* Advisory Work */}
        <SectionCard
          active={activeSection === 'work'}
          icon={Workflow}
          title="How The Advisory Work"
          description="3 kartu — title + description per item (jumlah tetap 3)"
        >
          <Field label="Section Title">
            <input
              className={inputCls}
              value={content.advisory_work.title}
              onChange={(e) =>
                patch({
                  advisory_work: {
                    ...content.advisory_work,
                    title: e.target.value,
                  },
                })
              }
              placeholder="How The Advisory Work"
            />
          </Field>
          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <span className="text-xs font-semibold text-gray-500">
                  Item {index + 1}
                </span>
                <div className="mt-3 space-y-3">
                  <Field label={`Title Item ${index + 1}`}>
                    <input
                      type="text"
                      className={inputCls}
                      value={content.advisory_work.items[index]?.title ?? ''}
                      onChange={(e) =>
                        patchWorkItem(index, { title: e.target.value })
                      }
                      placeholder={`Item ${index + 1} title`}
                    />
                  </Field>
                  <Field label={`Description Item ${index + 1}`}>
                    <textarea
                      rows={3}
                      className={textareaCls}
                      value={
                        content.advisory_work.items[index]?.description ?? ''
                      }
                      onChange={(e) =>
                        patchWorkItem(index, { description: e.target.value })
                      }
                      placeholder={`Item ${index + 1} description`}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Advisory Support */}
        <SectionCard
          active={activeSection === 'support'}
          icon={Headphones}
          title="Advisory Support"
          description="Title section + points (build vs. buy, vendor eval, dst.)"
        >
          <Field label="Section Title">
            <input
              className={inputCls}
              value={content.advisory_support.title}
              onChange={(e) =>
                patch({
                  advisory_support: {
                    ...content.advisory_support,
                    title: e.target.value,
                  },
                })
              }
              placeholder="Where this Advisory Helps Most"
            />
          </Field>
          <Field label="Points">
            <div className="space-y-2">
              {content.advisory_support.points.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
                  No points yet. Click "Add point" to start.
                </p>
              ) : (
                content.advisory_support.points.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className={inputCls}
                      value={point}
                      onChange={(e) => setSupportPoint(index, e.target.value)}
                      placeholder={`Point ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeSupportPoint(index)}
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
              onClick={addSupportPoint}
              className="mt-3 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add point
            </button>
          </Field>
        </SectionCard>

        {/* FAQ */}
        <SectionCard
          active={activeSection === 'faq'}
          icon={HelpCircle}
          title="FAQ"
          description="Accordion tanya-jawab — title section + questions (question & answer)"
        >
          <Field label="Section Title">
            <input
              className={inputCls}
              value={content.faq.title}
              onChange={(e) =>
                patch({ faq: { ...content.faq, title: e.target.value } })
              }
              placeholder="What this advisory is — and isn't"
            />
          </Field>
          {content.faq.questions.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No questions yet. Click "Add question" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {content.faq.questions.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500">
                      Question {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove question"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <Field label="Question">
                      <textarea
                        rows={2}
                        className={textareaCls}
                        value={item.question}
                        onChange={(e) =>
                          patchQuestion(index, { question: e.target.value })
                        }
                        placeholder="Your question..."
                      />
                    </Field>
                    <Field label="Answer">
                      <textarea
                        rows={3}
                        className={textareaCls}
                        value={item.answer}
                        onChange={(e) =>
                          patchQuestion(index, { answer: e.target.value })
                        }
                        placeholder="Your answer..."
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add question
          </button>
        </SectionCard>

        {/* Boundaries */}
        <SectionCard
          active={activeSection === 'boundaries'}
          icon={Shield}
          title="Boundaries"
          description="Yang tidak termasuk layanan — points list"
        >
          {content.boundaries.points.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No points yet. Click "Add point" to start.
            </p>
          ) : (
            <div className="space-y-2">
              {content.boundaries.points.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    className={inputCls}
                    value={point}
                    onChange={(e) => setBoundaryPoint(index, e.target.value)}
                    placeholder={`Boundary ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeBoundaryPoint(index)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove point"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addBoundaryPoint}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add point
          </button>
        </SectionCard>

        {/* CTA */}
        <SectionCard
          active={activeSection === 'cta'}
          icon={Megaphone}
          title="CTA"
          description="Call-to-action di akhir halaman Tech Advisory"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title CTA">
              <input
                className={inputCls}
                value={content.cta.title}
                onChange={(e) => patchCta({ title: e.target.value })}
                placeholder="Need Some Advisory?"
              />
            </Field>
            <Field label="Description CTA">
              <input
                className={inputCls}
                value={content.cta.description}
                onChange={(e) => patchCta({ description: e.target.value })}
                placeholder="Chat our sales for detailed information"
              />
            </Field>
            <Field label="Label CTA">
              <input
                className={inputCls}
                value={content.cta.label}
                onChange={(e) => patchCta({ label: e.target.value })}
                placeholder="Contact Now!"
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