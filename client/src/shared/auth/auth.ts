import { API_URL } from '$shared/api/url.ts'

import type {
    Auth,
    CheckLoginResponse,
    Login,
    LoginPayload,
    RegisterPayload,
} from './auth.types.ts'

export const checkLoginRequest = async (
    q: string,
    signal?: AbortSignal,
): Promise<CheckLoginResponse> => {
    const response = await fetch(
        `${API_URL}/users/check-login?q=${encodeURIComponent(q)}`,
        {
            signal,
        },
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message ?? 'Не удалось проверить логин')
    }

    return data
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

export const meRequest = async (token: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message ?? 'Не авторизован')
    }

    return data
}

export const logoutRequest = async (token: string) => {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message ?? 'Не удалось выйти')
    }

    return data
}
