import { Plus, Search } from 'lucide-react'

// Page ka upar wala hissa: title, "Add" button aur search
export default function ListToolbar({
  title,
  subtitle,
  addLabel,
  onAdd,
  search,
  onSearch,
  placeholder = 'Search...',
}) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-white/50">{subtitle}</p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
        >
          <Plus size={16} /> {addLabel}
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base outline-none transition placeholder:text-white/30 focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/10 sm:text-sm"
        />
      </div>
    </>
  )
}