import { useState, useEffect } from 'react'
import { Form } from 'antd'
import {
  Save,
  Info,
  Eye,
  Target,
  Award,
  ListOrdered,
  Megaphone,
  Plus,
  Trash2,
} from 'lucide-react'
import Notification from '@/components/Notification'
import { ContentPageSkeleton } from '@/components/Skeletons'
import PageSectionTabs from '@/components/PageSectionTabs'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

/** Shape konten halaman About (dicocokkan dengan compro). */
interface JoinStep {
  title: string
  description: string
}

interface AboutContent {
  title_page: string
  description_page: string
  title_about: string
  description_about: string
  vision: string
  mission: string
  awards: string[]
  join_steps: JoinStep[]
  cta: {
    title: string
    description: string
    label: string
    wa_message: string
  }
}

const PAGE_CODE = 'about'

const EMPTY_CONTENT: AboutContent = {
  title_page: '',
  description_page: '',
  title_about: '',
  description_about: '',
  vision: '',
  mission: '',
  awards: [],
  join_steps: [],
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
  { key: 'hero', label: 'Hero / Jumbotron', icon: Eye },
  { key: 'about', label: 'About Section', icon: Info },
  { key: 'vision', label: 'Vision & Mission', icon: Target },
  { key: 'awards', label: 'Awards', icon: Award },
  { key: 'join', label: 'Join Steps', icon: ListOrdered },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

export default function AboutPage() {
  const [form] = Form.useForm()
  const [content, setContent] = useState<AboutContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged: AboutContent = {
        ...EMPTY_CONTENT,
        ...(page.content || {}),
        cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
      }
      form.setFieldsValue({ ...merged, cta: undefined })
      setContent(merged)
      setHasChanges(false)
    }
  }, [page, form])

  const patch = (partial: Partial<AboutContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchCta = (partial: Partial<AboutContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  const setAward = (index: number, value: string) => {
    const next = [...content.awards]
    next[index] = value
    patch({ awards: next })
  }

  const addAward = () => patch({ awards: [...content.awards, ''] })
  const removeAward = (index: number) =>
    patch({ awards: content.awards.filter((_, i) => i !== index) })

  const patchStep = (index: number, partial: Partial<JoinStep>) => {
    const next = [...content.join_steps]
    next[index] = { ...next[index], ...partial }
    patch({ join_steps: next })
  }

  const addStep = () =>
    patch({ join_steps: [...content.join_steps, { title: '', description: '' }] })
  const removeStep = (index: number) =>
    patch({ join_steps: content.join_steps.filter((_, i) => i !== index) })

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'About Us', content },
        {
          onSuccess: () => {
            Notification('success', 'About page updated successfully')
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification('error', error.message || 'Failed to update About page')
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
          <h1 className="text-xl font-bold text-gray-900">About Page</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage About page copywriting — hero, about section, vision &
            mission, awards, join steps, and CTA
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
                const merged: AboutContent = {
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
          description="Tampil di bagian paling atas halaman About"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title Page">
              <input
                className={inputCls}
                value={content.title_page}
                onChange={(e) => patch({ title_page: e.target.value })}
                placeholder="About Us"
              />
            </Field>
          </div>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="Explore our journey, values, and the talented individuals..."
            />
          </Field>
        </SectionCard>

        {/* About Section */}
        <SectionCard
          active={activeSection === 'about'}
          icon={Info}
          title="About Section"
          description="Tampil di section about (ABOUT)"
        >
          <Field label="Title About">
            <input
              className={inputCls}
              value={content.title_about}
              onChange={(e) => patch({ title_about: e.target.value })}
              placeholder="We Transform Result Into Impact"
            />
          </Field>
          <Field
            label="Description About"
            hint="Gunakan baris baru (Enter) untuk membuat paragraf baru."
          >
            <textarea
              rows={6}
              className={textareaCls}
              value={content.description_about}
              onChange={(e) => patch({ description_about: e.target.value })}
              placeholder="Write the long description about the company..."
            />
          </Field>
        </SectionCard>

        {/* Vision & Mission */}
        <SectionCard
          active={activeSection === 'vision'}
          icon={Target}
          title="Vision & Mission"
          description="Card vision-mission di halaman About"
        >
          <Field label="Vision">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.vision}
              onChange={(e) => patch({ vision: e.target.value })}
              placeholder="Our vision statement..."
            />
          </Field>
          <Field label="Mission">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.mission}
              onChange={(e) => patch({ mission: e.target.value })}
              placeholder="Our mission statement..."
            />
          </Field>
        </SectionCard>

        {/* Awards */}
        <SectionCard
          active={activeSection === 'awards'}
          icon={Award}
          title="Awards"
          description="Daftar penghargaan (string[])"
        >
          {content.awards.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No awards yet. Click "Add award" to start.
            </p>
          ) : (
            <div className="space-y-2">
              {content.awards.map((award, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                  <input
                    type="text"
                    className={inputCls}
                    value={award}
                    onChange={(e) => setAward(index, e.target.value)}
                    placeholder={`Award ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeAward(index)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove award"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addAward}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add award
          </button>
        </SectionCard>

        {/* Join Steps */}
        <SectionCard
          active={activeSection === 'join'}
          icon={ListOrdered}
          title="Join Steps"
          description="Langkah-langkah join (Contact Sales → Ready To Train)"
        >
          {content.join_steps.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No steps yet. Click "Add step" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {content.join_steps.map((step, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500">
                      Step {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove step"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label={`Title Step ${index + 1}`}>
                      <input
                        type="text"
                        className={inputCls}
                        value={step.title}
                        onChange={(e) =>
                          patchStep(index, { title: e.target.value })
                        }
                        placeholder="Contact Sales"
                      />
                    </Field>
                    <Field label={`Description Step ${index + 1}`}>
                      <input
                        type="text"
                        className={inputCls}
                        value={step.description}
                        onChange={(e) =>
                          patchStep(index, { description: e.target.value })
                        }
                        placeholder="Reach out to our sales team..."
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add step
          </button>
        </SectionCard>

        {/* CTA */}
        <SectionCard
          active={activeSection === 'cta'}
          icon={Megaphone}
          title="CTA"
          description="Call-to-action di akhir halaman About"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title CTA">
              <input
                className={inputCls}
                value={content.cta.title}
                onChange={(e) => patchCta({ title: e.target.value })}
                placeholder="Ready to Work With Us?"
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
                placeholder="Request Proposal"
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
