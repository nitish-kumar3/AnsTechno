import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { Search } from 'lucide-react'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import Container from '../components/ui/Container'
import FilterTabs from '../components/admin/FilterTabs'
import Pagination from '../components/admin/Pagination'
import BlogCard from '../components/blog/BlogCard'
import { useLanguage } from '../hooks/useLanguage'
import { useSeo } from '../hooks/useSeo'

const copy = {
  en: {
    badge: 'Blog',
    title: 'Ideas to grow your',
    highlight: 'business online',
    text: 'Simple, practical guides on websites, marketing, AI and learning tech skills.',
    search: 'Search articles...',
    all: 'All',
    empty: 'No articles yet. Please check back soon.',
    noMatch: 'No article matched. Try another search.',
    error: 'Could not load articles. Please try again.',
    seoTitle: 'Blog',
  },
  hi: {
    badge: 'ब्लॉग',
    title: 'अपने बिज़नेस को ऑनलाइन',
    highlight: 'बढ़ाने के आइडिया',
    text: 'वेबसाइट, मार्केटिंग, AI और टेक स्किल सीखने पर आसान और काम की जानकारी।',
    search: 'लेख खोजें...',
    all: 'सभी',
    empty: 'अभी कोई लेख नहीं है। जल्द ही वापस आइए।',
    noMatch: 'कोई लेख नहीं मिला। दूसरा शब्द खोजकर देखें।',
    error: 'लेख लोड नहीं हो पाए। कृपया दोबारा कोशिश करें।',
    seoTitle: 'ब्लॉग',
  },
}

const langTabs = ['All', 'English', 'हिंदी']
const langCode = { All: '', English: 'en', हिंदी: 'hi' }

export default function Blog() {
  const { lang } = useLanguage()
  const c = copy[lang]
  useSeo({ title: c.seoTitle, description: c.text })

  const [langTab, setLangTab] = useState('All')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const query = useDebounce(search, 400)

  // Filter badle to wapas page 1
  useEffect(() => {
    setPage(1)
  }, [langTab, category, query])

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(false)

    api
      .get('/posts', {
        params: {
          ...(langCode[langTab] && { lang: langCode[langTab] }),
          ...(category && { category }),
          ...(query && { search: query }),
          page,
          limit: 9,
        },
      })
      .then(({ data }) => {
        if (!ignore) setData(data)
      })
      .catch(() => {
        if (!ignore) setError(true)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [langTab, category, query, page])

  const posts = data?.posts || []
  const categories = data?.categories || []
  const filtered = Boolean(query) || Boolean(category) || langTab !== 'All'

  return (
    <>
      <PageHeader badge={c.badge} title={c.title} highlight={c.highlight} text={c.text} />

      <section className="pb-24">
        <Container>
          {/* Search aur filters */}
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={c.search}
                aria-label={c.search}
                className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base outline-none transition placeholder:text-white/30 focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/10 sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <FilterTabs id="blog-lang" options={langTabs} value={langTab} onChange={setLangTab} />
              {categories.length > 0 && (
                <FilterTabs
                  id="blog-cat"
                  options={[c.all, ...categories]}
                  value={category || c.all}
                  onChange={(v) => setCategory(v === c.all ? '' : v)}
                />
              )}
            </div>
          </div>

          <div className="mt-10">
            {error ? (
              <p className="py-16 text-center text-red-500">{c.error}</p>
            ) : loading && !data ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-80 animate-pulse rounded-3xl bg-white/5" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="py-16 text-center text-white/50">{filtered ? c.noMatch : c.empty}</p>
            ) : (
              <div className={loading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((p, i) => (
                    <BlogCard key={p._id} post={p} index={i} />
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination page={page} pages={data.pages} total={data.total} onPage={setPage} />
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}