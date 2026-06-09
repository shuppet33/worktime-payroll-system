import { useMemo } from 'react'

import { Alert } from 'antd'

import { reatomComponent } from '@reatom/npm-react'

import dayjs from 'dayjs'

import { EmployeeCalendar } from '$features/employee/employee-calendar'

import type { PaymentType, WorkDay } from '$entities/work-day'

import type { EmployeeMonthProfile } from '$shared/companies/companies.types.ts'

import {
    employeeCalendarMonthAtom,
    employeeCalendarYearAtom,
    employeeMonthResource,
    employeeSelectedDayAtom,
} from './company-employee-dashboard.reatom.ts'
import type { CompanyEmployeeDashboardProps } from './company-employee-dashboard.types.ts'
import {
    SEmployeeLayout,
    SErrorText,
    SMetaItem,
    SMetaLabel,
    SMetaList,
    SMetaValue,
    SPanel,
    SPanelTitle,
    SPlaceholderItem,
    SPlaceholderList,
    SSideColumn,
} from './styles'

const formatHours = (value: number | string | null) => {
    const hours = Number(value ?? 0)

    if (!hours) {
        return '0ч'
    }

    return `${hours.toLocaleString('ru-RU', {
        maximumFractionDigits: 2,
    })}ч`
}

const mapPaymentType = (paymentType?: string | null): PaymentType => {
    return paymentType === 'FIXED' ? 'fixed' : 'hourly'
}

const getProfileName = (profile: EmployeeMonthProfile | null) => {
    if (!profile) {
        return 'Профиль не заполнен'
    }

    const fullName = [
        profile.lastName,
        profile.firstName,
        profile.middleName,
    ]
        .filter(Boolean)
        .join(' ')

    return fullName || 'Профиль не заполнен'
}

export const CompanyEmployeeDashboard = reatomComponent<CompanyEmployeeDashboardProps>(
    ({ ctx, company, theme }) => {
        const month = ctx.spy(employeeCalendarMonthAtom)
        const year = ctx.spy(employeeCalendarYearAtom)
        const selectedDay = ctx.spy(employeeSelectedDayAtom)
        const monthData = ctx.spy(employeeMonthResource.dataAtom)
        const { isPending, isRejected } = ctx.spy(
            employeeMonthResource.statusesAtom,
        )
        const error = ctx.spy(employeeMonthResource.errorAtom)

        const paymentType = mapPaymentType(monthData?.paymentType)
        const workDays = useMemo<WorkDay[]>(() => {
            return (
                monthData?.workDays.map((day) => ({
                    day: day.day,
                    description: `Отработано ${formatHours(day.hoursWorked)}`,
                    hours: formatHours(day.hoursWorked),
                    worked: Number(day.hoursWorked ?? 0) > 0,
                })) ?? []
            )
        }, [monthData?.workDays])

        const selectedDayData = workDays.find(
            (workDay) => workDay.day === selectedDay,
        )
        const profile = monthData?.profile ?? null
        const periodLabel = dayjs()
            .year(year)
            .month(month - 1)
            .date(selectedDay)
            .format('D MMMM YYYY')

        return (
            <SEmployeeLayout>
                <EmployeeCalendar
                    loading={isPending}
                    month={month}
                    onMonthChange={(nextMonth) => {
                        employeeCalendarMonthAtom(ctx, nextMonth)
                        employeeSelectedDayAtom(ctx, 1)
                    }}
                    onSelectDay={(day) => employeeSelectedDayAtom(ctx, day)}
                    onYearChange={(nextYear) => {
                        employeeCalendarYearAtom(ctx, nextYear)
                        employeeSelectedDayAtom(ctx, 1)
                    }}
                    paymentType={paymentType}
                    selectedDay={selectedDay}
                    theme={theme}
                    workDays={workDays}
                    year={year}
                />

                <SSideColumn>
                    <SPanel $theme={theme}>
                        <SPanelTitle>Компания</SPanelTitle>

                        <SMetaList>
                            <SMetaItem $theme={theme}>
                                <SMetaLabel>Название</SMetaLabel>
                                <SMetaValue>{company.company_name}</SMetaValue>
                            </SMetaItem>

                            <SMetaItem $theme={theme}>
                                <SMetaLabel>Ваша роль</SMetaLabel>
                                <SMetaValue>{company.role}</SMetaValue>
                            </SMetaItem>
                        </SMetaList>
                    </SPanel>

                    <SPanel $theme={theme}>
                        <SPanelTitle>Мой профиль сотрудника</SPanelTitle>

                        {isRejected && error && (
                            <Alert type="error" title={error.message} />
                        )}

                        <SMetaList>
                            <SMetaItem $theme={theme}>
                                <SMetaLabel>Имя</SMetaLabel>
                                <SMetaValue>{getProfileName(profile)}</SMetaValue>
                            </SMetaItem>

                            <SMetaItem $theme={theme}>
                                <SMetaLabel>Должность</SMetaLabel>
                                <SMetaValue>
                                    {profile?.position ?? 'Не указана'}
                                </SMetaValue>
                            </SMetaItem>

                            <SMetaItem $theme={theme}>
                                <SMetaLabel>Тип оплаты</SMetaLabel>
                                <SMetaValue>{paymentType}</SMetaValue>
                            </SMetaItem>

                            <SMetaItem $theme={theme}>
                                <SMetaLabel>{periodLabel}</SMetaLabel>
                                <SMetaValue>
                                    {selectedDayData?.hours ?? '0ч'}
                                </SMetaValue>
                            </SMetaItem>
                        </SMetaList>

                        {!profile && !isPending && (
                            <SErrorText>
                                Карточка сотрудника пока не создана.
                            </SErrorText>
                        )}
                    </SPanel>

                    <SPanel $theme={theme}>
                        <SPanelTitle>Будущие разделы</SPanelTitle>

                        <SPlaceholderList>
                            <SPlaceholderItem $theme={theme}>
                                Мои часы
                            </SPlaceholderItem>
                            <SPlaceholderItem $theme={theme}>
                                Мои премии
                            </SPlaceholderItem>
                            <SPlaceholderItem $theme={theme}>
                                Мои расчетные листы
                            </SPlaceholderItem>
                            <SPlaceholderItem $theme={theme}>
                                Моя зарплата
                            </SPlaceholderItem>
                        </SPlaceholderList>
                    </SPanel>
                </SSideColumn>
            </SEmployeeLayout>
        )
    },
)
