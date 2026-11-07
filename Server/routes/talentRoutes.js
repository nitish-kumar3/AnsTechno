import { Router } from 'express'
import makeCrudRouter from '../utils/makeCrudRouter.js'
import Talent from '../models/Talent.js'
import Certificate from '../models/Certificate.js'

const router = Router()

// PUBLIC: list. "Verified" ka nishaan tabhi jab certificate asli aur abhi valid ho
router.get('/', async (req, res) => {
  try {
    const talents = await Talent.find({ isActive: true }).sort({ order: 1, createdAt: -1 })

    const ids = talents.map((t) => t.certId).filter(Boolean)
    const valid = await Certificate.find({ certId: { $in: ids }, status: 'valid' }).select('certId')
    const validIds = new Set(valid.map((c) => c.certId))

    const items = talents.map((t) => ({
      ...t.toObject(),
      verified: Boolean(t.certId) && validIds.has(t.certId),
    }))

    res.json({ success: true, items })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Baaki (admin: add, edit, delete)
router.use(makeCrudRouter(Talent, { imageField: 'photo' }))

export default router