import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import api from '../../services/api'
import assetUrl from '../../utils/assetUrl'
import resizeImage from '../../utils/resizeImage'

const allowed = ['image/jpeg', 'image/png', 'image/webp']

export default function ThumbUpload({ value, onChange, size = 'h-20 w-20' }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file) => {
    if (!file) return
    if (!allowed.includes(file.type)) return setError('JPG, PNG ya WebP')
    if (file.size > 15 * 1024 * 1024) return setError('15MB se chhoti')

    setError('')
    setBusy(true)
    try {
      const small = await resizeImage(file, 900) // chhoti photo, 900px kaafi
      const data = new FormData()
      data.append('image', small, 'photo')
      const res = await api.post('/uploads/image', data)
      onChange(res.data.url)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload nahi hui')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="shrink-0">
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          upload(e.target.files[0])
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => ref.current.click()}
        disabled={busy}
        className={`relative grid ${size} place-items-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.03] text-white/50 transition hover:border-brand-500/50`}
      >
        {value && <img src={assetUrl(value)} alt="" className="h-full w-full object-cover" />}
        {!value && !busy && <ImagePlus size={22} />}
        {busy && (
          <span className="absolute inset-0 grid place-items-center bg-black/50">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-[#ffffff]" />
          </span>
        )}
      </button>
      {value && !busy && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-1 w-full text-center text-[11px] text-white/45 hover:text-red-500"
        >
          Remove
        </button>
      )}
      {error && <p className="mt-1 max-w-[6rem] text-[10px] text-red-500">{error}</p>}
    </div>
  )
}