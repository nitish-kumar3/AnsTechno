import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['Web App', 'AI / ML'] },
    icon: { type: String, default: 'code' },
    serviceId: { type: String, default: '' }, // kis service se judta hai (service ka slug)
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    features: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    image: { type: String, default: '' }, // photo ka link
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)