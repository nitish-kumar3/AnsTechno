export const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-brand-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-brand-500/10 sm:text-sm [color-scheme:dark]'

export default function FormField({ label, error, optional, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-white/80">
        {label}
        {optional && <span className="text-xs text-white/40">Optional</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-red-400">{error}</span>
      )}
    </label>
  )
}