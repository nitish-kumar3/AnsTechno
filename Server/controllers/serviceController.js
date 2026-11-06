import Service from '../models/Service.js'
import makeSlug from '../utils/makeSlug.js'

// Error aaye to ye message bhejta hai
function sendError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: 'Is slug ki service pehle se hai' })
  }
  res.status(400).json({ success: false, message: error.message })
}

// PUBLIC: site pe dikhne wali services (sirf active)
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 })
    res.json({ success: true, services })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PUBLIC: ek service slug se
export const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true })
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' })
    }
    res.json({ success: true, service })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: saari services (hidden wali bhi)
export const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 })
    res.json({ success: true, services })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: nayi service add karo
export const createService = async (req, res) => {
  try {
    const data = req.body
    // slug nahi diya to title se bana do
    if (!data.slug && data.title) {
      data.slug = makeSlug(data.title)
    }
    const service = await Service.create(data)
    res.status(201).json({ success: true, service })
  } catch (error) {
    sendError(res, error)
  }
}

// ADMIN: service edit karo
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // naya data wapas do
      runValidators: true, // rules dobara check karo
    })
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' })
    }
    res.json({ success: true, service })
  } catch (error) {
    sendError(res, error)
  }
}

// ADMIN: service delete karo
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' })
    }
    res.json({ success: true, message: 'Service deleted' })
  } catch (error) {
    sendError(res, error)
  }
}