import cloudinary, { cloudinaryReady } from '../config/cloudinary.js'
import { saveImageLocally } from '../utils/imageStorage.js'

async function respondWithLocalImage(file, res) {
  try {
    const url = await saveImageLocally(file)
    return res.status(201).json({ success: true, url })
  } catch (error) {
    console.error('Local image save failed:', error)
    return res.status(500).json({
      success: false,
      message: 'Image server par save nahi ho payi. Server storage check karke dobara try karo.',
    })
  }
}

// Photo Cloudinary par bhejo aur uska address wapas do
export const handleImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please choose an image' })
  }

  if (!cloudinaryReady) {
    console.warn('Cloudinary is not configured; saving project image locally.')
    return respondWithLocalImage(req.file, res)
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'anstech/projects', resource_type: 'image' },
    (error, result) => {
      if (error || !result) {
        console.error('Cloudinary upload failed:', error)
        console.warn('Saving project image locally instead.')
        return respondWithLocalImage(req.file, res)
      }
      res.status(201).json({ success: true, url: result.secure_url })
    }
  )

  stream.end(req.file.buffer)
}