import type { CompanyMember } from '$shared/companies/companies.types.ts'

export type CompanyMembersGridProps = {
    canDelete: boolean
    error?: Error
    loading: boolean
    members: CompanyMember[]
    showError: boolean
    onDelete: (memberId: string) => void
    onSelect: (memberId: string) => void
}
