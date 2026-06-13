import { useEffect } from 'react'

const rarityColors = {
  common: 'text-zinc-400',
  uncommon: 'text-emerald-400',
  rare: 'text-amber-400',
  mythic: 'text-rose-400',
}

const finishLabels = { nonfoil: 'Normal', foil: 'Foil' }

export default function CardModal({ card, onClose, onAddToCart }) {
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const image = card.image_uris?.large || card.image_uris?.normal || card.image_uris?.small
  const price = card.prices?.usd ? parseFloat(card.prices.usd) : null
  const priceFoil = card.prices?.usd_foil ? parseFloat(card.prices.usd_foil) : null
  const finishes = card.finishes || ['nonfoil']

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${card.name}`}
    >
      <div
        className="relative mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50 sm:flex-row max-sm:max-h-[90vh] max-sm:w-[90vw]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 rounded-lg border border-zinc-800 bg-zinc-950/80 p-1.5 text-zinc-500 backdrop-blur-sm transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 sm:right-3 sm:top-3 sm:rounded-xl sm:p-2"
          aria-label="Cerrar detalles"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full sm:w-72 shrink-0 max-sm:w-56 max-sm:shrink-0 max-sm:mx-auto">
          {image ? (
            <img
              src={image}
              alt={card.name}
              width="672"
              height="936"
              className="h-auto w-full object-cover max-sm:rounded-bl-2xl"
            />
          ) : (
            <div className="flex aspect-[5/7] items-center justify-center bg-zinc-800 text-zinc-600">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4 pt-3 sm:gap-4 sm:p-6">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div>
              <h2 className="text-base font-bold leading-tight text-zinc-100 sm:text-xl">{card.name}</h2>
              {card.mana_cost && (
                <p className="mt-0.5 text-sm sm:mt-1 sm:text-lg" dangerouslySetInnerHTML={{ __html: card.mana_cost }} />
              )}
            </div>
            {card.rarity && (
              <span className={`shrink-0 text-[10px] font-medium uppercase sm:text-xs ${rarityColors[card.rarity] || 'text-zinc-400'}`}>
                {card.rarity}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-zinc-500 sm:gap-x-4 sm:text-sm">
            <span>{card.type_line}</span>
            {card.set_name && (
              <>
                <span aria-hidden="true">·</span>
                <span>{card.set_name}</span>
              </>
            )}
          </div>

          {card.oracle_text && (
            <div className="flex-1 space-y-1.5 overflow-y-auto overscroll-behavior-contain max-sm:text-xs sm:space-y-2">
              {card.oracle_text.split('\n').map((line, i) => (
                <p key={i} className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                  {line}
                </p>
              ))}
            </div>
          )}

          {card.power && card.toughness && (
            <p className="text-xs text-zinc-400 sm:text-sm">
              {card.power}/{card.toughness}
            </p>
          )}

          {card.loyalty && (
            <p className="text-xs text-zinc-400 sm:text-sm">Lealtad: {card.loyalty}</p>
          )}

          <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800 sm:gap-2">
            {finishes.includes('nonfoil') && price !== null && (
              <button
                onClick={() => { onAddToCart(card, 'nonfoil'); onClose() }}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-xs transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                aria-label={`Agregar ${card.name} normal al carrito`}
              >
                <span className="text-zinc-400">{finishLabels.nonfoil}</span>
                <span className="font-mono font-semibold text-zinc-200">${price.toFixed(2)}</span>
              </button>
            )}
            {finishes.includes('foil') && priceFoil !== null && (
              <button
                onClick={() => { onAddToCart(card, 'foil'); onClose() }}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-xs transition-colors hover:border-amber-500/40 hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                aria-label={`Agregar ${card.name} foil al carrito`}
              >
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <svg className="h-3.5 w-3.5 text-amber-400 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                  {finishLabels.foil}
                </span>
                <span className="font-mono font-semibold text-zinc-200">${priceFoil.toFixed(2)}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
