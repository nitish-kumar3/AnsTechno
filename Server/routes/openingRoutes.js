import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import {
  createOpening,
  deleteOpening,
  getAllOpeningsAdmin,
  getOpeningBySlug,
  getOpenings,
  updateOpening,
} from '../controllers/openingController.js'

const router = Router()

// Sabke liye
router.get('/', getOpenings)

// Sirf admin ke liye
router.get('/admin/all', protect, authorize('admin'), getAllOpeningsAdmin)
router.post('/', protect, authorize('admin'), createOpening)
router.put('/:id', protect, authorize('admin'), updateOpening)
router.delete('/:id', protect, authorize('admin'), deleteOpening)

// Sabke liye: ek opening
router.get('/:slug', getOpeningBySlug)

export default router