import { company } from '../config/company'
import { images } from '../config/images'
import { principles } from '../config/company'
import { useSeo } from '../hooks/useSeo'
import Img from '../components/ui/Img'
import CtaBand from '../components/ui/CtaBand'
import { Container, PageHero } from '../components/ui/Section'
export default function About() {
  useSeo('About Us', 'About MIKAMETAL Steel Construction & Technical Services Ltd.')
  return (<>
    <PageHero title="About MIKAMETAL" text="Steel construction and technical services for commercial, industrial and private clients." />
    <section className="py-16"><Container className="grid gap-10 lg:grid-cols-2"><div><h2 className="text-3xl font-extrabold text-navy">Company overview</h2><p className="mt-4 text-ink/80">{company.description}</p>
      <p className="mt-4 font-bold text-navy">Registered with the Corporate Affairs Commission, 14 November {company.establishedYear}</p>{company.address && <p className="mt-2 text-ink/80">{company.address}</p>}</div>
      <Img src={images.about} alt="MIKAMETAL steel structure" className="aspect-[4/3] w-full" /></Container></section>
    <section className="bg-steel py-16"><Container className="grid gap-10 md:grid-cols-2">
      <div><h2 className="text-2xl font-extrabold text-navy">Mission</h2><p className="mt-3 text-ink/80">To deliver dependable steel construction and technical work with clear communication.</p></div>
      <div><h2 className="text-2xl font-extrabold text-navy">Vision</h2><p className="mt-3 text-ink/80">To be a trusted name in steel construction in Nigeria.</p></div></Container></section>
    <section className="py-16"><Container><h2 className="text-3xl font-extrabold text-navy">Values</h2><div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{principles.map(p => <div key={p.title} className="border-t-2 border-orange pt-4"><h3 className="font-bold text-navy">{p.title}</h3><p className="mt-2 text-sm text-ink/70">{p.text}</p></div>)}</div></Container></section>
    <CtaBand />
  </>)
}
