import { API_URL } from '$shared/api/url.ts'

import type {
    Bonus,
    CalculatePayrollPayload,
    Company,
    CompanyAccessUser,
    CompanyInvitation,
    CompanyInviteUser,
    CompanyMember,
    CreateBonusPayload,
    CreateCompanyPayload,
    CreateInvitationPayload,
    CreateWorkLogPayload,
    EmployeeMonth,
    JoinCompanyPayload,
    Payroll,
    UpdateCompanyPayload,
    WorkLog,
} from './companies.types.ts'

export const createCompanyRequest = async (
    token: string,
    payload: CreateCompanyPayload,
): Promise<Company> => {
    const response = await fetch(`${API_URL}/companies/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось создать компанию')
    }

    return data.company
}

export const joinCompanyRequest = async (
    token: string,
    payload: JoinCompanyPayload,
) => {
    const response = await fetch(`${API_URL}/companies/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось присоединиться к компании')
    }

    return data
}

export const updateCompanyRequest = async (
    token: string,
    companyId: string,
    payload: UpdateCompanyPayload,
): Promise<{ companyId: string; name: string }> => {
    const response = await fetch(`${API_URL}/companies/${companyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(
            data?.message ?? 'Не удалось изменить название компании',
        )
    }

    return data
}

export const deleteCompanyRequest = async (
    token: string,
    companyId: string,
): Promise<{ companyId: string }> => {
    const response = await fetch(`${API_URL}/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось удалить компанию')
    }

    return data
}

export const getCompanyMembersRequest = async (
    token: string,
    companyId: string,
): Promise<CompanyMember[]> => {
    const response = await fetch(`${API_URL}/companies/${companyId}/members`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось получить сотрудников')
    }

    return data
}

export const getEmployeeMonthRequest = async (
    token: string,
    companyId: string,
    payload: { month: number; year: number },
): Promise<EmployeeMonth> => {
    const params = new URLSearchParams({
        month: String(payload.month),
        year: String(payload.year),
    })

    const response = await fetch(
        `${API_URL}/companies/${companyId}/employee/month?${params.toString()}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to load employee calendar')
    }

    return data
}

export const getWorkLogsRequest = async (
    token: string,
    companyId: string,
    employeeId: string,
    payload?: { month?: number; year?: number },
): Promise<WorkLog[]> => {
    const params = new URLSearchParams()

    if (payload?.month) {
        params.set('month', String(payload.month))
    }

    if (payload?.year) {
        params.set('year', String(payload.year))
    }

    const query = params.toString()
    const response = await fetch(
        `${API_URL}/companies/${companyId}/employees/${employeeId}/work-logs${query ? `?${query}` : ''}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to load work logs')
    }

    return data
}

export const createWorkLogRequest = async (
    token: string,
    companyId: string,
    employeeId: string,
    payload: CreateWorkLogPayload,
): Promise<WorkLog> => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/employees/${employeeId}/work-logs`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to create work log')
    }

    return data
}

export const deleteWorkLogRequest = async (
    token: string,
    companyId: string,
    workLogId: string,
) => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/work-logs/${workLogId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to delete work log')
    }

    return data
}

export const getBonusesRequest = async (
    token: string,
    companyId: string,
    employeeId: string,
): Promise<Bonus[]> => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/employees/${employeeId}/bonuses`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to load bonuses')
    }

    return data
}

export const createBonusRequest = async (
    token: string,
    companyId: string,
    employeeId: string,
    payload: CreateBonusPayload,
): Promise<Bonus> => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/employees/${employeeId}/bonuses`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to create bonus')
    }

    return data
}

export const deleteBonusRequest = async (
    token: string,
    companyId: string,
    bonusId: string,
) => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/bonuses/${bonusId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to delete bonus')
    }

    return data
}

export const calculatePayrollRequest = async (
    token: string,
    companyId: string,
    employeeId: string,
    payload: CalculatePayrollPayload,
): Promise<Payroll> => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/employees/${employeeId}/payrolls/calculate`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to calculate payroll')
    }

    return data
}

export const getCompanyPayrollsRequest = async (
    token: string,
    companyId: string,
): Promise<Payroll[]> => {
    const response = await fetch(`${API_URL}/companies/${companyId}/payrolls`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to load payrolls')
    }

    return data
}

export const getEmployeePayrollsRequest = async (
    token: string,
    companyId: string,
    employeeId: string,
): Promise<Payroll[]> => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/employees/${employeeId}/payrolls`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to load employee payrolls')
    }

    return data
}

export const getCompanyAccessUsersRequest = async (
    token: string,
    companyId: string,
): Promise<CompanyAccessUser[]> => {
    const response = await fetch(`${API_URL}/companies/${companyId}/invitations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось получить приглашенных пользователей')
    }

    return data
}

export const searchCompanyInviteUsersRequest = async (
    token: string,
    companyId: string,
    query: string,
): Promise<CompanyInviteUser[]> => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/users/search?q=${encodeURIComponent(query)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось найти пользователей')
    }

    return data
}

export const createCompanyInvitationRequest = async (
    token: string,
    companyId: string,
    payload: CreateInvitationPayload,
): Promise<CompanyInvitation> => {
    const response = await fetch(`${API_URL}/companies/${companyId}/invitations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось создать приглашение')
    }

    return data
}

export const revokeCompanyInvitationRequest = async (
    token: string,
    companyId: string,
    invitationId: string,
) => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/invitations/${invitationId}/revoke`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось отозвать приглашение')
    }

    return data
}

export const deleteCompanyMembersRequest = async (
    token: string,
    memberId: string,
    companyId: string,
): Promise<{ companyId: string }> => {
    const response = await fetch(
        `${API_URL}/companies/${companyId}/members/${memberId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message ?? 'Не удалось удалить сотрудника ')
    }

    return data
}
