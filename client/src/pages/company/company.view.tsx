import { Button, Input } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import { Navigate, useNavigate, useParams } from 'react-router'

import { Footer } from '$widgets/layout/footer'
import { Header } from '$widgets/layout/header'

import { deleteAsync, membersResource } from '$features/company/company.service.ts'
import { CompanyMembersGrid } from '$features/company/company-members-grid'
import { CompanyModals } from '$features/company/company-modals'
import {
    openDeleteMemberModalAction,
    openSettingsModalAction,
    selectedMemberForDeleteIdAtom,
    selectedMemberIdAtom,
    selectMemberAction,
} from '$features/company/company-modals/company-modals.reatom.ts'

import { userAtom } from '$entities/auth.ts'

import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'
import { appThemeAtom } from '$shared/theme.ts'

import {
    SCompanyContent,
    SCompanyHeader,
    SCompanyPageWrapper,
    SCompanyRole,
    SFilterActions,
    SFilters,
    SPageTitle,
    SSearchWrapper,
} from './styles'

export const CompanyPage = reatomComponent(({ ctx }) => {
    const { companyId } = useParams()
    const navigate = useNavigate()
    const user = ctx.spy(userAtom)
    const appTheme = ctx.spy(appThemeAtom)
    const selectedCompanyId = ctx.spy(selectedCompanyIdAtom)
    const selectedMemberId = ctx.spy(selectedMemberIdAtom)
    const selectedMemberForDeleteId = ctx.spy(selectedMemberForDeleteIdAtom)

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
            <Navigate to={`/companies/${fallbackCompany.company_id}`} replace />
        )
    }

    if (selectedCompanyId !== selectedCompany.company_id) {
        selectedCompanyIdAtom(ctx, selectedCompany.company_id)
    }

    const membersData = ctx.spy(membersResource.dataAtom)
    const {
        isPending: membersLoading,
        isRejected: membersRejected,
    } = ctx.spy(membersResource.statusesAtom)
    const membersError = ctx.spy(membersResource.errorAtom)

    const members =
        membersData.companyId === selectedCompany.company_id
            ? membersData.members
            : []

    const selectedMember = members.find(
        (member) => member.id === selectedMemberId,
    )
    const selectedMemberForDelete = members.find(
        (member) => member.id === selectedMemberForDeleteId,
    )

    const canManageCompany = selectedCompany.role === 'OWNER'

    const handleConfirmDeleteCompany = async () => {
        try {
            deleteAsync.errorAtom.reset(ctx)
            await deleteAsync(ctx, selectedCompany.company_id)

            const nextCompany = ctx.get(userAtom)?.companies?.[0]

            if (nextCompany) {
                selectedCompanyIdAtom(ctx, nextCompany.company_id)
                navigate(`/companies/${nextCompany.company_id}`)
                return
            }

            selectedCompanyIdAtom(ctx, null)
            navigate('/account')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <SCompanyPageWrapper $theme={appTheme}>
            <Header showProfileLink />

            <SCompanyContent>
                <SCompanyHeader>
                    <SPageTitle>{selectedCompany.company_name}</SPageTitle>

                    <SCompanyRole>
                        Должность: {selectedCompany.role}
                    </SCompanyRole>
                </SCompanyHeader>

                <SFilters>
                    <SFilterActions>
                        <Button type="primary">Добавить сотрудника</Button>

                        {canManageCompany && (
                            <Button
                                aria-label="Настройки компании"
                                icon={<SettingOutlined />}
                                onClick={() => {
                                    deleteAsync.errorAtom.reset(ctx)
                                    openSettingsModalAction(
                                        ctx,
                                        selectedCompany.company_name,
                                    )
                                }}
                            />
                        )}
                    </SFilterActions>

                    <SSearchWrapper>
                        <Input placeholder="Поиск по имени" />
                    </SSearchWrapper>
                </SFilters>

                <CompanyMembersGrid
                    canDelete={canManageCompany}
                    error={membersError}
                    loading={membersLoading}
                    members={members}
                    showError={membersRejected}
                    onDelete={(memberId) => {
                        deleteAsync.errorAtom.reset(ctx)
                        openDeleteMemberModalAction(ctx, memberId)
                    }}
                    onSelect={(memberId) =>
                        selectMemberAction(ctx, memberId)
                    }
                />

                <CompanyModals
                    selectedCompany={selectedCompany}
                    selectedMember={selectedMember}
                    selectedMemberForDelete={selectedMemberForDelete}
                    onConfirmDeleteCompany={handleConfirmDeleteCompany}
                />
            </SCompanyContent>

            <Footer />
        </SCompanyPageWrapper>
    )
})
