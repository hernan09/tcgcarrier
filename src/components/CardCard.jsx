const rarityColors = {
  common: 'text-zinc-400',
  uncommon: 'text-emerald-400',
  rare: 'text-amber-400',
  mythic: 'text-rose-400',
}

const finishLabels = {
  nonfoil: 'Nonfoil',
  foil: 'Foil',
}

export default function CardCard({ card, onAddToCart, onSelect }) {
  const image = card.image_uris?.normal || card.image_uris?.small
  const price = card.prices?.usd ? parseFloat(card.prices.usd) : null
  const priceFoil = card.prices?.usd_foil ? parseFloat(card.prices.usd_foil) : null
  const finishes = card.finishes || ['nonfoil']

  return (
    <article
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/30"
      onClick={() => onSelect(card)}
      onKeyDown={e => { if (e.key === 'Enter') onSelect(card) }}
      tabIndex={0}
      role="button"
      aria-label={`View ${card.name} details`}
    >
      <div className="relative aspect-[5/7] overflow-hidden bg-zinc-800/50">
        {image ? (
          <img
            src={image}
            alt={card.name}
            width="488"
            height="680"
            loading="lazy"
            className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight text-zinc-100 line-clamp-2">
            {card.name}
          </h3>
          {card.rarity && (
            <span className={`shrink-0 text-xs font-medium uppercase ${rarityColors[card.rarity] || 'text-zinc-400'}`}>
              {card.rarity[0]}
            </span>
          )}
        </div>

        <p className="text-xs text-zinc-500 line-clamp-1">{card.type_line}</p>
        <p className="text-xs text-zinc-600">{card.set_name}</p>

        <div className="mt-auto flex flex-col gap-1.5 pt-2">
          {finishes.includes('nonfoil') && price !== null && (
            <button
              onClick={e => { e.stopPropagation(); onAddToCart(card, 'nonfoil') }}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-xs transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              aria-label={`Add ${card.name} nonfoil to cart`}
            >
              <span className="text-zinc-400">{finishLabels.nonfoil}</span>
              <span className="font-mono font-medium text-zinc-200">
                ${price.toFixed(2)}
              </span>
            </button>
          )}
          {finishes.includes('foil') && priceFoil !== null && (
            <button
              onClick={e => { e.stopPropagation(); onAddToCart(card, 'foil') }}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-xs transition-colors hover:border-amber-500/40 hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
              aria-label={`Add ${card.name} foil to cart`}
            >
              <span className="flex items-center gap-1 text-zinc-400">
                <svg className="h-3 w-3 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                {finishLabels.foil}
              </span>
              <span className="font-mono font-medium text-zinc-200">
                ${priceFoil.toFixed(2)}
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
