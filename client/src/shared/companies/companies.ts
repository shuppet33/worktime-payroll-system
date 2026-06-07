import { API_URL } from '$shared/api/url.ts'

type CreateCompanyPayload = {
    name: string
}

type UpdateCompanyPayload = {
    name: string
}

export type Company = {
    id: string
    name: string
    created_at: string
}

export type CompanyMember = {
    id: string
    login: string
    role: string
}

type JoinCompanyPayload = {
    inviteLink: string
}

export const createCompanyRequest = async (
    token: string,
    payload: CreateCompanyPayload,
): Promise<Company> => {
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

    return data.company
}

export const joinCompanyRequest = async (
    token: string,
    payload: JoinCompanyPayload,
) => {
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

export const updateCompanyRequest = async (
    token: string,
    companyId: string,
    payload: UpdateCompanyPayload,
): Promise<{ companyId: string; name: string }> => {
    const response = await fetch(`${API_URL}/companies/${companyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(
            data?.message ?? 'Не удалось изменить название компании',
        )
    }

    return data
}

export const deleteCompanyRequest = async (
    token: string,
    companyId: string,
): Promise<{ companyId: string }> => {
    const response = await fetch(`${API_URL}/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось удалить компанию')
    }

    return data
}

export const getCompanyMembersRequest = async (
    token: string,
    companyId: string,
): Promise<CompanyMember[]> => {
    const response = await fetch(`${API_URL}/companies/${companyId}/members`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось получить сотрудников')
    }

    return data
}
