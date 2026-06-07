import { reatomComponent } from '@reatom/npm-react'

import { deleteAsync, updateNameAsync } from '$features/company/company.service.ts'
import { CompanyMemberModal } from '$features/company/company-member-modal'
import { CompanySettingsModal } from '$features/company/company-settings-modal'
import { ConfirmModal } from '$features/shared/confirm-modal'

import type { CompanyMember } from '$shared/companies/companies.ts'

import {
    closeDeleteMemberModalAction,
    closeSettingsModalAction,
    companyNameDraftAtom,
    companyNameEditingAtom,
    deleteCompanyModalOpenAtom,
    deleteMemberModalOpenAtom,
    memberModalOpenAtom,
    settingsModalOpenAtom,
} from './company-modals.reatom.ts'

type Company = {
    company_id: string
    company_name: string
}

type Props = {
    selectedCompany: Company
    selectedMember?: CompanyMember
    selectedMemberForDelete?: CompanyMember
    onConfirmDeleteCompany: () => Promise<void>
}

export const CompanyModals = reatomComponent<Props>(
    ({ ctx, selectedCompany, selectedMember, selectedMemberForDelete, onConfirmDeleteCompany }) => {
        const memberModalOpen = ctx.spy(memberModalOpenAtom)
        const deleteCompanyModalOpen = ctx.spy(deleteCompanyModalOpenAtom)
        const deleteMemberModalOpen = ctx.spy(deleteMemberModalOpenAtom)
        const settingsModalOpen = ctx.spy(settingsModalOpenAtom)
        const companyNameDraft = ctx.spy(companyNameDraftAtom)
        const companyNameEditing = ctx.spy(companyNameEditingAtom)

        const {
            isPending: updateNameLoading,
            isRejected: updateNameRejected,
        } = ctx.spy(updateNameAsync.statusesAtom)
        const updateNameError = ctx.spy(updateNameAsync.errorAtom)

        const { isPending: deleteLoading, isRejected: deleteRejected } =
            ctx.spy(deleteAsync.statusesAtom)
        const deleteError = ctx.spy(deleteAsync.errorAtom)

        const handleUpdateCompanyName = async () => {
            try {
                updateNameAsync.errorAtom.reset(ctx)
                await updateNameAsync(ctx, selectedCompany.company_id)
            } catch (error) {
                console.error(error)
            }
        }

        return (
            <>
                <CompanyMemberModal
                    member={selectedMember}
                    open={memberModalOpen}
                    onClose={() => memberModalOpenAtom(ctx, false)}
                />

                <ConfirmModal
                    title="Удаление сотрудника"
                    open={deleteMemberModalOpen}
                    loading={deleteLoading}
                    error={deleteRejected ? deleteError : undefined}
                    message={`Точно вы хотите удалить сотрудника "${selectedMemberForDelete?.login ?? ''}" из компании "${selectedCompany.company_name}"?`}
                    onConfirm={onConfirmDeleteCompany}
                    onCancel={() => {
                        deleteAsync.errorAtom.reset(ctx)
                        closeDeleteMemberModalAction(ctx)
                    }}
                />

                <CompanySettingsModal
                    open={settingsModalOpen}
                    companyNameDraft={companyNameDraft}
                    editing={companyNameEditing}
                    loading={updateNameLoading}
                    showError={updateNameRejected}
                    error={updateNameError}
                    onClose={() => {
                        updateNameAsync.errorAtom.reset(ctx)
                        deleteAsync.errorAtom.reset(ctx)
                        closeSettingsModalAction(ctx)
                    }}
                    onDeleteCompany={() => {
                        deleteAsync.errorAtom.reset(ctx)
                        deleteCompanyModalOpenAtom(ctx, true)
                    }}
                    onDraftChange={(value) => companyNameDraftAtom(ctx, value)}
                    onEdit={() => companyNameEditingAtom(ctx, true)}
                    onSubmit={handleUpdateCompanyName}
                />

                <ConfirmModal
                    title="Удаление компании"
                    open={deleteCompanyModalOpen}
                    loading={deleteLoading}
                    error={deleteRejected ? deleteError : undefined}
                    message={`Точно вы хотите удалить компанию "${selectedCompany.company_name}"?`}
                    onConfirm={onConfirmDeleteCompany}
                    onCancel={() => {
                        deleteAsync.errorAtom.reset(ctx)
                        deleteCompanyModalOpenAtom(ctx, false)
                    }}
                />
            </>
        )
    },
)
