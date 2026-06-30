import { useEffect } from 'react'
import { motion } from 'framer-motion'

const OVERLAY = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const BUBBLE = {
  hidden: { opacity: 0, scale: 0.92, y: 10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', damping: 14, stiffness: 180, delay: 0.3 },
  },
  exit: { opacity: 0, scale: 0.95, y: 5, transition: { duration: 0.2 } },
}

const AJANI = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1, x: 0,
    transition: { type: 'spring', damping: 16, stiffness: 160, delay: 0.15 },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
}

export default function MapIntro({ onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 9000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/40"
      variants={OVERLAY}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDismiss}
    >
      <div className="flex items-end gap-3 sm:gap-4 px-4 max-w-md" onClick={e => e.stopPropagation()}>
        <motion.div
          className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-500/30 shadow-lg shadow-amber-900/20"
          variants={AJANI}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <img src="/ajani.webp" alt="Ajani" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          className="relative flex-1 bg-zinc-800/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-zinc-600/40 shadow-xl"
          variants={BUBBLE}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="absolute left-[-6px] bottom-5 w-3 h-3 bg-zinc-800/95 border-l border-b border-zinc-600/40 rotate-45" />

          <p className="text-zinc-100 text-sm leading-relaxed">
            <span className="text-amber-400 font-semibold">¡Bienvenido!</span> Los{' '}
            <span className="text-amber-300 font-medium">marcadores</span> en el mapa
            muestran torneos de <span className="text-amber-300 font-medium">Magic</span>.
            Cada color representa un formato distinto.
          </p>
          <p className="text-zinc-400 text-xs mt-1.5">
            Toca un marcador para ver eventos y mazos ganadores.
          </p>

          <button
            onClick={onDismiss}
            className="absolute top-1.5 right-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer text-sm leading-none"
          >
            ✕
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
