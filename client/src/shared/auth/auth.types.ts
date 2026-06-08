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
        role: string
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
    login: string
    password: string
}
