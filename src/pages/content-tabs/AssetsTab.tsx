import { useState } from 'react'
import {
  Image as ImageIcon,
  Video,
  Edit2,
  ExternalLink,
  Check,
  X,
  RefreshCw,
} from 'lucide-react'
import Notification from '@/components/Notification'
import { useAssets, useUpdateAssetUrl } from '@/hooks/useContentManagement'
import ImageUpload from '@/components/ImageUpload'

interface Asset {
  _id: string
  category: string
  name: string
  url: string
  fallback_url: string
  type: 'image' | 'video'
  is_active: boolean
}

const categoryLabels: Record<string, string> = {
  hero_background: 'Hero Background',
  hero_video: 'Hero Video',
  about_image: 'About Image',
  statistic_background: 'Statistic Background',
  steps_background: 'Steps Background',
  services_image: 'Services Section Image',
  cta_schedule_image: 'CTA Schedule Image',
  contact_image: 'Contact Section Image',
  framework_banner: 'Framework Banner',
  hero_blog: 'Hero Blog',
  hero_career: 'Hero Career',
  hero_contact: 'Hero Contact',
  hero_free_trial: 'Hero Free Trial',
  hero_product: 'Hero Product',
  hero_schedule: 'Hero Schedule',
  hero_service: 'Hero Service',
}

export default function AssetsTab() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [mainFile, setMainFile] = useState<any>(null)
  const [fallbackFile, setFallbackFile] = useState<any>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const truncateUrl = (value: string, maxLength: number = 90) => {
    if (!value) return ''
    if (value.length <= maxLength) return value
    return `${value.slice(0, maxLength)}...`
  }

  const { data: assets, isLoading, refetch } = useAssets()
  const { mutate: updateAssetUrl, isPending } = useUpdateAssetUrl()

  const handleEdit = (asset: Asset) => {
    setEditingId(asset._id)
    setMainFile(null)
    setFallbackFile(null)
  }

  const handleSave = (id: string) => {
    if (!mainFile?.url && !fallbackFile?.url) {
      Notification('error', 'Please select at least one file to upload')
      return
    }

    const payload: { url?: string; fallback_url?: string } = {}

    if (mainFile?.url) {
      payload.url = mainFile.url
    }
    if (fallbackFile?.url) {
      payload.fallback_url = fallbackFile.url
    }

    updateAssetUrl(
      { id, payload },
      {
        onSuccess: () => {
          Notification('success', 'Asset updated successfully')
          setEditingId(null)
          setMainFile(null)
          setFallbackFile(null)
          refetch()
        },
        onError: (error: any) => {
          Notification('error', error.message || 'Failed to update asset')
        },
      },
    )
  }

  const handleCancel = () => {
    setEditingId(null)
    setMainFile(null)
    setFallbackFile(null)
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-primary-200">
        <ImageIcon className="w-5 h-5 text-primary-600" />
        <div>
          <h3 className="font-semibold text-primary-700">Dynamic Assets</h3>
          <p className="text-xs text-primary-600">
            Manage website background images and media. Files are uploaded
            directly to storage (max 2MB per image).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {(assets ?? []).map((asset: Asset) => {
          const isEditing = editingId === asset._id

          return (
            <div
              key={asset._id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {asset.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <Video className="w-8 h-8 text-gray-600" />
                    </div>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = asset.fallback_url || ''
                      }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {categoryLabels[asset.category] || asset.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        asset.type === 'video'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-primary-400'
                      }`}
                    >
                      {asset.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        asset.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {asset.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ImageUpload
                          value={mainFile}
                          onChange={setMainFile}
                          label={`Main Asset ${asset.type === 'video' ? '(Video)' : '(Image)'}`}
                          folder="executrain/assets"
                          aspectClass="h-28"
                        />
                        <ImageUpload
                          value={fallbackFile}
                          onChange={setFallbackFile}
                          label="Fallback Asset (Optional - shown if main fails)"
                          folder="executrain/assets"
                          aspectClass="h-28"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(asset._id)}
                          disabled={isPending || (!mainFile?.url && !fallbackFile?.url)}
                          className="flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPending ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isPending}
                          className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p
                        className="text-sm text-gray-600 truncate mb-1 max-w-full"
                        title={asset.url}
                      >
                        {truncateUrl(asset.url)}
                      </p>
                      {asset.fallback_url && (
                        <p
                          className="text-xs text-gray-600 truncate max-w-full"
                          title={asset.fallback_url}
                        >
                          Fallback: {truncateUrl(asset.fallback_url)}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewUrl(asset.url)}
                      className="p-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(asset)}
                      className="p-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Upload New"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="bg-white rounded-xl p-2 max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setPreviewUrl(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {assetPreviewIsVideo(previewUrl) ? (
              <video
                src={previewUrl}
                controls
                className="max-w-full max-h-[70vh] rounded-lg"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-[70vh] rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function assetPreviewIsVideo(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url) || url.includes('/video/')
}
