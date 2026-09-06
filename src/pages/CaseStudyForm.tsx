import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Form } from 'antd'
import { ArrowLeft } from 'lucide-react'

import InputForm from '@/components/Form'
import Notification from '@/components/Notification'
import TeamSizeList from '@/components/TeamSizeList'
import TestimonialInput from '@/components/TestimonialInput'
import {
  useCaseStudyCreate,
  useCaseStudyUpdate,
  useCaseStudyDetail,
} from '@/hooks/useCaseStudy'
import { useMasterDataByType } from '@/hooks/useMasterData'

function toOptions(list: any[]) {
  return (list ?? []).map((m: any) => ({ label: m.label, value: m.value }))
}

export default function CaseStudyFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formAction, setFormAction] = useState<any>()
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const { data: detailData, isLoading: detailLoading } = useCaseStudyDetail(
    isEdit ? id : undefined,
  )
  const { mutate: createItem, isPending: createPending } = useCaseStudyCreate()
  const { mutate: updateItem, isPending: updatePending } = useCaseStudyUpdate()
  const { data: catData } = useMasterDataByType('CASE_CATEGORY')
  const { data: industryData } = useMasterDataByType('CASE_INDUSTRY')
  const { data: solutionData } = useMasterDataByType('CASE_SOLUTION')
  const { data: methodData } = useMasterDataByType('CASE_METHODOLOGY')
  const { data: deployData } = useMasterDataByType('CASE_DEPLOYMENT')
  const catOptions = toOptions(catData?.data)
  const industryOptions = toOptions(industryData?.data)
  const solutionOptions = toOptions(solutionData?.data)
  const methodOptions = toOptions(methodData?.data)
  const deployOptions = toOptions(deployData?.data)

  // Prefill saat mode edit
  useEffect(() => {
    if (isEdit && detailData) {
      const item = detailData
      if (item) {
        const values = {
          title: item.title,
          category: item.category || undefined,
          description: item.description,
          industries: Array.isArray(item.industries) ? item.industries : [],
          solutions: Array.isArray(item.solutions) ? item.solutions : [],
          deployment_type: item.deployment_type || undefined,
          timeline: item.timeline || 0,
          compliance: item.compliance || '',
          methodology: item.methodology || undefined,
          team_size: Array.isArray(item.team_size)
            ? item.team_size.map((t: any) => ({
                quantity: t.quantity || 0,
                type: t.type || '',
              }))
            : [],
          testimonial: {
            testimoni: item.testimonial?.testimoni || '',
            name: item.testimonial?.name || '',
            company: item.testimonial?.company || '',
          },
          link: item.link || '',
        }
        setFormAction(values)
        form.setFieldsValue(values)
      }
    }
  }, [isEdit, id, detailData, form])

  const buildPayload = () => ({
    title: formAction?.title,
    category: formAction?.category || null,
    description: formAction?.description,
    industries: Array.isArray(formAction?.industries) ? formAction.industries : [],
    solutions: Array.isArray(formAction?.solutions) ? formAction.solutions : [],
    deployment_type: formAction?.deployment_type || null,
    timeline: formAction?.timeline || 0,
    compliance: formAction?.compliance || null,
    methodology: formAction?.methodology || null,
    team_size: Array.isArray(formAction?.team_size)
      ? formAction.team_size.filter((t: any) => t && (t.type || t.quantity))
      : [],
    testimonial: {
      testimoni: formAction?.testimonial?.testimoni || '',
      name: formAction?.testimonial?.name || '',
      company: formAction?.testimonial?.company || '',
    },
    link: formAction?.link || null,
  })

  const handleSubmit = async () => {
    try {
      await form.validateFields()

      if (isEdit) {
        updateItem(
          { id: id!, payload: buildPayload() },
          {
            onSuccess: () => {
              Notification('success', 'Success to Update Case Study')
              navigate('/case-studies')
            },
            onError: () => {
              Notification('error', 'Failed to Update Case Study')
            },
          },
        )
      } else {
        createItem(buildPayload(), {
          onSuccess: () => {
            Notification('success', 'Success to Create Case Study')
            navigate('/case-studies')
          },
          onError: () => {
            Notification('error', 'Failed to Create Case Study')
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
            to="/case-studies"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to list
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Case Study' : 'Add Case Study'}
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {isEdit
              ? 'Update the details of your case study'
              : 'Create a new case study'}
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
              <InputForm
                type="select"
                name="category"
                label="Category"
                placeholder="Select category"
                options={catOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="industries"
                label="Industries"
                placeholder="Select industries"
                required
                multiple
                options={industryOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="solutions"
                label="Solutions"
                placeholder="Select solutions"
                required
                multiple
                options={solutionOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="deployment_type"
                label="Deployment Type"
                placeholder="Select deployment type"
                options={deployOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="methodology"
                label="Methodology"
                placeholder="Select methodology"
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

            <TestimonialInput
              label="Testimonial"
              value={
                formAction?.testimonial ?? { testimoni: '', name: '', company: '' }
              }
              onChange={(testimonial) =>
                setFormAction((prev: any) => ({ ...prev, testimonial }))
              }
            />

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/case-studies')}
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