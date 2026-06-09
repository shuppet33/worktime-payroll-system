import { companyModel } from './companies.model.js'
import { invitationModel } from '../invitations/invitations.model.js'
import { userModel } from '../auth/users.model.js'
import { nanoid } from 'nanoid'

const canViewEmployeeData = (access, userId) => {
    return (
        access.requesterRole === 'OWNER' ||
        access.requesterRole === 'ACCOUNTANT' ||
        access.employeeUserId === userId
    )
}

const canManageEmployeeData = (access) => {
    return access.requesterRole === 'OWNER' || access.requesterRole === 'ACCOUNTANT'
}

const toMoney = (value) => {
    return Math.round(Number(value || 0) * 100) / 100
}

export const companyController = {
    async create(req, res) {
        try {
            const { name } = req.body

            const normalizedName = typeof name === 'string' ? name.trim() : ''

            if (!normalizedName) {
                return res.status(400).json({
                    message: 'Название компании обязательно',
                })
            }

            const companyId = nanoid(8)

            const company = await companyModel.createWithOwner({
                companyId,
                name: normalizedName,
                ownerId: req.user.id,
            })

            return res.status(201).json({
                company,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка создания компании',
            })
        }
    },

    async getAll(req, res) {
        try {
            const companies = await companyModel.getUserCompanies(req.user.id)

            return res.status(200).json(companies)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка получения компаний',
            })
        }
    },

    async getById(req, res) {
        try {
            const { companyId } = req.params

            if (!companyId) {
                return res.status(400).json({
                    message: 'companyId обязателен',
                })
            }

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            return res.status(200).json(company)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка получения компании',
            })
        }
    },

    async update(req, res) {
        try {
            const { companyId } = req.params
            const { name } = req.body

            const normalizedName = typeof name === 'string' ? name.trim() : ''

            if (!normalizedName) {
                return res.status(400).json({
                    message: 'Название компании обязательно',
                })
            }

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            if (company.role !== 'OWNER') {
                return res.status(403).json({
                    message: 'Недостаточно прав',
                })
            }

            const updated = await companyModel.updateCompanyName({
                companyId,
                name: normalizedName,
            })

            return res.status(200).json(updated)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка обновления компании',
            })
        }
    },

    async delete(req, res) {
        try {
            const { companyId } = req.params

            if (!companyId) {
                return res.status(400).json({
                    message: 'companyId обязателен',
                })
            }

            const result = await companyModel.deleteCompany({
                companyId,
                userId: req.user.id,
            })

            if (!result) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            return res.status(200).json({
                message: 'Компания удалена',
                companyId: result.companyId,
            })
        } catch (error) {
            console.error(error)

            if (error.message === 'FORBIDDEN') {
                return res.status(403).json({
                    message: 'Недостаточно прав (только OWNER)',
                })
            }

            return res.status(500).json({
                message: 'Ошибка удаления компании',
            })
        }
    },

    async getMembers(req, res) {
        try {
            const { companyId } = req.params

            const members = await companyModel.getCompanyMembers({
                companyId,
                userId: req.user.id,
            })

            if (!members) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            return res.status(200).json(members)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка получения участников',
            })
        }
    },

    async getEmployeeMonth(req, res) {
        try {
            const { companyId } = req.params
            const month = Number(req.query.month)
            const year = Number(req.query.year)

            if (!companyId) {
                return res.status(400).json({
                    message: 'companyId is required',
                })
            }

            if (!Number.isInteger(month) || month < 1 || month > 12) {
                return res.status(400).json({
                    message: 'month must be an integer from 1 to 12',
                })
            }

            if (!Number.isInteger(year) || year < 2000 || year > 2100) {
                return res.status(400).json({
                    message: 'year must be an integer from 2000 to 2100',
                })
            }

            const result = await companyModel.getEmployeeMonth({
                companyId,
                userId: req.user.id,
                month,
                year,
            })

            if (!result) {
                return res.status(404).json({
                    message: 'Company not found or access denied',
                })
            }

            return res.status(200).json(result)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to load employee calendar',
            })
        }
    },

    async getWorkLogs(req, res) {
        try {
            const { companyId, employeeId } = req.params
            const month = req.query.month ? Number(req.query.month) : undefined
            const year = req.query.year ? Number(req.query.year) : undefined
            const access = await companyModel.getEmployeeAccess({
                companyId,
                employeeId,
                userId: req.user.id,
            })

            if (!access) {
                return res.status(404).json({ message: 'Employee not found' })
            }

            if (!canViewEmployeeData(access, req.user.id)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            const workLogs = await companyModel.getWorkLogs({
                employeeId,
                month,
                year,
            })

            return res.status(200).json(workLogs)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to load work logs',
            })
        }
    },

    async createWorkLog(req, res) {
        try {
            const { companyId, employeeId } = req.params
            const { workDate, hoursWorked, overtimeHours = 0 } = req.body
            const access = await companyModel.getEmployeeAccess({
                companyId,
                employeeId,
                userId: req.user.id,
            })

            if (!access) {
                return res.status(404).json({ message: 'Employee not found' })
            }

            if (!canManageEmployeeData(access)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            if (!workDate || Number(hoursWorked) < 0 || Number(overtimeHours) < 0) {
                return res.status(400).json({ message: 'Invalid work log data' })
            }

            const workLog = await companyModel.createWorkLog({
                id: nanoid(8),
                employeeId,
                workDate,
                hoursWorked: Number(hoursWorked),
                overtimeHours: Number(overtimeHours),
            })

            return res.status(201).json(workLog)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to create work log',
            })
        }
    },

    async deleteWorkLog(req, res) {
        try {
            const { companyId, workLogId } = req.params
            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({ message: 'Company not found' })
            }

            if (!['OWNER', 'ACCOUNTANT'].includes(company.role)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            const result = await companyModel.deleteWorkLog({
                companyId,
                workLogId,
            })

            if (!result) {
                return res.status(404).json({ message: 'Work log not found' })
            }

            return res.status(200).json(result)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to delete work log',
            })
        }
    },

    async getBonuses(req, res) {
        try {
            const { companyId, employeeId } = req.params
            const access = await companyModel.getEmployeeAccess({
                companyId,
                employeeId,
                userId: req.user.id,
            })

            if (!access) {
                return res.status(404).json({ message: 'Employee not found' })
            }

            if (!canViewEmployeeData(access, req.user.id)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            const bonuses = await companyModel.getBonuses({ employeeId })

            return res.status(200).json(bonuses)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to load bonuses',
            })
        }
    },

    async createBonus(req, res) {
        try {
            const { companyId, employeeId } = req.params
            const { amount, description } = req.body
            const access = await companyModel.getEmployeeAccess({
                companyId,
                employeeId,
                userId: req.user.id,
            })

            if (!access) {
                return res.status(404).json({ message: 'Employee not found' })
            }

            if (!canManageEmployeeData(access)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            if (Number(amount) <= 0) {
                return res.status(400).json({ message: 'Invalid bonus amount' })
            }

            const bonus = await companyModel.createBonus({
                id: nanoid(8),
                employeeId,
                amount: Number(amount),
                description: typeof description === 'string' ? description : '',
            })

            return res.status(201).json(bonus)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to create bonus',
            })
        }
    },

    async deleteBonus(req, res) {
        try {
            const { companyId, bonusId } = req.params
            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({ message: 'Company not found' })
            }

            if (!['OWNER', 'ACCOUNTANT'].includes(company.role)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            const result = await companyModel.deleteBonus({
                companyId,
                bonusId,
            })

            if (!result) {
                return res.status(404).json({ message: 'Bonus not found' })
            }

            return res.status(200).json(result)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to delete bonus',
            })
        }
    },

    async calculatePayroll(req, res) {
        try {
            const { companyId, employeeId } = req.params
            const month = Number(req.body.month)
            const year = Number(req.body.year)
            const access = await companyModel.getEmployeeAccess({
                companyId,
                employeeId,
                userId: req.user.id,
            })

            if (!access) {
                return res.status(404).json({ message: 'Employee not found' })
            }

            if (!canManageEmployeeData(access)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            if (!Number.isInteger(month) || month < 1 || month > 12) {
                return res.status(400).json({ message: 'Invalid month' })
            }

            if (!Number.isInteger(year) || year < 2000 || year > 2100) {
                return res.status(400).json({ message: 'Invalid year' })
            }

            const input = await companyModel.getEmployeePayrollInput({
                companyId,
                employeeId,
                month,
                year,
            })

            if (!input) {
                return res.status(404).json({ message: 'Employee not found' })
            }

            const hourlyRate = Number(input.hourlyRate || 0)
            const baseSalary =
                input.paymentType === 'FIXED'
                    ? Number(input.fixedSalary || 0)
                    : Number(input.hoursWorked || 0) * hourlyRate
            const overtimePayment = Number(input.overtimeHours || 0) * hourlyRate * 1.5
            const bonusPayment = Number(input.bonusPayment || 0)
            const grossSalary = baseSalary + overtimePayment + bonusPayment
            const ndflAmount = grossSalary * 0.13
            const finalSalary = grossSalary - ndflAmount

            const payroll = await companyModel.createPayroll({
                id: nanoid(8),
                employeeId,
                month,
                year,
                paymentType: input.paymentType,
                baseSalary: toMoney(baseSalary),
                overtimePayment: toMoney(overtimePayment),
                bonusPayment: toMoney(bonusPayment),
                ndflAmount: toMoney(ndflAmount),
                finalSalary: toMoney(finalSalary),
            })

            return res.status(201).json(payroll)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to calculate payroll',
            })
        }
    },

    async getCompanyPayrolls(req, res) {
        try {
            const { companyId } = req.params

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({ message: 'Company not found' })
            }

            if (!['OWNER', 'ACCOUNTANT'].includes(company.role)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            const payrolls = await companyModel.getCompanyPayrolls({ companyId })

            return res.status(200).json(payrolls)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to load payrolls',
            })
        }
    },

    async getEmployeePayrolls(req, res) {
        try {
            const { companyId, employeeId } = req.params
            const access = await companyModel.getEmployeeAccess({
                companyId,
                employeeId,
                userId: req.user.id,
            })

            if (!access) {
                return res.status(404).json({ message: 'Employee not found' })
            }

            if (!canViewEmployeeData(access, req.user.id)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            const payrolls = await companyModel.getEmployeePayrolls({
                employeeId,
            })

            return res.status(200).json(payrolls)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to load employee payrolls',
            })
        }
    },

    async updateMemberRole(req, res) {
        try {
            const { companyId, memberId } = req.params
            const { role } = req.body

            if (!role) {
                return res.status(400).json({
                    message: 'поле role обязательно',
                })
            }

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            if (company.role !== 'OWNER') {
                return res.status(403).json({
                    message: 'Недостаточно прав',
                })
            }

            const member = await companyModel.updateMemberRole({
                companyId,
                memberId,
                role,
            })

            if (!member) {
                return res.status(404).json({
                    message: 'Участник не найден',
                })
            }

            return res.status(200).json(member)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка изменения роли',
            })
        }
    },

    async deleteMember(req, res) {
        try {
            const { companyId, memberId } = req.params

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            if (company.role !== 'OWNER') {
                return res.status(403).json({
                    message: 'Недостаточно прав',
                })
            }

            const memberToDelete = await companyModel.getMemberById({
                companyId,
                memberId,
            })

            if (!memberToDelete) {
                return res.status(404).json({
                    message: 'Участник не найден',
                })
            }

            if (memberToDelete.role === 'OWNER') {
                return res.status(400).json({
                    message: 'Нельзя удалить владельца компании',
                })
            }

            const deletedMember = await companyModel.deleteMember({
                companyId,
                memberId,
            })

            return res.status(200).json({
                message: 'Участник удалён',
                member: deletedMember,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка удаления участника',
            })
        }
    },

    async getAccessUsers(req, res) {
        try {
            const { companyId } = req.params

            const users = await companyModel.getCompanyAccessUsers({
                companyId,
                userId: req.user.id,
            })

            if (!users) {
                return res.status(404).json({
                    message: 'РљРѕРјРїР°РЅРёСЏ РЅРµ РЅР°Р№РґРµРЅР° РёР»Рё РЅРµС‚ РґРѕСЃС‚СѓРїР°',
                })
            }

            return res.status(200).json(users)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'РћС€РёР±РєР° РїРѕР»СѓС‡РµРЅРёСЏ РґРѕСЃС‚СѓРїРѕРІ',
            })
        }
    },

    async createInvitation(req, res) {
        try {
            const { companyId } = req.params
            const { role, userId } = req.body

            const allowedInvitationRoles = ['EMPLOYEE', 'ACCOUNTANT']

            if (!companyId) {
                return res.status(400).json({
                    message: 'companyId обязателен',
                })
            }

            if (!role) {
                return res.status(400).json({
                    message: 'поле role обязательно',
                })
            }

            if (!userId) {
                return res.status(400).json({
                    message: 'поле userId обязательно',
                })
            }

            if (!allowedInvitationRoles.includes(role)) {
                return res.status(400).json({
                    message: 'role должен быть EMPLOYEE или ACCOUNTANT',
                })
            }

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            if (company.role !== 'OWNER') {
                return res.status(403).json({
                    message: 'Недостаточно прав',
                })
            }

            const invitedUser = await userModel.getById(userId)

            if (!invitedUser) {
                return res.status(404).json({
                    message: 'Пользователь не найден',
                })
            }

            const member = await companyModel.getMemberById({
                companyId,
                memberId: userId,
            })

            if (member) {
                return res.status(409).json({
                    message: 'Пользователь уже состоит в этой компании',
                })
            }

            const hasActiveInvite = await invitationModel.hasActiveInvite(
                companyId,
                userId,
            )

            if (hasActiveInvite) {
                return res.status(409).json({
                    message: 'Пользователю уже отправлено активное приглашение',
                })
            }

            const invitationId = nanoid(8)
            const token = nanoid(32)
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + 7)

            const invitation = await companyModel.createInvitation({
                id: invitationId,
                token,
                companyId,
                userId,
                role,
                createdBy: req.user.id,
                expiresAt,
            })

            return res.status(201).json({
                ...invitation,
                inviteLink: `/invite/${invitation.token}`,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка создания приглашения',
            })
        }
    },

    async searchUsersForInvite(req, res) {
        try {
            const { companyId } = req.params
            const { q } = req.query

            const normalizedQuery = typeof q === 'string' ? q.trim() : ''

            if (!normalizedQuery) {
                return res.status(400).json({
                    message: 'q обязателен',
                })
            }

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            const result = await companyModel.searchUsersForInvite({
                companyId,
                query: normalizedQuery,
            })

            return res.json(result)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка поиска пользователей',
            })
        }
    },

    async revokeInvitation(req, res) {
        try {
            const { companyId, invitationId } = req.params

            if (!invitationId) {
                return res.status(400).json({
                    message: 'invitationId обязателен',
                })
            }

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            if (company.role !== 'OWNER') {
                return res.status(403).json({
                    message: 'Недостаточно прав',
                })
            }

            const invitation = await companyModel.getInvitationById({
                companyId,
                invitationId,
            })

            if (!invitation) {
                return res.status(404).json({
                    message: 'Приглашение не найдено',
                })
            }

            if (invitation.status !== 'PENDING') {
                return res.status(409).json({
                    message: 'Можно отозвать только активное приглашение',
                    status: invitation.status,
                })
            }

            const revokedInvitation = await companyModel.revokeInvitation({
                companyId,
                invitationId,
            })

            return res.status(200).json({
                message: 'Приглашение отозвано',
                invitation: revokedInvitation,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка отзыва приглашения',
            })
        }
    },

}
