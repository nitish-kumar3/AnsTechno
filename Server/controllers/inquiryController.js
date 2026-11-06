import Inquiry from '../models/Inquiry.js'
import Service from '../models/Service.js'
import { escapeHtml, sendMail } from '../utils/sendMail.js'

// PUBLIC: contact form se message (login nahi chahiye)
// export const createInquiry = async (req, res) => {
//   try {
//     // Form ka data nikalo
//     const name = String(req.body.name || '').trim().slice(0, 80)
//     const email = String(req.body.email || '').trim().toLowerCase()
//     const message = String(req.body.message || '').trim().slice(0, 1000)
//     let service = String(req.body.service || '').trim().slice(0, 100)

//     // Check karo
//     if (name.length < 2) {
//       return res.status(400).json({ success: false, message: 'Please enter your name' })
//     }
//     if (!/^\S+@\S+\.\S+$/.test(email)) {
//       return res.status(400).json({ success: false, message: 'Enter a valid email' })
//     }
//     if (message.length < 10) {
//       return res.status(400).json({ success: false, message: 'Please write at least 10 characters' })
//     }

//     // Service ka slug aaya ho to uska title nikal lo
//     if (service) {
//       const found = await Service.findOne({ slug: service })
//       if (found) service = found.title
//     }

//     // Pehle database me save
//     await Inquiry.create({ name, email, message, service })

//     // Phir tumhe email (fail ho jaye to bhi message save hai)
//     sendMail({
//       subject: `New message from ${name}`,
//       replyTo: email,
//       html: `
//         <h2>New message from website</h2>
//         <p><b>Name:</b> ${escapeHtml(name)}</p>
//         <p><b>Email:</b> ${escapeHtml(email)}</p>
//         ${service ? `<p><b>Service:</b> ${escapeHtml(service)}</p>` : ''}
//         <p><b>Message:</b></p>
//         <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
//       `,
//     })

//     res.status(201).json({ success: true, message: 'Message received' })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }


// PUBLIC: contact form, free call, estimator ya quiz se aaya lead (login nahi chahiye)
export const createInquiry = async (req, res) => {
  try {
    const type = ['call', 'estimate', 'quiz'].includes(req.body.type) ? req.body.type : 'message'
    const needsPhone = type !== 'message' // message ke alawa sabme phone chahiye

    // Form ka data nikalo
    const name = String(req.body.name || '').trim().slice(0, 80)
    const email = String(req.body.email || '').trim().toLowerCase()
    const phone = String(req.body.phone || '').trim().slice(0, 20)
    const preferredTime = String(req.body.preferredTime || '').trim().slice(0, 60)
    const details = String(req.body.details || '').trim().slice(0, 2000)
    let message = String(req.body.message || '').trim().slice(0, 1000)
    let service = String(req.body.service || '').trim().slice(0, 100)

    const bad = (text) => res.status(400).json({ success: false, message: text })

    // Check karo
    if (name.length < 2) return bad('Please enter your name')

    if (needsPhone) {
      if (phone.replace(/\D/g, '').length < 10) return bad('Enter a valid phone number')
      if (email && !/^\S+@\S+\.\S+$/.test(email)) return bad('Enter a valid email')
    } else {
      if (!/^\S+@\S+\.\S+$/.test(email)) return bad('Enter a valid email')
      if (message.length < 10) return bad('Please write at least 10 characters')
    }

    // Message ka text (message type me user ka likha hi rehta hai)
    if (type === 'call') {
      message = `Free call requested.${preferredTime ? ` Best time: ${preferredTime}.` : ''}`
    }
    if (type === 'estimate') message = 'Cost estimate request.'
    if (type === 'quiz') message = 'Online presence check completed.'

    // Service ka slug aaya ho to uska title nikal lo
    if (service) {
      const found = await Service.findOne({ slug: service })
      if (found) service = found.title
    }

    // Pehle database me save
    await Inquiry.create({
      type,
      name,
      email,
      phone: needsPhone ? phone : '',
      preferredTime: type === 'call' ? preferredTime : '',
      message,
      details: needsPhone ? details : '',
      service,
    })

    // Phir tumhe email (fail ho jaye to bhi lead save hai)
    const titles = {
      message: 'New message from website',
      call: 'Free call request',
      estimate: 'Cost estimate request',
      quiz: 'Online presence check',
    }
    sendMail({
      subject: `${titles[type]}: ${name}`,
      replyTo: email || undefined,
      html: `
        <h2>${titles[type]}</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        ${email ? `<p><b>Email:</b> ${escapeHtml(email)}</p>` : ''}
        ${needsPhone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ''}
        ${type === 'call' && preferredTime ? `<p><b>Best time:</b> ${escapeHtml(preferredTime)}</p>` : ''}
        ${service ? `<p><b>Service:</b> ${escapeHtml(service)}</p>` : ''}
        ${type === 'message' ? `<p><b>Message:</b></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>` : ''}
        ${details ? `<p><b>Details:</b></p><p style="white-space:pre-wrap">${escapeHtml(details)}</p>` : ''}
      `,
    })

    res.status(201).json({ success: true, message: 'Message received' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: messages ki list (?status=New  ?search=naam  ?page=1)
export const getInquiries = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = String(req.query.status)

    if (req.query.search) {
      // Special characters safe banao, phir naam ya email me dhundo
      const text = String(req.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(text, 'i')
      // filter.$or = [{ name: regex }, { email: regex }]
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }]
    }

    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 20, 100)

    const total = await Inquiry.countDocuments(filter)
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 }) // nayi pehle
      .skip((page - 1) * limit)
      .limit(limit)

    res.json({
      success: true,
      inquiries,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: ek message
export const getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, inquiry })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// ADMIN: status ya notes badlo
export const updateInquiry = async (req, res) => {
  try {
    const updates = {}
    if (req.body.status) updates.status = req.body.status
    if (req.body.notes !== undefined) updates.notes = String(req.body.notes).slice(0, 2000)

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, inquiry })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// ADMIN: message delete
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id)
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, message: 'Message deleted' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}