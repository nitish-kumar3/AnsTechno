import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import api from '../../services/api'
import { useManage } from '../../hooks/useManage'
import { getProjectIcon } from '../../utils/projectIcons'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ListItem from '../../components/admin/ListItem'
import ListStatus from '../../components/admin/ListStatus'
import ListToolbar from '../../components/admin/ListToolbar'
import ProjectForm from '../../components/admin/ProjectForm'
import Toast from '../../components/admin/Toast'
import assetUrl from '../../utils/assetUrl'



export default function AdminProjects() {
  const { reloadStats } = useOutletContext()
  const m = useManage({
    listUrl: '/projects/admin/all',
    listKey: 'projects',
    baseUrl: '/projects',
    label: 'Project',
    onChange: reloadStats,
  })

  const [serviceOptions, setServiceOptions] = useState([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null = band, 'new' = naya, ya project
  const [deleting, setDeleting] = useState(null)

  // Form ke "Related service" dropdown ke liye
  useEffect(() => {
    api
      .get('/services/admin/all')
      .then(({ data }) =>
        setServiceOptions(data.services.map((s) => ({ slug: s.slug, title: s.title })))
      )
      .catch(() => {})
  }, [])

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

  const list = m.items.filter((p) =>
    `${p.title} ${p.category} ${(p.tech || []).join(' ')}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  )

  return (
    <div className="space-y-6">
      <ListToolbar
        title="Projects"
        subtitle={`${m.items.length} projects. Yahan ke badlav portfolio page par dikhenge.`}
        addLabel="Add project"
        onAdd={() => setEditing('new')}
        search={search}
        onSearch={setSearch}
        placeholder="Search projects..."
      />

      <ListStatus
        loading={m.loading}
        error={m.error}
        isEmpty={!m.loading && !m.error && list.length === 0}
        emptyTitle={m.items.length === 0 ? 'Abhi koi project nahi hai' : 'Koi project nahi mila'}
        emptyText={
          m.items.length === 0
            ? '"Add project" dabao, ya terminal me npm run seed:content chalao.'
            : 'Dusra naam search karke dekho.'
        }
      />

      {!m.loading && !m.error && list.length > 0 && (
        <ul className="space-y-3">
          {list.map((p, i) => {
            const Icon = getProjectIcon(p.icon)
            return (
              <ListItem
                key={p._id}
                item={p}
                index={i}
                name={p.title}
                onToggle={m.toggleActive}
                onEdit={setEditing}
                onDelete={setDeleting}
              >
                {p.image ? (
                  <img
                    src={assetUrl(p.image)}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                    <Icon size={22} />
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{p.title}</h3>
                    {!p.isActive && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-500">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-white/50">
                    {p.category} · {(p.tech || []).slice(0, 3).join(', ')}
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
            title={editing === 'new' ? 'Add project' : 'Edit project'}
            onClose={closeForm}
          >
            <ProjectForm
              project={editing === 'new' ? null : editing}
              serviceOptions={serviceOptions}
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
            title="Delete project?"
            text={`"${deleting.title}" hamesha ke liye delete ho jayega. Sirf chhupana ho to Hidden switch use karo.`}
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