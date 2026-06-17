import { useState, useEffect, useRef, useCallback } from 'react'
import { TUTORIAL_LESSONS } from '../data/tutorialLessons'

const CARD_IMAGE_CACHE = new Map()
const IN_FLIGHT_REQUESTS = new Map()
const CARD_BACK_URL = 'https://cards.scryfall.io/back.png'

const API_CARD_NAMES = {
  'Bosque': 'Forest',
  'Montaña': 'Mountain',
  'Isla': 'Island',
  'Llanura': 'Plains',
  'Oso Gris': 'Grizzly Bears',
  'Lobo de Plata': 'Silvercoat Lion',
  'Crecimiento Gigante': 'Giant Growth',
  'Goblin Rezagado': 'Raging Goblin',
  'Slickshot Show-Off': 'Slickshot Show-Off',
  'Lightning Strike': 'Lightning Strike',
  'Cancelar': 'Cancel',
  'Garra Ígnea': 'Shivan Dragon',
}

function getApiCardName(cardName) {
  return API_CARD_NAMES[cardName] || cardName
}

async function fetchAndPreload(cardName) {
  const apiName = getApiCardName(cardName)
  const encoded = encodeURIComponent(apiName)

  let data = null
  try {
    const res = await fetch(`https://api.scryfall.com/cards/named?exact=${encoded}&format=json`)
    if (res.ok) data = await res.json()
  } catch {}

  if (!data) {
    try {
      const res = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encoded}&format=json`)
      if (res.ok) data = await res.json()
    } catch {}
  }

  const imageUrl = data?.image_uris?.normal || data?.image_uris?.large || null
  if (!imageUrl) {
    CARD_IMAGE_CACHE.set(cardName, null)
    return null
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      CARD_IMAGE_CACHE.set(cardName, imageUrl)
      resolve(imageUrl)
    }
    img.onerror = () => {
      CARD_IMAGE_CACHE.set(cardName, null)
      resolve(null)
    }
    img.src = imageUrl
  })
}

function ensureCardImage(cardName) {
  if (CARD_IMAGE_CACHE.has(cardName)) return Promise.resolve(CARD_IMAGE_CACHE.get(cardName))
  if (IN_FLIGHT_REQUESTS.has(cardName)) return IN_FLIGHT_REQUESTS.get(cardName)
  const promise = fetchAndPreload(cardName)
  IN_FLIGHT_REQUESTS.set(cardName, promise)
  return promise.then(result => {
    IN_FLIGHT_REQUESTS.delete(cardName)
    return result
  })
}

function useCardImage(cardName) {
  const [url, setUrl] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!cardName) {
      setStatus('error')
      return
    }

    let cancelled = false

    if (CARD_IMAGE_CACHE.has(cardName)) {
      const cached = CARD_IMAGE_CACHE.get(cardName)
      if (cached) {
        setUrl(cached)
        setStatus('loaded')
      } else {
        setStatus('error')
      }
      return
    }

    ensureCardImage(cardName).then((result) => {
      if (cancelled) return
      if (result) {
        setUrl(result)
        setStatus('loaded')
      } else {
        setStatus('error')
      }
    })

    return () => { cancelled = true }
  }, [cardName])

  return { url, status }
}

function useEntranceAnimation(dep, offset = 50) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), offset)
    return () => clearTimeout(t)
  }, [dep, offset])
  return visible
}

const colorConfig = {
  W: {
    border: 'border-zinc-300',
    from: 'from-zinc-200',
    to: 'to-zinc-300',
    text: 'text-zinc-900',
    name: 'text-zinc-800',
    accent: 'bg-zinc-200/30',
  },
  U: {
    border: 'border-sky-500/80',
    from: 'from-sky-700',
    to: 'to-sky-950',
    text: 'text-sky-100',
    name: 'text-sky-50',
    accent: 'bg-sky-500/20',
  },
  B: {
    border: 'border-zinc-500',
    from: 'from-zinc-800',
    to: 'to-zinc-950',
    text: 'text-zinc-200',
    name: 'text-zinc-100',
    accent: 'bg-zinc-500/20',
  },
  R: {
    border: 'border-red-500/80',
    from: 'from-red-800',
    to: 'to-red-950',
    text: 'text-red-100',
    name: 'text-red-50',
    accent: 'bg-red-500/20',
  },
  G: {
    border: 'border-emerald-500/80',
    from: 'from-emerald-800',
    to: 'to-emerald-950',
    text: 'text-emerald-100',
    name: 'text-emerald-50',
    accent: 'bg-emerald-500/20',
  },
  land: {
    border: 'border-amber-500/80',
    from: 'from-amber-800',
    to: 'to-amber-950',
    text: 'text-amber-100',
    name: 'text-amber-50',
    accent: 'bg-amber-500/20',
  },
}

function getTooltipMessage(card, interactionType) {
  if (interactionType === 'click_board') {
    if (card.color === 'land') return 'Gira esta tierra'
    return 'Ataca con esta criatura'
  }
  if (card.color === 'land') return 'Juega esta tierra'
  if (card.typeLine?.includes('Instantáneo')) return 'Lanza este hechizo'
  if (card.typeLine?.includes('Criatura')) return 'Invoca esta criatura'
  return 'Haz clic en esta carta'
}

function CardTooltip({ message, visible }) {
  if (!visible) return null
  return (
    <div className="absolute -top-16 left-1/2 z-50 -translate-x-1/2 pointer-events-none">
      <div className="animate-bounce whitespace-nowrap rounded-xl border-[3px] border-zinc-900 bg-amber-400/80 backdrop-blur-sm px-4 py-2 text-xs font-black text-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]">
        <span className="flex items-center gap-1.5">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          <span className="tracking-tight">{message}</span>
        </span>
        <div className="absolute left-1/2 top-full -translate-x-1/2">
          <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-amber-400/80 -mt-[1px]" />
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-0 w-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-zinc-900 -translate-y-[1px] -z-10" />
        </div>
      </div>
    </div>
  )
}

function ManaSymbol({ symbol }) {
  const colors = {
    W: 'bg-zinc-200 text-zinc-900',
    U: 'bg-sky-400 text-white',
    B: 'bg-zinc-800 text-zinc-100',
    R: 'bg-red-500 text-white',
    G: 'bg-emerald-500 text-white',
  }
  const numeric = /^\d+$/.test(symbol)
  if (symbol === '') return null
  return (
    <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold leading-none shadow-sm ${numeric ? 'bg-zinc-600 text-zinc-100' : colors[symbol] || 'bg-zinc-600 text-zinc-100'}`}>
      {symbol}
    </span>
  )
}

function ManaCost({ cost }) {
  if (!cost) return null
  const symbols = cost.match(/\{(\w+)\}/g) || []
  return (
    <span className="inline-flex items-center gap-0.5">
      {symbols.map((s, i) => (
        <ManaSymbol key={i} symbol={s.replace(/[{}]/g, '')} />
      ))}
    </span>
  )
}

function ZonePile({ type, count, side = 'player', entrance = true, imageUrl }) {
  const isLibrary = type === 'library'
  const label = isLibrary ? 'MAZO' : 'CEMENTERIO'
  const borderColor = isLibrary ? 'border-amber-700/60' : 'border-zinc-600/60'

  return (
    <div className={`relative flex flex-col items-center gap-1 transition-all duration-500 ${entrance ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
      style={{ animationDelay: `${side === 'player' ? 300 : 150}ms` }}>
      <div className="relative w-[90px] h-[130px] max-sm:w-[60px] max-sm:h-[86px]">
        <div className={`absolute inset-0 rounded-lg border ${borderColor} bg-gradient-to-b from-zinc-900 to-zinc-950 rotate-6 translate-x-1`} />
        <div className={`absolute inset-0 rounded-lg border ${borderColor} bg-gradient-to-b from-zinc-900 to-zinc-950 -rotate-3 -translate-x-0.5`} />
        <div className={`absolute inset-0 rounded-lg border-2 ${borderColor} overflow-hidden`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900">
              {isLibrary ? (
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              ) : (
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-500/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              )}
            </div>
          )}
        </div>
        <span className={`absolute -top-2 -right-2 flex min-w-[22px] items-center justify-center rounded-full px-1 text-[11px] font-bold leading-tight shadow-lg ${
          isLibrary ? 'bg-amber-600 text-white' : 'bg-zinc-600 text-white'
        }`}>
          {count}
        </span>
      </div>
      <span className="text-[8px] font-semibold text-zinc-600 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function GameCard({ card, size = 'normal', onClick, highlighted, faceDown, attacking, tooltipMessage, visible = true, animate, index = 0, delay = 0 }) {
  const useAnim = animate !== undefined ? animate : visible
  const { url: imageUrl, status: imageStatus } = useCardImage(faceDown ? null : card.name)
  const [justClicked, setJustClicked] = useState(false)

  const cc = colorConfig[card.color] || colorConfig.B

  const sizeClasses = size === 'hand'
    ? 'w-[130px] h-[180px] max-sm:w-[80px] max-sm:h-[112px] cursor-pointer'
    : size === 'board'
    ? 'w-[110px] h-[150px] max-sm:w-[70px] max-sm:h-[100px]'
    : 'w-[100px] h-[140px] max-sm:w-[66px] max-sm:h-[94px]'

  const handleClick = useCallback(() => {
    if (!onClick) return
    setJustClicked(true)
    setTimeout(() => setJustClicked(false), 600)
    onClick()
  }, [onClick])

  const showTooltip = highlighted && !justClicked && tooltipMessage

  let borderColor = cc.border
  if (faceDown) borderColor = 'border-zinc-700'

  const animDelay = `${delay}ms`

  if (faceDown) {
    return (
      <div
        className={`relative shrink-0 rounded-lg border-2 ${borderColor} ${sizeClasses} overflow-hidden transition-all duration-300 ${visible ? (useAnim ? 'animate-zone-appear' : 'opacity-100') : 'opacity-0 scale-75'}`}
        style={useAnim ? { animationDelay: animDelay } : {}}
      >
        <img
          src={CARD_BACK_URL}
          alt="Dorso"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const isTapped = card.tapped
  const isHighlighted = highlighted

  return (
    <div className="relative">
      <CardTooltip message={tooltipMessage} visible={showTooltip} />
      <button
        onClick={handleClick}
        disabled={!onClick}
        className={`relative shrink-0 rounded-lg border-2 text-left transition-all duration-500 ${borderColor} ${sizeClasses} ${
          isTapped ? '-rotate-90' : ''
        } ${
          isHighlighted && !justClicked
            ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-900 scale-105 saturate-150 animate-glow-pulse'
            : 'saturate-90'
        } ${
          justClicked ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-900 scale-110 saturate-150 brightness-125' : ''
        } ${
          attacking ? 'translate-y-2 scale-105' : ''
        } ${
          onClick ? 'hover:scale-110 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-6 hover:z-50' : ''
        } ${
          card.tapped ? 'opacity-80' : ''
        } ${
          visible ? (useAnim ? 'animate-slide-up-card' : 'opacity-100') : 'opacity-0 translate-y-8'
        } overflow-hidden`}
        style={useAnim ? { animationDelay: animDelay } : {}}
      >
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${cc.from} ${cc.to} transition-opacity duration-700 ${imageStatus === 'loaded' ? 'opacity-0' : 'opacity-100'}`} />
          {imageStatus === 'loading' && (
            <div className="absolute inset-0 rounded-lg animate-pulse bg-gradient-to-t from-black/30 via-white/8 to-black/30" />
          )}
          {imageUrl && (
            <div
              className={`absolute inset-0 rounded-lg bg-cover bg-center transition-all duration-700 ease-out ${imageStatus === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent rounded-b-lg" />

        <div className="relative z-10 flex h-full flex-col p-1.5 sm:p-2">
          <div className="flex items-start justify-between gap-1">
            <p className={`text-[10px] sm:text-[11px] font-bold leading-tight drop-shadow-lg ${cc.name} ${size === 'board' ? 'mt-4 text-center w-full' : ''} line-clamp-2`}>
              {card.name}
            </p>
            {card.manaCost && !(size === 'board') && (
              <div className="shrink-0">
                <ManaCost cost={card.manaCost} />
              </div>
            )}
          </div>

          <div className="flex-1" />

          <div className="space-y-0.5">
            {size !== 'board' && card.typeLine && (
              <p className={`text-[7px] sm:text-[8px] opacity-80 leading-tight drop-shadow-lg ${cc.text}`}>
                {card.typeLine}
              </p>
            )}
            {card.power != null && (
              <div className={`flex items-center gap-1 ${isTapped ? 'rotate-90' : ''}`}>
                <span className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-[11px] font-bold border shadow-lg ${cc.border} ${cc.accent} backdrop-blur-sm ${cc.text}`}>
                  {card.power}
                </span>
                <span className="text-[8px] sm:text-[10px] text-zinc-500 drop-shadow-lg">/</span>
                <span className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-[11px] font-bold border shadow-lg ${cc.border} ${cc.accent} backdrop-blur-sm ${cc.text}`}>
                  {card.toughness}
                </span>
              </div>
            )}
          </div>
        </div>

        {isTapped && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rotate-90 text-[10px] font-bold tracking-widest text-zinc-400/60 uppercase drop-shadow-lg">GIRADA</div>
          </div>
        )}

        {(isHighlighted && !justClicked) && (
          <div className="absolute inset-0 rounded-lg ring-1 ring-yellow-400/60 animate-pulse pointer-events-none" />
        )}
      </button>
    </div>
  )
}

function GameCardSmall({ card, onClick, highlighted, attacking, tooltipMessage, visible = true, animate, index = 0, delay = 0 }) {
  const { url: imageUrl, status: imageStatus } = useCardImage(card.name)
  const [justClicked, setJustClicked] = useState(false)

  const cc = colorConfig[card.color] || colorConfig.B

  const handleClick = useCallback(() => {
    if (!onClick) return
    setJustClicked(true)
    setTimeout(() => setJustClicked(false), 600)
    onClick()
  }, [onClick])

  const showTooltip = highlighted && !justClicked && tooltipMessage
  const animDelay = `${delay}ms`
  const useAnim = animate !== undefined ? animate : visible

  return (
    <div className="relative">
      <CardTooltip message={tooltipMessage} visible={showTooltip} />
      <button
        onClick={handleClick}
        disabled={!onClick}
        className={`relative shrink-0 rounded-lg border-2 ${cc.border} text-left transition-all duration-300 overflow-hidden ${
          card.tapped ? '-rotate-90' : ''
        } ${
          highlighted && !justClicked
            ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-900 scale-105 saturate-150'
            : ''
        } ${
          justClicked ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-900 scale-110 saturate-150' : ''
        } ${
          attacking ? 'translate-y-2 scale-105' : ''
        } ${
          onClick ? 'hover:scale-110 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-4 hover:z-50 cursor-pointer' : ''
        } ${
          visible ? (useAnim ? 'animate-slide-up-card-small' : 'opacity-100') : 'opacity-0 translate-y-6'
        }           w-[90px] h-[130px] max-sm:w-[60px] max-sm:h-[86px]`}
        style={useAnim ? { animationDelay: animDelay } : {}}
      >
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${cc.from} ${cc.to} transition-opacity duration-700 ${imageStatus === 'loaded' ? 'opacity-0' : 'opacity-100'}`} />
          {imageStatus === 'loading' && (
            <div className="absolute inset-0 rounded-lg animate-pulse bg-gradient-to-t from-black/30 via-white/8 to-black/30" />
          )}
          {imageUrl && (
            <div
              className={`absolute inset-0 rounded-lg bg-cover bg-center transition-all duration-700 ease-out ${imageStatus === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-b-lg" />

        <div className="relative z-10 flex h-full flex-col items-center justify-between p-1.5">
          <p className={`text-[8px] sm:text-[9px] font-bold leading-tight text-center mt-1 drop-shadow-lg ${cc.name} line-clamp-2`}>
            {card.name}
          </p>
          {card.power != null && (
            <div className={`flex items-center gap-1 mb-1 ${card.tapped ? 'rotate-90' : ''}`}>
              <span className={`flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[8px] sm:text-[9px] font-bold border shadow-lg backdrop-blur-sm ${cc.border} ${cc.accent} ${cc.text}`}>
                {card.power}
              </span>
              <span className="text-[7px] sm:text-[8px] text-zinc-500">/</span>
              <span className={`flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[8px] sm:text-[9px] font-bold border shadow-lg backdrop-blur-sm ${cc.border} ${cc.accent} ${cc.text}`}>
                {card.toughness}
              </span>
            </div>
          )}
        </div>

        {(highlighted && !justClicked) && (
          <div className="absolute inset-0 rounded-lg ring-1 ring-yellow-400/60 animate-pulse pointer-events-none" />
        )}
      </button>
    </div>
  )
}

function LessonMenu({ onSelect, onBack }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            Demo Interactiva
          </span>
          <h1 className="bg-gradient-to-r from-indigo-300 via-purple-200 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Aprende a Jugar Magic
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Elige una lección interactiva. Jugarás en un escenario guiado donde aprenderás los fundamentos del juego paso a paso.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {TUTORIAL_LESSONS.map((lesson, li) => (
            <button
              key={lesson.id}
              onClick={() => onSelect(lesson)}
              className={`group relative overflow-hidden rounded-2xl border ${lesson.colorBorder} ${lesson.colorBg} p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50`}
              style={{ animation: `fadeInUp 0.5s ease-out forwards`, animationDelay: `${li * 150}ms` }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${lesson.colorBg === 'bg-emerald-500/10' ? 'from-emerald-500/20 to-emerald-600/20' : lesson.colorBg === 'bg-indigo-500/10' ? 'from-indigo-500/20 to-blue-600/20' : 'from-red-500/20 to-orange-600/20'} border ${lesson.colorBorder}`}>
                  <span className="text-lg">{lesson.id === 'selva-embrujada' ? '\u{1F33F}' : lesson.id === 'reflejos-azules' ? '\u{1F30A}' : '\u{1F525}'}</span>
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${lesson.colorText}`}>{lesson.title}</h3>
                  <p className="text-sm text-zinc-500">{lesson.subtitle}</p>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                {lesson.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {lesson.deckPreview.map((cardName, i) => (
                  <span key={i} className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-2.5 py-0.5 text-[11px] text-zinc-400">
                    {cardName}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-zinc-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lesson.scenes.length} pasos interactivos
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}

function DrawRevealCard({ cardName }) {
  const cc = colorConfig[cardName === 'Bosque' || cardName === 'Llanura' || cardName === 'Montaña' || cardName === 'Isla' ? 'land' : cardName.includes('Show-Off') ? 'R' : 'G'] || colorConfig.B
  const { url: imageUrl, status: imageStatus } = useCardImage(cardName)

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${cc.from} ${cc.to} transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-0' : 'opacity-100'}`} />
      {imageUrl && (
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${imageStatus === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-between p-1.5">
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[8px] font-bold bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5 text-yellow-400 leading-tight">
            +1
          </span>
        </div>
        <p className="text-[9px] font-bold text-center text-white drop-shadow-lg leading-tight px-1">
          {cardName}
        </p>
      </div>
      <div className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-bold text-zinc-900 shadow-lg animate-pulse">
        ✦
      </div>
    </div>
  )
}

function AttackFly({ card, damage }) {
  const cc = colorConfig[card.color === 'land' ? 'land' : card.color] || colorConfig.B
  const { url: imageUrl, status: imageStatus } = useCardImage(card.name)

  return (
    <div className="fixed inset-0 z-[997] pointer-events-none">
      {/* Wind/trail streaks - follow the card's arc */}
      <div className="absolute bottom-[35%] left-1/2 -ml-20"><div className="w-[110px] h-[2px] bg-gradient-to-r from-transparent via-red-400/60 to-transparent rounded-full blur-[2px] animate-wind-streak" /></div>
      <div className="absolute bottom-[35%] left-1/2 -ml-10"><div className="w-[140px] h-[3px] bg-gradient-to-r from-transparent via-orange-400/50 to-transparent rounded-full blur-[1px] animate-wind-streak" style={{ animationDelay: '0.1s' }} /></div>
      <div className="absolute bottom-[35%] left-1/2 ml-10"><div className="w-[120px] h-[2px] bg-gradient-to-r from-transparent via-red-400/50 to-transparent rounded-full blur-[2px] animate-wind-streak" style={{ animationDelay: '0.15s' }} /></div>
      <div className="absolute bottom-[35%] left-1/2 ml-20"><div className="w-[90px] h-[2px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent rounded-full blur-[1px] animate-wind-streak" style={{ animationDelay: '0.2s' }} /></div>
      <div className="absolute bottom-[35%] left-1/2 -ml-28"><div className="w-[70px] h-[1.5px] bg-gradient-to-r from-transparent via-red-400/40 to-transparent rounded-full blur-[1px] animate-wind-streak" style={{ animationDelay: '0.05s' }} /></div>
      <div className="absolute bottom-[35%] left-1/2 ml-28"><div className="w-[60px] h-[1.5px] bg-gradient-to-r from-transparent via-orange-400/30 to-transparent rounded-full blur-[1px] animate-wind-streak" style={{ animationDelay: '0.25s' }} /></div>

      {/* Card */}
      <div className="animate-card-attack absolute bottom-[35%] left-1/2 w-[90px] h-[126px] max-sm:w-[64px] max-sm:h-[90px] -translate-x-1/2 rounded-xl border-[3px] overflow-hidden shadow-2xl shadow-red-500/30 border-red-500/50">
        <div className={`absolute inset-0 bg-gradient-to-br ${cc.from} ${cc.to} transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-0' : 'opacity-100'}`} />
        {imageUrl && (
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${imageStatus === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg">
          {damage}
        </div>
      </div>
    </div>
  )
}

function getAllCards(state) {
  return [
    ...(state.playerHand || []),
    ...(state.playerBoard || []),
    ...(state.opponentBoard || []),
    ...(state.opponentGraveyard || []),
    ...(state.playerGraveyard || []),
  ]
}

function PopupCard({ card }) {
  const { url: imageUrl, status: imageStatus } = useCardImage(card.name)
  const cc = colorConfig[card.color === 'land' ? 'land' : card.color] || colorConfig.B

  return (
    <div className={`relative w-28 h-40 rounded-xl border-2 overflow-hidden animate-pulse shadow-lg shadow-indigo-500/30 ${cc.border}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${cc.from} ${cc.to} transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-0' : 'opacity-100'}`} />
      {imageUrl && (
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${imageStatus === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-between p-2">
        {card.power != null && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-bold bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5 text-yellow-400">
              {card.power}/{card.toughness}
            </span>
          </div>
        )}
        <p className="text-[10px] font-bold text-center text-white drop-shadow-lg leading-tight px-1">
          {card.name}
        </p>
      </div>
      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-bold text-zinc-900 shadow-lg animate-ping opacity-75">
        ✦
      </div>
    </div>
  )
}

function InteractionPopup({ popup, cards, onDismiss }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDismiss() } }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onDismiss])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4" onClick={onDismiss}>
      <div className="animate-in zoom-in-95 duration-200 rounded-2xl border border-zinc-700/80 bg-zinc-900/95 p-5 sm:p-6 max-w-sm w-full shadow-2xl shadow-indigo-500/10 backdrop-blur-xl" onClick={e => e.stopPropagation()}>
        {popup.title && (
          <h3 className="text-base font-bold text-indigo-300 mb-3 text-center leading-tight">{popup.title}</h3>
        )}

        <div className="flex justify-center gap-4 mb-4">
          {cards.map((card, i) => (
            <PopupCard key={card.id || i} card={card} />
          ))}
        </div>

        <p className="text-sm text-zinc-300 text-center leading-relaxed">{popup.description}</p>

        <button
          onClick={onDismiss}
          className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-600/25 active:scale-[0.98]"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

function GameBoard({ lesson, sceneIdx, onCardClick, phaseBanner, lifeRecoil }) {
  const scene = lesson.scenes[sceneIdx]
  const { state } = scene
  const isLessonComplete = scene.phase === 'Lección Completada'
  const entrance = useEntranceAnimation(sceneIdx === 0 ? 0 : -1)

  const interaction = scene.interaction
  const isClickHand = interaction.type === 'click_hand'
  const isClickBoard = interaction.type === 'click_board'

  const prevCardIdsRef = useRef(new Set())
  const libraryRef = useRef(null)

  const [drawAnim, setDrawAnim] = useState({ phase: 'idle', card: null })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const [selectedCardId, setSelectedCardId] = useState(null)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setSelectedCardId(null)
    const ids = new Set()
    state.playerHand.forEach(c => ids.add(c.id))
    state.playerBoard.forEach(c => ids.add(c.id))
    state.opponentBoard.forEach(c => ids.add(c.id))
    prevCardIdsRef.current = ids
  }, [sceneIdx])

  useEffect(() => {
    if (scene.phase.includes('Inicio') && sceneIdx > 0) {
      const prevScene = lesson.scenes[sceneIdx - 1]
      const prevIds = new Set(prevScene.state.playerHand.map(c => c.id))
      const newCards = state.playerHand.filter(c => !prevIds.has(c.id))

      if (newCards.length > 0) {
        const card = newCards[0]
        setDrawAnim({ phase: 'flying', card })

        const t1 = setTimeout(() => {
          setDrawAnim(prev => ({ ...prev, phase: 'flipping' }))
        }, 1500)

        const t2 = setTimeout(() => {
          setDrawAnim({ phase: 'idle', card: null })
        }, 2800)

        return () => {
          clearTimeout(t1)
          clearTimeout(t2)
        }
      }
    }
  }, [sceneIdx])

  function getCardAnim(cardId) {
    if (sceneIdx === 0) return entrance
    return !prevCardIdsRef.current.has(cardId)
  }

  const playerDeckCount = 20 + Math.max(0, 7 - state.playerHand.length)
  const opponentDeckCount = 20 + Math.max(0, 7 - state.opponentHandCount)
  const playerGraveyardCount = (state.playerGraveyard?.length || 0) + 2
  const opponentGraveyardCount = (state.opponentGraveyard?.length || 0) + 1

  const playerGraveCard = state.playerGraveyard?.[0]
  const opponentGraveCard = state.opponentGraveyard?.[0]
  const { url: playerGraveUrl } = useCardImage(playerGraveCard?.name)
  const { url: opponentGraveUrl } = useCardImage(opponentGraveCard?.name)

  const boardVisible = sceneIdx === 0 ? entrance : true

  return (
    <div className={`flex flex-row min-h-[calc(100vh-4rem)] transition-all duration-500 ${boardVisible ? 'opacity-100' : 'opacity-0'}`}>
      <PhaseChangeBanner
        phase={phaseBanner.phase}
        visible={phaseBanner.visible}
        instruction={phaseBanner.instruction}
      />
      <div className="battlefield-magic flex-1 px-2 py-2 sm:px-4 sm:py-3 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div className={`relative mb-1.5 sm:mb-2 flex items-center justify-between rounded-xl border border-zinc-700/50 bg-zinc-950/70 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 transition-all duration-500 ${boardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className={`rounded-md px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold ${
              isLessonComplete
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-indigo-500/20 text-indigo-300'
            }`}>
              {scene.phase}
            </span>
            <span className="text-[9px] sm:text-[10px] text-zinc-500">
              Paso {sceneIdx + 1}/{lesson.scenes.length}
            </span>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className={`text-sm font-bold text-red-400 tabular-nums ${lifeRecoil ? 'animate-life-recoil' : ''}`}>{state.opponentLife}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-zinc-500 sm:inline">P. {sceneIdx + 1}/{lesson.scenes.length}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {/* Opponent side */}
          <div className={`mb-3 transition-all duration-500 delay-75 ${boardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {/* Opponent zones row: hand + library/graveyard */}
            <div className="flex items-start justify-center gap-3 mb-1.5">
              <div className="flex justify-center items-start py-2 overflow-visible">
                {Array.from({ length: state.opponentHandCount }).map((_, i, arr) => {
                  const total = arr.length
                  const mid = (total - 1) / 2
                  const offset = i - mid
                  const rotation = offset * 2.5
                  const zIdx = total - Math.abs(Math.round(offset))
                  const baseOverlap = total <= 3 ? 43 : total <= 4 ? 34 : total <= 5 ? 28 : 22
                  const overlapPx = isMobile ? baseOverlap + 8 : baseOverlap
                  return (
                    <div
                      key={i}
                      className="relative shrink-0"
                      style={{
                        marginLeft: i === 0 ? 0 : `-${overlapPx}px`,
                        zIndex: zIdx,
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: 'top center',
                      }}
                    >
                      <GameCard
                        card={{ color: 'land', name: '', typeLine: '', manaCost: '', cmc: 0, power: null, toughness: null, tapped: false }}
                        faceDown
                        size="small"
                        visible={true}
                        animate={sceneIdx === 0 ? entrance : false}
                        index={i}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-2">
                <ZonePile type="library" count={opponentDeckCount} side="opponent" entrance={boardVisible} imageUrl={CARD_BACK_URL} />
                <ZonePile type="graveyard" count={opponentGraveyardCount} side="opponent" entrance={boardVisible} imageUrl={opponentGraveUrl} />
              </div>
            </div>
            {state.opponentBoard.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center mb-1.5 pl-1">
                {state.opponentBoard.map((card) => (
                  <GameCardSmall key={card.id} card={card} visible={true} animate={getCardAnim(card.id)} delay={75} />
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className={`relative my-1.5 sm:my-2 transition-all duration-500 delay-150 ${boardVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-900/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="battlefield-field bg-zinc-950/60 backdrop-blur-sm px-3 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-600/80 uppercase tracking-[0.2em] rounded-full border border-amber-900/20">
                CAMPO DE BATALLA
              </span>
            </div>
          </div>

          {/* Player side */}
          <div className={`mb-2 transition-all duration-500 delay-200 ${boardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {state.playerBoard.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center mb-1.5 pl-1">
                {state.playerBoard.map((card) => {
                  const isHighlighted = isClickBoard && interaction.highlightIds?.includes(card.id)
                  return (
                    <GameCardSmall
                      key={card.id}
                      card={card}
                      onClick={isHighlighted ? () => onCardClick(card.id, 'board') : null}
                      highlighted={isHighlighted}
                      tooltipMessage={isHighlighted ? getTooltipMessage(card, 'click_board') : null}
                      visible={true}
                      animate={getCardAnim(card.id)}
                      delay={200}
                    />
                  )
                })}
              </div>
            )}
            {/* Player zones row: library/graveyard + hand */}
            <div className="flex items-end justify-center gap-2 sm:gap-3 mt-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ZonePile type="library" count={playerDeckCount} side="player" entrance={boardVisible} imageUrl={CARD_BACK_URL} />
                <ZonePile type="graveyard" count={playerGraveyardCount} side="player" entrance={boardVisible} imageUrl={playerGraveUrl} />
              </div>
              <div className="flex justify-center items-end py-2 overflow-visible px-2 sm:px-8 max-sm:px-0">
                {state.playerHand.map((card, i, arr) => {
                  const isHighlighted = isClickHand && interaction.highlightIds?.includes(card.id)
                  const total = arr.length
                  const mid = (total - 1) / 2
                  const offset = i - mid
                  const baseRotation = isMobile && total > 5 ? 2.5 : 3
                  const rotation = offset * baseRotation
                  const isSelected = selectedCardId === card.id
                  const zIdx = isSelected ? 999 : total - Math.abs(Math.round(offset))
                  const baseOverlap = total <= 3 ? 56 : total <= 4 ? 44 : total <= 5 ? 36 : 28
                  const overlapPx = isMobile ? baseOverlap + 10 : baseOverlap
                  const lift = isSelected ? '-translate-y-4 sm:-translate-y-6' : ''
                  return (
                    <div
                      key={card.id}
                      className={`relative shrink-0 transition-transform duration-200 ${lift}`}
                      style={{
                        marginLeft: i === 0 ? 0 : `-${overlapPx}px`,
                        zIndex: zIdx,
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: 'bottom center',
                      }}
                    >
                      <GameCard
                        card={card}
                        size="hand"
                        onClick={() => {
                          if (isHighlighted) {
                            setSelectedCardId(null)
                            onCardClick(card.id, 'hand')
                          } else {
                            setSelectedCardId(selectedCardId === card.id ? null : card.id)
                          }
                        }}
                        highlighted={isHighlighted}
                        tooltipMessage={isHighlighted ? getTooltipMessage(card, 'click_hand') : null}
                        visible={true}
                        animate={getCardAnim(card.id)}
                        delay={250}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Draw animation overlay */}
        {drawAnim.phase !== 'idle' && drawAnim.card && (
          <div className="fixed inset-0 z-[999] pointer-events-none flex items-center justify-center">
            <div className={`
              w-[100px] h-[140px] max-sm:w-[72px] max-sm:h-[102px] rounded-xl border-[3px] overflow-hidden shadow-2xl
              ${drawAnim.phase === 'flying'
                ? 'animate-card-fly border-amber-500/40 shadow-amber-500/30'
                : 'animate-card-flip border-yellow-400/60 shadow-yellow-400/40'
              }
            `}>
              {drawAnim.phase === 'flying' ? (
                <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900">
                  <div className="absolute inset-2 rounded-lg border-2 border-dashed border-amber-600/30" />
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-8 w-8 text-amber-500/80" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span className="text-[8px] font-bold text-amber-600/80 uppercase tracking-widest">Robando</span>
                  </div>
                </div>
              ) : (
                <DrawRevealCard cardName={drawAnim.card.name} />
              )}
            </div>
          </div>
        )}

        {/* Player life + progress bar */}
        <div className={`pt-2 transition-all duration-500 delay-300 ${boardVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between rounded-xl border border-zinc-800/50 bg-zinc-950/40 backdrop-blur-sm px-3 py-2">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-sm font-bold text-emerald-400 tabular-nums">{state.playerLife}</span>
            </div>
            <div className="flex items-center gap-1">
              {lesson.scenes.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i < sceneIdx ? 'w-2 bg-emerald-500' : i === sceneIdx ? 'w-5 bg-indigo-500 shadow-lg shadow-indigo-500/50' : 'w-1.5 bg-zinc-700/50'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-zinc-600 tabular-nums">{sceneIdx + 1}/{lesson.scenes.length}</span>
          </div>
        </div>
      </div>
      {/* Phase ladder */}
      <div className={`hidden sm:flex items-center pr-3 transition-all duration-500 delay-300 ${boardVisible ? 'opacity-100' : 'opacity-0'}`}>
        <PhaseLadder currentPhase={scene.phase} />
      </div>
    </div>
  )
}

const PHASE_STEPS = [
  { key: 'Inicio del Turno', short: 'Inicio', color: 'bg-indigo-500', activeColor: 'shadow-indigo-500/60' },
  { key: 'Fase Principal', short: 'Principal', color: 'bg-emerald-500', activeColor: 'shadow-emerald-500/60' },
  { key: 'Fase de Combate', short: 'Combate', color: 'bg-red-500', activeColor: 'shadow-red-500/60' },
  { key: 'Turno del Oponente', short: 'Oponente', color: 'bg-zinc-500', activeColor: 'shadow-zinc-500/60' },
  { key: 'Lección Completada', short: 'Fin', color: 'bg-amber-500', activeColor: 'shadow-amber-500/60' },
]

function PhaseLadder({ currentPhase }) {
  const currentIdx = PHASE_STEPS.findIndex(p => currentPhase?.includes(p.key.split(' ')[0]))

  return (
    <div className="flex flex-col items-end gap-1">
      {PHASE_STEPS.map((step, i) => {
        const isActive = i === currentIdx
        const isPast = i < currentIdx
        return (
          <div key={step.key} className={`flex items-center gap-1.5 transition-all duration-700 ${
            isPast ? 'opacity-30' : isActive ? 'opacity-100' : 'opacity-20'
          }`}>
            <span className={`text-[9px] font-bold uppercase tracking-wider transition-all duration-500 ${
              isActive ? 'text-zinc-200' : 'text-zinc-600'
            }`}>
              {step.short}
            </span>
            <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
              isActive
                ? `${step.color} scale-150 shadow-lg ${step.activeColor}`
                : isPast
                ? `${step.color} opacity-60`
                : 'bg-zinc-700'
            }`} />
          </div>
        )
      })}
    </div>
  )
}

function PhaseChangeBanner({ phase, visible, instruction }) {
  const step = PHASE_STEPS.find(p => phase?.includes(p.key.split(' ')[0]))
  if (!step) return null

  return (
    <div className={`pointer-events-none fixed top-20 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className={`rounded-xl border-[3px] border-zinc-900 bg-zinc-950/90 backdrop-blur-md px-5 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]`}>
        <div className="flex items-center gap-2 mb-1">
          <div className={`h-2.5 w-2.5 rounded-full ${step.color} shadow-lg`} />
          <span className={`text-xs font-black uppercase tracking-widest ${step.color.replace('bg-', 'text-')}`}>
            {phase}
          </span>
        </div>
        {instruction && (
          <p className="text-[11px] text-zinc-400 max-w-md leading-relaxed">{instruction}</p>
        )}
      </div>
    </div>
  )
}

export default function GameDemo({ onBack }) {
  const [lesson, setLesson] = useState(null)
  const [sceneIdx, setSceneIdx] = useState(0)
  const [advancing, setAdvancing] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [phaseBanner, setPhaseBanner] = useState({ visible: false, phase: '', instruction: '' })
  const [popupData, setPopupData] = useState(null)
  const [attackAnim, setAttackAnim] = useState(null)
  const [hitVisible, setHitVisible] = useState(false)
  const advanceTimer = useRef(null)
  const pendingAttackRef = useRef(null)
  const prevPhaseRef = useRef('')

  const scene = lesson?.scenes[sceneIdx]
  const isLast = sceneIdx >= (lesson?.scenes?.length ?? 1) - 1

  const advance = useCallback(() => {
    if (advancing) return
    clearTimeout(advanceTimer.current)
    setAdvancing(true)
    setTransitioning(true)

    const cur = lesson.scenes[sceneIdx]
    const next = lesson.scenes[sceneIdx + 1]
    if (next && cur.interaction.type === 'click_board') {
      const cardId = cur.interaction.highlightIds?.[0]
      const card = cardId ? cur.state.playerBoard.find(c => c.id === cardId) : null
      if (card) {
        const oppLifeDrop = cur.state.opponentLife - next.state.opponentLife
        const deadOpp = cur.state.opponentBoard.find(
          oc => !next.state.opponentBoard.some(nc => nc.id === oc.id)
        )
        if (oppLifeDrop > 0) {
          pendingAttackRef.current = { card, damage: oppLifeDrop, type: 'direct' }
        } else if (deadOpp) {
          pendingAttackRef.current = { card, damage: card.power || 0, type: 'combat' }
        }
      }
    }

    setTimeout(() => {
      setSceneIdx(i => {
        if (i < lesson.scenes.length - 1) {
          return i + 1
        }
        return i
      })
      setAdvancing(false)
      setTimeout(() => setTransitioning(false), 100)
    }, 400)
  }, [advancing, lesson, sceneIdx])

  const shouldAuto = useCallback((s, last) => {
    if (!s) return false
    if (s.interaction.type === 'auto') return true
    if (s.interaction.type === 'button' && !last) return true
    return false
  }, [])

  useEffect(() => {
    if (!scene) return
    if (prevPhaseRef.current !== scene.phase) {
      setPhaseBanner({ visible: true, phase: scene.phase, instruction: scene.instruction })
      const t = setTimeout(() => setPhaseBanner(prev => ({ ...prev, visible: false })), 3500)
      prevPhaseRef.current = scene.phase
      return () => clearTimeout(t)
    }
  }, [scene?.phase, scene?.instruction])

  useEffect(() => {
    if (!lesson) return
    const nextIdx = sceneIdx + 1
    if (nextIdx >= lesson.scenes.length) return
    const nextScene = lesson.scenes[nextIdx]
    const allCards = [
      ...nextScene.state.playerHand,
      ...nextScene.state.playerBoard,
      ...nextScene.state.opponentBoard,
    ]
    allCards.forEach(card => {
      if (!card.name || CARD_IMAGE_CACHE.has(card.name)) return
      ensureCardImage(card.name)
    })
  }, [sceneIdx, lesson])

  const handleCardClick = useCallback((cardId, location) => {
    if (!scene?.interaction) return
    if (scene.interaction.type === 'auto') return
    if (scene.interaction.type === 'button') return

    const isHighlighted = scene.interaction.highlightIds?.includes(cardId)
    if (isHighlighted) {
      advance()
    }
  }, [scene, advance])

  const handleButtonClick = useCallback(() => {
    if (isLast) {
      prevPhaseRef.current = ''
      setLesson(null)
      setSceneIdx(0)
      return
    }
    advance()
  }, [advance, isLast])

  const handleSelectLesson = useCallback((l) => {
    prevPhaseRef.current = ''
    setLesson(l)
    setSceneIdx(0)
  }, [])

  const handleExit = useCallback(() => {
    prevPhaseRef.current = ''
    setLesson(null)
    setSceneIdx(0)
  }, [])

  const dismissPopup = useCallback(() => {
    setPopupData(null)
    if (pendingAttackRef.current) {
      const attack = pendingAttackRef.current
      pendingAttackRef.current = null
      setAttackAnim(attack)
      if (attack.type === 'combat') {
        setTimeout(() => setHitVisible(true), 200)
      } else {
        setTimeout(() => setHitVisible(true), 600)
      }
      setTimeout(() => {
        setAttackAnim(null)
        setHitVisible(false)
      }, 1500)
    }
  }, [])

  useEffect(() => {
    if (!lesson) { setPopupData(null); return }
    const s = lesson.scenes[sceneIdx]
    if (!s) { setPopupData(null); return }
    if (s.popup) {
      const cardIds = s.popup.cardIds || []
      const allCards = getAllCards(s.state)
      const cards = cardIds.map(id => allCards.find(c => c.id === id)).filter(Boolean)
      if (cards.length > 0) {
        setPopupData({ popup: s.popup, cards })
        return
      }
    }
    setPopupData(null)
  }, [sceneIdx, lesson])

  useEffect(() => {
    if (!scene || !lesson || popupData) return
    const isLastScene = sceneIdx >= lesson.scenes.length - 1
    if (shouldAuto(scene, isLastScene)) {
      const delay = scene.interaction.type === 'auto'
        ? (scene.interaction.delay || 2000)
        : 2500
      advanceTimer.current = setTimeout(() => advance(), delay)
      return () => clearTimeout(advanceTimer.current)
    }
  }, [sceneIdx, scene, lesson, advance, shouldAuto, popupData])

  if (!lesson) {
    return <LessonMenu onSelect={handleSelectLesson} onBack={onBack} />
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-zinc-950">
      <GameBoard
        key={lesson.id}
        lesson={lesson}
        sceneIdx={sceneIdx}
        onCardClick={handleCardClick}
        phaseBanner={phaseBanner}
        lifeRecoil={hitVisible && attackAnim?.type === 'direct'}
      />

      {/* Bottom tutorial panel */}
      <div className={`sticky bottom-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl transition-opacity duration-300 ${transitioning ? 'opacity-50' : 'opacity-100'}`}>
        <div className="mx-auto max-w-4xl px-3 py-2 sm:px-4 sm:py-4 max-sm:px-1.5 max-sm:py-1.5">
          <div className="space-y-1.5 sm:space-y-2">
            {scene.tip && (
            <div className="mb-1.5 sm:mb-2 flex items-start gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-1 sm:px-2.5 sm:py-1.5 max-sm:px-1.5 max-sm:py-0.5">
              <span className="mt-0.5 shrink-0 text-[11px] text-amber-400">💡</span>
              <p className="text-[11px] leading-relaxed text-amber-200/80 max-sm:text-[9px] max-sm:leading-snug">{scene.tip}</p>
            </div>
            )}

          <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line max-sm:text-[11px] max-sm:leading-snug">
            {scene.instruction
              .replace(/\*\*(.+?)\*\*/g, '<strong class="text-indigo-300 font-semibold">$1</strong>')
              .split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  <span dangerouslySetInnerHTML={{ __html: line }} />
                </span>
              ))}
          </p>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              onClick={handleExit}
              className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[11px] text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300"
            >
              Salir
            </button>

            <div className="flex items-center gap-2">
              {scene.interaction.type === 'button' && (
                <button
                  onClick={handleButtonClick}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 ${
                    isLast
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/25'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25'
                  }`}
                >
                  {scene.interaction.label || (isLast ? 'Finalizar' : 'Siguiente')}
                  {!isLast && (
                    <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                  )}
                </button>
              )}

              {scene.interaction.type === 'button' && !isLast && (
                <span className="text-[10px] text-zinc-600">Automático...</span>
              )}

              {scene.interaction.type === 'click_hand' && (
                <span className="flex items-center gap-1.5 text-[11px] text-yellow-400 animate-pulse font-medium">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                  </svg>
                  Toca una carta resaltada
                </span>
              )}

              {scene.interaction.type === 'click_board' && (
                <span className="flex items-center gap-1.5 text-[11px] text-yellow-400 animate-pulse font-medium">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                  </svg>
                  Toca una carta en el campo
                </span>
              )}

              {scene.interaction.type === 'auto' && !isLast && (
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  Avanzando...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {attackAnim && attackAnim.type !== 'combat' && (
        <AttackFly card={attackAnim.card} damage={attackAnim.damage} />
      )}

      {hitVisible && (
        <div className={`fixed inset-0 z-[998] pointer-events-none flex ${attackAnim?.type === 'combat' ? 'items-center justify-center' : 'items-start justify-center pt-[7%]'}`}>
          <div className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/10 animate-hit-flash" />
          <div className="absolute w-20 h-20 rounded-full border-[3px] border-red-400/80 animate-hit-ring" />
          <div className="absolute w-36 h-36 rounded-full border-2 border-red-400/40 animate-hit-ring" style={{ animationDelay: '0.08s' }} />
          <div className="absolute pt-4 flex items-center gap-2 animate-hit-damage">
            <span className="text-4xl sm:text-5xl font-black text-red-400 drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]">-{attackAnim?.damage}</span>
          </div>
        </div>
      )}

      {popupData && (
        <InteractionPopup
          popup={popupData.popup}
          cards={popupData.cards}
          onDismiss={dismissPopup}
        />
      )}
    </div>
  )
}