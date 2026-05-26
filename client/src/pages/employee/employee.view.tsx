import {useMemo} from 'react';

import {reatomComponent} from "@reatom/npm-react";

import {EmployeeCalendar} from "$features/employee/employee-calendar";
import {EmployeeDetailsCard} from '$features/employee/employee-details-card'
import {EmployeeProfileCard} from '$features/employee/employee-profile-card'
import {Footer} from "$features/layout/footer";
import {Header} from '$features/layout/header';

import {paymentTypeAtom, selectedDayAtom} from "./employee.model.ts";
import {MOCK_DAYS, MOCK_FIXED_DAYS} from "./mock-days.ts";
import {Content, MainGrid, Page, RateType, RightColumn} from './styles.ts'


export const EmployeePage = reatomComponent(({ctx}) => {
    const selectedDay = ctx.spy(selectedDayAtom)
    const paymentType = ctx.spy(paymentTypeAtom)

    const selectedDayData = useMemo(() => {
        return (paymentType === 'hourly' ? MOCK_DAYS : MOCK_FIXED_DAYS).find(
            (item) => item.day === selectedDay,
        );
    }, [paymentType, selectedDay]);


    return (
        <Page>
            <Header/>

            <Content>
                <RateType>
                    Вид ставки:
                    <strong>
                        {' '}
                        почасовая
                    </strong>
                </RateType>

                <MainGrid>
                    <EmployeeCalendar/>

                    <RightColumn>
                        <EmployeeDetailsCard selectedDay={selectedDay} dayData={selectedDayData}/>

                        <EmployeeProfileCard/>
                    </RightColumn>
                </MainGrid>
            </Content>

            <Footer/>
        </Page>
    );
});
