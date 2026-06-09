import type { PaymentType, WorkDay } from '$entities/work-day'

import type { AppTheme } from '$shared/theme.ts'

export type EmployeeCalendarProps = {
    loading?: boolean
    month: number
    paymentType: PaymentType
    selectedDay: number
    theme?: AppTheme
    workDays: WorkDay[]
    year: number
    onMonthChange?: (month: number) => void
    onSelectDay: (day: number) => void
    onYearChange?: (year: number) => void
}
