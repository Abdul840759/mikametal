import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { services } from '../config/company'
import { useSeo } from '../hooks/useSeo'
import Img from '../components/ui/Img'
import Button from '../components/ui/Button'
import ServiceIcon from '../components/ui/ServiceIcon'
import CtaBand from '../components/ui/CtaBand'
import { Container, PageHero } from '../components/ui/Section'
export default function Services() {
  useSeo('Services', 'Steel construction, structural steel works, building construction, fabrication and technical services.')
  const { hash } = useLocation()
  useEffect(() => { if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 50) }, [hash])
  return (<>
    <PageHero title="Services" text="What we fabricate and build, from roof structures to tankers." />
    {services.map((s, i) => (
      <section key={s.slug} id={s.slug} className={`scroll-mt-20 py-16 ${i % 2 ? 'bg-steel' : ''}`}><Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className={i % 2 ? 'lg:order-2' : ''}><ServiceIcon name={s.icon} className="h-9 w-9 text-orange" /><h2 className="mt-4 text-3xl font-extrabold text-navy">{s.title}</h2><p className="mt-3 font-semibold text-ink">{s.summary}</p><p className="mt-3 text-ink/75">{s.detail}</p>{!s.confirmed && <p className="mt-3 text-xs text-ink/50"> </p>}<div className="mt-6"><Button to="/contact">Request a Quote</Button></div></div>
        <Img src={s.image} alt={`${s.title}`} className="aspect-[4/3] w-full" /></Container></section>))}
    <CtaBand />
  </>)
}
