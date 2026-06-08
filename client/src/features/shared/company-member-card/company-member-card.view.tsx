import { CloseOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import type { MouseEvent } from 'react'

import { appThemeAtom } from '$shared/theme.ts'

import type { CompanyMemberCardProps } from './company-member-card.types.ts'
import {
    SMemberCard,
    SMemberDeleteButton,
    SMemberLogin,
    SMemberMeta,
    SMemberRole,
} from './styles'

export const CompanyMemberCard = reatomComponent<CompanyMemberCardProps>(
    ({ ctx, canDelete = false, member, onDelete, onSelect }) => {
        const appTheme = ctx.spy(appThemeAtom)

        const handleSelectMember = () => {
            onSelect(member.id)
        }

        const handleDeleteMember = (
            event: MouseEvent<HTMLButtonElement>,
        ) => {
            event.stopPropagation()
            onDelete(member.id)
        }

        return (
            <SMemberCard $theme={appTheme} onClick={handleSelectMember}>
                {canDelete && (
                    <SMemberDeleteButton
                        $theme={appTheme}
                        aria-label="Удалить сотрудника"
                        type="button"
                        onClick={handleDeleteMember}
                    >
                        <CloseOutlined />
                    </SMemberDeleteButton>
                )}

                <SMemberLogin>{member.login}</SMemberLogin>

                <SMemberMeta $theme={appTheme}>Роль</SMemberMeta>

                <SMemberRole>{member.role}</SMemberRole>
            </SMemberCard>
        )
    },
)
