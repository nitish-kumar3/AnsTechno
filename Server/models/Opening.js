import mongoose from 'mongoose'

const openingSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, required: true, enum: ['Job', 'Internship'] },
    title: { type: String, required: true, trim: true },
    department: { type: String, default: '' },

    // Sirf Job ke liye
    location: { type: String, default: '' },
    workMode: { type: String, default: '' },
    experience: { type: String, default: '' },
    salary: { type: String, default: '' },
    responsibilities: { type: [String], default: [] },

    // Sirf Internship ke liye
    mode: { type: String, default: '' },
    duration: { type: String, default: '' },
    fee: { type: String, default: '' },
    learn: { type: [String], default: [] },

    // Dono ke liye
    openings: { type: Number, default: 1 }, // kitni jagah khali hain
    skills: { type: [String], default: [] },
    about: { type: String, default: '' },
    requirements: { type: [String], default: [] },

    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }, // false = site pe hidden
  },
  { timestamps: true }
)

export default mongoose.model('Opening', openingSchema)