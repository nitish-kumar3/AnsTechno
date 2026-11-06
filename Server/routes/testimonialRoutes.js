import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonialsAdmin,
  getTestimonials,
  updateTestimonial,
} from '../controllers/testimonialController.js'

const router = Router()

// Sabke liye
router.get('/', getTestimonials)

// Sirf admin ke liye
router.get('/admin/all', protect, authorize('admin'), getAllTestimonialsAdmin)
router.post('/', protect, authorize('admin'), createTestimonial)
router.put('/:id', protect, authorize('admin'), updateTestimonial)
router.delete('/:id', protect, authorize('admin'), deleteTestimonial)

export default router