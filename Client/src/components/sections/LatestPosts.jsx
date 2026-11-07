import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import api from '../../services/api'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import BlogCard from '../blog/BlogCard'
import { useLanguage } from '../../hooks/useLanguage'

const copy = {
  en: {
    eyebrow: 'From the blog',
    title: 'Learn something new,',
    highlight: 'every week',
    text: 'Simple guides to grow your business and your skills.',
    all: 'Read all articles',
  },
  hi: {
    eyebrow: 'ब्लॉग से',
    title: 'हर हफ़्ते कुछ नया',
    highlight: 'सीखें',
    text: 'अपने बिज़नेस और अपनी स्किल को बढ़ाने के आसान तरीके।',
    all: 'सभी लेख पढ़ें',
  },
}

export default function LatestPosts() {
  const { lang } = useLanguage()
  const c = copy[lang]
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api
      .get('/posts', { params: { limit: 3 } })
      .then(({ data }) => setPosts(data.posts))
      .catch(() => {})
  }, [])

  // Koi published article nahi to section dikhana hi nahi
  if (posts.length === 0) return null

  return (
    <section className="relative py-24">
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.highlight} text={c.text} />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <BlogCard key={p._id} post={p} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:border-brand-500/40 hover:text-brand-300"
          >
            {c.all} <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </section>
  )
}