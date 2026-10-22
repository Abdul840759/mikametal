import { company } from '../../config/company'
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="site-logo inline-flex items-center gap-2.5" aria-label={company.name}>
      <img src={company.logoPath ?? '/images/logo.png'} alt="" aria-hidden="true" className="site-logo-mark h-10 w-10 shrink-0 rounded-full object-contain" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`site-logo-wordmark font-head text-lg font-extrabold tracking-[0.06em] ${light ? 'text-white' : 'text-white'}`}>MIKA<span className="text-orange">METAL</span></span>
        <span className="mt-1 hidden text-[8px] font-semibold tracking-[0.14em] text-white/65 sm:block">STEEL CONSTRUCTION</span>
      </span>
    </span>
  )
}
