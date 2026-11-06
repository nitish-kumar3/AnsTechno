import Opening from '../models/Opening.js'
import makeSlug from '../utils/makeSlug.js'

function sendError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: 'Is slug ki opening pehle se hai' })
  }
  res.status(400).json({ success: false, message: error.message })
}

// PUBLIC: site pe dikhne wali openings (?type=Job ya ?type=Internship bhi chalega)
export const getOpenings = async (req, res) => {
  try {
    const filter = { isActive: true }
    if (req.query.type) filter.type = String(req.query.type) // string me badal do (safety)

    const openings = await Opening.find(filter).sort({ order: 1, createdAt: 1 })
    res.json({ success: true, openings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PUBLIC: ek opening slug se
export const getOpeningBySlug = async (req, res) => {
  try {
    const opening = await Opening.findOne({ slug: req.params.slug, isActive: true })
    if (!opening) {
      return res.status(404).json({ success: false, message: 'Opening not found' })
    }
    res.json({ success: true, opening })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: saari openings (hidden wali bhi)
export const getAllOpeningsAdmin = async (req, res) => {
  try {
    const openings = await Opening.find().sort({ order: 1, createdAt: 1 })
    res.json({ success: true, openings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: nayi opening add
export const createOpening = async (req, res) => {
  try {
    const data = req.body
    if (!data.slug && data.title) {
      data.slug = makeSlug(data.title)
    }
    const opening = await Opening.create(data)
    res.status(201).json({ success: true, opening })
  } catch (error) {
    sendError(res, error)
  }
}

// ADMIN: opening edit
export const updateOpening = async (req, res) => {
  try {
    const opening = await Opening.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!opening) {
      return res.status(404).json({ success: false, message: 'Opening not found' })
    }
    res.json({ success: true, opening })
  } catch (error) {
    sendError(res, error)
  }
}

// ADMIN: opening delete
export const deleteOpening = async (req, res) => {
  try {
    const opening = await Opening.findByIdAndDelete(req.params.id)
    if (!opening) {
      return res.status(404).json({ success: false, message: 'Opening not found' })
    }
    res.json({ success: true, message: 'Opening deleted' })
  } catch (error) {
    sendError(res, error)
  }
}