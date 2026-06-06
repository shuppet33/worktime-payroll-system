import {
    reatomAsync,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { tokenAtom, userAtom } from '$entities/auth.ts'

import { logoutRequest } from '$shared/auth/auth.ts'

export const logoutUser = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)

        try {
            if (token) {
                await logoutRequest(token)
            }
        } finally {
            tokenAtom(ctx, null)
            userAtom(ctx, null)
        }
    })
}).pipe(withStatusesAtom(), withErrorAtom())
