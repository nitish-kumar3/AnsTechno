import { useState } from 'react'
import { Download, Mail, MessageCircle, Phone, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { inputClass } from '../ui/FormField'
import InfoRow from './InfoRow'
import StatusBadge from './StatusBadge'

const stages = ['New', 'Shortlisted', 'Interview', 'Hired', 'Rejected']

const contactBtn =
  'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300'

export default function ApplicationDetail({ application: a, onUpdate, onDelete }) {
  const [notes, setNotes] = useState(a.notes || '')
  const [savingNotes, setSavingNotes] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  // WhatsApp ke liye number: 10 digit ho to aage 91 laga do
  const digits = a.phone.replace(/\D/g, '')
  const whatsapp = digits.length === 10 ? `91${digits}` : digits
  const notesChanged = notes !== (a.notes || '')

  const saveNotes = async () => {
    setSavingNotes(true)
    await onUpdate({ notes })
    setSavingNotes(false)
  }

  // Resume server se (login ke saath) mangwa ke download karo
  const downloadResume = async () => {
    setDownloading(true)
    setError('')
    try {
      const res = await api.get(`/applications/${a._id}/resume`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const link = document.createElement('a')
      link.href = url
      link.download = a.resumeName || 'resume'
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Resume download nahi ho payi. File server par nahi mili.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Naam aur contact */}
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 text-xl font-bold text-black">
          {a.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h4 className="truncate text-xl font-bold">{a.name}</h4>
          <div className="mt-1">
            <StatusBadge value={a.stage} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${a.email}`} className={contactBtn}>
          <Mail size={16} /> Email
        </a>
        <a href={`tel:${a.phone}`} className={contactBtn}>
          <Phone size={16} /> Call
        </a>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className={contactBtn}
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
      </div>

      {/* Details */}
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoRow label="Applied for">
          {a.openingTitle} <span className="text-white/50">({a.openingType})</span>
        </InfoRow>
        <InfoRow label="Applied on">
          {new Date(a.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </InfoRow>
        <InfoRow label="Email">{a.email}</InfoRow>
        <InfoRow label="Phone">{a.phone}</InfoRow>
        <InfoRow label="Current status">{a.currentStatus}</InfoRow>
        <InfoRow label="Resume">
          {a.resumeFile ? (
            <button
              onClick={downloadResume}
              disabled={downloading}
              className="inline-flex items-center gap-2 font-medium text-brand-300 hover:underline disabled:opacity-60"
            >
              <Download size={15} />
              {downloading ? 'Downloading...' : a.resumeName || 'Download'}
            </button>
          ) : (
            <span className="text-white/50">Not uploaded</span>
          )}
        </InfoRow>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {a.message && (
        <InfoRow label="Message">
          <p className="whitespace-pre-wrap">{a.message}</p>
        </InfoRow>
      )}

      {/* Stage badlo */}
      <div>
        <p className="mb-2 text-sm font-medium text-white/80">Stage</p>
        <div className="flex flex-wrap gap-2">
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => a.stage !== s && onUpdate({ stage: s })}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                a.stage === s
                  ? 'border-brand-500 bg-brand-500 text-black'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-brand-500/40 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Private notes */}
      <div>
        <p className="mb-2 text-sm font-medium text-white/80">Private notes (sirf tumhe dikhenge)</p>
        <textarea
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Interview kab hai, kya feedback tha..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {notesChanged && (
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            className="mt-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70"
          >
            {savingNotes ? 'Saving...' : 'Save notes'}
          </button>
        )}
      </div>

      <div className="border-t border-white/10 pt-4">
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-red-500/15 hover:text-red-500"
        >
          <Trash2 size={15} /> Delete application
        </button>
      </div>
    </div>
  )
}