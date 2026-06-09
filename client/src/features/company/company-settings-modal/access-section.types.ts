import type { AppTheme } from '$shared/theme.ts'

export type InvitedUserRole = 'ACCOUNTANT' | 'EMPLOYEE'

export type InvitedUser = {
    color: string
    id: string
    invitationId?: string | null
    login: string
    name: string
    role: InvitedUserRole
    status: 'ALREADY_MEMBER' | 'INVITED'
}

export type InvitedUserRowProps = {
    theme: AppTheme
    user: InvitedUser
    onChangeRole: (userId: string, role: InvitedUserRole) => void
    onDelete: (userId: string) => void
    onRevoke: (userId: string, invitationId: string) => void
}
