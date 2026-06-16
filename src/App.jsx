import { useState, useCallback, useMemo } from 'react'
import { useScryfallSearch } from './hooks/useScryfallSearch'
import { useCart } from './hooks/useCart'
import Home from './components/Home'
import SearchBar from './components/SearchBar'
import FormatFilter from './components/FormatFilter'
import CardGrid from './components/CardGrid'
import Cart from './components/Cart'
import CardModal from './components/CardModal'
import GameDemo from './components/GameDemo'

export default function App() {
  const [showHome, setShowHome] = useState(true)
  const [showGame, setShowGame] = useState(false)
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

  const handleStartGame = useCallback(() => {
    setShowGame(true)
    setShowHome(false)
  }, [])

  const handleBackFromGame = useCallback(() => {
    setShowGame(false)
    setShowHome(true)
  }, [])

  const handleStartSearching = useCallback(() => {
    setShowHome(false)
    if (userQuery.trim()) {
      document.querySelector('input[type="search"]')?.focus()
    }
  }, [userQuery])

  const handleLogoClick = useCallback((e) => {
    e.preventDefault()
    setShowHome(true)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-2.5 shrink-0" aria-label="TCG Carrier inicio">
            <svg className="h-7 w-7 text-indigo-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-zinc-100">
              TCG Carrier
            </span>
          </a>

          {!showGame && (
            <button
              onClick={handleStartGame}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1.5 sm:px-3 text-xs font-medium text-indigo-300 transition-all hover:bg-indigo-500/20 hover:border-indigo-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shrink-0"
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
              </svg>
              <span className="hidden sm:inline">Práctica</span>
            </button>
          )}
          {showGame && (
            <button
              onClick={handleBackFromGame}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 sm:px-3 text-xs font-medium text-zinc-400 transition-all hover:border-zinc-700 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shrink-0"
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="hidden sm:inline">Inicio</span>
            </button>
          )}

          {!showHome && (
            <>
              <div className="hidden flex-1 items-center gap-4 md:flex">
                <div className="flex-1 flex justify-center">
                  <SearchBar query={userQuery} onQueryChange={setUserQuery} loading={loading} />
                </div>
                <FormatFilter selected={format} onSelect={setFormat} />
              </div>
              <div className="flex flex-1 items-center justify-end gap-4 md:hidden">
                <SearchBar query={userQuery} onQueryChange={setUserQuery} loading={loading} />
              </div>
            </>
          )}

          <button
            onClick={() => setCartOpen(prev => !prev)}
            className="relative shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 transition-colors hover:border-zinc-700 hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            aria-label={`Carrito con ${totalItems} artículos`}
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

        {!showHome && (
          <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 md:hidden">
            <FormatFilter selected={format} onSelect={setFormat} />
          </div>
        )}
      </header>

      {showGame ? (
        <GameDemo onBack={handleBackFromGame} />
      ) : showHome ? (
        <Home onStartSearching={handleStartSearching} />
      ) : (
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
      )}

      {!showHome && cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setCartOpen(false)}
          aria-hidden="true"
        />
      )}

      {!showHome && selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}
