export const TUTORIAL_LESSONS = [
  {
    id: 'selva-embrujada',
    title: 'Selva Embrujada',
    subtitle: 'Tu Primer Duelo',
    description: 'Aprende a jugar tierras, invocar criaturas y atacar en tu primer combate.',
    deckPreview: ['Bosque', 'Llanowar Elves', 'Oso Gris'],
    color: 'emerald',
    colorText: 'text-emerald-400',
    colorBorder: 'border-emerald-500/30',
    colorBg: 'bg-emerald-500/10',
    scenes: [
      {
        phase: 'Inicio del Turno',
        instruction: '¡Bienvenido a tu primer duelo! Eres un Planeswalker verde. En tu mano tienes 4 cartas: tierras para generar maná y criaturas para defenderte.',
        tip: 'El verde es el color de la naturaleza. Se especializa en criar criaturas grandes y generar maná extra.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f1', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 2500 },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Paso 1 — Juega una Tierra. Haz clic en un **Bosque** de tu mano para ponerlo en el campo de batalla.',
        tip: 'Solo puedes jugar UNA tierra por turno. Las tierras son tu fuente principal de maná.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f1', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_hand', highlightIds: ['f1', 'f2'] },
      },
      {
        phase: 'Fase Principal',
        instruction: '¡Bosque en juego! Ahora tienes acceso a {G} (maná verde). Gira el Bosque para generar maná y lanzar hechizos.',
        tip: 'Puedes girar una tierra en cualquier momento para añadir maná a tu reserva. El maná se pierde al final de cada fase.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 1800 },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Paso 2 — Invoca una Criatura. Haz clic en **Llanowar Elves**. El Bosque se girará para pagar su costo de {G}.',
        tip: 'El costo de maná está en la esquina superior derecha. {G} significa 1 maná verde.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_hand', highlightIds: ['ll'] },
      },
      {
        phase: 'Fase Principal',
        instruction: '¡Llanowar Elves (1/1) ha entrado al campo! El Bosque se giró para pagar su costo. Llanowar Elves tiene *enfermedad de invocación* y no podrá atacar hasta tu próximo turno.',
        tip: 'Las criaturas recién invocadas no pueden atacar hasta el inicio de tu próximo turno.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 2000 },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Has terminado tu fase principal. Pasa a la fase de combate.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'button', label: 'Pasar a Combate' },
      },
      {
        phase: 'Fase de Combate',
        instruction: 'Fase de Combate — Llanowar Elves no puede atacar (enfermedad de invocación). Termina tu turno.',
        tip: 'En la fase de combate declaras atacantes. Las criaturas deben estar enderezadas y sin enfermedad de invocación.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'button', label: 'Terminar Turno' },
      },
      {
        phase: 'Turno del Oponente',
        instruction: 'Turno del Oponente — Juega una Montaña y pasa. Observa cómo el oponente también administra sus recursos.',
        tip: 'En Magic, turno va y viene. Ambos jugadores juegan tierras y lanzan hechizos.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
          ],
          opponentBoard: [
            { id: 'om1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 2500 },
      },
      {
        phase: 'Inicio del Turno',
        instruction: '¡Tu turno otra vez! Robas una carta: **Crecimiento Gigante** — un instantáneo que da +3/+3 a una criatura hasta el final del turno.',
        tip: 'Cada turno robas UNA carta al inicio. Los instantáneos pueden lanzarse en cualquier momento, incluso en combate.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
            { id: 'gg', name: 'Crecimiento Gigante', typeLine: 'Instantáneo', manaCost: '{G}', cmc: 1, color: 'G', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
          ],
          opponentBoard: [
            { id: 'om1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 2500 },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Paso 3 — Juega tu segunda tierra. Haz clic en el **Bosque** de tu mano.',
        tip: 'Ya tienes un Bosque en juego. Con dos tierras podrás lanzar hechizos más grandes.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'f2', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
            { id: 'gg', name: 'Crecimiento Gigante', typeLine: 'Instantáneo', manaCost: '{G}', cmc: 1, color: 'G', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
          ],
          opponentBoard: [
            { id: 'om1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_hand', highlightIds: ['f2'] },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Paso 4 — Invoca al **Oso Gris**. Cuesta {1}{G}. Puedes girar ambos Bosques para pagarlo. Haz clic en el Oso Gris.',
        tip: '{1} significa 1 maná de cualquier color. {G} significa 1 maná verde. Total: 2 manás.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
            { id: 'gg', name: 'Crecimiento Gigante', typeLine: 'Instantáneo', manaCost: '{G}', cmc: 1, color: 'G', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'f2b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
          ],
          opponentBoard: [
            { id: 'om1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_hand', highlightIds: ['gb'] },
      },
      {
        phase: 'Fase Principal',
        instruction: '¡Oso Gris (2/2) en el campo! Ahora tienes un ejército: Llanowar Elves (1/1) y Oso Gris (2/2). Pasa a combate.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'gg', name: 'Crecimiento Gigante', typeLine: 'Instantáneo', manaCost: '{G}', cmc: 1, color: 'G', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'f2b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          opponentBoard: [
            { id: 'om1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentHandCount: 5,
        },
        interaction: { type: 'button', label: 'Pasar a Combate' },
      },
      {
        phase: 'Fase de Combate',
        instruction: 'Paso 5 — ¡A la carga! Haz clic en el **Oso Gris** para declararlo como atacante. Hará 2 daños al oponente.',
        tip: 'Puedes atacar con cualquier criatura enderezada. Llanowar Elves ahora sí puede atacar (pasó un turno desde que entró).',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'gg', name: 'Crecimiento Gigante', typeLine: 'Instantáneo', manaCost: '{G}', cmc: 1, color: 'G', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'f2b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          opponentBoard: [
            { id: 'om1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_board', highlightIds: ['gb'] },
      },
      {
        phase: 'Fase de Combate',
        instruction: '¡Golpe exitoso! El oponente no tiene bloqueadores. El Oso Gris le hace **2 daños**. Vida del oponente: 20 → 18.',
        tip: 'Si el oponente no puede bloquear, el daño va directo a su vida. ¡Así se gana la partida!',
        state: {
          playerLife: 20, opponentLife: 18,
          playerHand: [
            { id: 'gg', name: 'Crecimiento Gigante', typeLine: 'Instantáneo', manaCost: '{G}', cmc: 1, color: 'G', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'f2b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: true },
          ],
          opponentBoard: [
            { id: 'om1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'auto', delay: 2500 },
      },
      {
        phase: 'Lección Completada',
        instruction: '¡Excelente! Has completado tu primera lección. Aprendiste:\n\n🃏 **Jugar tierras** para generar maná\n⚔️ **Invocar criaturas** pagando su costo\n🎯 **Atacar** para reducir la vida del oponente\n\n¡Sigue practicando y conviértete en un gran Planeswalker!',
        state: {
          playerLife: 20, opponentLife: 18,
          playerHand: [
            { id: 'gg', name: 'Crecimiento Gigante', typeLine: 'Instantáneo', manaCost: '{G}', cmc: 1, color: 'G', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'f1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'f2b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'll', name: 'Llanowar Elves', typeLine: 'Criatura — Elfo Druida', manaCost: '{G}', cmc: 1, color: 'G', power: 1, toughness: 1, tapped: false },
            { id: 'gb', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: true },
          ],
          opponentBoard: [
            { id: 'om1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'button', label: 'Completar Lección' },
      },
    ],
  },
  {
    id: 'magia-izzet',
    title: 'Magia Izzet',
    subtitle: 'Hechizos y Estrategia',
    description: 'Domina los hechizos instantáneos y el combate táctico con el gremio Izzet.',
    deckPreview: ['Montaña', 'Isla', 'Lightning Strike'],
    color: 'red',
    colorText: 'text-red-400',
    colorBorder: 'border-red-500/30',
    colorBg: 'bg-red-500/10',
    scenes: [
      {
        phase: 'Inicio del Turno',
        instruction: '¡Bienvenido a la lección Izzet! El gremio Izzet combina el poder del **rojo** (caos) y el **azul** (conocimiento) para lanzar hechizos devastadores y reaccionar en cualquier momento.',
        tip: 'Izzet es conocido por lanzar muchos hechizos, robar cartas y usar instantáneos para controlar el combate.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'm1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'i1', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: false },
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 2500 },
      },
      {
        phase: 'Turno 1 — Fase Principal',
        instruction: 'Paso 1 — Juega una **Montaña**. Haz clic en la Montaña de tu mano.',
        tip: 'La Montaña produce {R} (maná rojo). El rojo es el color del daño directo y la velocidad.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'm1', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'i1', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: false },
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_hand', highlightIds: ['m1'] },
      },
      {
        phase: 'Turno 1 — Fase Principal',
        instruction: 'Con una Montaña solo tienes {R}. No es suficiente para tus hechizos (cuestan {1}{R}). Termina tu turno por ahora.',
        tip: 'En tu primer turno a veces no podrás hacer mucho. ¡La paciencia es parte del juego!',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'i1', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: false },
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'm1b', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'button', label: 'Terminar Turno' },
      },
      {
        phase: 'Turno del Oponente',
        instruction: 'El oponente juega una Montaña e invoca a un **Goblin Rezagado** (1/1). Te está presionando.',
        tip: 'Los mazos rojos suelen jugar criaturas pequeñas y rápidas para presionar desde el principio.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'i1', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: false },
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'm1b', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [
            { id: 'om2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og1', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'auto', delay: 2500 },
      },
      {
        phase: 'Turno 2 — Inicio',
        instruction: '¡Tu turno! Robas una carta. Ahora tienes 4 cartas en mano. Juega la **Isla** para tener acceso a dos colores.',
        tip: 'Con Montaña + Isla tendrás {R} y {U}. ¡Suficiente para lanzar tus hechizos Izzet!',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'i1', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: false },
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
            { id: 'm2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'm1b', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [
            { id: 'om2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og1', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'click_hand', highlightIds: ['i1'] },
      },
      {
        phase: 'Turno 2 — Fase Principal',
        instruction: 'Paso 2 — Invoca a **Slickshot Show-Off** ({1}{R}). Tiene Celeridad (puede atacar este turno). Haz clic en él.',
        tip: 'Celeridad permite a la criatura atacar en el mismo turno que entra al campo, ignorando la enfermedad de invocación.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: false },
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
            { id: 'm2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'm1b', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'i1b', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [
            { id: 'om2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og1', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'click_hand', highlightIds: ['so'] },
      },
      {
        phase: 'Turno 2 — Fase Principal',
        instruction: '¡Slickshot Show-Off (2/1) con Celeridad está listo para atacar! Pasa a la fase de combate.',
        tip: 'Slickshot tiene Celeridad: puede atacar inmediatamente. Además, cuando hace daño, te permite robar y descartar.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
            { id: 'm2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'm1b', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'i1b', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: false },
          ],
          opponentBoard: [
            { id: 'om2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og1', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'button', label: 'Pasar a Combate' },
      },
      {
        phase: 'Turno 2 — Fase de Combate',
        instruction: 'Paso 3 — Ataca con **Slickshot Show-Off**. Haz clic en él para declararlo atacante.',
        tip: 'Slickshot tiene 2 de fuerza. Hará 2 daños. El oponente tiene un Goblin (1/1) que podría bloquear.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
            { id: 'm2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'm1b', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'i1b', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: false },
          ],
          opponentBoard: [
            { id: 'om2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og1', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'click_board', highlightIds: ['so'] },
      },
      {
        phase: 'Turno 2 — Fase de Combate',
        instruction: '¡El oponente bloquea con su **Goblin Rezagado**! Tus tierras están giradas... pero tienes **Lightning Strike** en la mano. ¡Es un instantáneo! Puedes lanzarlo AHORA antes de que se resuelva el daño.',
        tip: 'Los instantáneos pueden lanzarse en cualquier momento, incluso durante el combate. ¡Úsalos para sorprender a tu oponente!',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
            { id: 'm2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'm1b', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'i1b', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: false },
          ],
          opponentBoard: [
            { id: 'om2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og1', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'click_hand', highlightIds: ['ls'] },
      },
      {
        phase: 'Turno 2 — Fase de Combate',
        instruction: '¡Lightning Strike hace **3 daños** al Goblin Rezagado! El Goblin muere antes de hacer daño en combate. Slickshot Show-Off hace **2 daños** al oponente sin ser bloqueado. ¡Jugada perfecta!',
        tip: 'Eliminar al bloqueador antes de que se resuelva el daño permite que tu atacante haga daño directo. ¡Así se usa la velocidad instantánea!',
        state: {
          playerLife: 20, opponentLife: 18,
          playerHand: [
            { id: 'm2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'm1b', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'i1b', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: true },
          ],
          opponentBoard: [
            { id: 'om2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
          ],
          opponentHandCount: 4,
          playerGraveyard: [
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
          ],
          opponentGraveyard: [
            { id: 'og1', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
        },
        interaction: { type: 'auto', delay: 3000 },
      },
      {
        phase: 'Lección Completada',
        instruction: '¡Lección completada! Aprendiste:\n\n🔥 **Dos colores**: Combinar rojo y azul (Izzet)\n⚡ **Celeridad**: Atacar el mismo turno\n🎯 **Instantáneos en combate**: Lanzar hechizos durante el combate para eliminar bloqueadores\n\n¡Este es el poder del gremio Izzet!',
        state: {
          playerLife: 20, opponentLife: 18,
          playerHand: [
            { id: 'm2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          playerBoard: [
            { id: 'm1b', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'i1b', name: 'Isla', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'so', name: 'Slickshot Show-Off', typeLine: 'Criatura — Viashino Pirata', manaCost: '{1}{R}', cmc: 2, color: 'R', power: 2, toughness: 1, tapped: true },
          ],
          opponentBoard: [
            { id: 'om2', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
          ],
          opponentHandCount: 4,
          playerGraveyard: [
            { id: 'ls', name: 'Lightning Strike', typeLine: 'Instantáneo', manaCost: '{1}{R}', cmc: 2, color: 'R', power: null, toughness: null, tapped: false },
          ],
          opponentGraveyard: [
            { id: 'og1', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
        },
        interaction: { type: 'button', label: 'Completar Lección' },
      },
    ],
  },
  {
    id: 'acero-y-colnillo',
    title: 'Acero y Colmillo',
    subtitle: 'Fuerza y Resistencia',
    description: 'Domina el combate: aprende cómo la Fuerza y la Resistencia determinan quién gana en cada enfrentamiento.',
    deckPreview: ['Llanura', 'Bosque', 'Lobo de Plata', 'Oso Gris'],
    color: 'sky',
    colorText: 'text-sky-400',
    colorBorder: 'border-sky-500/30',
    colorBg: 'bg-sky-500/10',
    scenes: [
      {
        phase: 'Inicio del Turno',
        instruction: '¡Bienvenido! Hoy aprenderás sobre **Fuerza** y **Resistencia** — los dos números más importantes en combate.\n\nCada criatura tiene **Fuerza / Resistencia**. La **Fuerza** es cuánto daño hace al atacar o bloquear. La **Resistencia** es cuánto daño puede recibir antes de morir.\n\nMira las cartas en tu mano: observa los números.',
        tip: 'Regla de oro: si tu Fuerza ≥ Resistencia del enemigo, tu criatura gana el combate. Pero ten cuidado: ¡ellos también te hacen daño!',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'pl1', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'bf1', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 3000 },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Paso 1 — Juega una **Llanura**. Necesitarás maná blanco para invocar a tu Lobo de Plata.',
        tip: 'La Llanura produce {W} (maná blanco). Las criaturas blancas suelen tener stats equilibrados.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'pl1', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'bf1', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_hand', highlightIds: ['pl1'] },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Llanura en juego. Ahora juega el **Bosque** para tener acceso a ambos colores de maná.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'bf1', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 1500 },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Paso 2 — Juega el **Bosque** para tener {W} y {G} disponibles.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'bf1', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_hand', highlightIds: ['bf1'] },
      },
      {
        phase: 'Fase Principal',
        instruction: '¡Dos tierras! Ahora tienes {W} y {G}. Suficiente maná para invocar criaturas.\n\n**Lobo de Plata** cuesta {1}{W}: usa la Llanura para el {W} y el Bosque para el {1}.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 2000 },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Paso 3 — Invoca al **Lobo de Plata**. Cuesta {1}{W}. Fíjate en sus números: **2/** **2**.\n\n🔥 **Fuerza 2**: Hará 2 de daño en combate.\n🛡️ **Resistencia 2**: Puede recibir 2 de daño antes de morir.',
        tip: 'Fíjate bien en los números cuando invoques una criatura. La Fuerza siempre está a la izquierda y la Resistencia a la derecha: **F/R**.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_hand', highlightIds: ['sl'] },
      },
      {
        phase: 'Fase Principal',
        instruction: '¡**Lobo de Plata (2/2)** en el campo! Con su Fuerza 2 y Resistencia 2 es una criatura sólida. Puede atacar y bloquear.\n\nAhora invocarás al Oso Gris. Tiene las mismas estadísticas: **2/2**.',
        tip: 'Cuando dos criaturas tienen la misma Fuerza y Resistencia, un duelo entre ellas resultaría en la muerte de ambas. ¡Eso se llama "trade"!',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'auto', delay: 2000 },
      },
      {
        phase: 'Fase Principal',
        instruction: 'Paso 4 — Invoca al **Oso Gris (2/2)**. Gira el Bosque para pagar {G} y usa el maná genérico restante.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'click_hand', highlightIds: ['gb2'] },
      },
      {
        phase: 'Fase Principal',
        instruction: '¡Dos criaturas 2/2! Un ejército equilibrado. Es hora de pasar al combate.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          opponentBoard: [],
          opponentHandCount: 5,
        },
        interaction: { type: 'button', label: 'Pasar a Combate' },
      },
      {
        phase: 'Turno del Oponente',
        instruction: 'Turno del oponente — Juega una Montaña e invoca un **Goblin Rezagado (1/1)**.\n\nMira su Fuerza y Resistencia:\n🔥 **1** / 🛡️ **1**\n\nCon solo 1 de Resistencia, ¡cualquier criatura con Fuerza 2 o más lo destruirá!',
        tip: 'Las criaturas con Resistencia baja son frágiles. Un Goblin 1/1 muere ante cualquier daño. Tus criaturas 2/2 son mucho más resistentes.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          opponentBoard: [
            { id: 'om3', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og2', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'auto', delay: 3000 },
      },
      {
        phase: 'Inicio del Turno',
        instruction: '¡Tu turno! Tus tierras se enderezan. Tienes **Lobo de Plata (2/2)** y **Oso Gris (2/2)** listos para luchar.\n\nEl oponente tiene un **Goblin (1/1)**. Comparemos:\n🐺 Lobo: **2**/2 — 🐻 Oso: **2**/2 — 👹 Goblin: **1**/1\n\nTus criaturas son más poderosas. ¡A atacar!',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          opponentBoard: [
            { id: 'om3', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og2', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'auto', delay: 2500 },
      },
      {
        phase: 'Fase de Combate',
        instruction: 'Paso 5 — Declara atacantes. Haz clic en el **Oso Gris** para atacar.\n\nMira la diferencia:\n🐻 Oso Gris: **Fuerza 2** vs 👹 Goblin: **Resistencia 1**\n\nSi el Goblin bloquea, el Oso le hará 2 de daño → suficiente para destruirlo. El Oso recibirá 1 daño pero sobrevive (Resistencia 2 > 1).',
        tip: 'Cuando Fuerza ≥ Resistencia enemiga: tu criatura gana el combate. La diferencia entre ambos números determina quién vive y quién muere.',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          opponentBoard: [
            { id: 'om3', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og2', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'click_board', highlightIds: ['gb2'] },
      },
      {
        phase: 'Fase de Combate',
        instruction: '¡El **Goblin Rezagado (1/1)** bloquea! Veamos las matemáticas del combate:\n\n━━━━━━━━━━━━━━━━━━━\n🐻 **Oso Gris**    F: **2**  R: **2**\n   👇 vs 👆\n👹 **Goblin**     F: **1**  R: **1**\n━━━━━━━━━━━━━━━━━━━\n\n**Resultado:**\n🔥 Oso Gris hace **2** de daño → supera la Resistencia **1** del Goblin → 💀 **Goblin muere**\n🔥 Goblin hace **1** de daño → la Resistencia **2** del Oso lo absorbe → ✅ **Oso sobrevive**',
        tip: 'El daño sobrante no se transfiere. El Oso absorbe 1 de daño con su Resistencia 2 y el punto extra se pierde. ¡La Resistencia actúa como un escudo!',
        state: {
          playerLife: 20, opponentLife: 20,
          playerHand: [],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: false },
          ],
          opponentBoard: [
            { id: 'om3', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
            { id: 'og2', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
          opponentHandCount: 4,
        },
        interaction: { type: 'auto', delay: 3500 },
      },
      {
        phase: 'Fase de Combate',
        instruction: '¡Victoria en combate! ✅\n\n**Goblin Rezagado** (F:1/R:1) recibe 2 de daño → Resistencia 1 < 2 → **Destruido** 💀\n**Oso Gris** (F:2/R:2) recibe 1 de daño → Resistencia 2 > 1 → **Sobrevive** ✅\n\nEl **Lobo de Plata** también puede atacar ahora, pero el oponente no tiene más criaturas para bloquear. El daño iría directo a su vida.',
        tip: 'Cuando el oponente no tiene bloqueadores, el daño va directo a su vida. ¡Aprovecha para reducir su total de vida!',
        state: {
          playerLife: 20, opponentLife: 18,
          playerHand: [],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: true },
          ],
          opponentBoard: [
            { id: 'om3', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
          ],
          opponentHandCount: 4,
          opponentGraveyard: [
            { id: 'og2', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
        },
        interaction: { type: 'auto', delay: 3000 },
      },
      {
        phase: 'Lección Completada',
        instruction: '¡Lección completada! Ahora entiendes cómo funciona el combate en Magic:\n\n⚔️ **Ataque y Bloqueo**: Cómo declarar atacantes y cómo el oponente bloquea\n💪 **Fuerza**: El daño que hace tu criatura (ataque)\n🛡️ **Resistencia**: El daño que puede absorber (vida)\n📐 **Comparación**: Si F ≥ R enemiga, tu criatura gana. Si R > F enemiga, sobrevive.\n\n**Fórmula del combate:**\nSi tu **Fuerza** ≥ **Resistencia** enemiga → 🐻 vive, 👹 muere\nSi tu **Fuerza** < **Resistencia** enemiga → 🐻 muere, 👹 vive\n\n¡Sigue practicando y conviértete en un maestro del combate!',
        state: {
          playerLife: 20, opponentLife: 18,
          playerHand: [],
          playerBoard: [
            { id: 'pl1b', name: 'Llanura', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'bf1b', name: 'Bosque', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: false },
            { id: 'sl', name: 'Lobo de Plata', typeLine: 'Criatura — Felino', manaCost: '{1}{W}', cmc: 2, color: 'W', power: 2, toughness: 2, tapped: false },
            { id: 'gb2', name: 'Oso Gris', typeLine: 'Criatura — Oso', manaCost: '{1}{G}', cmc: 2, color: 'G', power: 2, toughness: 2, tapped: true },
          ],
          opponentBoard: [
            { id: 'om3', name: 'Montaña', typeLine: 'Tierra Básica', manaCost: '', cmc: 0, color: 'land', power: null, toughness: null, tapped: true },
          ],
          opponentHandCount: 4,
          opponentGraveyard: [
            { id: 'og2', name: 'Goblin Rezagado', typeLine: 'Criatura — Goblin', manaCost: '{R}', cmc: 1, color: 'R', power: 1, toughness: 1, tapped: false },
          ],
        },
        interaction: { type: 'button', label: 'Completar Lección' },
      },
    ],
  },
]
