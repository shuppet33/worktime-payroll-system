import {Button, Input, Select} from 'antd';

import {CompanyEmployeeCard} from '$features/company/company-employee-card';
import {CompanyEmployeeModal} from '$features/company/company-employee-modal';
import {Footer} from '$features/layout/footer'
import {Header} from '$features/layout/header';

import {MOCK_EMPLOYEES} from './mock-employees.ts';
import {CompanyContent, CompanyGrid, CompanyPageWrapper, Filters, PageTitle, SearchWrapper} from './styles';

const HEADER_PAGES = [
    {
        key: 'employees',
        title: 'Сотрудники',
    },
    {
        key: 'payments',
        title: 'Выплаты',
    },
];

export const CompanyPage = () => {
    return (
        <CompanyPageWrapper>
            <Header />

            <CompanyContent>
                <PageTitle>
                    Сотрудники
                </PageTitle>

                <Filters>
                    <Button type="primary">
                        Добавить сотрудника
                    </Button>

                    <SearchWrapper>
                        <Input
                            placeholder="Поиск по имени"
                        />
                    </SearchWrapper>

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
                </Filters>

                <CompanyGrid>
                    {MOCK_EMPLOYEES.map(
                        (employee) => (
                            <CompanyEmployeeCard
                                key={
                                    employee.id
                                }
                                employee={
                                    employee
                                }
                            />
                        ),
                    )}
                </CompanyGrid>
            </CompanyContent>
            
            <Footer />

            <CompanyEmployeeModal/>
        </CompanyPageWrapper>
    );
};