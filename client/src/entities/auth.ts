import {
    atom,
    reatomResource,
    withDataAtom,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { meRequest } from '$shared/auth/auth.ts'

export type UserRole = 'ACCOUNTANT' | 'EMPLOYEE' | 'OWNER'

export type UserCompany = {
    id: string
    role: UserRole
    company_id: string
    company_name: string
}

export type User = {
    id: string
    login: string
    companies?: UserCompany[]
}

export const tokenAtom = atom<string | null>(null)
export const userAtom = atom<User | null>(null)

export const meResource = reatomResource(async (ctx) => {
    const token = ctx.spy(tokenAtom)
    const user = ctx.spy(userAtom)

    if (!token || user) {
        return user
    }

    const actualUser = await meRequest(token)

    userAtom(ctx, {
        id: actualUser.id,
        login: actualUser.login,
        companies: actualUser.companies,
    })

    return actualUser
}, 'meResource').pipe(withDataAtom(null), withStatusesAtom(), withErrorAtom())
