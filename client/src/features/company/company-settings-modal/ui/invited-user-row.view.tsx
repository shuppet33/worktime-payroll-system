import { Avatar, Button, Select } from 'antd'
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
    theme,
    user,
    onChangeRole,
    onDelete,
    onRevoke,
}: InvitedUserRowProps) => {
    const isInvited = user.status === 'INVITED'

    const handleChangeRole = (role: typeof user.role) => {
        onChangeRole(user.id, role)
    }

    const handleDeleteUser = () => {
        onDelete(user.id)
    }

    const handleRevokeUser = () => {
        if (!user.invitationId) {
            return
        }

        onRevoke(user.id, user.invitationId)
    }

    return (
        <SInvitedUserRow $theme={theme}>
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
                {isInvited ? (
                    <SInvitedUserRole $theme={theme}>
                        Приглашен
                    </SInvitedUserRole>
                ) : (
                    <Select
                        aria-label={`Роль ${user.login}`}
                        options={ROLE_OPTIONS}
                        value={user.role}
                        onChange={handleChangeRole}
                    />
                )}
            </SRoleSelectWrapper>

            {isInvited ? (
                <Button
                    disabled={!user.invitationId}
                    size="small"
                    onClick={handleRevokeUser}
                >
                    Отозвать
                </Button>
            ) : (
                <SDeleteInviteButton
                    $theme={theme}
                    aria-label={`Удалить ${user.login}`}
                    type="button"
                    onClick={handleDeleteUser}
                >
                    <DeleteOutlined />
                </SDeleteInviteButton>
            )}
        </SInvitedUserRow>
    )
}
