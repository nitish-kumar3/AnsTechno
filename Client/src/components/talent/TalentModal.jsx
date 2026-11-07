import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Code, Globe, Link2, MapPin } from 'lucide-react'
import AdminModal from '../admin/AdminModal'
import ToolLeadForm from '../tools/ToolLeadForm'
import { useLanguage } from '../../hooks/useLanguage'
import Avatar from './Avatar'

const copy = {
  en: {
    open: 'Open to work',
    about: 'About',
    skills: 'Skills',
    verified: 'Verified certificate',
    verifyLink: 'Check certificate',
    hire: 'Hire or ask about',
    formTitle: 'Tell us what you need and we will connect you with {name}.',
    button: 'Send request',
    note: 'We never share personal contact details. All requests come to Anstech first.',
  },
  hi: {
    open: 'काम के लिए उपलब्ध',
    about: 'परिचय',
    skills: 'स्किल',
    verified: 'सत्यापित सर्टिफिकेट',
    verifyLink: 'सर्टिफिकेट जांचें',
    hire: 'हायर करें या पूछें:',
    formTitle: 'बताइए आपको क्या चाहिए, हम आपको {name} से जोड़ देंगे।',
    button: 'अनुरोध भेजें',
    note: 'हम किसी का निजी संपर्क साझा नहीं करते। हर अनुरोध पहले Anstech के पास आता है।',
  },
}

// Sirf http/https wale link chalenge
const safe = (url) => (/^https?:\/\//i.test(url || '') ? url : '')

export default function TalentModal({ talent, onClose }) {
  const { lang } = useLanguage()
  const c = copy[lang]
  const [hiring, setHiring] = useState(false)

  const links = [
    { label: 'Portfolio', icon: Globe, url: safe(talent.portfolioUrl) },
    { label: 'GitHub', icon: Code, url: safe(talent.githubUrl) },
    { label: 'LinkedIn', icon: Link2, url: safe(talent.linkedinUrl) },
  ].filter((l) => l.url)

  // Admin ko jaane wala summary (hamesha English me)
  const details = [
    `Hire request for: ${talent.name}${talent.headline ? ` (${talent.headline})` : ''}`,
    talent.skills?.length ? `Skills: ${talent.skills.join(', ')}` : '',
    talent.certId ? `Certificate ID: ${talent.certId}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <AdminModal title={talent.name} size="max-w-2xl" onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar talent={talent} className="h-20 w-20 shrink-0 rounded-2xl text-3xl" />
          <div className="min-w-0">
            {talent.headline && <p className="font-medium text-brand-300">{talent.headline}</p>}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/55">
              {talent.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} /> {talent.location}
                </span>
              )}
              {talent.batch && <span>{talent.batch}</span>}
              {talent.openToWork && (
                <span className="inline-flex items-center gap-1.5 text-brand-300">
                  <span className="h-2 w-2 rounded-full bg-brand-500" /> {c.open}
                </span>
              )}
            </div>
          </div>
        </div>

        {talent.verified && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/[0.06] px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <BadgeCheck size={20} className="text-brand-400" /> {c.verified}
              <span className="font-normal text-white/50">{talent.certId}</span>
            </span>
            <Link
              to={`/verify/${talent.certId}`}
              onClick={onClose}
              className="text-sm font-medium text-brand-300 underline underline-offset-2"
            >
              {c.verifyLink}
            </Link>
          </div>
        )}

        {talent.bio && (
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50">{c.about}</h4>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-white/75">{talent.bio}</p>
          </div>
        )}

        {talent.skills?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50">{c.skills}</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {talent.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300"
              >
                <l.icon size={15} /> {l.label}
              </a>
            ))}
          </div>
        )}

        {/* Hire */}
        <div className="border-t border-white/10 pt-5">
          {hiring ? (
            <>
              <ToolLeadForm
                type="hire"
                details={details}
                title={c.formTitle.replace('{name}', talent.name)}
                button={c.button}
              />
              <p className="mt-3 text-xs text-white/45">{c.note}</p>
            </>
          ) : (
            <button
              onClick={() => setHiring(true)}
              className="w-full rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-brand-300"
            >
              {c.hire} {talent.name}
            </button>
          )}
        </div>
      </div>
    </AdminModal>
  )
}