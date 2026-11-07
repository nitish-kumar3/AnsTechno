import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import env from '../config/env.js'
import { clickShop, getShop, listShops } from '../controllers/shopController.js'

const router = Router()

// Ginti nakli badhne se rokne ke liye
const clickLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: env.isProd ? 30 : 300,
  message: { success: false, message: 'Too many requests' },
})

router.get('/', listShops)
router.get('/:slug', getShop)
router.post('/:slug/click', clickLimiter, clickShop)

export default router