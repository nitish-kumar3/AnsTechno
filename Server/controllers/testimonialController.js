import Testimonial from '../models/Testimonial.js'

// PUBLIC: site pe dikhne wale testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    })
    res.json({ success: true, testimonials })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: saare testimonials (hidden wale bhi)
export const getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, testimonials })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: naya testimonial add
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body)
    res.status(201).json({ success: true, testimonial })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// ADMIN: testimonial edit
export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' })
    }
    res.json({ success: true, testimonial })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// ADMIN: testimonial delete
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id)
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' })
    }
    res.json({ success: true, message: 'Testimonial deleted' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}