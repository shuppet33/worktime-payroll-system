import { Router } from 'express'
import { companyController } from '../features/companies/companies.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const companiesRouter = Router()

companiesRouter.post('/create', authMiddleware, companyController.create)

companiesRouter.get('/', authMiddleware, companyController.getAll)

companiesRouter.get('/:companyId', authMiddleware, companyController.getById)

companiesRouter.patch('/:companyId', authMiddleware, companyController.update)

companiesRouter.delete('/:companyId', authMiddleware, companyController.delete)

companiesRouter.post(
    '/:companyId/invitations',
    authMiddleware,
    companyController.createInvitation,
)

companiesRouter.get(
    '/:companyId/invitations',
    authMiddleware,
    companyController.getAccessUsers,
)

companiesRouter.patch(
    '/:companyId/invitations/:invitationId/revoke',
    authMiddleware,
    companyController.revokeInvitation,
)

companiesRouter.get(
    '/:companyId/members',
    authMiddleware,
    companyController.getMembers,
)

companiesRouter.get(
    '/:companyId/employee/month',
    authMiddleware,
    companyController.getEmployeeMonth,
)

companiesRouter.get(
    '/:companyId/employees/:employeeId/work-logs',
    authMiddleware,
    companyController.getWorkLogs,
)

companiesRouter.post(
    '/:companyId/employees/:employeeId/work-logs',
    authMiddleware,
    companyController.createWorkLog,
)

companiesRouter.delete(
    '/:companyId/work-logs/:workLogId',
    authMiddleware,
    companyController.deleteWorkLog,
)

companiesRouter.get(
    '/:companyId/employees/:employeeId/bonuses',
    authMiddleware,
    companyController.getBonuses,
)

companiesRouter.post(
    '/:companyId/employees/:employeeId/bonuses',
    authMiddleware,
    companyController.createBonus,
)

companiesRouter.delete(
    '/:companyId/bonuses/:bonusId',
    authMiddleware,
    companyController.deleteBonus,
)

companiesRouter.post(
    '/:companyId/employees/:employeeId/payrolls/calculate',
    authMiddleware,
    companyController.calculatePayroll,
)

companiesRouter.get(
    '/:companyId/payrolls',
    authMiddleware,
    companyController.getCompanyPayrolls,
)

companiesRouter.get(
    '/:companyId/employees/:employeeId/payrolls',
    authMiddleware,
    companyController.getEmployeePayrolls,
)

companiesRouter.patch(
    '/:companyId/members/:memberId/role',
    authMiddleware,
    companyController.updateMemberRole,
)

companiesRouter.patch(
    '/:companyId/members/:memberId',
    authMiddleware,
    companyController.updateMemberRole,
)

companiesRouter.get(
    '/:companyId/users/search',
    authMiddleware,
    companyController.searchUsersForInvite,
)
companiesRouter.delete('/:companyId/members/:memberId', authMiddleware,companyController.deleteMember)
