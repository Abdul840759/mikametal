import { useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { company } from './config/company'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
const NotFound = () => <div className="mx-auto max-w-3xl px-5 py-32"><h1 className="text-4xl font-extrabold">Page not found</h1><Link className="mt-6 inline-block text-orange underline" to="/">Back to home</Link></div>

const ROUTES = ['/', '/about', '/services', '/projects', '/contact']

function RouteSeo() {
  const { pathname: rawPath } = useLocation()
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, '').toLowerCase() : rawPath

  useEffect(() => {
    const isKnownRoute = ROUTES.includes(pathname)
    const canonicalTags = document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')
    const ogUrlTags = document.querySelectorAll<HTMLMetaElement>('meta[property="og:url"]')

    canonicalTags.forEach((tag, index) => {
      if (!isKnownRoute || index > 0) tag.remove()
    })
    ogUrlTags.forEach((tag, index) => {
      if (!isKnownRoute || index > 0) tag.remove()
    })

    const robotsTag = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!isKnownRoute) {
      canonicalTags.forEach(tag => tag.remove())
      ogUrlTags.forEach(tag => tag.remove())
      if (robotsTag) robotsTag.setAttribute('content', 'noindex')
      else {
        const tag = document.createElement('meta')
        tag.name = 'robots'
        tag.content = 'noindex'
        document.head.appendChild(tag)
      }
      return
    }

    robotsTag?.remove()
    const canonicalUrl = pathname === '/' ? `${company.siteUrl}/` : `${company.siteUrl}${pathname}`

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
    if (!ogUrl) {
      ogUrl = document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      document.head.appendChild(ogUrl)
    }
    ogUrl.setAttribute('content', canonicalUrl)
  }, [pathname])

  return null
}

export default function App() {
  return <><RouteSeo /><Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="about" element={<About />} /><Route path="services" element={<Services />} /><Route path="projects" element={<Projects />} /><Route path="contact" element={<Contact />} /><Route path="*" element={<NotFound />} /></Route></Routes></>
}
