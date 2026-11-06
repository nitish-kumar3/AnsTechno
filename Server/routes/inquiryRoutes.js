import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import env from '../config/env.js'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import {
  createInquiry,
  deleteInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
} from '../controllers/inquiryController.js'

const router = Router()

// Spam rokne ke liye: ek IP se ghante me 10 messages (live server pe)
const sendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: env.isProd ? 10 : 100,
  message: { success: false, message: 'Too many messages. Please try again later.' },
})

// Sabke liye: message bhejna
router.post('/', sendLimiter, createInquiry)

// Isse neeche ke saare routes sirf admin ke liye
router.use(protect, authorize('admin'))

router.get('/', getInquiries)
router.get('/:id', getInquiry)
router.put('/:id', updateInquiry)
router.delete('/:id', deleteInquiry)

export default router