import { reatomComponent } from '@reatom/npm-react'

import { appThemeAtom } from '$shared/theme.ts'

import { selectedInviteUserIdAtom } from '../company-invite-modal.reatom.ts'
import type { CompanyInviteModalResultProps } from '../company-invite-modal.types.ts'
import { getInviteUserInitials } from '../company-invite-modal.utils.ts'

import {
    SResultButton,
    SUserAvatar,
    SUserInfo,
    SUserMeta,
    SUserName,
} from './styles.ts'

type InviteTheme = 'light' | 'dark'

export const CompanyInviteModalResult =
    reatomComponent<CompanyInviteModalResultProps>(({ ctx, user }) => {
        const theme = ctx.spy(appThemeAtom as never) as InviteTheme
        const status = user.status ?? 'CAN_INVITE'
        const isDisabled = status !== 'CAN_INVITE'

        const handleSelectUser = () => {
            if (isDisabled) {
                return
            }

            selectedInviteUserIdAtom(ctx, user.id)
        }

        const meta =
            status === 'INVITED'
                ? 'Пользователь уже приглашен'
                : status === 'ALREADY_MEMBER'
                  ? 'Уже в компании'
                  : 'Пригласить'

        return (
            <SResultButton
                $disabled={isDisabled}
                $theme={theme}
                onClick={handleSelectUser}
            >
                <SUserAvatar $color={user.color}>
                    {getInviteUserInitials(user)}
                </SUserAvatar>

                <SUserInfo>
                    <SUserName $theme={theme}>{user.name}</SUserName>
                    <SUserMeta $theme={theme}>
                        {user.login} · {meta}
                    </SUserMeta>
                </SUserInfo>
            </SResultButton>
        )
    })
