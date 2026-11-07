import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, Gauge, Store } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { useLanguage } from '../../hooks/useLanguage'

const copy = {
  en: {
    eyebrow: 'Free tools',
    title: 'Plan your business',
    highlight: 'before you spend',
    text: 'Two quick tools to understand your project cost and how strong your online presence is.',
    cards: [
      {
        to: '/estimate',
        icon: Calculator,
        title: 'Project Cost Estimator',
        text: 'Pick what you need and see an instant price range.',
        cta: 'Get my estimate',
      },
      {
        to: '/online-check',
        icon: Gauge,
        title: 'Is your business online?',
        text: 'Answer a few questions and get your digital score.',
        cta: 'Check my score',
      },
      {
        to: '/digital-dukaan',
        icon: Store,
        title: 'Digital Dukaan',
        text: 'Get a simple online shop page with WhatsApp ordering and a QR poster.',
        cta: 'Get my shop page',
      },
    ],
  },
  hi: {
    eyebrow: 'फ्री टूल',
    title: 'खर्च करने से पहले',
    highlight: 'अपना बिज़नेस प्लान करें',
    text: 'दो आसान टूल, जो बताएंगे कि आपके प्रोजेक्ट की लागत कितनी होगी और आपका ऑनलाइन प्रेज़ेंस कितना मज़बूत है।',
    cards: [
      {
        to: '/estimate',
        icon: Calculator,
        title: 'प्रोजेक्ट कॉस्ट एस्टिमेटर',
        text: 'जो चाहिए वो चुनें और तुरंत कीमत का अंदाज़ा पाएं।',
        cta: 'मेरा अनुमान देखें',
      },
      {
        to: '/online-check',
        icon: Gauge,
        title: 'क्या आपका बिज़नेस ऑनलाइन है?',
        text: 'कुछ सवालों के जवाब दें और अपना डिजिटल स्कोर पाएं।',
        cta: 'मेरा स्कोर देखें',
      },
      {
        to: '/digital-dukaan',
        icon: Store,
        title: 'डिजिटल दुकान',
        text: 'WhatsApp ऑर्डर और QR पोस्टर के साथ अपनी दुकान का आसान ऑनलाइन पेज पाएं।',
        cta: 'मेरा शॉप पेज बनवाएं',
      },
    ],
  },
}

export default function ToolsTeaser() {
  const { lang } = useLanguage()
  const c = copy[lang]

  return (
    <section className="relative py-20">
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.highlight} text={c.text} />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {c.cards.map((card, i) => (
            <motion.div
              key={card.to}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
            >
              <Link
                to={card.to}
                className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-brand-500/40"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl transition-all duration-500 group-hover:scale-150" />
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-400 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-black">
                  <card.icon size={26} />
                </span>
                <h3 className="relative mt-5 text-xl font-semibold">{card.title}</h3>
                <p className="relative mt-2 text-sm text-white/60">{card.text}</p>
                <span className="relative mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-300 transition-all group-hover:gap-2">
                  {card.cta} <ArrowRight size={16} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}