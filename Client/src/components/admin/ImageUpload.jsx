import { useRef, useState } from 'react'
import { ImagePlus, RefreshCw, Trash2 } from 'lucide-react'
import api from '../../services/api'
import assetUrl from '../../utils/assetUrl'
import resizeImage from '../../utils/resizeImage'

const allowed = ['image/jpeg', 'image/png', 'image/webp']
const MAX_PICK = 15 * 1024 * 1024 // 15MB tak ki photo chun sakte ho (chhoti ho kar jayegi)

export default function ImageUpload({ label = 'Photo', value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file) => {
    if (!file) return

    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG or WebP images allowed')
      return
    }
    if (file.size > MAX_PICK) {
      setError('Image is too big. Choose one under 15MB')
      return
    }

    setError('')
    setUploading(true)
    try {
      const small = await resizeImage(file) // chhota karo
      const data = new FormData()
      data.append('image', small, 'photo')

      const res = await api.post('/uploads/image', data)
      onChange(res.data.url) // form ko naya address do
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  const pick = () => inputRef.current.click()

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-white/80">{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          upload(e.target.files[0])
          e.target.value = '' // wahi photo dobara chun sako
        }}
      />

      {value ? (
        // Photo lagi hui hai: preview + Replace / Remove
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <img src={assetUrl(value)} alt="" className="aspect-[16/10] w-full object-cover" />

          {uploading && (
            <div className="absolute inset-0 grid place-items-center bg-black/60">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-[#ffffff]" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-linear-to-t from-black/70 to-transparent p-3">
            <button
              type="button"
              onClick={pick}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-[#ffffff] backdrop-blur transition hover:bg-black/80 disabled:opacity-60"
            >
              <RefreshCw size={15} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-[#ffffff] backdrop-blur transition hover:bg-red-600 disabled:opacity-60"
            >
              <Trash2 size={15} /> Remove
            </button>
          </div>
        </div>
      ) : (
        // Photo nahi hai: click ya drag and drop
        <button
          type="button"
          onClick={pick}
          disabled={uploading}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            upload(e.dataTransfer.files[0])
          }}
          className={`flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 text-center transition ${
            dragging
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-white/20 bg-white/[0.03] hover:border-brand-500/50'
          }`}
        >
          {uploading ? (
            <>
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500/30 border-t-brand-500" />
              <span className="text-sm text-white/70">Uploading...</span>
            </>
          ) : (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                <ImagePlus size={24} />
              </span>
              <span className="text-sm font-medium">Click to choose or drop a photo</span>
              <span className="text-xs text-white/50">
                JPG, PNG or WebP · 16:10 shape sabse achhi dikhegi
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}