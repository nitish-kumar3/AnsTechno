import mongoose from 'mongoose'

// Resume ki file yahan save hoti hai (sirf admin download kar sakta hai)
const resumeFileSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    contentType: { type: String, default: 'application/octet-stream' },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('ResumeFile', resumeFileSchema)