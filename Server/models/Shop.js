import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  price: { type: Number, min: 0, default: null }, // khali = "daam puchho"
  unit: { type: String, default: '', trim: true, maxlength: 30 }, // jaise "per kg", "1 piece"
  category: { type: String, default: '', trim: true, maxlength: 40 },
  image: { type: String, default: '' },
  available: { type: Boolean, default: true },
})

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: '' }, // jaise Grocery
    logo: { type: String, default: '' },
    cover: { type: String, default: '' },
    whatsapp: { type: String, required: true }, // sirf digits, country code ke saath
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    hours: { type: String, default: '' },
    products: { type: [productSchema], default: [] },
    notes: { type: String, default: '' }, // private, public me kabhi nahi jata
    orderClicks: { type: Number, default: 0 }, // WhatsApp order button kitni baar dabaya
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Shop', shopSchema)