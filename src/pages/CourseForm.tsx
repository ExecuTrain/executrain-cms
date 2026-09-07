import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Form } from 'antd'
import { ArrowLeft } from 'lucide-react'

import InputForm from '@/components/Form'
import Notification from '@/components/Notification'
import { FieldRowsSkeleton } from '@/components/Skeletons'
import ImageUpload from '@/components/ImageUpload'
import FeatureList from '@/components/FeatureList'
import {
  useCourseCreate,
  useCourseUpdate,
  useCourseDetail,
} from '@/hooks/useCourse'
import { useMasterDataByType } from '@/hooks/useMasterData'

const SKILL_LEVEL_OPTIONS = [
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
  { label: 'Expert', value: 'EXPERT' },
]

const LANGUAGE_OPTIONS = [
  { label: 'Indonesia', value: 'INDONESIA' },
  { label: 'English', value: 'ENGLISH' },
]

export default function CourseFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formAction, setFormAction] = useState<any>()
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const { data: detailData, isLoading: detailLoading } = useCourseDetail(
    isEdit ? id : undefined,
  )
  const { mutate: createItem, isPending: createPending } = useCourseCreate()
  const { mutate: updateItem, isPending: updatePending } = useCourseUpdate()
  const { data: categoryData } = useMasterDataByType('COURSE_CATEGORY')
  const { data: frameworkData } = useMasterDataByType('COURSE_FRAMEWORK')
  const categoryOptions =
    categoryData?.data?.map((m: any) => ({ label: m.label, value: m.value })) ??
    []
  const frameworkOptions =
    frameworkData?.data?.map((m: any) => ({ label: m.label, value: m.value })) ??
    []

  // Prefill saat mode edit
  useEffect(() => {
    if (isEdit && detailData) {
      const item = detailData
      if (item) {
        const values = {
          title: item.title,
          banner: item.banner && item.banner.url ? item.banner : null,
          category: item.category,
          description: item.description,
          student: item.student,
          duration: item.duration,
          skill_level: item.skill_level,
          language: item.language,
          framework_type: item.framework_type || 'Training',
          feature: Array.isArray(item.feature) ? item.feature : [],
        }
        setFormAction(values)
        form.setFieldsValue(values)
      }
    }
  }, [isEdit, id, detailData, form])

  const buildPayload = () => ({
    title: formAction?.title,
    banner: formAction?.banner || null,
    category: formAction?.category,
    description: formAction?.description,
    student: formAction?.student || 0,
    duration: formAction?.duration || 0,
    skill_level: formAction?.skill_level,
    language: formAction?.language,
    framework_type: formAction?.framework_type || 'Training',
    feature: Array.isArray(formAction?.feature)
      ? formAction.feature.filter((f: string) => f.trim() !== '')
      : [],
  })

  const handleSubmit = async () => {
    try {
      await form.validateFields()

      if (isEdit) {
        updateItem(
          { id: id!, payload: buildPayload() },
          {
            onSuccess: () => {
              Notification('success', 'Success to Update Course')
              navigate('/course')
            },
            onError: () => {
              Notification('error', 'Failed to Update Course')
            },
          },
        )
      } else {
        createItem(buildPayload(), {
          onSuccess: () => {
            Notification('success', 'Success to Create Course')
            navigate('/course')
          },
          onError: () => {
            Notification('error', 'Failed to Create Course')
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
            to="/course"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to list
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Course' : 'Add Course'}
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {isEdit
              ? 'Update the details of your course'
              : 'Create a new course'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {isEdit && detailLoading ? (
          <FieldRowsSkeleton rows={6} />
        ) : (
          <Form form={form} layout="vertical" requiredMark={false}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
              <InputForm
                type="text"
                name="title"
                label="Title"
                placeholder="Enter title"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <div>
                <ImageUpload
                  label="Banner Image"
                  value={formAction?.banner}
                  onChange={(banner) =>
                    setFormAction((prev: any) => ({ ...prev, banner }))
                  }
                />
              </div>
              <InputForm
                type="select"
                name="category"
                label="Category"
                placeholder="Select category"
                required
                options={categoryOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="skill_level"
                label="Skill Level"
                placeholder="Select skill level"
                required
                options={SKILL_LEVEL_OPTIONS}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="framework_type"
                label="Framework Type"
                placeholder="Select framework type"
                required
                options={frameworkOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="language"
                label="Language"
                placeholder="Select language"
                required
                options={LANGUAGE_OPTIONS}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputForm
                  type="number"
                  name="student"
                  label="Students"
                  placeholder="0"
                  form={formAction}
                  setForm={(e: any) => setFormAction(e)}
                />
                <InputForm
                  type="number"
                  name="duration"
                  label="Duration (days)"
                  placeholder="0"
                  form={formAction}
                  setForm={(e: any) => setFormAction(e)}
                />
              </div>
            </div>

            <InputForm
              type="textarea"
              name="description"
              label="Description"
              placeholder="Enter description"
              required
              form={formAction}
              setForm={(e: any) => setFormAction(e)}
            />

            <FeatureList
              label="Features"
              value={Array.isArray(formAction?.feature) ? formAction.feature : []}
              onChange={(feature) =>
                setFormAction((prev: any) => ({ ...prev, feature }))
              }
            />

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/course')}
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
    </div>
  )
}