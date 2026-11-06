// ⚠️ Ye saare numbers (INR) sirf andaze hain. Apne rate ke hisaab se badlo.

// Ek baar ka kaam
export const projects = [
  {
    id: 'website',
    icon: 'globe',
    min: 15000,
    max: 40000,
    name: { en: 'Business Website', hi: 'बिज़नेस वेबसाइट' },
    desc: {
      en: 'Professional site to show your business online',
      hi: 'आपके बिज़नेस को ऑनलाइन दिखाने वाली प्रोफेशनल साइट',
    },
  },
  {
    id: 'store',
    icon: 'cart',
    min: 40000,
    max: 120000,
    name: { en: 'Online Store', hi: 'ऑनलाइन स्टोर' },
    desc: {
      en: 'Sell products with cart and online payments',
      hi: 'कार्ट और ऑनलाइन पेमेंट के साथ प्रोडक्ट बेचें',
    },
  },
  {
    id: 'webapp',
    icon: 'code',
    min: 60000,
    max: 250000,
    name: { en: 'Web App / Software', hi: 'वेब ऐप / सॉफ्टवेयर' },
    desc: {
      en: 'Custom software for your business needs',
      hi: 'आपके बिज़नेस की ज़रूरत का कस्टम सॉफ्टवेयर',
    },
  },
  {
    id: 'ai',
    icon: 'bot',
    min: 15000,
    max: 60000,
    name: { en: 'AI & Automation', hi: 'AI और ऑटोमेशन' },
    desc: {
      en: 'Chatbots and automation to save daily work',
      hi: 'चैटबॉट और ऑटोमेशन जो रोज़ का काम बचाएं',
    },
  },
]

// Har महीने ka kaam
export const monthly = [
  {
    id: 'ads',
    icon: 'target',
    min: 8000,
    max: 25000,
    name: { en: 'Facebook & Instagram Ads', hi: 'फेसबुक और इंस्टाग्राम विज्ञापन' },
    desc: { en: 'Run ad campaigns for leads and sales', hi: 'लीड और सेल्स के लिए विज्ञापन' },
  },
  {
    id: 'social',
    icon: 'share',
    min: 6000,
    max: 20000,
    name: { en: 'Social Media Management', hi: 'सोशल मीडिया मैनेजमेंट' },
    desc: { en: 'Posts, reels and page handling', hi: 'पोस्ट, रील और पेज संभालना' },
  },
  {
    id: 'marketing',
    icon: 'trending',
    min: 10000,
    max: 30000,
    name: { en: 'Digital Marketing & SEO', hi: 'डिजिटल मार्केटिंग और SEO' },
    desc: { en: 'Get found on Google and grow', hi: 'Google पर दिखें और आगे बढ़ें' },
  },
]

// Extra features
export const addons = [
  { id: 'admin', min: 8000, max: 25000, name: { en: 'Admin dashboard', hi: 'एडमिन डैशबोर्ड' } },
  { id: 'login', min: 6000, max: 18000, name: { en: 'User login & roles', hi: 'यूज़र लॉगिन और रोल' } },
  { id: 'payment', min: 6000, max: 15000, name: { en: 'Payment gateway', hi: 'पेमेंट गेटवे' } },
  { id: 'blog', min: 5000, max: 12000, name: { en: 'Blog / news section', hi: 'ब्लॉग / न्यूज़ सेक्शन' } },
  { id: 'multilang', min: 6000, max: 15000, name: { en: 'Hindi + English site', hi: 'हिंदी + इंग्लिश साइट' } },
  { id: 'whatsapp', min: 3000, max: 10000, name: { en: 'WhatsApp integration', hi: 'WhatsApp इंटीग्रेशन' } },
]

export const sizes = [
  { id: 'small', factor: 1, label: { en: 'Small (up to 5 pages / screens)', hi: 'छोटा (5 पेज / स्क्रीन तक)' } },
  { id: 'medium', factor: 1.5, label: { en: 'Medium (6 to 12 pages)', hi: 'मध्यम (6 से 12 पेज)' } },
  { id: 'large', factor: 2.2, label: { en: 'Large (13+ pages)', hi: 'बड़ा (13+ पेज)' } },
]

export const speeds = [
  { id: 'normal', factor: 1, label: { en: 'Normal (4 to 8 weeks)', hi: 'सामान्य (4 से 8 हफ्ते)' } },
  { id: 'fast', factor: 1.25, label: { en: 'Fast (2 to 3 weeks)', hi: 'तेज़ (2 से 3 हफ्ते)' } },
]

// Price ka hisaab
export function calculate({ projectIds, monthlyIds, addonIds, sizeId, speedId }) {
  const size = sizes.find((s) => s.id === sizeId) || sizes[0]
  const speed = speeds.find((s) => s.id === speedId) || speeds[0]
  const pickedProjects = projects.filter((p) => projectIds.includes(p.id))
  const pickedMonthly = monthly.filter((m) => monthlyIds.includes(m.id))

  let min = 0
  let max = 0
  pickedProjects.forEach((p) => {
    min += p.min
    max += p.max
  })
  min *= size.factor
  max *= size.factor

  // Extra features tabhi jab koi project chuna ho
  if (pickedProjects.length > 0) {
    addons
      .filter((a) => addonIds.includes(a.id))
      .forEach((a) => {
        min += a.min
        max += a.max
      })
  }
  min *= speed.factor
  max *= speed.factor

  let mMin = 0
  let mMax = 0
  pickedMonthly.forEach((m) => {
    mMin += m.min
    mMax += m.max
  })

  const round = (n) => Math.round(n / 1000) * 1000

  return {
    oneTime: pickedProjects.length ? { min: round(min), max: round(max) } : null,
    monthly: pickedMonthly.length ? { min: round(mMin), max: round(mMax) } : null,
    size,
    speed,
    pickedProjects,
    pickedMonthly,
  }
}

export const rupees = (n) => '₹' + new Intl.NumberFormat('en-IN').format(n)