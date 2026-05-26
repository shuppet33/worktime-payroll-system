import { Select } from 'antd';

import { reatomComponent } from '@reatom/npm-react';

import {
    paymentTypeAtom,
    selectedDayAtom,
} from '$pages/employee/employee.model';
import {MOCK_DAYS, MOCK_FIXED_DAYS} from '$pages/employee/mock-days';

import { generateCalendarDays } from './generate-calendar-days.utils';
import {
    CalendarCard,
    CalendarTop,
    CardTitle,
    DayCard,
    DayHours,
    DayNumber,
    DaysGrid,
    EmptyCell,
    Hint,
    WeekDay,
    WeekDays,
} from './styles';

export const EmployeeCalendar =
    reatomComponent(({ ctx }) => {
        const selectedDay = ctx.spy(
            selectedDayAtom,
        );

        const paymentType = ctx.spy(
            paymentTypeAtom,
        );

        const days =
            generateCalendarDays(
                7,
                2026,
            );

        return (
            <CalendarCard>
                <CalendarTop>
                    <CardTitle>
                        Календарь
                    </CardTitle>

                    <Select
                        defaultValue="Май"
                        style={{
                            width: 100,
                        }}
                        options={[
                            {
                                value: 'Май',
                                label: 'Май',
                            },
                        ]}
                    />
                </CalendarTop>

                <WeekDays>
                    <WeekDay>
                        Пн
                    </WeekDay>
                    <WeekDay>
                        Вт
                    </WeekDay>
                    <WeekDay>
                        Ср
                    </WeekDay>
                    <WeekDay>
                        Чт
                    </WeekDay>
                    <WeekDay>
                        Пт
                    </WeekDay>
                    <WeekDay>
                        Сб
                    </WeekDay>
                    <WeekDay>
                        Вс
                    </WeekDay>
                </WeekDays>

                <DaysGrid>
                    {days.map(
                        (day, index) => {
                            if (!day) {
                                return (
                                    <EmptyCell
                                        key={
                                            index
                                        }
                                    />
                                );
                            }

                            const dayData =
                                (paymentType === 'hourly' ? MOCK_DAYS : MOCK_FIXED_DAYS).find(
                                    (
                                        item,
                                    ) =>
                                        item.day ===
                                        day,
                                );

                            const worked =
                                dayData?.worked ??
                                true;

                            return (
                                <DayCard
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
                                        selectedDayAtom(
                                            ctx,
                                            day,
                                        )
                                    }
                                >
                                    <DayNumber>
                                        {day}
                                    </DayNumber>

                                    <DayHours>
                                        {paymentType ===
                                        'hourly'
                                            ? dayData?.hours ||
                                            '0ч'
                                            : worked
                                                ? 'Рабочий'
                                                : 'Выходной'}
                                    </DayHours>
                                </DayCard>
                            );
                        },
                    )}
                </DaysGrid>

                <Hint>
                    Нажмите на
                    день, чтобы
                    посмотреть
                    детали
                </Hint>
            </CalendarCard>
        );
    });