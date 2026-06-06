import { Router } from 'express'
import { companyController } from '../features/companies/companies.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const companiesRouter = Router()

companiesRouter.post('/create', authMiddleware, companyController.create)
