import { useState, useEffect } from 'react'
import { Form } from 'antd'
import {
  Save,
  Eye,
  Package,
  Megaphone,
} from 'lucide-react'
import Notification from '@/components/Notification'
import { ContentPageSkeleton } from '@/components/Skeletons'
import PageSectionTabs from '@/components/PageSectionTabs'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

/** Shape konten halaman Ready-to-use IT Products (dicocokkan dengan compro). */
interface DeliverableItem {
  title: string
  description: string
}

interface ReadyToUseITProductContent {
  title_page: string
  description_page: string
  deliverables: {
    title: string
    items: DeliverableItem[]
  }
  cta: {
    title: string
    description: string
    label: string
    wa_message: string
  }
}

const PAGE_CODE = 'ready-to-use-it-product'

const inputCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900'
const textareaCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 resize-y'

const EMPTY_CONTENT: ReadyToUseITProductContent = {
  title_page: '',
  description_page: '',
  deliverables: {
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

const SECTION_TABS = [
  { key: 'hero', label: 'Hero', icon: Eye },
  { key: 'deliverables', label: 'Deliverables', icon: Package },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

export default function ReadyToUseITProductPageContent() {
  const [form] = Form.useForm()
  const [content, setContent] =
    useState<ReadyToUseITProductContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged: ReadyToUseITProductContent = {
        ...EMPTY_CONTENT,
        ...(page.content || {}),
        deliverables: {
          ...EMPTY_CONTENT.deliverables,
          ...(page.content?.deliverables || {}),
        },
        cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
      }
      setContent(merged)
      setHasChanges(false)
    }
  }, [page])

  const patch = (partial: Partial<ReadyToUseITProductContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchCta = (partial: Partial<ReadyToUseITProductContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  // --- Deliverables (fix 4) ---
  const patchDeliverable = (index: number, partial: Partial<DeliverableItem>) => {
    const items = [...content.deliverables.items]
    items[index] = { ...items[index], ...partial }
    patch({ deliverables: { ...content.deliverables, items } })
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'Ready-to-use IT Products', content },
        {
          onSuccess: () => {
            Notification(
              'success',
              'Ready-to-use IT Products page updated successfully',
            )
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification(
              'error',
              error.message || 'Failed to update Ready-to-use IT Products page',
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
            Ready-to-use IT Products Page
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage Ready-to-use IT Products page copywriting — hero, deliverables, and CTA
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
                const merged: ReadyToUseITProductContent = {
                  ...EMPTY_CONTENT,
                  ...(page.content || {}),
                  deliverables: {
                    ...EMPTY_CONTENT.deliverables,
                    ...(page.content?.deliverables || {}),
                  },
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
          description="Tampil di bagian paling atas halaman Ready-to-use IT Products"
        >
          <Field label="Title Page">
            <input
              className={inputCls}
              value={content.title_page}
              onChange={(e) => patch({ title_page: e.target.value })}
              placeholder="Ready-to-use IT Products"
            />
          </Field>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="These software solutions streamline operations..."
            />
          </Field>
        </SectionCard>

        {/* Deliverables */}
        <SectionCard
          active={activeSection === 'deliverables'}
          icon={Package}
          title="Deliverables"
          description="Heading section + 4 kartu deliverable (jumlah tetap 4) — title + description per item"
        >
          <Field label="Section Title">
            <input
              className={inputCls}
              value={content.deliverables.title}
              onChange={(e) =>
                patch({
                  deliverables: {
                    ...content.deliverables,
                    title: e.target.value,
                  },
                })
              }
              placeholder="Our Project Deliverable"
            />
          </Field>
          <div className="space-y-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <span className="text-xs font-semibold text-gray-500">
                  Deliverable {index + 1}
                </span>
                <div className="mt-3 space-y-3">
                  <Field label={`Title Deliverable ${index + 1}`}>
                    <input
                      type="text"
                      className={inputCls}
                      value={content.deliverables.items[index]?.title ?? ''}
                      onChange={(e) =>
                        patchDeliverable(index, { title: e.target.value })
                      }
                      placeholder={`Deliverable ${index + 1} title`}
                    />
                  </Field>
                  <Field label={`Description Deliverable ${index + 1}`}>
                    <textarea
                      rows={3}
                      className={textareaCls}
                      value={content.deliverables.items[index]?.description ?? ''}
                      onChange={(e) =>
                        patchDeliverable(index, { description: e.target.value })
                      }
                      placeholder={`Deliverable ${index + 1} description`}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* CTA */}
        <SectionCard
          active={activeSection === 'cta'}
          icon={Megaphone}
          title="CTA"
          description="Call-to-action di akhir halaman Ready-to-use IT Products"
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
                placeholder="Halo ExecuTrain, saya tertarik dan ingin tahu lebih lanjut..."
              />
            </Field>
          </div>
        </SectionCard>
      </Form>
    </div>
  )
}