const PREFIX = 'tcg_'

export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { data } = JSON.parse(raw)
    return data
  } catch {
    return null
  }
}

export function cacheSet(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ data }))
  } catch {
    try {
      localStorage.clear()
      localStorage.setItem(PREFIX + key, JSON.stringify({ data }))
    } catch {}
  }
}
