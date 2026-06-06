import { reatomComponent } from '@reatom/npm-react'

import type { Employee } from '$entities/employee';

import { appThemeAtom } from '$shared/theme.ts'

import {
    SEmployeeCard,
    SEmployeeName,
    SEmployeePosition,
    SEmployeeType,
} from './styles';

type Props = {
    employee: Employee;
    onSelect: (employeeId: number) => void;
}

export const CompanyEmployeeCard =
    reatomComponent<Props>(({ ctx, employee, onSelect }) => {
        const appTheme = ctx.spy(appThemeAtom)

        return (
            <SEmployeeCard
                $theme={appTheme}
                onClick={() => onSelect(employee.id)}
            >
                <SEmployeeName>
                    {
                        employee.lastName
                    }{' '}
                    {
                        employee.firstName
                    }
                </SEmployeeName>

                <SEmployeePosition $theme={appTheme}>
                    {
                        employee.position
                    }
                </SEmployeePosition>

                <SEmployeeType>
                    {
                        employee.paymentType
                    }
                </SEmployeeType>
            </SEmployeeCard>
        );
    });
