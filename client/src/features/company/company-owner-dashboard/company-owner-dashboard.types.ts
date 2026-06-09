import type { UserCompany } from '$entities/auth.ts'

import type { CompanyMember } from '$shared/companies/companies.types.ts'

export type CompanyOwnerDashboardProps = {
    company: UserCompany
    deleteMemberError?: Error
    deleteMemberLoading: boolean
    deleteMemberMessage: string
    deleteMemberModalOpen: boolean
    deleteMemberRejected: boolean
    deleteCompanyError?: Error
    deleteCompanyLoading: boolean
    deleteCompanyMessage: string
    deleteCompanyModalOpen: boolean
    deleteCompanyRejected: boolean
    members: CompanyMember[]
    membersError?: Error
    membersLoading: boolean
    membersRejected: boolean
    onCancelDeleteCompany: () => void
    onCancelDeleteMember: () => void
    onConfirmDeleteCompany: () => void
    onConfirmDeleteMember: () => void
    onDeleteMember: (memberId: string) => void
    onOpenSettings: () => void
    onSelectMember: (memberId: string) => void
}
