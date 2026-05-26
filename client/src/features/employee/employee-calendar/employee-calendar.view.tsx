import {Select} from "antd";

import {reatomComponent} from "@reatom/npm-react";

import {selectedDayAtom} from "$pages/employee/employee.model";
import {MOCK_DAYS} from "$pages/employee/mock-days";

import {generateCalendarDays} from "./generate-calendar-days.utils";
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
    WeekDays
} from './styles.ts'


export const EmployeeCalendar = reatomComponent(({ctx}) => {
    const selectedDay = ctx.spy(selectedDayAtom)

    const days = generateCalendarDays(
        7,
        2026,
    );

    return (
        <CalendarCard>
            <CalendarTop>
                <CardTitle>
                    Календарь списаний
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
                {days.map((day, index) => {
                    if (!day) {
                        return (
                            <EmptyCell key={index}/>
                        );
                    }

                    const dayData = MOCK_DAYS.find(
                        (item) => item.day === day,
                    );

                    return (
                        <DayCard
                            key={day}
                            selected={
                                selectedDay === day
                            }
                            onClick={() =>
                                selectedDayAtom(ctx, day)
                            }
                        >
                            <DayNumber>
                                {day}
                            </DayNumber>

                            <DayHours>
                                {dayData?.hours || '0ч'}
                            </DayHours>
                        </DayCard>
                    );
                })}
            </DaysGrid>

            <Hint>
                Нажмите на день,
                чтобы посмотреть
                детали
            </Hint>
        </CalendarCard>
    )
})