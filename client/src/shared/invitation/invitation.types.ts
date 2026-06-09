import type { UserRole } from '$entities/auth.ts'

export type InvitationStatus =
    | 'ACCEPTED'
    | 'DECLINED'
    | 'EXPIRED'
    | 'PENDING'
    | 'REVOKED'

export type Invitation = {
    companyId: string | null
    companyName: string | null
    expiresAt: string | null
    role: UserRole | null
    status: InvitationStatus | null
}

export type AcceptInvitationResponse = {
    companyId: string
    message: string
}

export type DeclineInvitationResponse = {
    message: string
}
