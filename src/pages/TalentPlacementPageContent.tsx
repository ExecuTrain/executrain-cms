import { useState, useEffect } from 'react'
import { Form } from 'antd'
import {
  Save,
  Eye,
  Table2,
  Megaphone,
  Plus,
  Trash2,
  Users,
  Briefcase,
} from 'lucide-react'
import Notification from '@/components/Notification'
import { ContentPageSkeleton } from '@/components/Skeletons'
import PageSectionTabs from '@/components/PageSectionTabs'
import ImageUpload from '@/components/ImageUpload'
import { usePageDetail, useUpdatePage } from '@/hooks/usePage'

/** Shape konten halaman IT Talent Placement (dicocokkan dengan compro). */
interface ModelItem {
  title: string
  description: string
}

interface MatrixImage {
  url: string
  public_id: string
}

interface MatrixItem {
  title: string
  image: MatrixImage | null
}

interface RoleItem {
  title: string
  points: string[]
  thumbnail: MatrixImage | null
  wa_message: string
}

interface TalentPlacementContent {
  title_page: string
  description_page: string
  models: ModelItem[]
  matrix: {
    title: string
    description: string
    items: MatrixItem[]
  }
  roles: RoleItem[]
  cta: {
    title: string
    description: string
    label: string
    wa_message: string
  }
}

const PAGE_CODE = 'talent-placement'

const EMPTY_CONTENT: TalentPlacementContent = {
  title_page: '',
  description_page: '',
  models: [],
  matrix: {
    title: '',
    description: '',
    items: [],
  },
  roles: [],
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
  { key: 'models', label: 'Placement Models', icon: Users },
  { key: 'matrix', label: 'IT Talent Matrix', icon: Table2 },
  { key: 'roles', label: 'Talent Roles', icon: Briefcase },
  { key: 'cta', label: 'CTA', icon: Megaphone },
]

export default function TalentPlacementPageContent() {
  const [form] = Form.useForm()
  const [content, setContent] =
    useState<TalentPlacementContent>(EMPTY_CONTENT)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { data: page, isLoading, refetch } = usePageDetail(PAGE_CODE)
  const { mutate: update, isPending } = useUpdatePage(PAGE_CODE)

  useEffect(() => {
    if (page) {
      const merged: TalentPlacementContent = {
        ...EMPTY_CONTENT,
        ...(page.content || {}),
        matrix: { ...EMPTY_CONTENT.matrix, ...(page.content?.matrix || {}) },
        cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
      }
      form.setFieldsValue({
        ...merged,
        matrix: undefined,
        cta: undefined,
      })
      setContent(merged)
      setHasChanges(false)
    }
  }, [page, form])

  const patch = (partial: Partial<TalentPlacementContent>) => {
    setContent((prev) => ({ ...prev, ...partial }))
    setHasChanges(true)
  }

  const patchCta = (partial: Partial<TalentPlacementContent['cta']>) => {
    setContent((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }))
    setHasChanges(true)
  }

  // --- Models (fix 2) ---
  const patchModel = (index: number, partial: Partial<ModelItem>) => {
    const models = [...content.models]
    models[index] = { ...models[index], ...partial }
    patch({ models })
  }

  // --- Matrix items ---
  const patchMatrixItem = (
    index: number,
    partial: Partial<MatrixItem>,
  ) => {
    const items = [...content.matrix.items]
    items[index] = { ...items[index], ...partial }
    patch({ matrix: { ...content.matrix, items } })
  }

  const addMatrixItem = () =>
    patch({
      matrix: {
        ...content.matrix,
        items: [...content.matrix.items, { title: '', image: null }],
      },
    })
  const removeMatrixItem = (index: number) =>
    patch({
      matrix: {
        ...content.matrix,
        items: content.matrix.items.filter((_, i) => i !== index),
      },
    })

  // --- Available Talent Roles ---
  const patchRole = (index: number, partial: Partial<RoleItem>) => {
    const roles = [...content.roles]
    roles[index] = { ...roles[index], ...partial }
    patch({ roles })
  }

  const patchRolePoint = (roleIndex: number, pointIndex: number, value: string) => {
    const roles = [...content.roles]
    const points = [...roles[roleIndex].points]
    points[pointIndex] = value
    roles[roleIndex] = { ...roles[roleIndex], points }
    patch({ roles })
  }

  const addRolePoint = (roleIndex: number) => {
    const roles = [...content.roles]
    roles[roleIndex] = {
      ...roles[roleIndex],
      points: [...roles[roleIndex].points, ''],
    }
    patch({ roles })
  }

  const removeRolePoint = (roleIndex: number, pointIndex: number) => {
    const roles = [...content.roles]
    roles[roleIndex] = {
      ...roles[roleIndex],
      points: roles[roleIndex].points.filter((_, i) => i !== pointIndex),
    }
    patch({ roles })
  }

  const addRole = () =>
    patch({
      roles: [...content.roles, { title: '', points: [''], thumbnail: null, wa_message: '' }],
    })
  const removeRole = (index: number) =>
    patch({ roles: content.roles.filter((_, i) => i !== index) })

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      update(
        { title: page?.title ?? 'IT Talent Placement', content },
        {
          onSuccess: () => {
            Notification(
              'success',
              'IT Talent Placement page updated successfully',
            )
            setHasChanges(false)
            refetch()
          },
          onError: (error: any) => {
            Notification(
              'error',
              error.message || 'Failed to update IT Talent Placement page',
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
            IT Talent Placement Page
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage IT Talent Placement page copywriting — hero, placement models,
            talent matrix, and CTA
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
                const merged: TalentPlacementContent = {
                  ...EMPTY_CONTENT,
                  ...(page.content || {}),
                  matrix: {
                    ...EMPTY_CONTENT.matrix,
                    ...(page.content?.matrix || {}),
                  },
                  cta: { ...EMPTY_CONTENT.cta, ...(page.content?.cta || {}) },
                }
                form.setFieldsValue({
                  ...merged,
                  matrix: undefined,
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
          description="Tampil di bagian paling atas halaman IT Talent Placement"
        >
          <Field label="Title Page">
            <input
              className={inputCls}
              value={content.title_page}
              onChange={(e) => patch({ title_page: e.target.value })}
              placeholder="IT Talent Placement"
            />
          </Field>
          <Field label="Description Page">
            <textarea
              rows={3}
              className={textareaCls}
              value={content.description_page}
              onChange={(e) => patch({ description_page: e.target.value })}
              placeholder="Vetted engineers, placed the way your project actually needs them..."
            />
          </Field>
        </SectionCard>

        {/* Placement Models */}
        <SectionCard
          active={activeSection === 'models'}
          icon={Users}
          title="Placement Models"
          description="2 kartu — title + description per model (jumlah tetap 2)"
        >
          <div className="space-y-4">
            {[0, 1].map((index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <span className="text-xs font-semibold text-gray-500">
                  Model {index + 1}
                </span>
                <div className="mt-3 space-y-3">
                  <Field label={`Title Model ${index + 1}`}>
                    <input
                      type="text"
                      className={inputCls}
                      value={content.models[index]?.title ?? ''}
                      onChange={(e) =>
                        patchModel(index, { title: e.target.value })
                      }
                      placeholder={`Model ${index + 1} title`}
                    />
                  </Field>
                  <Field label={`Description Model ${index + 1}`}>
                    <textarea
                      rows={3}
                      className={textareaCls}
                      value={content.models[index]?.description ?? ''}
                      onChange={(e) =>
                        patchModel(index, { description: e.target.value })
                      }
                      placeholder={`Model ${index + 1} description`}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Talent Matrix */}
        <SectionCard
          active={activeSection === 'matrix'}
          icon={Table2}
          title="IT Talent Matrix"
          description="Title + description section, lalu items (title + image matrix)"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Section Title">
              <input
                className={inputCls}
                value={content.matrix.title}
                onChange={(e) =>
                  patch({ matrix: { ...content.matrix, title: e.target.value } })
                }
                placeholder="Our IT Talent Matrix"
              />
            </Field>
            <Field label="Section Description">
              <input
                className={inputCls}
                value={content.matrix.description}
                onChange={(e) =>
                  patch({
                    matrix: { ...content.matrix, description: e.target.value },
                  })
                }
                placeholder="Here's a little details of what our IT talent can do"
              />
            </Field>
          </div>

          {content.matrix.items.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No matrix items yet. Click "Add item" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {content.matrix.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500">
                      Matrix {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMatrixItem(index)}
                      className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <Field label={`Title Matrix ${index + 1}`}>
                      <input
                        type="text"
                        className={inputCls}
                        value={item.title}
                        onChange={(e) =>
                          patchMatrixItem(index, { title: e.target.value })
                        }
                        placeholder="1st Level Talent Matrix"
                      />
                    </Field>
                    <Field label={`Image Matrix ${index + 1}`}>
                      <ImageUpload
                        label=""
                        value={item.image}
                        onChange={(image) =>
                          patchMatrixItem(index, { image })
                        }
                        folder="page-talent-matrix"
                        aspectClass="h-44"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addMatrixItem}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add matrix item
          </button>
        </SectionCard>

        {/* Available Talent Roles */}
        <SectionCard
          active={activeSection === 'roles'}
          icon={Briefcase}
          title="Available Talent Roles"
          description="Kartu role dinamis — thumbnail (upload), title, points[], dan template pesan WA"
        >
          {content.roles.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
              No roles yet. Click "Add role" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {content.roles.map((role, roleIndex) => (
                <div
                  key={roleIndex}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500">
                      Role {roleIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRole(roleIndex)}
                      className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove role"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Field label={`Title Role ${roleIndex + 1}`}>
                      <input
                        type="text"
                        className={inputCls}
                        value={role.title}
                        onChange={(e) =>
                          patchRole(roleIndex, { title: e.target.value })
                        }
                        placeholder="1st Level Technical Support"
                      />
                    </Field>
                    <Field label="Thumbnail">
                      <ImageUpload
                        label=""
                        value={role.thumbnail}
                        onChange={(thumbnail) =>
                          patchRole(roleIndex, { thumbnail })
                        }
                        folder="page-talent-roles"
                        aspectClass="h-44"
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
                        onClick={() => addRolePoint(roleIndex)}
                        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add point
                      </button>
                    </div>
                    <div className="space-y-2">
                      {role.points.map((point, pointIndex) => (
                        <div
                          key={pointIndex}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            className={inputCls}
                            value={point}
                            onChange={(e) =>
                              patchRolePoint(
                                roleIndex,
                                pointIndex,
                                e.target.value,
                              )
                            }
                            placeholder={`Point ${pointIndex + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeRolePoint(roleIndex, pointIndex)
                            }
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
                      hint="Tombol 'I Need This Talent' selalu membuka WhatsApp sales. Isi template pesan awal di sini (kosongkan utk memakai template default)."
                    >
                      <textarea
                        className={inputCls}
                        rows={3}
                        value={role.wa_message}
                        onChange={(e) =>
                          patchRole(roleIndex, { wa_message: e.target.value })
                        }
                        placeholder="Halo ExecuTrain, saya tertarik dengan talent ..."
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addRole}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add role
          </button>
        </SectionCard>

        {/* CTA */}
        <SectionCard
          active={activeSection === 'cta'}
          icon={Megaphone}
          title="CTA"
          description="Call-to-action di akhir halaman IT Talent Placement"
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
                placeholder="Halo ExecuTrain, saya ingin konsultasi kebutuhan talent IT..."
              />
            </Field>
          </div>
        </SectionCard>
      </Form>
    </div>
  )
}