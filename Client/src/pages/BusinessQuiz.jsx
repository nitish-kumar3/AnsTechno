import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Container from '../components/ui/Container'
import AnimatedNumber from '../components/tools/AnimatedNumber'
import ToolLeadForm from '../components/tools/ToolLeadForm'
import { useLanguage } from '../hooks/useLanguage'
import { getLevel, questions } from '../data/quizData'

const copy = {
  en: {
    badge: 'Free Tool',
    title: 'Is your business',
    highlight: 'online?',
    text: 'Answer 7 quick questions and get your digital score with a simple action plan.',
    start: 'Start the check',
    meta: '6 questions · about 2 minutes',
    qOf: 'Question {n} of {total}',
    back: 'Back',
    yourScore: 'Your digital score',
    gaps: 'What to fix first',
    allGood: 'Great, no major gaps found!',
    getHelp: 'Get help with this',
    formTitle: 'Want this plan explained for free?',
    button: 'Send me my action plan',
    retake: 'Take the check again',
  },
  hi: {
    badge: 'फ्री टूल',
    title: 'क्या आपका बिज़नेस',
    highlight: 'ऑनलाइन है?',
    text: 'कुछ आसान सवालों के जवाब दें और पाएं अपना डिजिटल स्कोर और सीधा एक्शन प्लान।',
    start: 'चेक शुरू करें',
    meta: '6 सवाल · लगभग 2 मिनट',
    qOf: 'सवाल {n} / {total}',
    back: 'पीछे',
    yourScore: 'आपका डिजिटल स्कोर',
    gaps: 'सबसे पहले क्या ठीक करें',
    allGood: 'बढ़िया, कोई बड़ी कमी नहीं मिली!',
    getHelp: 'इसमें मदद पाएं',
    formTitle: 'चाहते हैं कि ये प्लान आपको मुफ़्त में समझाया जाए?',
    button: 'मुझे मेरा एक्शन प्लान भेजें',
    retake: 'चेक दोबारा करें',
  },
}

const RING = 2 * Math.PI * 54

export default function BusinessQuiz() {
  const { lang } = useLanguage()
  const c = copy[lang]

  const [stage, setStage] = useState('intro') // intro, quiz, result
  const [index, setIndex] = useState(0)
  const [choices, setChoices] = useState([]) // har sawal me kaunsa option chuna

  const total = questions.length
  const q = questions[index]

  const answer = (optionIndex) => {
    const next = [...choices]
    next[index] = optionIndex
    setChoices(next)

    if (index === total - 1) setStage('result')
    else setIndex(index + 1)
  }

  const restart = () => {
    setChoices([])
    setIndex(0)
    setStage('intro')
  }

  // Result ka hisaab
  const points = questions.map((item, i) => item.options[choices[i]]?.points ?? 0)
  const percent = Math.round((points.reduce((a, b) => a + b, 0) / (total * 2)) * 100)
  const level = getLevel(percent)
  const gaps = questions
    .map((item, i) => ({ item, points: points[i] }))
    .filter((g) => g.points < 2)
    .sort((a, b) => a.points - b.points)
    .slice(0, 3)

  // Admin ko jaane wala summary (hamesha English me)
  const details = [
    `Online presence score: ${percent}% (${level.name.en})`,
    'Answers:',
    ...questions.map((item, i) => `- ${item.short}: ${item.options[choices[i]]?.en || '-'}`),
    gaps.length ? `Top gaps: ${gaps.map((g) => g.item.short).join(', ')}` : 'No major gaps',
  ].join('\n')

  return (
    <>
      <PageHeader badge={c.badge} title={c.title} highlight={c.highlight} text={c.text} />

      <section className="pb-24">
        <Container className="max-w-3xl">
          <AnimatePresence mode="wait">
            {/* Shuruaat */}
            {stage === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12"
              >
                <p className="text-white/60">{c.meta}</p>
                <button
                  onClick={() => setStage('quiz')}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-brand-300"
                >
                  {c.start} <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Sawal */}
            {stage === 'quiz' && (
              <motion.div
                key={`q-${index}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10"
              >
                <div className="flex items-center justify-between text-sm text-white/55">
                  <span>{c.qOf.replace('{n}', index + 1).replace('{total}', total)}</span>
                  <span>{Math.round((index / total) * 100)}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-brand-500"
                    initial={false}
                    animate={{ width: `${((index + 1) / total) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <h2 className="mt-8 text-2xl font-bold sm:text-3xl">{q.q[lang]}</h2>

                <div className="mt-6 space-y-3">
                  {q.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => answer(i)}
                      className={`w-full rounded-2xl border px-5 py-4 text-left font-medium transition-colors ${
                        choices[index] === i
                          ? 'border-brand-500 bg-brand-500/10'
                          : 'border-white/10 bg-white/[0.03] hover:border-brand-500/40'
                      }`}
                    >
                      {opt[lang]}
                    </motion.button>
                  ))}
                </div>

                {index > 0 && (
                  <button
                    onClick={() => setIndex(index - 1)}
                    className="mt-6 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-brand-300"
                  >
                    <ArrowLeft size={16} /> {c.back}
                  </button>
                )}
              </motion.div>
            )}

            {/* Result */}
            {stage === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
                  <p className="text-sm uppercase tracking-widest text-white/45">{c.yourScore}</p>

                  <div className="relative mx-auto mt-6 h-44 w-44">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="54" fill="none" strokeWidth="9" className="stroke-white/10" />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        strokeWidth="9"
                        strokeLinecap="round"
                        className={level.ring}
                        strokeDasharray={RING}
                        initial={{ strokeDashoffset: RING }}
                        animate={{ strokeDashoffset: RING * (1 - percent / 100) }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center">
                      <p className="text-5xl font-bold">
                        <AnimatedNumber value={percent} />
                        <span className="text-2xl text-white/50">%</span>
                      </p>
                    </div>
                  </div>

                  <h2 className={`mt-6 text-2xl font-bold ${level.text}`}>{level.name[lang]}</h2>
                  <p className="mx-auto mt-2 max-w-md text-white/65">{level.msg[lang]}</p>
                </div>

                {/* Sabse pehle kya theek karein */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <h3 className="text-xl font-bold">{c.gaps}</h3>

                  {gaps.length === 0 ? (
                    <p className="mt-3 text-white/60">{c.allGood}</p>
                  ) : (
                    <ul className="mt-5 space-y-4">
                      {gaps.map((g, i) => (
                        <motion.li
                          key={g.item.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.12 }}
                          className="flex items-start gap-4 rounded-2xl border border-white/10 p-4"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 font-bold text-black">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">{g.item.fix[lang]}</p>
                            <p className="mt-1 text-sm text-white/55">{g.item.tip[lang]}</p>
                            <Link
                              to={`/lets-connect?service=${g.item.slug}`}
                              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-300 hover:gap-2"
                            >
                              {c.getHelp} <ArrowRight size={14} />
                            </Link>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Lead form */}
                <div className="glow-border rounded-[2rem] p-[1.5px]">
                  <div className="rounded-[1.9rem] bg-[#07100c] p-6 sm:p-8">
                    <ToolLeadForm
                      type="quiz"
                      details={details}
                      title={c.formTitle}
                      button={c.button}
                    />
                  </div>
                </div>

                <button
                  onClick={restart}
                  className="mx-auto flex items-center gap-2 text-sm text-white/55 transition hover:text-brand-300"
                >
                  <RotateCcw size={15} /> {c.retake}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </section>
    </>
  )
}