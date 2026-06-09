import { Select } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import { appThemeAtom } from '$shared/theme.ts'

import {
    selectedInviteUserIdAtom,
    selectedInviteUserRoleAtom,
} from '../company-invite-modal.reatom.ts'
import type { SelectedInviteUserProps } from '../company-invite-modal.types.ts'
import { getInviteUserInitials } from '../company-invite-modal.utils.ts'

import {
    SClearSelectedButton,
    SSelectedUser,
    SUserAvatar,
    SUserInfo,
    SUserMeta,
    SUserName,
} from './styles.ts'

export const SelectedInviteUser = reatomComponent<SelectedInviteUserProps>(
    ({ ctx, user }) => {
        const theme = ctx.spy(appThemeAtom)
        const selectedUserRole = ctx.spy(selectedInviteUserRoleAtom)

        const handleUnselectUser = () => {
            selectedInviteUserIdAtom(ctx, null)
        }

        return (
            <SSelectedUser $theme={theme}>
                <SUserAvatar $color={user.color}>
                    {getInviteUserInitials(user)}
                </SUserAvatar>

                <SUserInfo>
                    <SUserName $theme={theme}>{user.name}</SUserName>
                    <SUserMeta $theme={theme}>{user.login}</SUserMeta>
                </SUserInfo>

                <Select
                    size="large"
                    value={selectedUserRole}
                    options={[
                        { value: 'ACCOUNTANT', label: 'Бухгалтер' },
                        { value: 'EMPLOYEE', label: 'Сотрудник' },
                    ]}
                    onChange={(role) => selectedInviteUserRoleAtom(ctx, role)}
                />

                <SClearSelectedButton
                    aria-label="Убрать выбранного пользователя"
                    type="button"
                    onClick={handleUnselectUser}
                >
                    <CloseOutlined />
                </SClearSelectedButton>
            </SSelectedUser>
        )
    },
)
