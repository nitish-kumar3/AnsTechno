// ye file admin ko create krne ke liye bna h
// npm run seed


import mongoose from 'mongoose'
import env from '../config/env.js'
import connectDB from '../config/db.js'
import User from '../models/User.js'

const run = async () => {
  const { name, email, password } = env.admin

  if (!email || !password) {
    console.error('Pehle .env me ADMIN_EMAIL aur ADMIN_PASSWORD daalo')
    process.exit(1)
  }

  await connectDB()

  const existing = await User.findOne({ email: email.toLowerCase() })

  if (existing) {
    if (existing.role === 'admin') {
      console.log('Admin already exists:', existing.email)
    } else {
      existing.role = 'admin'
      await existing.save()
      console.log('Existing user ko admin bana diya:', existing.email)
    }
  } else {
    await User.create({ name, email, password, role: 'admin' })
    console.log('Admin created:', email)
  }

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})