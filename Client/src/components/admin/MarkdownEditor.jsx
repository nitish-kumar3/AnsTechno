import { useRef, useState } from 'react'
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react'
import api from '../../services/api'
import resizeImage from '../../utils/resizeImage'
import MarkdownBody from '../blog/MarkdownBody'

const allowed = ['image/jpeg', 'image/png', 'image/webp']

export default function MarkdownEditor({ value, onChange }) {
  const ref = useRef(null)
  const fileRef = useRef(null)
  const [tab, setTab] = useState('write') // write ya preview
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Chune hue text ke aage-peeche symbol lagao (jaise **bold**)
  const wrap = (before, after, placeholder) => {
    const el = ref.current
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end) || placeholder
    onChange(value.slice(0, start) + before + selected + after + value.slice(end))
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + selected.length)
    })
  }

  // Line ke shuru me symbol lagao (jaise ## heading)
  const prefix = (symbol) => {
    const el = ref.current
    const start = el.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    onChange(value.slice(0, lineStart) + symbol + value.slice(lineStart))
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + symbol.length, start + symbol.length)
    })
  }

  // Photo upload karke article ke end me jod do
  const uploadImage = async (file) => {
    if (!file) return
    if (!allowed.includes(file.type)) return setError('Only JPG, PNG or WebP images allowed')
    if (file.size > 15 * 1024 * 1024) return setError('Image is too big. Choose one under 15MB')

    setError('')
    setUploading(true)
    try {
      const small = await resizeImage(file)
      const data = new FormData()
      data.append('image', small, 'photo')
      const res = await api.post('/uploads/image', data)
      onChange(`${value}${value && !value.endsWith('\n') ? '\n\n' : ''}![](${res.data.url})\n`)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  const tools = [
    { icon: Bold, label: 'Bold', run: () => wrap('**', '**', 'bold text') },
    { icon: Italic, label: 'Italic', run: () => wrap('*', '*', 'italic text') },
    { icon: Heading2, label: 'Heading', run: () => prefix('## ') },
    { icon: Heading3, label: 'Sub heading', run: () => prefix('### ') },
    { icon: List, label: 'List', run: () => prefix('- ') },
    { icon: ListOrdered, label: 'Numbered list', run: () => prefix('1. ') },
    { icon: Quote, label: 'Quote', run: () => prefix('> ') },
    { icon: Link2, label: 'Link', run: () => wrap('[', '](https://)', 'link text') },
  ]

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-sm font-medium text-white/80">Article</p>
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-0.5 text-xs">
          {['write', 'preview'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1 font-semibold capitalize transition ${
                tab === t ? 'bg-brand-500 text-black' : 'text-white/70'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        {tab === 'write' ? (
          <>
            <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
              {tools.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  title={t.label}
                  aria-label={t.label}
                  onClick={t.run}
                  className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-brand-300"
                >
                  <t.icon size={17} />
                </button>
              ))}
              <button
                type="button"
                title="Photo jodo"
                aria-label="Add photo"
                disabled={uploading}
                onClick={() => fileRef.current.click()}
                className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-brand-300 disabled:opacity-50"
              >
                {uploading ? (
                  <span className="block h-[17px] w-[17px] animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
                ) : (
                  <ImagePlus size={17} />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  uploadImage(e.target.files[0])
                  e.target.value = ''
                }}
              />
            </div>

            <textarea
              ref={ref}
              rows={16}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={'## Heading\n\nApna article yahan likho. Upar ke buttons se bold, list, link aur photo jod sakte ho.'}
              className="block w-full resize-y bg-transparent px-4 py-3 text-base leading-relaxed outline-none placeholder:text-white/30 sm:text-sm"
            />
          </>
        ) : (
          <div className="min-h-[18rem] p-5">
            {value.trim() ? (
              <MarkdownBody>{value}</MarkdownBody>
            ) : (
              <p className="text-sm text-white/40">Abhi kuch nahi likha.</p>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <p className="mt-1.5 text-xs text-white/40">
        Photo article ke end me judti hai. Use kaatke sahi jagah paste kar do.
      </p>
    </div>
  )
}