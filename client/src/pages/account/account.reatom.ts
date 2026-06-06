import {
    atom,
    reatomAsync,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { tokenAtom, userAtom } from '$entities/auth.ts'

import {
    createCompanyRequest,
    joinCompanyRequest,
} from '$shared/companies/companies.ts'

export const createCompanyModalOpenAtom = atom(
    false,
    'createCompanyModalOpenAtom',
)
export const joinCompanyModalOpenAtom = atom(false, 'joinCompanyModalOpenAtom')

export const companyNameAtom = atom('', 'companyNameAtom')
export const inviteLinkAtom = atom('', 'inviteLinkAtom')

export const createCompany = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const name = ctx.get(companyNameAtom).trim()
        const token = ctx.get(tokenAtom)
        const user = ctx.get(userAtom)

        if (!name) {
            throw new Error('Введите название компании')
        }

        if (!token) {
            throw new Error('Ошибка авторизации')
        }

        const company = await createCompanyRequest(token, {
            name,
        })

        const createdCompany = {
            id: company.id,
            role: 'OWNER',
            company_id: company.id,
            company_name: company.name,
        }

        if (user) {
            userAtom(ctx, {
                ...user,
                companies: [...(user.companies ?? []), createdCompany],
            })
        }

        companyNameAtom(ctx, '')
        createCompanyModalOpenAtom(ctx, false)

        return company
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const joinCompany = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const inviteLink = ctx.get(inviteLinkAtom).trim()
        const token = ctx.get(tokenAtom)

        if (!inviteLink) {
            throw new Error('Введите ссылку-приглашение')
        }

        if (!token) {
            throw new Error('Ошибка авторизации')
        }

        const result = await joinCompanyRequest(token, {
            inviteLink,
        })

        inviteLinkAtom(ctx, '')
        joinCompanyModalOpenAtom(ctx, false)

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())
