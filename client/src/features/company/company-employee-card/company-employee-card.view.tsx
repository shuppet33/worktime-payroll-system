import { reatomComponent } from '@reatom/npm-react';

import {
    employeeModalOpenAtom,
    selectedEmployeeAtom,
} from '$pages/company/company.model.ts';

import {
    EmployeeCard,
    EmployeeName,
    EmployeePosition,
    EmployeeType,
} from './styles';

interface Props {
    employee: {
        id: number;
        firstName: string;
        lastName: string;
        position: string;
        paymentType: string;
    };
}

export const CompanyEmployeeCard =
    reatomComponent<Props>(
        ({ ctx, employee }) => {
            return (
                <EmployeeCard
                    onClick={() => {
                        selectedEmployeeAtom(
                            ctx,
                            employee.id,
                        );

                        employeeModalOpenAtom(
                            ctx,
                            true,
                        );
                    }}
                >
                    <EmployeeName>
                        {
                            employee.lastName
                        }{' '}
                        {
                            employee.firstName
                        }
                    </EmployeeName>

                    <EmployeePosition>
                        {
                            employee.position
                        }
                    </EmployeePosition>

                    <EmployeeType>
                        {
                            employee.paymentType
                        }
                    </EmployeeType>
                </EmployeeCard>
            );
        },
    );