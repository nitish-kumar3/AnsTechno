import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import { authorize } from '../middlewares/role.js'
import removeImageFile from './removeImageFile.js'

// options.imageField = jis field me photo ka address hai (badalne ya delete par photo hat jaye)
export default function makeCrudRouter(Model, options = {}) {
  const { imageField } = options
  const router = Router()
  const sort = { order: 1, createdAt: -1 }
  const fail = (res, error, code = 400) =>
    res.status(code).json({ success: false, message: error.message })

  // SABKE LIYE: sirf wahi jo website par dikhane hain
  router.get('/', async (req, res) => {
    try {
      const items = await Model.find({ isActive: true }).sort(sort)
      res.json({ success: true, items })
    } catch (error) {
      fail(res, error, 500)
    }
  })

  // Isse neeche sab sirf admin ke liye
  router.use(protect, authorize('admin'))

  router.get('/admin/all', async (req, res) => {
    try {
      const items = await Model.find().sort(sort)
      res.json({ success: true, items })
    } catch (error) {
      fail(res, error, 500)
    }
  })

  router.post('/', async (req, res) => {
    try {
      const item = await Model.create(req.body)
      res.status(201).json({ success: true, item })
    } catch (error) {
      fail(res, error)
    }
  })

  router.put('/:id', async (req, res) => {
    try {
      const old = await Model.findById(req.params.id)
      if (!old) return res.status(404).json({ success: false, message: 'Not found' })
      const oldImage = imageField ? old[imageField] : ''

      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })

      // Photo badal gayi to purani hata do
      if (oldImage && oldImage !== item[imageField]) removeImageFile(oldImage)

      res.json({ success: true, item })
    } catch (error) {
      fail(res, error)
    }
  })

  router.delete('/:id', async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'Not found' })

      if (imageField) removeImageFile(item[imageField])

      res.json({ success: true, message: 'Deleted' })
    } catch (error) {
      fail(res, error)
    }
  })

  return router
}