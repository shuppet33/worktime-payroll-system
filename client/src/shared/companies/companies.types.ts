export type Company = {
    created_at: string
    id: string
    name: string
}

export type CompanyMember = {
    id: string
    login: string
    role: string
}

export type CreateCompanyPayload = {
    name: string
}

export type JoinCompanyPayload = {
    inviteLink: string
}

export type UpdateCompanyPayload = {
    name: string
}
