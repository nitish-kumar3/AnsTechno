import QRCode from 'qrcode'
import { siteUrl } from './drawCertificate'

const W = 1240 // A4 portrait
const H = 1754
const FONT = '"Space Grotesk", "Noto Sans Devanagari", Arial, sans-serif'

export const shopUrl = (slug) => `${siteUrl()}/shop/${slug}`

function wrapLines(ctx, text, maxWidth) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

const formatPhone = (digits) =>
  digits.length === 12 && digits.startsWith('91')
    ? `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
    : `+${digits}`

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function drawPoster(canvas, shop) {
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const cx = W / 2

  // Fonts load hone do (Hindi ke liye bhi)
  await Promise.all([
    document.fonts.load(`700 80px ${FONT}`),
    document.fonts.load(`400 30px ${FONT}`),
    document.fonts.load('700 40px "Noto Sans Devanagari"', 'अ'),
    document.fonts.load('400 30px "Noto Sans Devanagari"', 'अ'),
  ])

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // Upar ka hara band
  const band = ctx.createLinearGradient(0, 0, W, 0)
  band.addColorStop(0, '#0f9d7b')
  band.addColorStop(1, '#19c39a')
  ctx.fillStyle = band
  ctx.fillRect(0, 0, W, 400)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = 'rgba(4,16,11,0.75)'
  ctx.font = `700 32px ${FONT}`
  if ('letterSpacing' in ctx) ctx.letterSpacing = '8px'
  ctx.fillText('DIGITAL DUKAAN', cx + 4, 100)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  // Dukaan ka naam (lamba ho to chhota hota jata hai)
  let size = 108
  let lines = []
  for (;;) {
    ctx.font = `700 ${size}px ${FONT}`
    lines = wrapLines(ctx, shop.name, 1040)
    if (lines.length <= 2 || size <= 52) break
    size -= 6
  }
  lines = lines.slice(0, 2)
  ctx.fillStyle = '#04100b'
  lines.forEach((text, i) => ctx.fillText(text, cx, 235 + i * size * 1.15))

  // Tagline
  if (shop.tagline) {
    ctx.fillStyle = '#4a5d55'
    ctx.font = `400 36px ${FONT}`
    const tag = wrapLines(ctx, shop.tagline, 1000).slice(0, 2)
    tag.forEach((text, i) => ctx.fillText(text, cx, 480 + i * 46))
  }

  // QR ka card
  const cardX = 230
  const cardY = 560
  const cardS = 780
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(7,60,42,0.25)'
  ctx.shadowBlur = 50
  ctx.shadowOffsetY = 16
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardS, cardS, 48)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.strokeStyle = '#19c39a'
  ctx.lineWidth = 6
  ctx.stroke()

  const qrData = await QRCode.toDataURL(shopUrl(shop.slug), {
    margin: 1,
    width: 700,
    color: { dark: '#04100b', light: '#ffffff' },
  })
  const qr = await loadImage(qrData)
  ctx.drawImage(qr, cardX + 40, cardY + 40, 700, 700)

  // Scan karo
  ctx.fillStyle = '#04100b'
  ctx.font = `700 62px ${FONT}`
  ctx.fillText('स्कैन करें, दुकान देखें', cx, 1465)
  ctx.fillStyle = '#4a5d55'
  ctx.font = `400 38px ${FONT}`
  ctx.fillText('Scan to see our shop and order on WhatsApp', cx, 1525)

  // Contact
  ctx.fillStyle = '#0a7d60'
  ctx.font = `700 46px ${FONT}`
  ctx.fillText(`WhatsApp: ${formatPhone(shop.whatsapp)}`, cx, 1612)
  const where = [shop.address, shop.city].filter(Boolean).join(', ')
  if (where) {
    ctx.fillStyle = '#4a5d55'
    ctx.font = `400 30px ${FONT}`
    ctx.fillText(wrapLines(ctx, where, 1050)[0], cx, 1660)
  }

  // Neeche ka band
  ctx.fillStyle = '#04100b'
  ctx.fillRect(0, H - 64, W, 64)
  ctx.fillStyle = '#6ee7c7'
  ctx.font = `400 26px ${FONT}`
  ctx.fillText('Powered by Anstech · Digital Dukaan', cx, H - 22)
}