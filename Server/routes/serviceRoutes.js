import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import {
  createService,
  deleteService,
  getAllServicesAdmin,
  getServiceBySlug,
  getServices,
  updateService,
} from '../controllers/serviceController.js'

const router = Router()

// Sabke liye
router.get('/', getServices)

// Sirf admin ke liye ('/admin/all' ko '/:slug' se PEHLE likhna zaroori hai)
router.get('/admin/all', protect, authorize('admin'), getAllServicesAdmin)
router.post('/', protect, authorize('admin'), createService)
router.put('/:id', protect, authorize('admin'), updateService)
router.delete('/:id', protect, authorize('admin'), deleteService)

// Sabke liye: ek service
router.get('/:slug', getServiceBySlug)

export default router