import {
    reatomAsync,
    withDataAtom,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { tokenAtom } from '$entities/auth.ts'

import {
    acceptInvitation,
    declineInvitation,
    getInvitation,
} from '$shared/invitation/invitation.ts'

export const getInvitationAsync = reatomAsync(async (ctx, token: string) => {
    return ctx.schedule(() => getInvitation(token))
}).pipe(
    withDataAtom({
        companyId: null,
        companyName: null,
        expiresAt: null,
        role: null,
        status: null,
    }),
    withStatusesAtom(),
    withErrorAtom(),
)

export const acceptInvitationAsync = reatomAsync(async (ctx, token: string) => {
    return ctx.schedule(async () => {
        const jwt = ctx.get(tokenAtom)

        if (!jwt) {
            throw new Error('Войдите, чтобы принять приглашение')
        }

        const result = await acceptInvitation(token, jwt)

        getInvitationAsync.dataAtom(ctx, {
            ...ctx.get(getInvitationAsync.dataAtom),
            companyId: result.companyId,
            status: 'ACCEPTED',
        })

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const declineInvitationAsync = reatomAsync(async (ctx, token: string) => {
    return ctx.schedule(async () => {
        const jwt = ctx.get(tokenAtom)

        if (!jwt) {
            throw new Error('Войдите, чтобы отклонить приглашение')
        }

        const result = await declineInvitation(token, jwt)

        getInvitationAsync.dataAtom(ctx, {
            ...ctx.get(getInvitationAsync.dataAtom),
            status: 'DECLINED',
        })

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())
