import { v2 as cloudinary } from 'cloudinary'
import env from './env.js'

cloudinary.config({
  cloud_name: env.cloudinary.name,
  api_key: env.cloudinary.key,
  api_secret: env.cloudinary.secret,
  secure: true,
})

// Teeno keys .env me hain ya nahi
export const cloudinaryReady = Boolean(
  env.cloudinary.name && env.cloudinary.key && env.cloudinary.secret
)

export default cloudinary