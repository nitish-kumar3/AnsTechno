import Project from '../models/Project.js'
import makeSlug from '../utils/makeSlug.js'
import removeImageFile from '../utils/removeImageFile.js'

function sendError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: 'Is slug ka project pehle se hai' })
  }
  res.status(400).json({ success: false, message: error.message })
}

// PUBLIC: site pe dikhne wale projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true }).sort({ order: 1, createdAt: 1 })
    res.json({ success: true, projects })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PUBLIC: ek project slug se
export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isActive: true })
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    res.json({ success: true, project })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: saare projects
export const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: 1 })
    res.json({ success: true, projects })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN: naya project add
export const createProject = async (req, res) => {
  try {
    const data = req.body
    if (!data.slug && data.title) {
      data.slug = makeSlug(data.title)
    }
    const project = await Project.create(data)
    res.status(201).json({ success: true, project })
  } catch (error) {
    sendError(res, error)
  }
}

// // ADMIN: project edit
// export const updateProject = async (req, res) => {
//   try {
//     const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     })
//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found' })
//     }
//     res.json({ success: true, project })
//   } catch (error) {
//     sendError(res, error)
//   }
// }



// ADMIN: project edit
export const updateProject = async (req, res) => {
  try {
    const old = await Project.findById(req.params.id)
    if (!old) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    const oldImage = old.image

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    // Photo badal gayi ho to purani file hata do
    if (oldImage && oldImage !== project.image) removeImageFile(oldImage)

    res.json({ success: true, project })
  } catch (error) {
    sendError(res, error)
  }
}







// ADMIN: project delete
// export const deleteProject = async (req, res) => {
//   try {
//     const project = await Project.findByIdAndDelete(req.params.id)
//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found' })
//     }
//     res.json({ success: true, message: 'Project deleted' })
//   } catch (error) {
//     sendError(res, error)
//   }
// }


// ADMIN: project delete
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    removeImageFile(project.image) // uski photo bhi hata do

    res.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    sendError(res, error)
  }
}