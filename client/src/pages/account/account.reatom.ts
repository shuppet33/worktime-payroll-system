import {
    atom,
    reatomAsync,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { API_URL } from '$shared/api/url.ts'

type CreateCompanyPayload = {
    name: string
}

type JoinCompanyPayload = {
    inviteLink: string
}

export const sidebarCollapsedAtom = atom(false, 'sidebarCollapsedAtom')

export const createCompanyModalOpenAtom = atom(
    false,
    'createCompanyModalOpenAtom',
)
export const joinCompanyModalOpenAtom = atom(
    false,
    'joinCompanyModalOpenAtom',
)

export const companyNameAtom = atom('', 'companyNameAtom')
export const inviteLinkAtom = atom('', 'inviteLinkAtom')

export const createCompanyRequest = async (payload: CreateCompanyPayload) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_URL}/companies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось создать компанию')
    }

    return data
}

export const joinCompanyRequest = async (payload: JoinCompanyPayload) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_URL}/companies/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось присоединиться к компании')
    }

    return data
}

export const createCompany = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const name = ctx.get(companyNameAtom).trim()

        if (!name) {
            throw new Error('Введите название компании')
        }

        const result = await createCompanyRequest({
            name,
        })

        companyNameAtom(ctx, '')
        createCompanyModalOpenAtom(ctx, false)

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const joinCompany = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const inviteLink = ctx.get(inviteLinkAtom).trim()

        if (!inviteLink) {
            throw new Error('Введите ссылку-приглашение')
        }

        const result = await joinCompanyRequest({
            inviteLink,
        })

        inviteLinkAtom(ctx, '')
        joinCompanyModalOpenAtom(ctx, false)

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())
