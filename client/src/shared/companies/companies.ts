import { API_URL } from '$shared/api/url.ts'

type CreateCompanyPayload = {
    name: string
}

type JoinCompanyPayload = {
    inviteLink: string
}

export const createCompanyRequest = async (token: string, payload: CreateCompanyPayload) => {
    const response = await fetch(`${API_URL}/companies/create`, {
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

export const joinCompanyRequest = async (token: string, payload: JoinCompanyPayload) => {
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
