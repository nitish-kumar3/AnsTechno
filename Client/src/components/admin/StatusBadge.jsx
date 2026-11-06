// Status ke hisaab se rang
const styles = {
  New: 'bg-brand-500/15 text-brand-400',
  Shortlisted: 'bg-cyan-500/15 text-cyan-500',
  Interview: 'bg-amber-500/15 text-amber-500',
  Hired: 'bg-emerald-500/20 text-emerald-500',
  Rejected: 'bg-red-500/15 text-red-500',
  Replied: 'bg-cyan-500/15 text-cyan-500',
  Closed: 'bg-white/10 text-white/60',
}

export default function StatusBadge({ value }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[value] || styles.Closed
      }`}
    >
      {value}
    </span>
  )
}