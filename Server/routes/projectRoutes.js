import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import {
  createProject,
  deleteProject,
  getAllProjectsAdmin,
  getProjectBySlug,
  getProjects,
  updateProject,
} from '../controllers/projectController.js'

const router = Router()

// Sabke liye
router.get('/', getProjects)

// Sirf admin ke liye
router.get('/admin/all', protect, authorize('admin'), getAllProjectsAdmin)
router.post('/', protect, authorize('admin'), createProject)
router.put('/:id', protect, authorize('admin'), updateProject)
router.delete('/:id', protect, authorize('admin'), deleteProject)

// Sabke liye: ek project
router.get('/:slug', getProjectBySlug)

export default router