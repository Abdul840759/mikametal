import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const r = useReducedMotion()
  return <motion.div className={className} initial={r ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}>{children}</motion.div>
}
