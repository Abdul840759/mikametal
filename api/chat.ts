declare const process: { env: Record<string, string | undefined> }

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const companyInfo = [
  'MIKAMETAL is a steel construction and metal works company based in Jimeta, Adamawa State, Nigeria.',
  'Address: KM 7 opposite Gesse Dadò Farms, Numan Road, Jimeta, Yola North LGA, Adamawa State. Phone: +234 803 618 9041. WhatsApp: 2348036189041. Email: talk2mukaila2014@gmail.com.',
  'Services listed on the website: Roofing & Structural Steel; Steel Buildings & Halls; Gates, Doors & Security Grilles; Canopies, Carports & Station Structures; Tanker, Trailer & Tank Fabrication; Water Towers & Custom Metal Works.',
  `The company website has a projects gallery. For a quote, ask the visitor to describe the work and direct them to the Contact page, WhatsApp, or phone.`,
].join('\n')

const json = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store' },
})

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405)
    }

    const key = process.env.NVIDIA_API_KEY
    if (!key) {
      return json({ error: 'MIKA is not connected yet. Please contact us by WhatsApp or phone.' }, 503)
    }

    let input: ChatMessage[] | undefined
    try {
      input = (await request.json())?.messages
    } catch {
      return json({ error: 'Please send a message to MIKA.' }, 400)
    }
    if (!Array.isArray(input) || input.length === 0 || input.length > 12) {
      return json({ error: 'Please send a message to MIKA.' }, 400)
    }
    const messages = input.filter((item): item is ChatMessage => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string' && item.content.length <= 1000)
    if (!messages.length || messages.length !== input.length || messages[messages.length - 1].role !== 'user') {
      return json({ error: 'That message could not be processed. Please try again.' }, 400)
    }

    try {
      const upstream = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
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

      if (!upstream.ok) {
        console.error('NVIDIA chat request failed:', upstream.status)
        return json({ error: upstream.status === 429 ? 'MIKA is taking a short break. Please try again in a little while.' : 'MIKA could not reply right now. Please try again.' }, upstream.status === 429 ? 429 : 502)
      }
      if (!upstream.body) throw new Error('NVIDIA returned an empty response stream')

      const reader = upstream.body.getReader()
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          let buffer = ''
          let completed = false
          const writeLine = (line: string) => {
            if (!line.startsWith('data:')) return
            const data = line.slice(5).trim()
            if (!data || data === '[DONE]') return
            try {
              const event = JSON.parse(data)
              const token = event.choices?.[0]?.delta?.content
              if (typeof token === 'string' && token) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`))
            } catch {
              // Ignore non-JSON keep-alive lines from the upstream stream.
            }
          }

          try {
            while (!completed) {
              const { value, done } = await reader.read()
              buffer += decoder.decode(value, { stream: !done })
              const lines = buffer.split(/\r?\n/)
              buffer = lines.pop() ?? ''
              lines.forEach(writeLine)
              completed = done
            }
            if (buffer) writeLine(buffer)
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error) {
            console.error('NVIDIA chat stream error:', error)
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'MIKA could not reply right now. Please try again.' })}\n\n`))
            controller.close()
          } finally {
            reader.releaseLock()
          }
        },
        cancel() { void reader.cancel() },
      })

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
        },
      })
    } catch (error) {
      console.error('NVIDIA chat error:', error)
      return json({ error: 'MIKA could not reply right now. Please try again.' }, 502)
    }
  },
}
