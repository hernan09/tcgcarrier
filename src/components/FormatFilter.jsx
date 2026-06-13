const FORMATS = [
  { id: 'standard', label: 'Standard' },
  { id: 'modern', label: 'Modern' },
  { id: 'pioneer', label: 'Pioneer' },
  { id: 'legacy', label: 'Legacy' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'commander', label: 'Commander' },
  { id: 'pauper', label: 'Pauper' },
]

export default function FormatFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Card format filter">
      {FORMATS.map(f => (
        <button
          key={f.id}
          onClick={() => onSelect(f.id)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
            selected === f.id
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
          aria-pressed={selected === f.id}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
