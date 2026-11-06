// import fs from 'fs'
// import path from 'path'
// import multer from 'multer'

// // Resume yahan save hoga
// export const resumeDir = path.join(process.cwd(), 'uploads', 'resumes')
// fs.mkdirSync(resumeDir, { recursive: true }) // folder na ho to bana do

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, resumeDir),
//   // Naam random rakhte hain taaki koi file overwrite na ho
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase()
//     const random = Math.random().toString(36).slice(2, 10)
//     cb(null, `${Date.now()}-${random}${ext}`)
//   },
// })

// const allowed = ['.pdf', '.doc', '.docx']

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase()
//     if (!allowed.includes(ext)) {
//       return cb(new Error('Only PDF, DOC or DOCX allowed'))
//     }
//     cb(null, true)
//   },
// })

// export default upload




import path from 'path'
import multer from 'multer'

const allowed = ['.pdf', '.doc', '.docx']

const upload = multer({
  storage: multer.memoryStorage(), // file memory me aati hai, phir database me jati hai
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!allowed.includes(ext)) {
      return cb(new Error('Only PDF, DOC or DOCX allowed'))
    }
    cb(null, true)
  },
})

export default upload