import Certificate from '../models/Certificate.js'
import Shop from '../models/Shop.js'
import Talent from '../models/Talent.js'
import Post from '../models/Post.js'

// Har visitor par database na khule, isliye 1 minute yaad rakhte hain
let cache = { counts: null, time: 0 }

// PUBLIC: asli ginti (database se apne aap)
export const getProof = async (req, res) => {
  try {
    if (cache.counts && Date.now() - cache.time < 60 * 1000) {
      return res.json({ success: true, counts: cache.counts })
    }

    const [certificates, shops, talent, posts] = await Promise.all([
      Certificate.countDocuments({ status: 'valid' }),
      Shop.countDocuments({ isActive: true }),
      Talent.countDocuments({ isActive: true }),
      Post.countDocuments({ status: 'published' }),
    ])

    cache = { counts: { certificates, shops, talent, posts }, time: Date.now() }
    res.json({ success: true, counts: cache.counts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}