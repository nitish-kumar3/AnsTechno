import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Eye, Pencil, Plus, RotateCcw, Ban, Trash2, Copy } from 'lucide-react'
import api from '../../services/api'
import { useDebounce } from '../../hooks/useDebounce'
import { useRecords } from '../../hooks/useRecords'
import AdminModal from '../../components/admin/AdminModal'
import CertificateForm from '../../components/admin/CertificateForm'
import CertificateModal from '../../components/admin/CertificateModal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import FilterTabs from '../../components/admin/FilterTabs'
import ListStatus from '../../components/admin/ListStatus'
import Pagination from '../../components/admin/Pagination'
import SearchBox from '../../components/admin/SearchBox'
import Toast from '../../components/admin/Toast'

const filters = ['All', 'Valid', 'Revoked']

const fmt = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const iconBtn =
  'rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:border-brand-500/40 hover:text-brand-300'

export default function AdminCertificates() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState(null) // null = band, 'new' = naya, ya certificate
  const [viewing, setViewing] = useState(null)
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
    url: '/certificates',
    listKey: 'certificates',
    itemKey: 'certificate',
    params,
    label: 'Certificate',
  })

  const closeForm = () => {
    setEditing(null)
    setFormError('')
  }

  // Naya issue karo ya purana edit karo
  const save = async (payload) => {
    setSaving(true)
    setFormError('')
    try {
      if (editing === 'new') {
        const { data } = await api.post('/certificates', payload)
        closeForm()
        m.setPage(1)
        await m.reload()
        m.show('Certificate issued')
        setViewing(data.certificate) // turant dikhao, download ke liye
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

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id)
      m.show('Certificate ID copied')
    } catch {
      m.show('Could not copy', 'error')
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
          <h2 className="text-3xl font-bold tracking-tight">Certificates</h2>
          <p className="mt-1 text-sm text-white/50">
            Internship aur training ke certificate issue karo. QR scan karke koi bhi asli hone ki
            jaanch kar sakta hai.
          </p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
        >
          <Plus size={16} /> Issue certificate
        </button>
      </div>

      <div className="space-y-4">
        <SearchBox value={search} onChange={setSearch} placeholder="Search by name, program or ID..." />
        <FilterTabs id="cert-filter" options={filters} value={filter} onChange={setFilter} />
      </div>

      <ListStatus
        loading={m.loading}
        error={m.error}
        isEmpty={!m.loading && !m.error && m.items.length === 0}
        emptyTitle={filtered ? 'Koi certificate nahi mila' : 'Abhi koi certificate issue nahi hua'}
        emptyText={
          filtered ? 'Filter ya search badal ke dekho.' : '"Issue certificate" dabake pehla certificate banao.'
        }
      />

      {!m.loading && !m.error && m.items.length > 0 && (
        <>
          <ul className="space-y-3">
            {m.items.map((c, i) => {
              const revoked = c.status === 'revoked'
              return (
                <motion.li
                  key={c._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 8) * 0.04 }}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/30 lg:flex-row lg:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                        revoked ? 'bg-amber-500/15 text-amber-500' : 'bg-brand-500/15 text-brand-400'
                      }`}
                    >
                      <Award size={22} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold">{c.name}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            revoked
                              ? 'bg-amber-500/15 text-amber-500'
                              : 'bg-emerald-500/15 text-emerald-500'
                          }`}
                        >
                          {revoked ? 'Revoked' : 'Valid'}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-white/60">
                        {c.program} · {c.type}
                      </p>
                      <button
                        onClick={() => copyId(c.certId)}
                        className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/45 transition hover:text-brand-300"
                        title="Copy ID"
                      >
                        {c.certId} <Copy size={12} /> · {fmt(c.issueDate)}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setViewing(c)} className={iconBtn} aria-label="View certificate" title="View / Download">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => setEditing(c)} className={iconBtn} aria-label="Edit" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => m.update(c._id, { status: revoked ? 'valid' : 'revoked' })}
                      className={iconBtn}
                      aria-label={revoked ? 'Restore' : 'Revoke'}
                      title={revoked ? 'Restore (dobara valid karo)' : 'Revoke (invalid karo)'}
                    >
                      {revoked ? <RotateCcw size={16} /> : <Ban size={16} />}
                    </button>
                    <button
                      onClick={() => setDeleting(c)}
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
            title={editing === 'new' ? 'Issue certificate' : 'Edit certificate'}
            onClose={closeForm}
          >
            <CertificateForm
              certificate={editing === 'new' ? null : editing}
              saving={saving}
              serverError={formError}
              onSave={save}
              onCancel={closeForm}
            />
          </AdminModal>
        )}

        {viewing && (
          <AdminModal
            key={`view-${viewing._id}`}
            title={`Certificate: ${viewing.certId}`}
            size="max-w-4xl"
            onClose={() => setViewing(null)}
          >
            <CertificateModal certificate={viewing} />
          </AdminModal>
        )}

        {deleting && (
          <ConfirmModal
            key="confirm"
            title="Delete certificate?"
            text={`${deleting.name} ka certificate hamesha ke liye delete ho jayega, aur uska QR "not found" dikhayega. Sirf invalid karna ho to Revoke use karo.`}
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