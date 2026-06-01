import { API_URL } from '$shared/api/url.ts'

export type RegisterPayload = {
    login: string
    password: string
}

export type Auth = {
    token: string

    user: {
        id: string
        login: string
    }
}

export type LoginPayload = {
    login: string
    password: string
}

export type Login = {
    token: string

    user: {
        id: string
        login: string
    }

    companies: {
        id: string
        role: string
        company_id: string
        company_name: string
    }[]
}

export const registerRequest = async (
    payload: RegisterPayload,
): Promise<Auth> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message ?? 'Ошибка регистрации')
    }

    return data
}

export const loginRequest = async (payload: LoginPayload): Promise<Login> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message ?? 'Ошибка авторизации')
    }

    return data
}