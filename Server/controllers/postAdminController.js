import Post from '../models/Post.js'
import makeSlug from '../utils/makeSlug.js'
import removeImageFile from '../utils/removeImageFile.js'

const bad = (res, message, code = 400) => res.status(code).json({ success: false, message })

// Aisa slug jo pehle se na ho (hindi title ho to random naam)
async function uniqueSlug(base, ignoreId) {
  const root = makeSlug(base) || `post-${Date.now().toString(36)}`
  let slug = root
  let n = 1
  while (await Post.findOne({ slug, ...(ignoreId && { _id: { $ne: ignoreId } }) })) {
    n += 1
    slug = `${root}-${n}`
  }
  return slug
}

// Kitne minute me padh sakte hain
const readMinutes = (text) =>
  Math.max(1, Math.ceil(String(text).trim().split(/\s+/).filter(Boolean).length / 200))

// Excerpt na diya ho to content se bana lo
const makeExcerpt = (text) =>
  String(text)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links ka text
    .replace(/[#*_>`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)

// Form se aaye data ko saaf karo
function cleanBody(body) {
  const data = {}
  if (body.title !== undefined) data.title = String(body.title).trim().slice(0, 150)
  if (body.excerpt !== undefined) data.excerpt = String(body.excerpt).trim().slice(0, 300)
  if (body.content !== undefined) data.content = String(body.content).slice(0, 100000)
  if (body.coverImage !== undefined) data.coverImage = String(body.coverImage).trim()
  if (body.category !== undefined) data.category = String(body.category).trim().slice(0, 40)
  if (body.author !== undefined) data.author = String(body.author).trim().slice(0, 60) || 'Anstech Team'
  if (['en', 'hi'].includes(body.lang)) data.lang = body.lang
  if (['draft', 'published'].includes(body.status)) data.status = body.status
  if (Array.isArray(body.tags)) {
    data.tags = body.tags
      .map((t) => String(t).trim().slice(0, 30))
      .filter(Boolean)
      .slice(0, 8)
  }
  return data
}

// ADMIN: list (?status=draft ?search=... ?page=1)
export const listAdmin = async (req, res) => {
  try {
    const filter = {}
    if (['draft', 'published'].includes(req.query.status)) filter.status = req.query.status

    if (req.query.search) {
      const text = String(req.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(text, 'i')
      filter.$or = [{ title: regex }, { slug: regex }, { category: regex }]
    }

    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 20, 100)

    const total = await Post.countDocuments(filter)
    const posts = await Post.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    res.json({ success: true, posts, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: naya article
export const createPost = async (req, res) => {
  try {
    const data = cleanBody(req.body)
    if (!data.title || data.title.length < 3) return bad(res, 'Please enter the title')
    if (data.status === 'published' && (data.content || '').trim().length < 50) {
      return bad(res, 'Publish karne ke liye kam se kam 50 characters ka content likho')
    }

    data.slug = await uniqueSlug(req.body.slug || data.title)
    data.readMinutes = readMinutes(data.content || '')
    if (!data.excerpt) data.excerpt = makeExcerpt(data.content || '')
    if (data.status === 'published') data.publishedAt = new Date()

    const post = await Post.create(data)
    res.status(201).json({ success: true, post })
  } catch (error) {
    bad(res, error.message)
  }
}

// ADMIN: article edit
export const updatePost = async (req, res) => {
  try {
    const old = await Post.findById(req.params.id)
    if (!old) return bad(res, 'Article not found', 404)

    const data = cleanBody(req.body)
    if (data.title !== undefined && data.title.length < 3) return bad(res, 'Please enter the title')

    const content = data.content !== undefined ? data.content : old.content
    const status = data.status || old.status
    if (status === 'published' && content.trim().length < 50) {
      return bad(res, 'Publish karne ke liye kam se kam 50 characters ka content likho')
    }

    // Slug tabhi badlo jab admin ne naya diya ho (title badalne se purane links na tootein)
    if (req.body.slug && makeSlug(req.body.slug) !== old.slug) {
      data.slug = await uniqueSlug(req.body.slug, old._id)
    }

    if (data.content !== undefined) data.readMinutes = readMinutes(content)
    if (data.excerpt === '' && data.content !== undefined) data.excerpt = makeExcerpt(content)
    if (status === 'published' && !old.publishedAt) data.publishedAt = new Date()

    const post = await Post.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })

    // Cover photo badli ho to purani hata do
    if (old.coverImage && old.coverImage !== post.coverImage) removeImageFile(old.coverImage)

    res.json({ success: true, post })
  } catch (error) {
    bad(res, error.message)
  }
}

// ADMIN: article delete
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return bad(res, 'Article not found', 404)

    removeImageFile(post.coverImage)
    res.json({ success: true, message: 'Article deleted' })
  } catch (error) {
    bad(res, error.message)
  }
}