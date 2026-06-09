import { useMemo, useState } from 'react'

import { Button, Input } from 'antd'
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import {
    companyAccessUsersResource,
    revokeInviteAsync,
} from '$features/company/company.service.ts'
import { openInviteMemberModalAction } from '$features/company/company-invite-modal/company-invite-modal.reatom.ts'
import { openDeleteMemberModalAction } from '$features/company/company-member-modal/company-member-modal.reatom.ts'

import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'
import { type AppTheme,appThemeAtom } from '$shared/theme.ts'

import type { InvitedUser, InvitedUserRole } from '../access-section.types.ts'
import { getFilteredInvitedUsers } from '../access-section.utils.ts'

import { InvitedUserRow } from './invited-user-row.view.tsx'
import {
    SAccessHeader,
    SAccessPanel,
    SAccessSection,
    SAccessTitle,
    SAccessToolbar,
    SEmptyAccessText,
    SInvitedList,
} from './styles.ts'

const ACCESS_USER_COLORS = [
    '#1677ff',
    '#52c41a',
    '#fa8c16',
    '#722ed1',
    '#13c2c2',
    '#eb2f96',
]

const getAccessUserColor = (id: string) => {
    const colorIndex = id
        .split('')
        .reduce((sum, char) => sum + char.charCodeAt(0), 0)

    return ACCESS_USER_COLORS[colorIndex % ACCESS_USER_COLORS.length]
}

export const AccessSection = reatomComponent(({ ctx }) => {
    const theme = ctx.spy(appThemeAtom as never) as AppTheme
    const selectedCompanyId = ctx.spy(selectedCompanyIdAtom as never) as
        | string
        | null
    const accessUsersData = ctx.spy(companyAccessUsersResource.dataAtom)
    const { isPending: isLoading, isRejected: isError } = ctx.spy(
        companyAccessUsersResource.statusesAtom,
    )
    const [accessSearch, setAccessSearch] = useState('')

    const accessUsers =
        accessUsersData.companyId === selectedCompanyId
            ? accessUsersData.users
            : []

    const invitedUsers = useMemo<InvitedUser[]>(
        () =>
            accessUsers.map((user) => ({
                color: getAccessUserColor(user.id),
                id: user.id,
                invitationId: user.invitationId,
                login: user.login,
                name: user.login,
                role: user.role as InvitedUserRole,
                status: user.status,
            })),
        [accessUsers],
    )

    const filteredInvitedUsers = useMemo(
        () => getFilteredInvitedUsers(invitedUsers, accessSearch),
        [accessSearch, invitedUsers],
    )

    const handleDeleteUser = (userId: string) => {
        openDeleteMemberModalAction(ctx, userId)
    }

    const handleRevokeUser = (userId: string, invitationId: string) => {
        if (!selectedCompanyId) {
            return
        }

        revokeInviteAsync(ctx, {
            companyId: selectedCompanyId,
            invitationId,
            userId,
        })
    }

    const handleChangeUserRole = (_userId: string, _role: InvitedUserRole) => {
        void _userId
        void _role
    }

    return (
        <SAccessSection>
            <SAccessHeader>
                <SAccessTitle>Управление доступом</SAccessTitle>

                <Button
                    icon={<UserAddOutlined />}
                    type="primary"
                    onClick={() => openInviteMemberModalAction(ctx)}
                >
                    Пригласить
                </Button>
            </SAccessHeader>

            <SAccessPanel $theme={theme}>
                <SAccessToolbar $theme={theme}>
                    <Input
                        allowClear
                        placeholder="Find a collaborator..."
                        prefix={<SearchOutlined />}
                        value={accessSearch}
                        onChange={(event) =>
                            setAccessSearch(event.target.value)
                        }
                    />
                </SAccessToolbar>

                <SInvitedList>
                    {isLoading ? (
                        <SEmptyAccessText $theme={theme}>
                            Загружаем пользователей...
                        </SEmptyAccessText>
                    ) : isError ? (
                        <SEmptyAccessText $theme={theme}>
                            Не удалось загрузить пользователей
                        </SEmptyAccessText>
                    ) : filteredInvitedUsers.length ? (
                        filteredInvitedUsers.map((user) => (
                            <InvitedUserRow
                                key={`${user.status}-${user.id}`}
                                theme={theme}
                                user={user}
                                onChangeRole={handleChangeUserRole}
                                onDelete={handleDeleteUser}
                                onRevoke={handleRevokeUser}
                            />
                        ))
                    ) : (
                        <SEmptyAccessText $theme={theme}>
                            Приглашённые пользователи не найдены
                        </SEmptyAccessText>
                    )}
                </SInvitedList>
            </SAccessPanel>
        </SAccessSection>
    )
})
