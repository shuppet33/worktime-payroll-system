import type { InvitedUserRole } from './access-section.types.ts'

export const ROLE_OPTIONS: { label: string; value: InvitedUserRole }[] = [
    {
        label: 'Бухгалтер',
        value: 'ACCOUNTANT',
    },
    {
        label: 'Сотрудник',
        value: 'EMPLOYEE',
    },
]
