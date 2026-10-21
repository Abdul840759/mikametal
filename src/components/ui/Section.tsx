import type { ReactNode } from 'react'
export const Container = ({ children, className = '' }: { children: ReactNode; className?: string }) => <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
export const PageHero = ({ title, text }: { title: string; text: string }) => (
  <section className="grid-lines bg-navy pb-16 pt-32 text-white sm:pb-20"><Container><h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-lg text-white/75">{text}</p></Container></section>)
