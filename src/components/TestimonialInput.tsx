import { Quote } from 'lucide-react'

export interface TestimonialValue {
  testimoni: string
  name: string
  company: string
}

interface TestimonialInputProps {
  value?: TestimonialValue
  onChange?: (value: TestimonialValue) => void
  label?: string
}

export default function TestimonialInput({
  value = { testimoni: '', name: '', company: '' },
  onChange,
  label = 'Testimonial',
}: TestimonialInputProps) {
  const update = (patch: Partial<TestimonialValue>) => {
    onChange?.({ ...value, ...patch })
  }

  return (
    <div className="mb-4">
      <label className="text-xs font-medium text-gray-700 flex items-center gap-1 mb-2">
        <Quote className="w-3.5 h-3.5 text-gray-400" />
        {label}
      </label>

      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
        <textarea
          value={value.testimoni}
          onChange={(e) => update({ testimoni: e.target.value })}
          placeholder="Client testimonial..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 resize-none"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={value.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Client name"
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          />
          <input
            type="text"
            value={value.company}
            onChange={(e) => update({ company: e.target.value })}
            placeholder="Company"
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>
      </div>
    </div>
  )
}