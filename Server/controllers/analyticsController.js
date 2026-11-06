import Visit from '../models/Visit.js'
import Application from '../models/Application.js'
import Inquiry from '../models/Inquiry.js'

const TZ = 'Asia/Kolkata' // din ka hisaab India time se
const DAY = 24 * 60 * 60 * 1000
const STAGES = ['New', 'Shortlisted', 'Interview', 'Hired', 'Rejected']

// Kisi bhi field ke hisaab se ginti nikalo (jaise page-wise, device-wise)
async function countBy(Model, field, match, limit = 8) {
  const rows = await Model.aggregate([
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ])
  return rows.map((r) => ({ label: r._id || '', count: r.count }))
}

// ADMIN: analytics (?days=7 ya 30 ya 90)
export const getAnalytics = async (req, res) => {
  try {
    let days = Number(req.query.days)
    if (![7, 30, 90].includes(days)) days = 30

    // Din ki list: ['2026-10-01', '2026-10-02', ...]
    const keys = []
    for (let i = days - 1; i >= 0; i--) {
      keys.push(new Date(Date.now() - i * DAY).toLocaleDateString('en-CA', { timeZone: TZ }))
    }

    const since = new Date(`${keys[0]}T00:00:00+05:30`) // period ki shuruaat
    const prevSince = new Date(since.getTime() - days * DAY) // usse pehle ka period

    const current = { createdAt: { $gte: since } }
    const previous = { createdAt: { $gte: prevSince, $lt: since } }

    // Visitors aur page views (is period aur pichhle period ke)
    const [views, visitorIds, prevViews, prevVisitorIds] = await Promise.all([
      Visit.countDocuments(current),
      Visit.distinct('visitorId', current),
      Visit.countDocuments(previous),
      Visit.distinct('visitorId', previous),
    ])

    // Din-ba-din traffic
    const daily = await Visit.aggregate([
      { $match: current },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TZ } },
          views: { $sum: 1 },
          visitors: { $addToSet: '$visitorId' },
        },
      },
    ])
    const byDay = {}
    daily.forEach((d) => {
      byDay[d._id] = { views: d.views, visitors: d.visitors.length }
    })
    const traffic = keys.map((date) => ({
      date,
      views: byDay[date]?.views || 0,
      visitors: byDay[date]?.visitors || 0,
    }))

    // Pages, devices, traffic sources
    const topPages = await countBy(Visit, 'path', current, 8)
    const devices = await countBy(Visit, 'device', current, 5)
    const referrers = (await countBy(Visit, 'referrer', current, 8)).map((r) => ({
      label: r.label || 'Direct',
      count: r.count,
    }))

    // Leads: kaun si service / opening ke liye aaye
    const [applications, inquiries] = await Promise.all([
      Application.countDocuments(current),
      Inquiry.countDocuments(current),
    ])

    const inquiriesByService = (await countBy(Inquiry, 'service', current, 8)).map((r) => ({
      label: r.label || 'General enquiry',
      count: r.count,
    }))
    const applicationsByOpening = await countBy(Application, 'openingTitle', current, 8)
    const applicationsByType = await countBy(Application, 'openingType', current, 5)

    // Pipeline: har stage me kitne
    const stageRows = await countBy(Application, 'stage', current, 10)
    const pipeline = STAGES.map((label) => ({
      label,
      count: stageRows.find((r) => r.label === label)?.count || 0,
    }))

    // Kitne visitors lead bane (percent)
    const visitors = visitorIds.length
    const conversion = visitors
      ? Math.round(((applications + inquiries) / visitors) * 1000) / 10
      : 0

    res.json({
      success: true,
      days,
      summary: {
        visitors,
        views,
        prevVisitors: prevVisitorIds.length,
        prevViews,
        applications,
        inquiries,
        conversion,
      },
      traffic,
      topPages,
      devices,
      referrers,
      inquiriesByService,
      applicationsByOpening,
      applicationsByType,
      pipeline,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}