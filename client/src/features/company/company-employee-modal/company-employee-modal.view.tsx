import { Modal } from 'antd';

import { reatomComponent } from '@reatom/npm-react';

import {
    employeeModalOpenAtom,
    selectedEmployeeAtom,
} from '$pages/company/company.model.ts';
import { MOCK_EMPLOYEES } from '$pages/company/mock-employees.ts';

export const CompanyEmployeeModal =
    reatomComponent(({ ctx }) => {
        const open = ctx.spy(
            employeeModalOpenAtom,
        );

        const selectedEmployeeId =
            ctx.spy(
                selectedEmployeeAtom,
            );

        const employee =
            MOCK_EMPLOYEES.find(
                (item) =>
                    item.id ===
                    selectedEmployeeId,
            );

        return (
            <Modal
                open={open}
                onCancel={() =>
                    employeeModalOpenAtom(
                        ctx,
                        false,
                    )
                }
                footer={null}
                title="Сотрудник"
            >
                <p>
                    {
                        employee?.lastName
                    }{' '}
                    {
                        employee?.firstName
                    }
                </p>

                <p>
                    {
                        employee?.position
                    }
                </p>

                <p>
                    {
                        employee?.paymentType
                    }
                </p>
            </Modal>
        );
    });