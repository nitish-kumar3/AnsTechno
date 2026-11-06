import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pages, total, onPage }) {
  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <p className="text-xs text-white/50">{total} total</p>

      {pages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-white/70">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => onPage(page + 1)}
            disabled={page >= pages}
            aria-label="Next page"
            className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}