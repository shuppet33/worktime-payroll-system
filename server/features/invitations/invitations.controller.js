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

            if (invitation.isUsed) {
                return res.status(400).json({
                    message: 'Приглашение уже использовано',
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

            const id = nanoid(8)

            const result = await invitationModel.acceptByToken({
                id,
                token,
                userId: req.user.id,
            })

            if (result.error === 'NOT_FOUND') {
                return res.status(404).json({
                    message: 'Приглашение не найдено',
                })
            }

            if (result.error === 'USED') {
                return res.status(400).json({
                    message: 'Приглашение уже использовано',
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
}
