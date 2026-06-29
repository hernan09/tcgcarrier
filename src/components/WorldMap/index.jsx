import { Suspense, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import GlobeScene from './GlobeScene'
import TournamentCard from './TournamentCard'
import LoadingCard from '../LoadingCard'

const FORMATS = ['EDH', 'Standard', 'Modern', 'Pioneer']
const FORMAT_COLORS = {
  EDH: '#ff9632',
  Standard: '#4d8cf7',
  Modern: '#a855f7',
  Pioneer: '#22c55e',
}

export default function WorldMap({ onBack }) {
  const [selected, setSelected] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [camDist, setCamDist] = useState(20)
  const [activeFormats, setActiveFormats] = useState(() => new Set(FORMATS))

  useEffect(() => {
    setCamDist(window.innerWidth < 640 ? 22 : 14)
  }, [])

  const handleReady = useCallback(() => {
    setLoaded(true)
  }, [])

  const handleSelectTournament = useCallback((pin) => {
    setSelected({ type: 'pin', data: pin })
  }, [])

  const handleSelectCountry = useCallback((country) => {
    setSelected({ type: 'country', data: country })
  }, [])

  const handleClose = useCallback(() => {
    setSelected(null)
  }, [])

  const toggleFormat = useCallback((fmt) => {
    setActiveFormats(prev => {
      const next = new Set(prev)
      if (next.has(fmt)) {
        next.delete(fmt)
      } else {
        next.add(fmt)
      }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setActiveFormats(new Set(FORMATS))
  }, [])

  const selectedPin = selected?.type === 'pin' ? selected.data : null
  const selectedCountry = selected?.type === 'country' ? selected.data : null
  const hasSelection = selectedPin || selectedCountry

  return (
    <div className="relative w-full h-dvh max-w-full bg-[#0a0f1a] overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0f1a]">
          <LoadingCard />
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, camDist], fov: 25 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ background: '#0a0f1a' }}
      >
        <color attach="background" args={['#0a0f1a']} />
        <Suspense fallback={null}>
          <GlobeScene
            selected={selected}
            onReady={handleReady}
            onSelectTournament={handleSelectTournament}
            onSelectCountry={handleSelectCountry}
            camDist={camDist}
            activeFormats={activeFormats}
          />
        </Suspense>
      </Canvas>

      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 text-zinc-300 text-sm hover:bg-zinc-800/80 transition-colors cursor-pointer"
      >
        ← Volver
      </button>

      {!hasSelection && (
        <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-1.5 justify-end max-w-[50%]">
          <button
            onClick={selectAll}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer border ${
              activeFormats.size === FORMATS.length
                ? 'bg-zinc-700/80 border-zinc-500/50 text-zinc-200'
                : 'bg-zinc-900/60 border-zinc-700/30 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Todos
          </button>
          {FORMATS.map(fmt => {
            const active = activeFormats.has(fmt)
            const color = FORMAT_COLORS[fmt]
            return (
              <button
                key={fmt}
                onClick={() => toggleFormat(fmt)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer border ${
                  active
                    ? 'bg-zinc-800/80 text-zinc-200'
                    : 'bg-zinc-900/40 text-zinc-600 border-zinc-800/30'
                }`}
                style={{
                  borderColor: active ? `${color}60` : undefined,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: active ? color : '#52525b',
                    boxShadow: active ? `0 0 4px ${color}` : 'none',
                  }}
                />
                {fmt}
              </button>
            )
          })}
        </div>
      )}

      {selectedPin && (
        <TournamentCard pin={selectedPin} onClose={handleClose} />
      )}

      {selectedCountry && (
        <TournamentCard countryName={selectedCountry.name} onClose={handleClose} />
      )}
    </div>
  )
}
