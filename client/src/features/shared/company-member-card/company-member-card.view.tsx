import { CloseOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import type { CompanyMember } from '$shared/companies/companies.ts'
import { appThemeAtom } from '$shared/theme.ts'

import {
    SMemberCard,
    SMemberDeleteButton,
    SMemberLogin,
    SMemberMeta,
    SMemberRole,
} from './styles'

type Props = {
    canDelete?: boolean
    member: CompanyMember
    onDelete: (memberId: string) => void
    onSelect: (memberId: string) => void
}

export const CompanyMemberCard = reatomComponent<Props>(
    ({ ctx, canDelete = false, member, onDelete, onSelect }) => {
        const appTheme = ctx.spy(appThemeAtom)

        return (
            <SMemberCard $theme={appTheme} onClick={() => onSelect(member.id)}>
                {canDelete && (
                    <SMemberDeleteButton
                        $theme={appTheme}
                        aria-label="Удалить сотрудника"
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation()
                            onDelete(member.id)
                        }}
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
