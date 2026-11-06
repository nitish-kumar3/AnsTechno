import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    // Kis opening ke liye (title yahan save rakhte hain, opening delete ho jaye tab bhi dikhe)
    opening: { type: String, default: 'general' }, // opening ka slug
    openingTitle: { type: String, default: 'General Application' },
    openingType: { type: String, default: 'General' }, // Job / Internship / General

    // Applicant ki details
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    currentStatus: { type: String, required: true }, // College student, Fresher, etc.
    message: { type: String, default: '' },

    // Resume
    resumeFile: { type: String, default: '' }, // server pe save hua naam
    resumeName: { type: String, default: '' }, // user ki original file ka naam

    // Admin ke liye
    stage: {
      type: String,
      enum: ['New', 'Shortlisted', 'Interview', 'Hired', 'Rejected'],
      default: 'New',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Application', applicationSchema)