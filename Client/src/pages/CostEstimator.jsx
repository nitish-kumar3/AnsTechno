import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Code, Globe, Share2, ShoppingCart, Target, TrendingUp } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Container from '../components/ui/Container'
import OptionCard from '../components/tools/OptionCard'
import AnimatedNumber from '../components/tools/AnimatedNumber'
import ToolLeadForm from '../components/tools/ToolLeadForm'
import { useLanguage } from '../hooks/useLanguage'
import { addons, calculate, monthly, projects, rupees, sizes, speeds } from '../data/estimatorData'

const icons = {
  globe: Globe,
  cart: ShoppingCart,
  code: Code,
  bot: Bot,
  target: Target,
  share: Share2,
  trending: TrendingUp,
}

const copy = {
  en: {
    badge: 'Free Tool',
    title: 'Know your project cost',
    highlight: 'in 2 minutes',
    text: 'Pick what you need and get an instant price range. No signup needed to see the estimate.',
    s1: '1. What do you need?',
    s1sub: 'Select one or more',
    s2: '2. How big is it?',
    s2b: 'Extra features (optional)',
    s3: 'Monthly marketing (optional)',
    s4: 'How fast do you need it?',
    summary: 'Your estimate',
    empty: 'Select what you need to see your estimate.',
    oneTime: 'One-time project',
    monthly: 'Monthly',
    perMonth: '/month',
    note: 'This is an approximate range. The final price depends on your exact needs. We discuss and confirm before starting.',
    formTitle: 'Get this estimate with a free consultation',
    button: 'Send my estimate',
  },
  hi: {
    badge: 'फ्री टूल',
    title: 'जानिए अपने प्रोजेक्ट की लागत',
    highlight: 'सिर्फ 2 मिनट में',
    text: 'जो चाहिए वो चुनें और तुरंत अनुमानित कीमत देखें। अनुमान देखने के लिए कोई साइन-अप नहीं।',
    s1: '1. आपको क्या चाहिए?',
    s1sub: 'एक या ज़्यादा चुनें',
    s2: '2. प्रोजेक्ट कितना बड़ा है?',
    s2b: 'एक्स्ट्रा फीचर (ज़रूरी नहीं)',
    s3: 'महीने की मार्केटिंग (ज़रूरी नहीं)',
    s4: 'आपको कितनी जल्दी चाहिए?',
    summary: 'आपका अनुमान',
    empty: 'अनुमान देखने के लिए अपनी ज़रूरत चुनें।',
    oneTime: 'एक बार का खर्च',
    monthly: 'हर महीने',
    perMonth: '/महीना',
    note: 'यह लगभग का अनुमान है। असली कीमत आपकी ज़रूरत पर निर्भर करती है। काम शुरू करने से पहले हम बात करके तय करेंगे।',
    formTitle: 'मुफ़्त सलाह के साथ ये अनुमान पाएं',
    button: 'मेरा अनुमान भेजें',
  },
}

// Har section ka title
function Step({ title, sub, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-white/50">{sub}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function CostEstimator() {
  const { lang } = useLanguage()
  const c = copy[lang]

  const [sel, setSel] = useState({
    projectIds: [],
    monthlyIds: [],
    addonIds: [],
    sizeId: 'small',
    speedId: 'normal',
  })

  // Multi-select: jo chuna hai use hatao, nahi chuna to jodo
  const toggle = (key, id) =>
    setSel((s) => ({
      ...s,
      [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id],
    }))
  const pick = (key, id) => setSel((s) => ({ ...s, [key]: id }))

  const result = useMemo(() => calculate(sel), [sel])
  const hasProject = sel.projectIds.length > 0
  const hasAnything = hasProject || sel.monthlyIds.length > 0

  // Admin ko jaane wala summary (hamesha English me)
  const needs = [...result.pickedProjects, ...result.pickedMonthly].map((x) => x.name.en)
  const details = [
    'Cost estimate request',
    result.oneTime && `One-time: ${rupees(result.oneTime.min)} - ${rupees(result.oneTime.max)}`,
    result.monthly &&
      `Monthly: ${rupees(result.monthly.min)} - ${rupees(result.monthly.max)} per month`,
    `Needs: ${needs.join(', ')}`,
    hasProject && `Size: ${result.size.label.en}`,
    hasProject &&
      sel.addonIds.length > 0 &&
      `Extras: ${addons
        .filter((a) => sel.addonIds.includes(a.id))
        .map((a) => a.name.en)
        .join(', ')}`,
    hasProject && `Speed: ${result.speed.label.en}`,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <>
      <PageHeader
        badge={c.badge}
        title={c.title}
        highlight={c.highlight}
        text={c.text}
      />

      <section className="pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Left: chunne wale sections */}
            <div className="space-y-10 lg:col-span-2">
              <Step title={c.s1} sub={c.s1sub}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {projects.map((p) => (
                    <OptionCard
                      key={p.id}
                      icon={icons[p.icon]}
                      title={p.name[lang]}
                      text={p.desc[lang]}
                      selected={sel.projectIds.includes(p.id)}
                      onClick={() => toggle('projectIds', p.id)}
                    />
                  ))}
                </div>
              </Step>

              {hasProject && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  <Step title={c.s2}>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {sizes.map((s) => (
                        <OptionCard
                          key={s.id}
                          title={s.label[lang]}
                          selected={sel.sizeId === s.id}
                          onClick={() => pick('sizeId', s.id)}
                        />
                      ))}
                    </div>

                    <p className="mb-3 mt-6 text-sm font-medium text-white/70">{c.s2b}</p>
                    <div className="flex flex-wrap gap-2">
                      {addons.map((a) => {
                        const on = sel.addonIds.includes(a.id)
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => toggle('addonIds', a.id)}
                            aria-pressed={on}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              on
                                ? 'border-brand-500 bg-brand-500 text-black'
                                : 'border-white/10 bg-white/5 text-white/70 hover:border-brand-500/40'
                            }`}
                          >
                            {a.name[lang]}
                          </button>
                        )
                      })}
                    </div>
                  </Step>

                  <Step title={c.s4}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {speeds.map((s) => (
                        <OptionCard
                          key={s.id}
                          title={s.label[lang]}
                          selected={sel.speedId === s.id}
                          onClick={() => pick('speedId', s.id)}
                        />
                      ))}
                    </div>
                  </Step>
                </motion.div>
              )}

              <Step title={c.s3}>
                <div className="grid gap-3 sm:grid-cols-3">
                  {monthly.map((m) => (
                    <OptionCard
                      key={m.id}
                      icon={icons[m.icon]}
                      title={m.name[lang]}
                      text={m.desc[lang]}
                      selected={sel.monthlyIds.includes(m.id)}
                      onClick={() => toggle('monthlyIds', m.id)}
                    />
                  ))}
                </div>
              </Step>
            </div>

            {/* Right: live estimate */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="glow-border rounded-[2rem] p-[1.5px]">
                <div className="rounded-[1.9rem] bg-[#07100c] p-6 sm:p-7">
                  <h2 className="text-lg font-bold">{c.summary}</h2>

                  {!hasAnything ? (
                    <p className="mt-4 text-sm text-white/55">{c.empty}</p>
                  ) : (
                    <>
                      {result.oneTime && (
                        <div className="mt-5">
                          <p className="text-xs uppercase tracking-widest text-white/45">
                            {c.oneTime}
                          </p>
                          <p className="text-gradient mt-1 text-3xl font-bold">
                            <AnimatedNumber value={result.oneTime.min} format={rupees} />
                            {' – '}
                            <AnimatedNumber value={result.oneTime.max} format={rupees} />
                          </p>
                        </div>
                      )}

                      {result.monthly && (
                        <div className="mt-5">
                          <p className="text-xs uppercase tracking-widest text-white/45">
                            {c.monthly}
                          </p>
                          <p className="mt-1 text-2xl font-bold text-brand-300">
                            <AnimatedNumber value={result.monthly.min} format={rupees} />
                            {' – '}
                            <AnimatedNumber value={result.monthly.max} format={rupees} />
                            <span className="ml-1 text-sm font-medium text-white/50">
                              {c.perMonth}
                            </span>
                          </p>
                        </div>
                      )}

                      <ul className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-sm text-white/70">
                        {[...result.pickedProjects, ...result.pickedMonthly].map((x) => (
                          <li key={x.id}>• {x.name[lang]}</li>
                        ))}
                      </ul>

                      <p className="mt-4 text-xs leading-relaxed text-white/45">{c.note}</p>

                      <div className="mt-6 border-t border-white/10 pt-5">
                        <ToolLeadForm
                          type="estimate"
                          details={details}
                          service={needs.join(', ')}
                          title={c.formTitle}
                          button={c.button}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}