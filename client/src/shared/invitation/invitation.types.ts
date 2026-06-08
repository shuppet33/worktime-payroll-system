import type { UserRole } from '$entities/auth.ts'

export type Invitation = {
    companyId: string | null
    companyName: string | null
    role: UserRole | null
    expiresAt: string | null
}

export type AcceptInvitationResponse = {
    company: {
        id: string
        name: string
    }
    member: {
        id: string
        role: UserRole
    }
    message: string
}
