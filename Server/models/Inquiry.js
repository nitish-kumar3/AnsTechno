// import mongoose from 'mongoose'

// const inquirySchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, lowercase: true, trim: true },
//     message: { type: String, required: true },
//     service: { type: String, default: '' }, // kis service ke baare me (agar chuni ho)

//     // Admin ke liye
//     status: { type: String, enum: ['New', 'Replied', 'Closed'], default: 'New' },
//     notes: { type: String, default: '' },
//   },
//   { timestamps: true }
// )

// export default mongoose.model('Inquiry', inquirySchema)


import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema(
  {
    // message = contact form, call = free call, estimate = cost estimator, quiz = online check
    type: { type: String, enum: ['message', 'call', 'estimate', 'quiz', 'hire', 'dukaan' ], default: 'message' },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    preferredTime: { type: String, default: '' },
    message: { type: String, required: true },
    details: { type: String, default: '' }, // estimate/quiz ka poora summary
    service: { type: String, default: '' },

    // Admin ke liye
    status: { type: String, enum: ['New', 'Replied', 'Closed'], default: 'New' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Inquiry', inquirySchema)