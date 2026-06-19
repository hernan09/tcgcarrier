import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TUTORIAL_LESSONS } from '../data/tutorialLessons'
import { ManaSymbol, ManaSymbolGroup } from './ManaSymbol'

const CARD_IMAGE_CACHE = new Map([
  ['Bosque', 'https://cards.scryfall.io/normal/front/5/f/5f533364-0f91-4e49-aaeb-83c4c1f6d316.jpg?1777658419'],
  ['Montaña', 'https://cards.scryfall.io/normal/front/5/1/51acfb01-4b0b-48fc-9704-a9b4a1e43a23.jpg?1777658413'],
  ['Llanura', 'https://cards.scryfall.io/normal/front/2/4/24dc369c-020a-4115-a4bb-d60a44de64e3.jpg?1777658393'],
  ['Isla', 'https://cards.scryfall.io/normal/front/7/3/739aaaac-c424-4ea7-a084-62a6fc0438b0.jpg?1777658399'],
  ['Pantano', 'https://cards.scryfall.io/normal/front/c/5/c5f590a3-9993-4ac4-a93c-1beb44eda17b.jpg?1777658405'],
  ['Llanowar Elves', 'https://cards.scryfall.io/normal/front/6/a/6a0b230b-d391-4998-a3f7-7b158a0ec2cd.jpg?1731652605'],
  ['Oso Gris', 'https://cards.scryfall.io/normal/front/4/0/409f9b88-f03e-40b6-9883-68c14c37c0de.jpg?1562546736'],
  ['Lobo de Plata', 'https://cards.scryfall.io/normal/front/9/d/9d33e866-cfd8-44e6-8070-df8df1ce965d.jpg?1562557734'],
  ['Crecimiento Gigante', 'https://cards.scryfall.io/normal/front/f/d/fd1f95bf-48ea-455a-8a6c-0249b11c8900.jpg?1780919986'],
  ['Goblin Rezagado', 'https://cards.scryfall.io/normal/front/3/4/3480927c-10da-4817-9954-10aea2bc7100.jpg?1605206526'],
  ['Slickshot Show-Off', 'https://cards.scryfall.io/normal/front/7/0/7054012b-4f9d-44a0-aaf9-7fd3bddc7b2d.jpg?1712355850'],
  ['Lightning Strike', 'https://cards.scryfall.io/normal/front/8/8/88b13bc0-da54-4c3b-917c-7c8345a329f5.jpg?1780919889'],
  ['Cancelar', 'https://cards.scryfall.io/normal/front/4/7/475bff39-220a-4490-9c2e-d311e306a6db.jpg?1730490517'],
  ['Garra Ígnea', 'https://cards.scryfall.io/normal/front/7/0/702c4781-670b-49ae-b511-90ed119841b0.jpg?1775600379'],
  ['Rino de Estampida', 'https://cards.scryfall.io/normal/front/c/d/cd02ae80-4af6-4da1-ba3b-b56068c49785.jpg?1562200915'],
  ['Asesinato', 'https://cards.scryfall.io/normal/front/2/c/2c249609-9cf7-46f1-b94c-9329add966bb.jpg?1726286259'],
  ['Gremlin de Sulfuro', 'https://cards.scryfall.io/normal/front/0/8/083ec3e7-950c-4e9d-aba5-02ed13d723f0.jpg?1562631492'],
  ['Serra Angel', 'https://cards.scryfall.io/normal/front/b/8/b8c5e74c-96e7-4a1f-93b7-14d776fe4b2d.jpg?1775599758'],
])
const IN_FLIGHT_REQUESTS = new Map()
const CARD_BACK_URL = 'https://cards.scryfall.io/back.png'
const RATE_LIMIT_MS = 600
let lastRequestTime = 0
function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}
async function nextRequestSlot() {
  const now = Date.now()
  const wait = Math.max(0, RATE_LIMIT_MS - (now - lastRequestTime))
  lastRequestTime = now + wait
  return delay(wait)
}
function extractImageUrl(data) {
  if (!data) return null
  let urls = data.image_uris
  if (!urls && data.card_faces?.length > 0) {
    urls = data.card_faces[0].image_uris
  }
  if (!urls) return null
  return urls.normal || urls.large || urls.small || urls.border_crop || urls.png || null
}

const LAND_MANA_COLORS = {
  Bosque: 'G',
  Montaña: 'R',
  Isla: 'U',
  Llanura: 'W',
  Pantano: 'B',
}

const PREVIEW_CARD_COLORS = {
  'Llanowar Elves': 'G',
  'Oso Gris': 'G',
  'Crecimiento Gigante': 'G',
  'Lightning Strike': 'R',
  'Slickshot Show-Off': 'R',
  'Lobo de Plata': 'W',
  'Cancelar': 'U',
  'Asesinato': 'B',
  'Vampiro Sengir': 'B',
  'Goblin Rezagado': 'R',
  'Gremlin de Sulfuro': 'R',
  'Garra Ígnea': 'R',
  'Rino de Estampida': 'G',
  'Serra Angel': 'W',
}

function getPreviewCardColor(cardName, fallbackColors) {
  return LAND_MANA_COLORS[cardName] || PREVIEW_CARD_COLORS[cardName] || fallbackColors?.[0] || null
}

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
  'Rino de Estampida': 'Stampeding Rhino',
  'Pantano': 'Swamp',
  'Asesinato': 'Murder',
  'Gremlin de Sulfuro': 'Goblin Piker',
}

function getApiCardName(cardName) {
  return API_CARD_NAMES[cardName] || cardName
}

async function fetchFromScryfall(url) {
  await nextRequestSlot()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    if (res.status === 429) {
      await delay(1000)
      return fetchFromScryfall(url)
    }
    if (res.ok) return await res.json()
    return null
  } catch {
    clearTimeout(timeout)
    return null
  }
}

async function fetchAndPreload(cardName) {
  const apiName = getApiCardName(cardName)
  const encoded = encodeURIComponent(apiName)

  let data = await fetchFromScryfall(
    `https://api.scryfall.com/cards/named?exact=${encoded}&format=json`
  )

  if (!data) {
    data = await fetchFromScryfall(
      `https://api.scryfall.com/cards/named?fuzzy=${encoded}&format=json`
    )
  }

  let imageUrl = extractImageUrl(data)

  if (!imageUrl && data?.oracle_id) {
    const prints = await fetchFromScryfall(
      `https://api.scryfall.com/cards/search?q=oracleid:${data.oracle_id}&unique=prints&order=released`
    )
    if (prints?.data) {
      for (const card of prints.data) {
        imageUrl = extractImageUrl(card)
        if (imageUrl) break
      }
    }
  }

  if (imageUrl) {
    CARD_IMAGE_CACHE.set(cardName, imageUrl)
    return imageUrl
  }
  CARD_IMAGE_CACHE.set(cardName, null)
  return null
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

const CARD_COLOR_HEX = {
  W: '#fbbf24',
  U: '#38bdf8',
  B: '#a78bfa',
  R: '#f87171',
  G: '#34d399',
  land: '#78716c',
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

function ManaCost({ cost }) {
  if (!cost) return null
  const symbols = cost.match(/\{(\w+)\}/g) || []
  return (
    <span className="inline-flex items-center gap-0.5">
      {symbols.map((s, i) => (
        <ManaSymbol key={i} symbol={s.replace(/[{}]/g, '')} size="cost" />
      ))}
    </span>
  )
}

const LESSON_TEXT_TOKEN_RE = /(\*\*[^*]+\*\*|\{\w+\})/g

function parseLessonTextSegment(text, keyPrefix = '') {
  if (!text) return null
  return text.split(LESSON_TEXT_TOKEN_RE).filter(Boolean).map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-indigo-300">
          {part.slice(2, -2)}
        </strong>
      )
    }
    const manaMatch = part.match(/^\{(\w+)\}$/)
    if (manaMatch) {
      return (
        <ManaSymbol
          key={key}
          symbol={manaMatch[1]}
          size="cost"
          shadow={false}
          className="mx-px align-[-2px] inline-block"
        />
      )
    }
    return part
  })
}

function LessonRichText({ text, className = '' }) {
  if (!text) return null
  const lines = text.split('\n')
  return (
    <span className={className}>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx}>
          {lineIdx > 0 ? <br /> : null}
          {parseLessonTextSegment(line, `l${lineIdx}`)}
        </span>
      ))}
    </span>
  )
}

function ZonePile({ type, count, side = 'player', entrance = true, imageUrl }) {
  const isLibrary = type === 'library'
  const label = isLibrary ? 'MAZO' : 'CEMENTERIO'
  const borderColor = isLibrary ? 'border-amber-700/60' : 'border-zinc-600/60'

  return (
    <motion.div
      className="relative flex flex-col items-center gap-1"
      data-zone={type === 'graveyard' ? `${side}-graveyard` : `${side}-library`}
      initial={{ opacity: 0, scale: 0.75 }}
      animate={entrance ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: side === 'player' ? 0.3 : 0.15 }}
    >
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
    </motion.div>
  )
}

function DrawRevealCard({ imageUrl, color, phase }) {
  if (!imageUrl) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div
        className="relative w-[130px] h-[180px]"
        style={{
          animation: phase === 'flying'
            ? 'cardFlyFromLibrary 1.5s ease-out forwards'
            : 'none',
        }}
      >
        <div
          className="relative w-full h-full"
          style={{ perspective: '800px' }}
        >
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s ease-in-out',
              transform: phase === 'flipping' ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <div
              className="absolute inset-0 rounded-lg border-2 overflow-hidden bg-zinc-900"
              style={{
                backfaceVisibility: 'hidden',
                borderColor: color || '#34d399',
              }}
            >
              <img src={CARD_BACK_URL} alt="Dorso" className="h-full w-full object-cover" />
            </div>
            <div
              className="absolute inset-0 rounded-lg border-2 overflow-hidden bg-zinc-900"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderColor: color || '#34d399',
              }}
            >
              <img src={imageUrl} alt="Carta" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AttackFly({ attack, onComplete }) {
  const { url: imageUrl } = useCardImage(attack?.card?.name)
  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [lifePos, setLifePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!attack?.startRect || !imageUrl) return

    const lifeEl = document.querySelector('span.text-red-400.tabular-nums')
    const lifeRect = lifeEl?.getBoundingClientRect()
    const targetX = lifeRect ? lifeRect.left + lifeRect.width / 2 : window.innerWidth / 2
    const targetY = lifeRect ? lifeRect.top + lifeRect.height / 2 : 30

    setLifePos({ x: targetX, y: targetY })

    const cx = attack.startRect.left + attack.startRect.width / 2
    const cy = attack.startRect.top + attack.startRect.height / 2

    setDx(targetX - cx)
    setDy(targetY - cy)

    const cardEl = document.querySelector(`[data-card-id="${attack.card.id}"]`)
    if (cardEl) cardEl.style.opacity = '0'

    const f = requestAnimationFrame(() => setPhase('flying'))

    const t2 = setTimeout(() => setPhase('return'), 600)
    const t3 = setTimeout(() => {
      setPhase('done')
      if (cardEl) cardEl.style.opacity = '1'
      onComplete()
    }, 1000)

    return () => {
      cancelAnimationFrame(f)
      clearTimeout(t2)
      clearTimeout(t3)
      if (cardEl) cardEl.style.opacity = '1'
    }
  }, [imageUrl])

  if (!attack?.startRect || !imageUrl || phase === 'done') return null

  const color = CARD_COLOR_HEX[attack.card.color === 'land' ? 'land' : attack.card.color] || CARD_COLOR_HEX.G

  const transform = phase === 'flying'
    ? `translate(${dx}px, ${dy}px) rotate(-6deg) scale(1.2)`
    : 'translate(0, 0) rotate(0deg) scale(1)'

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      <img
        src={imageUrl}
        className="absolute rounded-lg border-2 shadow-2xl"
        style={{
          width: attack.startRect.width,
          height: attack.startRect.height,
          left: attack.startRect.left,
          top: attack.startRect.top,
          borderColor: color,
          transition: phase === 'flying'
            ? 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'transform 0.4s ease-out',
          transform,
        }}
      />
      {phase === 'flying' && (
        <div
          className="absolute z-[100] text-2xl sm:text-3xl font-black text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.9)] animate-damage-pop"
          style={{
            left: lifePos.x - 14,
            top: lifePos.y - 16,
          }}
        >
          -{attack.damage}
        </div>
      )}
    </div>
  )
}

function GameCard({ card, size = 'normal', onClick, highlighted, faceDown, attacking, tooltipMessage, visible = true, animate, delay = 0 }) {
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

  if (faceDown) {
    return (
      <motion.div
        className={`relative shrink-0 rounded-lg border-2 ${borderColor} ${sizeClasses} overflow-hidden`}
        initial={useAnim ? { opacity: 0, scale: 0.8 } : false}
        animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: delay / 1000 }}
      >
        <img
          src={CARD_BACK_URL}
          alt="Dorso"
          className="h-full w-full object-cover"
        />
      </motion.div>
    )
  }

  const isTapped = card.tapped
  const isHighlighted = highlighted

  return (
    <div className="relative">
      <CardTooltip message={tooltipMessage} visible={showTooltip} />
      <motion.button
        onClick={handleClick}
        disabled={!onClick}
        data-card-id={card.id}
        className={`relative shrink-0 rounded-lg border-2 text-left ${borderColor} ${sizeClasses} ${
          isTapped ? '-rotate-90' : ''
        } ${
          isHighlighted && !justClicked
            ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-900 saturate-150 animate-glow-pulse'
            : 'saturate-90'
        } ${
          justClicked ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-900 saturate-150 brightness-125' : ''
        } ${
          attacking ? 'translate-y-2 scale-105' : ''
        } ${
          card.tapped ? 'opacity-80' : ''
        } overflow-hidden`}
        initial={useAnim ? { opacity: 0, y: 40, scale: 0.95 } : false}
        animate={
          visible
            ? {
                opacity: 1,
                y: justClicked ? -8 : 0,
                scale: justClicked ? 1.1 : isHighlighted && !justClicked ? 1.05 : 1,
              }
            : { opacity: 0, y: 32, scale: 0.9 }
        }
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 24,
          delay: delay / 1000,
        }}
        whileHover={onClick ? { scale: 1.1, y: -24, boxShadow: '0 20px 25px -5px rgba(234,179,8,0.2)', zIndex: 50 } : {}}
        whileTap={onClick ? { scale: 1.15 } : {}}
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
      </motion.button>
    </div>
  )
}

function GameCardSmall({ card, onClick, highlighted, attacking, tooltipMessage, visible = true, animate, delay = 0 }) {
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
  const useAnim = animate !== undefined ? animate : visible

  return (
    <div className="relative">
      <CardTooltip message={tooltipMessage} visible={showTooltip} />
      <motion.button
        onClick={handleClick}
        disabled={!onClick}
        data-card-id={card.id}
        className={`relative shrink-0 rounded-lg border-2 ${cc.border} text-left overflow-hidden ${
          card.tapped ? '-rotate-90' : ''
        } ${
          highlighted && !justClicked
            ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-900 saturate-150'
            : ''
        } ${
          justClicked ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-900 saturate-150' : ''
        } ${
          attacking ? 'translate-y-2 scale-105' : ''
        } ${
          onClick ? 'cursor-pointer' : ''
        }           w-[90px] h-[130px] max-sm:w-[60px] max-sm:h-[86px]`}
        initial={useAnim ? { opacity: 0, y: 30, scale: 0.92 } : false}
        animate={
          visible
            ? { opacity: 1, y: justClicked ? -6 : 0, scale: justClicked ? 1.1 : highlighted && !justClicked ? 1.05 : 1 }
            : { opacity: 0, y: 24, scale: 0.85 }
        }
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 24,
          delay: delay / 1000,
        }}
        whileHover={onClick ? { scale: 1.1, y: -16, boxShadow: '0 20px 25px -5px rgba(234,179,8,0.2)', zIndex: 50 } : {}}
        whileTap={onClick ? { scale: 1.15 } : {}}
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
      </motion.button>
    </div>
  )
}

const lessonCardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
}

function LessonMenu({ onSelect, onBack }) {
  return (
    <motion.div
      className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
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
          {TUTORIAL_LESSONS.map((lesson, li) => {
            return (
            <motion.button
              key={lesson.id}
              onClick={() => onSelect(lesson)}
              custom={li}
              variants={lessonCardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.98 }}
              className={`group relative overflow-hidden rounded-2xl border ${lesson.colorBorder} ${lesson.colorBg} p-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${lesson.colorBg === 'bg-emerald-500/10' ? 'from-emerald-500/20 to-emerald-600/20' : lesson.colorBg === 'bg-indigo-500/10' ? 'from-indigo-500/20 to-blue-600/20' : lesson.colorBg === 'bg-sky-500/10' ? 'from-sky-500/20 to-emerald-600/20' : lesson.colorBg === 'bg-zinc-500/10' ? 'from-zinc-500/20 to-zinc-600/20' : 'from-red-500/20 to-orange-600/20'} border ${lesson.colorBorder}`}>
                  <ManaSymbolGroup colors={lesson.deckColors} size="lg" />
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
                {lesson.deckPreview.map((cardName, i) => {
                  const previewColor = getPreviewCardColor(cardName, lesson.deckColors)
                  return (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-2 py-0.5 text-[11px] text-zinc-400">
                      {previewColor ? <ManaSymbol symbol={previewColor} size="cost" shadow={false} /> : null}
                      {cardName}
                    </span>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-zinc-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lesson.scenes.length} pasos interactivos
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>
          )
        })}
        </div>

        <div className="mt-10 text-center">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver al Inicio
          </motion.button>
        </div>
      </div>
    </motion.div>
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

function centerOf(rect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

function FloatingCardFace({ card, rect, animate, className = '' }) {
  const { url: imageUrl, status: imageStatus } = useCardImage(card.name)
  const cc = colorConfig[card.color === 'land' ? 'land' : card.color] || colorConfig.B

  return (
    <motion.div
      className={`pointer-events-none fixed z-[998] overflow-hidden rounded-lg border-2 shadow-2xl ${cc.border} ${className}`}
      style={{ width: rect.width, height: rect.height }}
      initial={{ left: rect.left, top: rect.top, scale: 1, opacity: 1 }}
      animate={animate}
      transition={{ duration: 0.75, ease: [0.34, 1.2, 0.64, 1] }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${cc.from} ${cc.to} ${imageStatus === 'loaded' ? 'opacity-0' : 'opacity-100'}`} />
      {imageUrl ? (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
      ) : null}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
    </motion.div>
  )
}

function SpellTargetResolution({ source, target, sourceRect, targetRect, playerGraveRect, opponentGraveRect, targetGraveRect, mode = 'spell', onPhaseChange, onComplete }) {
  const [phase, setPhase] = useState('aiming')
  const isCombat = mode === 'combat'

  useEffect(() => {
    onPhaseChange?.(phase)
  }, [phase, onPhaseChange])

  useEffect(() => {
    const impactAt = isCombat ? 1100 : 1000
    const graveAt = isCombat ? 1900 : 1500
    const doneAt = isCombat ? 3000 : 2600

    const t1 = setTimeout(() => setPhase('impact'), impactAt)
    const t2 = setTimeout(() => setPhase('toGraveyard'), graveAt)
    const t3 = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, doneAt)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete, isCombat])

  if (!sourceRect || !targetRect) return null

  const sourceCenter = centerOf(sourceRect)
  const targetCenter = centerOf(targetRect)
  const arrowLength = Math.hypot(targetCenter.x - sourceCenter.x, targetCenter.y - sourceCenter.y)
  const arrowAngle = Math.atan2(targetCenter.y - sourceCenter.y, targetCenter.x - sourceCenter.x) * (180 / Math.PI)

  const playerGraveCenter = playerGraveRect ? centerOf(playerGraveRect) : sourceCenter
  const opponentGraveCenter = opponentGraveRect ? centerOf(opponentGraveRect) : targetCenter
  const loserGraveCenter = targetGraveRect
    ? centerOf(targetGraveRect)
    : opponentGraveCenter

  const sourceCc = colorConfig[source.color === 'land' ? 'land' : source.color] || colorConfig.G
  const spellAccent =
    source.color === 'B'
      ? 'border-violet-400 shadow-violet-500/40'
      : source.color === 'U'
        ? 'border-sky-400 shadow-sky-500/40'
        : isCombat
          ? `${sourceCc.border} shadow-amber-500/40`
          : 'border-orange-400 shadow-orange-500/40'
  const arrowColor = isCombat
    ? '#fbbf24'
    : source.color === 'B'
      ? '#a78bfa'
      : source.color === 'U'
        ? '#38bdf8'
        : '#fb923c'
  const isCounter = source.color === 'U'

  return (
    <div className="pointer-events-none fixed inset-0 z-[996]">
      {/* Targeting arrow */}
      {(phase === 'aiming' || phase === 'impact') && (
        <motion.div
          className="absolute origin-left"
          style={{
            left: sourceCenter.x,
            top: sourceCenter.y,
            width: arrowLength,
            height: 0,
            transform: `rotate(${arrowAngle}deg)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'impact' ? 1 : 0.85 }}
        >
          <motion.div
            className="relative h-[3px] rounded-full"
            style={{
              width: arrowLength,
              background: `linear-gradient(90deg, transparent, ${arrowColor}, ${arrowColor})`,
              boxShadow: `0 0 12px ${arrowColor}`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
          <div
            className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2"
            style={{
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: `12px solid ${arrowColor}`,
              filter: `drop-shadow(0 0 6px ${arrowColor})`,
            }}
          />
        </motion.div>
      )}

      {/* Target highlight ring */}
      {(phase === 'aiming' || phase === 'impact') && (
        <motion.div
          className={`absolute rounded-lg border-2 ${isCounter ? 'border-sky-400' : 'border-red-400'}`}
          style={{
            left: targetRect.left - 4,
            top: targetRect.top - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: phase === 'impact' ? [0.6, 1, 0.7] : 0.55,
            scale: phase === 'impact' ? [1, 1.06, 1] : 1,
          }}
          transition={{ duration: phase === 'impact' ? 0.45 : 0.35 }}
        />
      )}

      {/* Impact flash */}
      {phase === 'impact' && (
        <motion.div
          className={`absolute rounded-lg ${isCounter ? 'bg-sky-500/30' : 'bg-red-500/30'}`}
          style={{
            left: targetRect.left,
            top: targetRect.top,
            width: targetRect.width,
            height: targetRect.height,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.45 }}
        />
      )}

      {/* Attacker travels toward blocker / spell toward target */}
      {(phase === 'aiming' || phase === 'impact') && (
        <FloatingCardFace
          card={source}
          rect={sourceRect}
          className={spellAccent}
          animate={{
            left: phase === 'impact'
              ? targetCenter.x - sourceRect.width / 2
              : sourceCenter.x - sourceRect.width / 2 + (targetCenter.x - sourceCenter.x) * 0.35,
            top: phase === 'impact'
              ? targetCenter.y - sourceRect.height / 2
              : sourceCenter.y - sourceRect.height / 2 + (targetCenter.y - sourceCenter.y) * 0.35 - 24,
            scale: phase === 'impact' ? 1.08 : 1.12,
            rotate: phase === 'impact' ? 0 : isCombat ? 8 : -6,
          }}
        />
      )}

      {phase === 'toGraveyard' && isCombat ? (
        <>
          <FloatingCardFace
            card={source}
            rect={{
              ...sourceRect,
              left: targetCenter.x - sourceRect.width / 2,
              top: targetCenter.y - sourceRect.height / 2,
            }}
            className={spellAccent}
            animate={{
              left: sourceCenter.x - sourceRect.width / 2,
              top: sourceCenter.y - sourceRect.height / 2,
              scale: 1,
              opacity: 0,
            }}
          />
          <FloatingCardFace
            card={target}
            rect={targetRect}
            className={`${colorConfig[target.color === 'land' ? 'land' : target.color]?.border || 'border-red-400'} shadow-red-500/40`}
            animate={{
              left: loserGraveCenter.x - targetRect.width * 0.35,
              top: loserGraveCenter.y - targetRect.height * 0.35,
              scale: 0.45,
              opacity: 0,
            }}
          />
        </>
      ) : null}

      {phase === 'toGraveyard' && !isCombat ? (
        <>
          <FloatingCardFace
            card={source}
            rect={targetRect}
            className={spellAccent}
            animate={{
              left: playerGraveCenter.x - sourceRect.width * 0.35,
              top: playerGraveCenter.y - sourceRect.height * 0.35,
              scale: 0.45,
              opacity: 0,
            }}
          />
          <FloatingCardFace
            card={target}
            rect={targetRect}
            animate={{
              left: opponentGraveCenter.x - targetRect.width * 0.35,
              top: opponentGraveCenter.y - targetRect.height * 0.35,
              scale: 0.45,
              opacity: 0,
            }}
          />
        </>
      ) : null}
    </div>
  )
}

function filterHiddenCards(cards, hiddenIds) {
  if (!hiddenIds?.length) return cards
  return cards.filter((c) => !hiddenIds.includes(c.id))
}

function PopupCard({ card }) {
  const { url: imageUrl, status: imageStatus } = useCardImage(card.name)
  const cc = colorConfig[card.color === 'land' ? 'land' : card.color] || colorConfig.B

  return (
    <div className={`relative w-28 h-40 rounded-xl border-2 overflow-hidden animate-pulse shadow-lg shadow-indigo-500/30 ${cc.border}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${cc.from} ${cc.to} transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-0' : 'opacity-100'}`} />
          {imageUrl && (
            <img
              src={imageUrl}
              alt={card.name}
              className={`absolute inset-0 rounded-lg object-cover w-full h-full transition-all duration-700 ease-out ${imageStatus === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
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
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
    >
      <motion.div
        className="rounded-2xl border border-zinc-700/80 bg-zinc-900/95 p-5 sm:p-6 max-w-sm w-full shadow-2xl shadow-indigo-500/10 backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        {popup.title && (
          <h3 className="text-base font-bold text-indigo-300 mb-3 text-center leading-tight">{popup.title}</h3>
        )}

        <div className="flex justify-center gap-4 mb-4">
          {cards.map((card, i) => (
            <PopupCard key={card.id || i} card={card} />
          ))}
        </div>

        <p className="text-sm text-zinc-300 text-center leading-relaxed">
          <LessonRichText text={popup.description} />
        </p>

        <button
          onClick={onDismiss}
          className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-600/25 active:scale-[0.98]"
        >
          Continuar
        </button>
      </motion.div>
    </motion.div>
  )
}

function GameBoard({ lesson, sceneIdx, displayState, hiddenCardIds, onCardClick, lifeRecoil }) {
  const scene = lesson.scenes[sceneIdx]
  const state = displayState ?? scene.state
  const isLessonComplete = scene.phase === 'Lección Completada'
  const entrance = useEntranceAnimation(sceneIdx === 0 ? 0 : -1)

  const interaction = scene.interaction
  const isClickHand = interaction.type === 'click_hand'
  const isClickBoard = interaction.type === 'click_board'

  const prevCardIdsRef = useRef(new Set())
  const [drawAnim, setDrawAnim] = useState({ phase: 'idle', card: null, imageUrl: '' })
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

  const drawAnimRef = useRef({ cancelled: false })
  useEffect(() => {
    if (!scene.phase.includes('Inicio') || sceneIdx <= 0) return
    const prevScene = lesson.scenes[sceneIdx - 1]
    const prevIds = new Set(prevScene.state.playerHand.map(c => c.id))
    const newCards = state.playerHand.filter(c => !prevIds.has(c.id))

    if (newCards.length === 0) return

    const card = newCards[0]
    const ref = drawAnimRef
    ref.current.cancelled = false
    const timeouts = []

    ensureCardImage(card.name).then((url) => {
      if (ref.current.cancelled) return
      setDrawAnim({ phase: 'flying', card, imageUrl: url || '' })

      const t1 = setTimeout(() => {
        if (!ref.current.cancelled) setDrawAnim(prev => ({ ...prev, phase: 'flipping' }))
      }, 1500)
      timeouts.push(t1)

      const t2 = setTimeout(() => {
        if (!ref.current.cancelled) setDrawAnim({ phase: 'idle', card: null, imageUrl: '' })
      }, 2800)
      timeouts.push(t2)
    })

    return () => {
      ref.current.cancelled = true
      timeouts.forEach(clearTimeout)
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
    <motion.div
      className="flex flex-row min-h-[calc(100vh-4rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="battlefield-magic flex-1 px-2 py-2 sm:px-4 sm:py-3 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <motion.div
          className="relative mb-1.5 sm:mb-2 flex items-center justify-between rounded-xl border border-zinc-700/50 bg-zinc-950/70 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
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
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className={`text-xl font-bold text-red-400 tabular-nums ${lifeRecoil ? 'animate-life-recoil' : ''}`}>{state.opponentLife}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-zinc-500 sm:inline">P. {sceneIdx + 1}/{lesson.scenes.length}</span>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center">
          {/* Opponent side */}
          <motion.div
            className="mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.075 }}
          >
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
            {filterHiddenCards(state.opponentBoard, hiddenCardIds).length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center mb-1.5 pl-1">
                {filterHiddenCards(state.opponentBoard, hiddenCardIds).map((card) => (
                  <GameCardSmall key={card.id} card={card} visible={true} animate={getCardAnim(card.id)} delay={75} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Divider */}
          <motion.div
            className="relative my-1.5 sm:my-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-900/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="battlefield-field bg-zinc-950/60 backdrop-blur-sm px-3 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-600/80 uppercase tracking-[0.2em] rounded-full border border-amber-900/20">
                CAMPO DE BATALLA
              </span>
            </div>
          </motion.div>

          {/* Player side */}
          <motion.div
            className="mb-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filterHiddenCards(state.playerBoard, hiddenCardIds).length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center mb-1.5 pl-1">
                {filterHiddenCards(state.playerBoard, hiddenCardIds).map((card) => {
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
                {filterHiddenCards(state.playerHand, hiddenCardIds).map((card, i, arr) => {
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
          </motion.div>
        </div>

        {/* Draw animation overlay */}
        {drawAnim.card && (
          <DrawRevealCard
            imageUrl={drawAnim.imageUrl}
            color={CARD_COLOR_HEX[drawAnim.card.color === 'land' ? 'land' : drawAnim.card.color] || '#34d399'}
            phase={drawAnim.phase}
          />
        )}

        {/* Player life + progress bar */}
        <motion.div
          className="pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between rounded-xl border border-zinc-800/50 bg-zinc-950/40 backdrop-blur-sm px-3 py-2 relative">
            <div className="flex items-center gap-2">
              {lesson.scenes.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i < sceneIdx ? 'w-2 bg-emerald-500' : i === sceneIdx ? 'w-5 bg-indigo-500 shadow-lg shadow-indigo-500/50' : 'w-1.5 bg-zinc-700/50'
                  }`}
                />
              ))}
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">{state.playerLife}</span>
            </div>
            <span className="text-[10px] text-zinc-600 tabular-nums">{sceneIdx + 1}/{lesson.scenes.length}</span>
          </div>
        </motion.div>
      </div>
      {/* Phase ladder - floating left sidebar on all screens */}
      <motion.div
        className="fixed left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-30 flex items-center py-2 px-1.5 sm:py-2.5 sm:px-2 rounded-xl border border-zinc-800/40 bg-zinc-950/60 backdrop-blur-md"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <PhaseLadder currentPhase={scene.phase} />
      </motion.div>
    </motion.div>
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
  const currentIdx = PHASE_STEPS.findIndex(p => currentPhase?.startsWith(p.key))

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

export default function GameDemo({ onBack }) {
  const [lesson, setLesson] = useState(null)
  const [sceneIdx, setSceneIdx] = useState(0)
  const [advancing, setAdvancing] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [popupData, setPopupData] = useState(null)
  const [targetAnim, setTargetAnim] = useState(null)
  const [targetAnimPhase, setTargetAnimPhase] = useState(null)
  const [targetResolved, setTargetResolved] = useState(false)
  const [attackAnim, setAttackAnim] = useState(null)
  const [hitVisible, setHitVisible] = useState(false)
  const advanceTimer = useRef(null)
  const prevPhaseRef = useRef('')

  const scene = lesson?.scenes[sceneIdx]
  const isLast = sceneIdx >= (lesson?.scenes?.length ?? 1) - 1

  useEffect(() => {
    setTargetResolved(false)
    setTargetAnim(null)
    setTargetAnimPhase(null)
  }, [sceneIdx])

  const advance = useCallback(() => {
    if (advancing) return
    clearTimeout(advanceTimer.current)
    setAdvancing(true)
    setTransitioning(true)

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
    prevPhaseRef.current = scene.phase
  }, [scene?.phase])

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
    setTargetResolved(false)
    setTargetAnim(null)
    setTargetAnimPhase(null)
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

    const currentScene = lesson?.scenes[sceneIdx]
    const targeting = currentScene?.popup?.targeting

    if (targeting && lesson && sceneIdx > 0) {
      const prevState = lesson.scenes[sceneIdx - 1].state
      const allCards = getAllCards(prevState)
      const source = allCards.find((c) => c.id === targeting.sourceId)
      const target = allCards.find((c) => c.id === targeting.targetId)
      if (source && target) {
        const targetOnOpponent = (prevState.opponentBoard || []).some((c) => c.id === targeting.targetId)

        window.setTimeout(() => {
          const sourceEl = document.querySelector(`[data-card-id="${targeting.sourceId}"]`)
          const targetEl = document.querySelector(`[data-card-id="${targeting.targetId}"]`)
          const playerGraveEl = document.querySelector('[data-zone="player-graveyard"]')
          const opponentGraveEl = document.querySelector('[data-zone="opponent-graveyard"]')
          const playerGraveRect = playerGraveEl?.getBoundingClientRect() ?? null
          const opponentGraveRect = opponentGraveEl?.getBoundingClientRect() ?? null

          setTargetAnim({
            source,
            target,
            mode: targeting.mode || 'spell',
            sourceRect: sourceEl?.getBoundingClientRect() ?? null,
            targetRect: targetEl?.getBoundingClientRect() ?? null,
            playerGraveRect,
            opponentGraveRect,
            targetGraveRect: targetOnOpponent ? opponentGraveRect : playerGraveRect,
          })
        }, 80)
      }
    }

    if (lesson && sceneIdx > 0) {
      const prevState = lesson.scenes[sceneIdx - 1].state
      const curState = currentScene.state
      const lifeDrop = prevState.opponentLife - curState.opponentLife
      if (lifeDrop > 0) {
        const prevBoard = prevState.playerBoard || []
        const curBoard = curState.playerBoard || []
        const attackers = prevBoard.filter(pc => {
          const cur = curBoard.find(c => c.id === pc.id)
          return cur && pc.tapped === false && cur.tapped === true && pc.power != null
        })
        const blockedId = targeting?.sourceId
        let attacker = blockedId
          ? attackers.find(a => a.id !== blockedId)
          : attackers[0]
        if (!attacker && lifeDrop > 0 && blockedId) {
          attacker = attackers.find(a => a.id === blockedId)
        }
        const attackData = { attacker, damage: lifeDrop }
        if (targeting) {
          pendingAttackRef.current = attackData
        } else {
          startAttackFly(attackData)
        }
      }
    }
  }, [lesson, sceneIdx])

  const pendingAttackRef = useRef(null)

  function startAttackFly({ attacker, damage }) {
    if (attacker) {
      const cardEl = document.querySelector(`[data-card-id="${attacker.id}"]`)
      const r = cardEl?.getBoundingClientRect()
      const startRect = r ? { top: r.top, left: r.left, width: r.width, height: r.height } : null
      setAttackAnim({ card: attacker, damage, type: 'combat', startRect })
      setTimeout(() => setHitVisible(true), 400)
    } else {
      setAttackAnim({ card: null, damage, type: 'direct' })
      setTimeout(() => setHitVisible(true), 600)
    }
    setTimeout(() => {
      setAttackAnim(null)
      setHitVisible(false)
    }, 1500)
  }

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
    if (!scene || !lesson || popupData || targetAnim) return
    const isLastScene = sceneIdx >= lesson.scenes.length - 1
    if (shouldAuto(scene, isLastScene)) {
      const delay = scene.interaction.type === 'auto'
        ? (scene.interaction.delay || 2000)
        : 2500
      advanceTimer.current = setTimeout(() => advance(), delay)
      return () => clearTimeout(advanceTimer.current)
    }
  }, [sceneIdx, scene, lesson, advance, shouldAuto, popupData, targetAnim])

  const handleTargetAnimComplete = useCallback(() => {
    setTargetAnim(null)
    setTargetAnimPhase(null)
    setTargetResolved(true)
    if (pendingAttackRef.current) {
      startAttackFly(pendingAttackRef.current)
      pendingAttackRef.current = null
    }
  }, [])

  const prevSceneState = sceneIdx > 0 ? lesson?.scenes[sceneIdx - 1]?.state : null
  const hasTargetPopup = scene?.popup?.targeting
  const pendingTargetResolution = Boolean(hasTargetPopup && prevSceneState && !targetResolved)
  const boardState = pendingTargetResolution ? prevSceneState : scene?.state
  const hiddenCardIds = (() => {
    if (!targetAnim) return []
    if (targetAnim.mode === 'combat') {
      const hideTarget = targetAnimPhase === 'toGraveyard' || targetAnimPhase === 'done'
      return hideTarget
        ? [targetAnim.source.id, targetAnim.target.id]
        : [targetAnim.source.id]
    }
    return [targetAnim.source.id, targetAnim.target.id]
  })()

  if (!lesson) {
    return <LessonMenu onSelect={handleSelectLesson} onBack={onBack} />
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-zinc-950">
      <GameBoard
        key={lesson.id}
        lesson={lesson}
        sceneIdx={sceneIdx}
        displayState={boardState}
        hiddenCardIds={hiddenCardIds}
        onCardClick={handleCardClick}
        lifeRecoil={hitVisible && attackAnim?.damage > 0}
      />

      {/* Bottom tutorial panel */}
      <motion.div
        className="sticky bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl"
        animate={{ opacity: transitioning ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto max-w-4xl px-3 py-2 sm:px-4 sm:py-4 max-sm:px-1.5 max-sm:py-1.5">
          <div className="space-y-1.5 sm:space-y-2">
            {scene.tip && (
            <div className="mb-1.5 sm:mb-2 flex items-start gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-1 sm:px-2.5 sm:py-1.5 max-sm:px-1.5 max-sm:py-0.5">
              <span className="mt-0.5 shrink-0 text-[11px] text-amber-400">💡</span>
              <p className="text-[11px] leading-relaxed text-amber-200/80 max-sm:text-[9px] max-sm:leading-snug">
                <LessonRichText text={scene.tip} />
              </p>
            </div>
            )}

          <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line max-sm:text-[11px] max-sm:leading-snug">
            <LessonRichText text={scene.instruction} />
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
      </motion.div>

      {attackAnim && attackAnim.type === 'combat' && (
        <AttackFly
          attack={attackAnim}
          onComplete={() => {}}
        />
      )}

      {targetAnim ? (
        <SpellTargetResolution
          source={targetAnim.source}
          target={targetAnim.target}
          sourceRect={targetAnim.sourceRect}
          targetRect={targetAnim.targetRect}
          playerGraveRect={targetAnim.playerGraveRect}
          opponentGraveRect={targetAnim.opponentGraveRect}
          targetGraveRect={targetAnim.targetGraveRect}
          mode={targetAnim.mode}
          onPhaseChange={setTargetAnimPhase}
          onComplete={handleTargetAnimComplete}
        />
      ) : null}

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