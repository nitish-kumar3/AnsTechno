import QRCode from 'qrcode'

const W = 1754 // A4 landscape
const H = 1240
const FONT = '"Space Grotesk", "Noto Sans Devanagari", Arial, sans-serif'

// Certificate par sign karne wale ka naam
const SIGNATORY = { name: 'Nitish Kumar', role: 'Founder, Anstechno' }

const titles = {
  Internship: 'CERTIFICATE OF INTERNSHIP',
  Training: 'CERTIFICATE OF TRAINING',
  Course: 'CERTIFICATE OF COMPLETION',
}
const verbs = {
  Internship: 'has successfully completed an internship in',
  Training: 'has successfully completed training in',
  Course: 'has successfully completed the course',
}

// QR me ye address jayega. Live site ke liye client/.env me VITE_SITE_URL=https://tumhari-site.com
export const siteUrl = () =>
  (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')
export const verifyUrl = (id) => `${siteUrl()}/verify/${id}`

const fmt = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

// Lambe text ko lines me todta hai
function wrapText(ctx, text, maxWidth) {
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

function setSpacing(ctx, px) {
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function drawCertificate(canvas, cert) {
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const cx = W / 2

  // Font load hone do, tabhi draw
  await Promise.all([
    document.fonts.load(`700 80px ${FONT}`),
    document.fonts.load(`400 30px ${FONT}`),
  ])

  // Background
  ctx.fillStyle = '#fbfcfa'
  ctx.fillRect(0, 0, W, H)
  const glow1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 700)
  glow1.addColorStop(0, 'rgba(25,195,154,0.16)')
  glow1.addColorStop(1, 'rgba(25,195,154,0)')
  ctx.fillStyle = glow1
  ctx.fillRect(0, 0, W, H)
  const glow2 = ctx.createRadialGradient(W, H, 0, W, H, 700)
  glow2.addColorStop(0, 'rgba(25,195,154,0.16)')
  glow2.addColorStop(1, 'rgba(25,195,154,0)')
  ctx.fillStyle = glow2
  ctx.fillRect(0, 0, W, H)

  // Double border
  ctx.strokeStyle = '#0f9d7b'
  ctx.lineWidth = 6
  ctx.strokeRect(40, 40, W - 80, H - 80)
  ctx.strokeStyle = '#19c39a'
  ctx.lineWidth = 2
  ctx.strokeRect(62, 62, W - 124, H - 124)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // Logo
  const logo = ctx.createLinearGradient(cx - 38, 100, cx + 38, 176)
  logo.addColorStop(0, '#6ee7c7')
  logo.addColorStop(1, '#0f9d7b')
  ctx.fillStyle = logo
  ctx.beginPath()
  ctx.roundRect(cx - 38, 100, 76, 76, 18)
  ctx.fill()
  ctx.fillStyle = '#04100b'
  ctx.font = `700 50px ${FONT}`
  ctx.fillText('A', cx, 153)

  // Company
  ctx.fillStyle = '#04100b'
  ctx.font = `700 40px ${FONT}`
  setSpacing(ctx, 8)
  ctx.fillText('ANSTECHNO', cx + 4, 224)
  setSpacing(ctx, 1)
  ctx.fillStyle = '#5a6c64'
  ctx.font = `400 22px ${FONT}`
  ctx.fillText('Digital Agency & Software Company', cx, 258)

  // Title
  ctx.fillStyle = '#04100b'
  ctx.font = `700 62px ${FONT}`
  setSpacing(ctx, 6)
  ctx.fillText(titles[cert.type] || titles.Internship, cx + 3, 360)
  setSpacing(ctx, 0)

  const line = ctx.createLinearGradient(cx - 260, 0, cx + 260, 0)
  line.addColorStop(0, 'rgba(25,195,154,0)')
  line.addColorStop(0.5, '#19c39a')
  line.addColorStop(1, 'rgba(25,195,154,0)')
  ctx.fillStyle = line
  ctx.fillRect(cx - 260, 388, 520, 3)

  // "This is to certify that"
  ctx.fillStyle = '#5a6c64'
  ctx.font = `400 28px ${FONT}`
  ctx.fillText('This is to certify that', cx, 455)

  // Naam (bahut lamba ho to chhota ho jata hai)
  let nameSize = 92
  ctx.fillStyle = '#0a7d60'
  ctx.font = `700 ${nameSize}px ${FONT}`
  while (ctx.measureText(cert.name).width > 1250 && nameSize > 40) {
    nameSize -= 4
    ctx.font = `700 ${nameSize}px ${FONT}`
  }
  ctx.fillText(cert.name, cx, 560)
  ctx.fillStyle = '#c9d6d0'
  ctx.fillRect(cx - 450, 585, 900, 2)

  // Program
  ctx.fillStyle = '#5a6c64'
  ctx.font = `400 28px ${FONT}`
  ctx.fillText(verbs[cert.type] || verbs.Internship, cx, 650)

  ctx.fillStyle = '#04100b'
  ctx.font = `700 54px ${FONT}`
  let lines = wrapText(ctx, cert.program, 1300)
  if (lines.length > 2) {
    lines = lines.slice(0, 2)
    lines[1] = lines[1].replace(/\s*\S*$/, '') + '...'
  }
  let y = 722
  lines.forEach((text) => {
    ctx.fillText(text, cx, y)
    y += 66
  })

  // Dates aur grade
  ctx.fillStyle = '#5a6c64'
  ctx.font = `400 28px ${FONT}`
  const period =
    cert.startDate && cert.endDate
      ? `from ${fmt(cert.startDate)} to ${fmt(cert.endDate)}`
      : `on ${fmt(cert.issueDate)}`
  ctx.fillText(period, cx, y - 6)
  if (cert.grade) {
    ctx.fillText(`Grade / Remarks: ${cert.grade}`, cx, y + 38)
  }

  // Neeche: date (left), QR (beech me), signature (right)
  ctx.fillStyle = '#04100b'
  ctx.font = `700 30px ${FONT}`
  ctx.fillText(fmt(cert.issueDate), 380, 1040)
  ctx.fillStyle = '#9fb0a8'
  ctx.fillRect(200, 1055, 360, 2)
  ctx.fillStyle = '#5a6c64'
  ctx.font = `400 22px ${FONT}`
  ctx.fillText('Date of issue', 380, 1090)

  ctx.fillStyle = '#04100b'
  ctx.font = `700 34px ${FONT}`
  ctx.fillText(SIGNATORY.name, W - 380, 1040)
  ctx.fillStyle = '#9fb0a8'
  ctx.fillRect(W - 560, 1055, 360, 2)
  ctx.fillStyle = '#5a6c64'
  ctx.font = `400 22px ${FONT}`
  ctx.fillText(SIGNATORY.role, W - 380, 1090)

  // QR
  const qrData = await QRCode.toDataURL(verifyUrl(cert.certId), {
    margin: 1,
    width: 340,
    color: { dark: '#04100b', light: '#ffffff' },
  })
  const qr = await loadImage(qrData)
  ctx.drawImage(qr, cx - 85, 925, 170, 170)
  ctx.fillStyle = '#5a6c64'
  ctx.font = `400 22px ${FONT}`
  ctx.fillText('Scan to verify', cx, 1126)
  ctx.fillStyle = '#0a7d60'
  ctx.font = `700 24px ${FONT}`
  ctx.fillText(cert.certId, cx, 1156)
}