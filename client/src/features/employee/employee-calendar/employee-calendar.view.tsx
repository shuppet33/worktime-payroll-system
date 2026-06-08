import { Select } from 'antd';

import type { EmployeeCalendarProps } from './employee-calendar.types.ts';
import { generateCalendarDays } from './generate-calendar-days.utils';
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
    SWeekDay,
    SWeekDays,
} from './styles';

const MONTH_OPTIONS = [
    {
        value: 5,
        label: 'Май',
    },
];

export const EmployeeCalendar =
    ({
        month,
        onSelectDay,
        paymentType,
        selectedDay,
        workDays,
        year,
    }: EmployeeCalendarProps) => {
        const days =
            generateCalendarDays(
                month,
                year,
            );

        return (
            <SCalendarCard>
                <SCalendarTop>
                    <SCardTitle>
                        Календарь
                    </SCardTitle>

                    <Select
                        value={month}
                        style={{
                            width: 100,
                        }}
                        options={MONTH_OPTIONS}
                    />
                </SCalendarTop>

                <SWeekDays>
                    <SWeekDay>
                        Пн
                    </SWeekDay>
                    <SWeekDay>
                        Вт
                    </SWeekDay>
                    <SWeekDay>
                        Ср
                    </SWeekDay>
                    <SWeekDay>
                        Чт
                    </SWeekDay>
                    <SWeekDay>
                        Пт
                    </SWeekDay>
                    <SWeekDay>
                        Сб
                    </SWeekDay>
                    <SWeekDay>
                        Вс
                    </SWeekDay>
                </SWeekDays>

                <SDaysGrid>
                    {days.map(
                        (day, index) => {
                            if (!day) {
                                return (
                                    <SEmptyCell
                                        key={
                                            index
                                        }
                                    />
                                );
                            }

                            const dayData =
                                workDays.find(
                                    (item) =>
                                        item.day === day,
                                );

                            const worked =
                                dayData?.worked ??
                                true;

                            return (
                                <SDayCard
                                    key={day}
                                    selected={
                                        selectedDay ===
                                        day
                                    }
                                    inactive={
                                        paymentType ===
                                        'fixed' &&
                                        !worked
                                    }
                                    onClick={() =>
                                        onSelectDay(day)
                                    }
                                >
                                    <SDayNumber>
                                        {day}
                                    </SDayNumber>

                                    <SDayHours>
                                        {paymentType ===
                                        'hourly'
                                            ? dayData?.hours ||
                                            '0ч'
                                            : worked
                                                ? 'Рабочий'
                                                : 'Выходной'}
                                    </SDayHours>
                                </SDayCard>
                            );
                        },
                    )}
                </SDaysGrid>

                <SHint>
                    Нажмите на
                    день, чтобы
                    посмотреть
                    детали
                </SHint>
            </SCalendarCard>
        );
    };
