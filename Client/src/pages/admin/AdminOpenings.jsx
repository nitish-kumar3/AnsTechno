import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import { useManage } from '../../hooks/useManage'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ListItem from '../../components/admin/ListItem'
import ListStatus from '../../components/admin/ListStatus'
import ListToolbar from '../../components/admin/ListToolbar'
import OpeningForm from '../../components/admin/OpeningForm'
import Toast from '../../components/admin/Toast'

const filters = ['All', 'Job', 'Internship']

export default function AdminOpenings() {
  const { reloadStats } = useOutletContext()
  const m = useManage({
    listUrl: '/openings/admin/all',
    listKey: 'openings',
    baseUrl: '/openings',
    label: 'Opening',
    onChange: reloadStats,
  })

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const closeForm = () => {
    setEditing(null)
    m.setFormError('')
  }

  const save = async (payload) => {
    const ok = await m.save(editing === 'new' ? null : editing._id, payload)
    if (ok) closeForm()
  }

  const confirmDelete = async () => {
    const ok = await m.remove(deleting)
    if (ok) setDeleting(null)
  }

  const list = m.items.filter(
    (o) =>
      (typeFilter === 'All' || o.type === typeFilter) &&
      `${o.title} ${o.department}`.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="space-y-6">
      <ListToolbar
        title="Job openings"
        subtitle={`${m.items.length} openings. Yahan ke badlav Career page par dikhenge.`}
        addLabel="Add opening"
        onAdd={() => setEditing('new')}
        search={search}
        onSearch={setSearch}
        placeholder="Search jobs and internships..."
      />

      {/* Job / Internship filter */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              typeFilter === f
                ? 'border-brand-500 bg-brand-500 text-black'
                : 'border-white/10 bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            {f === 'All' ? 'All' : `${f}s`}
          </button>
        ))}
      </div>

      <ListStatus
        loading={m.loading}
        error={m.error}
        isEmpty={!m.loading && !m.error && list.length === 0}
        emptyTitle={m.items.length === 0 ? 'Abhi koi opening nahi hai' : 'Koi opening nahi mili'}
        emptyText={
          m.items.length === 0
            ? '"Add opening" dabao, ya terminal me npm run seed:content chalao.'
            : 'Dusra filter ya naam try karo.'
        }
      />

      {!m.loading && !m.error && list.length > 0 && (
        <ul className="space-y-3">
          {list.map((o, i) => {
            const isJob = o.type === 'Job'
            const Icon = isJob ? Briefcase : GraduationCap
            const meta = isJob
              ? [o.location, o.experience].filter(Boolean).join(' · ')
              : [o.duration, o.mode].filter(Boolean).join(' · ')

            return (
              <ListItem
                key={o._id}
                item={o}
                index={i}
                name={o.title}
                onToggle={m.toggleActive}
                onEdit={setEditing}
                onDelete={setDeleting}
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                    isJob ? 'bg-cyan-500/15 text-cyan-500' : 'bg-brand-500/15 text-brand-400'
                  }`}
                >
                  <Icon size={22} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{o.title}</h3>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                      {o.type}
                    </span>
                    {!o.isActive && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-500">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-white/50">
                    {[o.department, meta, `${o.openings} ${o.openings > 1 ? 'openings' : 'opening'}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </ListItem>
            )
          })}
        </ul>
      )}

      <AnimatePresence>
        {editing && (
          <AdminModal
            key="form"
            title={editing === 'new' ? 'Add opening' : 'Edit opening'}
            onClose={closeForm}
          >
            <OpeningForm
              opening={editing === 'new' ? null : editing}
              saving={m.saving}
              serverError={m.formError}
              onSave={save}
              onCancel={closeForm}
            />
          </AdminModal>
        )}

        {deleting && (
          <ConfirmModal
            key="confirm"
            title="Delete opening?"
            text={`"${deleting.title}" hamesha ke liye delete ho jayegi. Purani applications safe rahengi. Sirf chhupana ho to Hidden switch use karo.`}
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