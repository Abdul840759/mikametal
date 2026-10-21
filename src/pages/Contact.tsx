import { useState } from 'react'
import { Mail, MessageCircle, Phone, ArrowUpRight } from 'lucide-react'
import { company, services } from '../config/company'
import { waLink } from '../lib/contact'
import { useSeo } from '../hooks/useSeo'
import { Container, PageHero } from '../components/ui/Section'
import MikaMascot from '../components/ui/MikaMascot'
interface Form { name: string; phone: string; service: string; location: string; description: string }
type Errors = Partial<Record<keyof Form, string>>
const empty: Form = { name: '', phone: '', service: '', location: '', description: '' }
function validate(d: Form): Errors {
  const e: Errors = {}
  if (d.name.trim().length < 2) e.name = 'Enter your full name.'
  if (!/^\+?[\d\s()-]{7,}$/.test(d.phone.trim())) e.phone = 'Enter a valid phone number.'
  if (!d.service) e.service = 'Choose a service.'
  if (d.location.trim().length < 2) e.location = 'Enter the project location.'
  if (d.description.trim().length < 10) e.description = 'Describe the project in at least 10 characters.'
  return e
}
const message = (d: Form) => `Hello MIKAMETAL, I would like a quote.\nName: ${d.name}\nPhone: ${d.phone}\nService: ${d.service}\nLocation: ${d.location}\nProject: ${d.description}`
export default function Contact() {
  useSeo('Contact & Request a Quote', 'Call, WhatsApp or email MIKAMETAL, or send your project details.')
  const [d, setD] = useState<Form>(empty)
  const [err, setErr] = useState<Errors>({})
  const wa = waLink()
  const set = (k: keyof Form) => (ev: { target: { value: string } }) => setD({ ...d, [k]: ev.target.value })
  function send(channel: 'wa' | 'mail') {
    const e = validate(d); setErr(e)
    if (Object.keys(e).length) { document.getElementById(`f-${Object.keys(e)[0]}`)?.focus(); return }
    if (channel === 'wa') { const l = waLink(message(d)); if (l) window.open(l, '_blank', 'noopener') }
    else if (company.email) window.location.href = `mailto:${company.email}?subject=${encodeURIComponent('Quote request: ' + d.service)}&body=${encodeURIComponent(message(d))}`
  }
  const tiles = [
    wa && { href: wa, I: MessageCircle, t: 'WhatsApp', s: 'Chat with us now', ext: true, c: 'bg-[#178A45] text-white' },
    company.phone && { href: `tel:${company.phone}`, I: Phone, t: 'Call', s: company.phone, ext: false, c: 'bg-orange text-[#1A120D]' },
    company.email && { href: `mailto:${company.email}`, I: Mail, t: 'Email', s: company.email, ext: false, c: 'bg-navy text-white' },
  ].filter(Boolean) as { href: string; I: typeof Mail; t: string; s: string; ext: boolean; c: string }[]
  const f = 'mt-1 w-full border border-navy/25 bg-white px-3 py-3'
  const field = (k: keyof Form, label: string, input: React.ReactNode) => (
    <div><label htmlFor={`f-${k}`} className="font-semibold text-navy">{label}</label>{input}{err[k] && <p id={`e-${k}`} role="alert" className="mt-1 text-sm text-red-700">{err[k]}</p>}</div>)
  const a = (k: keyof Form) => ({ id: `f-${k}`, value: d[k], onChange: set(k), 'aria-invalid': !!err[k], 'aria-describedby': err[k] ? `e-${k}` : undefined, className: f })
  return (<>
    <PageHero title="Get in touch" text="Choose how you want to reach us. Tap an option and it opens straight away." />
    <section className="py-14"><Container>
      <div className="grid gap-4 md:grid-cols-3">{tiles.map(({ href, I, t, s, ext, c }) => (
        <a key={t} href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={`group flex items-center justify-between gap-4 p-6 ${c}`}><span className="flex items-center gap-4"><I size={32} aria-hidden="true" /><span><span className="block font-head text-xl font-extrabold">{t}</span><span className="block break-all text-sm opacity-90">{s}</span></span></span><ArrowUpRight aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>))}</div>
      <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 overflow-hidden rounded-2xl bg-navy px-6 pt-6 text-white sm:flex-row sm:pl-8 sm:pt-0">
        <div className="max-w-xl pb-6 text-center sm:py-8 sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-orange">Your MIKAMETAL assistant</p>
          <h2 className="mt-2 font-head text-2xl font-extrabold">Meet MIKA</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">Ask about our services or get help preparing a project enquiry. MIKA can guide you to the right contact option.</p>
          <button type="button" onClick={() => window.dispatchEvent(new Event('mika:open-chat'))} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-orange px-4 font-head text-sm font-bold text-[#1A120D] transition-colors hover:bg-orange/90">Chat with MIKA AI <ArrowUpRight size={17} aria-hidden="true" /></button>
        </div>
        <div className="h-40 w-36 shrink-0 sm:h-52 sm:w-40"><MikaMascot alt="MIKA, the MIKAMETAL virtual assistant, wearing a headset and folded arms." /></div>
      </div>
      {company.address && <p className="mt-6 text-ink/80"><span className="font-bold text-navy">Visit us:</span> {company.address}</p>}
      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.4fr]"><div><h2 className="text-3xl font-extrabold text-navy">Request a quote</h2><p className="mt-3 text-ink/75">Tell us about the project, then choose WhatsApp or email. Your details are filled into the message for you, and nothing is sent until you press send there.</p></div>
        <form noValidate onSubmit={e => e.preventDefault()} className="space-y-5" aria-label="Project enquiry">
          {field('name', 'Full name', <input {...a('name')} autoComplete="name" />)}
          {field('phone', 'Phone number', <input {...a('phone')} type="tel" autoComplete="tel" />)}
          {field('service', 'Service required', <select {...a('service')}><option value="">Select a service</option>{services.map(s => <option key={s.slug}>{s.title}</option>)}<option>Other</option></select>)}
          {field('location', 'Project location', <input {...a('location')} />)}
          {field('description', 'Project description', <textarea {...a('description')} rows={5} />)}
          <div className="flex flex-col gap-3 sm:flex-row">
            {wa && <button type="button" onClick={() => send('wa')} className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#178A45] px-6 font-head font-bold text-white"><MessageCircle size={20} aria-hidden="true" />Send on WhatsApp</button>}
            {company.email && <button type="button" onClick={() => send('mail')} className="inline-flex min-h-12 items-center justify-center gap-2 bg-navy px-6 font-head font-bold text-white"><Mail size={20} aria-hidden="true" />Send by email</button>}
          </div></form></div>
    </Container></section>
  </>)
}
