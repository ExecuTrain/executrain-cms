import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

import AxiosClient from '@/lib/axios'
import Notification from '@/components/Notification'
import Image from '@/components/Image'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_WIDTH = 1600
const QUALITY = 0.8

interface ImageValue {
  url: string
  public_id: string
}

interface ImageUploadProps {
  value?: ImageValue | null
  onChange?: (value: ImageValue | null) => void
  label?: string
  folder?: string
  aspectClass?: string
}

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width)
          width = MAX_WIDTH
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas not supported'))
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Failed to compress'))
            const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
            resolve(new File([blob], name, { type: 'image/jpeg' }))
          },
          'image/jpeg',
          QUALITY,
        )
      }
      img.onerror = () => reject(new Error('Invalid image'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Banner Image',
  folder = 'skill-accelerator',
  aspectClass = 'h-40',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = async (file: File) => {
    // Validasi tipe
    if (!ACCEPTED.includes(file.type)) {
      Notification('error', 'Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP')
      return
    }
    // Validasi ukuran
    if (file.size > MAX_SIZE) {
      Notification('error', 'File terlalu besar, maksimal 2MB')
      return
    }

    try {
      setIsUploading(true)
      // Compress client-side sebelum upload
      const compressed = await compressImage(file)

      const formData = new FormData()
      formData.append('file', compressed)
      formData.append('folder', folder)

      const { data: response } = await AxiosClient.post('/upload', formData)

      if (response.status !== 200) {
        throw new Error(response.message || 'Upload failed')
      }

      onChange?.({
        url: response.data.url,
        public_id: response.data.public_id,
      })
      Notification('success', 'Image uploaded successfully')
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to upload'
      Notification('error', message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mb-4">
      <label className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
        {label}
      </label>

      {value?.url ? (
        <div className={`relative rounded-xl overflow-hidden border border-gray-200 ${aspectClass}`}>
          <Image
            src={value.url}
            alt={label}
            width={800}
            height={300}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => {
              onChange?.(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={`w-full ${aspectClass} rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50/50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 disabled:opacity-50`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Compressing & uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <span className="text-xs">
                Click to upload (max 2MB, JPG/PNG/WebP)
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}