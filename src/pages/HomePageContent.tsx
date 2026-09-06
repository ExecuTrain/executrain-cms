import { useState, useEffect } from 'react'
import { Form } from 'antd'
import { Save, Eye, Megaphone, Info, Sparkles, GitFork } from 'lucide-react'
import Notification from '@/components/Notification'
import PageSectionTabs from '@/components/PageSectionTabs'
import FrameworkScopeEditor from '@/components/FrameworkScopeEditor'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

interface ServiceItem {
  title: string
  description: string
}

interface HomeContent {
  title_page: string
  description_page: string
  about: {
    title: string
    description: string
  }
  services: {
    items: ServiceItem[]
  }
  framework: {
    items: Record<string, string[]>
  }
  cta: {
    title: string
    description: string
    label: string
    link: string
  }
}

const PAGE_CODE = 'home-page'
const SERVICE_COUNT = 3

const EMPTY_CONTENT: HomeContent = {
  title_page: '',
  description_page: '',
  about: {
    title: '',
    description: '',
  },
  services: {
    items: Array.from({ length: SERVICE_COUNT }, () => ({
      title: '',
      description: '',
    })),
  },
  framework: {
    items: {},
  },
  cta: {
    title: '',
    description: '',
    label: '',
    link: '',
  },
}

const inputCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900'
const textareaCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 resize-y'

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
  { key: 'hero', label: 'Hero / Jumbotron', icon: Eye },
  { key: 'about', label: 'About', icon: Info },
  { key: 'services', label: 'What We Can Do', icon: Sparkles },
  { key: 'framework', label: 'Framework Diagram', icon: GitFork },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

/** Normalisasi konten agar selalu berisi 3 item services (fix). */
function normalizeContent(raw: any): HomeContent {
  const rawServices = raw?.services?.items || []
  return {
    ...EMPTY_CONTENT,
    ...(raw || {}),
    about: { ...EMPTY_CONTENT.about, ...(raw?.about || {}) },
    services: {
      items: Array.from({ length: SERVICE_COUNT }, (_, i) => ({
        ...EMPTY_CONTENT.services.items[i],
        ...(rawServices[i] || {}),
      })),
    },
    cta: { ...EMPTY_CONTENT.cta, ...(raw?.cta || {}) },
  }
}

/** Form untuk halaman Home (company profile) — jumbotron, about, services, CTA. */
export default function HomePageContent() {
  const [form] = Form.useForm()
  const [content, setContent] = useState<HomeContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged = normalizeContent(page.content)
      form.setFieldsValue({ ...merged, cta: undefined })
      setContent(merged)
      setHasChanges(false)
    }
  }, [page, form])

  const patch = (partial: Partial<HomeContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchAbout = (partial: Partial<HomeContent['about']>) => {
    setContent((prev) => ({ ...prev, about: { ...prev.about, ...partial } }))
    setHasChanges(true)
  }

  const patchService = (index: number, partial: Partial<ServiceItem>) => {
    const next = [...content.services.items]
    next[index] = { ...next[index], ...partial }
    patch({ services: { items: next } })
  }

  const patchFramework = (items: Record<string, string[]>) => {
    patch({ framework: { items } })
  }

  const patchCta = (partial: Partial<HomeContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'Home Page', content },
        {
          onSuccess: () => {
            Notification('success', 'Home page updated successfully')
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification('error', error.message || 'Failed to update Home page')
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
          <h1 className="text-xl font-bold text-gray-900">Home Page</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage Home page copywriting — jumbotron, about, services, and CTA
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
                const merged = normalizeContent(page.content)
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
          description="Tampil di bagian paling atas halaman Home"
        >
          <Field label="Title Page">
            <input
              className={inputCls}
              value={content.title_page}
              onChange={(e) => patch({ title_page: e.target.value })}
              placeholder="The Strategic IT Partner Behind Today's Leading Enterprise"
            />
          </Field>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="Delivering world-class IT training, business skills, and technology solutions..."
            />
          </Field>
        </SectionCard>

        {/* About */}
        <SectionCard
          active={activeSection === 'about'}
          icon={Info}
          title="About"
          description="Kartu ABOUT di home — title + description singkat"
        >
          <Field label="Title">
            <input
              className={inputCls}
              value={content.about.title}
              onChange={(e) => patchAbout({ title: e.target.value })}
              placeholder="We Transform Result Into Impact"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={4}
              className={textareaCls}
              value={content.about.description}
              onChange={(e) => patchAbout({ description: e.target.value })}
              placeholder="We believe technology only matters when it uplifts people..."
            />
          </Field>
        </SectionCard>

        {/* What We Can Do */}
        <SectionCard
          active={activeSection === 'services'}
          icon={Sparkles}
          title="What We Can Do"
          description="3 kartu layanan (jumlah tetap 3) — title + description per item"
        >
          {content.services.items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-500">
                  Service {index + 1}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={`Title ${index + 1}`}>
                  <input
                    type="text"
                    className={inputCls}
                    value={item.title}
                    onChange={(e) =>
                      patchService(index, { title: e.target.value })
                    }
                    placeholder="Building Real Skills"
                  />
                </Field>
                <Field label={`Description ${index + 1}`}>
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={item.description}
                    onChange={(e) =>
                      patchService(index, { description: e.target.value })
                    }
                    placeholder="Equipping people with practical skills..."
                  />
                </Field>
              </div>
            </div>
          ))}
        </SectionCard>

        {/* Framework Diagram */}
        <SectionCard
          active={activeSection === 'framework'}
          icon={GitFork}
          title="Framework Diagram"
          description="Daftar item di dalam tiap scope pada wheel diagram — scope tetap, hanya item yang dinamis"
        >
          <FrameworkScopeEditor
            value={content.framework.items}
            onChange={patchFramework}
          />
        </SectionCard>

        {/* CTA */}
        <SectionCard
          active={activeSection === 'cta'}
          icon={Megaphone}
          title="CTA"
          description="Call-to-action di akhir halaman Home"
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