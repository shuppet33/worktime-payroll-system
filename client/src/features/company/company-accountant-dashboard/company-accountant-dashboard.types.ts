import type { UserCompany } from '$entities/auth.ts'

import type { CompanyMember } from '$shared/companies/companies.types.ts'
import type { AppTheme } from '$shared/theme.ts'

export type CompanyAccountantDashboardProps = {
    company: UserCompany
    error?: Error
    loading: boolean
    members: CompanyMember[]
    showError: boolean
    theme: AppTheme
    onSelectMember: (memberId: string) => void
}
