import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, MapPin, MessageCircle, QrCode, Store } from 'lucide-react'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import DukaanLeadForm from '../components/dukaan/DukaanLeadForm'
import { useLanguage } from '../hooks/useLanguage'
import { useSeo } from '../hooks/useSeo'
import assetUrl from '../utils/assetUrl'

const copy = {
  en: {
    badge: 'Digital Dukaan',
    title: 'Take your shop online,',
    highlight: 'without a website',
    text: 'A simple shop page with your products and prices, WhatsApp ordering, and a QR poster for your shop door. No app and no technical knowledge needed.',
    stepsTitle: 'How it works',
    steps: [
      {
        icon: Camera,
        title: 'You share your items',
        text: 'Send us photos and prices of your products on WhatsApp.',
      },
      {
        icon: Store,
        title: 'We build your shop page',
        text: 'Your own page with your name, photos, timings and all your items.',
      },
      {
        icon: QrCode,
        title: 'Customers scan and order',
        text: 'Put the QR poster at your shop. Orders come straight to your WhatsApp.',
      },
    ],
    liveTitle: 'Shops already online',
    liveHighlight: 'with Digital Dukaan',
    items: '{n} items',
    formTitle: 'Get your own shop page',
    formText: 'Share a few details and we will call you to set it up.',
    seoTitle: 'Digital Dukaan',
  },
  hi: {
    badge: 'डिजिटल दुकान',
    title: 'अपनी दुकान को ऑनलाइन करें,',
    highlight: 'बिना वेबसाइट के',
    text: 'आपके सामान और दाम के साथ एक आसान शॉप पेज, WhatsApp पर ऑर्डर, और दुकान के दरवाज़े के लिए QR पोस्टर। न कोई ऐप, न कोई तकनीकी जानकारी चाहिए।',
    stepsTitle: 'ये कैसे काम करता है',
    steps: [
      {
        icon: Camera,
        title: 'आप अपना सामान भेजिए',
        text: 'अपने सामान की फोटो और दाम हमें WhatsApp पर भेज दीजिए।',
      },
      {
        icon: Store,
        title: 'हम आपका शॉप पेज बनाते हैं',
        text: 'आपका अपना पेज: आपका नाम, फोटो, समय और सारा सामान।',
      },
      {
        icon: QrCode,
        title: 'ग्राहक स्कैन करके ऑर्डर करते हैं',
        text: 'QR पोस्टर दुकान पर लगाइए। ऑर्डर सीधे आपके WhatsApp पर आते हैं।',
      },
    ],
    liveTitle: 'जो दुकानें ऑनलाइन हो चुकी हैं',
    liveHighlight: 'डिजिटल दुकान के साथ',
    items: '{n} सामान',
    formTitle: 'अपना शॉप पेज बनवाएं',
    formText: 'कुछ जानकारी दीजिए, हम आपको कॉल करके सेट कर देंगे।',
    seoTitle: 'डिजिटल दुकान',
  },
}

export default function DigitalDukaan() {
  const { lang } = useLanguage()
  const c = copy[lang]
  useSeo({ title: c.seoTitle, description: c.text })

  const [shops, setShops] = useState([])

  useEffect(() => {
    api
      .get('/shops')
      .then(({ data }) => setShops(data.shops))
      .catch(() => {})
  }, [])

  return (
    <>
      <PageHeader badge={c.badge} title={c.title} highlight={c.highlight} text={c.text} />

      {/* Kaise kaam karta hai */}
      <section className="pb-20">
        <Container>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{c.stepsTitle}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {c.steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-brand-500/40"
              >
                <span className="absolute right-4 top-1 text-7xl font-bold text-white/[0.05]">{i + 1}</span>
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                  <s.icon size={22} />
                </span>
                <h3 className="relative mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Live dukaanein (jab tak koi nahi, ye hissa chhupa rehta hai) */}
      {shops.length > 0 && (
        <section className="pb-20">
          <Container>
            <SectionHeading title={c.liveTitle} highlight={c.liveHighlight} />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((s, i) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.25, delay: 0 } }}
                >
                  <Link
                    to={`/shop/${s.slug}`}
                    className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-brand-500/40"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-brand-500/10">
                      {s.cover || s.logo ? (
                        <img
                          src={assetUrl(s.cover || s.logo)}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-brand-400">
                          <Store size={40} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold">{s.name}</h3>
                      {s.tagline && <p className="mt-1 line-clamp-1 text-sm text-white/60">{s.tagline}</p>}
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50">
                        {s.category && (
                          <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 font-semibold text-brand-300">
                            {s.category}
                          </span>
                        )}
                        {(s.city || s.address) && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} /> {s.city || s.address}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle size={12} /> {c.items.replace('{n}', s.productsCount)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Request form */}
      <section className="pb-28">
        <Container className="max-w-2xl">
          <div className="glow-border rounded-[2rem] p-[1.5px]">
            <div className="rounded-[1.9rem] bg-[#07100c] p-6 sm:p-9">
              <h2 className="text-2xl font-bold sm:text-3xl">{c.formTitle}</h2>
              <p className="mt-2 text-sm text-white/55">{c.formText}</p>
              <div className="mt-6">
                <DukaanLeadForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}