export const COLORS = [
  {
    id: 'white',
    name: 'Blanco',
    symbol: 'W',
    hex: '#F8E7A0',
    gradient: 'from-amber-100 via-yellow-50 to-amber-100',
    gradientBg: 'from-amber-500/20 via-yellow-500/10 to-amber-500/20',
    borderGlow: 'shadow-amber-500/30',
    textGlow: 'text-amber-200',
    iconBg: 'bg-amber-400/20',
    description:
      'El blanco es el color del orden, la ley, la comunidad y la protección. Los magos blancos buscan la paz a través de la estructura, usando ejércitos de criaturas, magia curativa y poderosos encantamientos para controlar el campo de batalla.',
    mechanics: 'Ganar vidas, fichas, exiliar, vigilancia, dañar primero, protección.',
    philosophy: 'Ley, orden, comunidad, moralidad, luz.',
    cards: ['Serra Angel', 'Swords to Plowshares', 'Wrath of God'],
  },
  {
    id: 'blue',
    name: 'Azul',
    symbol: 'U',
    hex: '#9DD7F5',
    gradient: 'from-sky-200 via-blue-100 to-sky-200',
    gradientBg: 'from-sky-500/20 via-blue-500/10 to-sky-500/20',
    borderGlow: 'shadow-sky-500/30',
    textGlow: 'text-sky-200',
    iconBg: 'bg-sky-400/20',
    description:
      'El azul es el color del conocimiento, la lógica, la manipulación y la ilusión. Los magos azules creen en la perfección a través del entendimiento, usando contrahechizos, robo de cartas y control mental para superar a sus oponentes.',
    mechanics: 'Contrahechizos, robar cartas, devolver, volar, escrutar, moler.',
    philosophy: 'Conocimiento, manipulación, ilusión, perfección, agua.',
    cards: ['Counterspell', 'Brainstorm', 'Snapcaster Mage'],
  },
  {
    id: 'black',
    name: 'Negro',
    symbol: 'B',
    hex: '#C5A9C5',
    gradient: 'from-zinc-400 via-stone-300 to-zinc-400',
    gradientBg: 'from-zinc-700/40 via-stone-800/30 to-zinc-700/40',
    borderGlow: 'shadow-zinc-500/30',
    textGlow: 'text-zinc-300',
    iconBg: 'bg-zinc-400/20',
    description:
      'El negro es el color de la ambición, la muerte, el sacrificio y el poder a cualquier costo. Los magos negros abrazan la oscuridad, usando la manipulación del cementerio, eliminación de criaturas y pactos demoníacos para alcanzar la victoria.',
    mechanics: 'Recursión de cementerio, eliminación, descartar, tutores, sacrificio.',
    philosophy: 'Ambición, muerte, poder, egoísmo, oscuridad.',
    cards: ['Dark Ritual', 'Doom Blade', 'Thoughtseize'],
  },
  {
    id: 'red',
    name: 'Rojo',
    symbol: 'R',
    hex: '#F7A08C',
    gradient: 'from-orange-200 via-red-100 to-orange-200',
    gradientBg: 'from-red-500/20 via-orange-500/10 to-red-500/20',
    borderGlow: 'shadow-red-500/30',
    textGlow: 'text-red-200',
    iconBg: 'bg-red-400/20',
    description:
      'El rojo es el color del caos, el impulso, la emoción y la destrucción. Los magos rojos actúan por instinto, valorando la libertad y la pasión. Queman enemigos directamente, invocan criaturas feroces y lanzan hechizos devastadores con abandono temerario.',
    mechanics: 'Daño directo, celeridad, arrollar, destruir artefactos, robo impulsivo.',
    philosophy: 'Caos, emoción, libertad, pasión, fuego.',
    cards: ['Lightning Bolt', 'Goblin Guide', 'Shock'],
  },
  {
    id: 'green',
    name: 'Verde',
    symbol: 'G',
    hex: '#A7D8A7',
    gradient: 'from-emerald-200 via-green-100 to-emerald-200',
    gradientBg: 'from-emerald-500/20 via-green-500/10 to-emerald-500/20',
    borderGlow: 'shadow-emerald-500/30',
    textGlow: 'text-emerald-200',
    iconBg: 'bg-emerald-400/20',
    description:
      'El verde es el color de la naturaleza, el crecimiento, el instinto y la interdependencia. Los magos verdes respetan el orden natural, invocando criaturas masivas, acelerando la producción de maná y nutriendo el estado del campo de batalla.',
    mechanics: 'Acelerar maná, criaturas grandes, luchar, antimaleficio, alcance, arrollar.',
    philosophy: 'Naturaleza, crecimiento, instinto, interdependencia, vida.',
    cards: ['Llanowar Elves', 'Giant Growth', 'Gaea\'s Cradle'],
  },
]

export const HOW_TO_PLAY_STEPS = [
  {
    title: '¿Qué es Magic?',
    subtitle: 'Un juego de magos, criaturas y hechizos',
    description:
      'Magic: The Gathering es el primer juego de cartas coleccionables del mundo. Juegas como un Planeswalker — un poderoso mago — enfrentándote a oponentes lanzando hechizos, invocando criaturas y usando artefactos para reducir la vida de tu oponente de 20 a 0.',
    icon: '⚔️',
    tips: 'Cada jugador comienza con 20 vidas y un mazo de 60 cartas.',
  },
  {
    title: 'Las Cartas',
    subtitle: 'Tierras, Criaturas, Conjuros y más',
    description:
      'Hay varios tipos de cartas: Las Tierras producen maná (tu recurso). Las Criaturas luchan por ti. Los Conjuros y los Instantáneos son hechizos de un solo uso. Los Encantamientos y Artefactos permanecen en el campo de batalla. Cada carta tiene un costo de maná en la esquina superior derecha.',
    icon: '🃏',
    tips: 'Puedes jugar una tierra por turno. Las tierras son tu fuente principal de maná.',
  },
  {
    title: 'Maná y Lanzamiento',
    subtitle: 'Gira tierras, paga costos, lanza hechizos',
    description:
      'Para lanzar un hechizo necesitas maná. Gira (rota 90°) tus tierras para producir maná de colores específicos. Los símbolos de maná en el costo de una carta te indican lo que necesitas. Por ejemplo, un costo de {2}{W} significa 2 maná de cualquier color + 1 maná blanco.',
    icon: '💎',
    tips: 'Los símbolos de maná de color corresponden a los cinco colores: Blanco, Azul, Negro, Rojo, Verde.',
  },
  {
    title: 'Estructura del Turno',
    subtitle: 'Enderezar, Mantenimiento, Robar, Principal, Combate, Principal, Final',
    description:
      'Cada turno sigue una secuencia: Endereza tus cartas (se ponen verticales). Mantenimiento (ocurren algunos eventos). Roba una carta. Fase Principal (juega tierras, lanza hechizos). Combate (ataca con criaturas). Segunda Fase Principal. Paso Final (descarta a 7 cartas). Luego pasa el turno.',
    icon: '🔄',
    tips: 'Robas una carta por turno. Tu máximo de cartas en mano es 7.',
  },
  {
    title: 'Combate',
    subtitle: 'Ataca, bloquea y haz daño',
    description:
      'Durante tu fase de combate, declaras qué criaturas atacan. Tu oponente puede bloquear con sus criaturas. Las criaturas hacen daño igual a su fuerza. Si la resistencia de un bloqueador se reduce a 0 o menos, muere (va al cementerio). Las criaturas no bloqueadas dañan directamente al oponente.',
    icon: '⚡',
    tips: 'Las criaturas con Arrollar pueden hacer daño excesivo al jugador.',
  },
  {
    title: 'Ganar la Partida',
    subtitle: 'Reduce la vida a 0 — o encuentra otra forma',
    description:
      'La forma más común de ganar es reducir la vida de tu oponente de 20 a 0. Existen otras condiciones de victoria: hacer que tu oponente robe de un mazo vacío, usar cartas de condición de victoria alternativas como "Approach of the Second Sun", o que tu oponente se rinda.',
    icon: '🏆',
    tips: 'Una partida también puede terminar en empate si ambos jugadores pierden simultáneamente.',
  },
]
