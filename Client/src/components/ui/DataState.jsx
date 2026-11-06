// Loading, error ya khali: teeno ka common dikhawa. Data ho to children dikhata hai
export default function DataState({
  loading,
  error,
  onRetry,
  isEmpty,
  emptyText = 'Abhi kuch nahi hai.',
  count = 6,
  cols = 'md:grid-cols-2 lg:grid-cols-3',
  height = 'h-72',
  children,
}) {
  if (loading) {
    return (
      <div className={`grid gap-6 ${cols}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${height} animate-pulse rounded-3xl bg-white/5`} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <p className="font-semibold text-red-500">{error}</p>
        <button
          onClick={onRetry}
          className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
        >
          Try again
        </button>
      </div>
    )
  }

  if (isEmpty) {
    return <p className="py-16 text-center text-white/50">{emptyText}</p>
  }

  return children
}