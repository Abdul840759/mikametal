import { Link, NavLink, Outlet } from 'react-router-dom'
import { Home, LayoutGrid, Images, Info, FileText, MessageCircle, Phone } from 'lucide-react'
import { company, nav, services } from '../../config/company'
import { waLink } from '../../lib/contact'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import ChatWidget from '../ui/ChatWidget'
import { Container } from '../ui/Section'
const tabs = [{ to: '/', label: 'Home', I: Home }, { to: '/services', label: 'Services', I: LayoutGrid }, { to: '/projects', label: 'Projects', I: Images }, { to: '/about', label: 'About', I: Info }, { to: '/contact', label: 'Quote', I: FileText, cta: true }]
function Header() {
  const wa = waLink()
  const cls = ({ isActive }: { isActive: boolean }) => `px-3 py-2 text-sm font-semibold ${isActive ? 'text-orange' : 'text-white'} hover:text-orange`
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 bg-navy/85 backdrop-blur-sm">
      <Container className="site-header-content flex h-16 items-center justify-between">
        <Link to="/" aria-label="MIKAMETAL home"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">{nav.map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={cls}>{n.label}</NavLink>)}<span className="ml-3"><Button to="/contact">Request a Quote</Button></span></nav>
        <div className="flex gap-2 lg:hidden">
          {company.phone && <a href={`tel:${company.phone}`} aria-label="Call MIKAMETAL" className="grid h-11 w-11 place-items-center rounded-md bg-white/10 text-orange transition-colors hover:bg-white/15"><Phone size={20} aria-hidden="true" /></a>}
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp MIKAMETAL" className="grid h-11 w-11 place-items-center rounded-md bg-white/10 text-orange transition-colors hover:bg-white/15"><MessageCircle size={20} aria-hidden="true" /></a>}
        </div>
      </Container>
    </header>)
}
function BottomNav() {
  return (
    <nav aria-label="Primary" className="site-bottom-nav fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),12px)] lg:hidden">
      <ul className="site-bottom-nav-list mx-auto flex max-w-md items-stretch justify-around">{tabs.map(({ to, label, I, cta }) => (
        <li key={to} className="flex-1"><NavLink to={to} end={to === '/'} aria-label={label} className={({ isActive }) => `site-nav-link flex flex-col items-center justify-center font-semibold ${cta ? 'text-orange' : isActive ? 'text-white' : 'text-white/55'}`}>{({ isActive }) => (<><span className={`site-nav-icon grid place-items-center ${cta ? 'site-nav-cta' : isActive ? 'site-nav-active' : ''}`}><I aria-hidden="true" /></span><span className="site-nav-label">{label}</span></>)}</NavLink></li>))}</ul>
    </nav>)
}
function Footer() {
  const wa = waLink()
  return (
    <footer className="site-footer bg-navy pb-20 text-white/80 lg:pb-0"><Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div><Logo /><p className="mt-4 text-sm">{company.description}</p></div>
      <div><h2 className="font-head font-bold text-white">Navigate</h2><ul className="mt-3 space-y-2 text-sm">{nav.map(n => <li key={n.to}><Link className="hover:text-white" to={n.to}>{n.label}</Link></li>)}</ul></div>
      <div><h2 className="font-head font-bold text-white">Services</h2><ul className="mt-3 space-y-2 text-sm">{services.map(s => <li key={s.slug}><Link className="hover:text-white" to={`/services#${s.slug}`}>{s.title}</Link></li>)}</ul></div>
      <div><h2 className="font-head font-bold text-white">Contact</h2><ul className="mt-3 space-y-2 text-sm">
        {company.phone && <li><a href={`tel:${company.phone}`}>{company.phone}</a></li>}
        {company.email && <li><a className="break-all" href={`mailto:${company.email}`}>{company.email}</a></li>}
        {company.address && <li>{company.address}</li>}
        {wa && <li><a className="inline-flex items-center gap-2 text-white" href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" />WhatsApp us</a></li>}</ul></div>
    </Container><div className="border-t border-white/10 py-5 text-center text-xs">© {new Date().getFullYear()} {company.legalName}</div></footer>)
}
export default function Layout() {
  return <><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:bg-white focus:p-3">Skip to content</a><Header /><main id="main"><Outlet /></main><Footer /><BottomNav /><ChatWidget /></>
}
