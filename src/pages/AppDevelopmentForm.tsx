import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Form } from 'antd'
import { ArrowLeft } from 'lucide-react'

import InputForm from '@/components/Form'
import Notification from '@/components/Notification'
import { FieldRowsSkeleton } from '@/components/Skeletons'
import HighlightList from '@/components/HighlightList'
import TeamSizeList from '@/components/TeamSizeList'
import ImageUpload from '@/components/ImageUpload'
import {
  useAppDevelopmentCreate,
  useAppDevelopmentUpdate,
  useAppDevelopmentDetail,
} from '@/hooks/useAppDevelopment'
import { useMasterDataByType } from '@/hooks/useMasterData'

export default function AppDevelopmentFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formAction, setFormAction] = useState<any>()
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const { data: detailData, isLoading: detailLoading } = useAppDevelopmentDetail(
    isEdit ? id : undefined,
  )
  const { mutate: createItem, isPending: createPending } = useAppDevelopmentCreate()
  const { mutate: updateItem, isPending: updatePending } = useAppDevelopmentUpdate()
  const { data: techData } = useMasterDataByType('APP_TECH_STACK')
  const { data: methodData } = useMasterDataByType('APP_METHODOLOGY')
  const techOptions =
    techData?.data?.map((m: any) => ({ label: m.label, value: m.value })) ?? []
  const methodOptions =
    methodData?.data?.map((m: any) => ({ label: m.label, value: m.value })) ?? []

  // Prefill saat mode edit
  useEffect(() => {
    if (isEdit && detailData) {
      const item = detailData
      if (item) {
        const values = {
          title: item.title,
          banner: item.banner && item.banner.url ? item.banner : null,
          tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack : [],
          description: item.description,
          challenge: item.challenge || '',
          team_size: Array.isArray(item.team_size)
            ? item.team_size.map((t: any) => ({
                quantity: t.quantity || 0,
                type: t.type || '',
              }))
            : [],
          timeline: item.timeline || 0,
          methodology: item.methodology || undefined,
          compliance: item.compliance || '',
          highlights: Array.isArray(item.highlights)
            ? item.highlights.map((h: any) => ({
                image: h.image || '',
                title: h.title || '',
                description: h.description || '',
              }))
            : [],
        }
        setFormAction(values)
        form.setFieldsValue(values)
      }
    }
  }, [isEdit, id, detailData, form])

  const buildPayload = () => ({
    title: formAction?.title,
    banner: formAction?.banner || null,
    tech_stack: Array.isArray(formAction?.tech_stack)
      ? formAction.tech_stack
      : [],
    description: formAction?.description,
    challenge: formAction?.challenge || null,
    team_size: Array.isArray(formAction?.team_size)
      ? formAction.team_size.filter(
          (t: any) => t && (t.type || t.quantity),
        )
      : [],
    timeline: formAction?.timeline || 0,
    methodology: formAction?.methodology || null,
    compliance: formAction?.compliance || null,
    highlights: Array.isArray(formAction?.highlights)
      ? formAction.highlights.filter(
          (h: any) => h && (h.image || h.title || h.description),
        )
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
              Notification('success', 'Success to Update App Development')
              navigate('/app-development')
            },
            onError: () => {
              Notification('error', 'Failed to Update App Development')
            },
          },
        )
      } else {
        createItem(buildPayload(), {
          onSuccess: () => {
            Notification('success', 'Success to Create App Development')
            navigate('/app-development')
          },
          onError: () => {
            Notification('error', 'Failed to Create App Development')
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
            to="/app-development"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to list
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit App Development' : 'Add App Development'}
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {isEdit
              ? 'Update the details of your app development project'
              : 'Create a new app development project'}
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
                name="tech_stack"
                label="Tech Stack"
                placeholder="Select tech stack"
                required
                multiple
                options={techOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="methodology"
                label="Methodology"
                placeholder="Select methodology"
                required
                options={methodOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="number"
                name="timeline"
                label="Timeline (weeks)"
                placeholder="0"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="text"
                name="compliance"
                label="Compliance"
                placeholder="e.g. ISO 9001"
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="textarea"
                name="challenge"
                label="Challenge"
                placeholder="Challenges this project addresses"
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
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

            <TeamSizeList
              label="Team Size"
              value={Array.isArray(formAction?.team_size) ? formAction.team_size : []}
              onChange={(team_size) =>
                setFormAction((prev: any) => ({ ...prev, team_size }))
              }
            />

            <HighlightList
              label="Highlights"
              value={Array.isArray(formAction?.highlights) ? formAction.highlights : []}
              onChange={(highlights) =>
                setFormAction((prev: any) => ({ ...prev, highlights }))
              }
            />

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/app-development')}
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