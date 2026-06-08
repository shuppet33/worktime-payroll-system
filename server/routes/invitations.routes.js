import { Router } from 'express'
import { invitationController } from '../features/invitations/invitations.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const invitationsRouter = Router()

invitationsRouter.post(
    '/:token/accept',
    authMiddleware,
    invitationController.accept,
)

invitationsRouter.post(
    '/:token/decline',
    authMiddleware,
    invitationController.decline,
)

invitationsRouter.get(
    '/:token',
    invitationController.getByToken,
)

invitationsRouter.post(
    '/:token/decline',
    authMiddleware,
    invitationController.decline,
)

invitationsRouter.post(
    '/:id/revoke',
    authMiddleware,
    invitationController.revoke,
)
