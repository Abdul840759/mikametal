import { useEffect } from 'react'
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} | MIKAMETAL`
    document.querySelector('meta[name=description]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    window.scrollTo(0, 0)
  }, [title, description])
}
