import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import { getSettings, updateSettings } from '../controllers/settingController.js'

const router = Router()

// Sabke liye: contact info dekhna
router.get('/', getSettings)

// Sirf admin: badalna
router.put('/', protect, authorize('admin'), updateSettings)

export default router