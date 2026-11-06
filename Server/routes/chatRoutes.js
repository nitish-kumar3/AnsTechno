import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import env from '../config/env.js'
import { chat } from '../controllers/chatController.js'

const router = Router()

// Ek IP se 10 minute me 25 messages (live server par)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: env.isProd ? 25 : 300,
  message: { success: false, code: 'busy', message: 'Too many messages. Please wait a few minutes.' },
})

router.post('/', limiter, chat)

export default router