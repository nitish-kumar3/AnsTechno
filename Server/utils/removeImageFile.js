import cloudinary, { cloudinaryReady } from '../config/cloudinary.js'

// Address se Cloudinary ka public_id nikalo
// .../upload/v123/anstech/projects/abc.webp  ->  anstech/projects/abc
function getPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i)
  return match ? match[1] : ''
}

export default function removeImageFile(url) {
  // Sirf Cloudinary ki photo hatayenge (/projects/x.png jaisi nahi)
  if (!url || !url.includes('res.cloudinary.com') || !cloudinaryReady) return

  const publicId = getPublicId(url)
  if (!publicId) return

  cloudinary.uploader.destroy(publicId).catch(() => {}) // error aaye to ignore
}