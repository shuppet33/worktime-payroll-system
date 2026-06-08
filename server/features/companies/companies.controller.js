import { companyModel } from './companies.model.js'
import { invitationModel } from '../invitations/invitations.model.js'
import { userModel } from '../auth/users.model.js'
import { nanoid } from 'nanoid'

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

    async createInvitation(req, res) {
        try {
            const { companyId } = req.params
            const { role, userId } = req.body

            const allowedCreatorRoles = ['OWNER', 'ACCOUNTANT']
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

            if (!allowedCreatorRoles.includes(company.role)) {
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
            const allowedCreatorRoles = ['OWNER', 'ACCOUNTANT']

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

            if (!allowedCreatorRoles.includes(company.role)) {
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
