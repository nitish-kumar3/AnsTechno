// first time data add krne ke liye ye file bna h dashboard se add krne me time lg jata is liye
// npm run seed:content
// Terminal me 10 “Service added” aur 6 “Project added” aane chahiye.

// Agar Unexpected token 'export' jaisa error aaye, to client/package.json me "type": "module" nahi hai. Wo add kar do.



import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Service from '../models/Service.js'
import Project from '../models/Project.js'
// Data seedha frontend ki files se aa raha hai
import { services } from '../../client/src/data/services.js'
import { projects } from '../../client/src/data/projects.js'
import Opening from '../models/Opening.js'
import { openings } from '../../client/src/data/careers.js'


async function run() {
  await connectDB()

  // Services
  let order = 0
  for (const item of services) {
    const { id, ...rest } = item // frontend ka 'id' hamara 'slug' hai
    const exists = await Service.findOne({ slug: id })
    if (!exists) {
      await Service.create({ ...rest, slug: id, order })
      console.log('Service added:', item.title)
    }
    order++
  }

  // Projects
  order = 0
  for (const item of projects) {
    const { id, ...rest } = item
    const exists = await Project.findOne({ slug: id })
    if (!exists) {
      await Project.create({ ...rest, slug: id, order })
      console.log('Project added:', item.title)
    }
    order++
  }

    // Openings (jobs aur internships)
  order = 0
  for (const item of openings) {
    const { id, ...rest } = item
    const exists = await Opening.findOne({ slug: id })
    if (!exists) {
      await Opening.create({ ...rest, slug: id, order })
      console.log('Opening added:', item.title)
    }
    order++
  }

  await mongoose.disconnect()
  console.log('Done')
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})