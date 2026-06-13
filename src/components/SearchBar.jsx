import { useRef } from 'react'

export default function SearchBar({ query, onQueryChange, loading }) {
  const inputRef = useRef(null)

  return (
    <div className="relative w-full max-w-xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          className={`h-5 w-5 ${loading ? 'text-indigo-400' : 'text-zinc-500'}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <input
        ref={inputRef}
        type="search"
        name="card-search"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        placeholder="Search Magic cards…"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-3.5 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-500 backdrop-blur-sm transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  )
}
