import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Clock } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import assetUrl from '../../utils/assetUrl'

export default function BlogCard({ post, index = 0 }) {
  const { lang } = useLanguage()
  const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    lang === 'hi' ? 'hi-IN' : 'en-IN',
    { day: 'numeric', month: 'short', year: 'numeric' }
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.25, delay: 0 } }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-brand-500/40"
    >
      <Link to={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="aspect-[16/9] overflow-hidden bg-brand-500/10">
          {post.coverImage ? (
            <img
              src={assetUrl(post.coverImage)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full place-items-center bg-linear-to-br from-brand-500/25 to-transparent text-brand-400">
              <BookOpen size={40} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            {post.category && (
              <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold text-brand-300">
                {post.category}
              </span>
            )}
            {post.lang === 'hi' && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
                हिंदी
              </span>
            )}
          </div>

          <h3 className="mt-3 line-clamp-2 text-xl font-semibold leading-snug">{post.title}</h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/60">{post.excerpt}</p>
          )}

          <div className="mt-auto flex items-center gap-3 pt-5 text-xs text-white/45">
            <span>{date}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.readMinutes} {lang === 'hi' ? 'मिनट' : 'min'}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}