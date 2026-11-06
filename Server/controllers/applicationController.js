// import fs from 'fs'
// import path from 'path'
// import Application from '../models/Application.js'
// import Opening from '../models/Opening.js'
// import { resumeDir } from '../middlewares/upload.js'
// import { escapeHtml, sendMail } from '../utils/sendMail.js'


// // Uploaded resume delete karne ka helper
// function removeFile(filename) {
//   if (!filename) return
//   fs.unlink(path.join(resumeDir, filename), () => {}) // error aaye to ignore
// }

// // Galti hone par: upload hui file hatao aur error bhejo
// function fail(res, file, message, code = 400) {
//   if (file) removeFile(file.filename)
//   return res.status(code).json({ success: false, message })
// }

// // PUBLIC: koi bhi apply kar sakta hai (login nahi chahiye)
// export const createApplication = async (req, res) => {
//   const file = req.file // resume (ho sakta hai na ho)

//   try {
//     // Form ka data nikalo
//     const name = String(req.body.name || '').trim().slice(0, 80)
//     const email = String(req.body.email || '').trim().toLowerCase()
//     const phone = String(req.body.phone || '').trim().slice(0, 20)
//     const currentStatus = String(req.body.status || '').trim()
//     const message = String(req.body.message || '').trim().slice(0, 1000)
//     const openingId = String(req.body.openingId || '').trim()

//     // Check karo
//     if (name.length < 2) return fail(res, file, 'Please enter your name')
//     if (!/^\S+@\S+\.\S+$/.test(email)) return fail(res, file, 'Enter a valid email')
//     if (phone.replace(/\D/g, '').length < 10) return fail(res, file, 'Enter a valid phone number')
//     if (!currentStatus) return fail(res, file, 'Please select your current status')

//     // Opening database se dhundo (user ke bheje title pe bharosa nahi)
//     let openingTitle = 'General Application'
//     let openingType = 'General'

//     if (openingId && openingId !== 'general') {
//       const opening = await Opening.findOne({ slug: openingId, isActive: true })
//       if (!opening) {
//         return fail(res, file, 'This opening is no longer available', 404)
//       }
//       openingTitle = opening.title
//       openingType = opening.type
//     }

//     // Job ke liye resume zaroori hai
//     if (openingType === 'Job' && !file) {
//       return fail(res, file, 'Please upload your resume')
//     }

//     await Application.create({
//       opening: openingId || 'general',
//       openingTitle,
//       openingType,
//       name,
//       email,
//       phone,
//       currentStatus,
//       message,
//       resumeFile: file ? file.filename : '',
//       resumeName: file ? file.originalname.slice(0, 150) : '',
//     })


//     // Tumhe email (fail ho jaye to bhi application save hai)
//     sendMail({
//       subject: `New application: ${openingTitle}`,
//       replyTo: email,
//       html: `
//         <h2>New application</h2>
//         <p><b>For:</b> ${escapeHtml(openingTitle)} (${escapeHtml(openingType)})</p>
//         <p><b>Name:</b> ${escapeHtml(name)}</p>
//         <p><b>Email:</b> ${escapeHtml(email)}</p>
//         <p><b>Phone:</b> ${escapeHtml(phone)}</p>
//         <p><b>Status:</b> ${escapeHtml(currentStatus)}</p>
//         ${message ? `<p><b>Message:</b></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>` : ''}
//         <p>Resume ${file ? 'attached hai, dashboard se download karo.' : 'nahi bheji.'}</p>
//       `,
//     })

//     res.status(201).json({ success: true, message: 'Application received' })
//   } catch (error) {
//     if (file) removeFile(file.filename)
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

// // ADMIN: applications ki list (?stage=New  ?type=Job  ?search=naam  ?page=1)
// export const getApplications = async (req, res) => {
//   try {
//     const filter = {}
//     if (req.query.stage) filter.stage = String(req.query.stage)
//     if (req.query.type) filter.openingType = String(req.query.type)

//     if (req.query.search) {
//       // Special characters ko safe banao, phir naam ya email me dhundo
//       const text = String(req.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
//       const regex = new RegExp(text, 'i')
//       filter.$or = [{ name: regex }, { email: regex }]
//     }

//     const page = Number(req.query.page) || 1
//     const limit = Math.min(Number(req.query.limit) || 20, 100)

//     const total = await Application.countDocuments(filter)
//     const applications = await Application.find(filter)
//       .sort({ createdAt: -1 }) // nayi pehle
//       .skip((page - 1) * limit)
//       .limit(limit)

//     res.json({
//       success: true,
//       applications,
//       total,
//       page,
//       pages: Math.ceil(total / limit),
//     })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

// // ADMIN: ek application
// export const getApplication = async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.id)
//     if (!application) {
//       return res.status(404).json({ success: false, message: 'Application not found' })
//     }
//     res.json({ success: true, application })
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message })
//   }
// }

// // ADMIN: stage ya notes badlo (sirf ye 2 cheezein badal sakte hain)
// export const updateApplication = async (req, res) => {
//   try {
//     const updates = {}
//     if (req.body.stage) updates.stage = req.body.stage
//     if (req.body.notes !== undefined) updates.notes = String(req.body.notes).slice(0, 2000)

//     const application = await Application.findByIdAndUpdate(req.params.id, updates, {
//       new: true,
//       runValidators: true,
//     })
//     if (!application) {
//       return res.status(404).json({ success: false, message: 'Application not found' })
//     }
//     res.json({ success: true, application })
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message })
//   }
// }

// // ADMIN: resume download
// export const downloadResume = async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.id)
//     if (!application || !application.resumeFile) {
//       return res.status(404).json({ success: false, message: 'Resume not found' })
//     }

//     const filePath = path.join(resumeDir, application.resumeFile)
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ success: false, message: 'File missing on server' })
//     }

//     res.download(filePath, application.resumeName || application.resumeFile)
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message })
//   }
// }

// // ADMIN: application delete (resume file bhi hat jati hai)
// export const deleteApplication = async (req, res) => {
//   try {
//     const application = await Application.findByIdAndDelete(req.params.id)
//     if (!application) {
//       return res.status(404).json({ success: false, message: 'Application not found' })
//     }
//     removeFile(application.resumeFile)
//     res.json({ success: true, message: 'Application deleted' })
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message })
//   }
// }




import path from 'path'
import mongoose from 'mongoose'
import Application from '../models/Application.js'
import Opening from '../models/Opening.js'
import ResumeFile from '../models/ResumeFile.js'
import { escapeHtml, sendMail } from '../utils/sendMail.js'

// File ke extension se type tay karte hain (user ke bheje type pe bharosa nahi)
const contentTypes = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const bad = (res, message, code = 400) =>
  res.status(code).json({ success: false, message })

// PUBLIC: koi bhi apply kar sakta hai (login nahi chahiye)
export const createApplication = async (req, res) => {
  const file = req.file // resume (ho sakta hai na ho)
  let resumeId = ''

  try {
    // Form ka data nikalo
    const name = String(req.body.name || '').trim().slice(0, 80)
    const email = String(req.body.email || '').trim().toLowerCase()
    const phone = String(req.body.phone || '').trim().slice(0, 20)
    const currentStatus = String(req.body.status || '').trim()
    const message = String(req.body.message || '').trim().slice(0, 1000)
    const openingId = String(req.body.openingId || '').trim()

    // Check karo
    if (name.length < 2) return bad(res, 'Please enter your name')
    if (!/^\S+@\S+\.\S+$/.test(email)) return bad(res, 'Enter a valid email')
    if (phone.replace(/\D/g, '').length < 10) return bad(res, 'Enter a valid phone number')
    if (!currentStatus) return bad(res, 'Please select your current status')

    // Opening database se dhundo (user ke bheje title pe bharosa nahi)
    let openingTitle = 'General Application'
    let openingType = 'General'

    if (openingId && openingId !== 'general') {
      const opening = await Opening.findOne({ slug: openingId, isActive: true })
      if (!opening) return bad(res, 'This opening is no longer available', 404)
      openingTitle = opening.title
      openingType = opening.type
    }

    // Job ke liye resume zaroori hai
    if (openingType === 'Job' && !file) return bad(res, 'Please upload your resume')

    // Resume database me save
    if (file) {
      const ext = path.extname(file.originalname).toLowerCase()
      const saved = await ResumeFile.create({
        name: file.originalname.slice(0, 150),
        contentType: contentTypes[ext] || 'application/octet-stream',
        data: file.buffer,
      })
      resumeId = String(saved._id)
    }

    await Application.create({
      opening: openingId || 'general',
      openingTitle,
      openingType,
      name,
      email,
      phone,
      currentStatus,
      message,
      resumeFile: resumeId,
      resumeName: file ? file.originalname.slice(0, 150) : '',
    })

    // Tumhe email (fail ho jaye to bhi application save hai)
    sendMail({
      subject: `New application: ${openingTitle}`,
      replyTo: email,
      html: `
        <h2>New application</h2>
        <p><b>For:</b> ${escapeHtml(openingTitle)} (${escapeHtml(openingType)})</p>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Phone:</b> ${escapeHtml(phone)}</p>
        <p><b>Status:</b> ${escapeHtml(currentStatus)}</p>
        ${message ? `<p><b>Message:</b></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>` : ''}
        <p>Resume ${file ? 'mili hai, dashboard se download karo.' : 'nahi bheji.'}</p>
      `,
    })

    res.status(201).json({ success: true, message: 'Application received' })
  } catch (error) {
    // Application save na hui to resume bhi hata do
    if (resumeId) ResumeFile.findByIdAndDelete(resumeId).catch(() => {})
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: applications ki list (?stage=New  ?type=Job  ?search=naam  ?page=1)
export const getApplications = async (req, res) => {
  try {
    const filter = {}
    if (req.query.stage) filter.stage = String(req.query.stage)
    if (req.query.type) filter.openingType = String(req.query.type)

    if (req.query.search) {
      // Special characters ko safe banao, phir naam ya email me dhundo
      const text = String(req.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(text, 'i')
      filter.$or = [{ name: regex }, { email: regex }]
    }

    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 20, 100)

    const total = await Application.countDocuments(filter)
    const applications = await Application.find(filter)
      .sort({ createdAt: -1 }) // nayi pehle
      .skip((page - 1) * limit)
      .limit(limit)

    res.json({
      success: true,
      applications,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: ek application
export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application) return bad(res, 'Application not found', 404)
    res.json({ success: true, application })
  } catch (error) {
    bad(res, error.message)
  }
}

// ADMIN: stage ya notes badlo (sirf ye 2 cheezein badal sakte hain)
export const updateApplication = async (req, res) => {
  try {
    const updates = {}
    if (req.body.stage) updates.stage = req.body.stage
    if (req.body.notes !== undefined) updates.notes = String(req.body.notes).slice(0, 2000)

    const application = await Application.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!application) return bad(res, 'Application not found', 404)
    res.json({ success: true, application })
  } catch (error) {
    bad(res, error.message)
  }
}

// ADMIN: resume download
export const downloadResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application || !application.resumeFile) return bad(res, 'Resume not found', 404)

    // Purani (disk wali) applications me resumeFile ek naam hota tha, id nahi
    if (!mongoose.isValidObjectId(application.resumeFile)) {
      return bad(res, 'Resume not available', 404)
    }

    const file = await ResumeFile.findById(application.resumeFile)
    if (!file) return bad(res, 'Resume file missing', 404)

    res.attachment(application.resumeName || file.name || 'resume') // download ka naam
    res.type(file.contentType)
    res.send(file.data)
  } catch (error) {
    bad(res, error.message)
  }
}

// ADMIN: application delete (resume bhi hat jati hai)
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id)
    if (!application) return bad(res, 'Application not found', 404)

    if (mongoose.isValidObjectId(application.resumeFile)) {
      await ResumeFile.findByIdAndDelete(application.resumeFile)
    }

    res.json({ success: true, message: 'Application deleted' })
  } catch (error) {
    bad(res, error.message)
  }
}