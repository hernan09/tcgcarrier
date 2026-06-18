import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { COLORS, HOW_TO_PLAY_STEPS } from '../data/mtgColors'
import CardTypesSection from './CardTypesSection'
import { ManaSymbol } from './ManaSymbol'

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useTypewriter(text, speed = 40) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const textRef = useRef(text)
  useEffect(() => {
    textRef.current = text
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(textRef.current.slice(0, i))
      if (i >= textRef.current.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])
  return [displayed, done]
}

function HeroSection({ onExplore }) {
  const [titleDone, setTitleDone] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)
  const taglines = useMemo(() => [
    'Preparate para jugar Magic: The Gathering.',
    'Construye tu mazo perfecta.',
    'Domina los cinco colores de maná.',
  ], [])
  const [tagline, setTagline] = useState(taglines[0])
  const [displayed, done] = useTypewriter(tagline, 50)

  useEffect(() => {
    if (done) {
      const t1 = setTimeout(() => setTitleDone(true), 400)
      const t2 = setTimeout(() => setCtaVisible(true), 1000)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [done])

  useEffect(() => {
    if (titleDone) {
      const cycle = setInterval(() => {
        setTagline(prev => {
          const idx = taglines.indexOf(prev)
          return taglines[(idx + 1) % taglines.length]
        })
      }, 5000)
      return () => clearInterval(cycle)
    }
  }, [titleDone, taglines])

  const shakeRef = useRef(null)
  useEffect(() => {
    const el = shakeRef.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`
    }
    const onLeave = () => {
      if (el) el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)'
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [])

  function CardBack({ className }) {
    return (
      <div className={`relative overflow-hidden rounded-[10px] ${className}`} style={{ background: '#2b1805' }}>
        <div className="absolute inset-0 rounded-[10px] border-[3px]" style={{ borderColor: '#4a2c0a' }} />
        <div className="absolute inset-[5px] rounded-[6px]" style={{ background: '#d9b77d' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '65%', height: '55%', border: '2px solid #3d2208', borderRadius: '50%' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div style={{ width: 18, height: 18, background: '#3d2208', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
        </div>
        <div className="absolute" style={{ top: '34%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f5e6d0' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1a1a1a' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ef4444' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
        </div>
      </div>
    )
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#a855f7_0%,_transparent_60%)] opacity-15" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="flex gap-3 sm:gap-4">
            <CardBack className="h-28 w-20 sm:h-36 sm:w-24 opacity-20" />
            <CardBack className="h-28 w-20 sm:h-36 sm:w-24 opacity-30" />
            <CardBack className="h-28 w-20 sm:h-36 sm:w-24 opacity-20" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div
          ref={shakeRef}
          className="mb-6 inline-block rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-indigo-300 transition-transform duration-200 ease-out"
        >
          Magic: The Gathering &mdash; Aprende a Jugar &amp; Construye tu mazo
        </div>

        <h1 className="mb-4 bg-gradient-to-r from-indigo-300 via-purple-200 to-indigo-300 bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-6xl md:text-7xl">
          MTG
        </h1>

        <div className="h-8 sm:h-10">
          <p className="text-lg text-zinc-400 sm:text-xl">
            {displayed}
            {!done && <span className="ml-0.5 animate-pulse text-indigo-400">|</span>}
          </p>
        </div>

        <div
          className={`mt-10 transition-all duration-700 ease-out ${ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <button
            onClick={onExplore}
            className="group inline-flex items-center gap-2 rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-500 to-purple-800 px-8 py-2.5 text-base font-semibold text-white shadow-lg shadow-purple-600/40 backdrop-blur-sm transition-all hover:from-purple-400 hover:to-purple-700 hover:shadow-purple-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50"
          >
            Explorar los Colores
            <svg className="h-5 w-5 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <svg className="h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  )
}

function ColorCard({ color, index, isActive, onClick, cardImageUrls }) {
  const [ref, inView] = useInView(0.1)

  return (
    <button
      onClick={onClick}
      ref={ref}
      className={`group relative w-full shrink-0 cursor-pointer rounded-2xl border p-4 text-left transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 sm:p-5 ${
        isActive
          ? `border-transparent bg-gradient-to-br ${color.gradientBg} shadow-xl`
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/60'
      } ${inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 flex items-center gap-4">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            isActive ? color.iconBg : 'bg-zinc-800'
          }`}
          aria-hidden="true"
        >
          <ManaSymbol symbol={color.symbol} size="lg" shadow={isActive} />
        </span>
        <div>
          <h3 className={`text-lg font-bold transition-colors ${isActive ? color.textGlow : 'text-zinc-200'}`}>
            {color.name}
          </h3>
          <p className="text-xs text-zinc-500">{color.philosophy}</p>
        </div>
        {isActive && (
          <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
          </div>
        )}
      </div>

      <p className={`mb-3 text-sm leading-relaxed transition-opacity duration-300 ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
        {isActive ? color.description : color.description.slice(0, 80) + '...'}
      </p>

      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-400">
          {color.mechanics.split(',')[0]}
        </span>
        <span className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-400">
          {color.mechanics.split(',')[1]}
        </span>
      </div>

      {isActive && cardImageUrls && (
        <div className="mt-4 flex flex-row flex-nowrap items-stretch justify-center gap-2">
          {color.cards.map((cardName, i) => (
            <div
              key={cardName}
              className="group w-20 sm:w-28 min-w-0"
              style={{ animation: `fadeSlideCard 0.5s ease-out ${i * 0.15}s both` }}
            >
              <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 transition-all duration-300 group-hover:border-zinc-700 group-hover:shadow-xl">
                <div className="aspect-[5/7] bg-zinc-800/50">
                  {cardImageUrls[i] ? (
                    <img
                      src={cardImageUrls[i]}
                      alt={cardName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                <div className="border-t border-zinc-800 p-2">
                  <p className="text-center text-[11px] font-medium leading-tight text-zinc-300 line-clamp-2">{cardName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}

function ColorCarousel() {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [loadedImages, setLoadedImages] = useState({})
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)
  const loadingRef = useRef({})
  const [ref, inView] = useInView(0.1)

  const next = useCallback(() => setActiveIndex(i => (i < 0 ? 0 : (i + 1) % COLORS.length)), [])
  const prev = useCallback(() => setActiveIndex(i => (i < 0 ? 0 : (i - 1 + COLORS.length) % COLORS.length)), [])

  useEffect(() => {
    if (!inView || isPaused) return
    intervalRef.current = setInterval(next, 6000)
    return () => clearInterval(intervalRef.current)
  }, [inView, isPaused, next])

  useEffect(() => {
    if (activeIndex < 0) return
    const active = COLORS[activeIndex]
    if (!active) return
    active.cards.forEach(name => {
      if (loadedImages[name] || loadingRef.current[name]) return
      loadingRef.current[name] = true
      const encoded = encodeURIComponent(name)
      const img = new Image()
      img.onload = () => setLoadedImages(prev => ({ ...prev, [name]: `https://api.scryfall.com/cards/named?exact=${encoded}&format=image` }))
      img.onerror = () => setLoadedImages(prev => ({ ...prev, [name]: null }))
      img.src = `https://api.scryfall.com/cards/named?exact=${encoded}&format=image`
    })
  }, [activeIndex, loadedImages])

  return (
    <section id="colors" className="relative px-4 py-24 sm:px-6 sm:py-32 overflow-x-hidden" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className={`mb-16 text-center transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <span className="mb-3 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            Los Cinco Colores
          </span>
          <h2 className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Elige tu Maná
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Magic tiene cinco colores de maná, cada uno con su propia filosofía, mecánicas y cartas icónicas.
            Haz clic en un color para aprender más, o deja que el carrusel te guíe a través de cada uno.
          </p>
        </div>

        <div
          className="grid gap-4 lg:grid-cols-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {COLORS.map((color, i) => (
            <ColorCard
              key={color.id}
              color={color}
              index={i}
              isActive={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              cardImageUrls={color.cards.map(name => loadedImages[name])}
            />
          ))}
        </div>

        <div className={`mt-8 flex items-center justify-center gap-3 transition-all duration-700 delay-300 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <button
            onClick={prev}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
            aria-label="Color anterior"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>

          <div className="flex gap-2">
            {COLORS.map((color, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 ${
                  i === activeIndex ? 'scale-110 bg-zinc-800/80 ring-2 ring-indigo-400/60' : 'opacity-50 hover:opacity-80'
                }`}
                aria-label={`Ir al color ${color.name}`}
              >
                <ManaSymbol symbol={color.symbol} size="cost" shadow={i === activeIndex} />
              </button>
            ))}
          </div>

          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
            aria-label="Siguiente color"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideCard {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

function HowToPlay() {
  const [activeStep, setActiveStep] = useState(0)
  const [ref, inView] = useInView(0.05)

  return (
    <section id="how-to-play" className="relative px-4 py-24 sm:px-6 sm:py-32 overflow-x-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#6366f1_0%,_transparent_50%)] opacity-[0.03]" />

      <div className={`mx-auto max-w-4xl transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            Guía para Principiantes
          </span>
          <h2 className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Cómo Jugar Magic
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            ¿Nuevo en Magic? Aquí tienes todo lo que necesitas saber para empezar a jugar.
            Haz clic en cada paso para aprender a tu propio ritmo.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-4">
          {HOW_TO_PLAY_STEPS.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              index={i}
              isActive={activeStep === i}
              onToggle={() => setActiveStep(activeStep === i ? null : i)}
              sectionInView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ step, index, isActive, onToggle, sectionInView }) {
  const [ref, inView] = useInView(0.2)

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${sectionInView && inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <button
        onClick={onToggle}
        className={`group w-full rounded-2xl border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 sm:p-6 ${
          isActive
            ? 'border-indigo-500/30 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
            : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
              isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            <span className="hidden sm:inline">{step.icon}</span>
            <span className="sm:hidden">{index + 1}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className={`text-base font-bold transition-colors sm:text-lg ${isActive ? 'text-indigo-200' : 'text-zinc-200'}`}>
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-500">{step.subtitle}</p>
              </div>
              <svg
                className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-out ${
                isActive ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-sm leading-relaxed text-zinc-400">
                {step.description}
              </p>
              <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-sm">💡</span>
                  <p className="text-sm text-amber-200/80">{step.tips}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

function CTASection({ onStartGame }) {
  const [ref, inView] = useInView(0.3)

  return (
    <section className="relative px-4 py-24 sm:px-6 sm:py-32 overflow-x-hidden" ref={ref}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#a855f7_0%,_transparent_60%)] opacity-10" />
      </div>

      <div className={`relative z-10 mx-auto max-w-2xl text-center transition-all duration-700 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <h2 className="mb-4 bg-gradient-to-r from-indigo-300 via-purple-200 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          ¿Listo para Jugar?
        </h2>
        <p className="mb-8 text-zinc-400">
          Practicá con lecciones interactivas paso a paso. Aprendé mientras jugás, sin presiones.
        </p>
        <button
          onClick={onStartGame}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
        >
          Practicar Ahora
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default function Home({ onStartGame }) {
  return (
    <div className="min-h-screen">
      <HeroSection
        onExplore={() => {
          document.getElementById('colors')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />
      <ColorCarousel />
      <HowToPlay />
      <CardTypesSection />
      <CTASection onStartGame={onStartGame} />
    </div>
  )
}
