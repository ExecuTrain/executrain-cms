import React, { useRef } from 'react'
import {
  Input,
  Form,
  Select,
  DatePicker,
  TimePicker,
} from 'antd'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

type InputFormProps = {
  type?:
    | 'text'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'date'
    | 'datetime'
    | 'file'
    | 'switch'
    | 'radio'
    | 'checkbox'
    | 'time'
  name: string
  form?: Record<string, any>
  setForm?: React.Dispatch<React.SetStateAction<Record<string, any>>>
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
  icon?: React.ReactNode
  options?: Array<{ label: string; value: any }>
  multiple?: boolean
  size?: 'small' | 'middle' | 'large'
  variant?: 'outlined' | 'filled' | 'borderless'
}

const InputForm: React.FC<InputFormProps> = ({
  type = 'text',
  name,
  form = {},
  setForm = () => {},
  label,
  placeholder,
  disabled = false,
  className,
  required = false,
  icon,
  options = [],
  multiple = false,
  size = 'large',
  variant = 'outlined',
}) => {
  const inputRef = useRef<any>(null)

  const handleChange = (value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value?.target ? value.target.value : value,
    }))
  }

  const handleNumberChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value ? parseInt(value, 10) : 0,
    }))
  }

  const handleNumberInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
    ]

    const isNumber = /^[0-9]$/.test(e.key)
    const isModifier = e.ctrlKey || e.metaKey

    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
      e.preventDefault()
      return
    }

    if (!isNumber && !allowedKeys.includes(e.key) && !isModifier) {
      e.preventDefault()
    }
  }

  const handleNumberInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
  }

  const baseInputClass = cn(
    'transition-all duration-200',
    'border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:border-primary-500 bg-white text-gray-900',
    'rounded-xl',
    className,
  )

  const renderInput = () => {
    switch (type) {
      case 'password':
        return (
          <Input.Password
            value={form[name] || undefined}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            variant={variant}
            prefix={icon && <div className="mr-3">{icon}</div>}
            className={baseInputClass}
          />
        )
      case 'number':
        return (
          <Input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={form[name] || undefined}
            onChange={(e) => handleNumberChange(e.target.value)}
            onKeyDown={handleNumberInputKeyDown}
            onPaste={handleNumberInputPaste}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            variant={variant}
            prefix={icon && <div className="mr-3">{icon}</div>}
            className={cn(baseInputClass, 'pr-12')}
          />
        )
      case 'textarea':
        return (
          <TextArea
            value={form[name] || undefined}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            autoSize={{ minRows: 3, maxRows: 6 }}
            className={baseInputClass}
          />
        )
      case 'time':
        return (
          <TimePicker
            value={form[name] || undefined}
            onChange={(e) => handletimeChange(e)}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            defaultOpenValue={dayjs('00:00', 'HH:mm')}
            format="HH:mm"
            variant={variant}
            className={cn(baseInputClass, 'w-full')}
          />
        )
      case 'select':
        return (
          <Select
            value={form[name] || undefined}
            onChange={(val) => handleChange(val)}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            variant={variant}
            mode={multiple ? 'multiple' : undefined}
            className={cn('w-full', className)}
            popupClassName="rounded-xl border-gray-200 bg-white"
          >
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        )
      case 'date':
        return (
          <DatePicker
            value={form[name] || undefined}
            onChange={(date) => handleChange(date)}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            variant={variant}
            className={cn(baseInputClass, 'w-full')}
          />
        )
      case 'datetime':
        return (
          <DatePicker
            value={form[name] || undefined}
            onChange={(date) => handleChange(date)}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            showTime
            variant={variant}
            className={cn(baseInputClass, 'w-full')}
          />
        )
      default:
        return (
          <Input
            value={form[name] || undefined}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            variant={variant}
            prefix={icon && <div className="mr-3">{icon}</div>}
            className={baseInputClass}
          />
        )
    }
  }

  return (
    <Form.Item
      name={name}
      label={label}
      required={required}
      className={cn('mb-4', className)}
    >
      {renderInput()}
    </Form.Item>
  )

  function handletimeChange(e: any) {
    handleChange(e ? dayjs(e).format('HH:mm') : '')
  }
}

export default InputForm