import { Alert } from 'antd'

import { CompanyMemberCard } from '$features/shared/company-member-card'

import type { CompanyMembersGridProps } from './company-members-grid.types.ts'
import { SCompanyGrid } from './styles'

export const CompanyMembersGrid = ({
    canDelete,
    error,
    loading,
    members,
    showError,
    onDelete,
    onSelect,
}: CompanyMembersGridProps) => {
    return (
        <>
            {showError && error && <Alert type="error" title={error.message} />}
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
