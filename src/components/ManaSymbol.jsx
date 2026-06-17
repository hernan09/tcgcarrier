function manaFontClass(symbol) {
  const key = symbol.toLowerCase()
  if (/^\d+$/.test(key)) return `ms ms-${key}`
  if (['w', 'u', 'b', 'r', 'g', 'c', 'x', 't'].includes(key)) return `ms ms-${key}`
  return 'ms ms-c'
}

export function ManaSymbol({ symbol, size = 'cost', shadow = true, className = '' }) {
  if (!symbol) return null
  const sizeClass = size === 'cost' ? 'ms-cost' : size === 'lg' ? 'ms-2x' : 'ms-cost'
  return (
    <i
      className={`${manaFontClass(symbol)} ${sizeClass}${shadow ? ' ms-shadow' : ''} ${className}`.trim()}
      aria-hidden="true"
    />
  )
}

export function ManaSymbolGroup({ colors, size = 'lg', className = '' }) {
  if (!colors?.length) return null
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {colors.map((c) => (
        <ManaSymbol key={c} symbol={c} size={size} />
      ))}
    </span>
  )
}
