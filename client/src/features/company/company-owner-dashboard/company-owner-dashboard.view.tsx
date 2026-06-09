import { Button, Input } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

import { CompanyInviteModal } from '$features/company/company-invite-modal'
import { CompanyMemberModal } from '$features/company/company-member-modal'
import { CompanyMembersGrid } from '$features/company/company-members-grid'
import { CompanySettingsModal } from '$features/company/company-settings-modal'
import { ConfirmModal } from '$features/shared/confirm-modal'

import type { CompanyOwnerDashboardProps } from './company-owner-dashboard.types.ts'
import { SFilterActions, SFilters, SSearchWrapper } from './styles'

export const CompanyOwnerDashboard = ({
    deleteCompanyError,
    deleteCompanyLoading,
    deleteCompanyMessage,
    deleteCompanyModalOpen,
    deleteCompanyRejected,
    deleteMemberError,
    deleteMemberLoading,
    deleteMemberMessage,
    deleteMemberModalOpen,
    deleteMemberRejected,
    members,
    membersError,
    membersLoading,
    membersRejected,
    onCancelDeleteCompany,
    onCancelDeleteMember,
    onConfirmDeleteCompany,
    onConfirmDeleteMember,
    onDeleteMember,
    onOpenSettings,
    onSelectMember,
}: CompanyOwnerDashboardProps) => {
    return (
        <>
            <SFilters>
                <SFilterActions>
                    <Button
                        aria-label="Настройки компании"
                        icon={<SettingOutlined />}
                        onClick={onOpenSettings}
                    />
                </SFilterActions>

                <SSearchWrapper>
                    <Input placeholder="Поиск по имени" />
                </SSearchWrapper>
            </SFilters>

            <CompanyMembersGrid
                canDelete
                error={membersError}
                loading={membersLoading}
                members={members}
                showError={membersRejected}
                onDelete={onDeleteMember}
                onSelect={onSelectMember}
            />

            <CompanyMemberModal />
            <CompanySettingsModal />
            <CompanyInviteModal />

            <ConfirmModal
                error={deleteMemberRejected ? deleteMemberError : undefined}
                loading={deleteMemberLoading}
                message={deleteMemberMessage}
                open={deleteMemberModalOpen}
                title="Удаление сотрудника"
                onCancel={onCancelDeleteMember}
                onConfirm={onConfirmDeleteMember}
            />

            <ConfirmModal
                error={deleteCompanyRejected ? deleteCompanyError : undefined}
                loading={deleteCompanyLoading}
                message={deleteCompanyMessage}
                open={deleteCompanyModalOpen}
                title="Удаление компании"
                onCancel={onCancelDeleteCompany}
                onConfirm={onConfirmDeleteCompany}
            />
        </>
    )
}
