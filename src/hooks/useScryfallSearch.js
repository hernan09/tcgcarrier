import { useReducer, useEffect, useCallback, useRef } from 'react'

const SCRYFALL_API = 'https://api.scryfall.com/cards/search'

const initialState = { cards: [], loading: false, error: null, hasMore: false }

function searchReducer(state, action) {
  switch (action.type) {
    case 'reset':
      return { ...initialState }
    case 'loading':
      return { ...state, loading: true, error: null }
    case 'success':
      return { cards: action.cards, loading: false, error: null, hasMore: action.hasMore }
    case 'append':
      return { ...state, cards: [...state.cards, ...action.cards], loading: false, hasMore: action.hasMore }
    case 'error':
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}

export function useScryfallSearch(query, debounceMs = 400) {
  const [state, dispatch] = useReducer(searchReducer, initialState)
  const nextPageRef = useRef(null)
  const abortRef = useRef(null)

  const search = useCallback(async (q, pageUrl) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    dispatch({ type: 'loading' })

    try {
      const url = pageUrl || `${SCRYFALL_API}?q=${encodeURIComponent(q)}&format=json`
      const res = await fetch(url, { signal: controller.signal })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.details || `Error ${res.status}`)
      }
      const data = await res.json()
      nextPageRef.current = data.has_more ? data.next_page : null
      return data
    } catch (err) {
      if (err.name !== 'AbortError') {
        dispatch({ type: 'error', error: err.message })
      }
      return null
    }
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      dispatch({ type: 'reset' })
      nextPageRef.current = null
      return
    }

    const timer = setTimeout(async () => {
      const data = await search(query)
      if (data) dispatch({ type: 'success', cards: data.data, hasMore: data.has_more })
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, search])

  const loadMore = useCallback(async () => {
    if (!nextPageRef.current || state.loading) return
    const data = await search(query, nextPageRef.current)
    if (data) dispatch({ type: 'append', cards: data.data, hasMore: data.has_more })
  }, [query, state.loading, search])

  return { ...state, loadMore }
}
