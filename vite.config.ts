import { defineConfig } from 'vite'
import { config as loadEnv } from 'dotenv'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function localChatApi(): Plugin {
  return {
    name: 'local-chat-api',
    configureServer(server) {
      loadEnv({ path: '.env.local' })
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        const chunks: Buffer[] = []
        req.on('data', chunk => chunks.push(Buffer.from(chunk)))
        req.on('end', async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
            const handler = await import('./api/chat')
            const apiReq = Object.assign(req, { body }) as IncomingMessage & { body: unknown }
            await handler.default(apiReq, res as ServerResponse)
          } catch {
            if (!res.headersSent) {
              res.statusCode = 400
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
