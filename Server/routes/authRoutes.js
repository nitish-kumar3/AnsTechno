import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import env from '../config/env.js'
import { protect } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
  login,
  loginSchema,
  logout,
  me,
  refresh,
} from '../controllers/authController.js'

const router = Router()

// Brute-force rokne ke liye
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.isProd ? 20 : 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes.',
  },
})

router.post('/login', authLimiter, validate(loginSchema), login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', protect, me)

export default router