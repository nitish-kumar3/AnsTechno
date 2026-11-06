import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import env from '../config/env.js'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import upload from '../middlewares/upload.js'
import {
  createApplication,
  deleteApplication,
  downloadResume,
  getApplication,
  getApplications,
  updateApplication,
} from '../controllers/applicationController.js'

const router = Router()

// Spam rokne ke liye: ek IP se ghante me 10 applications (live server pe)
const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: env.isProd ? 10 : 100,
  message: { success: false, message: 'Too many applications. Please try again later.' },
})

// Resume upload, aur file galat ho (type/size) to saaf error bhejo
function uploadResume(req, res, next) {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'File must be under 5MB' : err.message
      return res.status(400).json({ success: false, message })
    }
    next()
  })
}

// Sabke liye: apply karna
router.post('/', applyLimiter, uploadResume, createApplication)

// Isse neeche ke saare routes sirf admin ke liye
router.use(protect, authorize('admin'))

router.get('/', getApplications)
router.get('/:id', getApplication)
router.get('/:id/resume', downloadResume)
router.put('/:id', updateApplication)
router.delete('/:id', deleteApplication)

export default router