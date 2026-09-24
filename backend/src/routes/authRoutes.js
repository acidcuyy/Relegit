import { Router } from 'express'
import { register, login, me, updateProfile } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { upload }      from '../middleware/upload.js'

const router = Router()

router.post('/register', register)
router.post('/login',    login)
router.get('/me',        requireAuth, me)
router.put('/profile',   requireAuth, upload.single('avatar'), updateProfile)
router.post('/avatar',   requireAuth, upload.single('avatar'), updateProfile)

export default router

