import { type ChangeEvent,useMemo, useState } from 'react'

import { Button, Checkbox, Input } from 'antd'
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import { openInviteMemberModalAction } from '$features/company/company-invite-modal/company-invite-modal.reatom.ts'

import { appThemeAtom } from '$shared/theme.ts'

import { MOCK_INVITED_USERS } from './access-section.constants.ts'
import type { InvitedUserRole } from './access-section.types.ts'
import { getFilteredInvitedUsers } from './access-section.utils.ts'
import { InvitedUserRow } from './invited-user-row.view.tsx'
import {
    SAccessHeader,
    SAccessPanel,
    SAccessSection,
    SAccessTitle,
    SAccessToolbar,
    SEmptyAccessText,
    SInvitedList,
    SSelectAll,
} from './styles'

export const AccessSection = reatomComponent(({ ctx }) => {
    const theme = ctx.spy(appThemeAtom)
    const [accessSearch, setAccessSearch] = useState('')
    const [invitedUsers, setInvitedUsers] = useState(MOCK_INVITED_USERS)
    const [selectedInviteIds, setSelectedInviteIds] = useState<string[]>([])

    const filteredInvitedUsers = useMemo(
        () => getFilteredInvitedUsers(invitedUsers, accessSearch),
        [accessSearch, invitedUsers],
    )

    const filteredIds = filteredInvitedUsers.map((user) => user.id)
    const hasSelectedFilteredUsers = selectedInviteIds.some((id) =>
        filteredIds.includes(id),
    )
    const hasFilteredUsers = filteredIds.length > 0
    const isAllFilteredSelected =
        hasFilteredUsers &&
        filteredIds.every((id) => selectedInviteIds.includes(id))

    const handleOpenInviteModal = () => {
        openInviteMemberModalAction(ctx)
    }

    const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setAccessSearch(event.target.value)
    }

    const handleSelectAll = (event: { target: { checked: boolean } }) => {
        if (!event.target.checked) {
            setSelectedInviteIds((ids) =>
                ids.filter((id) => !filteredIds.includes(id)),
            )
            return
        }

        setSelectedInviteIds((ids) =>
            Array.from(new Set([...ids, ...filteredIds])),
        )
    }

    const handleSelectUser = (userId: string, checked: boolean) => {
        setSelectedInviteIds((ids) =>
            checked ? [...ids, userId] : ids.filter((id) => id !== userId),
        )
    }

    const handleDeleteUser = (userId: string) => {
        setInvitedUsers((users) => users.filter((user) => user.id !== userId))
        setSelectedInviteIds((ids) => ids.filter((id) => id !== userId))
    }

    const handleChangeUserRole = (userId: string, role: InvitedUserRole) => {
        setInvitedUsers((users) =>
            users.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          role,
                      }
                    : user,
            ),
        )
    }

    return (
        <SAccessSection>
            <SAccessHeader>
                <SAccessTitle>Управление доступом</SAccessTitle>

                <Button
                    icon={<UserAddOutlined />}
                    type="primary"
                    onClick={handleOpenInviteModal}
                >
                    Пригласить
                </Button>
            </SAccessHeader>

            <SAccessPanel $theme={theme}>
                <SAccessToolbar $theme={theme}>
                    <SSelectAll>
                        <Checkbox
                            checked={isAllFilteredSelected}
                            disabled={!hasFilteredUsers}
                            indeterminate={
                                hasSelectedFilteredUsers &&
                                !isAllFilteredSelected
                            }
                            onChange={handleSelectAll}
                        />
                        Select all
                    </SSelectAll>

                    <Input
                        allowClear
                        placeholder="Find a collaborator..."
                        prefix={<SearchOutlined />}
                        value={accessSearch}
                        onChange={handleChangeSearch}
                    />
                </SAccessToolbar>

                <SInvitedList>
                    {filteredInvitedUsers.length ? (
                        filteredInvitedUsers.map((user) => (
                            <InvitedUserRow
                                key={user.id}
                                isSelected={selectedInviteIds.includes(user.id)}
                                theme={theme}
                                user={user}
                                onChangeRole={handleChangeUserRole}
                                onDelete={handleDeleteUser}
                                onSelect={handleSelectUser}
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
