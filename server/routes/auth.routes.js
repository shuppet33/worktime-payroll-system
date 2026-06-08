import { Router } from 'express'
import { authController } from '../features/auth/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const authRouter = Router()

authRouter.post('/register', authController.register)

authRouter.post('/login', authController.login)

authRouter.post('/logout', authMiddleware, authController.logout)

authRouter.get('/me', authMiddleware, authController.me)

authRouter.get('/check-login', authController.checkLogin)
