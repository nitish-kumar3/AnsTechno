import Service from '../models/Service.js'
import Project from '../models/Project.js'
import Opening from '../models/Opening.js'
import Testimonial from '../models/Testimonial.js'
import Application from '../models/Application.js'
import Inquiry from '../models/Inquiry.js'

// ADMIN: dashboard ke numbers
export const getStats = async (req, res) => {
  try {
    // Sab counts ek saath
    const [
      services,
      projects,
      openings,
      testimonials,
      newApplications,
      totalApplications,
      newInquiries,
      totalInquiries,
    ] = await Promise.all([
      Service.countDocuments(),
      Project.countDocuments(),
      Opening.countDocuments({ isActive: true }),
      Testimonial.countDocuments(),
      Application.countDocuments({ stage: 'New' }),
      Application.countDocuments(),
      Inquiry.countDocuments({ status: 'New' }),
      Inquiry.countDocuments(),
    ])

    // Sabse nayi 5 applications aur 5 messages
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email openingTitle openingType stage createdAt')

    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email message service status createdAt')

    // Pichhle 14 din ki activity (chart ke liye)
    const days = 14
    const since = new Date()
    since.setHours(0, 0, 0, 0)
    since.setDate(since.getDate() - (days - 1))

    const apps = await Application.find({ createdAt: { $gte: since } }).select('createdAt')
    const inqs = await Inquiry.find({ createdAt: { $gte: since } }).select('createdAt')

    const activity = []
    for (let i = 0; i < days; i++) {
      const day = new Date(since)
      day.setDate(since.getDate() + i)
      const key = day.toDateString()

      activity.push({
        date: day,
        applications: apps.filter((a) => a.createdAt.toDateString() === key).length,
        inquiries: inqs.filter((q) => q.createdAt.toDateString() === key).length,
      })
    }

    res.json({
      success: true,
      counts: {
        services,
        projects,
        openings,
        testimonials,
        newApplications,
        totalApplications,
        newInquiries,
        totalInquiries,
      },
      recentApplications,
      recentInquiries,
      activity,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}