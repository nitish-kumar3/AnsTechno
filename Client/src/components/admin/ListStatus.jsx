// Loading, error ya khali list ka message
export default function ListStatus({ loading, error, isEmpty, emptyTitle, emptyText }) {
  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-3xl bg-white/5" />
        ))}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center">
        <p className="font-semibold">{emptyTitle}</p>
        <p className="mt-1 text-sm text-white/50">{emptyText}</p>
      </div>
    )
  }

  return null
}