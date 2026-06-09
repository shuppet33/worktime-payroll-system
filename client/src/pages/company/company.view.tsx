import { reatomComponent } from '@reatom/npm-react'

import { Navigate, useNavigate, useParams } from 'react-router'

import { Footer } from '$widgets/layout/footer'
import { Header } from '$widgets/layout/header'

import {
    deleteAsync,
    deleteMemberAsync,
    membersResource,
} from '$features/company/company.service.ts'
import { CompanyAccountantDashboard } from '$features/company/company-accountant-dashboard'
import { CompanyEmployeeDashboard } from '$features/company/company-employee-dashboard'
import {
    closeDeleteMemberModalAction,
    deleteMemberModalOpenAtom,
    openDeleteMemberModalAction,
    selectedMemberForDeleteIdAtom,
    selectMemberAction,
} from '$features/company/company-member-modal/company-member-modal.reatom.ts'
import { CompanyOwnerDashboard } from '$features/company/company-owner-dashboard'
import {
    deleteCompanyModalOpenAtom,
    openSettingsModalAction,
} from '$features/company/company-settings-modal/company-settings-modal.reatom.ts'

import { userAtom } from '$entities/auth.ts'
import { companyMembersAtom } from '$entities/company.ts'

import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'
import { appThemeAtom } from '$shared/theme.ts'

import {
    SCompanyContent,
    SCompanyHeader,
    SCompanyPageWrapper,
    SCompanyRole,
    SPageTitle,
} from './styles'

export const CompanyPage = reatomComponent(({ ctx }) => {
    const { companyId } = useParams()
    const navigate = useNavigate()
    const user = ctx.spy(userAtom)
    const appTheme = ctx.spy(appThemeAtom)
    const selectedCompanyId = ctx.spy(selectedCompanyIdAtom)
    const members = ctx.spy(companyMembersAtom)
    const deleteMemberModalOpen = ctx.spy(deleteMemberModalOpenAtom)
    const deleteCompanyModalOpen = ctx.spy(deleteCompanyModalOpenAtom)
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
            <Navigate to={`/company/${fallbackCompany.company_id}`} replace />
        )
    }

    if (selectedCompanyId !== selectedCompany.company_id) {
        selectedCompanyIdAtom(ctx, selectedCompany.company_id)
    }

    const { isPending: membersLoading, isRejected: membersRejected } = ctx.spy(
        membersResource.statusesAtom,
    )
    const membersError = ctx.spy(membersResource.errorAtom)
    const { isPending: deleteMemberLoading, isRejected: deleteMemberRejected } =
        ctx.spy(deleteMemberAsync.statusesAtom)
    const deleteMemberError = ctx.spy(deleteMemberAsync.errorAtom)
    const { isPending: deleteLoading, isRejected: deleteRejected } = ctx.spy(
        deleteAsync.statusesAtom,
    )
    const deleteError = ctx.spy(deleteAsync.errorAtom)

    const selectedMemberForDelete = members.find(
        (member) => member.id === selectedMemberForDeleteId,
    )

    const deleteMemberMessage = `Удалить "${selectedMemberForDelete?.login ?? ''}" из "${selectedCompany.company_name}"?`
    const deleteCompanyMessage = `Удалить компанию "${selectedCompany.company_name}"?`

    const handleOpenSettings = () => {
        deleteAsync.errorAtom.reset(ctx)
        openSettingsModalAction(ctx, selectedCompany.company_name)
    }

    const handleDeleteMember = (memberId: string) => {
        deleteMemberAsync.errorAtom.reset(ctx)
        openDeleteMemberModalAction(ctx, memberId)
    }

    const handleConfirmDeleteMember = async () => {
        try {
            deleteMemberAsync.errorAtom.reset(ctx)
            await deleteMemberAsync(ctx, selectedCompany.company_id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleConfirmDeleteCompany = async () => {
        try {
            deleteAsync.errorAtom.reset(ctx)
            await deleteAsync(ctx, selectedCompany.company_id)

            const nextCompany = ctx.get(userAtom)?.companies?.[0]

            if (nextCompany) {
                selectedCompanyIdAtom(ctx, nextCompany.company_id)
                navigate(`/company/${nextCompany.company_id}`)
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
                    <SCompanyRole>Роль: {selectedCompany.role}</SCompanyRole>
                </SCompanyHeader>

                {selectedCompany.role === 'OWNER' && (
                    <CompanyOwnerDashboard
                        company={selectedCompany}
                        deleteCompanyError={deleteError}
                        deleteCompanyLoading={deleteLoading}
                        deleteCompanyMessage={deleteCompanyMessage}
                        deleteCompanyModalOpen={deleteCompanyModalOpen}
                        deleteCompanyRejected={deleteRejected}
                        deleteMemberError={deleteMemberError}
                        deleteMemberLoading={deleteMemberLoading}
                        deleteMemberMessage={deleteMemberMessage}
                        deleteMemberModalOpen={deleteMemberModalOpen}
                        deleteMemberRejected={deleteMemberRejected}
                        members={members}
                        membersError={membersError}
                        membersLoading={membersLoading}
                        membersRejected={membersRejected}
                        onCancelDeleteCompany={() => {
                            deleteAsync.errorAtom.reset(ctx)
                            deleteCompanyModalOpenAtom(ctx, false)
                        }}
                        onCancelDeleteMember={() => {
                            deleteMemberAsync.errorAtom.reset(ctx)
                            closeDeleteMemberModalAction(ctx)
                        }}
                        onConfirmDeleteCompany={handleConfirmDeleteCompany}
                        onConfirmDeleteMember={handleConfirmDeleteMember}
                        onDeleteMember={handleDeleteMember}
                        onOpenSettings={handleOpenSettings}
                        onSelectMember={(memberId) =>
                            selectMemberAction(ctx, memberId)
                        }
                    />
                )}

                {selectedCompany.role === 'ACCOUNTANT' && (
                    <CompanyAccountantDashboard
                        company={selectedCompany}
                        error={membersError}
                        loading={membersLoading}
                        members={members}
                        showError={membersRejected}
                        theme={appTheme}
                        onSelectMember={(memberId) =>
                            selectMemberAction(ctx, memberId)
                        }
                    />
                )}

                {selectedCompany.role === 'EMPLOYEE' && (
                    <CompanyEmployeeDashboard
                        company={selectedCompany}
                        theme={appTheme}
                    />
                )}
            </SCompanyContent>

            <Footer />
        </SCompanyPageWrapper>
    )
})
