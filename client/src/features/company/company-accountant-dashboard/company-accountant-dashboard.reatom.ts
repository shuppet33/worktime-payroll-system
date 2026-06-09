import {
    atom,
    reatomAsync,
    reatomResource,
    withConcurrency,
    withDataAtom,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import dayjs from 'dayjs'

import { tokenAtom } from '$entities/auth.ts'

import {
    calculatePayrollRequest,
    createBonusRequest,
    createWorkLogRequest,
    deleteBonusRequest,
    deleteWorkLogRequest,
    getBonusesRequest,
    getCompanyPayrollsRequest,
    getEmployeePayrollsRequest,
    getWorkLogsRequest,
} from '$shared/companies/companies.ts'
import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'

const currentDate = dayjs()

export const accountantSelectedEmployeeIdAtom = atom<string | null>(
    null,
    'accountantSelectedEmployeeIdAtom',
)

export const accountantMonthAtom = atom(
    currentDate.month() + 1,
    'accountantMonthAtom',
)

export const accountantYearAtom = atom(
    currentDate.year(),
    'accountantYearAtom',
)

export const workLogDateAtom = atom(
    currentDate.format('YYYY-MM-DD'),
    'workLogDateAtom',
)

export const workLogHoursAtom = atom(8, 'workLogHoursAtom')

export const workLogOvertimeAtom = atom(0, 'workLogOvertimeAtom')

export const bonusAmountAtom = atom(0, 'bonusAmountAtom')

export const bonusDescriptionAtom = atom('', 'bonusDescriptionAtom')

export const accountantWorkLogsResource = reatomResource(
    async (ctx) => {
        const token = ctx.spy(tokenAtom)
        const companyId = ctx.spy(selectedCompanyIdAtom as never) as
            | string
            | null
        const employeeId = ctx.spy(accountantSelectedEmployeeIdAtom)
        const month = ctx.spy(accountantMonthAtom)
        const year = ctx.spy(accountantYearAtom)

        if (!companyId || !employeeId) {
            return []
        }

        if (!token) {
            throw new Error('Authorization is required')
        }

        return getWorkLogsRequest(token, companyId, employeeId, {
            month,
            year,
        })
    },
    'accountantWorkLogsResource',
).pipe(withConcurrency(), withDataAtom([]), withStatusesAtom(), withErrorAtom())

export const accountantBonusesResource = reatomResource(
    async (ctx) => {
        const token = ctx.spy(tokenAtom)
        const companyId = ctx.spy(selectedCompanyIdAtom as never) as
            | string
            | null
        const employeeId = ctx.spy(accountantSelectedEmployeeIdAtom)

        if (!companyId || !employeeId) {
            return []
        }

        if (!token) {
            throw new Error('Authorization is required')
        }

        return getBonusesRequest(token, companyId, employeeId)
    },
    'accountantBonusesResource',
).pipe(withConcurrency(), withDataAtom([]), withStatusesAtom(), withErrorAtom())

export const accountantPayrollsResource = reatomResource(
    async (ctx) => {
        const token = ctx.spy(tokenAtom)
        const companyId = ctx.spy(selectedCompanyIdAtom as never) as
            | string
            | null
        const employeeId = ctx.spy(accountantSelectedEmployeeIdAtom)

        if (!companyId || !employeeId) {
            return []
        }

        if (!token) {
            throw new Error('Authorization is required')
        }

        return getEmployeePayrollsRequest(token, companyId, employeeId)
    },
    'accountantPayrollsResource',
).pipe(withConcurrency(), withDataAtom([]), withStatusesAtom(), withErrorAtom())

export const companyPayrollsResource = reatomResource(
    async (ctx) => {
        const token = ctx.spy(tokenAtom)
        const companyId = ctx.spy(selectedCompanyIdAtom as never) as
            | string
            | null

        if (!companyId) {
            return []
        }

        if (!token) {
            throw new Error('Authorization is required')
        }

        return getCompanyPayrollsRequest(token, companyId)
    },
    'companyPayrollsResource',
).pipe(withConcurrency(), withDataAtom([]), withStatusesAtom(), withErrorAtom())

export const createWorkLogAsync = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)
        const companyId = ctx.get(selectedCompanyIdAtom)
        const employeeId = ctx.get(accountantSelectedEmployeeIdAtom)

        if (!token || !companyId || !employeeId) {
            throw new Error('Employee is not selected')
        }

        const result = await createWorkLogRequest(token, companyId, employeeId, {
            workDate: ctx.get(workLogDateAtom),
            hoursWorked: Number(ctx.get(workLogHoursAtom)),
            overtimeHours: Number(ctx.get(workLogOvertimeAtom)),
        })

        const month = ctx.get(accountantMonthAtom)
        const year = ctx.get(accountantYearAtom)

        accountantWorkLogsResource.dataAtom(
            ctx,
            await getWorkLogsRequest(token, companyId, employeeId, {
                month,
                year,
            }),
        )

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const deleteWorkLogAsync = reatomAsync((ctx, workLogId: string) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)
        const companyId = ctx.get(selectedCompanyIdAtom)
        const employeeId = ctx.get(accountantSelectedEmployeeIdAtom)

        if (!token || !companyId || !employeeId) {
            throw new Error('Employee is not selected')
        }

        const result = await deleteWorkLogRequest(token, companyId, workLogId)
        const month = ctx.get(accountantMonthAtom)
        const year = ctx.get(accountantYearAtom)

        accountantWorkLogsResource.dataAtom(
            ctx,
            await getWorkLogsRequest(token, companyId, employeeId, {
                month,
                year,
            }),
        )

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const createBonusAsync = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)
        const companyId = ctx.get(selectedCompanyIdAtom)
        const employeeId = ctx.get(accountantSelectedEmployeeIdAtom)

        if (!token || !companyId || !employeeId) {
            throw new Error('Employee is not selected')
        }

        const result = await createBonusRequest(token, companyId, employeeId, {
            amount: Number(ctx.get(bonusAmountAtom)),
            description: ctx.get(bonusDescriptionAtom),
        })

        accountantBonusesResource.dataAtom(
            ctx,
            await getBonusesRequest(token, companyId, employeeId),
        )
        bonusAmountAtom(ctx, 0)
        bonusDescriptionAtom(ctx, '')

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const deleteBonusAsync = reatomAsync((ctx, bonusId: string) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)
        const companyId = ctx.get(selectedCompanyIdAtom)
        const employeeId = ctx.get(accountantSelectedEmployeeIdAtom)

        if (!token || !companyId || !employeeId) {
            throw new Error('Employee is not selected')
        }

        const result = await deleteBonusRequest(token, companyId, bonusId)

        accountantBonusesResource.dataAtom(
            ctx,
            await getBonusesRequest(token, companyId, employeeId),
        )

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const calculatePayrollAsync = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)
        const companyId = ctx.get(selectedCompanyIdAtom)
        const employeeId = ctx.get(accountantSelectedEmployeeIdAtom)

        if (!token || !companyId || !employeeId) {
            throw new Error('Employee is not selected')
        }

        const result = await calculatePayrollRequest(token, companyId, employeeId, {
            month: ctx.get(accountantMonthAtom),
            year: ctx.get(accountantYearAtom),
        })

        accountantPayrollsResource.dataAtom(
            ctx,
            await getEmployeePayrollsRequest(token, companyId, employeeId),
        )
        companyPayrollsResource.dataAtom(
            ctx,
            await getCompanyPayrollsRequest(token, companyId),
        )

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())
