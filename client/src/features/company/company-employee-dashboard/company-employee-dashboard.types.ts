import type { UserCompany } from '$entities/auth.ts'

import type { AppTheme } from '$shared/theme.ts'

export type CompanyEmployeeDashboardProps = {
    company: UserCompany
    theme: AppTheme
}
