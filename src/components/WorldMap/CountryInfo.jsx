import { useState, useEffect } from 'react'

export default function CountryInfo({ country, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!country?.name) return
    setLoading(true)
    setError(false)
    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country.name)}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(json => {
        const c = json[0]
        setData({
          name: c.name?.common || country.name,
          flag: c.flags?.svg || c.flags?.png || '',
          capital: c.capital?.[0] || '',
          region: c.region || '',
          subregion: c.subregion || '',
          population: c.population
            ? (c.population / 1000000).toFixed(1) + 'M'
            : '',
          curl: c.currencies
            ? Object.values(c.currencies)[0]?.name || ''
            : '',
        })
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [country])

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-sm">
      <div className="rounded-2xl border border-zinc-700/50 bg-zinc-900/90 backdrop-blur-xl p-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-16 h-10 rounded bg-zinc-800 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-zinc-500 text-lg shrink-0">
              {country.name?.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-zinc-200 font-semibold text-sm">{country.name}</p>
              <p className="text-zinc-500 text-xs">Información no disponible</p>
            </div>
          </div>
        )}

        {data && !loading && (
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {data.flag ? (
                <img
                  src={data.flag}
                  alt={data.name}
                  className="w-16 h-10 object-cover rounded shadow-lg"
                />
              ) : (
                <div className="w-16 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                  ?
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-zinc-100 font-bold text-base leading-tight">
                {data.name}
              </h3>
              <div className="mt-1.5 space-y-0.5">
                {data.capital && (
                  <p className="text-zinc-400 text-xs">
                    <span className="text-zinc-500">Capital:</span> {data.capital}
                  </p>
                )}
                {data.region && (
                  <p className="text-zinc-400 text-xs">
                    <span className="text-zinc-500">Región:</span> {data.region}
                    {data.subregion ? ` — ${data.subregion}` : ''}
                  </p>
                )}
                {data.population && (
                  <p className="text-zinc-400 text-xs">
                    <span className="text-zinc-500">Población:</span> {data.population}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
