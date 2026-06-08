import { Button, Input } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import { Navigate, useNavigate, useParams } from 'react-router'

import { Footer } from '$widgets/layout/footer'
import { Header } from '$widgets/layout/header'

import {
    deleteAsync,
    membersResource,
} from '$features/company/company.service.ts'
import { CompanyInviteModal } from '$features/company/company-invite-modal'
import { CompanyMemberModal } from '$features/company/company-member-modal'
import {
    closeDeleteMemberModalAction,
    deleteMemberModalOpenAtom,
    openDeleteMemberModalAction,
    selectedMemberForDeleteIdAtom,
    selectMemberAction,
} from '$features/company/company-member-modal/company-member-modal.reatom.ts'
import { CompanyMembersGrid } from '$features/company/company-members-grid'
import { CompanySettingsModal } from '$features/company/company-settings-modal'
import {
    deleteCompanyModalOpenAtom,
    openSettingsModalAction,
} from '$features/company/company-settings-modal/company-settings-modal.reatom.ts'
import { ConfirmModal } from '$features/shared/confirm-modal'

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
            <Navigate to={`/companies/${fallbackCompany.company_id}`} replace />
        )
    }

    if (selectedCompanyId !== selectedCompany.company_id) {
        selectedCompanyIdAtom(ctx, selectedCompany.company_id)
    }

    const membersData = ctx.spy(membersResource.dataAtom)
    const { isPending: membersLoading, isRejected: membersRejected } = ctx.spy(
        membersResource.statusesAtom,
    )
    const membersError = ctx.spy(membersResource.errorAtom)

    const members =
        membersData.companyId === selectedCompany.company_id
            ? membersData.members
            : []
    const selectedMemberForDelete = members.find(
        (member) => member.id === selectedMemberForDeleteId,
    )

    const canManageCompany = selectedCompany.role === 'OWNER'
    const { isPending: deleteLoading, isRejected: deleteRejected } = ctx.spy(
        deleteAsync.statusesAtom,
    )
    const deleteError = ctx.spy(deleteAsync.errorAtom)

    const deleteMemberMessage = `Точно вы хотите удалить сотрудника "${selectedMemberForDelete?.login ?? ''}" из компании "${selectedCompany.company_name}"?`
    const deleteCompanyMessage = `Точно вы хотите удалить компанию "${selectedCompany.company_name}"?`

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
                    onSelect={(memberId) => selectMemberAction(ctx, memberId)}
                />

                <CompanyMemberModal />
                <CompanySettingsModal />
                <CompanyInviteModal />

                <ConfirmModal
                    title="Удаление сотрудника"
                    open={deleteMemberModalOpen}
                    loading={deleteLoading}
                    error={deleteRejected ? deleteError : undefined}
                    message={deleteMemberMessage}
                    onConfirm={() => closeDeleteMemberModalAction(ctx)}
                    onCancel={() => {
                        deleteAsync.errorAtom.reset(ctx)
                        closeDeleteMemberModalAction(ctx)
                    }}
                />

                <ConfirmModal
                    title="Удаление компании"
                    open={deleteCompanyModalOpen}
                    loading={deleteLoading}
                    error={deleteRejected ? deleteError : undefined}
                    message={deleteCompanyMessage}
                    onConfirm={handleConfirmDeleteCompany}
                    onCancel={() => {
                        deleteAsync.errorAtom.reset(ctx)
                        deleteCompanyModalOpenAtom(ctx, false)
                    }}
                />
            </SCompanyContent>

            <Footer />
        </SCompanyPageWrapper>
    )
})
