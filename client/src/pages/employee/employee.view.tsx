import {useMemo} from 'react';

import {reatomComponent} from "@reatom/npm-react";

import {Footer} from "$widgets/layout/footer";
import {Header} from '$widgets/layout/header';

import {EmployeeCalendar} from "$features/employee/employee-calendar";
import {EmployeeDetailsCard} from '$features/employee/employee-details-card'
import {EmployeeProfileCard} from '$features/employee/employee-profile-card'

import {MOCK_DAYS, MOCK_FIXED_DAYS} from "$entities/work-day";

import {
    calendarMonthAtom,
    calendarYearAtom,
    paymentTypeAtom,
    selectedDayAtom,
} from './employee.reatom.ts'
import {SContent, SMainGrid, SPage, SRateType, SRightColumn} from './styles.ts'


export const EmployeePage = reatomComponent(({ctx}) => {
    const selectedDay = ctx.spy(selectedDayAtom)
    const paymentType = ctx.spy(paymentTypeAtom)
    const calendarMonth = ctx.spy(calendarMonthAtom)
    const calendarYear = ctx.spy(calendarYearAtom)
    const workDays = paymentType === 'hourly' ? MOCK_DAYS : MOCK_FIXED_DAYS;

    const selectedDayData = useMemo(() => {
        return workDays.find(
            (item) => item.day === selectedDay,
        );
    }, [selectedDay, workDays]);


    return (
        <SPage>
            <Header/>

            <SContent>
                <SRateType>
                    Вид ставки:
                    <strong>
                        {' '}
                        почасовая
                    </strong>
                </SRateType>

                <SMainGrid>
                    <EmployeeCalendar
                        month={calendarMonth}
                        onSelectDay={(day) =>
                            selectedDayAtom(ctx, day)
                        }
                        paymentType={paymentType}
                        selectedDay={selectedDay}
                        workDays={workDays}
                        year={calendarYear}
                    />

                    <SRightColumn>
                        <EmployeeDetailsCard
                            selectedDay={selectedDay}
                            paymentType={paymentType}
                            dayData={selectedDayData}
                        />

                        <EmployeeProfileCard/>
                    </SRightColumn>
                </SMainGrid>
            </SContent>

            <Footer/>
        </SPage>
    );
});
