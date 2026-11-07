import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '', maxlength: 300 }, // chhota summary
    content: { type: String, default: '' }, // Markdown
    coverImage: { type: String, default: '' },
    category: { type: String, default: '', trim: true },
    tags: { type: [String], default: [] },
    lang: { type: String, enum: ['en', 'hi'], default: 'en' },
    author: { type: String, default: 'Anstech Team', trim: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date, default: null },
    readMinutes: { type: Number, default: 1 },
  },
  { timestamps: true }
)

export default mongoose.model('Post', postSchema)