import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import env from '../config/env.js'
import { trackVisit } from '../controllers/trackController.js'

const router = Router()

// Ek IP se 1 minute me zyada se zyada 60 page views (spam se bachne ke liye)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: env.isProd ? 60 : 1000,
  message: { success: false, message: 'Too many requests' },
})

router.post('/', limiter, trackVisit)

export default router