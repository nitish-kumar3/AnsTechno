import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, MessageCircle, QrCode, Receipt, Tag } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Container from '../components/ui/Container'
import WhatsAppLinkTool from '../components/freetools/WhatsAppLinkTool'
import QrTool from '../components/freetools/QrTool'
import BillTool from '../components/freetools/BillTool'
import PosterTool from '../components/freetools/PosterTool'
import { useLanguage } from '../hooks/useLanguage'
import { useSeo } from '../hooks/useSeo'

const tools = [
  {
    id: 'whatsapp',
    icon: MessageCircle,
    Tool: WhatsAppLinkTool,
    title: { en: 'WhatsApp Link Maker', hi: 'WhatsApp लिंक बनाएं' },
    desc: {
      en: 'Make a link and QR that opens your WhatsApp chat',
      hi: 'ऐसा लिंक और QR बनाएं जो आपकी WhatsApp चैट खोले',
    },
  },
  {
    id: 'qr',
    icon: QrCode,
    Tool: QrTool,
    title: { en: 'QR Code Maker', hi: 'QR कोड बनाएं' },
    desc: {
      en: 'UPI payment, website or any text, in your colour',
      hi: 'UPI पेमेंट, वेबसाइट या कोई भी टेक्स्ट, अपने रंग में',
    },
  },
  {
    id: 'bill',
    icon: Receipt,
    Tool: BillTool,
    title: { en: 'Bill Maker', hi: 'बिल बनाएं' },
    desc: {
      en: 'Make a simple bill, then print or share it',
      hi: 'आसान बिल बनाएं, फिर प्रिंट करें या भेजें',
    },
  },
  {
    id: 'poster',
    icon: Tag,
    Tool: PosterTool,
    title: { en: 'Offer Poster Maker', hi: 'ऑफर पोस्टर बनाएं' },
    desc: {
      en: 'Festival or sale poster for WhatsApp status',
      hi: 'WhatsApp स्टेटस के लिए त्योहार या सेल का पोस्टर',
    },
  },
]

const copy = {
  en: {
    badge: 'Free Tools',
    title: 'Free tools for',
    highlight: 'every shopkeeper',
    text: 'Make a WhatsApp link, QR code, bill or offer poster in seconds. Free, no signup, and everything works in your browser. Nothing is uploaded.',
    ctaTitle: 'Want your whole shop online?',
    ctaText: 'Get a shop page with your products, prices and WhatsApp ordering.',
    ctaBtn: 'See Digital Dukaan',
  },
  hi: {
    badge: 'फ्री टूल',
    title: 'हर दुकानदार के लिए',
    highlight: 'फ्री टूल',
    text: 'WhatsApp लिंक, QR कोड, बिल या ऑफर पोस्टर, चंद सेकंड में बनाइए। मुफ़्त, बिना साइन-अप, और सब कुछ आपके ब्राउज़र में चलता है। कुछ भी अपलोड नहीं होता।',
    ctaTitle: 'पूरी दुकान ऑनलाइन करना चाहते हैं?',
    ctaText: 'अपने सामान, दाम और WhatsApp ऑर्डर के साथ शॉप पेज पाइए।',
    ctaBtn: 'डिजिटल दुकान देखें',
  },
}

export default function FreeTools() {
  const { tool } = useParams()
  const { lang } = useLanguage()
  const c = copy[lang]

  const current = tools.find((t) => t.id === (tool || 'whatsapp'))

  useSeo({
    title: current ? current.title[lang] : c.badge,
    description: current ? current.desc[lang] : c.text,
  })

  // Galat tool ka naam ho to main page par bhej do
  if (!current) return <Navigate to="/free-tools" replace />

  return (
    <>
      <PageHeader badge={c.badge} title={c.title} highlight={c.highlight} text={c.text} />

      <section className="pb-24">
        <Container>
          {/* Tool chunne wale 4 card */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {tools.map((t) => {
              const active = t.id === current.id
              return (
                <Link
                  key={t.id}
                  to={`/free-tools/${t.id}`}
                  className={`rounded-2xl border p-4 transition-colors ${
                    active
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-brand-500/40'
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                      active ? 'bg-brand-500 text-black' : 'bg-brand-500/15 text-brand-400'
                    }`}
                  >
                    <t.icon size={20} />
                  </span>
                  <p className="mt-3 text-sm font-semibold sm:text-base">{t.title[lang]}</p>
                  <p className="mt-1 hidden text-xs leading-snug text-white/55 sm:block">{t.desc[lang]}</p>
                </Link>
              )
            })}
          </div>

          {/* Chuna hua tool */}
          <div className="mt-10">
            <current.Tool />
          </div>

          {/* Digital Dukaan ka button */}
          <div className="mt-16 flex flex-col items-center justify-between gap-5 rounded-3xl border border-brand-500/20 bg-linear-to-br from-brand-500/15 via-white/[0.03] to-transparent p-7 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">{c.ctaTitle}</h2>
              <p className="mt-1 text-sm text-white/60">{c.ctaText}</p>
            </div>
            <Link
              to="/digital-dukaan"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
            >
              {c.ctaBtn} <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}