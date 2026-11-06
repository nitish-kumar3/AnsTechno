import { Sparkles } from 'lucide-react'

export default function AdminPlaceholder({ title }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
          <Sparkles size={26} />
        </span>
        <h2 className="mt-5 text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-white/55">
          Is section ka page agle step me banega.
        </p>
      </div>
    </div>
  )
}