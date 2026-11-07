import makeCrudRouter from '../utils/makeCrudRouter.js'
import Story from '../models/Story.js'

export default makeCrudRouter(Story, { imageField: 'image' })