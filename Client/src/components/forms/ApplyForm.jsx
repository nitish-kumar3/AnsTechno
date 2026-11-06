// import { useState } from 'react'
// import { ArrowLeft, Send, Upload, X } from 'lucide-react'
// import FormField, { inputClass } from '../ui/FormField'

// const statuses = [
//   'School student',
//   'College student',
//   'Fresher (graduate)',
//   'Working professional',
//   'Other',
// ]
// const MAX_SIZE = 5 * 1024 * 1024
// const allowed = ['pdf', 'doc', 'docx']

// export default function ApplyForm({ opening, onBack, onSuccess }) {
//   const needsResume = opening.type === 'Job'
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     status: '',
//     message: '',
//   })
//   const [file, setFile] = useState(null)
//   const [errors, setErrors] = useState({})
//   const [loading, setLoading] = useState(false)

//   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

//   const pickFile = (e) => {
//     const f = e.target.files[0]
//     if (!f) return
//     const ext = f.name.split('.').pop().toLowerCase()
//     if (!allowed.includes(ext)) {
//       setErrors((x) => ({ ...x, file: 'Only PDF, DOC or DOCX allowed' }))
//       return
//     }
//     if (f.size > MAX_SIZE) {
//       setErrors((x) => ({ ...x, file: 'File must be under 5MB' }))
//       return
//     }
//     setErrors((x) => ({ ...x, file: '' }))
//     setFile(f)
//   }

//   const submit = async (e) => {
//     e.preventDefault()
//     const err = {}
//     if (!form.name.trim()) err.name = 'Please enter your name'
//     if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email'
//     if (form.phone.replace(/\D/g, '').length < 10)
//       err.phone = 'Enter a valid phone number'
//     if (!form.status) err.status = 'Please select one'
//     if (needsResume && !file) err.file = 'Please upload your resume'
//     setErrors(err)
//     if (Object.keys(err).length) return

//     setLoading(true)
//     const data = new FormData()
//     Object.entries(form).forEach(([k, v]) => data.append(k, v))
//     data.append('openingId', opening.id)
//     data.append('openingTitle', opening.title)
//     data.append('openingType', opening.type)
//     if (file) data.append('resume', file)

//     // TODO (backend ke baad): await api.post('/applications', data)
//     console.log('Application:', Object.fromEntries(data))
//     await new Promise((r) => setTimeout(r, 1200))

//     setLoading(false)
//     onSuccess(form.email)
//   }

//   return (
//     <form onSubmit={submit} noValidate>
//       <h4 className="text-lg font-semibold">Apply for {opening.title}</h4>
//       <p className="mt-1 text-sm text-white/55">
//         Fill in your details and we will get back to you soon.
//       </p>

//       <div className="mt-6 grid gap-4 sm:grid-cols-2">
//         <FormField label="Full name" error={errors.name}>
//           <input
//             className={inputClass}
//             placeholder="Your name"
//             value={form.name}
//             onChange={set('name')}
//           />
//         </FormField>
//         <FormField label="Email" error={errors.email}>
//           <input
//             type="email"
//             className={inputClass}
//             placeholder="you@example.com"
//             value={form.email}
//             onChange={set('email')}
//           />
//         </FormField>
//         <FormField label="Phone number" error={errors.phone}>
//           <input
//             type="tel"
//             className={inputClass}
//             placeholder="98765 43210"
//             value={form.phone}
//             onChange={set('phone')}
//           />
//         </FormField>
//         <FormField label="Current status" error={errors.status}>
//           <select
//             className={inputClass}
//             value={form.status}
//             onChange={set('status')}
//           >
//             <option value="" className="bg-ink">
//               Select
//             </option>
//             {statuses.map((s) => (
//               <option key={s} value={s} className="bg-ink">
//                 {s}
//               </option>
//             ))}
//           </select>
//         </FormField>
//       </div>

//       <div className="mt-4">
//         <FormField
//           label="Resume (PDF / DOC, max 5MB)"
//           optional={!needsResume}
//           error={errors.file}
//         >
//           {file ? (
//             <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm">
//               <span className="truncate text-brand-300">{file.name}</span>
//               <button
//                 type="button"
//                 onClick={() => setFile(null)}
//                 aria-label="Remove file"
//                 className="shrink-0 rounded-full p-1 text-white/70 hover:bg-white/10"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ) : (
//             <div className="relative flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-5 text-sm text-white/60 transition hover:border-brand-500/50 hover:text-white">
//               <Upload size={18} />
//               Click to upload your resume
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 onChange={pickFile}
//                 className="absolute inset-0 cursor-pointer opacity-0"
//               />
//             </div>
//           )}
//         </FormField>
//       </div>

//       <div className="mt-4">
//         <FormField label="Why do you want to join?" optional>
//           <textarea
//             rows={3}
//             className={`${inputClass} resize-none`}
//             placeholder="Tell us a little about yourself"
//             value={form.message}
//             onChange={set('message')}
//           />
//         </FormField>
//       </div>

//       <div className="mt-6 flex flex-wrap gap-3">
//         {onBack && (
//           <button
//             type="button"
//             onClick={onBack}
//             className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
//           >
//             <ArrowLeft size={16} /> Back
//           </button>
//         )}
//         <button
//           type="submit"
//           disabled={loading}
//           className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70 sm:flex-none"
//         >
//           {loading ? (
//             <>
//               <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
//               Sending...
//             </>
//           ) : (
//             <>
//               Submit Application <Send size={16} />
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   )
// }




import { useState } from 'react'
import { ArrowLeft, Send, Upload, X } from 'lucide-react'
import api from '../../services/api'
import FormField, { inputClass } from '../ui/FormField'

const statuses = [
  'School student',
  'College student',
  'Fresher (graduate)',
  'Working professional',
  'Other',
]
const MAX_SIZE = 5 * 1024 * 1024
const allowed = ['pdf', 'doc', 'docx']

export default function ApplyForm({ opening, onBack, onSuccess }) {
  const needsResume = opening.type === 'Job'
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    message: '',
  })
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const pickFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!allowed.includes(ext)) {
      setErrors((x) => ({ ...x, file: 'Only PDF, DOC or DOCX allowed' }))
      return
    }
    if (f.size > MAX_SIZE) {
      setErrors((x) => ({ ...x, file: 'File must be under 5MB' }))
      return
    }
    setErrors((x) => ({ ...x, file: '' }))
    setFile(f)
  }

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = 'Please enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email'
    if (form.phone.replace(/\D/g, '').length < 10)
      err.phone = 'Enter a valid phone number'
    if (!form.status) err.status = 'Please select one'
    if (needsResume && !file) err.file = 'Please upload your resume'
    setErrors(err)
    if (Object.keys(err).length) return

    setLoading(true)
    setServerError('')

    // Form ka data (resume ke saath) backend ko bhejo
    const data = new FormData()
    data.append('name', form.name.trim())
    data.append('email', form.email.trim())
    data.append('phone', form.phone.trim())
    data.append('status', form.status)
    data.append('message', form.message.trim())
    data.append('openingId', opening.id)
    if (file) data.append('resume', file)

    try {
      await api.post('/applications', data)
      onSuccess(form.email)
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Cannot reach the server. Please try again in a moment.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <h4 className="text-lg font-semibold">Apply for {opening.title}</h4>
      <p className="mt-1 text-sm text-white/55">
        Fill in your details and we will get back to you soon.
      </p>

      {serverError && (
        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {serverError}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" error={errors.name}>
          <input
            className={inputClass}
            placeholder="Your name"
            value={form.name}
            onChange={set('name')}
          />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input
            type="email"
            className={inputClass}
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
          />
        </FormField>
        <FormField label="Phone number" error={errors.phone}>
          <input
            type="tel"
            className={inputClass}
            placeholder="98765 43210"
            value={form.phone}
            onChange={set('phone')}
          />
        </FormField>
        <FormField label="Current status" error={errors.status}>
          <select
            className={inputClass}
            value={form.status}
            onChange={set('status')}
          >
            <option value="" className="bg-ink">
              Select
            </option>
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-ink">
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="mt-4">
        <FormField
          label="Resume (PDF / DOC, max 5MB)"
          optional={!needsResume}
          error={errors.file}
        >
          {file ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm">
              <span className="truncate text-brand-300">{file.name}</span>
              <button
                type="button"
                onClick={() => setFile(null)}
                aria-label="Remove file"
                className="shrink-0 rounded-full p-1 text-white/70 hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="relative flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-5 text-sm text-white/60 transition hover:border-brand-500/50 hover:text-white">
              <Upload size={18} />
              Click to upload your resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={pickFile}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </FormField>
      </div>

      <div className="mt-4">
        <FormField label="Why do you want to join?" optional>
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Tell us a little about yourself"
            value={form.message}
            onChange={set('message')}
          />
        </FormField>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70 sm:flex-none"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
              Sending...
            </>
          ) : (
            <>
              Submit Application <Send size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  )
}