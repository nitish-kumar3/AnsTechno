import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Copy,
  ExternalLink,
  Eye,
  MessageCircle,
  Package,
  Pencil,
  QrCode,
  Store,
  Trash2,
  Users,
} from 'lucide-react'
import { useManage } from '../../hooks/useManage'
import assetUrl from '../../utils/assetUrl'
import { shopUrl } from '../../utils/drawPoster'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ListStatus from '../../components/admin/ListStatus'
import ListToolbar from '../../components/admin/ListToolbar'
import ShopForm from '../../components/admin/ShopForm'
import ShopPosterModal from '../../components/admin/ShopPosterModal'
import Toast from '../../components/admin/Toast'
import Toggle from '../../components/admin/Toggle'

const iconBtn =
  'rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:border-brand-500/40 hover:text-brand-300'

export default function AdminShops() {
  const m = useManage({
    listUrl: '/manage/shops',
    listKey: 'shops',
    baseUrl: '/manage/shops',
    label: 'Shop',
  })

  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null = band, 'new' = naya, ya shop
  const [poster, setPoster] = useState(null)
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

  const copyLink = async (shop) => {
    try {
      await navigator.clipboard.writeText(shopUrl(shop.slug))
      m.show('Shop link copied')
    } catch {
      m.show('Could not copy', 'error')
    }
  }

  const list = m.items.filter((s) =>
    `${s.name} ${s.category} ${s.city}`.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="space-y-6">
      <ListToolbar
        title="Digital Dukaan"
        subtitle="Dukandaaron ke mini shop pages (WhatsApp order ke saath) aur unke QR poster."
        addLabel="Add shop"
        onAdd={() => setEditing('new')}
        search={search}
        onSearch={setSearch}
        placeholder="Search shops..."
      />

      <ListStatus
        loading={m.loading}
        error={m.error}
        isEmpty={!m.loading && !m.error && list.length === 0}
        emptyTitle={m.items.length === 0 ? 'Abhi koi dukaan nahi hai' : 'Koi dukaan nahi mili'}
        emptyText={
          m.items.length === 0
            ? 'Dukaandaar ki sahmati ke baad "Add shop" se unki dukaan banao.'
            : 'Dusra naam search karke dekho.'
        }
      />

      {!m.loading && !m.error && list.length > 0 && (
        <ul className="space-y-3">
          {list.map((s, i) => (
            <motion.li
              key={s._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04 }}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/30 xl:flex-row xl:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                {s.logo ? (
                  <img src={assetUrl(s.logo)} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                ) : (
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                    <Store size={24} />
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{s.name}</h3>
                    {!s.isActive && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-500">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-white/50">
                    {[s.category, s.city, `/shop/${s.slug}`].filter(Boolean).join(' · ')}
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
                    <span className="inline-flex items-center gap-1" title="Products">
                      <Package size={13} /> {s.productsCount}
                    </span>
                    <span className="inline-flex items-center gap-1" title="Page views (30 din)">
                      <Eye size={13} /> {s.views30}
                    </span>
                    <span className="inline-flex items-center gap-1" title="Visitors (30 din)">
                      <Users size={13} /> {s.visitors30}
                    </span>
                    <span className="inline-flex items-center gap-1" title="WhatsApp order clicks (total)">
                      <MessageCircle size={13} /> {s.orderClicks}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="mr-1 flex items-center gap-2 text-xs text-white/60">
                  <Toggle
                    checked={s.isActive}
                    onChange={() => m.toggleActive(s)}
                    label={`Show ${s.name} on website`}
                  />
                </div>
                <button onClick={() => setPoster(s)} className={iconBtn} title="QR poster" aria-label="QR poster">
                  <QrCode size={16} />
                </button>
                <button onClick={() => copyLink(s)} className={iconBtn} title="Copy link" aria-label="Copy link">
                  <Copy size={16} />
                </button>
                <a
                  href={`/shop/${s.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className={iconBtn}
                  title="Open shop"
                  aria-label="Open shop"
                >
                  <ExternalLink size={16} />
                </a>
                <button onClick={() => setEditing(s)} className={iconBtn} title="Edit" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleting(s)}
                  className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:bg-red-500/15 hover:text-red-500"
                  title="Delete"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {editing && (
          <AdminModal
            key="form"
            title={editing === 'new' ? 'Add shop' : 'Edit shop'}
            size="max-w-3xl"
            onClose={closeForm}
          >
            <ShopForm
              item={editing === 'new' ? null : editing}
              saving={m.saving}
              serverError={m.formError}
              onSave={save}
              onCancel={closeForm}
            />
          </AdminModal>
        )}

        {poster && (
          <AdminModal
            key={`poster-${poster._id}`}
            title={`QR poster: ${poster.name}`}
            size="max-w-3xl"
            onClose={() => setPoster(null)}
          >
            <ShopPosterModal shop={poster} />
          </AdminModal>
        )}

        {deleting && (
          <ConfirmModal
            key="confirm"
            title="Delete shop?"
            text={`"${deleting.name}" ka shop page, products aur photos hamesha ke liye delete ho jayenge, aur uska QR kaam karna band kar dega. Sirf chhupana ho to Hidden switch use karo.`}
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