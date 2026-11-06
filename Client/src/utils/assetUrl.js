const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const origin = apiUrl.replace(/\/api\/?$/, '') // http://localhost:5000

export default function assetUrl(path) {
  if (!path) return ''

  // Cloudinary ki photo: auto format aur quality (WebP/AVIF, chhoti file size)
  if (path.includes('res.cloudinary.com') && path.includes('/upload/')) {
    return path.replace('/upload/', '/upload/f_auto,q_auto/')
  }

  // Server-local image uploads
  if (path.startsWith('/uploads/')) return origin + path

  return path
}