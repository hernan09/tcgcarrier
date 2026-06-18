import { useState, useCallback } from 'react'
import Home from './components/Home'
import GameDemo from './components/GameDemo'

export default function App() {
  const [showGame, setShowGame] = useState(false)

  const handleStartGame = useCallback(() => {
    setShowGame(true)
  }, [])

  const handleBackFromGame = useCallback(() => {
    setShowGame(false)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 shrink-0" aria-label="TCG Carrier inicio">
            <svg className="h-7 w-7" viewBox="0 0 48 48" aria-hidden="true">
              <defs>
                <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a855f7"/>
                  <stop offset="100%" stopColor="#6b21a8"/>
                </linearGradient>
              </defs>
              <path fill="url(#headerGrad)" d="M24 2L46 16v18L24 46 2 34V16Z"/>
              <path fill="#0a0a0a" d="M24 8L40 19v12L24 42 8 31V19Z"/>
              <path fill="url(#headerGrad)" d="M14 16h5l5 8 5-8h5v18h-4.5V24L24 32l-5.5-8v10H14V16Z"/>
            </svg>
            <span className="text-lg font-bold tracking-tight text-zinc-100">
              MTG / ¡Aprende a Jugar!
            </span>
          </div>

          {!showGame && (
            <button
              onClick={handleStartGame}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/20 hover:border-indigo-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shrink-0"
            >
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
              </svg>
              Práctica
            </button>
          )}
          {showGame && (
            <button
              onClick={handleBackFromGame}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium text-zinc-400 transition-all hover:border-zinc-700 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shrink-0"
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver
            </button>
          )}
        </div>
      </header>

      {showGame ? (
        <GameDemo onBack={handleBackFromGame} />
      ) : (
        <Home onStartGame={handleStartGame} />
      )}
    </div>
  )
}
