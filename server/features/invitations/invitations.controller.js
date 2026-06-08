import { invitationModel } from './invitations.model.js'
import { nanoid } from 'nanoid'

export const invitationController = {
    async getByToken(req, res) {
        try {
            const { token } = req.params

            if (!token) {
                return res.status(400).json({
                    message: 'token обязателен',
                })
            }

            const invitation = await invitationModel.getByToken(token)

            if (!invitation) {
                return res.status(404).json({
                    message: 'Приглашение не найдено',
                })
            }

            if (invitation.status === 'EXPIRED') {
                return res.status(200).json({
                    status: 'EXPIRED',
                })
            }

            if (invitation.status === 'ACCEPTED') {
                return res.status(200).json({
                    status: 'ACCEPTED',
                })
            }

            if (invitation.status === 'DECLINED') {
                return res.status(200).json({
                    status: 'DECLINED',
                })
            }

            if (invitation.status === 'REVOKED') {
                return res.status(200).json({
                    status: 'REVOKED',
                })
            }

            const isExpired =
                new Date(invitation.expiresAt).getTime() <= Date.now()

            if (isExpired) {
                await invitationModel.updateStatus(
                    invitation.id,
                    'EXPIRED',
                )

                return res.status(200).json({
                    status: 'EXPIRED',
                })
            }

            return res.status(200).json({
                companyId: invitation.companyId,
                companyName: invitation.companyName,
                role: invitation.role,
                status: invitation.status,
                expiresAt: invitation.expiresAt,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка получения приглашения',
            })
        }
    },

    async accept(req, res) {
        try {
            const { token } = req.params

            if (!token) {
                return res.status(400).json({
                    message: 'token обязателен',
                })
            }

            const companyMemberId = nanoid(8)

            const result = await invitationModel.acceptByToken({
                companyMemberId,
                token,
                userId: req.user.id,
            })

            if (result.error === 'NOT_FOUND') {
                return res.status(404).json({
                    message: 'Приглашение не найдено',
                })
            }

            if (result.error === 'ACCEPTED') {
                return res.status(400).json({
                    message: 'Приглашение уже принято',
                })
            }

            if (result.error === 'DECLINED') {
                return res.status(400).json({
                    message: 'Приглашение отклонено',
                })
            }

            if (result.error === 'REVOKED') {
                return res.status(400).json({
                    message: 'Приглашение отозвано',
                })
            }

            if (result.error === 'EXPIRED') {
                return res.status(400).json({
                    message: 'Срок приглашения истёк',
                })
            }

            if (result.error === 'ALREADY_MEMBER') {
                return res.status(409).json({
                    message: 'Пользователь уже состоит в этой компании',
                })
            }

            return res.status(201).json({
                companyId: result.companyId,
                message: 'Приглашение принято',
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка принятия приглашения',
            })
        }
    },

    async decline(req, res) {
        try {
            const { token } = req.params

            if (!token) {
                return res.status(400).json({
                    message: 'token обязателен',
                })
            }

            const invitation = await invitationModel.getByToken(token)

            if (!invitation) {
                return res.status(404).json({
                    message: 'Приглашение не найдено',
                })
            }

            if (invitation.status !== 'PENDING') {
                return res.status(400).json({
                    message: 'Приглашение уже не активно',
                    status: invitation.status,
                })
            }

            await invitationModel.declineByToken(token)

            return res.status(200).json({
                message: 'Приглашение отклонено',
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка отклонения приглашения',
            })
        }
    },

    async revoke(req, res) {
        try {
            const { id } = req.params

            if (!id) {
                return res.status(400).json({
                    message: 'id обязателен',
                })
            }

            const invitation = await invitationModel.getById(id)

            if (!invitation) {
                return res.status(404).json({
                    message: 'Приглашение не найдено',
                })
            }

            if (invitation.status !== 'PENDING') {
                return res.status(400).json({
                    message: 'Приглашение уже не активно',
                    status: invitation.status,
                })
            }

            const hasAccess = await invitationModel.canRevoke({
                companyId: invitation.companyId,
                userId: req.user.id,
            })

            if (!hasAccess) {
                return res.status(403).json({
                    message: 'Нет прав на отзыв приглашения',
                })
            }

            await invitationModel.revokeById(id)

            return res.status(200).json({
                message: 'Приглашение отозвано',
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка отзыва приглашения',
            })
        }
    },
}
