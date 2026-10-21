import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, MessageCircle, Send, X } from 'lucide-react'
import MikaMascot from './MikaMascot'

type Message = { role: 'user' | 'assistant'; content: string }
const welcome: Message = { role: 'assistant', content: "Hi, I'm MIKA. Ask me about our steel construction and metal work, or how to request a quote." }

function MikaAvatar() {
  return <span className="mika-character"><MikaMascot /></span>
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([welcome])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLauncherCard, setShowLauncherCard] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const cardTimer = useRef<number | undefined>(undefined)
  const scrollTimer = useRef<number | undefined>(undefined)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading, open])

  useEffect(() => {
    if (open) setShowLauncherCard(false)
    const onScroll = () => {
      if (open) return
      window.clearTimeout(cardTimer.current)
      window.clearTimeout(scrollTimer.current)
      setShowLauncherCard(false)
      scrollTimer.current = window.setTimeout(() => {
        setShowLauncherCard(true)
        cardTimer.current = window.setTimeout(() => setShowLauncherCard(false), 5000)
      }, 700)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const onOpenChat = () => setOpen(true)
    window.addEventListener('mika:open-chat', onOpenChat)
    return () => {
      window.clearTimeout(cardTimer.current)
      window.clearTimeout(scrollTimer.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mika:open-chat', onOpenChat)
    }
  }, [open])

  async function send(event: FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(1).slice(-12).map(({ role, content }) => ({ role, content })) }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'MIKA could not reply right now. Please try again.')
      }
      if (!response.body || !response.headers.get('content-type')?.includes('text/event-stream')) {
        const data = await response.json()
        setMessages(current => [...current, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(current => [...current, { role: 'assistant', content: '' }])
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let reply = ''
        let done = false
        const appendToken = (token: string) => {
          reply += token
          setMessages(current => {
            const lastIndex = current.length - 1
            const last = current[lastIndex]
            if (last?.role !== 'assistant') return [...current, { role: 'assistant', content: token }]
            return current.map((message, index) => index === lastIndex ? { ...message, content: message.content + token } : message)
          })
        }
        const readLine = (line: string) => {
          if (!line.startsWith('data:')) return
          const data = line.slice(5).trim()
          if (!data || data === '[DONE]') { done = true; return }
          try {
            const event = JSON.parse(data)
            if (event.error) throw new Error(event.error)
            if (typeof event.token === 'string') appendToken(event.token)
          } catch (error) {
            if (error instanceof Error && error.message !== 'Unexpected end of JSON input') throw error
          }
        }
        while (!done) {
          const { value, done: streamEnded } = await reader.read()
          buffer += decoder.decode(value, { stream: !streamEnded })
          const lines = buffer.split(/\r?\n/)
          buffer = lines.pop() ?? ''
          lines.forEach(readLine)
          if (streamEnded) done = true
        }
        if (buffer) readLine(buffer)
        if (!reply.trim()) throw new Error('MIKA could not reply right now. Please try again.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setMessages(current => {
        const lastIndex = current.length - 1
        const last = current[lastIndex]
        if (last?.role === 'assistant' && !last.content) return current.map((item, index) => index === lastIndex ? { ...item, content: message } : item)
        return [...current, { role: 'assistant', content: message }]
      })
    } finally {
      setLoading(false)
    }
  }

  return <>
    <AnimatePresence>
      {open && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/35 p-4 backdrop-blur-[1px]" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
        <motion.section
          initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18 }} role="dialog" aria-modal="true" aria-label="Chat with MIKA about the company"
          className="mika-chat-panel flex h-[min(34rem,calc(100svh-2rem))] w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#211A16] text-white shadow-2xl"
        >
          <header className="mika-chat-header flex items-center justify-between border-b border-white/10 bg-[#30251F] px-4 py-3">
            <div className="flex items-center gap-3"><span className="mika-chat-avatar"><MikaAvatar /></span><div><h2 className="font-head font-bold">MIKA</h2><p className="mika-chat-subtitle text-xs text-white/65">Your MIKAMETAL assistant</p></div></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="grid h-9 w-9 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"><X size={20} /></button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message, i) => <div key={`${i}-${message.role}`} className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-3 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto rounded-br-sm bg-orange text-[#1A120D]' : 'rounded-bl-sm bg-white/10 text-white/90'}`}>{message.content}</div>)}
            {loading && <div className="w-fit rounded-xl rounded-bl-sm bg-white/10 px-3 py-2.5 text-sm text-white/70" aria-label="MIKA is typing"><span className="animate-pulse">MIKA is typing…</span></div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-white/10 p-3">
            <label className="sr-only" htmlFor="mika-message">Message MIKA</label>
            <input id="mika-message" value={input} onChange={event => setInput(event.target.value)} maxLength={1000} placeholder="Ask about the company…" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange" />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange text-[#1A120D] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"><Send size={17} /></button>
          </form>
        </motion.section>
      </div>}
    </AnimatePresence>
    <AnimatePresence>
    {!open && <motion.div className="mika-launcher fixed bottom-24 right-4 z-[55] flex flex-col items-end gap-2 sm:bottom-8 sm:right-6">
      <AnimatePresence>
        {showLauncherCard && <motion.div key="launcher-card" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: .18 }} className="mika-launcher-card">
          <div className="mika-launcher-card-head">
            <span className="mika-launcher-card-icon"><MessageCircle size={17} /></span>
            <div><p className="mika-launcher-card-title">MIKA AI is here</p><p className="mika-launcher-card-status"><span />Online · ready to help</p></div>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="mika-launcher-cta">Chat with MIKA AI <ArrowUpRight size={16} /></button>
        </motion.div>}
      </AnimatePresence>
    </motion.div>}
    </AnimatePresence>
  </>
}
