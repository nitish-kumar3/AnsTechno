import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Container from '../components/ui/Container'
import DataState from '../components/ui/DataState'
import TalentCard from '../components/talent/TalentCard'
import TalentModal from '../components/talent/TalentModal'
import { useTalent } from '../hooks/useContent'
import { useLanguage } from '../hooks/useLanguage'
import { useSeo } from '../hooks/useSeo'

const copy = {
  en: {
    badge: 'Hire Talent',
    title: 'Skilled people,',
    highlight: 'trained by Anstech',
    text: 'Meet learners who completed our internships and training. Each profile shows real skills, and a verified certificate where available. Tell us what you need and we will connect you.',
    search: 'Search by name or skill...',
    openOnly: 'Open to work',
    all: 'All skills',
    empty: 'Our first batch of talent will appear here soon.',
    join: 'Want to be part of it? Join our free internship.',
    joinBtn: 'See internships',
    noMatch: 'No one matched. Try another skill or search.',
    seoTitle: 'Hire trained talent',
  },
  hi: {
    badge: 'टैलेंट हायर करें',
    title: 'हुनरमंद लोग,',
    highlight: 'Anstech से प्रशिक्षित',
    text: 'उन सीखने वालों से मिलिए जिन्होंने हमारी इंटर्नशिप और ट्रेनिंग पूरी की है। हर प्रोफ़ाइल में असली स्किल और (जहां है) सत्यापित सर्टिफिकेट दिखता है। बताइए आपको क्या चाहिए, हम आपको जोड़ देंगे।',
    search: 'नाम या स्किल से खोजें...',
    openOnly: 'काम के लिए उपलब्ध',
    all: 'सभी स्किल',
    empty: 'हमारे पहले बैच के लोग जल्द ही यहां दिखेंगे।',
    join: 'आप भी इसका हिस्सा बनना चाहते हैं? हमारी मुफ़्त इंटर्नशिप से जुड़िए।',
    joinBtn: 'इंटर्नशिप देखें',
    noMatch: 'कोई नहीं मिला। दूसरी स्किल या खोज आज़माइए।',
    seoTitle: 'ट्रेंड टैलेंट हायर करें',
  },
}

export default function Talent() {
  const { lang } = useLanguage()
  const c = copy[lang]
  useSeo({ title: c.seoTitle, description: c.text })

  const { data, loading, error, reload } = useTalent()

  const [search, setSearch] = useState('')
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [skill, setSkill] = useState('')
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])

  const all = useMemo(() => data || [], [data])

  // Sabse zyada wali 10 skills
  const topSkills = useMemo(() => {
    const count = {}
    all.forEach((t) => (t.skills || []).forEach((s) => (count[s] = (count[s] || 0) + 1)))
    return Object.keys(count)
      .sort((a, b) => count[b] - count[a])
      .slice(0, 10)
  }, [all])

  const q = search.trim().toLowerCase()
  const list = all.filter(
    (t) =>
      (!onlyOpen || t.openToWork) &&
      (!skill || (t.skills || []).includes(skill)) &&
      (!q || `${t.name} ${t.headline} ${(t.skills || []).join(' ')}`.toLowerCase().includes(q))
  )

  const nothingYet = !loading && !error && all.length === 0

  return (
    <>
      <PageHeader badge={c.badge} title={c.title} highlight={c.highlight} text={c.text} />

      <section className="pb-24">
        <Container>
          {nothingYet ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-white/15 p-10 text-center">
              <p className="text-lg font-semibold">{c.empty}</p>
              <p className="mt-2 text-sm text-white/55">{c.join}</p>
              <Link
                to="/career"
                className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
              >
                {c.joinBtn}
              </Link>
            </div>
          ) : (
            <>
              {all.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full max-w-md">
                      <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                      />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={c.search}
                        aria-label={c.search}
                        className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base outline-none transition placeholder:text-white/30 focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/10 sm:text-sm"
                      />
                    </div>

                    <button
                      onClick={() => setOnlyOpen((v) => !v)}
                      aria-pressed={onlyOpen}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                        onlyOpen
                          ? 'border-brand-500 bg-brand-500 text-black'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-brand-500/40'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${onlyOpen ? 'bg-black' : 'bg-brand-500'}`} />
                      {c.openOnly}
                    </button>
                  </div>

                  {topSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {[c.all, ...topSkills].map((s, i) => {
                        const active = (i === 0 && !skill) || s === skill
                        return (
                          <button
                            key={s}
                            onClick={() => setSkill(i === 0 ? '' : s)}
                            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                              active
                                ? 'border-brand-500 bg-brand-500 text-black'
                                : 'border-white/10 bg-white/5 text-white/70 hover:border-brand-500/40'
                            }`}
                          >
                            {s}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-10">
                <DataState
                  loading={loading}
                  error={error}
                  onRetry={reload}
                  count={4}
                  cols="sm:grid-cols-2 lg:grid-cols-4"
                  isEmpty={list.length === 0}
                  emptyText={c.noMatch}
                >
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {list.map((t, i) => (
                      <TalentCard key={t._id} talent={t} index={i} onOpen={setSelected} />
                    ))}
                  </div>
                </DataState>
              </div>
            </>
          )}
        </Container>
      </section>

      <AnimatePresence>
        {selected && <TalentModal key={selected._id} talent={selected} onClose={close} />}
      </AnimatePresence>
    </>
  )
}