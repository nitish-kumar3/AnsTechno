import { Router } from 'express'
import makeCrudRouter from '../utils/makeCrudRouter.js'
import Announcement from '../models/Announcement.js'

const router = Router()

// PUBLIC: sirf wahi jo abhi chal rahi hain (shuru ho chuki aur khatam nahi hui)
router.get('/', async (req, res) => {
  try {
    const now = new Date()
    const items = await Announcement.find({
      isActive: true,
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }] },
      ],
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(5)

    res.json({ success: true, items })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Baaki (admin: add, edit, delete)
router.use(makeCrudRouter(Announcement))

export default router