import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Clock, Link2, MessageCircle, Share2 } from 'lucide-react'
import api from '../services/api'
import Container from '../components/ui/Container'
import CTA from '../components/sections/CTA'
import BlogCard from '../components/blog/BlogCard'
import MarkdownBody from '../components/blog/MarkdownBody'
import { useLanguage } from '../hooks/useLanguage'
import { useSeo } from '../hooks/useSeo'
import assetUrl from '../utils/assetUrl'

const copy = {
  en: {
    back: 'All articles',
    min: 'min read',
    share: 'Share',
    copy: 'Copy link',
    copied: 'Copied',
    wa: 'WhatsApp',
    more: 'Keep reading',
    nfTitle: 'Article not found',
    nfText: 'This article may have been moved or removed.',
    errText: 'Could not load this article. Please try again.',
    ctaTitle: 'Want this done for your',
    ctaHighlight: 'business?',
    ctaText: 'Tell us what you need and we will plan it with you.',
  },
  hi: {
    back: 'सभी लेख',
    min: 'मिनट में पढ़ें',
    share: 'शेयर करें',
    copy: 'लिंक कॉपी करें',
    copied: 'कॉपी हो गया',
    wa: 'WhatsApp',
    more: 'और पढ़ें',
    nfTitle: 'लेख नहीं मिला',
    nfText: 'हो सकता है यह लेख हटा दिया गया हो या उसका पता बदल गया हो।',
    errText: 'यह लेख लोड नहीं हो पाया। कृपया दोबारा कोशिश करें।',
    ctaTitle: 'क्या यह आप अपने',
    ctaHighlight: 'बिज़नेस के लिए चाहते हैं?',
    ctaText: 'बताइए आपको क्या चाहिए, हम मिलकर प्लान करेंगे।',
  },
}

export default function BlogPost() {
  const { slug } = useParams()
  const { lang } = useLanguage()
  const c = copy[lang]

  const [state, setState] = useState({ status: 'loading', post: null, related: [] })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let ignore = false
    setState({ status: 'loading', post: null, related: [] })

    api
      .get(`/posts/${encodeURIComponent(slug)}`)
      .then(({ data }) => {
        if (!ignore) setState({ status: 'ok', post: data.post, related: data.related })
      })
      .catch((err) => {
        if (!ignore) {
          setState({
            status: err.response?.status === 404 ? 'notfound' : 'error',
            post: null,
            related: [],
          })
        }
      })

    return () => {
      ignore = true
    }
  }, [slug])

  const { status, post, related } = state

  // Google ke liye structured data
  const jsonLd = useMemo(
    () =>
      post
        ? {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage ? assetUrl(post.coverImage) : undefined,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            inLanguage: post.lang,
            author: { '@type': 'Person', name: post.author },
            publisher: { '@type': 'Organization', name: 'Anstech' },
          }
        : null,
    [post]
  )

  useSeo({
    title: post?.title,
    description: post?.excerpt,
    image: post?.coverImage ? assetUrl(post.coverImage) : '',
    type: 'article',
    jsonLd,
  })

  const url = window.location.href
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard allowed nahi hai
    }
  }
  const nativeShare = () => navigator.share({ title: post.title, url }).catch(() => {})

  const btn =
    'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300'

  if (status === 'loading') {
    return (
      <section className="pb-24 pt-36">
        <Container className="max-w-3xl space-y-5">
          <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-72 animate-pulse rounded-3xl bg-white/5" />
          <div className="h-40 animate-pulse rounded-3xl bg-white/5" />
        </Container>
      </section>
    )
  }

  if (status !== 'ok') {
    return (
      <section className="pb-24 pt-44 text-center">
        <Container className="max-w-xl">
          <h1 className="text-3xl font-bold">{status === 'notfound' ? c.nfTitle : c.errText}</h1>
          {status === 'notfound' && <p className="mt-3 text-white/60">{c.nfText}</p>}
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
          >
            <ArrowLeft size={16} /> {c.back}
          </Link>
        </Container>
      </section>
    )
  }

  const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    post.lang === 'hi' ? 'hi-IN' : 'en-IN',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <>
      <article className="pb-16 pt-32 lg:pt-40">
        <Container className="max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-brand-300"
          >
            <ArrowLeft size={16} /> {c.back}
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              {post.category && (
                <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">
                  {post.category}
                </span>
              )}
              {post.lang === 'hi' && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  हिंदी
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/55">
              <span className="font-medium text-white/80">{post.author}</span>
              <span>{date}</span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {post.readMinutes} {c.min}
              </span>
            </div>
          </motion.header>

          {post.coverImage && (
            <img
              src={assetUrl(post.coverImage)}
              alt=""
              className="mt-8 aspect-[16/9] w-full rounded-3xl border border-white/10 object-cover"
            />
          )}

          <div className="mt-10">
            <MarkdownBody>{post.content}</MarkdownBody>
          </div>

          {post.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6">
            <span className="mr-1 text-sm font-medium text-white/70">{c.share}:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`}
              target="_blank"
              rel="noreferrer"
              className={btn}
            >
              <MessageCircle size={16} /> {c.wa}
            </a>
            <button onClick={copyLink} className={btn}>
              {copied ? <Check size={16} /> : <Link2 size={16} />} {copied ? c.copied : c.copy}
            </button>
            {typeof navigator !== 'undefined' && navigator.share && (
              <button onClick={nativeShare} className={btn}>
                <Share2 size={16} /> {c.share}
              </button>
            )}
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="pb-16">
          <Container>
            <h2 className="text-2xl font-bold sm:text-3xl">{c.more}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <BlogCard key={p._id} post={p} index={i} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CTA title={c.ctaTitle} highlight={c.ctaHighlight} text={c.ctaText} />
    </>
  )
}