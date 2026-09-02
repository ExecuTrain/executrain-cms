import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom'
import { Form } from 'antd'
import { ArrowLeft } from 'lucide-react'

import InputForm from '@/components/Form'
import Notification from '@/components/Notification'
import ImageUpload from '@/components/ImageUpload'
import FeatureList from '@/components/FeatureList'
import HighlightList from '@/components/HighlightList'
import { useAuth } from '@/lib/auth'
import {
  useITProductCreate,
  useITProductUpdate,
  useITProductDetail,
} from '@/hooks/useITProduct'
import { useMasterDataByType } from '@/hooks/useMasterData'

export default function ITProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formAction, setFormAction] = useState<any>()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { state } = useAuth()

  const { data: detailData, isLoading: detailLoading } = useITProductDetail(
    isEdit ? id : undefined,
  )
  const { mutate: createItem, isPending: createPending } = useITProductCreate()
  const { mutate: updateItem, isPending: updatePending } = useITProductUpdate()
  const { data: techData } = useMasterDataByType('TECH_STACK')
  const techOptions =
    techData?.data?.map((m: any) => ({ label: m.label, value: m.value })) ?? []

  // Prefill saat mode edit
  useEffect(() => {
    if (isEdit && detailData) {
      const item = detailData
      if (item) {
        const values = {
          title: item.title,
          banner: item.banner && item.banner.url ? item.banner : null,
          description: item.description,
          tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack : [],
          link: item.link || '',
          problem: item.problem || '',
          feature: Array.isArray(item.feature) ? item.feature : [],
          compliance: item.compliance || '',
          highlight: Array.isArray(item.highlight)
            ? item.highlight.map((h: any) => ({
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
    description: formAction?.description,
    banner: formAction?.banner || null,
    tech_stack: Array.isArray(formAction?.tech_stack)
      ? formAction.tech_stack
      : [],
    link: formAction?.link || null,
    problem: formAction?.problem || null,
    feature: Array.isArray(formAction?.feature)
      ? formAction.feature.filter((f: string) => f.trim() !== '')
      : [],
    compliance: formAction?.compliance || null,
    highlight: Array.isArray(formAction?.highlight)
      ? formAction.highlight.filter(
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
              Notification('success', 'Success to Update IT Product')
              navigate('/it-product')
            },
            onError: () => {
              Notification('error', 'Failed to Update IT Product')
            },
          },
        )
      } else {
        createItem(buildPayload(), {
          onSuccess: () => {
            Notification('success', 'Success to Create IT Product')
            navigate('/it-product')
          },
          onError: () => {
            Notification('error', 'Failed to Create IT Product')
          },
        })
      }
    } catch (e) {
      Notification('error', 'Please fill all required fields')
    }
  }

  if (!state.user || state.user.role !== 'SUPERADMIN') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/it-product"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to list
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit IT Product' : 'Add IT Product'}
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {isEdit
              ? 'Update the details of your IT product'
              : 'Create a new IT product'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {isEdit && detailLoading ? (
          <div className="animate-pulse bg-gray-100 w-full min-h-[40dvh] rounded-xl" />
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
                  folder="it-product"
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
                type="text"
                name="compliance"
                label="Compliance"
                placeholder="e.g. ISO 27001"
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="text"
                name="link"
                label="Link"
                placeholder="https://..."
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="textarea"
                name="problem"
                label="Problem"
                placeholder="Problem statement this product solves"
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

            <FeatureList
              label="Features"
              value={Array.isArray(formAction?.feature) ? formAction.feature : []}
              onChange={(feature) =>
                setFormAction((prev: any) => ({ ...prev, feature }))
              }
            />

            <HighlightList
              label="Highlights"
              value={Array.isArray(formAction?.highlight) ? formAction.highlight : []}
              onChange={(highlight) =>
                setFormAction((prev: any) => ({ ...prev, highlight }))
              }
            />

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/it-product')}
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