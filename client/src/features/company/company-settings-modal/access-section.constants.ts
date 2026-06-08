import type {
    InvitedUser,
    InvitedUserRole,
} from './access-section.types.ts'

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

export const MOCK_INVITED_USERS: InvitedUser[] = [
    {
        color: '#64748b',
        id: '1',
        login: 'ntolis',
        name: 'Ntolis',
        role: 'ACCOUNTANT',
    },
    {
        color: '#1677ff',
        id: '2',
        login: 'mshevtsova',
        name: 'Мария Шевцова',
        role: 'EMPLOYEE',
    },
    {
        color: '#fa8c16',
        id: '3',
        login: 'tshemsedinov',
        name: 'Timur Shemsedinov',
        role: 'EMPLOYEE',
    },
]
