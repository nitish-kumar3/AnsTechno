import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Download, ExternalLink } from 'lucide-react'
import { drawCertificate, verifyUrl } from '../../utils/drawCertificate'

const btn =
  'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300'

export default function CertificateModal({ certificate }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Certificate ki image banao
  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    drawCertificate(canvasRef.current, certificate)
      .catch(() => {
        if (!ignore) setError('Certificate image nahi ban payi. Dobara try karo.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [certificate])

  const download = () => {
    canvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Certificate-${certificate.certId}.png`
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl(certificate.certId))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard allowed nahi hai
    }
  }

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <canvas ref={canvasRef} className="block h-auto w-full" />
        {loading && (
          <div className="absolute inset-0 grid place-items-center bg-ink/60">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500/30 border-t-brand-500" />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={download}
          disabled={loading || Boolean(error)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-60"
        >
          <Download size={16} /> Download PNG
        </button>
        <button onClick={copyLink} className={btn}>
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy verify link'}
        </button>
        <a href={verifyUrl(certificate.certId)} target="_blank" rel="noreferrer" className={btn}>
          <ExternalLink size={16} /> Open verify page
        </a>
      </div>

      <p className="text-xs text-white/45">
        QR par ye address hai: {verifyUrl(certificate.certId)}. Asli certificate live site ke baad
        nikalna, taaki QR me localhost na ho.
      </p>
    </div>
  )
}