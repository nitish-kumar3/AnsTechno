import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import { createShop, deleteShop, listAdmin, updateShop } from '../controllers/shopController.js'

const router = Router()

// Ye saare routes sirf admin ke liye
router.use(protect, authorize('admin'))

router.get('/', listAdmin)
router.post('/', createShop)
router.put('/:id', updateShop)
router.delete('/:id', deleteShop)

export default router