import {Button, Input, Select} from 'antd';

import {reatomComponent} from '@reatom/npm-react';

import {Footer} from '$widgets/layout/footer'
import {Header} from '$widgets/layout/header';

import {CompanyEmployeeCard} from '$features/company/company-employee-card';
import {CompanyEmployeeModal} from '$features/company/company-employee-modal';

import {MOCK_EMPLOYEES} from '$entities/employee';

import {employeeModalOpenAtom, selectedEmployeeAtom} from './company.model.ts';
import {SCompanyContent, SCompanyGrid, SCompanyPageWrapper, SFilters, SPageTitle, SSearchWrapper} from './styles';

export const CompanyPage = reatomComponent(({ctx}) => {
    const employeeModalOpen = ctx.spy(employeeModalOpenAtom);
    const selectedEmployeeId = ctx.spy(selectedEmployeeAtom);

    const selectedEmployee = MOCK_EMPLOYEES.find(
        (employee) => employee.id === selectedEmployeeId,
    );

    const handleSelectEmployee = (employeeId: number) => {
        selectedEmployeeAtom(ctx, employeeId);
        employeeModalOpenAtom(ctx, true);
    };

    const handleCloseEmployeeModal = () => {
        employeeModalOpenAtom(ctx, false);
    };

    return (
        <SCompanyPageWrapper>
            <Header />

            <SCompanyContent>
                <SPageTitle>
                    Сотрудники
                </SPageTitle>

                <SFilters>
                    <Button type="primary">
                        Добавить сотрудника
                    </Button>

                    <SSearchWrapper>
                        <Input
                            placeholder="Поиск по имени"
                        />
                    </SSearchWrapper>

                    <Select
                        allowClear
                        placeholder="Тип ставки"
                        style={{
                            width: 220,
                        }}
                        options={[
                            {
                                value: 'hourly',
                                label: 'Почасовая',
                            },
                            {
                                value: 'fixed',
                                label: 'Фиксированная',
                            },
                        ]}
                    />

                    <Select
                        allowClear
                        placeholder="Должность"
                        style={{
                            width: 240,
                        }}
                        options={[
                            {
                                value: 'frontend',
                                label: 'Frontend Developer',
                            },
                            {
                                value: 'backend',
                                label: 'Backend Developer',
                            },
                            {
                                value: 'designer',
                                label: 'Designer',
                            },
                        ]}
                    />
                </SFilters>

                <SCompanyGrid>
                    {MOCK_EMPLOYEES.map(
                        (employee) => (
                            <CompanyEmployeeCard
                                key={
                                    employee.id
                                }
                                employee={
                                    employee
                                }
                                onSelect={
                                    handleSelectEmployee
                                }
                            />
                        ),
                    )}
                </SCompanyGrid>
            </SCompanyContent>
            
            <Footer />

            <CompanyEmployeeModal
                employee={selectedEmployee}
                open={employeeModalOpen}
                onClose={handleCloseEmployeeModal}
            />
        </SCompanyPageWrapper>
    );
});
