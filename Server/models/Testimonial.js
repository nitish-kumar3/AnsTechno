import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '' }, // jaise "Owner, Local Retail Store"
    service: { type: String, default: '' }, // jaise "Website Development"
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    text: { type: String, required: true, trim: true }, // client ka feedback
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }, // false = site pe hidden
  },
  { timestamps: true }
)

export default mongoose.model('Testimonial', testimonialSchema)