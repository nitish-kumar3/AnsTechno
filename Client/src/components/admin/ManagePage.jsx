import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useManage } from '../../hooks/useManage'
import assetUrl from '../../utils/assetUrl'
import AdminModal from './AdminModal'
import ConfirmModal from './ConfirmModal'
import ListItem from './ListItem'
import ListStatus from './ListStatus'
import ListToolbar from './ListToolbar'
import Toast from './Toast'

// row(item) ko { icon, title, subtitle, image } wapas dena hai
export default function ManagePage({
  title,
  subtitle,
  noun,
  addLabel,
  listUrl,
  baseUrl,
  nameOf,
  searchText,
  row,
  Form,
  emptyHint,
}) {
  const { reloadStats } = useOutletContext()
  const m = useManage({ listUrl, listKey: 'items', baseUrl, label: noun, onChange: reloadStats })

  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null = band, 'new' = naya, ya item
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

  const list = m.items.filter((item) =>
    searchText(item).toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="space-y-6">
      <ListToolbar
        title={title}
        subtitle={subtitle}
        addLabel={addLabel}
        onAdd={() => setEditing('new')}
        search={search}
        onSearch={setSearch}
        placeholder="Search..."
      />

      <ListStatus
        loading={m.loading}
        error={m.error}
        isEmpty={!m.loading && !m.error && list.length === 0}
        emptyTitle={m.items.length === 0 ? `Abhi koi ${noun.toLowerCase()} nahi hai` : 'Kuch nahi mila'}
        emptyText={m.items.length === 0 ? emptyHint : 'Dusra naam search karke dekho.'}
      />

      {!m.loading && !m.error && list.length > 0 && (
        <ul className="space-y-3">
          {list.map((item, i) => {
            const r = row(item)
            return (
              <ListItem
                key={item._id}
                item={item}
                index={i}
                name={nameOf(item)}
                onToggle={m.toggleActive}
                onEdit={setEditing}
                onDelete={setDeleting}
              >
                {r.image ? (
                  <img src={assetUrl(r.image)} alt="" className="h-12 w-12 shrink-0 rounded-2xl object-cover" />
                ) : (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                    <r.icon size={22} />
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{r.title}</h3>
                    {!item.isActive && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-500">
                        Hidden
                      </span>
                    )}
                  </div>
                  {r.subtitle && <p className="mt-0.5 truncate text-xs text-white/50">{r.subtitle}</p>}
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
            title={editing === 'new' ? addLabel : `Edit ${noun.toLowerCase()}`}
            onClose={closeForm}
          >
            <Form
              item={editing === 'new' ? null : editing}
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
            title={`Delete ${noun.toLowerCase()}?`}
            text="Ye hamesha ke liye delete ho jayega. Sirf chhupana ho to Hidden switch use karo."
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