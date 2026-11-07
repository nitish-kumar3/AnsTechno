import mongoose from 'mongoose'
import Shop from '../models/Shop.js'
import Visit from '../models/Visit.js'
import makeSlug from '../utils/makeSlug.js'
import removeImageFile from '../utils/removeImageFile.js'

const bad = (res, message, code = 400) => res.status(code).json({ success: false, message })

// Phone/WhatsApp: sirf digits, 10 digit ho to aage 91 laga do
function cleanPhone(value) {
  let digits = String(value || '').replace(/\D/g, '')
  if (digits.length === 10) digits = `91${digits}`
  return digits
}
const validPhone = (digits) => digits.length >= 11 && digits.length <= 15

function cleanProducts(list) {
  if (!Array.isArray(list)) return []

  return list
    .slice(0, 200)
    .map((p) => {
      const hasPrice = p.price !== '' && p.price !== null && p.price !== undefined
      return {
        ...(mongoose.isValidObjectId(p._id) && { _id: p._id }),
        name: String(p.name || '').trim().slice(0, 120),
        price: hasPrice ? Math.round(Math.max(0, Number(p.price) || 0) * 100) / 100 : null,
        unit: String(p.unit || '').trim().slice(0, 30),
        category: String(p.category || '').trim().slice(0, 40),
        image: String(p.image || '').trim(),
        available: p.available !== false,
      }
    })
    .filter((p) => p.name)
}

// Form se aaye data me se sirf wahi lo jo bheja gaya hai
function cleanShop(body) {
  const data = {}
  const text = (key, max) => {
    if (body[key] !== undefined) data[key] = String(body[key]).trim().slice(0, max)
  }
  text('name', 80)
  text('tagline', 120)
  text('description', 600)
  text('category', 40)
  text('address', 150)
  text('city', 60)
  text('hours', 80)
  text('notes', 1000)

  if (body.logo !== undefined) data.logo = String(body.logo).trim()
  if (body.cover !== undefined) data.cover = String(body.cover).trim()
  if (body.whatsapp !== undefined) data.whatsapp = cleanPhone(body.whatsapp)
  if (body.phone !== undefined) data.phone = cleanPhone(body.phone)
  if (body.order !== undefined) data.order = Number(body.order) || 0
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive
  if (body.products !== undefined) data.products = cleanProducts(body.products)
  return data
}

function check(data, isNew) {
  if ((isNew || data.name !== undefined) && (data.name || '').length < 2) {
    return 'Please enter the shop name'
  }
  if ((isNew || data.whatsapp !== undefined) && !validPhone(data.whatsapp || '')) {
    return 'Enter a valid WhatsApp number'
  }
  if (data.phone && !validPhone(data.phone)) return 'Enter a valid phone number'
  return ''
}

// Aisa slug jo pehle se na ho
async function uniqueSlug(base, ignoreId) {
  const root = makeSlug(base) || `shop-${Date.now().toString(36)}`
  let slug = root
  let n = 1
  while (await Shop.findOne({ slug, ...(ignoreId && { _id: { $ne: ignoreId } }) })) {
    n += 1
    slug = `${root}-${n}`
  }
  return slug
}

const imagesOf = (shop) =>
  [shop.logo, shop.cover, ...shop.products.map((p) => p.image)].filter(Boolean)

/* ================= PUBLIC ================= */

// Dukaanon ki list (?search=  ?category=)
export const listShops = async (req, res) => {
  try {
    const filter = { isActive: true }
    if (req.query.category) filter.category = String(req.query.category)

    if (req.query.search) {
      const text = String(req.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(text, 'i')
      filter.$or = [{ name: regex }, { category: regex }, { city: regex }, { address: regex }]
    }

    const shops = await Shop.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select('name slug tagline category city address logo cover products')

    // List me products nahi bhejte, sirf ginti
    const items = shops.map((s) => {
      const o = s.toObject()
      o.productsCount = o.products.length
      delete o.products
      return o
    })

    res.json({ success: true, shops: items })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Ek dukaan (products ke saath)
export const getShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      slug: String(req.params.slug).toLowerCase(),
      isActive: true,
    }).select('-notes -orderClicks')

    if (!shop) return bad(res, 'Shop not found', 404)
    res.json({ success: true, shop })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// WhatsApp order button dabaya (ginti badhao)
export const clickShop = async (req, res) => {
  try {
    await Shop.updateOne(
      { slug: String(req.params.slug).toLowerCase(), isActive: true },
      { $inc: { orderClicks: 1 } }
    )
  } catch {
    // ginti na bhi bade to koi baat nahi
  }
  res.status(204).end()
}

/* ================= ADMIN ================= */

// Saari dukaanein + pichhle 30 din ke views
export const listAdmin = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 })

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const rows = await Visit.aggregate([
      { $match: { path: { $regex: '^/shop/[^/]+$' }, createdAt: { $gte: since } } },
      { $group: { _id: '$path', views: { $sum: 1 }, visitors: { $addToSet: '$visitorId' } } },
    ])
    const stats = {}
    rows.forEach((r) => {
      stats[r._id.replace('/shop/', '')] = { views: r.views, visitors: r.visitors.length }
    })

    const items = shops.map((s) => ({
      ...s.toObject(),
      productsCount: s.products.length,
      views30: stats[s.slug]?.views || 0,
      visitors30: stats[s.slug]?.visitors || 0,
    }))

    res.json({ success: true, shops: items })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createShop = async (req, res) => {
  try {
    const data = cleanShop(req.body)
    const error = check(data, true)
    if (error) return bad(res, error)

    data.slug = await uniqueSlug(data.name)
    const shop = await Shop.create(data)
    res.status(201).json({ success: true, shop })
  } catch (error) {
    bad(res, error.message)
  }
}

export const updateShop = async (req, res) => {
  try {
    const old = await Shop.findById(req.params.id)
    if (!old) return bad(res, 'Shop not found', 404)

    const data = cleanShop(req.body)
    const error = check(data, false)
    if (error) return bad(res, error)

    const shop = await Shop.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })

    // Jo photos ab use nahi ho rahi unhe Cloudinary se hata do
    const keep = new Set(imagesOf(shop))
    imagesOf(old).forEach((url) => {
      if (!keep.has(url)) removeImageFile(url)
    })

    res.json({ success: true, shop })
  } catch (error) {
    bad(res, error.message)
  }
}

export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id)
    if (!shop) return bad(res, 'Shop not found', 404)

    imagesOf(shop).forEach((url) => removeImageFile(url))
    res.json({ success: true, message: 'Shop deleted' })
  } catch (error) {
    bad(res, error.message)
  }
}