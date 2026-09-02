import { useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo2,
  Redo2,
  Eraser,
  ImagePlus,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import AxiosClient from '@/lib/axios'
import Notification from '@/components/Notification'

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  onUploaded?: (url: string) => void
  placeholder?: string
  minHeight?: number
}

function ToolbarButton({
  active,
  onClick,
  disabled,
  children,
}: {
  active?: boolean
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        active
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 hover:bg-gray-100',
      )}
    >
      {children}
    </button>
  )
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_WIDTH = 1600
const QUALITY = 0.8

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

/** Ekstrak URL gambar dari HTML konten */
export function extractImageUrls(html: string): string[] {
  if (!html) return []
  const urls: string[] = []
  const srcRegex = /<img[^>]+src=["']([^"']+)["']/gi
  let match
  while ((match = srcRegex.exec(html)) !== null) {
    urls.push(match[1])
  }
  return urls
}

export default function RichTextEditor({
  value = '',
  onChange,
  onUploaded,
  placeholder = 'Write your content here...',
  minHeight = 300,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: 'max-w-full rounded-xl my-3 mx-auto block h-auto',
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none px-4 py-3 min-h-full',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const handleFile = async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      Notification(
        'error',
        'Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP',
      )
      return
    }
    if (file.size > MAX_SIZE) {
      Notification('error', 'File terlalu besar, maksimal 2MB')
      return
    }

    try {
      setIsUploading(true)
      const compressed = await compressImage(file)

      const formData = new FormData()
      formData.append('file', compressed)
      formData.append('folder', 'article')

      const { data: response } = await AxiosClient.post('/upload', formData)

      if (response.status !== 200) {
        throw new Error(response.message || 'Upload failed')
      }

      // Sisipkan gambar ke editor pada posisi kursor
      editor
        ?.chain()
        .focus()
        .setImage({ src: response.data.url })
        .run()

      Notification('success', 'Image inserted')
      onUploaded?.(response.data.url)
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to upload'
      Notification('error', message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap">
        <ToolbarButton
          active={editor?.isActive('bold')}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('italic')}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('heading', { level: 2 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('heading', { level: 3 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton
          active={editor?.isActive('bulletList')}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('orderedList')}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('blockquote')}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive('code')}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
        >
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
        >
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor?.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          <Eraser className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImagePlus className="w-4 h-4" />
          )}
        </ToolbarButton>
      </div>

      {/* Editor Area */}
      <div style={{ minHeight }} className="bg-white overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
