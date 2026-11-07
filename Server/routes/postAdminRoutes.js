import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import {
  createPost,
  deletePost,
  listAdmin,
  updatePost,
} from '../controllers/postAdminController.js'

const router = Router()

// Ye saare routes sirf admin ke liye
router.use(protect, authorize('admin'))

router.get('/', listAdmin)
router.post('/', createPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)

export default router