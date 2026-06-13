import CardCard from './CardCard'

export default function CardGrid({ cards, loading, error, hasMore, onLoadMore, onAddToCart, onSelect }) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="mb-4 h-12 w-12 text-rose-500/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-sm text-zinc-400">{error}</p>
        <p className="mt-1 text-xs text-zinc-600">Try a different search term</p>
      </div>
    )
  }

  if (loading && cards.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/60">
            <div className="aspect-[5/7] rounded-t-2xl bg-zinc-800" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-3/4 rounded bg-zinc-800" />
              <div className="h-2 w-1/2 rounded bg-zinc-800/60" />
              <div className="h-2 w-2/3 rounded bg-zinc-800/60" />
              <div className="h-8 w-full rounded-lg bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="mb-4 h-16 w-16 text-zinc-700" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <h3 className="text-lg font-medium text-zinc-400">No cards found</h3>
        <p className="mt-1 text-sm text-zinc-600">Try searching for a card name or keyword</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {cards.map(card => (
          <CardCard key={`${card.id}-${card.set_id}`} card={card} onAddToCart={onAddToCart} onSelect={onSelect} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading…
              </>
            ) : (
              'Load more cards'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
