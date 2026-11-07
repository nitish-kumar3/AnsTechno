import Post from '../models/Post.js'

// PUBLIC: published articles ki list (?lang=hi ?category=SEO ?search=... ?page=1)
export const listPosts = async (req, res) => {
  try {
    const filter = { status: 'published' }
    if (['en', 'hi'].includes(req.query.lang)) filter.lang = req.query.lang
    if (req.query.category) filter.category = String(req.query.category)

    if (req.query.search) {
      // Special characters safe banao, phir title/summary/tags me dhundo
      const text = String(req.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(text, 'i')
      filter.$or = [{ title: regex }, { excerpt: regex }, { tags: regex }]
    }

    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 9, 30)

    const total = await Post.countDocuments(filter)
    const posts = await Post.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content') // list me poora article nahi chahiye

    const categories = await Post.distinct('category', {
      status: 'published',
      category: { $ne: '' },
    })

    res.json({ success: true, posts, total, page, pages: Math.ceil(total / limit), categories })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PUBLIC: ek article slug se (aur 3 related)
export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: String(req.params.slug).toLowerCase(), status: 'published' })
    if (!post) return res.status(404).json({ success: false, message: 'Article not found' })

    // Related: usi category ke, na mile to latest
    let related = []
    if (post.category) {
      related = await Post.find({ status: 'published', _id: { $ne: post._id }, category: post.category })
        .sort({ publishedAt: -1 })
        .limit(3)
        .select('-content')
    }
    if (related.length < 3) {
      const skip = [post._id, ...related.map((r) => r._id)]
      const more = await Post.find({ status: 'published', _id: { $nin: skip } })
        .sort({ publishedAt: -1 })
        .limit(3 - related.length)
        .select('-content')
      related = [...related, ...more]
    }

    res.json({ success: true, post, related })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}