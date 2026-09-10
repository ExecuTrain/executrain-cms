import { useState, useEffect } from 'react'
import { Form } from 'antd'
import {
  Save,
  Eye,
  Workflow,
  Headphones,
  Megaphone,
  Plus,
  Trash2,
} from 'lucide-react'
import Notification from '@/components/Notification'
import { ContentPageSkeleton } from '@/components/Skeletons'
import PageSectionTabs from '@/components/PageSectionTabs'
import ImageUpload from '@/components/ImageUpload'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

/** Shape konten halaman Implementation & Support (dicocokkan dengan compro). */
interface ImageValue {
  url: string
  public_id: string
}

interface WorkflowStep {
  title: string
  description: string
}

interface SupportItem {
  title: string
  description: string
  points: string[]
  thumbnail: ImageValue | null
  wa_message: string
}

interface ImplementationSupportContent {
  title_page: string
  description_page: string
  workflow: {
    title: string
    description: string
    steps: WorkflowStep[]
  }
  support: {
    title: string
    items: SupportItem[]
  }
  cta: {
    title: string
    description: string
    label: string
    wa_message: string
  }
}

const PAGE_CODE = 'implementation-support'

const EMPTY_CONTENT: ImplementationSupportContent = {
  title_page: '',
  description_page: '',
  workflow: {
    title: '',
    description: '',
    steps: [],
  },
  support: {
    title: '',
    items: [],
  },
  cta: {
    title: '',
    description: '',
    label: '',
    wa_message: '',
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
  { key: 'workflow', label: 'Implementation Workflow', icon: Workflow },
  { key: 'support', label: 'Support', icon: Headphones },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

export default function ImplementationSupportPageContent() {
  const [form] = Form.useForm()
  const [content, setContent] =
    useState<ImplementationSupportContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged: ImplementationSupportContent = {
        ...EMPTY_CONTENT,
        ...(page.content || {}),
        workflow: { ...EMPTY_CONTENT.workflow, ...(page.content?.workflow || {}) },
        support: { ...EMPTY_CONTENT.support, ...(page.content?.support || {}) },
        cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
      }
      setContent(merged)
      setHasChanges(false)
    }
  }, [page])

  const patch = (partial: Partial<ImplementationSupportContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchCta = (partial: Partial<ImplementationSupportContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  // --- Workflow steps (fix 4) ---
  const patchStep = (index: number, partial: Partial<WorkflowStep>) => {
    const steps = [...content.workflow.steps]
    steps[index] = { ...steps[index], ...partial }
    patch({ workflow: { ...content.workflow, steps } })
  }

  // --- Support items (dinamis) ---
  const patchSupportItem = (index: number, partial: Partial<SupportItem>) => {
    const items = [...content.support.items]
    items[index] = { ...items[index], ...partial }
    patch({ support: { ...content.support, items } })
  }

  const patchSupportPoint = (
    itemIndex: number,
    pointIndex: number,
    value: string,
  ) => {
    const items = [...content.support.items]
    const points = [...items[itemIndex].points]
    points[pointIndex] = value
    items[itemIndex] = { ...items[itemIndex], points }
    patch({ support: { ...content.support, items } })
  }

  const addSupportPoint = (itemIndex: number) => {
    const items = [...content.support.items]
    items[itemIndex] = {
      ...items[itemIndex],
      points: [...items[itemIndex].points, ''],
    }
    patch({ support: { ...content.support, items } })
  }

  const removeSupportPoint = (itemIndex: number, pointIndex: number) => {
    const items = [...content.support.items]
    items[itemIndex] = {
      ...items[itemIndex],
      points: items[itemIndex].points.filter((_, i) => i !== pointIndex),
    }
    patch({ support: { ...content.support, items } })
  }

  const addSupportItem = () =>
    patch({
      support: {
        ...content.support,
        items: [
          ...content.support.items,
          { title: '', description: '', points: [''], thumbnail: null, wa_message: '' },
        ],
      },
    })
  const removeSupportItem = (index: number) =>
    patch({
      support: {
        ...content.support,
        items: content.support.items.filter((_, i) => i !== index),
      },
    })

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'Implementation & Support', content },
        {
          onSuccess: () => {
            Notification('success', 'Implementation & Support page updated successfully')
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification('error', error.message || 'Failed to update Implementation & Support page')
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
            Implementation & Support Page
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage Implementation & Support page copywriting — hero, workflow, support, and CTA
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
                const merged: ImplementationSupportContent = {
                  ...EMPTY_CONTENT,
                  ...(page.content || {}),
                  workflow: { ...EMPTY_CONTENT.workflow, ...(page.content?.workflow || {}) },
                  support: { ...EMPTY_CONTENT.support, ...(page.content?.support || {}) },
                  cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
                }
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
          description="Tampil di bagian paling atas halaman Implementation & Support"
        >
          <Field label="Title Page">
            <input
              className={inputCls}
              value={content.title_page}
              onChange={(e) => patch({ title_page: e.target.value })}
              placeholder="Implementation & Support"
            />
          </Field>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="Description jumbotron..."
            />
          </Field>
        </SectionCard>

        {/* Implementation Workflow */}
        <SectionCard
          active={activeSection === 'workflow'}
          icon={Workflow}
          title="Implementation Workflow"
          description="Title + deskripsi section, lalu 4 kartu workflow (jumlah tetap 4)"
        >
          <Field label="Section Title">
            <input
              className={inputCls}
              value={content.workflow.title}
              onChange={(e) =>
                patch({ workflow: { ...content.workflow, title: e.target.value } })
              }
              placeholder="Implementation Workflow"
            />
          </Field>
          <Field label="Section Description">
            <textarea
              rows={2}
              className={textareaCls}
              value={content.workflow.description}
              onChange={(e) =>
                patch({
                  workflow: { ...content.workflow, description: e.target.value },
                })
              }
              placeholder="Deskripsi section workflow..."
            />
          </Field>
          <div className="space-y-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <span className="text-xs font-semibold text-gray-500">
                  Step {index + 1}
                </span>
                <div className="mt-3 space-y-3">
                  <Field label={`Title Step ${index + 1}`}>
                    <input
                      type="text"
                      className={inputCls}
                      value={content.workflow.steps[index]?.title ?? ''}
                      onChange={(e) =>
                        patchStep(index, { title: e.target.value })
                      }
                      placeholder={`Step ${index + 1} title`}
                    />
                  </Field>
                  <Field label={`Description Step ${index + 1}`}>
                    <textarea
                      rows={3}
                      className={textareaCls}
                      value={content.workflow.steps[index]?.description ?? ''}
                      onChange={(e) =>
                        patchStep(index, { description: e.target.value })
                      }
                      placeholder={`Step ${index + 1} description`}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Support */}
        <SectionCard
          active={activeSection === 'support'}
          icon={Headphones}
          title="Support — pick up piece by piece"
          description="Kartu dinamis — title, description, thumbnail (upload), points[], dan template pesan WA"
        >
          <Field label="Section Title">
            <input
              className={inputCls}
              value={content.support.title}
              onChange={(e) =>
                patch({ support: { ...content.support, title: e.target.value } })
              }
              placeholder="Support you can pick up piece by piece"
            />
          </Field>

          {content.support.items.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No support items yet. Click "Add support item" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {content.support.items.map((item, itemIndex) => (
                <div key={itemIndex} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500">
                      Support {itemIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSupportItem(itemIndex)}
                      className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove support item"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Field label={`Title Support ${itemIndex + 1}`}>
                      <input
                        type="text"
                        className={inputCls}
                        value={item.title}
                        onChange={(e) =>
                          patchSupportItem(itemIndex, { title: e.target.value })
                        }
                        placeholder="Ongoing maintenance"
                      />
                    </Field>
                    <Field label="Thumbnail">
                      <ImageUpload
                        label=""
                        value={item.thumbnail}
                        onChange={(thumbnail) =>
                          patchSupportItem(itemIndex, { thumbnail })
                        }
                        folder="page-implementation-support"
                        aspectClass="h-44"
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label={`Description Support ${itemIndex + 1}`}>
                      <textarea
                        rows={2}
                        className={textareaCls}
                        value={item.description}
                        onChange={(e) =>
                          patchSupportItem(itemIndex, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Deskripsi singkat support ini..."
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-gray-700">
                        Points
                      </label>
                      <button
                        type="button"
                        onClick={() => addSupportPoint(itemIndex)}
                        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add point
                      </button>
                    </div>
                    <div className="space-y-2">
                      {item.points.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            className={inputCls}
                            value={point}
                            onChange={(e) =>
                              patchSupportPoint(
                                itemIndex,
                                pointIndex,
                                e.target.value,
                              )
                            }
                            placeholder={`Point ${pointIndex + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeSupportPoint(itemIndex, pointIndex)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            aria-label="Remove point"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Field
                      label="Template Pesan WhatsApp"
                      hint="Tombol 'I Need This Support' selalu membuka WhatsApp sales. Isi template pesan awal di sini (kosongkan utk memakai template default)."
                    >
                      <textarea
                        className={inputCls}
                        rows={3}
                        value={item.wa_message}
                        onChange={(e) =>
                          patchSupportItem(itemIndex, { wa_message: e.target.value })
                        }
                        placeholder="Halo ExecuTrain, saya butuh support untuk ..."
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addSupportItem}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add support item
          </button>
        </SectionCard>

        {/* CTA */}
        <SectionCard
          active={activeSection === 'cta'}
          icon={Megaphone}
          title="CTA"
          description="Call-to-action di akhir halaman Implementation & Support"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title CTA">
              <input
                className={inputCls}
                value={content.cta.title}
                onChange={(e) => patchCta({ title: e.target.value })}
                placeholder="Need These Kind Of Services?"
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
                placeholder="Consult Now!"
              />
            </Field>
            <Field
              label="Template Pesan WhatsApp"
              hint="CTA selalu membuka WhatsApp sales (nomor dari master data social media). Isi template pesan awal (kosongkan utk memakai template default)."
            >
              <textarea
                className={inputCls}
                rows={3}
                value={content.cta.wa_message}
                onChange={(e) => patchCta({ wa_message: e.target.value })}
                placeholder="Halo ExecuTrain, saya butuh bantuan implementasi & support..."
              />
            </Field>
          </div>
        </SectionCard>
      </Form>
    </div>
  )
}