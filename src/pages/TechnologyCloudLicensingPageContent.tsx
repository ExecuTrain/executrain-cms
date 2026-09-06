import { useState, useEffect } from 'react'
import { Form } from 'antd'
import {
  Save,
  Eye,
  Cloud,
  Megaphone,
  Plus,
  Trash2,
  HelpCircle,
  Building2,
} from 'lucide-react'
import Notification from '@/components/Notification'
import PageSectionTabs from '@/components/PageSectionTabs'
import ImageUpload from '@/components/ImageUpload'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

/** Shape konten halaman Technology & Cloud Licensing (dicocokkan dengan compro). */
interface ImageRef {
  url: string
  public_id: string
}

interface FaqQuestion {
  question: string
  answer: string
}

interface VendorItem {
  name: string
  logo: ImageRef | null
  description: string
  website_url: string
  facebook_url: string
  twitter_url: string
  linkedin_url: string
  contact_link: string
}

interface TechnologyCloudLicensingContent {
  title_page: string
  description_page: string
  tech: {
    title: string
    logos: (ImageRef | null)[]
  }
  faq: {
    title: string
    questions: FaqQuestion[]
  }
  vendors: VendorItem[]
  cta: {
    title: string
    description: string
    label: string
    link: string
  }
}

const PAGE_CODE = 'technology-cloud-licensing'

const inputCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900'
const textareaCls =
  'w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 resize-y'

const EMPTY_CONTENT: TechnologyCloudLicensingContent = {
  title_page: '',
  description_page: '',
  tech: {
    title: '',
    logos: [],
  },
  faq: {
    title: '',
    questions: [],
  },
  vendors: [],
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

const SECTION_TABS = [
  { key: 'hero', label: 'Hero', icon: Eye },
  { key: 'tech', label: 'Technologies', icon: Cloud },
  { key: 'faq', label: 'FAQ', icon: HelpCircle },
  { key: 'vendors', label: 'Vendors', icon: Building2 },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

export default function TechnologyCloudLicensingPageContent() {
  const [form] = Form.useForm()
  const [content, setContent] =
    useState<TechnologyCloudLicensingContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged: TechnologyCloudLicensingContent = {
        ...EMPTY_CONTENT,
        ...(page.content || {}),
        tech: {
          ...EMPTY_CONTENT.tech,
          ...(page.content?.tech || {}),
        },
        faq: {
          ...EMPTY_CONTENT.faq,
          ...(page.content?.faq || {}),
        },
        cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
      }
      setContent(merged)
      setHasChanges(false)
    }
  }, [page])

  const patch = (partial: Partial<TechnologyCloudLicensingContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchCta = (partial: Partial<TechnologyCloudLicensingContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  const patchFaq = (partial: Partial<TechnologyCloudLicensingContent['faq']>) => {
    setContent((prev) => ({ ...prev, faq: { ...prev.faq, ...partial } }))
    setHasChanges(true)
  }

  // --- Tech logos ---
  const addLogo = () => patch({ tech: { ...content.tech, logos: [...content.tech.logos, { url: '', public_id: '' }] } })
  const removeLogo = (index: number) =>
    patch({ tech: { ...content.tech, logos: content.tech.logos.filter((_, i) => i !== index) } })

  // --- FAQ questions ---
  const addQuestion = () =>
    patchFaq({ questions: [...content.faq.questions, { question: '', answer: '' }] })
  const patchQuestion = (index: number, partial: Partial<FaqQuestion>) => {
    const questions = [...content.faq.questions]
    questions[index] = { ...questions[index], ...partial }
    patchFaq({ questions })
  }
  const removeQuestion = (index: number) =>
    patchFaq({ questions: content.faq.questions.filter((_, i) => i !== index) })

  // --- Vendors ---
  const addVendor = () =>
    patch({
      vendors: [
        ...content.vendors,
        {
          name: '',
          logo: null,
          description: '',
          website_url: '',
          facebook_url: '',
          twitter_url: '',
          linkedin_url: '',
          contact_link: '',
        },
      ],
    })
  const patchVendor = (index: number, partial: Partial<VendorItem>) => {
    const vendors = [...content.vendors]
    vendors[index] = { ...vendors[index], ...partial }
    patch({ vendors })
  }
  const removeVendor = (index: number) =>
    patch({ vendors: content.vendors.filter((_, i) => i !== index) })

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'Technology & Cloud Licensing', content },
        {
          onSuccess: () => {
            Notification(
              'success',
              'Technology & Cloud Licensing page updated successfully',
            )
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification(
              'error',
              error.message || 'Failed to update Technology & Cloud Licensing page',
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
            Technology & Cloud Licensing Page
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage Technology & Cloud Licensing page copywriting — hero, technologies,
            FAQ, vendors, and CTA
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
                const merged: TechnologyCloudLicensingContent = {
                  ...EMPTY_CONTENT,
                  ...(page.content || {}),
                  tech: {
                    ...EMPTY_CONTENT.tech,
                    ...(page.content?.tech || {}),
                  },
                  faq: {
                    ...EMPTY_CONTENT.faq,
                    ...(page.content?.faq || {}),
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
          description="Tampil di bagian paling atas halaman Technology & Cloud Licensing"
        >
          <Field label="Title Page">
            <input
              className={inputCls}
              value={content.title_page}
              onChange={(e) => patch({ title_page: e.target.value })}
              placeholder="Technology & Cloud Licensing"
            />
          </Field>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="Providing genuine software licenses and cloud solution subscriptions from top global vendors..."
            />
          </Field>
        </SectionCard>

        {/* Powered by Industry-Leading Technologies */}
        <SectionCard
          active={activeSection === 'tech'}
          icon={Cloud}
          title="Powered by Industry-Leading Technologies"
          description="Logo-logo teknologi unggulan (gunakan fitur upload)"
        >
          <Field label="Section Title">
            <input
              className={inputCls}
              value={content.tech.title}
              onChange={(e) =>
                patch({ tech: { ...content.tech, title: e.target.value } })
              }
              placeholder="Powered by Industry-Leading Technologies"
            />
          </Field>
          {content.tech.logos.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No logos yet. Click "Add logo" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {content.tech.logos.map((logo, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 flex items-start gap-4"
                >
                  <div className="flex-1">
                    <Field label={`Logo ${index + 1}`}>
                      <ImageUpload
                        label=""
                        value={logo}
                        onChange={(image) => {
                          const logos = [...content.tech.logos]
                          logos[index] = image
                          patch({ tech: { ...content.tech, logos } })
                        }}
                        folder="page-tech-licensing-logos"
                        aspectClass="h-32"
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLogo(index)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove logo"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addLogo}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add logo
          </button>
        </SectionCard>

        {/* FAQ */}
        <SectionCard
          active={activeSection === 'faq'}
          icon={HelpCircle}
          title="FAQ"
          description="Pertanyaan yang sering diajukan (accordion di halaman publik)"
        >
          <Field label="FAQ Title">
            <input
              className={inputCls}
              value={content.faq.title}
              onChange={(e) => patchFaq({ title: e.target.value })}
              placeholder="Before You Commit"
            />
          </Field>
          {content.faq.questions.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No FAQ items yet. Click "Add question" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {content.faq.questions.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500">
                      FAQ {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove FAQ"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <Field label={`Question ${index + 1}`}>
                      <input
                        type="text"
                        className={inputCls}
                        value={faq.question}
                        onChange={(e) =>
                          patchQuestion(index, { question: e.target.value })
                        }
                        placeholder="How are renewals handled?"
                      />
                    </Field>
                    <Field label={`Answer ${index + 1}`}>
                      <textarea
                        rows={3}
                        className={textareaCls}
                        value={faq.answer}
                        onChange={(e) =>
                          patchQuestion(index, { answer: e.target.value })
                        }
                        placeholder="Answer to the question above"
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

        {/* Vendors */}
        <SectionCard
          active={activeSection === 'vendors'}
          icon={Building2}
          title="Vendors"
          description="Daftar vendor — name, logo (upload), description, dan links (website, facebook, twitter, linkedin, contact)"
        >
          {content.vendors.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No vendors yet. Click "Add vendor" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {content.vendors.map((vendor, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500">
                      Vendor {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVendor(index)}
                      className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove vendor"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Field label={`Name ${index + 1}`}>
                      <input
                        type="text"
                        className={inputCls}
                        value={vendor.name}
                        onChange={(e) =>
                          patchVendor(index, { name: e.target.value })
                        }
                        placeholder="Sophos"
                      />
                    </Field>
                    <Field label="Logo">
                      <ImageUpload
                        label=""
                        value={vendor.logo}
                        onChange={(logo) => patchVendor(index, { logo })}
                        folder="page-tech-licensing-vendors"
                        aspectClass="h-28"
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Description">
                      <textarea
                        rows={4}
                        className={textareaCls}
                        value={vendor.description}
                        onChange={(e) =>
                          patchVendor(index, { description: e.target.value })
                        }
                        placeholder="Short description of the vendor..."
                      />
                    </Field>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Website URL">
                      <input
                        type="text"
                        className={inputCls}
                        value={vendor.website_url}
                        onChange={(e) =>
                          patchVendor(index, { website_url: e.target.value })
                        }
                        placeholder="https://sophos.com/"
                      />
                    </Field>
                    <Field label="Facebook URL">
                      <input
                        type="text"
                        className={inputCls}
                        value={vendor.facebook_url}
                        onChange={(e) =>
                          patchVendor(index, { facebook_url: e.target.value })
                        }
                        placeholder="https://facebook.com/..."
                      />
                    </Field>
                    <Field label="Twitter / X URL">
                      <input
                        type="text"
                        className={inputCls}
                        value={vendor.twitter_url}
                        onChange={(e) =>
                          patchVendor(index, { twitter_url: e.target.value })
                        }
                        placeholder="https://x.com/..."
                      />
                    </Field>
                    <Field label="LinkedIn URL">
                      <input
                        type="text"
                        className={inputCls}
                        value={vendor.linkedin_url}
                        onChange={(e) =>
                          patchVendor(index, { linkedin_url: e.target.value })
                        }
                        placeholder="https://linkedin.com/company/..."
                      />
                    </Field>
                    <Field
                      label="Contact Link"
                      hint="Mis. https://wa.me/..., /contact, mailto:... "
                    >
                      <input
                        type="text"
                        className={inputCls}
                        value={vendor.contact_link}
                        onChange={(e) =>
                          patchVendor(index, { contact_link: e.target.value })
                        }
                        placeholder="/contact"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addVendor}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add vendor
          </button>
        </SectionCard>

        {/* CTA */}
        <SectionCard
          active={activeSection === 'cta'}
          icon={Megaphone}
          title="CTA"
          description="Call-to-action di akhir halaman Technology & Cloud Licensing"
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