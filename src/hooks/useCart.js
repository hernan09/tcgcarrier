import { useReducer, useCallback } from 'react'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(
        item => item.id === action.card.id && item.finish === action.finish
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === existing.id && item.finish === existing.finish
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.card, finish: action.finish, quantity: 1 }],
      }
    }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === action.id && item.finish === action.finish)
        ),
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id && item.finish === action.finish
            ? { ...item, quantity: Math.max(0, action.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = useCallback((card, finish = 'nonfoil') => {
    dispatch({ type: 'ADD', card, finish })
  }, [])

  const removeItem = useCallback((id, finish) => {
    dispatch({ type: 'REMOVE', id, finish })
  }, [])

  const updateQuantity = useCallback((id, finish, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, finish, quantity })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce(
    (sum, item) => sum + (item.prices?.usd ? parseFloat(item.prices.usd) * item.quantity : 0),
    0
  )

  return { items: state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }
}
