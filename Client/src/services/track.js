import api from './api'

let lastPath = ''
let lastTime = 0
let firstView = true

// Browser ki random id (pehli baar banti hai, phir yaad rehti hai)
function getVisitorId() {
  try {
    let id = localStorage.getItem('vid')
    if (!id) {
      id = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      localStorage.setItem('vid', id)
    }
    return id
  } catch {
    return ''
  }
}

// Admin ke browser me tracking band (taaki tumhare apne visits na gine jayein)
export function stopTrackingThisBrowser() {
  try {
    localStorage.setItem('noTrack', '1')
  } catch {
    // ignore
  }
}

export function trackPageView(path) {
  try {
    if (localStorage.getItem('noTrack')) return
  } catch {
    // ignore
  }

  // Ek hi page 1.5 second ke andar do baar na gine
  if (path === lastPath && Date.now() - lastTime < 1500) return
  lastPath = path
  lastTime = Date.now()

  const visitorId = getVisitorId()
  if (!visitorId) return

  // "Kahan se aaya" sirf pehle page par bhejte hain
  const referrer = firstView ? document.referrer : ''
  firstView = false

  api.post('/track', { path, visitorId, referrer }).catch(() => {})
}