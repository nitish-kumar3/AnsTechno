import { Search } from 'lucide-react'

export default function SearchBox({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full max-w-md">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base outline-none transition placeholder:text-white/30 focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/10 sm:text-sm"
      />
    </div>
  )
}