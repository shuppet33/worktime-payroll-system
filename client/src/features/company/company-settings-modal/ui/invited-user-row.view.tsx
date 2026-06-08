import { Avatar, Checkbox, Select } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { ROLE_OPTIONS } from '../access-section.constants.ts'
import type { InvitedUserRowProps } from '../access-section.types.ts'

import {
    SDeleteInviteButton,
    SInvitedUserInfo,
    SInvitedUserName,
    SInvitedUserRole,
    SInvitedUserRow,
    SRoleSelectWrapper,
} from './styles.ts'

export const InvitedUserRow = ({
    isSelected,
    theme,
    user,
    onChangeRole,
    onDelete,
    onSelect,
}: InvitedUserRowProps) => {
    const handleSelectUser = (event: { target: { checked: boolean } }) => {
        onSelect(user.id, event.target.checked)
    }

    const handleChangeRole = (role: typeof user.role) => {
        onChangeRole(user.id, role)
    }

    const handleDeleteUser = () => {
        onDelete(user.id)
    }

    return (
        <SInvitedUserRow $theme={theme}>
            <Checkbox checked={isSelected} onChange={handleSelectUser} />

            <Avatar
                style={{
                    backgroundColor: user.color,
                }}
            >
                {user.name.slice(0, 2)}
            </Avatar>

            <SInvitedUserInfo>
                <SInvitedUserName>{user.name}</SInvitedUserName>
                <SInvitedUserRole $theme={theme}>
                    {user.login}
                </SInvitedUserRole>
            </SInvitedUserInfo>

            <SRoleSelectWrapper>
                <Select
                    aria-label={`Роль ${user.login}`}
                    options={ROLE_OPTIONS}
                    value={user.role}
                    onChange={handleChangeRole}
                />
            </SRoleSelectWrapper>

            <SDeleteInviteButton
                $theme={theme}
                aria-label={`Удалить приглашение ${user.login}`}
                type="button"
                onClick={handleDeleteUser}
            >
                <DeleteOutlined />
            </SDeleteInviteButton>
        </SInvitedUserRow>
    )
}
