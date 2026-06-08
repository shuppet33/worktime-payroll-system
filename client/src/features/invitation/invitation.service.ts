import {
    reatomAsync,
    withDataAtom,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { tokenAtom, userAtom } from '$entities/auth.ts'

import {
    acceptInvitation,
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
    }),
    withStatusesAtom(),
    withErrorAtom(),
)

export const acceptInvitationAsync = reatomAsync(async (ctx, token: string) => {
    return ctx.schedule(async () => {
        const jwt = ctx.get(tokenAtom)
        const user = ctx.get(userAtom)

        if (!jwt) {
            throw new Error('Войдите, чтобы принять приглашение')
        }

        const result = await acceptInvitation(token, jwt)

        if (user) {
            userAtom(ctx, {
                ...user,
                companies: [
                    ...(user.companies ?? []).filter(
                        (company) =>
                            company.company_id !== result.company.id,
                    ),
                    {
                        company_id: result.company.id,
                        company_name: result.company.name,
                        id: result.member.id,
                        role: result.member.role,
                    },
                ],
            })
        }

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())
