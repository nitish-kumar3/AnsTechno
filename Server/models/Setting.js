import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema(
  {
    email: { type: String, default: 'hello@yourcompany.com' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' }, // country code ke saath, bina + ke
    address: { type: String, default: 'Delhi, India' },
    hours: { type: String, default: 'Mon – Sat, 10:00 AM – 7:00 PM' },
    reply: { type: String, default: 'We usually reply within 24 hours' },
    mapQuery: { type: String, default: 'Delhi, India' },
  },
  { timestamps: true }
)

export default mongoose.model('Setting', settingSchema)