import { Router } from 'express'
import { companyController } from '../features/companies/companies.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const companiesRouter = Router()

companiesRouter.post('/create', authMiddleware, companyController.create)

companiesRouter.get('/', authMiddleware, companyController.getAll)

companiesRouter.get('/:companyId', authMiddleware, companyController.getById)

companiesRouter.patch('/:companyId', authMiddleware, companyController.update)

companiesRouter.delete('/:companyId', authMiddleware, companyController.delete)

companiesRouter.get(
    '/:companyId/members',
    authMiddleware,
    companyController.getMembers,
)

companiesRouter.patch(
    '/:companyId/members/:memberId',
    authMiddleware,
    companyController.updateMemberRole,
)
