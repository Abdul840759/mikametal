import { defineConfig } from 'vite'
import { config as loadEnv } from 'dotenv'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function localChatApi(): Plugin {
  return {
    name: 'local-chat-api',
    configureServer(server) {
      loadEnv({ path: '.env.local' })
      server.middlewares.use('/api/chat', async (req, res, next) => {
        const chunks: Buffer[] = []
        req.on('data', chunk => chunks.push(Buffer.from(chunk)))
        req.on('end', async () => {
          try {
            const handler = await import('./api/chat')
            const headers = new Headers()
            for (const [name, value] of Object.entries(req.headers)) {
              if (Array.isArray(value)) headers.set(name, value.join(', '))
              else if (value) headers.set(name, value)
            }
            const method = req.method ?? 'GET'
            const body = chunks.length ? Buffer.concat(chunks).toString('utf8') : undefined
            const localRequest = new Request(new URL(req.url ?? '/api/chat', `http://${req.headers.host ?? 'localhost'}`), {
              method,
              headers,
              ...(body ? { body } : {}),
            })
            const response = await handler.default.fetch(localRequest)
            res.statusCode = response.status
            response.headers.forEach((value, name) => res.setHeader(name, value))
            if (!response.body) return res.end()
            const reader = response.body.getReader()
            while (true) {
              const { value, done } = await reader.read()
              if (done) break
              res.write(Buffer.from(value))
            }
            res.end()
          } catch {
            if (!res.headersSent) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({ error: 'That message could not be processed. Please try again.' }))
            } else {
              res.end()
            }
          }
        })
      })
    },
  }
}

export default defineConfig({ plugins: [react(), tailwindcss(), localChatApi()] })
