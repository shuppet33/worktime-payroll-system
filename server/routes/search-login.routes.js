import { Router } from 'express'
import { searchLoginController } from '../features/searchLogin/search-login.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const searchLoginRoutes = Router()

searchLoginRoutes.get(
    '/search',
    authMiddleware,
    searchLoginController.searchLogin,
)
