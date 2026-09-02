import { useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface FileUploadProps {
  value?: { file?: File; url?: string; public_id?: string } | null
  onChange?: (value: { file: File } | { url: string; public_id?: string } | null) => void
  label?: string
  accept?: string
  required?: boolean
  aspectClass?: string
}

/**
 * File picker yang menghasilkan { file: File } untuk dikirim langsung
 * ke endpoint API (multipart) — dipakai Content Management tabs.
 * Jika value punya url (data existing), tampilkan preview.
 */
export default function FileUpload({
  value,
  onChange,
  label = 'Image',
  accept = 'image/*',
  required = false,
  aspectClass = 'h-40',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const hasExisting = Boolean(value?.url)
  const previewSrc = value?.url

  return (
    <div className="mb-4">
      <label className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {hasExisting && !value?.file ? (
        <div
          className={`relative ${aspectClass} rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center`}
        >
          <img
            src={previewSrc}
            alt={label}
            className="max-h-full max-w-full object-contain p-2"
          />
          <button
            type="button"
            onClick={() => {
              onChange?.({ url: '', public_id: '' })
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
            title="Remove"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs"
          >
            Replace
          </button>
        </div>
      ) : value?.file ? (
        <div
          className={`relative ${aspectClass} rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center`}
        >
          <img
            src={URL.createObjectURL(value.file)}
            alt={label}
            className="max-h-full max-w-full object-contain p-2"
          />
          <button
            type="button"
            onClick={() => {
              onChange?.(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
            title="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full ${aspectClass} rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50/50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500`}
        >
          <Upload className="w-6 h-6" />
          <span className="text-xs">Click to upload</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onChange?.({ file })
          }
          e.target.value = ''
        }}
      />
    </div>
  )
}
