import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { feature } from 'topojson-client'

const R = 2

const COUNTRY_COLORS = [
  '#1a3a5c', '#1e4d7a', '#2563a0', '#2d7bc4', '#3a93d4',
  '#4d8cf7', '#5ba0e8', '#6db4f0', '#7ab8f5', '#8ac0f0',
  '#163050', '#1a3f6b', '#1f5288', '#2666a8', '#2f7abf',
  '#18426a', '#1d5587', '#246aa7', '#2c7fc4', '#3595d4',
]

const FORMAT_COLORS = {
  EDH: '#ff9632',
  Standard: '#4d8cf7',
  Modern: '#a855f7',
  Pioneer: '#22c55e',
}

function hashColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COUNTRY_COLORS[Math.abs(hash) % COUNTRY_COLORS.length]
}

function lngLatTo3D(lng, lat, radius) {
  const phi = (90 - lat) * Math.PI / 180
  const theta = (lng + 180) * Math.PI / 180
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function pointInRing(lat, lng, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [lng1, lat1] = ring[i]
    const [lng2, lat2] = ring[j]
    if ((lat1 > lat) !== (lat2 > lat) && lng < (lng2 - lng1) * (lat - lat1) / (lat2 - lat1) + lng1) {
      inside = !inside
    }
  }
  return inside
}

function pointInCountry(lat, lng, country) {
  for (let p = 0; p < country.polygons.length; p++) {
    const poly = country.polygons[p]
    if (!pointInRing(lat, lng, poly.outer)) continue
    let inHole = false
    for (let h = 0; h < poly.holes.length; h++) {
      if (pointInRing(lat, lng, poly.holes[h])) { inHole = true; break }
    }
    if (!inHole) return true
  }
  return false
}

function getOuterRings(feature) {
  if (feature.geometry.type === 'Polygon') {
    return [feature.geometry.coordinates[0]]
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map(poly => poly[0])
  }
  return []
}

function createGlobeTexture(features) {
  const W = 2048
  const H = 1024
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#0f1f35'
  ctx.fillRect(0, 0, W, H)

  for (const f of features) {
    const color = hashColor(f.properties.name)
    ctx.fillStyle = color
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 0.5

    const rings = getOuterRings(f)
    for (const ring of rings) {
      if (!ring || ring.length < 3) continue
      ctx.beginPath()
      for (let i = 0; i < ring.length; i++) {
        const [lng, lat] = ring[i]
        const x = (lng + 180) / 360 * W
        const y = (90 - lat) / 180 * H
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
  }

  return canvas
}

function Stars() {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(3000)
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (Math.random() - 0.5) * 200
      arr[i + 1] = (Math.random() - 0.5) * 200
      arr[i + 2] = (Math.random() - 0.5) * 200
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.3} color="#ffffff" transparent opacity={0.6} />
    </points>
  )
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[R * 1.025, 64, 64]} />
      <meshPhongMaterial
        color="#4488ff"
        transparent
        opacity={0.12}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

function CameraController({ selected, controlsRef, camDist }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, camDist || 14))
  const isAnimating = useRef(false)
  const startPos = useRef(new THREE.Vector3())
  const progress = useRef(0)

  useEffect(() => {
    if (selected === null) {
      startPos.current.copy(camera.position)
      target.current.set(0, 0, camDist || 14)
      progress.current = 0
      isAnimating.current = true
      if (controlsRef.current) controlsRef.current.enabled = false
    }
  }, [selected])

  useFrame((_, delta) => {
    if (!isAnimating.current) return
    progress.current += delta * 1.2
    if (progress.current >= 1) {
      progress.current = 1
      isAnimating.current = false
      if (controlsRef.current) controlsRef.current.enabled = true
    }
    const t = 1 - Math.pow(1 - progress.current, 3)
    camera.position.lerpVectors(startPos.current, target.current, t)
    camera.lookAt(0, 0, 0)
  })

  return null
}

const API_BASE = '/api/topdeck'
const FORMATS = ['EDH', 'Standard', 'Modern', 'Pioneer']

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function createPinTexture(color) {
  if (typeof document === 'undefined') return null
  const size = 48
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const c = size / 2

  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c)
  gradient.addColorStop(0, hexToRgba(color, 1))
  gradient.addColorStop(0.25, hexToRgba(color, 0.9))
  gradient.addColorStop(0.5, hexToRgba(color, 0.5))
  gradient.addColorStop(1, hexToRgba(color, 0))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  ctx.beginPath()
  ctx.arc(c, c, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

const PIN_TEX_CACHE = new Map()

function TournamentPin({ pin, onClick }) {
  const ref = useRef()
  const color = FORMAT_COLORS[pin.format] || '#ff9632'

  if (!PIN_TEX_CACHE.has(color)) {
    PIN_TEX_CACHE.set(color, createPinTexture(color))
  }

  const texture = PIN_TEX_CACHE.get(color)

  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.15
      ref.current.scale.setScalar(s * 0.12)
    }
  })

  return (
    <sprite
      ref={ref}
      position={pin.pos}
      scale={[0.12, 0.12, 0.12]}
      onClick={(e) => {
        e.stopPropagation()
        onClick(pin)
      }}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthTest={true}
        depthWrite={false}
        opacity={0.9}
      />
    </sprite>
  )
}

const DATA_URLS = [
  'https://unpkg.com/world-atlas@2/countries-110m.json',
  'https://raw.githubusercontent.com/topojson/world-atlas/refs/heads/master/countries-110m.json',
]

async function fetchWorldData() {
  for (const url of DATA_URLS) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Fetch failed: ' + res.status)
      const topojson = await res.json()
      const world = feature(topojson, topojson.objects.countries)
      const feats = world.features.filter(f => f && f.geometry)
      if (feats.length > 0) return feats
    } catch (e) {
      console.warn('world source failed:', url, e.message)
    }
  }
  throw new Error('All world data sources failed')
}

async function fetchAllTournaments(signal) {
  const all = []
  for (const fmt of FORMATS) {
    try {
      const res = await fetch(`${API_BASE}/tournaments`, {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: 'Magic: The Gathering', format: fmt, last: 30, participantMin: 2 }),
      })
      if (!res.ok) continue
      const data = await res.json()
      if (Array.isArray(data)) all.push(...data)
    } catch (e) {
      if (e.name === 'AbortError') throw e
    }
  }
  return all
}

function processFeatures(feats) {
  const countriesData = feats.map(f => {
    const polygons = []
    const coords = f.geometry.type === 'MultiPolygon'
      ? f.geometry.coordinates
      : [f.geometry.coordinates]
    for (const poly of coords) {
      const outer = poly[0]
      const holes = poly.slice(1)
      polygons.push({ outer, holes })
    }
    const ring = polygons[0].outer
    let lngSum = 0, latSum = 0
    if (ring) {
      ring.forEach(([lng, lat]) => { lngSum += lng; latSum += lat })
    }
    const centerLat = latSum / ring.length
    const centerLng = lngSum / ring.length
    return {
      name: f.properties.name,
      id: f.id,
      polygons,
      center: lngLatTo3D(centerLng, centerLat, R),
      latLng: { lat: centerLat, lng: centerLng },
    }
  })
  return countriesData
}

function extractDeck(deckObj) {
  if (!deckObj) return null
  return {
    commanders: Object.entries(deckObj.Commanders || {}).map(([name, info]) => ({
      name, id: info.id, count: info.count,
    })),
    mainboard: Object.entries(deckObj.Mainboard || {}).map(([name, info]) => ({
      name, id: info.id, count: info.count,
    })),
    metadata: deckObj.metadata,
  }
}

function processTournaments(allTournaments) {
  const seen = new Map()
  for (const t of allTournaments) {
    if (seen.has(t.TID)) continue
    seen.set(t.TID, t)
  }

  const locMap = new Map()
  for (const t of seen.values()) {
    const lat = t.eventData?.lat
    const lng = t.eventData?.lng
    if (lat == null || lng == null) continue
    const key = `${lat.toFixed(4)}_${lng.toFixed(4)}`
    if (!locMap.has(key)) {
      locMap.set(key, {
        lat,
        lng,
        pos: lngLatTo3D(lng, lat, R * 1.06),
        format: '',
        allFormats: new Set(),
        tournaments: [],
      })
    }
    const entry = locMap.get(key)
    const fmt = t.format || 'Unknown'
    entry.allFormats.add(fmt)
    if (!entry.format) entry.format = fmt
    entry.tournaments.push({
      tid: t.TID,
      name: t.tournamentName || t.name || 'Sin nombre',
      format: fmt,
      startDate: t.startDate || 0,
      city: t.eventData?.city || '',
      state: t.eventData?.state || '',
      address: t.eventData?.address || '',
      players: t.standings?.length || 0,
      winnerDeck: extractDeck(t.standings?.[0]?.deckObj),
    })
  }

  for (const pin of locMap.values()) {
    pin.format = [...pin.allFormats][0]
  }

  return Array.from(locMap.values())
}

export default function GlobeScene({ selected, onReady, onSelectTournament, onSelectCountry, camDist, activeFormats }) {
  const controlsRef = useRef()
  const clickSphereRef = useRef()
  const matRef = useRef()
  const textureRef = useRef(null)

  const [features, setFeatures] = useState([])
  const [countriesData, setCountriesData] = useState([])
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tournamentPins, setTournamentPins] = useState([])

  const visiblePins = useMemo(() => {
    if (!activeFormats) return tournamentPins
    return tournamentPins.filter(p => {
      for (const fmt of p.allFormats) {
        if (activeFormats.has(fmt)) return true
      }
      return false
    })
  }, [tournamentPins, activeFormats])

  useEffect(() => {
    let cancelled = false
    let worldDone = false
    let tournamentDone = false
    let worldData = null
    let tournamentRaw = null
    const controller = new AbortController()

    function tryComplete() {
      if (cancelled) return
      if (!worldDone || !tournamentDone) return

      const canvas = createGlobeTexture(worldData)
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.needsUpdate = true
      tex.anisotropy = 4
      textureRef.current = tex

      setFeatures(worldData)
      setCountriesData(processFeatures(worldData))
      setTournamentPins(processTournaments(tournamentRaw))
      setReady(true)
      setLoading(false)
    }

    async function loadWorld() {
      try {
        worldData = await fetchWorldData()
      } catch (e) {
        console.error(e)
        if (!cancelled) setLoading(false)
        return
      }
      worldDone = true
      tryComplete()
    }

    async function loadTournaments() {
      try {
        tournamentRaw = await fetchAllTournaments(controller.signal)
      } catch (e) {
        if (e.name === 'AbortError') return
        console.warn('tournament fetch error:', e)
        tournamentRaw = []
      }
      tournamentDone = true
      tryComplete()
    }

    loadWorld()
    loadTournaments()

    return () => { cancelled = true; controller.abort() }
  }, [])

  const handleGlobeClick = useCallback((e) => {
    if (!e.intersections?.[0] || countriesData.length === 0) return
    const point = e.intersections[0].point
    const normalized = point.clone().normalize()
    const lat = 90 - Math.acos(Math.max(-1, Math.min(1, normalized.y))) * 180 / Math.PI
    let lng = Math.atan2(normalized.z, -normalized.x) * 180 / Math.PI - 180
    if (lng > 180) lng -= 360
    if (lng < -180) lng += 360

    let foundCountry = null
    for (const c of countriesData) {
      if (pointInCountry(lat, lng, c)) {
        foundCountry = c
        break
      }
    }
    if (!foundCountry) return

    let nearbyPin = null
    for (const pin of visiblePins) {
      if (pointInCountry(pin.lat, pin.lng, foundCountry)) {
        nearbyPin = pin
        break
      }
    }

    if (nearbyPin) {
      onSelectTournament(nearbyPin)
    } else {
      onSelectCountry(foundCountry)
    }
  }, [countriesData, visiblePins, onSelectTournament, onSelectCountry])

  useEffect(() => {
    if (ready && matRef.current && textureRef.current) {
      matRef.current.map = textureRef.current
      matRef.current.color.set('#ffffff')
      matRef.current.needsUpdate = true
      if (onReady) onReady()
    }
  }, [ready, onReady])

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <directionalLight position={[-5, -2, -3]} intensity={0.4} color="#4488ff" />

      <Stars />

      {ready && (
        <>
          <mesh>
            <sphereGeometry args={[R, 64, 64]} />
            <meshPhongMaterial
              ref={matRef}
              color="#ffffff"
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>

          <Atmosphere />

          <mesh
            ref={clickSphereRef}
            onClick={handleGlobeClick}
          >
            <sphereGeometry args={[R * 1.01, 32, 32]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          {visiblePins.map(p => (
            <TournamentPin
              key={`${p.lat.toFixed(4)}_${p.lng.toFixed(4)}`}
              pin={p}
              onClick={onSelectTournament}
            />
          ))}
        </>
      )}

      <CameraController selected={selected} controlsRef={controlsRef} camDist={camDist} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        minDistance={2.3}
        maxDistance={30}
        rotateSpeed={0.8}
      />
    </>
  )
}
