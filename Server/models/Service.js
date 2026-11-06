import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Development', 'Marketing', 'AI & Automation'],
    },
    icon: { type: String, default: 'globe' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    features: { type: [String], default: [] }, // "kya milega" ki list
    tools: { type: [String], default: [] },
    idealFor: { type: String, default: '' },
    order: { type: Number, default: 0 }, // chhota number pehle dikhega
    isActive: { type: Boolean, default: true }, // false = site pe hidden
  },
  { timestamps: true }
)

export default mongoose.model('Service', serviceSchema)