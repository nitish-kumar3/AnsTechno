import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Clock,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Search,
  Share2,
  ShoppingBag,
  Store,
} from 'lucide-react'
import api from '../services/api'
import Container from '../components/ui/Container'
import ThemeToggle from '../components/ui/ThemeToggle'
import LanguageToggle from '../components/ui/LanguageToggle'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTracking } from '../hooks/usePageTracking'
import { useSeo } from '../hooks/useSeo'
import assetUrl from '../utils/assetUrl'

const copy = {
  en: {
    order: 'Order on WhatsApp',
    call: 'Call',
    share: 'Share',
    copied: 'Link copied',
    add: 'Add',
    out: 'Out of stock',
    askPrice: 'Ask price',
    search: 'Search items...',
    all: 'All',
    items: '{n} items',
    none: 'Items will be added soon.',
    noMatch: 'No item matched your search.',
    open: 'Hours',
    powered: 'Powered by Anstech Digital Dukaan',
    getYours: 'Get your own shop page',
    nfTitle: 'Shop not found',
    nfText: 'This shop page may have been removed or moved.',
    errText: 'Could not load this shop. Please try again.',
    back: 'See other shops',
    msgGeneral: 'Hello {shop}! I saw your shop page and want to know more.',
    msgHead: 'Hello {shop}! I want to order:',
    msgTotal: 'Total',
    msgOthers: 'plus items without price',
    msgTail: 'My name and address:',
  },
  hi: {
    order: 'WhatsApp पर ऑर्डर करें',
    call: 'कॉल करें',
    share: 'शेयर करें',
    copied: 'लिंक कॉपी हो गया',
    add: 'जोड़ें',
    out: 'स्टॉक में नहीं',
    askPrice: 'दाम पूछें',
    search: 'सामान खोजें...',
    all: 'सभी',
    items: '{n} सामान',
    none: 'सामान जल्द जोड़ा जाएगा।',
    noMatch: 'आपकी खोज से कोई सामान नहीं मिला।',
    open: 'समय',
    powered: 'Anstech डिजिटल दुकान द्वारा',
    getYours: 'अपनी दुकान का पेज बनवाएं',
    nfTitle: 'दुकान नहीं मिली',
    nfText: 'हो सकता है यह दुकान का पेज हटा दिया गया हो।',
    errText: 'यह दुकान लोड नहीं हो पाई। कृपया दोबारा कोशिश करें।',
    back: 'दूसरी दुकानें देखें',
    msgGeneral: 'नमस्ते {shop}! मैंने आपका शॉप पेज देखा, मुझे और जानकारी चाहिए।',
    msgHead: 'नमस्ते {shop}! मुझे ये सामान चाहिए:',
    msgTotal: 'कुल',
    msgOthers: 'और बिना दाम वाले सामान',
    msgTail: 'मेरा नाम और पता:',
  },
}

const money = (n) => `₹${new Intl.NumberFormat('en-IN').format(n)}`

export default function ShopPage() {
  const { slug } = useParams()
  const { lang } = useLanguage()
  const c = copy[lang]
  usePageTracking()

  const [state, setState] = useState({ status: 'loading', shop: null })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [cart, setCart] = useState({}) // { productId: quantity }
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let ignore = false
    setState({ status: 'loading', shop: null })
    setCart({})

    api
      .get(`/shops/${encodeURIComponent(slug)}`)
      .then(({ data }) => {
        if (!ignore) setState({ status: 'ok', shop: data.shop })
      })
      .catch((err) => {
        if (!ignore) {
          setState({ status: err.response?.status === 404 ? 'notfound' : 'error', shop: null })
        }
      })
    return () => {
      ignore = true
    }
  }, [slug])

  const { status, shop } = state

  const jsonLd = useMemo(
    () =>
      shop
        ? {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: shop.name,
            description: shop.tagline || shop.description || undefined,
            image: shop.cover || shop.logo ? assetUrl(shop.cover || shop.logo) : undefined,
            address: [shop.address, shop.city].filter(Boolean).join(', ') || undefined,
            telephone: `+${shop.phone || shop.whatsapp}`,
            url: window.location.href,
          }
        : null,
    [shop]
  )

  useSeo({
    title: shop?.name,
    description: shop?.tagline || shop?.description,
    image: shop?.cover || shop?.logo ? assetUrl(shop.cover || shop.logo) : '',
    jsonLd,
  })

  const products = useMemo(() => shop?.products || [], [shop])
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  )

  const q = search.trim().toLowerCase()
  const visible = products.filter(
    (p) => (!category || p.category === category) && (!q || p.name.toLowerCase().includes(q))
  )

  // Cart ka hisaab
  const cartItems = products
    .filter((p) => cart[p._id] > 0)
    .map((p) => ({ ...p, qty: cart[p._id] }))
  const count = cartItems.reduce((sum, it) => sum + it.qty, 0)
  const total = cartItems.reduce((sum, it) => (it.price != null ? sum + it.price * it.qty : sum), 0)
  const hasUnpriced = cartItems.some((it) => it.price == null)

  const change = (id, delta) =>
    setCart((cur) => {
      const next = Math.max(0, Math.min(99, (cur[id] || 0) + delta))
      const copyCart = { ...cur }
      if (next === 0) delete copyCart[id]
      else copyCart[id] = next
      return copyCart
    })

  // WhatsApp ka message
  const buildMessage = () => {
    if (cartItems.length === 0) return c.msgGeneral.replace('{shop}', shop.name)

    const lines = cartItems.map(
      (it, i) =>
        `${i + 1}. ${it.name}${it.unit ? ` (${it.unit})` : ''} x ${it.qty}${
          it.price != null ? ` = ${money(it.price * it.qty)}` : ''
        }`
    )
    const totalLine = total
      ? `${c.msgTotal}: ${money(total)}${hasUnpriced ? ` + ${c.msgOthers}` : ''}`
      : ''

    return [c.msgHead.replace('{shop}', shop.name), ...lines, totalLine, '', c.msgTail]
      .filter((line, i, arr) => line !== '' || i === arr.length - 2)
      .join('\n')
  }

  const orderLink = shop ? `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(buildMessage())}` : ''
  const countClick = () => api.post(`/shops/${shop.slug}/click`).catch(() => {})

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: shop.name, url }).catch(() => {})
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard allowed nahi hai
    }
  }

  const topBar = (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <Container className="flex items-center justify-between py-3">
        <Link to="/digital-dukaan" className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-brand-300 to-brand-600 text-sm font-bold text-black">
            A
          </span>
          <span className="hidden sm:inline">Digital Dukaan</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle id="shop" />
          <ThemeToggle />
        </div>
      </Container>
    </div>
  )

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-ink text-white">
        {topBar}
        <Container className="space-y-5 py-8">
          <div className="h-48 animate-pulse rounded-3xl bg-white/5" />
          <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-white/5" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-3xl bg-white/5" />
            ))}
          </div>
        </Container>
      </div>
    )
  }

  if (status !== 'ok') {
    return (
      <div className="min-h-screen bg-ink text-white">
        {topBar}
        <Container className="max-w-xl py-24 text-center">
          <h1 className="text-3xl font-bold">{status === 'notfound' ? c.nfTitle : c.errText}</h1>
          {status === 'notfound' && <p className="mt-3 text-white/60">{c.nfText}</p>}
          <Link
            to="/digital-dukaan"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
          >
            {c.back}
          </Link>
        </Container>
      </div>
    )
  }

  const callNumber = shop.phone || shop.whatsapp

  return (
    <div className="min-h-screen bg-ink pb-32 text-white">
      {topBar}

      {/* Cover */}
      <div className="relative h-44 overflow-hidden sm:h-64">
        {shop.cover ? (
          <img src={assetUrl(shop.cover)} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center bg-linear-to-br from-brand-500/40 via-brand-600/20 to-transparent text-brand-300">
            <Store size={56} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      </div>

      <Container>
        {/* Dukaan ki jaankari */}
        <div className="-mt-12 flex items-end gap-4 sm:-mt-16">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-3xl border-4 border-ink bg-ink shadow-xl sm:h-28 sm:w-28">
            {shop.logo ? (
              <img src={assetUrl(shop.logo)} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center bg-linear-to-br from-brand-400 to-brand-600 text-black">
                <Store size={36} />
              </span>
            )}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{shop.name}</h1>
          {shop.tagline && <p className="mt-1 text-lg text-white/65">{shop.tagline}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
            {shop.category && (
              <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">
                {shop.category}
              </span>
            )}
            {(shop.address || shop.city) && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> {[shop.address, shop.city].filter(Boolean).join(', ')}
              </span>
            )}
            {shop.hours && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} /> {shop.hours}
              </span>
            )}
          </div>

          {shop.description && (
            <p className="mt-4 max-w-2xl whitespace-pre-wrap leading-relaxed text-white/70">
              {shop.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={orderLink}
              target="_blank"
              rel="noreferrer"
              onClick={countClick}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
            >
              <MessageCircle size={18} /> {c.order}
            </a>
            <a
              href={`tel:+${callNumber}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:border-brand-500/40 hover:text-brand-300"
            >
              <Phone size={16} /> {c.call}
            </a>
            <button
              onClick={share}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:border-brand-500/40 hover:text-brand-300"
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />} {copied ? c.copied : c.share}
            </button>
          </div>
        </motion.div>

        {/* Products */}
        <div className="mt-10">
          {products.length === 0 ? (
            <p className="py-16 text-center text-white/50">{c.none}</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">{c.items.replace('{n}', products.length)}</h2>
                <div className="relative w-full max-w-xs">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={c.search}
                    aria-label={c.search}
                    className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-base outline-none transition placeholder:text-white/30 focus:border-brand-500/60 sm:text-sm"
                  />
                </div>
              </div>

              {categories.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {[c.all, ...categories].map((cat, i) => {
                    const active = (i === 0 && !category) || cat === category
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategory(i === 0 ? '' : cat)}
                        className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                          active
                            ? 'border-brand-500 bg-brand-500 text-black'
                            : 'border-white/10 bg-white/5 text-white/70 hover:border-brand-500/40'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              )}

              {visible.length === 0 ? (
                <p className="py-12 text-center text-white/50">{c.noMatch}</p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {visible.map((p, i) => {
                    const qty = cart[p._id] || 0
                    return (
                      <motion.div
                        key={p._id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                        className={`flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] ${
                          p.available ? '' : 'opacity-60'
                        }`}
                      >
                        <div className="aspect-square overflow-hidden bg-brand-500/10">
                          {p.image ? (
                            <img
                              src={assetUrl(p.image)}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-brand-400">
                              <ShoppingBag size={34} />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-3 sm:p-4">
                          <h3 className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
                            {p.name}
                          </h3>
                          <p className="mt-1 text-sm">
                            {p.price != null ? (
                              <span className="font-bold text-brand-300">{money(p.price)}</span>
                            ) : (
                              <span className="text-white/50">{c.askPrice}</span>
                            )}
                            {p.unit && <span className="ml-1 text-xs text-white/50">/ {p.unit}</span>}
                          </p>

                          <div className="mt-auto pt-3">
                            {!p.available ? (
                              <p className="text-center text-xs font-semibold text-amber-500">{c.out}</p>
                            ) : qty === 0 ? (
                              <button
                                onClick={() => change(p._id, 1)}
                                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-brand-300"
                              >
                                <Plus size={15} /> {c.add}
                              </button>
                            ) : (
                              <div className="flex items-center justify-between rounded-full border border-brand-500/40 bg-brand-500/10 p-1">
                                <button
                                  onClick={() => change(p._id, -1)}
                                  aria-label="Less"
                                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                                >
                                  <Minus size={15} />
                                </button>
                                <span className="text-sm font-bold">{qty}</span>
                                <button
                                  onClick={() => change(p._id, 1)}
                                  aria-label="More"
                                  className="grid h-8 w-8 place-items-center rounded-full bg-brand-500 text-black transition hover:bg-brand-400"
                                >
                                  <Plus size={15} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Powered by */}
        <div className="mt-16 border-t border-white/10 pt-6 text-center text-sm text-white/45">
          <p>{c.powered}</p>
          <Link to="/digital-dukaan" className="mt-1 inline-block font-medium text-brand-300 hover:underline">
            {c.getYours}
          </Link>
        </div>
      </Container>

      {/* Neeche order bar */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            key="bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-full border border-white/10 bg-ink/95 p-2 pl-5 shadow-2xl backdrop-blur-xl">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {c.items.replace('{n}', count)}
                  {total > 0 && <span className="ml-2 text-brand-300">{money(total)}</span>}
                </p>
                {hasUnpriced && <p className="truncate text-[11px] text-white/50">+ {c.msgOthers}</p>}
              </div>
              <a
                href={orderLink}
                target="_blank"
                rel="noreferrer"
                onClick={countClick}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
              >
                <MessageCircle size={17} /> {c.order}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}