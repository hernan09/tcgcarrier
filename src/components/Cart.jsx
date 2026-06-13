import CartItem from './CartItem'

export default function Cart({ items, totalItems, totalPrice, onUpdateQuantity, onRemove, onClear, onClose }) {
  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:text-zinc-200 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 sm:hidden"
            aria-label="Close cart and go back"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-zinc-100">
            Cart{totalItems > 0 && <span className="ml-2 text-sm font-normal text-zinc-500">({totalItems})</span>}
          </h2>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-zinc-600 transition-colors hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 rounded px-2 py-1"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overscroll-behavior-contain px-5 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="mb-4 h-16 w-16 text-zinc-800" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h3 className="text-sm font-medium text-zinc-500">Your cart is empty</h3>
            <p className="mt-1 text-xs text-zinc-700">Search for cards to add them</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <CartItem
                key={`${item.id}-${item.finish}`}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-zinc-800 px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Total</span>
            <span className="font-mono text-lg font-semibold text-zinc-100 tabular-nums">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <button className="mt-3 w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40">
            Checkout
          </button>
        </div>
      )}
    </aside>
  )
}
