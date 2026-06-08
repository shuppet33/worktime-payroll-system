import type { UserRole } from '$entities/auth.ts'

export type Auth = {
    token: string
    user: {
        id: string
        login: string
    }
}

export type CheckLoginResponse = {
    exists: boolean
}

export type Login = {
    companies: {
        company_id: string
        company_name: string
        id: string
        role: UserRole
    }[]
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

export type RegisterPayload = {
    email: string
    emailCode: string
    login: string
    password: string
}

export type VerifyEmailCodePayload = {
    code: string
    email: string
}

export type VerifyEmailCodeResponse = {
    isValid: boolean
}
