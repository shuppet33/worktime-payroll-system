import type { Employee } from '$entities/employee';

import {
    SEmployeeCard,
    SEmployeeName,
    SEmployeePosition,
    SEmployeeType,
} from './styles';

interface Props {
    employee: Employee;
    onSelect: (employeeId: number) => void;
}

export const CompanyEmployeeCard =
    ({ employee, onSelect }: Props) => {
        return (
            <SEmployeeCard
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

                <SEmployeePosition>
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
    };
