import type { CompanyMember } from '$shared/companies/companies.types.ts'

import type { InviteUser } from './company-invite-modal/company-invite-modal.types.ts'

export type CompanyMembersData = {
    companyId: string | null
    members: CompanyMember[]
}

export type InviteSearchData = {
    query: string
    users: InviteUser[]
}
