import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
const NotFound = () => <div className="mx-auto max-w-3xl px-5 py-32"><h1 className="text-4xl font-extrabold">Page not found</h1><Link className="mt-6 inline-block text-orange underline" to="/">Back to home</Link></div>
export default function App() {
  return <Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="about" element={<About />} /><Route path="services" element={<Services />} /><Route path="projects" element={<Projects />} /><Route path="contact" element={<Contact />} /><Route path="*" element={<NotFound />} /></Route></Routes>
}
