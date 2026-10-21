import { useState } from 'react'
import { X } from 'lucide-react'
import { projects } from '../config/company'
import { useSeo } from '../hooks/useSeo'
import Img from '../components/ui/Img'
import Button from '../components/ui/Button'
import CtaBand from '../components/ui/CtaBand'
import { Container, PageHero } from '../components/ui/Section'
export default function Projects() {
  useSeo('Projects', 'Project gallery for MIKAMETAL Steel Construction & Technical Services Ltd.')
  const cats = ['All', ...Array.from(new Set(projects.map(p => p.category)))]
  const [cat, setCat] = useState('All')
  const all = projects.filter(p => cat === 'All' || p.category === cat)
  const [max, setMax] = useState(12)
  const [open, setOpen] = useState<number | null>(null)
  const list = all.slice(0, max)
  return (<>
    <PageHero title="Projects" text="Steel and metal work fabricated by MIKAMETAL." />
    <section className="py-16"><Container>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">{cats.map(c => <button key={c} aria-pressed={cat === c} onClick={() => { setCat(c); setMax(12) }} className={`min-h-11 px-4 text-sm font-bold ${cat === c ? 'bg-navy text-white' : 'border border-navy text-navy'}`}>{c}</button>)}</div>
      {list.length === 0 ? <div className="mt-10 border border-dashed border-steel-2 p-10 text-center"><p className="font-bold text-navy">No projects in this category yet.</p><div className="mt-4"><Button to="/contact" variant="dark">Discuss your project</Button></div></div> :
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((p, i) => (<article key={p.id}><button className="block w-full text-left" onClick={() => setOpen(i)} aria-label={`Enlarge ${p.title}`}><Img src={p.image} alt={`${p.title}${p.isPlaceholder ? ' (placeholder image)' : ''}`} className="aspect-[4/3] w-full" /></button><h2 className="mt-3 font-head text-lg font-bold text-navy">{p.title}</h2><p className="text-sm text-ink/70">{p.description}</p>{(p.location || p.date) && <p className="mt-1 text-xs text-ink/50">{[p.location, p.date].filter(Boolean).join(', ')}</p>}{p.isPlaceholder && <span className="mt-2 inline-block bg-steel px-2 py-1 text-xs font-semibold text-ink/70">Placeholder</span>}</article>))}</div>}
      {all.length > max && <div className="mt-10 text-center"><button onClick={() => setMax(max + 12)} className="min-h-11 border border-navy px-6 font-bold text-navy hover:bg-navy hover:text-white">Show more</button></div>}
    </Container></section>
    {open !== null && list[open] && <div role="dialog" aria-modal="true" aria-label={list[open].title} className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setOpen(null)}><button className="absolute right-4 top-4 grid h-11 w-11 place-items-center bg-white text-navy" aria-label="Close" onClick={() => setOpen(null)}><X /></button><img src={list[open].image} alt={list[open].title} className="max-h-[88vh] max-w-full object-contain" /></div>}
    <CtaBand />
  </>)
}
