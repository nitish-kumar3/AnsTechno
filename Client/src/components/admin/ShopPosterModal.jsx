import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Download, ExternalLink } from 'lucide-react'
import { drawPoster, shopUrl } from '../../utils/drawPoster'

const btn =
  'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300'

export default function ShopPosterModal({ shop }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    drawPoster(canvasRef.current, shop)
      .catch(() => {
        if (!ignore) setError('Poster nahi ban paya. Dobara try karo.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [shop])

  const download = () => {
    canvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Poster-${shop.slug}.png`
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shopUrl(shop.slug))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard allowed nahi hai
    }
  }

  return (
    <div className="space-y-5">
      <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <canvas ref={canvasRef} className="block h-auto max-h-[65vh] w-auto max-w-full" />
        {loading && (
          <div className="absolute inset-0 grid place-items-center bg-ink/60">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500/30 border-t-brand-500" />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={download}
          disabled={loading || Boolean(error)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-60"
        >
          <Download size={16} /> Download poster
        </button>
        <button onClick={copyLink} className={btn}>
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy shop link'}
        </button>
        <a href={`/shop/${shop.slug}`} target="_blank" rel="noreferrer" className={btn}>
          <ExternalLink size={16} /> Open shop page
        </a>
      </div>

      <p className="text-center text-xs text-white/45">
        QR par ye address hai: {shopUrl(shop.slug)}. Asli poster live site ke baad nikalna, taaki QR me
        localhost na ho.
      </p>
    </div>
  )
}