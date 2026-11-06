// import { useState } from 'react'
// import { Mail, Trash2 } from 'lucide-react'
// import { inputClass } from '../ui/FormField'
// import InfoRow from './InfoRow'
// import StatusBadge from './StatusBadge'

// const statuses = ['New', 'Replied', 'Closed']

// export default function InquiryDetail({ inquiry: q, onUpdate, onDelete }) {
//   const [notes, setNotes] = useState(q.notes || '')
//   const [savingNotes, setSavingNotes] = useState(false)
//   const notesChanged = notes !== (q.notes || '')

//   const saveNotes = async () => {
//     setSavingNotes(true)
//     await onUpdate({ notes })
//     setSavingNotes(false)
//   }

//   // Mail app khulega, to aur subject pehle se bhara hoga
//   const replyLink = `mailto:${q.email}?subject=${encodeURIComponent('Re: Your message to Anstechno')}`

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center gap-4">
//         <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 text-xl font-bold text-black">
//           {q.name.charAt(0).toUpperCase()}
//         </span>
//         <div className="min-w-0">
//           <h4 className="truncate text-xl font-bold">{q.name}</h4>
//           <div className="mt-1">
//             <StatusBadge value={q.status} />
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <InfoRow label="Email">{q.email}</InfoRow>
//         <InfoRow label="Received">
//           {new Date(q.createdAt).toLocaleString('en-IN', {
//             dateStyle: 'medium',
//             timeStyle: 'short',
//           })}
//         </InfoRow>
//         {q.service && <InfoRow label="Interested in">{q.service}</InfoRow>}
//       </div>

//       <InfoRow label="Message">
//         <p className="whitespace-pre-wrap">{q.message}</p>
//       </InfoRow>

//       <a
//         href={replyLink}
//         className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
//       >
//         <Mail size={16} /> Reply by email
//       </a>

//       {/* Status badlo */}
//       <div>
//         <p className="mb-2 text-sm font-medium text-white/80">Status</p>
//         <div className="flex flex-wrap gap-2">
//           {statuses.map((s) => (
//             <button
//               key={s}
//               onClick={() => q.status !== s && onUpdate({ status: s })}
//               className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
//                 q.status === s
//                   ? 'border-brand-500 bg-brand-500 text-black'
//                   : 'border-white/10 bg-white/5 text-white/70 hover:border-brand-500/40 hover:text-white'
//               }`}
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div>
//         <p className="mb-2 text-sm font-medium text-white/80">Private notes (sirf tumhe dikhenge)</p>
//         <textarea
//           rows={3}
//           className={`${inputClass} resize-none`}
//           placeholder="Kya baat hui, aage kya karna hai..."
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//         />
//         {notesChanged && (
//           <button
//             onClick={saveNotes}
//             disabled={savingNotes}
//             className="mt-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70"
//           >
//             {savingNotes ? 'Saving...' : 'Save notes'}
//           </button>
//         )}
//       </div>

//       <div className="border-t border-white/10 pt-4">
//         <button
//           onClick={onDelete}
//           className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-red-500/15 hover:text-red-500"
//         >
//           <Trash2 size={15} /> Delete message
//         </button>
//       </div>
//     </div>
//   )




import { useState } from 'react'
import { Mail, MessageCircle, Phone, Trash2 } from 'lucide-react'
import { inputClass } from '../ui/FormField'
import InfoRow from './InfoRow'
import StatusBadge from './StatusBadge'

const statuses = ['New', 'Replied', 'Closed']

const contactBtn =
  'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300'

export default function InquiryDetail({ inquiry: q, onUpdate, onDelete }) {
  const [notes, setNotes] = useState(q.notes || '')
  const [savingNotes, setSavingNotes] = useState(false)
  const notesChanged = notes !== (q.notes || '')
  const isCall = q.type === 'call'
  const typeLabels = { call: 'Free call request', estimate: 'Cost estimate', quiz: 'Online check' }

  // WhatsApp ke liye number: 10 digit ho to aage 91 laga do
  const digits = (q.phone || '').replace(/\D/g, '')
  const whatsapp = digits.length === 10 ? `91${digits}` : digits

  const saveNotes = async () => {
    setSavingNotes(true)
    await onUpdate({ notes })
    setSavingNotes(false)
  }

  const replyLink = q.email
    ? `mailto:${q.email}?subject=${encodeURIComponent('Re: Your message to Anstechno')}`
    : ''

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 text-xl font-bold text-black">
          {q.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h4 className="truncate text-xl font-bold">{q.name}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <StatusBadge value={q.status} />
            {/* {isCall && (
              <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold text-brand-300">
                Free call request
              </span>
            )} */}

            {typeLabels[q.type] && (
              <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold text-brand-300">
                {typeLabels[q.type]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contact buttons */}
      <div className="flex flex-wrap gap-2">
        {q.phone && (
          <>
            <a href={`tel:${q.phone}`} className={contactBtn}>
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
          </>
        )}
        {replyLink && (
          <a href={replyLink} className={contactBtn}>
            <Mail size={16} /> Reply by email
          </a>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {q.phone && <InfoRow label="Phone">{q.phone}</InfoRow>}
        {q.email && <InfoRow label="Email">{q.email}</InfoRow>}
        {q.preferredTime && <InfoRow label="Best time to call">{q.preferredTime}</InfoRow>}
        <InfoRow label="Received">
          {new Date(q.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </InfoRow>
        {q.service && <InfoRow label="Interested in">{q.service}</InfoRow>}
      </div>

      {/* {!isCall && (
        <InfoRow label="Message">
          <p className="whitespace-pre-wrap">{q.message}</p>
        </InfoRow>
      )} */}
      {q.type === 'message' && (
        <InfoRow label="Message">
          <p className="whitespace-pre-wrap">{q.message}</p>
        </InfoRow>
      )}


      {q.details && (
        <InfoRow label="Details">
          <p className="whitespace-pre-wrap">{q.details}</p>
        </InfoRow>
      )}

      {/* Status badlo */}
      <div>
        <p className="mb-2 text-sm font-medium text-white/80">Status</p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => q.status !== s && onUpdate({ status: s })}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                q.status === s
                  ? 'border-brand-500 bg-brand-500 text-black'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-brand-500/40 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-white/80">Private notes (sirf tumhe dikhenge)</p>
        <textarea
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Kya baat hui, aage kya karna hai..."
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
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </div>
  )
}