import mongoose from 'mongoose'

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    business: { type: String, default: '', trim: true }, // jaise Local Retail Store
    location: { type: String, default: '', trim: true }, // jaise Patna, Bihar
    summary: { type: String, default: '' },
    before: { type: String, default: '' },
    after: { type: String, default: '' },
    result: { type: String, default: '', trim: true }, // ek line, jaise "3x more orders"
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Story', storySchema)