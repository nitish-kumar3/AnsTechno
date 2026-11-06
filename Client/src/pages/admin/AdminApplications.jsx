import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDebounce } from '../../hooks/useDebounce'
import { useRecords } from '../../hooks/useRecords'
import timeAgo from '../../utils/timeAgo'
import AdminModal from '../../components/admin/AdminModal'
import ApplicationDetail from '../../components/admin/ApplicationDetail'
import ConfirmModal from '../../components/admin/ConfirmModal'
import FilterTabs from '../../components/admin/FilterTabs'
import ListStatus from '../../components/admin/ListStatus'
import Pagination from '../../components/admin/Pagination'
import SearchBox from '../../components/admin/SearchBox'
import StatusBadge from '../../components/admin/StatusBadge'
import Toast from '../../components/admin/Toast'

const stages = ['All', 'New', 'Shortlisted', 'Interview', 'Hired', 'Rejected']
const types = ['All', 'Job', 'Internship', 'General']

export default function AdminApplications() {
  const { reloadStats } = useOutletContext()

  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('All')
  const [type, setType] = useState('All')
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const query = useDebounce(search, 400)
  const filtered = Boolean(query) || stage !== 'All' || type !== 'All'

  // Sirf wahi filter bhejo jo chune gaye hain
  const params = {
    ...(query && { search: query }),
    ...(stage !== 'All' && { stage }),
    ...(type !== 'All' && { type }),
  }

  const m = useRecords({
    url: '/applications',
    listKey: 'applications',
    itemKey: 'application',
    params,
    label: 'Application',
    onChange: reloadStats,
  })

  const handleUpdate = async (payload) => {
    const record = await m.update(selected._id, payload)
    if (record) setSelected(record)
  }

  const confirmDelete = async () => {
    const ok = await m.remove(deleting._id)
    if (ok) {
      setDeleting(null)
      setSelected(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
        <p className="mt-1 text-sm text-white/50">
          Job, internship aur general applications. Kisi pe click karke poori detail aur resume dekho.
        </p>
      </div>

      <div className="space-y-4">
        <SearchBox value={search} onChange={setSearch} placeholder="Search by name or email..." />
        <div className="flex flex-wrap items-center gap-3">
          <FilterTabs id="app-stage" options={stages} value={stage} onChange={setStage} />
          <FilterTabs id="app-type" options={types} value={type} onChange={setType} />
        </div>
      </div>

      <ListStatus
        loading={m.loading}
        error={m.error}
        isEmpty={!m.loading && !m.error && m.items.length === 0}
        emptyTitle={filtered ? 'Koi application nahi mili' : 'Abhi koi application nahi aayi'}
        emptyText={
          filtered
            ? 'Filter ya search badal ke dekho.'
            : 'Career page se jab koi apply karega to yahan dikhegi.'
        }
      />

      {!m.loading && !m.error && m.items.length > 0 && (
        <>
          <ul className="space-y-3">
            {m.items.map((a, i) => (
              <motion.li
                key={a._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04 }}
              >
                <button
                  onClick={() => setSelected(a)}
                  className="flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-brand-500/40"
                >
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 font-bold text-black">
                    {a.name.charAt(0).toUpperCase()}
                    {a.stage === 'New' && (
                      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink bg-brand-400" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{a.name}</h3>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                        {a.openingType}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-white/60">{a.openingTitle}</p>
                    <p className="truncate text-xs text-white/40">{a.email}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    <StatusBadge value={a.stage} />
                    <p className="mt-1 text-[11px] text-white/40">{timeAgo(a.createdAt)}</p>
                  </div>
                </button>
              </motion.li>
            ))}
          </ul>

          <Pagination page={m.page} pages={m.pages} total={m.total} onPage={m.setPage} />
        </>
      )}

      <AnimatePresence>
        {selected && (
          <AdminModal key={`detail-${selected._id}`} title="Application" onClose={() => setSelected(null)}>
            <ApplicationDetail
              application={selected}
              onUpdate={handleUpdate}
              onDelete={() => setDeleting(selected)}
            />
          </AdminModal>
        )}

        {deleting && (
          <ConfirmModal
            key="confirm"
            title="Delete application?"
            text={`${deleting.name} ki application aur resume hamesha ke liye delete ho jayegi.`}
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