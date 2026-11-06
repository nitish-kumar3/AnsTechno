import { useCallback, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { getServiceIcon } from '../../utils/serviceIcons'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ServiceForm from '../../components/admin/ServiceForm'
import Toast from '../../components/admin/Toast'
import Toggle from '../../components/admin/Toggle'

export default function AdminServices() {
  const { reloadStats } = useOutletContext()
  const { toast, show } = useToast()

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [editing, setEditing] = useState(null) // null = band, 'new' = naya, ya service object
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleting, setDeleting] = useState(null) // delete hone wali service
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/services/admin/all')
      setServices(data.services)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load services')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const closeForm = () => {
    setEditing(null)
    setFormError('')
  }

  // Add ya edit save karo
  const save = async (payload) => {
    setSaving(true)
    setFormError('')
    try {
      if (editing === 'new') {
        await api.post('/services', payload)
        show('Service added')
      } else {
        await api.put(`/services/${editing._id}`, payload)
        show('Changes saved')
      }
      closeForm()
      await load()
      reloadStats()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  // Website par dikhana / chhupana
  const toggleActive = async (service) => {
    try {
      await api.put(`/services/${service._id}`, { isActive: !service.isActive })
      setServices((list) =>
        list.map((s) => (s._id === service._id ? { ...s, isActive: !s.isActive } : s))
      )
      show(service.isActive ? 'Hidden from website' : 'Now visible on website')
    } catch {
      show('Could not update', 'error')
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await api.delete(`/services/${deleting._id}`)
      setDeleting(null)
      show('Service deleted')
      await load()
      reloadStats()
    } catch {
      show('Could not delete', 'error')
    } finally {
      setBusy(false)
    }
  }

  const list = services.filter((s) =>
    `${s.title} ${s.category}`.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="mt-1 text-sm text-white/50">
            {services.length} services. Yahan se badlav karoge to website par turant dikhega.
          </p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
        >
          <Plus size={16} /> Add service
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base outline-none transition placeholder:text-white/30 focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/10 sm:text-sm"
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center">
          <p className="font-semibold">
            {services.length === 0 ? 'Abhi koi service nahi hai' : 'Koi service nahi mili'}
          </p>
          <p className="mt-1 text-sm text-white/50">
            {services.length === 0
              ? '"Add service" dabao, ya terminal me npm run seed:content chalao.'
              : 'Dusra naam search karke dekho.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((s, i) => {
            const Icon = getServiceIcon(s.icon)
            return (
              <motion.li
                key={s._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04 }}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/30 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{s.title}</h3>
                      {!s.isActive && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-500">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-white/50">
                      {s.category} · /{s.slug}
                    </p>
                    {s.tagline && (
                      <p className="mt-1 hidden truncate text-sm text-white/60 md:block">
                        {s.tagline}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Toggle
                      checked={s.isActive}
                      onChange={() => toggleActive(s)}
                      label={`Show ${s.title} on website`}
                    />
                    <span className="w-12">{s.isActive ? 'Visible' : 'Hidden'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(s)}
                      aria-label={`Edit ${s.title}`}
                      className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:border-brand-500/40 hover:text-brand-300"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleting(s)}
                      aria-label={`Delete ${s.title}`}
                      className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:bg-red-500/15 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      )}

      <AnimatePresence>
        {editing && (
          <AdminModal
            key="form"
            title={editing === 'new' ? 'Add service' : 'Edit service'}
            onClose={closeForm}
          >
            <ServiceForm
              service={editing === 'new' ? null : editing}
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
            title="Delete service?"
            text={`"${deleting.title}" hamesha ke liye delete ho jayegi. Sirf chhupana ho to Hidden switch use karo.`}
            busy={busy}
            onConfirm={remove}
            onCancel={() => setDeleting(null)}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} />
    </div>
  )
}