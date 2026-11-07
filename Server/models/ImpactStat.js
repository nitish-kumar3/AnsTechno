import mongoose from 'mongoose'

const impactSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, min: 0 }, // jaise 500
    suffix: { type: String, default: '+', maxlength: 5 }, // jaise +, %, K+
    label: { type: String, required: true, trim: true }, // jaise People trained
    labelHi: { type: String, default: '', trim: true }, // Hindi label (ho to)
    icon: { type: String, default: 'users' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('ImpactStat', impactSchema)