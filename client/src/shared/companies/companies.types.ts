export type Company = {
    created_at: string
    id: string
    name: string
}

export type CompanyMember = {
    employeeId?: string | null
    id: string
    login: string
    paymentType?: string | null
    position?: string | null
    role: string
}

export type EmployeeMonthProfile = {
    fixedSalary: string | null
    firstName: string | null
    hireDate: string | null
    hourlyRate: string | null
    id: string
    isActive: boolean | null
    lastName: string | null
    middleName: string | null
    paymentType: string | null
    position: string | null
}

export type EmployeeMonthWorkDay = {
    day: number
    hoursWorked: string | number | null
    overtimeHours: string | number | null
    workDate: string
}

export type EmployeeMonth = {
    companyId: string
    month: number
    paymentType: string
    profile: EmployeeMonthProfile | null
    workDays: EmployeeMonthWorkDay[]
    year: number
}

export type CompanyInviteUserStatus =
    | 'ALREADY_MEMBER'
    | 'CAN_INVITE'
    | 'INVITED'

export type CompanyInviteUser = {
    id: string
    invitationId?: string
    login: string
    status: CompanyInviteUserStatus
}

export type CompanyAccessUserStatus = 'ALREADY_MEMBER' | 'INVITED'

export type CompanyAccessUser = {
    id: string
    invitationId?: string | null
    login: string
    role: string
    status: CompanyAccessUserStatus
}

export type CreateInvitationPayload = {
    role: string
    userId: string
}

export type CompanyInvitation = {
    expiresAt: string
    id: string
    inviteLink: string
    role: string
    status?: string
    token: string
    userId: string
}

export type CreateCompanyPayload = {
    name: string
}

export type JoinCompanyPayload = {
    inviteLink: string
}

export type UpdateCompanyPayload = {
    name: string
}

export type WorkLog = {
    createdAt: string
    employeeId: string
    hoursWorked: string | number
    id: string
    overtimeHours: string | number
    workDate: string
}

export type CreateWorkLogPayload = {
    hoursWorked: number
    overtimeHours: number
    workDate: string
}

export type Bonus = {
    amount: string | number
    createdAt: string
    description: string
    employeeId: string
    id: string
}

export type CreateBonusPayload = {
    amount: number
    description: string
}

export type Payroll = {
    baseSalary: string | number
    bonusPayment: string | number
    createdAt: string
    employeeId: string
    finalSalary: string | number
    id: string
    month: number
    ndflAmount: string | number
    overtimePayment: string | number
    paymentType: string
    year: number
}

export type CalculatePayrollPayload = {
    month: number
    year: number
}
