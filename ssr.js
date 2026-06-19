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

const server = http.createServer(async (req, res) => {
  try {
    const url = req.url

    if (url.startsWith('/@') || url.startsWith('/src/') || url === '/favicon.svg') {
      vite.middlewares(req, res, () => {
        res.writeHead(404)
        res.end()
      })
      return
    }

    const mod = await vite.ssrLoadModule('/src/entry-server.jsx')
    const appHtml = mod.render()
    const html = template.replace('<!--ssr-outlet-->', appHtml)

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  } catch (e) {
    vite.ssrFixStacktrace(e)
    console.error('SSR error:', e)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('SSR error: ' + e.message)
    }
  }
})

server.listen(PORT, () => {
  console.log(`SSR ready at http://localhost:${PORT}`)
})
