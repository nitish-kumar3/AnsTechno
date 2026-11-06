import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Check, Search, X } from 'lucide-react'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import Container from '../components/ui/Container'
import InfoRow from '../components/admin/InfoRow'
import { useLanguage } from '../hooks/useLanguage'

const copy = {
  en: {
    badge: 'Verification',
    title: 'Verify a',
    highlight: 'certificate',
    text: 'Enter the certificate ID printed on the certificate, or scan its QR code, to confirm that it is genuine.',
    label: 'Certificate ID',
    button: 'Verify',
    checking: 'Checking...',
    okTitle: 'Verified: this certificate is genuine',
    issuedBy: 'Issued by Anstechno',
    revokedTitle: 'This certificate is no longer valid',
    revokedText: 'It was issued earlier but has been withdrawn. Please contact Anstechno for details.',
    nfTitle: 'Certificate not found',
    nfText: 'We could not find a certificate with this ID. Please check the ID and try again.',
    errTitle: 'Could not check right now',
    errText: 'Please try again in a moment.',
    name: 'Awarded to',
    program: 'Program',
    type: 'Type',
    period: 'Duration',
    issued: 'Issued on',
    id: 'Certificate ID',
    grade: 'Grade / remarks',
    types: { Internship: 'Internship', Training: 'Training', Course: 'Course' },
  },
  hi: {
    badge: 'जांच',
    title: 'सर्टिफिकेट की',
    highlight: 'जांच करें',
    text: 'सर्टिफिकेट पर छपी ID डालें, या उसका QR कोड स्कैन करें, और पक्का करें कि वह असली है।',
    label: 'सर्टिफिकेट ID',
    button: 'जांचें',
    checking: 'जांच रहे हैं...',
    okTitle: 'सत्यापित: यह सर्टिफिकेट असली है',
    issuedBy: 'जारीकर्ता: Anstechno',
    revokedTitle: 'यह सर्टिफिकेट अब मान्य नहीं है',
    revokedText: 'यह पहले जारी हुआ था, पर अब वापस ले लिया गया है। जानकारी के लिए Anstechno से संपर्क करें।',
    nfTitle: 'सर्टिफिकेट नहीं मिला',
    nfText: 'इस ID का कोई सर्टिफिकेट नहीं मिला। कृपया ID जांचकर दोबारा कोशिश करें।',
    errTitle: 'अभी जांच नहीं हो पाई',
    errText: 'कृपया थोड़ी देर बाद दोबारा कोशिश करें।',
    name: 'प्रदान किया गया',
    program: 'प्रोग्राम',
    type: 'प्रकार',
    period: 'अवधि',
    issued: 'जारी होने की तारीख',
    id: 'सर्टिफिकेट ID',
    grade: 'ग्रेड / टिप्पणी',
    types: { Internship: 'इंटर्नशिप', Training: 'ट्रेनिंग', Course: 'कोर्स' },
  },
}

export default function VerifyCertificate() {
  const { certId } = useParams()
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const c = copy[lang]

  const [input, setInput] = useState(certId || '')
  const [state, setState] = useState({ status: 'idle', cert: null }) // idle, loading, found, notfound, error

  // Address me ID ho (QR se aaya) to turant jaanch
  useEffect(() => {
    if (!certId) {
      setState({ status: 'idle', cert: null })
      return
    }

    let ignore = false
    setInput(certId)
    setState({ status: 'loading', cert: null })

    api
      .get(`/certificates/verify/${encodeURIComponent(certId)}`)
      .then(({ data }) => {
        if (!ignore) setState({ status: 'found', cert: data.certificate })
      })
      .catch((err) => {
        if (!ignore) {
          setState({ status: err.response?.status === 404 ? 'notfound' : 'error', cert: null })
        }
      })

    return () => {
      ignore = true
    }
  }, [certId])

  const submit = (e) => {
    e.preventDefault()
    const id = input.trim().toUpperCase()
    if (id) navigate(`/verify/${encodeURIComponent(id)}`)
  }

  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN'
  const fmt = (d) =>
    new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })

  const { status, cert } = state
  const revoked = cert?.status === 'revoked'

  return (
    <>
      <PageHeader badge={c.badge} title={c.title} highlight={c.highlight} text={c.text} />

      <section className="pb-24">
        <Container className="max-w-2xl">
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label={c.label}
                placeholder="ANS-2026-XXXXXX"
                className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-base uppercase outline-none transition placeholder:normal-case placeholder:text-white/30 focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70"
            >
              {status === 'loading' ? c.checking : c.button}
            </button>
          </form>

          {/* Natija */}
          {status === 'found' && cert && (
            <motion.div
              key={cert.certId}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 overflow-hidden rounded-3xl border p-6 sm:p-8 ${
                revoked
                  ? 'border-amber-500/40 bg-amber-500/[0.06]'
                  : 'border-brand-500/40 bg-brand-500/[0.06]'
              }`}
            >
              <div className="flex items-center gap-4">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                  className={`grid h-16 w-16 shrink-0 place-items-center rounded-full text-black ${
                    revoked ? 'bg-amber-400' : 'bg-brand-500 shadow-[0_0_50px_-5px_rgba(25,195,154,0.7)]'
                  }`}
                >
                  {revoked ? <AlertTriangle size={30} /> : <Check size={34} strokeWidth={3} />}
                </motion.span>
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    {revoked ? c.revokedTitle : c.okTitle}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    {revoked ? c.revokedText : c.issuedBy}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoRow label={c.name}>
                  <span className="text-base font-semibold">{cert.name}</span>
                </InfoRow>
                <InfoRow label={c.program}>{cert.program}</InfoRow>
                <InfoRow label={c.type}>{c.types[cert.type] || cert.type}</InfoRow>
                <InfoRow label={c.issued}>{fmt(cert.issueDate)}</InfoRow>
                {cert.startDate && cert.endDate && (
                  <InfoRow label={c.period}>
                    {fmt(cert.startDate)} – {fmt(cert.endDate)}
                  </InfoRow>
                )}
                {cert.grade && <InfoRow label={c.grade}>{cert.grade}</InfoRow>}
                <InfoRow label={c.id}>{cert.certId}</InfoRow>
              </div>
            </motion.div>
          )}

          {(status === 'notfound' || status === 'error') && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center gap-4 rounded-3xl border border-red-500/30 bg-red-500/[0.06] p-6"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-red-500 text-white">
                <X size={28} />
              </span>
              <div>
                <h2 className="text-lg font-bold">
                  {status === 'notfound' ? c.nfTitle : c.errTitle}
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  {status === 'notfound' ? c.nfText : c.errText}
                </p>
              </div>
            </motion.div>
          )}
        </Container>
      </section>
    </>
  )
}