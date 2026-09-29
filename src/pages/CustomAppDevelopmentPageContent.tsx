import { useState, useEffect } from 'react'
import { Form } from 'antd'
import { Save, Eye, AppWindow, Megaphone } from 'lucide-react'
import Notification from '@/components/Notification'
import { ContentPageSkeleton } from '@/components/Skeletons'
import PageSectionTabs from '@/components/PageSectionTabs'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

/** Shape konten halaman Custom App Development (dicocokkan dengan compro). */
interface CapabilityItem {
  title: string
  description: string
}

interface CustomAppDevelopmentContent {
  title_page: string
  description_page: string
  capabilities: {
    title: string
    items: CapabilityItem[]
  }
  cta: {
    title: string
    description: string
    label: string
    wa_message: string
  }
}

const PAGE_CODE = 'custom-app-development'

const inputCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900'
const textareaCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 resize-y'

const EMPTY_CONTENT: CustomAppDevelopmentContent = {
  title_page: '',
  description_page: '',
  capabilities: {
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
  { key: 'capabilities', label: 'Development Capabilities', icon: AppWindow },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

export default function CustomAppDevelopmentPageContent() {
  const [form] = Form.useForm()
  const [content, setContent] =
    useState<CustomAppDevelopmentContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged: CustomAppDevelopmentContent = {
        ...EMPTY_CONTENT,
        ...(page.content || {}),
        capabilities: {
          ...EMPTY_CONTENT.capabilities,
          ...(page.content?.capabilities || {}),
        },
        cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
      }
      setContent(merged)
      setHasChanges(false)
    }
  }, [page])

  const patch = (partial: Partial<CustomAppDevelopmentContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchCta = (partial: Partial<CustomAppDevelopmentContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  // --- Capabilities (fix 4) ---
  const patchCapability = (index: number, partial: Partial<CapabilityItem>) => {
    const items = [...content.capabilities.items]
    items[index] = { ...items[index], ...partial }
    patch({ capabilities: { ...content.capabilities, items } })
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'Custom App Development', content },
        {
          onSuccess: () => {
            Notification(
              'success',
              'Custom App Development page updated successfully',
            )
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification(
              'error',
              error.message || 'Failed to update Custom App Development page',
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
            Custom App Development Page
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage Custom App Development page copywriting — hero, development
            capabilities, and CTA
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
                const merged: CustomAppDevelopmentContent = {
                  ...EMPTY_CONTENT,
                  ...(page.content || {}),
                  capabilities: {
                    ...EMPTY_CONTENT.capabilities,
                    ...(page.content?.capabilities || {}),
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
          description="Tampil di bagian paling atas halaman Custom App Development"
        >
          <Field label="Title Page">
            <input
              className={inputCls}
              value={content.title_page}
              onChange={(e) => patch({ title_page: e.target.value })}
              placeholder="Custom App Development"
            />
          </Field>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="We specialize in designing and building applications that are uniquely tailored to your organization's needs."
            />
          </Field>
        </SectionCard>

        {/* Development Capabilities */}
        <SectionCard
          active={activeSection === 'capabilities'}
          icon={AppWindow}
          title="Development Capabilities"
          description="Heading section + 4 kartu capability (jumlah tetap 4) — title + description per item"
        >
          <Field label="Section Title">
            <input
              className={inputCls}
              value={content.capabilities.title}
              onChange={(e) =>
                patch({
                  capabilities: {
                    ...content.capabilities,
                    title: e.target.value,
                  },
                })
              }
              placeholder="Development Capabilities"
            />
          </Field>
          <div className="space-y-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <span className="text-xs font-semibold text-gray-500">
                  Capability {index + 1}
                </span>
                <div className="mt-3 space-y-3">
                  <Field label={`Title Capability ${index + 1}`}>
                    <input
                      type="text"
                      className={inputCls}
                      value={content.capabilities.items[index]?.title ?? ''}
                      onChange={(e) =>
                        patchCapability(index, { title: e.target.value })
                      }
                      placeholder={`Capability ${index + 1} title`}
                    />
                  </Field>
                  <Field label={`Description Capability ${index + 1}`}>
                    <textarea
                      rows={3}
                      className={textareaCls}
                      value={content.capabilities.items[index]?.description ?? ''}
                      onChange={(e) =>
                        patchCapability(index, {
                          description: e.target.value,
                        })
                      }
                      placeholder={`Capability ${index + 1} description`}
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
          description="Call-to-action di akhir halaman Custom App Development"
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