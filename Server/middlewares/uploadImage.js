import multer from 'multer'

// Sirf ye type chalenge (SVG nahi, wo risky hota hai)
const types = ['image/jpeg', 'image/png', 'image/webp']

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!types.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG or WebP images allowed'))
    }
    cb(null, true)
  },
})

export default uploadImage