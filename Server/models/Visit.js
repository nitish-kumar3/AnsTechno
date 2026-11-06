import mongoose from 'mongoose'

const visitSchema = new mongoose.Schema(
  {
    path: { type: String, required: true }, // jaise /services
    visitorId: { type: String, required: true }, // browser ki random id
    device: { type: String, enum: ['Desktop', 'Mobile', 'Tablet'], default: 'Desktop' },
    referrer: { type: String, default: '' }, // kahan se aaya (sirf domain)
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

// 180 din baad record apne aap delete (database bhi bhari nahi hoga)
visitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 })

export default mongoose.model('Visit', visitSchema)