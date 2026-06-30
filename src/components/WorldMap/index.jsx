import { Suspense, useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import GlobeScene from './GlobeScene'
import TournamentCard from './TournamentCard'
import LoadingCard from '../LoadingCard'
import MapIntro from './MapIntro'

export default function WorldMap({ onBack }) {
  const [selected, setSelected] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [camDist, setCamDist] = useState(20)
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    setCamDist(window.innerWidth < 640 ? 22 : 14)
  }, [])

  useEffect(() => {
    if (loaded) setShowIntro(true)
  }, [loaded])

  const handleReady = useCallback(() => {
    setLoaded(true)
  }, [])

  const handleDismissIntro = useCallback(() => {
    setShowIntro(false)
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

  const selectedPin = selected?.type === 'pin' ? selected.data : null
  const selectedCountry = selected?.type === 'country' ? selected.data : null

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
          />
        </Suspense>
      </Canvas>

      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 text-zinc-300 text-sm hover:bg-zinc-800/80 transition-colors cursor-pointer"
      >
        ← Volver
      </button>

      <AnimatePresence>
        {showIntro && <MapIntro onDismiss={handleDismissIntro} />}
      </AnimatePresence>

      {selectedPin && (
        <TournamentCard pin={selectedPin} onClose={handleClose} />
      )}

      {selectedCountry && (
        <TournamentCard countryName={selectedCountry.name} onClose={handleClose} />
      )}
    </div>
  )
}
