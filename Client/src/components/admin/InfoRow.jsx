// Detail popup me "label: value" ka dibba
export default function InfoRow({ label, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">{label}</p>
      <div className="mt-1 break-words text-sm text-white/85">{children}</div>
    </div>
  )
}