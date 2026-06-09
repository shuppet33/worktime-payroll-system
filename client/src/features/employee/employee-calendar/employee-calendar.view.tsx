import { Select } from 'antd'

import dayjs from 'dayjs'

import type { EmployeeCalendarProps } from './employee-calendar.types.ts'
import { generateCalendarDays } from './generate-calendar-days.utils'
import {
    SCalendarCard,
    SCalendarTop,
    SCardTitle,
    SDayCard,
    SDayHours,
    SDayNumber,
    SDaysGrid,
    SEmptyCell,
    SHint,
    SPeriodControls,
    SWeekDay,
    SWeekDays,
} from './styles'

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1

    return {
        value: month,
        label: dayjs().month(index).format('MMMM'),
    }
})

const currentYear = dayjs().year()

const YEAR_OPTIONS = Array.from({ length: 7 }, (_, index) => {
    const year = currentYear - 3 + index

    return {
        value: year,
        label: String(year),
    }
})

export const EmployeeCalendar = ({
    loading = false,
    month,
    onMonthChange,
    onSelectDay,
    onYearChange,
    paymentType,
    selectedDay,
    theme = 'dark',
    workDays,
    year,
}: EmployeeCalendarProps) => {
    const days = generateCalendarDays(month, year)

    return (
        <SCalendarCard $theme={theme}>
            <SCalendarTop>
                <SCardTitle>Календарь</SCardTitle>

                <SPeriodControls>
                    <Select
                        value={month}
                        style={{ width: 120 }}
                        options={MONTH_OPTIONS}
                        onChange={onMonthChange}
                    />

                    <Select
                        value={year}
                        style={{ width: 96 }}
                        options={YEAR_OPTIONS}
                        onChange={onYearChange}
                    />
                </SPeriodControls>
            </SCalendarTop>

            <SWeekDays>
                <SWeekDay>Пн</SWeekDay>
                <SWeekDay>Вт</SWeekDay>
                <SWeekDay>Ср</SWeekDay>
                <SWeekDay>Чт</SWeekDay>
                <SWeekDay>Пт</SWeekDay>
                <SWeekDay>Сб</SWeekDay>
                <SWeekDay>Вс</SWeekDay>
            </SWeekDays>

            <SDaysGrid>
                {days.map((day, index) => {
                    if (!day) {
                        return <SEmptyCell key={index} />
                    }

                    const dayData = workDays.find((item) => item.day === day)
                    const worked = dayData?.worked ?? true

                    return (
                        <SDayCard
                            key={day}
                            $theme={theme}
                            selected={selectedDay === day}
                            inactive={paymentType === 'fixed' && !worked}
                            onClick={() => onSelectDay(day)}
                        >
                            <SDayNumber>{day}</SDayNumber>

                            <SDayHours>
                                {loading
                                    ? '...'
                                    : paymentType === 'hourly'
                                      ? dayData?.hours || '0ч'
                                      : worked
                                        ? 'Рабочий'
                                        : 'Выходной'}
                            </SDayHours>
                        </SDayCard>
                    )
                })}
            </SDaysGrid>

            <SHint>Выберите день, чтобы посмотреть детали</SHint>
        </SCalendarCard>
    )
}
