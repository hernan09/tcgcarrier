import { useState, useCallback, useMemo } from 'react'
import { useScryfallSearch } from './hooks/useScryfallSearch'
import { useCart } from './hooks/useCart'
import SearchBar from './components/SearchBar'
import FormatFilter from './components/FormatFilter'
import CardGrid from './components/CardGrid'
import Cart from './components/Cart'
import CardModal from './components/CardModal'

export default function App() {
  const [userQuery, setUserQuery] = useState('')
  const [format, setFormat] = useState('standard')
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)

  const query = useMemo(() => {
    const fmt = `f:${format}`
    return userQuery.trim() ? `${fmt} ${userQuery}` : fmt
  }, [format, userQuery])

  const { cards, loading, error, hasMore, loadMore } = useScryfallSearch(query)
  const { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

  const handleAddToCart = useCallback((card, finish) => {
    addItem(card, finish)
    setCartOpen(true)
  }, [addItem])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-2.5 shrink-0" aria-label="TCG Carrier home">
            <svg className="h-7 w-7 text-indigo-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-zinc-100">
              TCG Carrier
            </span>
          </a>

          <div className="hidden flex-1 items-center gap-4 md:flex">
            <div className="flex-1 flex justify-center">
              <SearchBar query={userQuery} onQueryChange={setUserQuery} loading={loading} />
            </div>
            <FormatFilter selected={format} onSelect={setFormat} />
          </div>

          <div className="flex flex-1 items-center justify-end gap-4 md:hidden">
            <SearchBar query={userQuery} onQueryChange={setUserQuery} loading={loading} />
          </div>

          <button
            onClick={() => setCartOpen(prev => !prev)}
            className="relative shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 transition-colors hover:border-zinc-700 hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white tabular-nums">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 md:hidden">
          <FormatFilter selected={format} onSelect={setFormat} />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <main className="min-h-[calc(100vh-4rem)] flex-1 px-4 py-6 sm:px-6 lg:pr-8">
          <div className="mb-4 hidden md:block">
            <FormatFilter selected={format} onSelect={setFormat} />
          </div>
          <CardGrid
            cards={cards}
            loading={loading}
            error={error}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onAddToCart={handleAddToCart}
            onSelect={setSelectedCard}
          />
        </main>

        <aside
          className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md translate-x-0 border-l border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out sm:sticky sm:top-16 sm:h-[calc(100vh-4rem)] sm:max-w-sm sm:shadow-none ${
            cartOpen ? 'translate-x-0' : 'translate-x-full sm:translate-x-0'
          }`}
          aria-label="Shopping cart"
        >
          <Cart
            items={items}
            totalItems={totalItems}
            totalPrice={totalPrice}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
            onClear={clearCart}
            onClose={() => setCartOpen(false)}
          />
        </aside>
      </div>

      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setCartOpen(false)}
          aria-hidden="true"
        />
      )}

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}
