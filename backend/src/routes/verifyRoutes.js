import { Router } from 'express'
import { upload }  from '../middleware/upload.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import {
  verifyFashion,
  getHistory,
  getVerification,
} from '../controllers/verifyController.js'

const router = Router()

// POST /api/verify — anyone can verify (optional auth for saving history)
router.post('/', optionalAuth, upload.single('image'), verifyFashion)

// GET /api/verify/history — must be logged in
router.get('/history', requireAuth, getHistory)

// GET /api/verify/:id — get single verification
router.get('/:id', optionalAuth, getVerification)

export default router
