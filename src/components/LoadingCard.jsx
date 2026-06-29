import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function LoadingCard() {
  const [frontImg, setFrontImg] = useState(null)
  const [backImg, setBackImg] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('https://api.scryfall.com/cards/random?q=game%3Apaper')
        if (cancelled) return
        const card = await res.json()
        const front = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal
        if (cancelled) return
        setFrontImg(front)
        // For the back, Scryfall doesn't expose a direct URL.
        // Use the gradient back as fallback — it already looks close to the real MTG back.
      } catch (e) {
        // keep gradient placeholders
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div
      className="flex flex-col items-center gap-2 px-4"
      style={{ perspective: '800px' }}
    >
      <motion.div
        className="relative w-[110px] h-[154px] sm:w-[130px] sm:h-[182px] max-w-[85vw]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-[10px] sm:rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {frontImg ? (
            <img src={frontImg} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-zinc-900 p-[3px] rounded-[10px] sm:rounded-xl">
              <div className="w-full h-full bg-gradient-to-b from-amber-900/80 via-amber-800/60 to-amber-900/80 rounded-[7px] sm:rounded-[9px] p-[2px]">
                <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-[5px] sm:rounded-[7px] overflow-hidden flex flex-col">
                  <div className="h-8 sm:h-9 bg-gradient-to-r from-amber-900/60 via-amber-700/60 to-amber-900/60 flex items-center px-2 sm:px-3 gap-1 sm:gap-2">
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shrink-0" />
                    <div className="h-2 sm:h-2.5 flex-1 rounded-full bg-zinc-700/50" />
                    <div className="flex gap-1">
                      <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
                      <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600" />
                      <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-gradient-to-br from-red-400 to-red-600" />
                    </div>
                  </div>
                  <div className="flex-1 mx-1 sm:mx-1.5 mt-1 sm:mt-1.5 rounded bg-gradient-to-br from-indigo-900/50 via-purple-800/30 to-blue-900/50 flex items-center justify-center border border-zinc-700/30">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-zinc-600/30 flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30" />
                    </div>
                  </div>
                  <div className="h-4 sm:h-5 flex items-center px-2 sm:px-3"><div className="h-1.5 sm:h-2 w-12 sm:w-16 rounded-full bg-zinc-700/30" /></div>
                  <div className="flex-1 mx-1 sm:mx-1.5 mb-1 sm:mb-1.5 rounded bg-zinc-800/40 border border-zinc-700/30 p-1.5 sm:p-2 flex flex-col gap-1 sm:gap-1.5">
                    <div className="h-1 sm:h-1.5 w-full rounded-full bg-zinc-700/20" />
                    <div className="h-1 sm:h-1.5 w-3/4 rounded-full bg-zinc-700/20" />
                    <div className="h-1 sm:h-1.5 w-5/6 rounded-full bg-zinc-700/20" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-[10px] sm:rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {backImg ? (
            <img src={backImg} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-[10px] sm:rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #2a1a0e 0%, #3d2415 30%, #2a1a0e 60%, #1c1008 100%)'
              }}
            >
              {/* Outer border */}
              <div className="w-full h-full p-[3px]">
                <div className="w-full h-full rounded-[7px] sm:rounded-[9px] overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #4a2c1a, #3d2415, #4a2c1a)'
                  }}
                >
                  {/* Inner rounded rectangle (classic MTG back) */}
                  <div className="w-full h-full rounded-[5px] sm:rounded-[7px] flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(180deg, #3d2415 0%, #2a1a0e 40%, #3d2415 70%, #1c1008 100%)'
                    }}
                  >
                    <div className="w-[86%] h-[90%] rounded-[6px] sm:rounded-lg flex items-center justify-center"
                      style={{ border: '1.5px solid rgba(120, 70, 40, 0.25)' }}
                    >
                      <div className="w-[92%] h-[94%] rounded-[4px] sm:rounded flex flex-col items-center justify-center gap-0.5 sm:gap-1"
                        style={{ border: '1px solid rgba(100, 60, 35, 0.2)' }}
                      >
                        {/* Central orb */}
                        <div className="w-10 h-14 sm:w-14 sm:h-[68px] rounded-full flex items-center justify-center"
                          style={{
                            background: 'radial-gradient(ellipse at 40% 35%, rgba(100, 180, 200, 0.15), rgba(60, 100, 120, 0.08), transparent 70%)',
                            border: '1px solid rgba(100, 70, 40, 0.2)'
                          }}
                        >
                          <div className="w-6 h-10 sm:w-9 sm:h-14 rounded-full"
                            style={{
                              background: 'radial-gradient(ellipse at 40% 35%, rgba(120, 200, 220, 0.12), transparent 70%)'
                            }}
                          />
                        </div>
                        {/* Decorative dots */}
                        <div className="flex gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full" style={{ background: 'rgba(100, 70, 40, 0.25)' }} />
                          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full" style={{ background: 'rgba(100, 70, 40, 0.25)' }} />
                          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full" style={{ background: 'rgba(100, 70, 40, 0.25)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <p className="text-zinc-500 text-[10px] text-center">Cargando cartas...</p>
    </div>
  )
}
