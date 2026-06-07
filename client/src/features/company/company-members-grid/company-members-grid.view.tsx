import { Alert } from 'antd'

import { CompanyMemberCard } from '$features/shared/company-member-card'

import type { CompanyMember } from '$shared/companies/companies.ts'

import { SCompanyGrid } from './styles'

type Props = {
    canDelete: boolean
    error?: Error
    loading: boolean
    members: CompanyMember[]
    showError: boolean
    onDelete: (memberId: string) => void
    onSelect: (memberId: string) => void
}

export const CompanyMembersGrid = ({
    canDelete,
    error,
    loading,
    members,
    showError,
    onDelete,
    onSelect,
}: Props) => {
    return (
        <>
            {showError && error && (
                <Alert type="error" title={error.message} />
            )}

            <SCompanyGrid>
                {loading && <div>Загрузка сотрудников...</div>}

                {!loading &&
                    members.map((member) => (
                        <CompanyMemberCard
                            key={member.id}
                            canDelete={canDelete}
                            member={member}
                            onDelete={onDelete}
                            onSelect={onSelect}
                        />
                    ))}
            </SCompanyGrid>
        </>
    )
}
