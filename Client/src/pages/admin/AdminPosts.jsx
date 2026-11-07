import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, EyeOff, FileText, Pencil, Plus, Send, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { useDebounce } from '../../hooks/useDebounce'
import { useRecords } from '../../hooks/useRecords'
import assetUrl from '../../utils/assetUrl'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import FilterTabs from '../../components/admin/FilterTabs'
import ListStatus from '../../components/admin/ListStatus'
import Pagination from '../../components/admin/Pagination'
import PostForm from '../../components/admin/PostForm'
import SearchBox from '../../components/admin/SearchBox'
import Toast from '../../components/admin/Toast'

const filters = ['All', 'Published', 'Draft']

const iconBtn =
  'rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:border-brand-500/40 hover:text-brand-300'

const fmt = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminPosts() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState(null) // null = band, 'new' = naya, ya post
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const query = useDebounce(search, 400)
  const filtered = Boolean(query) || filter !== 'All'

  const params = {
    ...(query && { search: query }),
    ...(filter !== 'All' && { status: filter.toLowerCase() }),
  }

  const m = useRecords({
    url: '/manage/posts',
    listKey: 'posts',
    itemKey: 'post',
    params,
    label: 'Article',
  })

  const closeForm = () => {
    setEditing(null)
    setFormError('')
  }

  const save = async (payload) => {
    setSaving(true)
    setFormError('')
    try {
      if (editing === 'new') {
        await api.post('/manage/posts', payload)
        closeForm()
        m.setPage(1)
        await m.reload()
        m.show(payload.status === 'published' ? 'Article published' : 'Draft saved')
      } else {
        const record = await m.update(editing._id, payload)
        if (record) closeForm()
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    const ok = await m.remove(deleting._id)
    if (ok) setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog posts</h2>
          <p className="mt-1 text-sm text-white/50">
            Hindi ya English me article likho. Draft site par nahi dikhta, Publish karte hi dikhta hai.
          </p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
        >
          <Plus size={16} /> New article
        </button>
      </div>

      <div className="space-y-4">
        <SearchBox value={search} onChange={setSearch} placeholder="Search by title or category..." />
        <FilterTabs id="post-filter" options={filters} value={filter} onChange={setFilter} />
      </div>

      <ListStatus
        loading={m.loading}
        error={m.error}
        isEmpty={!m.loading && !m.error && m.items.length === 0}
        emptyTitle={filtered ? 'Koi article nahi mila' : 'Abhi koi article nahi hai'}
        emptyText={filtered ? 'Filter ya search badal ke dekho.' : '"New article" dabake pehla article likho.'}
      />

      {!m.loading && !m.error && m.items.length > 0 && (
        <>
          <ul className="space-y-3">
            {m.items.map((p, i) => {
              const live = p.status === 'published'
              return (
                <motion.li
                  key={p._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 8) * 0.04 }}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/30 lg:flex-row lg:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {p.coverImage ? (
                      <img
                        src={assetUrl(p.coverImage)}
                        alt=""
                        className="h-14 w-20 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="grid h-14 w-20 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
                        <FileText size={22} />
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold">{p.title}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            live ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                          }`}
                        >
                          {live ? 'Published' : 'Draft'}
                        </span>
                        {p.lang === 'hi' && (
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                            हिंदी
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-white/50">
                        {[p.category, `/blog/${p.slug}`, fmt(p.updatedAt)].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {live && (
                      <a
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className={iconBtn}
                        aria-label="View on website"
                        title="View on website"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <button
                      onClick={() => m.update(p._id, { status: live ? 'draft' : 'published' })}
                      className={iconBtn}
                      aria-label={live ? 'Unpublish' : 'Publish'}
                      title={live ? 'Unpublish (draft banao)' : 'Publish'}
                    >
                      {live ? <EyeOff size={16} /> : <Send size={16} />}
                    </button>
                    <button onClick={() => setEditing(p)} className={iconBtn} aria-label="Edit" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleting(p)}
                      className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:bg-red-500/15 hover:text-red-500"
                      aria-label="Delete"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.li>
              )
            })}
          </ul>

          <Pagination page={m.page} pages={m.pages} total={m.total} onPage={m.setPage} />
        </>
      )}

      <AnimatePresence>
        {editing && (
          <AdminModal
            key="form"
            title={editing === 'new' ? 'New article' : 'Edit article'}
            size="max-w-4xl"
            onClose={closeForm}
          >
            <PostForm
              post={editing === 'new' ? null : editing}
              saving={saving}
              serverError={formError}
              onSave={save}
              onCancel={closeForm}
            />
          </AdminModal>
        )}

        {deleting && (
          <ConfirmModal
            key="confirm"
            title="Delete article?"
            text={`"${deleting.title}" hamesha ke liye delete ho jayega, aur uska link "not found" dikhayega. Sirf chhupana ho to Unpublish use karo.`}
            busy={m.busy}
            onConfirm={confirmDelete}
            onCancel={() => setDeleting(null)}
          />
        )}
      </AnimatePresence>

      <Toast toast={m.toast} />
    </div>
  )
}