// Har sawal ke 3 jawab: 2 = achha, 1 = thoda, 0 = nahi
// slug = kaunsi service se jodna hai (Services ke slug)
export const questions = [
  {
    id: 'website',
    short: 'Website',
    slug: 'wordpress-cms',
    q: { en: 'Does your business have a website?', hi: 'क्या आपके बिज़नेस की वेबसाइट है?' },
    options: [
      { points: 2, en: 'Yes, and it works well', hi: 'हाँ, और अच्छी चलती है' },
      { points: 1, en: 'Yes, but it is old or basic', hi: 'हाँ, पर पुरानी या साधारण है' },
      { points: 0, en: 'No website yet', hi: 'अभी वेबसाइट नहीं है' },
    ],
    fix: { en: 'Get a professional business website', hi: 'प्रोफेशनल बिज़नेस वेबसाइट बनवाएं' },
    tip: {
      en: 'A website builds trust and lets customers find you 24/7.',
      hi: 'वेबसाइट से भरोसा बनता है और ग्राहक 24 घंटे आपको ढूंढ सकते हैं।',
    },
  },
  {
    id: 'google',
    short: 'Google listing',
    slug: 'digital-marketing',
    q: {
      en: 'Do you show up on Google Maps / Google Business Profile?',
      hi: 'क्या आप Google Maps / Google Business Profile पर दिखते हैं?',
    },
    options: [
      { points: 2, en: 'Yes, with photos and reviews', hi: 'हाँ, फोटो और रिव्यू के साथ' },
      { points: 1, en: 'Listed, but not updated', hi: 'लिस्टेड हूँ, पर अपडेट नहीं है' },
      { points: 0, en: 'No / not sure', hi: 'नहीं / पता नहीं' },
    ],
    fix: { en: 'Set up and grow your Google listing', hi: 'Google लिस्टिंग बनवाएं और बढ़ाएं' },
    tip: {
      en: 'Most local customers search on Google before they visit.',
      hi: 'ज़्यादातर लोकल ग्राहक आने से पहले Google पर खोजते हैं।',
    },
  },
  {
    id: 'social',
    short: 'Social media',
    slug: 'social-media-management',
    q: {
      en: 'Is your business active on Instagram or Facebook?',
      hi: 'क्या आपका बिज़नेस Instagram या Facebook पर एक्टिव है?',
    },
    options: [
      { points: 2, en: 'Yes, we post regularly', hi: 'हाँ, हम नियमित पोस्ट करते हैं' },
      { points: 1, en: 'We have a page, but rarely post', hi: 'पेज है, पर कम पोस्ट करते हैं' },
      { points: 0, en: 'No page yet', hi: 'अभी पेज नहीं है' },
    ],
    fix: { en: 'Get your social media managed', hi: 'अपना सोशल मीडिया संभलवाएं' },
    tip: {
      en: 'Regular posts keep customers connected and bring new ones.',
      hi: 'नियमित पोस्ट से ग्राहक जुड़े रहते हैं और नए भी आते हैं।',
    },
  },
  {
    id: 'whatsapp',
    short: 'WhatsApp Business',
    slug: 'ai-automation',
    q: {
      en: 'Do you use WhatsApp Business (catalog, quick replies)?',
      hi: 'क्या आप WhatsApp Business (कैटलॉग, क्विक रिप्लाई) इस्तेमाल करते हैं?',
    },
    options: [
      { points: 2, en: 'Yes, with catalog and auto replies', hi: 'हाँ, कैटलॉग और ऑटो रिप्लाई के साथ' },
      { points: 1, en: 'Only normal WhatsApp', hi: 'सिर्फ़ सामान्य WhatsApp' },
      { points: 0, en: 'Customers cannot message us there', hi: 'ग्राहक वहां मैसेज नहीं कर सकते' },
    ],
    fix: { en: 'Automate WhatsApp replies and orders', hi: 'WhatsApp रिप्लाई और ऑर्डर ऑटोमेट करें' },
    tip: {
      en: 'Automation answers customers instantly, even at night.',
      hi: 'ऑटोमेशन ग्राहकों को तुरंत जवाब देता है, रात में भी।',
    },
  },
  {
    id: 'payments',
    short: 'Online payments',
    slug: 'full-stack-development',
    q: {
      en: 'Can customers pay you online (UPI, QR, cards)?',
      hi: 'क्या ग्राहक आपको ऑनलाइन पेमेंट कर सकते हैं (UPI, QR, कार्ड)?',
    },
    options: [
      { points: 2, en: 'Yes, easily', hi: 'हाँ, आसानी से' },
      { points: 1, en: 'Only UPI / QR in person', hi: 'सिर्फ़ दुकान पर UPI / QR' },
      { points: 0, en: 'Cash only', hi: 'सिर्फ़ कैश' },
    ],
    fix: { en: 'Add online ordering and payments', hi: 'ऑनलाइन ऑर्डर और पेमेंट जोड़ें' },
    tip: {
      en: 'Online payment means more sales and fewer missed orders.',
      hi: 'ऑनलाइन पेमेंट से बिक्री बढ़ती है और ऑर्डर छूटते नहीं।',
    },
  },
  {
    id: 'ads',
    short: 'Online ads',
    slug: 'facebook-ads',
    q: {
      en: 'Do you run online ads to find new customers?',
      hi: 'क्या आप नए ग्राहकों के लिए ऑनलाइन विज्ञापन चलाते हैं?',
    },
    options: [
      { points: 2, en: 'Yes, regularly', hi: 'हाँ, नियमित' },
      { points: 1, en: 'Tried once or twice', hi: 'एक-दो बार कोशिश की' },
      { points: 0, en: 'Never', hi: 'कभी नहीं' },
    ],
    fix: { en: 'Run targeted Facebook and Instagram ads', hi: 'सही ऑडियंस पर Facebook और Instagram विज्ञापन चलाएं' },
    tip: {
      en: 'Ads put your business in front of people nearby who are ready to buy.',
      hi: 'विज्ञापन आपको आसपास के खरीदने को तैयार लोगों तक पहुंचाते हैं।',
    },
  },
  {
    id: 'data',
    short: 'Customer records',
    slug: 'full-stack-development',
    q: {
      en: 'Do you keep customer records and follow up with them?',
      hi: 'क्या आप ग्राहकों का रिकॉर्ड रखते हैं और उनसे फॉलो-अप करते हैं?',
    },
    options: [
      { points: 2, en: 'Yes, in a proper system', hi: 'हाँ, एक सही सिस्टम में' },
      { points: 1, en: 'In a notebook or phone contacts', hi: 'कॉपी या फ़ोन कॉन्टैक्ट में' },
      { points: 0, en: 'No records', hi: 'रिकॉर्ड नहीं रखते' },
    ],
    fix: { en: 'Build a simple customer and order system', hi: 'आसान ग्राहक और ऑर्डर सिस्टम बनवाएं' },
    tip: {
      en: 'Repeat customers are the cheapest sales. Records help you follow up.',
      hi: 'पुराने ग्राहक सबसे सस्ती बिक्री हैं। रिकॉर्ड से फॉलो-अप आसान होता है।',
    },
  },
]

// Score ke hisaab se level (percent)
export const levels = [
  {
    min: 0,
    ring: 'stroke-red-500',
    text: 'text-red-500',
    name: { en: 'Mostly offline', hi: 'ज़्यादातर ऑफलाइन' },
    msg: {
      en: 'Customers will struggle to find you online. The good news: a few small steps can bring quick results.',
      hi: 'ग्राहकों को आपको ऑनलाइन ढूंढना मुश्किल है। अच्छी बात यह है कि कुछ छोटे कदम जल्दी नतीजे दे सकते हैं।',
    },
  },
  {
    min: 35,
    ring: 'stroke-amber-400',
    text: 'text-amber-500',
    name: { en: 'Getting started', hi: 'शुरुआत हो चुकी है' },
    msg: {
      en: 'You have a start. Fixing the gaps below will help more customers find and trust you.',
      hi: 'आपने शुरुआत कर दी है। नीचे की कमियां ठीक करने से और ग्राहक आपको ढूंढेंगे और भरोसा करेंगे।',
    },
  },
  {
    min: 65,
    ring: 'stroke-brand-500',
    text: 'text-brand-400',
    name: { en: 'Growing well', hi: 'अच्छी तरह बढ़ रहे हैं' },
    msg: {
      en: 'You are doing well online. A few upgrades can turn this into steady growth.',
      hi: 'आप ऑनलाइन अच्छा कर रहे हैं। कुछ सुधार इसे लगातार ग्रोथ में बदल सकते हैं।',
    },
  },
  {
    min: 85,
    ring: 'stroke-emerald-500',
    text: 'text-emerald-500',
    name: { en: 'Digital pro', hi: 'डिजिटल में माहिर' },
    msg: {
      en: 'Excellent! You are ahead of most businesses. Let us help you scale with automation and ads.',
      hi: 'शानदार! आप ज़्यादातर बिज़नेस से आगे हैं। ऑटोमेशन और विज्ञापन से और बढ़ने में हम मदद कर सकते हैं।',
    },
  },
]

export const getLevel = (percent) =>
  [...levels].reverse().find((l) => percent >= l.min) || levels[0]