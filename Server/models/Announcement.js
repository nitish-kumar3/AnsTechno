import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 200 },
    textHi: { type: String, default: '', trim: true, maxlength: 200 },
    link: { type: String, default: '', trim: true }, // /career ya https://...
    linkLabel: { type: String, default: '', trim: true, maxlength: 40 },
    linkLabelHi: { type: String, default: '', trim: true, maxlength: 40 },
    startsAt: { type: Date, default: null }, // khali = abhi se
    expiresAt: { type: Date, default: null }, // khali = hamesha
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Announcement', announcementSchema)