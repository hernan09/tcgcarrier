import { useState } from 'react'

const CARD_BACK = 'https://cards.scryfall.io/normal/back/0/0/00000000-0000-0000-0000-000000000000.jpg'

function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts * 1000).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short',
  })
}

function cardImageUrl(name) {
  return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image&version=normal`
}

function CardImage({ name, count }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className="relative" style={{ aspectRatio: '63/88' }}>
      {!loaded && !failed && (
        <div className="absolute inset-0 rounded-md bg-zinc-800/60 animate-pulse" />
      )}

      {failed ? (
        <div className="absolute inset-0">
          <img
            src={CARD_BACK}
            alt=""
            className="w-full h-full object-cover rounded-md opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <p className="text-[9px] text-zinc-300 text-center leading-tight font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {name}
            </p>
          </div>
        </div>
      ) : (
        <img
          src={cardImageUrl(name)}
          alt={name}
          loading="lazy"
          className="w-full h-auto rounded-md border border-zinc-700/40"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}

      {count > 1 && (
        <span className="absolute top-0.5 right-0.5 text-[10px] font-bold bg-black/70 text-white px-1 rounded z-10">
          {count}
        </span>
      )}
    </div>
  )
}

export default function DeckView({ tournament, onBack, onClose }) {
  const deck = tournament.winnerDeck
  const commanders = deck?.commanders || []
  const mainboard = deck?.mainboard || []

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-32px)] max-w-sm">
      <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
          <button
            onClick={onBack}
            className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 mx-3 min-w-0">
            <p className="text-zinc-100 text-sm font-medium leading-tight truncate">{tournament.name}</p>
            <p className="text-zinc-500 text-[11px]">
              Mazo ganador · {tournament.format}{tournament.startDate ? ` · ${formatDate(tournament.startDate)}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {commanders.length > 0 && (
            <div className="px-4 pt-3 pb-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">Comandante{commanders.length > 1 ? 's' : ''}</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {commanders.map(c => (
                  <div key={c.name} className="shrink-0 w-28">
                    <CardImage name={c.name} className="w-28" />
                    <p className="text-[10px] text-zinc-400 mt-1 text-center truncate max-w-28">{c.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mainboard.length > 0 && (
            <div className="px-4 pb-3 pt-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                Mainboard ({mainboard.length} cartas)
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {mainboard.map(c => (
                  <div key={c.name} className="relative group">
                    <CardImage name={c.name} count={c.count} />
                    <p className="text-[9px] text-zinc-500 mt-0.5 text-center truncate hidden group-hover:block">
                      {c.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!deck && (
            <div className="px-4 py-8 text-center">
              <p className="text-zinc-400 text-sm">No hay datos del mazo ganador</p>
              <p className="text-zinc-600 text-xs mt-1">Este torneo no tiene lista de mazo disponible</p>
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-zinc-800/60">
          <p className="text-[10px] text-zinc-600 text-center">
            Datos de <a href="https://topdeck.gg" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-400 underline underline-offset-2">TopDeck.gg</a>
          </p>
        </div>
      </div>
    </div>
  )
}
