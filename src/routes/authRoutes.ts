import { Router } from 'express'

import { register, login, getProfile } from '../Controllers/authControllers'
import { authenticate } from '../middleware/auth'
import { loginValidator, signupValidator, validate } from '../utils/validators'

const router = Router()

router.post('/register', validate(signupValidator), register)
router.post('/login', validate(loginValidator), login)
router.get('/me', authenticate, getProfile)

export default router
