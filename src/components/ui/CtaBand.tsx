import Button from './Button'
import { Container } from './Section'
export default function CtaBand({ title = 'Have a Project in Mind?', text = "Tell us what you need, and let's discuss the next steps." }: { title?: string; text?: string }) {
  return <section className="bg-steel py-16"><Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><h2 className="text-3xl font-extrabold text-navy">{title}</h2><p className="mt-2 text-ink/75">{text}</p></div><Button to="/contact">Request a Quote</Button></Container></section>
}
