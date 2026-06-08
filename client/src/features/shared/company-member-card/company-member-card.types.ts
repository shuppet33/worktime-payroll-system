import type { CompanyMember } from '$shared/companies/companies.types.ts'

export type CompanyMemberCardProps = {
    canDelete?: boolean
    member: CompanyMember
    onDelete: (memberId: string) => void
    onSelect: (memberId: string) => void
}
