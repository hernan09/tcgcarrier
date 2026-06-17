import { useState, useEffect, useRef } from 'react'
import { META_DECKS, FORMATS } from '../data/metaDecks'
import { COLORS } from '../data/mtgColors'

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el) } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

function DeckCard({ deck, index, inView }) {
  const [loadedImages, setLoadedImages] = useState({})
  const loadingRef = useRef({})

  useEffect(() => {
    deck.keyCards.forEach(name => {
      if (loadedImages[name] || loadingRef.current[name]) return
      loadingRef.current[name] = true
      const encoded = encodeURIComponent(name)
      const img = new Image()
      img.onload = () => setLoadedImages(prev => ({ ...prev, [name]: `https://api.scryfall.com/cards/named?exact=${encoded}&format=image` }))
      img.onerror = () => setLoadedImages(prev => ({ ...prev, [name]: null }))
      img.src = `https://api.scryfall.com/cards/named?exact=${encoded}&format=image`
    })
  }, [deck.keyCards, loadedImages])

  const colorMap = {
    white: 'bg-amber-200',
    blue: 'bg-sky-400',
    black: 'bg-zinc-400',
    red: 'bg-red-400',
    green: 'bg-emerald-400',
  }

  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all duration-700 hover:border-zinc-700 hover:-translate-y-0.5 hover:shadow-lg ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-zinc-200 leading-tight">{deck.name}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{deck.archetype}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {deck.colors.map(c => (
            <span key={c} className={`inline-block h-2.5 w-2.5 rounded-full ${colorMap[c] || 'bg-zinc-500'}`} title={COLORS.find(col => col.id === c)?.name || c} />
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {deck.keyCards.map(cardName => (
          <div key={cardName} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800/50">
            <div className="aspect-[5/7] bg-zinc-800/50">
              {loadedImages[cardName] ? (
                <img
                  src={loadedImages[cardName]}
                  alt={cardName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg className="h-4 w-4 animate-spin text-zinc-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-medium text-indigo-300">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
          {deck.meta}% meta
        </span>
        <span className="text-zinc-600">{deck.players} jugadores</span>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-zinc-800 pt-2 text-xs">
        <span className="text-zinc-500">
          <span className="text-zinc-400">Físico:</span> ${deck.priceTabletop}
        </span>
        <span className="text-zinc-500">
          <span className="text-zinc-400">MTGO:</span> {deck.priceMtgo} tix
        </span>
      </div>
    </div>
  )
}

export default function MetaDeckSection() {
  const [ref, inView] = useInView(0.05)

  return (
    <section id="meta-decks" className="relative px-4 py-24 sm:px-6 sm:py-32 overflow-x-hidden" ref={ref}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#a855f7_0%,_transparent_50%)] opacity-[0.03]" />
      </div>

      <div className={`mx-auto max-w-6xl transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            Metagame Actual
          </span>
          <h2 className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Mazos del Meta
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Datos obtenidos de <a href="https://mtggoldfish.com/metagame" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline decoration-indigo-500/30 hover:text-indigo-300">MTGGoldfish</a> — los mazos más jugados del formato Standard.
            Porcentajes de meta, precios y cartas clave de cada arquetipo.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {FORMATS.filter(f => f.active).map(fmt => (
            <span
              key={fmt.id}
              className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm shadow-indigo-600/30"
            >
              {fmt.label}
            </span>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {META_DECKS.map((deck, i) => (
            <DeckCard key={deck.name} deck={deck} index={i} inView={inView} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://mtggoldfish.com/metagame"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm font-medium text-zinc-400 transition-all hover:border-zinc-700 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
          >
            Ver todos los mazos en MTGGoldfish
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
