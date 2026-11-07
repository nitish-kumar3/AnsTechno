import { Router } from 'express'
import { getProof } from '../controllers/proofController.js'

const router = Router()

router.get('/', getProof)

export default router