import { useEffect } from 'react'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSeo({ title, description, image, type = 'website', jsonLd }) {
  useEffect(() => {
    if (!title) return

    const prevTitle = document.title
    const prevDesc =
      document.head.querySelector('meta[name="description"]')?.getAttribute('content') || ''

    document.title = `${title} | Anstech`
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', window.location.href)
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
    }
    if (image) setMeta('property', 'og:image', image)

    // Google ke liye structured data
    let script = null
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      document.title = prevTitle
      if (prevDesc) setMeta('name', 'description', prevDesc)
      if (script) script.remove()
    }
  }, [title, description, image, type, jsonLd])
}