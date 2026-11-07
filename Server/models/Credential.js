import mongoose from 'mongoose'

const credentialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // jaise MSME Registered
    titleHi: { type: String, default: '', trim: true },
    detail: { type: String, default: '', trim: true }, // jaise "Udyam registration" ya kuch bhi jo dikhana chahte ho
    icon: { type: String, default: 'shield' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Credential', credentialSchema)