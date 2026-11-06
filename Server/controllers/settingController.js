import Setting from '../models/Setting.js'

// Sirf ye fields badal sakte hain
const allowedFields = ['email', 'phone', 'whatsapp', 'address', 'hours', 'reply', 'mapQuery']

// Setting nikalo, na ho to default se bana do
async function getOrCreate() {
  let setting = await Setting.findOne()
  if (!setting) setting = await Setting.create({})
  return setting
}

// PUBLIC: contact info (site pe dikhane ke liye)
export const getSettings = async (req, res) => {
  try {
    const setting = await getOrCreate()
    res.json({ success: true, settings: setting })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: contact info badlo
export const updateSettings = async (req, res) => {
  try {
    const setting = await getOrCreate()

    // Body me se sirf allowed fields lo
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        setting[field] = String(req.body[field]).trim().slice(0, 200)
      }
    }

    await setting.save()
    res.json({ success: true, settings: setting })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}