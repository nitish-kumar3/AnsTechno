import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import env from '../config/env.js'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import {
  createCertificate,
  deleteCertificate,
  getCertificates,
  updateCertificate,
  verifyCertificate,
} from '../controllers/certificateController.js'

const router = Router()

// Ek IP se 1 minute me 30 verify (ID guess karne se rokne ke liye)
const verifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: env.isProd ? 30 : 300,
  message: { success: false, message: 'Too many attempts. Please try again in a minute.' },
})

// Sabke liye
router.get('/verify/:certId', verifyLimiter, verifyCertificate)

// Isse neeche ke saare routes sirf admin ke liye
router.use(protect, authorize('admin'))

router.get('/', getCertificates)
router.post('/', createCertificate)
router.put('/:id', updateCertificate)
router.delete('/:id', deleteCertificate)

export default router