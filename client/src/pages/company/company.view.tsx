import { Button, Input, Select } from 'antd'

import { reatomComponent } from '@reatom/npm-react'

import { Navigate, useParams } from 'react-router'

import { Footer } from '$widgets/layout/footer'
import { Header } from '$widgets/layout/header'

import { CompanyEmployeeCard } from '$features/company/company-employee-card'
import { CompanyEmployeeModal } from '$features/company/company-employee-modal'

import { userAtom } from '$entities/auth.ts'
import { MOCK_EMPLOYEES } from '$entities/employee'

import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'
import { appThemeAtom } from '$shared/theme.ts'

import { employeeModalOpenAtom, selectedEmployeeAtom } from './company.model.ts'
import {
    SCompanyContent,
    SCompanyGrid,
    SCompanyHeader,
    SCompanyPageWrapper,
    SCompanyRole,
    SFilters,
    SPageTitle,
    SSearchWrapper,
} from './styles'

export const CompanyPage = reatomComponent(({ ctx }) => {
    const { companyId } = useParams()
    const user = ctx.spy(userAtom)
    const appTheme = ctx.spy(appThemeAtom)
    const selectedCompanyId = ctx.spy(selectedCompanyIdAtom)
    const employeeModalOpen = ctx.spy(employeeModalOpenAtom)
    const selectedEmployeeId = ctx.spy(selectedEmployeeAtom)

    const companies = user?.companies ?? []
    const firstCompany = companies[0]
    const savedCompany = companies.find(
        (company) => company.company_id === selectedCompanyId,
    )
    const selectedCompany = companies.find(
        (company) => company.company_id === companyId,
    )

    if (!firstCompany) {
        return <Navigate to="/account" replace />
    }

    if (!selectedCompany) {
        const fallbackCompany = savedCompany ?? firstCompany

        return (
            <Navigate
                to={`/companies/${fallbackCompany.company_id}`}
                replace
            />
        )
    }

    selectedCompanyIdAtom(ctx, selectedCompany.company_id)

    const selectedEmployee = MOCK_EMPLOYEES.find(
        (employee) => employee.id === selectedEmployeeId,
    )

    const handleSelectEmployee = (employeeId: number) => {
        selectedEmployeeAtom(ctx, employeeId)
        employeeModalOpenAtom(ctx, true)
    }

    const handleCloseEmployeeModal = () => {
        employeeModalOpenAtom(ctx, false)
    }

    return (
        <SCompanyPageWrapper $theme={appTheme}>
            <Header showProfileLink />

            <SCompanyContent>
                <SCompanyHeader>
                    <SPageTitle>
                        {selectedCompany.company_name}
                    </SPageTitle>

                    <SCompanyRole>
                        Должность: {selectedCompany.role}
                    </SCompanyRole>
                </SCompanyHeader>

                <SFilters>
                    <Button type="primary">
                        Добавить сотрудника
                    </Button>

                    <SSearchWrapper>
                        <Input placeholder="Поиск по имени" />
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
                    {MOCK_EMPLOYEES.map((employee) => (
                        <CompanyEmployeeCard
                            key={employee.id}
                            employee={employee}
                            onSelect={handleSelectEmployee}
                        />
                    ))}
                </SCompanyGrid>
            </SCompanyContent>

            <Footer />

            <CompanyEmployeeModal
                employee={selectedEmployee}
                open={employeeModalOpen}
                onClose={handleCloseEmployeeModal}
            />
        </SCompanyPageWrapper>
    )
})
