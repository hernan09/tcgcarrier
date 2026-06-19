## Goal
- Implementar animaciones CSS y lecciones en el tutorial interactivo de MTG.

## Constraints & Preferences
- Sin Three.js. Toda animación es CSS/Framer Motion, `pointer-events: none`.
- AttackFly: carta vuela desde el tablero a la vida del oponente y regresa.
- Arrollar: SpellTargetResolution (bloqueo) + AttackFly (daño sobrante) simultáneos.
- Daño directo: AttackFly muestra número flotante `-{daño}` animado en la vida.

## Progress
### Done
- Eliminado todo Three.js del proyecto.
- Creado `AttackFly`: carta vuela desde su posición a la vida del oponente con daño numérico.
- Creado `DrawRevealCard`: animación de robo con CSS keyframe + rotateY.
- `dismissPopup` ya no hace return tras targeting — dispara AttackFly + SpellTargetResolution en paralelo.
- Detección de atacante filtra criaturas (`power != null`), soporta múltiples atacantes y trample.
- **Rate limiting implementado**: cola de requests a Scryfall con 600ms de intervalo, evita 429.
- **`extractImageUrl`**: soporta `card_faces` (DFC/transform) y cadena de fallback normal→large→small→border_crop→png.
- **Fallback a prints**: si `named` endpoint no da imagen válida, busca otras impresiones.
- **AbortController timeout 8s** en fetch a Scryfall.
- **Número de daño flotante** en AttackFly: muestra `-{damage}` animado en la posición de la vida.
- **`lifeRecoil`** activado para ataques de combate también (no solo directos).
- **Nueva lección "Alas de Plata"** (blanco, Volar): Serra Angel (4/4 volar) vs Oso Gris (2/2 sin volar). Popup explicativo de Volar al atacar + AttackFly con -4.
- 7 lecciones totales.

## Relevant Files
- `src/components/GameDemo.jsx`: AttackFly (con daño numérico), scrapeo con rate limiting, extractImageUrl.
- `src/data/tutorialLessons.js`: 7 lecciones (nueva: alas-de-plata).
- `src/index.css`: animaciones (cardFlyFromLibrary, lifeRecoil, damagePop).
