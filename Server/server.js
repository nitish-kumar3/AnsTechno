import env from './config/env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import { protect } from './middlewares/auth.js'
import { authorize } from './middlewares/role.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import serviceRoutes from './routes/serviceRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import openingRoutes from './routes/openingRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import testimonialRoutes from './routes/testimonialRoutes.js'
import settingRoutes from './routes/settingRoutes.js'
import { getStats } from './controllers/statsController.js'
import trackRoutes from './routes/trackRoutes.js'
import { getAnalytics } from './controllers/analyticsController.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { imageDir } from './utils/imageStorage.js'
import certificateRoutes from './routes/certificateRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import impactRoutes from './routes/impactRoutes.js'
import storyRoutes from './routes/storyRoutes.js'
import credentialRoutes from './routes/credentialRoutes.js'
import postRoutes from './routes/postRoutes.js'
import postAdminRoutes from './routes/postAdminRoutes.js'
import talentRoutes from './routes/talentRoutes.js'
import shopRoutes from './routes/shopRoutes.js'
import shopAdminRoutes from './routes/shopAdminRoutes.js'
import announcementRoutes from './routes/announcementRoutes.js'
import proofRoutes from './routes/proofRoutes.js'


const app = express()

if (env.isProd) app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
if (!env.isProd) app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/openings', openingRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/settings', settingRoutes)
app.use('/api/track', trackRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/impact', impactRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/credentials', credentialRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/manage/posts', postAdminRoutes)
app.use('/api/talent', talentRoutes)
app.use('/api/shops', shopRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/proof', proofRoutes)
app.use('/api/manage/shops', shopAdminRoutes)



app.use(
  '/uploads/images',
  (_req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
  },
  express.static(imageDir, { maxAge: '30d' })
)


// Sirf test ke liye (role-based access check). Baad me hata denge
// app.get('/api/admin/ping', protect, authorize('admin'), (req, res) => {
//   res.json({ success: true, message: `Welcome admin ${req.user.name}` })
// })

app.get('/api/admin/stats', protect, authorize('admin'), getStats)
app.get('/api/admin/analytics', protect, authorize('admin'), getAnalytics)

app.use(notFound)
app.use(errorHandler)

connectDB().then(() => {
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`)
  })
})