import type { PaymentType, WorkDay } from '$entities/work-day'

export type EmployeeCalendarProps = {
    month: number
    paymentType: PaymentType
    selectedDay: number
    workDays: WorkDay[]
    year: number
    onSelectDay: (day: number) => void
}
