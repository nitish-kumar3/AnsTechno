import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Naya role chahiye (hr, editor) to yahan add kar do
export const ROLES = ['user', 'admin']

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, trim: true, maxlength: 20 },
    role: { type: String, enum: ROLES, default: 'user' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

// Response me password kabhi na jaye
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password
    delete ret.__v
    return ret
  },
})

export default mongoose.model('User', userSchema)