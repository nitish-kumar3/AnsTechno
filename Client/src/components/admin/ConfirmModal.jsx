import { Trash2 } from 'lucide-react'
import AdminModal from './AdminModal'

// "Pakka delete karna hai?" wala popup
export default function ConfirmModal({ title, text, busy, onConfirm, onCancel }) {
  return (
    <AdminModal title={title} onClose={onCancel} size="max-w-md">
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/15 text-red-500">
          <Trash2 size={26} />
        </span>
        <p className="mt-4 text-white/70">{text}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
          >
            {busy ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </AdminModal>
  )
}