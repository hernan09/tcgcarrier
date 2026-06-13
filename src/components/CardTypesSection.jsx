import { useState, useEffect, useRef } from 'react'
import { CARD_TYPES, TUTORIAL_VIDEOS } from '../data/cardTypes'

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

export default function CardTypesSection() {
  const [activeType, setActiveType] = useState(0)
  const [loadedImages, setLoadedImages] = useState({})
  const loadingRef = useRef({})
  const [ref, inView] = useInView(0.05)

  useEffect(() => {
    const active = CARD_TYPES[activeType]
    active.cards.forEach(name => {
      if (loadedImages[name] || loadingRef.current[name]) return
      loadingRef.current[name] = true
      const encoded = encodeURIComponent(name)
      const img = new Image()
      img.onload = () => setLoadedImages(prev => ({ ...prev, [name]: `https://api.scryfall.com/cards/named?exact=${encoded}&format=image` }))
      img.onerror = () => setLoadedImages(prev => ({ ...prev, [name]: null }))
      img.src = `https://api.scryfall.com/cards/named?exact=${encoded}&format=image`
    })
  }, [activeType, loadedImages])

  return (
    <section id="card-types" className="relative px-4 py-24 sm:px-6 sm:py-32" ref={ref}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#6366f1_0%,_transparent_50%)] opacity-[0.03]" />
      </div>

      <div className={`mx-auto max-w-6xl transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            Tipos de Carta
          </span>
          <h2 className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Conoce tus Cartas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Magic tiene 7 tipos principales de cartas. Cada una juega un rol diferente en el campo de batalla.
            Explora cada tipo con ejemplos visuales y videos tutoriales.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-10">
          <div className="space-y-3">
            {CARD_TYPES.map((type, i) => (
              <button
                key={type.id}
                onClick={() => setActiveType(i)}
                className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 ${
                  i === activeType
                    ? `${type.borderColor} ${type.color} shadow-lg`
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                } ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-xl">{type.symbol}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-base font-bold transition-colors ${i === activeType ? type.textColor : 'text-zinc-200'}`}>
                        {type.name}
                      </h3>
                      {i === activeType && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        </span>
                      )}
                    </div>
                    <p className={`mt-2 text-sm leading-relaxed transition-opacity duration-300 ${i === activeType ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {i === activeType ? type.description : type.description.slice(0, 90) + '...'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {type.mechanics.split(', ').slice(0, 2).map(m => (
                        <span key={m} className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-400">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className={`rounded-2xl border ${CARD_TYPES[activeType].borderColor} overflow-hidden transition-all duration-500`}>
              <div className="aspect-[5/7] bg-zinc-800/50">
                {loadedImages[CARD_TYPES[activeType].cards[0]] ? (
                  <img
                    src={loadedImages[CARD_TYPES[activeType].cards[0]]}
                    alt={CARD_TYPES[activeType].cards[0]}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-8 w-8 animate-spin text-zinc-600" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={`border-t ${CARD_TYPES[activeType].borderColor} p-3`}>
                <p className="text-center text-sm font-medium text-zinc-300">{CARD_TYPES[activeType].cards[0]}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {CARD_TYPES[activeType].cards.slice(1).map((cardName, i) => (
                <div
                  key={cardName}
                  className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60"
                  style={{ animation: `fadeSlideUp 0.3s ease-out ${i * 0.1}s both` }}
                >
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
                        <svg className="h-6 w-6 animate-spin text-zinc-600" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className={`mb-8 text-center text-xl font-bold text-zinc-200 transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Videos Tutoriales
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TUTORIAL_VIDEOS.map((video, i) => (
              <div
                key={video.videoId}
                className={`overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition-all duration-700 ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="aspect-video bg-zinc-800">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}?rel=0`}
                    title={video.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="border-t border-zinc-800 p-4">
                  <h4 className="text-sm font-semibold text-zinc-200">{video.title}</h4>
                  <p className="mt-1 text-xs text-zinc-500">{video.channel}</p>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
