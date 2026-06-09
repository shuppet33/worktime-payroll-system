import { Button, DatePicker, Input, InputNumber, Select } from 'antd'

import { reatomComponent } from '@reatom/npm-react'

import dayjs from 'dayjs'

import { EmployeeCalendar } from '$features/employee/employee-calendar'

import type { WorkDay } from '$entities/work-day'

import {
    accountantBonusesResource,
    accountantMonthAtom,
    accountantPayrollsResource,
    accountantSelectedEmployeeIdAtom,
    accountantWorkLogsResource,
    accountantYearAtom,
    bonusAmountAtom,
    bonusDescriptionAtom,
    calculatePayrollAsync,
    companyPayrollsResource,
    createBonusAsync,
    createWorkLogAsync,
    deleteBonusAsync,
    deleteWorkLogAsync,
    workLogDateAtom,
    workLogHoursAtom,
    workLogOvertimeAtom,
} from './company-accountant-dashboard.reatom.ts'
import type { CompanyAccountantDashboardProps } from './company-accountant-dashboard.types.ts'
import {
    SAccountantLayout,
    SEmployeeButton,
    SEmployeeList,
    SEmployeeMeta,
    SEmployeeName,
    SFormGrid,
    SList,
    SListItem,
    SListMeta,
    SListTitle,
    SSectionHeader,
    SSectionHint,
    SSectionTitle,
    SSummaryCard,
    SSummaryGrid,
    SSummaryLabel,
    SSummaryValue,
    SWorkspace,
} from './styles'

const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    label: dayjs().month(index).format('MMMM'),
    value: index + 1,
}))

const currentYear = dayjs().year()
const yearOptions = Array.from({ length: 7 }, (_, index) => {
    const year = currentYear - 3 + index

    return {
        label: String(year),
        value: year,
    }
})

const formatMoney = (value: string | number) => {
    return Number(value || 0).toLocaleString('ru-RU', {
        maximumFractionDigits: 2,
    })
}

const formatHours = (value: string | number) => {
    return `${Number(value || 0).toLocaleString('ru-RU', {
        maximumFractionDigits: 2,
    })}ч`
}

export const CompanyAccountantDashboard =
    reatomComponent<CompanyAccountantDashboardProps>(
        ({ ctx, company, members, theme, onSelectMember }) => {
            const selectedEmployeeId = ctx.spy(accountantSelectedEmployeeIdAtom)
            const month = ctx.spy(accountantMonthAtom)
            const year = ctx.spy(accountantYearAtom)
            const workLogDate = ctx.spy(workLogDateAtom)
            const workLogHours = ctx.spy(workLogHoursAtom)
            const workLogOvertime = ctx.spy(workLogOvertimeAtom)
            const bonusAmount = ctx.spy(bonusAmountAtom)
            const bonusDescription = ctx.spy(bonusDescriptionAtom)
            const workLogs = ctx.spy(accountantWorkLogsResource.dataAtom)
            const bonuses = ctx.spy(accountantBonusesResource.dataAtom)
            const payrolls = ctx.spy(accountantPayrollsResource.dataAtom)
            const companyPayrolls = ctx.spy(companyPayrollsResource.dataAtom)
            const { isPending: workLogsLoading } = ctx.spy(
                accountantWorkLogsResource.statusesAtom,
            )
            const { isPending: createWorkLogLoading } = ctx.spy(
                createWorkLogAsync.statusesAtom,
            )
            const { isPending: createBonusLoading } = ctx.spy(
                createBonusAsync.statusesAtom,
            )
            const { isPending: calculatePayrollLoading } = ctx.spy(
                calculatePayrollAsync.statusesAtom,
            )

            const employees = members.filter((member) => member.employeeId)
            const selectedEmployee = employees.find(
                (member) => member.employeeId === selectedEmployeeId,
            )

            const calendarDays: WorkDay[] = workLogs.map((workLog) => ({
                day: dayjs(workLog.workDate).date(),
                description: `Worked ${formatHours(workLog.hoursWorked)}`,
                hours: formatHours(workLog.hoursWorked),
                worked: Number(workLog.hoursWorked) > 0,
            }))

            const monthHours = workLogs.reduce((sum, workLog) => {
                return sum + Number(workLog.hoursWorked || 0)
            }, 0)
            const monthOvertime = workLogs.reduce((sum, workLog) => {
                return sum + Number(workLog.overtimeHours || 0)
            }, 0)

            return (
                <SAccountantLayout>
                    <SSummaryCard $theme={theme}>
                        <SSectionHeader>
                            <SSectionTitle>
                                {company.company_name}
                            </SSectionTitle>
                            <SSectionHint>
                                Рабочее место бухгалтера
                            </SSectionHint>
                        </SSectionHeader>

                        <SEmployeeList>
                            {members.map((member) => (
                                <SEmployeeButton
                                    key={member.id}
                                    $active={
                                        member.employeeId === selectedEmployeeId
                                    }
                                    $theme={theme}
                                    onClick={() => {
                                        onSelectMember(member.id)

                                        if (member.employeeId) {
                                            accountantSelectedEmployeeIdAtom(
                                                ctx,
                                                member.employeeId,
                                            )
                                        }
                                    }}
                                >
                                    <SEmployeeName>
                                        {member.login}
                                    </SEmployeeName>
                                    <SEmployeeMeta>
                                        {member.position ?? member.role}
                                        {!member.employeeId
                                            ? ' - карточка сотрудника не создана'
                                            : ''}
                                    </SEmployeeMeta>
                                </SEmployeeButton>
                            ))}
                        </SEmployeeList>
                    </SSummaryCard>

                    <SWorkspace>
                        {!selectedEmployee ? (
                            <SSummaryCard $theme={theme}>
                                Выберите сотрудника слева
                            </SSummaryCard>
                        ) : (
                            <>
                                <SSummaryGrid>
                                    <SSummaryCard $theme={theme}>
                                        <SSummaryLabel>
                                            Часы за месяц
                                        </SSummaryLabel>
                                        <SSummaryValue>
                                            {formatHours(monthHours)}
                                        </SSummaryValue>
                                    </SSummaryCard>

                                    <SSummaryCard $theme={theme}>
                                        <SSummaryLabel>
                                            Переработки
                                        </SSummaryLabel>
                                        <SSummaryValue>
                                            {formatHours(monthOvertime)}
                                        </SSummaryValue>
                                    </SSummaryCard>

                                    <SSummaryCard $theme={theme}>
                                        <SSummaryLabel>
                                            Расчеты компании
                                        </SSummaryLabel>
                                        <SSummaryValue>
                                            {companyPayrolls.length}
                                        </SSummaryValue>
                                    </SSummaryCard>
                                </SSummaryGrid>

                                <EmployeeCalendar
                                    loading={workLogsLoading}
                                    month={month}
                                    onMonthChange={(nextMonth) =>
                                        accountantMonthAtom(ctx, nextMonth)
                                    }
                                    onSelectDay={(day) =>
                                        workLogDateAtom(
                                            ctx,
                                            dayjs()
                                                .year(year)
                                                .month(month - 1)
                                                .date(day)
                                                .format('YYYY-MM-DD'),
                                        )
                                    }
                                    onYearChange={(nextYear) =>
                                        accountantYearAtom(ctx, nextYear)
                                    }
                                    paymentType="hourly"
                                    selectedDay={dayjs(workLogDate).date()}
                                    theme={theme}
                                    workDays={calendarDays}
                                    year={year}
                                />

                                <SSummaryCard $theme={theme}>
                                    <SSectionHeader>
                                        <SSectionTitle>
                                            Табель рабочего времени
                                        </SSectionTitle>
                                        <SSectionHint>
                                            Добавляйте и удаляйте записи табеля
                                            для выбранного сотрудника.
                                        </SSectionHint>
                                    </SSectionHeader>

                                    <SFormGrid>
                                        <DatePicker
                                            value={dayjs(workLogDate)}
                                            onChange={(date) => {
                                                if (date) {
                                                    workLogDateAtom(
                                                        ctx,
                                                        date.format(
                                                            'YYYY-MM-DD',
                                                        ),
                                                    )
                                                }
                                            }}
                                        />
                                        <InputNumber
                                            min={0}
                                            value={workLogHours}
                                            addonAfter="ч"
                                            onChange={(value) =>
                                                workLogHoursAtom(
                                                    ctx,
                                                    Number(value ?? 0),
                                                )
                                            }
                                        />
                                        <InputNumber
                                            min={0}
                                            value={workLogOvertime}
                                            addonAfter="ot"
                                            onChange={(value) =>
                                                workLogOvertimeAtom(
                                                    ctx,
                                                    Number(value ?? 0),
                                                )
                                            }
                                        />
                                        <Button
                                            type="primary"
                                            loading={createWorkLogLoading}
                                            disabled={
                                                !selectedEmployee?.employeeId
                                            }
                                            onClick={() =>
                                                createWorkLogAsync(ctx)
                                            }
                                        >
                                            Добавить
                                        </Button>
                                    </SFormGrid>

                                    <SList>
                                        {workLogs.map((workLog) => (
                                            <SListItem
                                                key={workLog.id}
                                                $theme={theme}
                                            >
                                                <div>
                                                    <SListTitle>
                                                        {dayjs(
                                                            workLog.workDate,
                                                        ).format('D MMMM YYYY')}
                                                    </SListTitle>
                                                    <SListMeta>
                                                        {formatHours(
                                                            workLog.hoursWorked,
                                                        )}{' '}
                                                        +{' '}
                                                        {formatHours(
                                                            workLog.overtimeHours,
                                                        )}{' '}
                                                        переработки
                                                    </SListMeta>
                                                </div>

                                                <Button
                                                    danger
                                                    onClick={() =>
                                                        deleteWorkLogAsync(
                                                            ctx,
                                                            workLog.id,
                                                        )
                                                    }
                                                >
                                                    Удалить
                                                </Button>
                                            </SListItem>
                                        ))}
                                    </SList>
                                </SSummaryCard>

                                <SSummaryCard $theme={theme}>
                                    <SSectionHeader>
                                        <SSectionTitle>Премии</SSectionTitle>
                                        <SSectionHint>
                                            Создавайте и удаляйте премии
                                            сотрудника.
                                        </SSectionHint>
                                    </SSectionHeader>

                                    <SFormGrid>
                                        <InputNumber
                                            min={0}
                                            value={bonusAmount}
                                            addonAfter="₽"
                                            onChange={(value) =>
                                                bonusAmountAtom(
                                                    ctx,
                                                    Number(value ?? 0),
                                                )
                                            }
                                        />
                                        <Input
                                            value={bonusDescription}
                                            placeholder="Описание"
                                            onChange={(event) =>
                                                bonusDescriptionAtom(
                                                    ctx,
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <Button
                                            type="primary"
                                            loading={createBonusLoading}
                                            disabled={
                                                !selectedEmployee?.employeeId
                                            }
                                            onClick={() =>
                                                createBonusAsync(ctx)
                                            }
                                        >
                                            Добавить премию
                                        </Button>
                                    </SFormGrid>

                                    <SList>
                                        {bonuses.map((bonus) => (
                                            <SListItem
                                                key={bonus.id}
                                                $theme={theme}
                                            >
                                                <div>
                                                    <SListTitle>
                                                        {formatMoney(
                                                            bonus.amount,
                                                        )}{' '}
                                                        ₽
                                                    </SListTitle>
                                                    <SListMeta>
                                                        {bonus.description ||
                                                            'Премия'}
                                                    </SListMeta>
                                                </div>

                                                <Button
                                                    danger
                                                    onClick={() =>
                                                        deleteBonusAsync(
                                                            ctx,
                                                            bonus.id,
                                                        )
                                                    }
                                                >
                                                    Удалить
                                                </Button>
                                            </SListItem>
                                        ))}
                                    </SList>
                                </SSummaryCard>

                                <SSummaryCard $theme={theme}>
                                    <SSectionHeader>
                                        <SSectionTitle>Зарплата</SSectionTitle>
                                        <SSectionHint>
                                            Рассчитайте зарплату за выбранный
                                            период.
                                        </SSectionHint>
                                    </SSectionHeader>

                                    <SFormGrid>
                                        <Select
                                            value={month}
                                            options={monthOptions}
                                            onChange={(value) =>
                                                accountantMonthAtom(ctx, value)
                                            }
                                        />
                                        <Select
                                            value={year}
                                            options={yearOptions}
                                            onChange={(value) =>
                                                accountantYearAtom(ctx, value)
                                            }
                                        />
                                        <Button
                                            type="primary"
                                            loading={calculatePayrollLoading}
                                            disabled={
                                                !selectedEmployee?.employeeId
                                            }
                                            onClick={() =>
                                                calculatePayrollAsync(ctx)
                                            }
                                        >
                                            Рассчитать
                                        </Button>
                                    </SFormGrid>

                                    <SList>
                                        {payrolls.map((payroll) => (
                                            <SListItem
                                                key={payroll.id}
                                                $theme={theme}
                                            >
                                                <div>
                                                    <SListTitle>
                                                        {payroll.month}/
                                                        {payroll.year}:{' '}
                                                        {formatMoney(
                                                            payroll.finalSalary,
                                                        )}{' '}
                                                        ₽
                                                    </SListTitle>
                                                    <SListMeta>
                                                        База{' '}
                                                        {formatMoney(
                                                            payroll.baseSalary,
                                                        )}
                                                        , премии{' '}
                                                        {formatMoney(
                                                            payroll.bonusPayment,
                                                        )}
                                                        , NDFL{' '}
                                                        {formatMoney(
                                                            payroll.ndflAmount,
                                                        )}
                                                    </SListMeta>
                                                </div>
                                            </SListItem>
                                        ))}
                                    </SList>
                                </SSummaryCard>
                            </>
                        )}
                    </SWorkspace>
                </SAccountantLayout>
            )
        },
    )
