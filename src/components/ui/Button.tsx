import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
const v = { primary: 'bg-orange text-[#1A120D] hover:bg-[#FF9440]', dark: 'bg-navy text-white hover:bg-navy-2', ghost: 'border border-white/50 text-white hover:bg-white/10', outline: 'border border-navy text-navy hover:bg-navy hover:text-white' }
export default function Button({ to, href, variant = 'primary', children }: { to?: string; href?: string; variant?: keyof typeof v; children: ReactNode }) {
  const c = `site-button inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 font-head text-sm font-bold transition-colors ${v[variant]}`
  return href ? <a href={href} className={c} target="_blank" rel="noopener noreferrer">{children}</a> : <Link to={to ?? '/'} className={c}>{children}</Link>
}
