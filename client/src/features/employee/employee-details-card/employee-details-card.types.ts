import type { PaymentType, WorkDay } from '$entities/work-day'

export type EmployeeDetailsCardProps = {
    dayData?: WorkDay
    paymentType: PaymentType
    selectedDay: number
}
