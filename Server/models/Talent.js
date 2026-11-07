import mongoose from 'mongoose'

const talentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: '' },
    headline: { type: String, default: '', trim: true }, // jaise "MERN Stack Intern"
    location: { type: String, default: '', trim: true }, // sirf sheher
    bio: { type: String, default: '', maxlength: 800 },
    skills: { type: [String], default: [] },
    openToWork: { type: Boolean, default: true },
    portfolioUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    certId: { type: String, default: '', uppercase: true, trim: true }, // verified certificate ki ID
    batch: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Talent', talentSchema)