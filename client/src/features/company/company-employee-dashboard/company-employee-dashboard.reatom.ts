import {
    atom,
    reatomResource,
    withConcurrency,
    withDataAtom,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import dayjs from 'dayjs'

import { tokenAtom } from '$entities/auth.ts'

import { getEmployeeMonthRequest } from '$shared/companies/companies.ts'
import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'

const currentPeriod = dayjs()

export const employeeCalendarMonthAtom = atom(
    currentPeriod.month() + 1,
    'employeeCalendarMonthAtom',
)

export const employeeCalendarYearAtom = atom(
    currentPeriod.year(),
    'employeeCalendarYearAtom',
)

export const employeeSelectedDayAtom = atom(
    currentPeriod.date(),
    'employeeSelectedDayAtom',
)

export const employeeMonthResource = reatomResource(
    async (ctx) => {
        const companyId = ctx.spy(selectedCompanyIdAtom as never) as
            | string
            | null
        const month = ctx.spy(employeeCalendarMonthAtom)
        const token = ctx.spy(tokenAtom)
        const year = ctx.spy(employeeCalendarYearAtom)

        if (!companyId) {
            return null
        }

        if (!token) {
            throw new Error('Authorization is required')
        }

        return getEmployeeMonthRequest(token, companyId, {
            month,
            year,
        })
    },
    'employeeMonthResource',
).pipe(withConcurrency(), withDataAtom(null), withStatusesAtom(), withErrorAtom())
