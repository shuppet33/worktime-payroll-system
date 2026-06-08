import type { AppTheme } from '$shared/theme.ts'

export type InvitedUserRole = 'ACCOUNTANT' | 'EMPLOYEE'

export type InvitedUser = {
    color: string
    id: string
    login: string
    name: string
    role: InvitedUserRole
}

export type InvitedUserRowProps = {
    isSelected: boolean
    theme: AppTheme
    user: InvitedUser
    onChangeRole: (userId: string, role: InvitedUserRole) => void
    onDelete: (userId: string) => void
    onSelect: (userId: string, checked: boolean) => void
}
