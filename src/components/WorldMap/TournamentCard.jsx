import { useState } from 'react'
import DeckView from './DeckView'

const FORMAT_COLORS = {
  EDH: '#ff9632',
  Standard: '#4d8cf7',
  Modern: '#a855f7',
  Pioneer: '#22c55e',
}

function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts * 1000).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short',
  })
}

function venueFromAddress(addr) {
  if (!addr) return ''
  const parts = addr.split(',').map(s => s.trim()).filter(Boolean)
  return parts[0] || ''
}

function formatPlayers(n) {
  if (!n || n <= 0) return ''
  return n === 1 ? '1 jugador' : `${n} jugadores`
}

export default function TournamentCard({ pin, countryName, onClose }) {
  const [deckTournament, setDeckTournament] = useState(null)
  const tournaments = pin?.tournaments || []
  const isEmpty = !pin && countryName
  const formatColor = pin?.format ? FORMAT_COLORS[pin.format] || '#888' : null

  if (deckTournament) {
    return (
      <DeckView
        tournament={deckTournament}
        onBack={() => setDeckTournament(null)}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-32px)] max-w-sm">
      <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: formatColor || (isEmpty ? '#71717a' : '#ff9632'),
                boxShadow: formatColor ? `0 0 6px ${formatColor}80` : 'none',
              }}
            />
            <span className="text-zinc-300 text-sm font-medium truncate">
              {isEmpty ? countryName : (tournaments.length === 1 ? '1 torneo' : `${tournaments.length} torneos`)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isEmpty ? (
          <div className="px-4 py-8 text-center">
            <p className="text-zinc-400 text-sm mb-1">No hay torneos ni ligas aquí</p>
            <p className="text-zinc-600 text-xs">No se encontraron eventos Magic recientes en {countryName}</p>
          </div>
        ) : (
          <div className="px-4 py-2 max-h-[44vh] overflow-y-auto space-y-1.5">
            {tournaments.slice(0, 30).map(t => {
              const fmtColor = FORMAT_COLORS[t.format] || '#888'
              const hasDeck = t.winnerDeck && (t.winnerDeck.mainboard?.length > 0 || t.winnerDeck.commanders?.length > 0)
              return (
                <div
                  key={t.tid || `${t.name}_${t.startDate}`}
                  onClick={hasDeck ? () => setDeckTournament(t) : undefined}
                  className={`rounded-xl bg-zinc-800/30 px-3 py-2.5 ${
                    hasDeck ? 'cursor-pointer hover:bg-zinc-700/40 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="flex items-center gap-1.5 min-w-0">
                      <span className="text-zinc-100 text-sm font-medium leading-tight truncate">{t.name}</span>
                      {hasDeck && (
                        <span className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-400">
                          Mazo
                        </span>
                      )}
                    </p>
                    <span
                      className="shrink-0 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${fmtColor}20`,
                        color: fmtColor,
                      }}
                    >
                      {t.format || '?'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-zinc-500">
                    <span className="truncate max-w-[160px]">{venueFromAddress(t.address)}</span>
                    {t.city && (
                      <span className="truncate">{t.city}{t.state ? `, ${t.state}` : ''}</span>
                    )}
                    {t.city && t.startDate ? <span>·</span> : null}
                    {t.startDate ? <span className="shrink-0">{formatDate(t.startDate)}</span> : null}
                    {t.players > 0 && (
                      <>
                        <span>·</span>
                        <span className="shrink-0">{formatPlayers(t.players)}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="px-4 py-2 border-t border-zinc-800/60">
          <p className="text-[10px] text-zinc-600 text-center">
            Datos de <a href="https://topdeck.gg" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-400 underline underline-offset-2">TopDeck.gg</a>
          </p>
        </div>
      </div>
    </div>
  )
}
