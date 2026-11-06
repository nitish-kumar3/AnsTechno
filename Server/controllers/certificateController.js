import { randomInt } from 'crypto'
import Certificate from '../models/Certificate.js'

// O, 0, I, 1 nahi rakhe (padhne me confusion na ho)
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

// Jaise ANS-2026-K7M2PQ
function randomId() {
  let code = ''
  for (let i = 0; i < 6; i++) code += CHARS[randomInt(CHARS.length)]
  return `ANS-${new Date().getFullYear()}-${code}`
}

// Aisi ID jo pehle se na ho
async function newCertId() {
  for (let i = 0; i < 10; i++) {
    const id = randomId()
    if (!(await Certificate.findOne({ certId: id }))) return id
  }
  throw new Error('Could not create a certificate ID. Please try again.')
}

// Date string ko Date banao. Khali ho to undefined, galat ho to null
function parseDate(value) {
  if (value === undefined || value === null || value === '') return undefined
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

const bad = (res, message, code = 400) => res.status(code).json({ success: false, message })

// PUBLIC: certificate asli hai ya nahi (QR scan ya ID se)
export const verifyCertificate = async (req, res) => {
  try {
    const certId = String(req.params.certId || '').trim().toUpperCase().slice(0, 30)
    const cert = await Certificate.findOne({ certId })

    if (!cert) return bad(res, 'Certificate not found', 404)

    // Sirf zaroori cheezein (email, notes kabhi nahi)
    res.json({
      success: true,
      certificate: {
        certId: cert.certId,
        name: cert.name,
        program: cert.program,
        type: cert.type,
        startDate: cert.startDate,
        endDate: cert.endDate,
        issueDate: cert.issueDate,
        grade: cert.grade,
        status: cert.status,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: list (?status=valid  ?search=naam  ?page=1)
export const getCertificates = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = String(req.query.status)

    if (req.query.search) {
      const text = String(req.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(text, 'i')
      filter.$or = [{ name: regex }, { program: regex }, { certId: regex }]
    }

    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 20, 100)

    const total = await Certificate.countDocuments(filter)
    const certificates = await Certificate.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    res.json({ success: true, certificates, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: naya certificate issue karo
export const createCertificate = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim().slice(0, 80)
    const program = String(req.body.program || '').trim().slice(0, 120)
    const email = String(req.body.email || '').trim().toLowerCase()
    const type = ['Internship', 'Training', 'Course'].includes(req.body.type) ? req.body.type : 'Internship'
    const grade = String(req.body.grade || '').trim().slice(0, 40)
    const notes = String(req.body.notes || '').trim().slice(0, 1000)

    const startDate = parseDate(req.body.startDate)
    const endDate = parseDate(req.body.endDate)
    const issueDate = parseDate(req.body.issueDate)

    if (name.length < 2) return bad(res, 'Please enter the name')
    if (program.length < 2) return bad(res, 'Please enter the program')
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return bad(res, 'Enter a valid email')
    if (startDate === null || endDate === null || issueDate === null) return bad(res, 'Enter valid dates')
    if (startDate && endDate && endDate < startDate) return bad(res, 'End date must be after start date')

    const certificate = await Certificate.create({
      certId: await newCertId(),
      name,
      email,
      program,
      type,
      startDate,
      endDate,
      issueDate: issueDate || new Date(),
      grade,
      notes,
    })

    res.status(201).json({ success: true, certificate })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// ADMIN: certificate edit (ID kabhi nahi badalti)
export const updateCertificate = async (req, res) => {
  try {
    const updates = {}
    const body = req.body

    if (body.name !== undefined) {
      updates.name = String(body.name).trim().slice(0, 80)
      if (updates.name.length < 2) return bad(res, 'Please enter the name')
    }
    if (body.program !== undefined) {
      updates.program = String(body.program).trim().slice(0, 120)
      if (updates.program.length < 2) return bad(res, 'Please enter the program')
    }
    if (body.email !== undefined) {
      updates.email = String(body.email).trim().toLowerCase()
      if (updates.email && !/^\S+@\S+\.\S+$/.test(updates.email)) return bad(res, 'Enter a valid email')
    }
    if (body.type && ['Internship', 'Training', 'Course'].includes(body.type)) updates.type = body.type
    if (body.status && ['valid', 'revoked'].includes(body.status)) updates.status = body.status
    if (body.grade !== undefined) updates.grade = String(body.grade).trim().slice(0, 40)
    if (body.notes !== undefined) updates.notes = String(body.notes).trim().slice(0, 1000)

    // Dates: khali bheja to hata do, galat ho to error
    for (const field of ['startDate', 'endDate', 'issueDate']) {
      if (body[field] !== undefined) {
        const date = parseDate(body[field])
        if (date === null) return bad(res, 'Enter valid dates')
        updates[field] = date === undefined ? null : date
      }
    }

    const certificate = await Certificate.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!certificate) return bad(res, 'Certificate not found', 404)

    res.json({ success: true, certificate })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// ADMIN: delete
export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id)
    if (!certificate) return bad(res, 'Certificate not found', 404)
    res.json({ success: true, message: 'Certificate deleted' })
  } catch (error) {
    bad(res, error.message)
  }
}