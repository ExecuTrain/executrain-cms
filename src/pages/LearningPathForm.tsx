import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Form, Select } from 'antd'
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

import InputForm from '@/components/Form'
import Notification from '@/components/Notification'
import { FieldRowsSkeleton } from '@/components/Skeletons'
import {
  useLearningPathCreate,
  useLearningPathUpdate,
  useLearningPathDetail,
  useLearningPathFrameworkOptions,
  useLearningPathCourseOptions,
} from '@/hooks/useLearningPath'
import { FRAMEWORK_SCOPES } from '@/lib/frameworkScopes'
import type {
  LearningPathStagePayload,
  LearningPathStageLink,
} from '@/services/learningPath'

function scopeLabel(scope?: string) {
  return FRAMEWORK_SCOPES.find((s) => s.id === scope)?.label ?? scope ?? ''
}

function stageTitle(name?: string) {
  return name?.trim() ? name.trim() : 'Scope'
}

export default function LearningPathFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formAction, setFormAction] = useState<any>()
  const [stages, setStages] = useState<LearningPathStagePayload[]>([])
  const [framework, setFramework] = useState<string | undefined>()
  const [category, setCategory] = useState<string | undefined>()
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const { data: detailData, isLoading: detailLoading } = useLearningPathDetail(
    isEdit ? id : undefined,
  )
  const { mutate: createItem, isPending: createPending } = useLearningPathCreate()
  const { mutate: updateItem, isPending: updatePending } = useLearningPathUpdate()

  const { data: optionsData } = useLearningPathFrameworkOptions(
    framework ?? undefined,
  )
  const { data: coursePool = [], isLoading: coursePoolLoading } = useLearningPathCourseOptions({
    id: isEdit ? id : undefined,
    framework,
    category,
  })

  const frameworks = useMemo(() => {
    const list = optionsData?.frameworks ?? []
    if (list.length > 0) return list
    return FRAMEWORK_SCOPES.map((s: { id: string; label: string }) => ({ value: s.id, label: s.label }))
  }, [optionsData])

  const categories = useMemo(() => {
    const list = optionsData?.categories ?? []
    if (framework) {
      // Saat response masih daftar global (tiap item punya scope), saring by scope.
      return list.filter((c: any) => !c.framework || c.framework === framework)
    }
    return list
  }, [optionsData, framework])

  const coursePoolOptions = useMemo(
    () =>
      (coursePool ?? []).map((c: any) => ({
        value: c.id,
        label: c.title,
      })),
    [coursePool],
  )

  // Prefill saat mode edit
  useEffect(() => {
    if (isEdit && detailData) {
      const item = detailData
      if (item) {
        setFramework(item.framework)
        setCategory(item.category)
        const stageData: LearningPathStagePayload[] = Array.isArray(item.stages)
          ? item.stages.map((s: any, i: number) => ({
              id: s.id,
              name: s.name,
              description: s.description || '',
              course_ids: Array.isArray(s.course_ids) ? s.course_ids : [],
              course_links: Array.isArray(s.course_links)
                ? s.course_links.map((l: any) => ({
                    course_id: l.course_id,
                    follows_course_id: l.follows_course_id,
                  }))
                : [],
              sort_order: i,
            }))
          : []
        setStages(stageData)
        const values = {
          title: item.title,
        }
        setFormAction(values)
        form.setFieldsValue(values)
      }
    }
  }, [isEdit, id, detailData, form])

  // Saat framework/category berubah, buang course yang tak lagi cocok dari stages.
  useEffect(() => {
    // Tunggu opsi course termuat (hindari mengosongkan saat loading / preparasi edit).
    if (coursePoolLoading) return
    // Bila pool belum termuat / memang kosong, jangan buang course yang ada (cegah kehilangan data saat edit).
    if (!Array.isArray(coursePool) || coursePool.length === 0) return

    if (!framework || !category) {
      setStages((prev) =>
        prev.map((s) => ({ ...s, course_ids: [], course_links: [] })),
      )
      return
    }
    setStages((prev) =>
      prev.map((s) => {
        if (!Array.isArray(s.course_ids) || s.course_ids.length === 0) return s
        const poolIds = new Set((coursePool ?? []).map((c: any) => c.id))
        const valid = s.course_ids.filter((cid) => poolIds.has(cid))
        const validSet = new Set(valid)
        const links = Array.isArray(s.course_links) ? s.course_links : []
        return {
          ...s,
          course_ids: valid,
          course_links: links.filter(
            (l) => validSet.has(l.course_id),
          ),
        }
      }),
    )
  }, [framework, category, coursePool, coursePoolLoading])

  const handleFrameworkChange = (value: string | undefined) => {
    setFramework(value)
    setCategory(undefined)
    setFormAction((prev: any) => ({ ...prev, framework: value, category: undefined }))
    form.setFieldValue('category', undefined)
  }

  const handleCategoryChange = (value: string | undefined) => {
    setCategory(value)
    setFormAction((prev: any) => ({ ...prev, category: value }))
  }

  const addStage = () => {
    setStages((prev) => [
      ...prev,
      { name: '', description: '', course_ids: [], course_links: [], sort_order: prev.length },
    ])
    setCollapsed((prev) => ({ ...prev, [stages.length]: false }))
  }

  const updateStage = (index: number, patch: Partial<LearningPathStagePayload>) => {
    setStages((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    )
  }

  /** Atur relasi "course ini lanjutan dari course pendahulu" pada sebuah stage. */
  const updateLink = (
    stageIndex: number,
    courseId: string,
    followsCourseId: string | undefined,
  ) => {
    setStages((prev) =>
      prev.map((s, i) => {
        if (i !== stageIndex) return s
        const links: LearningPathStageLink[] = Array.isArray(s.course_links)
          ? s.course_links.filter((l) => l.course_id !== courseId)
          : []
        if (followsCourseId) {
          links.push({ course_id: courseId, follows_course_id: followsCourseId })
        }
        return { ...s, course_links: links }
      }),
    )
  }

  /** Ganti daftar course stage; buang relasi utk course yang tidak lagi dipilih. */
  const updateCourseIds = (stageIndex: number, val: string[]) => {
    setStages((prev) =>
      prev.map((s, i) => {
        if (i !== stageIndex) return s
        const selected = new Set(val)
        const links = Array.isArray(s.course_links)
          ? s.course_links.filter((l) => selected.has(l.course_id))
          : []
        return { ...s, course_ids: val, course_links: links }
      }),
    )
  }

  const removeStage = (index: number) => {
    setStages((prev) => prev.filter((_, i) => i !== index))
    setCollapsed((prev) => {
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  const toggleStage = (index: number) => {
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  /** Course id yg bisa dipilih sbg pendahulu utk sebuah stage (dari semua stage sebelum-nya). */
  const getPrevCourseIds = (stageIndex: number): string[] => {
    const ids: string[] = []
    for (let i = 0; i < stageIndex; i++) {
      const s = stages[i]
      if (Array.isArray(s?.course_ids)) ids.push(...s.course_ids)
    }
    return Array.from(new Set(ids))
  }

  const courseTitle = (id?: string) =>
    (coursePool ?? []).find((c: any) => c.id === id)?.title ?? id ?? ''

  const buildPayload = () => ({
    title: formAction?.title,
    framework: framework!,
    category: category!,
    stages: stages
      .filter((s) => s.name?.trim())
      .map((s) => ({
        name: s.name.trim(),
        description: s.description || '',
        course_ids: s.course_ids ?? [],
        course_links: Array.isArray(s.course_links) ? s.course_links : [],
      })),
  })

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      if (!framework || !category) {
        Notification('error', 'Framework and Category are required')
        return
      }
      const validStages = stages.filter((s) => s.name?.trim())
      if (validStages.length === 0) {
        Notification('error', 'Add at least one scope')
        return
      }

      if (isEdit) {
        updateItem(
          { id: id!, payload: buildPayload() },
          {
            onSuccess: () => {
              Notification('success', 'Success to Update Learning Path')
              navigate('/learning-path')
            },
            onError: () => {
              Notification('error', 'Failed to Update Learning Path')
            },
          },
        )
      } else {
        createItem(buildPayload(), {
          onSuccess: () => {
            Notification('success', 'Success to Create Learning Path')
            navigate('/learning-path')
          },
          onError: () => {
            Notification('error', 'Failed to Create Learning Path')
          },
        })
      }
    } catch (e) {
      Notification('error', 'Please fill all required fields')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/learning-path"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to list
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Learning Path' : 'Add Learning Path'}
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Pilih framework, lalu category. Buat scope belajar (Beginner/Expert, bebas)
            dan masukkan course yang sesuai.
          </p>
        </div>
      </div>

      {isEdit && detailLoading ? (
        <FieldRowsSkeleton rows={6} />
      ) : (
        <Form form={form} layout="vertical" requiredMark={false}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
              <InputForm
                type="text"
                name="title"
                label="Title"
                placeholder="Enter learning path title"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Framework <span className="text-red-500">*</span>
                </label>
                <select
                  value={framework}
                  onChange={(e) => handleFrameworkChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
                >
                  <option value="">Select framework</option>
                  {frameworks.map((f: any) => (
                    <option key={f.value} value={f.value}>
                      {scopeLabel(f.value) || f.label || f.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value || undefined)}
                  disabled={!framework}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">
                    {framework ? 'Select category' : 'Select framework first'}
                  </option>
                  {categories.map((c: any) => (
                    <option key={c.value} value={c.value}>
                      {c.label || c.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stages / Scope */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Scopes</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Kelompokkan course ke dalam tahap belajar (Beginner, Expert, dll — nama bebas)
                </p>
              </div>
              <button
                type="button"
                onClick={addStage}
                disabled={!framework || !category}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Scope
              </button>
            </div>

            {stages.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl py-8 text-center text-sm text-gray-500">
                {framework && category
                  ? 'Belum ada scope. Klik "Add Scope" untuk mulai mengelompokkan course.'
                  : 'Pilih framework dan category terlebih dahulu untuk menambahkan scope.'}
              </div>
            ) : (
              <div className="space-y-4">
                {stages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => toggleStage(idx)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-800"
                      >
                        {collapsed[idx] ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        )}
                        <span>
                          {idx + 1}. {stageTitle(stage.name)}
                        </span>
                        <span className="text-[11px] text-gray-400 font-normal">
                          {Array.isArray(stage.course_ids) && stage.course_ids.length > 0
                            ? `${stage.course_ids.length} course`
                            : 'no course'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStage(idx)}
                        className="text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                        title="Remove scope"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {!collapsed[idx] && (
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Scope Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={stage.name}
                              onChange={(e) =>
                                updateStage(idx, { name: e.target.value })
                              }
                              placeholder="e.g. Beginner, Expert, Foundation"
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Description (optional)
                            </label>
                            <textarea
                              value={stage.description}
                              onChange={(e) =>
                                updateStage(idx, { description: e.target.value })
                              }
                              placeholder="Apa yang dipelajari di scope ini?"
                              rows={3}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Courses <span className="text-red-500">*</span>
                          </label>
                          <Select
                            mode="multiple"
                            value={stage.course_ids ?? []}
                            onChange={(val: string[]) =>
                              updateCourseIds(idx, val)
                            }
                            placeholder="Pilih course untuk scope ini"
                            options={coursePoolOptions}
                            className="w-full"
                            popupClassName="rounded-xl border-gray-200 bg-white"
                            optionFilterProp="label"
                            disabled={coursePool.length === 0}
                          />
                          {coursePool.length === 0 && (
                            <p className="text-[11px] text-gray-400 mt-1">
                              Tidak ada course dengan framework & category ini. Tambahkan
                              course lewat menu Course dengan framework/category yang sama.
                            </p>
                          )}
                        </div>

                        {/* Relasi antar course: course di stage ini bisa ditandai
                            sbg lanjutan dari course di stage sebelumnya. */}
                        {idx > 0 &&
                          Array.isArray(stage.course_ids) &&
                          stage.course_ids.length > 0 && (
                            <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/60">
                              <div>
                                <p className="text-xs font-medium text-gray-700">
                                  Course Lanjutan (opsional)
                                </p>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                  Tandai bila course di scope ini merupakan kelas
                                  lanjutan dari course di scope sebelumnya.
                                </p>
                              </div>
                              {stage.course_ids.map((cid) => {
                                const link = (Array.isArray(stage.course_links)
                                  ? stage.course_links
                                  : []
                                ).find((l) => l.course_id === cid)
                                return (
                                  <div
                                    key={cid}
                                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                                  >
                                    <span className="text-xs text-gray-700 sm:w-56 sm:shrink-0 truncate">
                                      {courseTitle(cid)}
                                    </span>
                                    <span className="text-[11px] text-gray-400 shrink-0 hidden sm:inline">
                                      lanjutan dari
                                    </span>
                                    <Select
                                      allowClear
                                      value={link?.follows_course_id}
                                      onChange={(v?: string) =>
                                        updateLink(idx, cid, v || undefined)
                                      }
                                      placeholder="— Pilih course pendahulu —"
                                      options={getPrevCourseIds(idx).map(
                                        (pid) => ({
                                          value: pid,
                                          label: courseTitle(pid),
                                        }),
                                      )}
                                      className="w-full"
                                      popupClassName="rounded-xl border-gray-200 bg-white"
                                      optionFilterProp="label"
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/learning-path')}
              className="px-5 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={createPending || updatePending}
              className="px-5 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {createPending || updatePending
                ? 'Saving...'
                : isEdit
                  ? 'Update'
                  : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </div>
  )
}
