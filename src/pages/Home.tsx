import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { company, services, projects, principles, process } from '../config/company'
import { images } from '../config/images'
import { useSeo } from '../hooks/useSeo'
import Img from '../components/ui/Img'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import ServiceIcon from '../components/ui/ServiceIcon'
import CtaBand from '../components/ui/CtaBand'
import { Container } from '../components/ui/Section'
const facts = [`Registered ${company.establishedYear}`, 'General contracts', 'Metal works and fabrication', 'Jimeta, Adamawa State']
const featured = ['p04', 'p48', 'p29', 'p23', 'p72', 'p08'].map(id => projects.find(p => p.id === id)!).filter(Boolean)
export default function Home() {
  useSeo('Steel Construction & Metal Works', 'MIKAMETAL: steel construction, structural steel, gates, canopies, tanker and trailer fabrication in Jimeta, Adamawa State, Nigeria.')
  const r = useReducedMotion()
  return (<>
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-navy text-white">
      <Img src={images.hero} alt="Red steel hall frame under construction by MIKAMETAL" eager className="absolute inset-0 h-full w-full opacity-50" />
      <div className="grid-lines absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/10" aria-hidden="true" />
      <Container className="relative pb-10 pt-32 sm:pb-14">
        <motion.div initial={r ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="max-w-4xl text-[2.5rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-7xl">Engineering Strength.<br />Building Confidence.</h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">Steel construction and metal works built around quality, precision, and lasting performance.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button to="/contact">Request a Quote</Button><Button to="/projects" variant="ghost">See Our Work</Button></div>
        </motion.div>
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/25 pt-5 text-sm font-semibold sm:flex sm:flex-wrap sm:gap-x-10">{facts.map(f => <li key={f}>{f}</li>)}</ul>
      </Container>
    </section>
    <section className="py-20"><Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr]"><Reveal><h2 className="text-3xl font-extrabold text-navy sm:text-4xl">Almost any structure in steel, made to order</h2></Reveal><Reveal><p className="text-lg text-ink/80">{company.description} We fabricate and build for private clients and for larger companies, from roof structures and gates to tankers and trailers.</p><Link to="/about" className="mt-5 inline-flex items-center gap-2 font-bold text-royal">About MIKAMETAL <ArrowRight size={18} aria-hidden="true" /></Link></Reveal></Container></section>
    <section className="bg-steel py-20"><Container>
      <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">What we build</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map(s => (
        <Link key={s.slug} to={`/services#${s.slug}`} className="group block bg-white shadow-sm"><div className="relative overflow-hidden"><Img src={s.image} alt={s.title} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" /><span className="absolute bottom-0 left-0 bg-royal p-3 text-white"><ServiceIcon name={s.icon} className="h-6 w-6" /></span></div>
          <div className="p-5"><h3 className="text-lg font-bold text-navy">{s.title}</h3><p className="mt-1 text-sm text-ink/70">{s.summary}</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-royal">Details <ArrowRight size={16} aria-hidden="true" /></span></div></Link>))}</div>
    </Container></section>
    <section className="py-20"><Container>
      <div className="flex items-end justify-between gap-4"><h2 className="text-3xl font-extrabold text-navy sm:text-4xl">Recent work</h2><Link to="/projects" className="font-bold text-royal">All projects</Link></div>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">{featured.map((p, i) => (<figure key={p.id} className={`relative overflow-hidden ${i === 0 ? 'col-span-2 md:col-span-2' : ''}`}><Img src={p.image} alt={p.title} className={`w-full ${i === 0 ? 'aspect-[16/9]' : 'aspect-square'}`} /><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-3 pt-10 text-sm font-semibold text-white">{p.title}</figcaption></figure>))}</div>
    </Container></section>
    <section className="bg-steel py-20"><Container><h2 className="text-3xl font-extrabold text-navy sm:text-4xl">In the workshop</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">{[1, 2].map(n => <video key={n} autoPlay muted loop playsInline preload="metadata" poster={`/images/video/work-${n}.jpg`} className="aspect-video w-full bg-navy object-cover" aria-label={`MIKAMETAL work video ${n}`}><source src={`/images/video/work-${n}.mp4`} type="video/mp4" /></video>)}</div>
      <div className="mt-8 text-center"><Button to="/projects">View our gallery</Button></div>
    </Container></section>
    <section className="bg-navy py-20 text-white"><Container><h2 className="text-3xl font-extrabold sm:text-4xl">Why work with us</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{principles.map(p => <div key={p.title} className="border-t-2 border-orange pt-4"><h3 className="font-bold">{p.title}</h3><p className="mt-2 text-sm text-white/70">{p.text}</p></div>)}</div></Container></section>
    <section className="py-20"><Container><h2 className="text-3xl font-extrabold text-navy sm:text-4xl">How we work</h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-5">{process.map((s, i) => <li key={s.title} className="border-l-2 border-royal pl-4"><span className="font-head text-sm font-bold text-orange">Step {i + 1}</span><h3 className="mt-1 font-bold text-navy">{s.title}</h3><p className="mt-1 text-sm text-ink/70">{s.text}</p></li>)}</ol></Container></section>
    <CtaBand />
  </>)
}
