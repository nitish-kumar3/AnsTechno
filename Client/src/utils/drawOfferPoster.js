const FONT = '"Space Grotesk", "Noto Sans Devanagari", Arial, sans-serif'

export const posterThemes = {
  green: { name: 'Green', from: '#0f9d7b', to: '#19c39a', badge: '#ffffff', accent: '#0a7d60' },
  orange: { name: 'Orange', from: '#ea580c', to: '#f59e0b', badge: '#ffffff', accent: '#c2410c' },
  red: { name: 'Red', from: '#b91c1c', to: '#f43f5e', badge: '#ffffff', accent: '#b91c1c' },
  blue: { name: 'Blue', from: '#1d4ed8', to: '#38bdf8', badge: '#ffffff', accent: '#1d4ed8' },
  purple: { name: 'Purple', from: '#6d28d9', to: '#c084fc', badge: '#ffffff', accent: '#6d28d9' },
  dark: { name: 'Dark gold', from: '#0b1210', to: '#1f2937', badge: '#fbbf24', accent: '#111111' },
}

export const posterSizes = {
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
}

// Lambe text ko lines me todta hai
function wrap(ctx, text, maxWidth) {
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

// Text ko itna chhota karo ki max lines me aa jaye
function fit(ctx, text, maxWidth, maxLines, start, min, weight = 700) {
  let size = start
  let lines = []
  for (;;) {
    ctx.font = `${weight} ${size}px ${FONT}`
    lines = wrap(ctx, text, maxWidth)
    if (lines.length <= maxLines || size <= min) break
    size -= 6
  }
  return { size, lines: lines.slice(0, maxLines) }
}

export async function drawOfferPoster(canvas, d) {
  const { w, h } = posterSizes[d.size] || posterSizes.square
  const t = posterThemes[d.theme] || posterThemes.green
  const tall = h > w

  // Fonts load hone do (Hindi ke liye bhi)
  await Promise.all([
    document.fonts.load(`700 60px ${FONT}`),
    document.fonts.load(`400 30px ${FONT}`),
    document.fonts.load('700 40px "Noto Sans Devanagari"', 'अ'),
  ])

  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const cx = w / 2
  const maxW = w - 180

  // Background
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, t.from)
  bg.addColorStop(1, t.to)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Sajaavat ke gol
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.arc(w * 0.92, h * 0.07, w * 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.beginPath()
  ctx.arc(w * 0.04, h * 0.94, w * 0.25, 0, Math.PI * 2)
  ctx.fill()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ffffff'

  // Dukaan ka naam
  let y = tall ? 170 : 125
  if (d.shopName.trim()) {
    const shop = fit(ctx, d.shopName.trim().toUpperCase(), maxW, 1, 52, 28)
    ctx.font = `700 ${shop.size}px ${FONT}`
    if ('letterSpacing' in ctx) ctx.letterSpacing = '6px'
    ctx.fillText(shop.lines[0], cx + 3, y)
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillRect(cx - 60, y + 28, 120, 5)
  }

  // Headline
  y = tall ? 400 : 250
  if (d.headline.trim()) {
    const hl = fit(ctx, d.headline.trim().toUpperCase(), maxW, tall ? 3 : 2, tall ? 190 : 130, 64)
    ctx.fillStyle = '#ffffff'
    ctx.font = `700 ${hl.size}px ${FONT}`
    hl.lines.forEach((line, i) => ctx.fillText(line, cx, y + hl.size * 0.9 + i * hl.size * 1.05))
    y += hl.lines.length * hl.size * 1.05 + 40
  }

  // Offer ka badge
  if (d.offer.trim()) {
    const of = fit(ctx, d.offer.trim(), maxW - 120, 2, tall ? 120 : 96, 48)
    const widest = Math.max(...of.lines.map((l) => ctx.measureText(l).width))
    const bw = Math.min(maxW, widest + 120)
    const bh = of.lines.length * of.size * 1.15 + 60

    ctx.fillStyle = t.badge
    ctx.shadowColor = 'rgba(0,0,0,0.25)'
    ctx.shadowBlur = 30
    ctx.shadowOffsetY = 12
    ctx.beginPath()
    ctx.roundRect(cx - bw / 2, y, bw, bh, 40)
    ctx.fill()
    ctx.shadowColor = 'transparent'

    ctx.fillStyle = t.accent
    ctx.font = `700 ${of.size}px ${FONT}`
    of.lines.forEach((line, i) => ctx.fillText(line, cx, y + 30 + of.size * 0.95 + i * of.size * 1.15))
    y += bh + 50
  }

  // Details
  if (d.details.trim()) {
    const det = fit(ctx, d.details.trim(), maxW, 3, 46, 28, 400)
    ctx.fillStyle = 'rgba(255,255,255,0.94)'
    ctx.font = `400 ${det.size}px ${FONT}`
    det.lines.forEach((line, i) => ctx.fillText(line, cx, y + det.size + i * det.size * 1.3))
  }

  // Neeche: phone aur chhota watermark
  if (d.phone.trim()) {
    ctx.fillStyle = '#ffffff'
    ctx.font = `700 46px ${FONT}`
    ctx.fillText(`WhatsApp / Call: ${d.phone.trim()}`, cx, h - 120)
  }
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = `400 26px ${FONT}`
  ctx.fillText('Made with Anstech free tools', cx, h - 55)
}