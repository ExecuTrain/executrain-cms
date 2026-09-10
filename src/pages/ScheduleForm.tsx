import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Form, DatePicker } from 'antd'
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  CalendarRange,
} from 'lucide-react'
import dayjs, { type Dayjs } from 'dayjs'

import Notification from '@/components/Notification'
import { FieldRowsSkeleton } from '@/components/Skeletons'
import InputForm from '@/components/Form'
import {
  useScheduleRangeCreate,
  useScheduleRangeUpdate,
  useScheduleDetail,
  useScheduleOptions,
} from '@/hooks/useSchedule'

const { RangePicker } = DatePicker

export default function ScheduleFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formAction, setFormAction] = useState<any>({})
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ])
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const { data: detailData, isLoading: detailLoading } = useScheduleDetail(
    isEdit ? id : undefined,
  )
  const { mutate: createItem, isPending: createPending } =
    useScheduleRangeCreate()
  const { mutate: updateItem, isPending: updatePending } =
    useScheduleRangeUpdate()

  // Opsi program sesuai entity type terpilih
  const entityType: 'COURSE' | 'SKILL_ACCELERATOR' | null =
    formAction?.entity_type || (isEdit ? detailData?.entity_type : null) || null
  const { data: optionsData } = useScheduleOptions(entityType)
  const programOptions = useMemo(() => {
    const rows: any[] = optionsData?.data ?? []
    return rows.map((r) => ({
      label: r.category ? `${r.title} (${r.category})` : r.title,
      value: r.id,
    }))
  }, [optionsData])

  // Prefill saat edit: gunakan `group` (klaster tanggal berurutan) sebagai range
  useEffect(() => {
    if (isEdit && detailData) {
      const values = {
        entity_type: detailData.entity_type,
        entity_id: detailData.entity_id,
        program_name: detailData.program_name,
      }
      setFormAction(values)
      form.setFieldsValue(values)

      if (detailData.group) {
        const start = dayjs(detailData.group.start_date)
        const end = dayjs(detailData.group.end_date)
        setDateRange([start, end])
      } else {
        setDateRange([dayjs(detailData.schedule_date), dayjs(detailData.schedule_date)])
      }
    }
  }, [isEdit, id, detailData, form])

  const buildPayload = () => {
    if (!dateRange[0] || !dateRange[1]) return null
    return {
      entity_type: formAction?.entity_type,
      entity_id: formAction?.entity_id,
      // Kirim tanggal kalender polos (YYYY-MM-DD); backend simpan sbg UTC midnight.
      start_date: dateRange[0].format('YYYY-MM-DD'),
      end_date: dateRange[1].format('YYYY-MM-DD'),
    }
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      if (!dateRange[0] || !dateRange[1]) {
        Notification('error', 'Please select schedule date range')
        return
      }
      const payload = buildPayload()
      if (!payload) return

      if (isEdit) {
        updateItem(
          {
            id: id!,
            payload: {
              ...payload,
              // Hapus seluruh baris klaster lama; backend re-insert rentang baru
              replace_ids: detailData?.group?.ids ?? [],
            },
          },
          {
            onSuccess: () => {
              Notification('success', 'Success to Update Schedule')
              navigate('/schedule')
            },
            onError: () => {
              Notification('error', 'Failed to Update Schedule')
            },
          },
        )
      } else {
        createItem(payload as any, {
          onSuccess: () => {
            Notification('success', 'Success to Create Schedule')
            navigate('/schedule')
          },
          onError: () => {
            Notification('error', 'Failed to Create Schedule')
          },
        })
      }
    } catch (e) {
      Notification('error', 'Please fill all required fields')
    }
  }

  const selectEntityType = (type: 'COURSE' | 'SKILL_ACCELERATOR') => {
    setFormAction((prev: any) => ({
      ...prev,
      entity_type: type,
      entity_id: undefined,
      program_name: undefined,
    }))
    form.setFieldsValue({ entity_type: type, entity_id: undefined })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/schedule"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to list
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Schedule' : 'Add Schedule'}
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {isEdit
              ? 'Update the date range for this program'
              : 'Pick a program and the range of class dates'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {isEdit && detailLoading ? (
          <FieldRowsSkeleton rows={4} />
        ) : (
          <Form form={form} layout="vertical" requiredMark={false}>
            {/* Pilih tipe entitas */}
            <Form.Item label="Program Type" required className="mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => selectEntityType('COURSE')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                    formAction?.entity_type === 'COURSE'
                      ? 'border-primary-500 bg-primary-50/60'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Course Catalog
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Regular IT training courses
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => selectEntityType('SKILL_ACCELERATOR')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                    formAction?.entity_type === 'SKILL_ACCELERATOR'
                      ? 'border-primary-500 bg-primary-50/60'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Skill Accelerator
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Intensive skill programs
                    </p>
                  </div>
                </button>
              </div>
            </Form.Item>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
              <InputForm
                type="select"
                name="entity_id"
                label="Program"
                placeholder={
                  entityType
                    ? 'Select program'
                    : 'Select program type first'
                }
                required
                disabled={!entityType}
                options={programOptions}
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />

              {/* Rentang tanggal */}
              <Form.Item
                label="Schedule Date Range"
                required
                className="mb-4"
              >
                <RangePicker
                  value={dateRange}
                  onChange={(dates) => {
                    setDateRange(dates as [Dayjs | null, Dayjs | null])
                  }}
                  format="DD MMM YYYY"
                  className="w-full rounded-xl"
                />
              </Form.Item>
            </div>

            {isEdit && detailData?.group && (
              <div className="rounded-xl bg-primary-50/60 border border-primary-100 px-4 py-3 text-xs text-gray-600 mb-4 flex items-start gap-2">
                <CalendarRange className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                <span>
                  Menyimpan <b>{detailData.group.dates.length} tanggal</b>{' '}
                  berurutan (
                  {detailData.group.dates
                    .map((d: string) => dayjs(d).format('DD MMM'))
                    .join(', ')}
                  ). Ubah rentang utk menyimpan kembali. Sesi tanggal lain utk
                  program yang sama tidak terpengaruh.
                </span>
              </div>
            )}

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/schedule')}
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
