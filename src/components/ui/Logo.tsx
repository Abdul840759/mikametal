import { company } from '../../config/company'
export default function Logo({ light = false }: { light?: boolean }) {
  const main = light ? 'text-white' : 'text-white'
  return (
    <span className="site-logo inline-flex items-center gap-2.5" aria-label={company.name}>
      <svg aria-hidden="true" viewBox="0 0 40 40" className="site-logo-mark h-9 w-9 shrink-0">
        <path d="M5 34V6h5l10 13L30 6h5v28h-6V16l-9 11-9-11v18H5Z" fill="currentColor" className={light ? 'text-orange' : 'text-orange'} />
        <path d="M5 37h30" stroke="currentColor" strokeWidth="2" className="text-white/50" />
      </svg>
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`site-logo-wordmark font-head text-lg font-extrabold tracking-[0.06em] ${main}`}>MIKA<span className="text-orange">METAL</span></span>
        <span className="mt-1 hidden text-[8px] font-semibold tracking-[0.14em] text-white/65 sm:block">STEEL CONSTRUCTION</span>
      </span>
    </span>
  )
}
