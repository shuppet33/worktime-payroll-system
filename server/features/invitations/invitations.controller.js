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

            if (invitation.status === 'ACCEPTED') {
                return res.status(400).json({
                    message: 'Приглашение уже использовано',
                })
            }

            if (invitation.status === 'DECLINED') {
                return res.status(400).json({
                    message: 'Приглашение отклонено',
                })
            }

            if (invitation.status === 'REVOKED') {
                return res.status(400).json({
                    message: 'Приглашение отозвано',
                })
            }

            if (invitation.status === 'EXPIRED') {
                return res.status(400).json({
                    message: 'Срок приглашения истёк',
                })
            }

            if (new Date(invitation.expiresAt).getTime() <= Date.now()) {
                return res.status(400).json({
                    message: 'Срок приглашения истёк',
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
                    message: 'Приглашение уже использовано',
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

            // if (result.error === 'FORBIDDEN_USER') {
            //     return res.status(403).json({
            //         message: 'Приглашение создано для другого пользователя',
            //     })
            // }

            if (result.error === 'ALREADY_MEMBER') {
                return res.status(409).json({
                    message: 'Пользователь уже состоит в этой компании',
                })
            }

            return res.status(201).json({
                message: 'Приглашение принято',
                company: result.company,
                member: result.member,
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

            const result = await invitationModel.declineByToken({
                token,
            })

            if (result.error === 'NOT_FOUND') {
                return res.status(404).json({
                    message: 'Приглашение не найдено',
                })
            }

            if (result.error === 'ACCEPTED') {
                return res.status(400).json({
                    message: 'Приглашение уже использовано',
                })
            }

            if (result.error === 'DECLINED') {
                return res.status(400).json({
                    message: 'Приглашение уже отклонено',
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

            // if (result.error === 'FORBIDDEN_USER') {
            //     return res.status(403).json({
            //         message: 'Приглашение создано для другого пользователя',
            //     })
            // }

            return res.status(200).json({
                message: 'Приглашение отклонено',
                invitation: result.invitation,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка отклонения приглашения',
            })
        }
    },
}
