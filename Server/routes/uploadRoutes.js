import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import uploadImage from '../middlewares/uploadImage.js'
import { handleImageUpload } from '../controllers/uploadController.js'

const router = Router()

// Photo receive karo, aur galat type ya badi file ho to saaf error bhejo
function receiveImage(req, res, next) {
  uploadImage.single('image')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be under 5MB' : err.message
      return res.status(400).json({ success: false, message })
    }
    next()
  })
}

// Pehle login aur admin check, phir upload
router.post('/image', protect, authorize('admin'), receiveImage, handleImageUpload)

export default router