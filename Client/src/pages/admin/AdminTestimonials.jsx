import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useManage } from '../../hooks/useManage'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ListItem from '../../components/admin/ListItem'
import ListStatus from '../../components/admin/ListStatus'
import ListToolbar from '../../components/admin/ListToolbar'
import RatingStars from '../../components/admin/RatingStars'
import TestimonialForm from '../../components/admin/TestimonialForm'
import Toast from '../../components/admin/Toast'

export default function AdminTestimonials() {
  const { reloadStats } = useOutletContext()
  const m = useManage({
    listUrl: '/testimonials/admin/all',
    listKey: 'testimonials',
    baseUrl: '/testimonials',
    label: 'Testimonial',
    onChange: reloadStats,
  })

  const [search, setSearch] = useState('')
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

  const list = m.items.filter((t) =>
    `${t.name} ${t.role} ${t.text}`.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="space-y-6">
      <ListToolbar
        title="Testimonials"
        subtitle={`${m.items.length} client reviews. Jab tak koi review nahi, website par ye section chhupa rahega.`}
        addLabel="Add testimonial"
        onAdd={() => setEditing('new')}
        search={search}
        onSearch={setSearch}
        placeholder="Search reviews..."
      />

      <ListStatus
        loading={m.loading}
        error={m.error}
        isEmpty={!m.loading && !m.error && list.length === 0}
        emptyTitle={m.items.length === 0 ? 'Abhi koi testimonial nahi hai' : 'Koi review nahi mila'}
        emptyText={
          m.items.length === 0
            ? 'Asli client ka feedback aate hi "Add testimonial" se daal do.'
            : 'Dusra naam search karke dekho.'
        }
      />

      {!m.loading && !m.error && list.length > 0 && (
        <ul className="space-y-3">
          {list.map((t, i) => (
            <ListItem
              key={t._id}
              item={t}
              index={i}
              name={t.name}
              onToggle={m.toggleActive}
              onEdit={setEditing}
              onDelete={setDeleting}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 text-lg font-bold text-black">
                {t.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold">{t.name}</h3>
                  <RatingStars value={t.rating} size={14} />
                  {!t.isActive && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-500">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-white/50">
                  {[t.role, t.service].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-white/65">{t.text}</p>
              </div>
            </ListItem>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {editing && (
          <AdminModal
            key="form"
            title={editing === 'new' ? 'Add testimonial' : 'Edit testimonial'}
            onClose={closeForm}
          >
            <TestimonialForm
              testimonial={editing === 'new' ? null : editing}
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
            title="Delete testimonial?"
            text={`${deleting.name} ka review hamesha ke liye delete ho jayega.`}
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