import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDebounce } from '../../hooks/useDebounce'
import { useRecords } from '../../hooks/useRecords'
import timeAgo from '../../utils/timeAgo'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import FilterTabs from '../../components/admin/FilterTabs'
import InquiryDetail from '../../components/admin/InquiryDetail'
import ListStatus from '../../components/admin/ListStatus'
import Pagination from '../../components/admin/Pagination'
import SearchBox from '../../components/admin/SearchBox'
import StatusBadge from '../../components/admin/StatusBadge'
import Toast from '../../components/admin/Toast'

const statuses = ['All', 'New', 'Replied', 'Closed']

export default function AdminInquiries() {
  const { reloadStats } = useOutletContext()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const query = useDebounce(search, 400)
  const filtered = Boolean(query) || status !== 'All'

  const params = {
    ...(query && { search: query }),
    ...(status !== 'All' && { status }),
  }

  const m = useRecords({
    url: '/inquiries',
    listKey: 'inquiries',
    itemKey: 'inquiry',
    params,
    label: 'Message',
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
        <h2 className="text-3xl font-bold tracking-tight">Inquiries</h2>
        <p className="mt-1 text-sm text-white/50">
          Contact form se aaye messages. Kisi pe click karke padho aur reply karo.
        </p>
      </div>

      <div className="space-y-4">
        <SearchBox value={search} onChange={setSearch} placeholder="Search by name or email..." />
        <FilterTabs id="inq-status" options={statuses} value={status} onChange={setStatus} />
      </div>

      <ListStatus
        loading={m.loading}
        error={m.error}
        isEmpty={!m.loading && !m.error && m.items.length === 0}
        emptyTitle={filtered ? 'Koi message nahi mila' : 'Abhi koi message nahi aaya'}
        emptyText={
          filtered
            ? 'Filter ya search badal ke dekho.'
            : "Let's Connect page se jab koi message bhejega to yahan dikhega."
        }
      />

      {!m.loading && !m.error && m.items.length > 0 && (
        <>
          <ul className="space-y-3">
            {m.items.map((q, i) => (
              <motion.li
                key={q._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04 }}
              >
                <button
                  onClick={() => setSelected(q)}
                  className="flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-brand-500/40"
                >
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 font-bold text-black">
                    {q.name.charAt(0).toUpperCase()}
                    {q.status === 'New' && (
                      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink bg-brand-400" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{q.name}</h3>
                      {q.service && (
                        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-500">
                          {q.service}
                        </span>
                      )}
                      {/* {q.type === 'call' && (
                        <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-[11px] text-brand-300">
                          Call request
                        </span>
                      )} */}


                      {q.type && q.type !== 'message' && (
                        <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-[11px] text-brand-300">
                          {{ call: 'Call request', estimate: 'Estimate', quiz: 'Online check', hire: 'Hire request', dukaan: 'Dukaan request' }[q.type]}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-white/60">{q.message}</p>
                    {/* <p className="truncate text-xs text-white/40">{q.email}</p> */}
                    <p className="truncate text-xs text-white/40">{q.email || q.phone}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    <StatusBadge value={q.status} />
                    <p className="mt-1 text-[11px] text-white/40">{timeAgo(q.createdAt)}</p>
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
          <AdminModal key={`detail-${selected._id}`} title="Message" onClose={() => setSelected(null)}>
            <InquiryDetail
              inquiry={selected}
              onUpdate={handleUpdate}
              onDelete={() => setDeleting(selected)}
            />
          </AdminModal>
        )}

        {deleting && (
          <ConfirmModal
            key="confirm"
            title="Delete message?"
            text={`${deleting.name} ka message hamesha ke liye delete ho jayega.`}
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