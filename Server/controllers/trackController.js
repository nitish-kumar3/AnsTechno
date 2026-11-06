import env from '../config/env.js'
import Visit from '../models/Visit.js'

// Apni hi site ka naam referrer me na aaye
let ownHost = ''
try {
  ownHost = new URL(env.clientUrl).hostname.replace(/^www\./, '')
} catch {
  // ignore
}

function getDevice(ua) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'Tablet'
  if (/mobi|android|iphone/i.test(ua)) return 'Mobile'
  return 'Desktop'
}

// PUBLIC: har page view yahan aata hai. Kuch bhi ho, chup-chaap 204 bhejte hain
export const trackVisit = async (req, res) => {
  try {
    const ua = String(req.headers['user-agent'] || '')

    // Bots ko mat gino
    if (/bot|crawl|spider|slurp|headless|preview/i.test(ua)) return res.status(204).end()

    const path = String(req.body.path || '').slice(0, 200)
    const visitorId = String(req.body.visitorId || '').slice(0, 60)

    // Galat ya admin pages ko mat gino
    if (!path.startsWith('/') || path.startsWith('/admin') || !visitorId) {
      return res.status(204).end()
    }

    // Referrer se sirf domain nikalo (jaise google.com)
    let referrer = ''
    try {
      const host = new URL(String(req.body.referrer || '')).hostname.replace(/^www\./, '')
      if (host && host !== ownHost) referrer = host
    } catch {
      // referrer nahi hai ya galat hai
    }

    await Visit.create({ path, visitorId, device: getDevice(ua), referrer })
    res.status(204).end()
  } catch {
    res.status(204).end()
  }
}