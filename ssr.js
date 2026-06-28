import fs from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 5173

const template = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8')

const { createServer: createVite } = await import('vite')
const vite = await createVite({
  server: { middlewareMode: true },
  appType: 'custom',
})

const CSP = {
  'default-src': "'self'",
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'blob:'],
  'worker-src': ["'self'", 'blob:'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
  'img-src': ["'self'", 'https://cards.scryfall.io', 'https://api.scryfall.com', 'https://flagcdn.com', 'data:', 'blob:'],
  'font-src': ["'self'", 'https://cdn.jsdelivr.net'],
  'connect-src': ["'self'", 'https://api.scryfall.com', 'https://api.scryfall.io', 'https://unpkg.com', 'https://restcountries.com', 'https://files-03.restcountries.com', 'https://cdn.jsdelivr.net', 'https://topdeck.gg', 'ws://localhost:*', 'ws://127.0.0.1:*'],
  'frame-src': ["'self'", 'https://www.youtube.com'],
  'media-src': ["'self'"],
  'object-src': "'none'",
  'base-uri': "'self'",
  'form-action': "'self'",
}

function serializeCsp(directives) {
  return Object.entries(directives)
    .map(([key, val]) => `${key} ${Array.isArray(val) ? val.join(' ') : val}`)
    .join('; ')
}

const SECURITY_HEADERS = {
  'Content-Security-Policy': serializeCsp(CSP),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'X-XSS-Protection': '0',
}

function isAssetRequest(url) {
  return (
    url.startsWith('/@') ||
    url.startsWith('/src/') ||
    url.startsWith('/node_modules/') ||
    url === '/favicon.svg' ||
    /\.\w+(\?|$)/.test(url)
  )
}

const TOPDECK_API_KEY = '4634c213-6bfd-468e-aa61-ad6fbb67d67d'
const TOPDECK_BASE = 'https://topdeck.gg/api/v2'

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  try {
    const url = req.url

    if (url === '/api/topdeck/tournaments' && req.method === 'POST') {
      const body = await collectBody(req)
      const response = await fetch(`${TOPDECK_BASE}/tournaments`, {
        method: 'POST',
        headers: {
          'Authorization': TOPDECK_API_KEY,
          'Content-Type': 'application/json',
        },
        body,
      })
      const data = await response.text()
      res.writeHead(response.status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
      res.end(data)
      return
    }

    if (isAssetRequest(url)) {
      vite.middlewares(req, res, () => {
        res.writeHead(404)
        res.end()
      })
      return
    }

    const mod = await vite.ssrLoadModule('/src/entry-server.jsx')
    const appHtml = mod.render()
    let html = template.replace('<!--ssr-outlet-->', appHtml)
    html = await vite.transformIndexHtml(url, html)

    res.writeHead(200, {
      'Content-Type': 'text/html',
      ...SECURITY_HEADERS,
    })
    res.end(html)
  } catch (e) {
    vite.ssrFixStacktrace(e)
    console.error('SSR error:', e)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Error interno del servidor')
    }
  }
})

server.listen(PORT, () => {
  console.log(`SSR ready at http://localhost:${PORT}`)
})
