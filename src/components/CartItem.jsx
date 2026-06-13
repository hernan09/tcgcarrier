const finishLabels = { nonfoil: 'Nonfoil', foil: 'Foil' }

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const price = item.finish === 'foil'
    ? parseFloat(item.prices?.usd_foil || 0)
    : parseFloat(item.prices?.usd || 0)
  const subtotal = price * item.quantity
  const image = item.image_uris?.small

  return (
    <div className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 transition-colors hover:border-zinc-700">
      <div className="h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
        {image ? (
          <img
            src={image}
            alt={item.name}
            width="146"
            height="204"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="truncate text-sm font-medium text-zinc-200">{item.name}</h4>
          <button
            onClick={() => onRemove(item.id, item.finish)}
            className="shrink-0 rounded p-0.5 text-zinc-600 transition-colors hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
            aria-label={`Remove ${item.name} from cart`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>{finishLabels[item.finish]}</span>
          <span>·</span>
          <span className="font-mono">${price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900">
            <button
              onClick={() => onUpdateQuantity(item.id, item.finish, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="flex h-7 w-7 items-center justify-center text-xs font-mono text-zinc-300 tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.finish, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" d="M12 5v14m7-7H5" />
              </svg>
            </button>
          </div>
          <span className="ml-auto font-mono text-sm font-medium text-zinc-200 tabular-nums">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
