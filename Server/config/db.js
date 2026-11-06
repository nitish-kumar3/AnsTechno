import mongoose from 'mongoose'
import env from './env.js'

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri)
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

export default connectDB