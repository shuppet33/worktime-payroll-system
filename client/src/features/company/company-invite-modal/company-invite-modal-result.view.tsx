import { reatomComponent } from '@reatom/npm-react'

import { appThemeAtom } from '$shared/theme.ts'

import { selectedInviteUserIdAtom } from './company-invite-modal.reatom.ts'
import type { CompanyInviteModalResultProps } from './company-invite-modal.types.ts'
import { getInviteUserInitials } from './company-invite-modal.utils.ts'
import {
    SResultButton,
    SUserAvatar,
    SUserInfo,
    SUserMeta,
    SUserName,
} from './styles'

export const CompanyInviteModalResult = reatomComponent<CompanyInviteModalResultProps>(
    ({ ctx, user }) => {
        const theme = ctx.spy(appThemeAtom)

        const handleSelectUser = () => {
            selectedInviteUserIdAtom(ctx, user.id)
        }

        return (
            <SResultButton
                $theme={theme}
                type="button"
                onClick={handleSelectUser}
            >
                <SUserAvatar $color={user.color}>
                    {getInviteUserInitials(user)}
                </SUserAvatar>

                <SUserInfo>
                    <SUserName $theme={theme}>{user.name}</SUserName>
                    <SUserMeta $theme={theme}>
                        {user.login} • Пригласить
                    </SUserMeta>
                </SUserInfo>
            </SResultButton>
        )
    },
)
