import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    certId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' }, // sirf admin ke liye
    program: { type: String, required: true, trim: true }, // jaise "MERN Stack Internship"
    type: { type: String, enum: ['Internship', 'Training', 'Course'], default: 'Internship' },
    startDate: { type: Date },
    endDate: { type: Date },
    issueDate: { type: Date, default: Date.now },
    grade: { type: String, default: '' }, // jaise "A+" ya "Excellent"
    status: { type: String, enum: ['valid', 'revoked'], default: 'valid' },
    notes: { type: String, default: '' }, // private notes
  },
  { timestamps: true }
)

export default mongoose.model('Certificate', certificateSchema)