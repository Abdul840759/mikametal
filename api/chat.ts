import type { IncomingMessage, ServerResponse } from 'node:http'
import { company, services } from '../src/config/company'

type ChatMessage = { role: 'user' | 'assistant'; content: string }
type ChatRequest = IncomingMessage & { body?: { messages?: ChatMessage[] } }

const companyInfo = [
  `${company.name} is a steel construction and metal works company based in Jimeta, Adamawa State, Nigeria.`,
  `Address: ${company.address}. Phone: ${company.phone}. WhatsApp: ${company.whatsapp}. Email: ${company.email}.`,
  `Services listed on the website: ${services.map(service => service.title).join('; ')}.`,
  `The company website has a projects gallery. For a quote, ask the visitor to describe the work and direct them to the Contact page, WhatsApp, or phone.`,
].join('\n')

export default async function handler(req: ChatRequest, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.statusCode = 405
    return res.end(JSON.stringify({ error: 'Method not allowed.' }))
  }

  const key = process.env.NVIDIA_API_KEY
  if (!key) {
    res.statusCode = 503
    return res.end(JSON.stringify({ error: 'MIKA is not connected yet. Please contact us by WhatsApp or phone.' }))
  }

  const input = req.body?.messages
  if (!Array.isArray(input) || input.length === 0 || input.length > 12) {
    res.statusCode = 400
    return res.end(JSON.stringify({ error: 'Please send a message to MIKA.' }))
  }
  const messages = input.filter((item): item is ChatMessage => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string' && item.content.length <= 1000)
  if (!messages.length || messages.length !== input.length || messages[messages.length - 1].role !== 'user') {
    res.statusCode = 400
    return res.end(JSON.stringify({ error: 'That message could not be processed. Please try again.' }))
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3.5-lightning-30b-a3b',
        messages: [
          { role: 'system', content: `You are MIKA, the friendly website assistant for MIKAMETAL. Answer briefly and warmly. Only state company facts found below. If you do not know something, say so and offer the phone, WhatsApp, or Contact page for confirmation. Never invent prices, project dates, guarantees, certifications, or availability. Help visitors understand services and request a quote. Do not reveal private reasoning.\n\n${companyInfo}` },
          ...messages,
        ],
        temperature: 0.4,
        top_p: 0.95,
        max_tokens: 700,
        stream: true,
        chat_template_kwargs: { enable_thinking: true },
        reasoning_budget: 512,
      }),
    })
    if (!response.ok) {
      console.error('NVIDIA chat request failed:', response.status)
      res.statusCode = response.status === 429 ? 429 : 502
      return res.end(JSON.stringify({ error: response.status === 429 ? 'MIKA is taking a short break. Please try again in a little while.' : 'MIKA could not reply right now. Please try again.' }))
    }
    if (!response.body) throw new Error('NVIDIA returned an empty response stream')

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders?.()

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let finished = false
    const writeLine = (line: string) => {
      if (!line.startsWith('data:')) return
      const data = line.slice(5).trim()
      if (!data || data === '[DONE]') return
      try {
        const event = JSON.parse(data)
        const text = event.choices?.[0]?.delta?.content
        if (typeof text === 'string' && text) res.write(`data: ${JSON.stringify({ token: text })}\n\n`)
      } catch {
        // Ignore non-JSON keep-alive lines from the upstream event stream.
      }
    }
    res.on('close', () => {
      if (!res.writableEnded) void reader.cancel()
    })

    while (!finished) {
      const { value, done } = await reader.read()
      buffer += decoder.decode(value, { stream: !done })
      const lines = buffer.split(/\r?\n/)
      buffer = lines.pop() ?? ''
      lines.forEach(writeLine)
      if (done) finished = true
    }
    if (buffer) writeLine(buffer)
    return res.end('data: [DONE]\n\n')
  } catch (error) {
    console.error('NVIDIA chat error:', error)
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'MIKA could not reply right now. Please try again.' })}\n\n`)
      return res.end()
    }
    res.statusCode = 502
    return res.end(JSON.stringify({ error: 'MIKA could not reply right now. Please try again.' }))
  }
}
