import { useState } from 'react'
// Image with professional fallback if the URL fails (blueprint grid panel).
export default function Img({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div role="img" aria-label={alt} className={`grid-lines bg-navy-2 ${className}`} />
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setBad(true)} className={`object-cover ${className}`} />
}
