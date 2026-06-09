import { Alert, Button, Input, Modal } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import VirtualList from '@rc-component/virtual-list'
import type { ChangeEvent } from 'react'

import {
    createInviteAsync,
    inviteUsersResource,
} from '$features/company/company.service.ts'

import { userAtom } from '$entities/auth.ts'

import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'
import { appThemeAtom } from '$shared/theme.ts'

import {
    MODAL_WIDTH,
    RESULTS_HEIGHT,
    USER_ROW_HEIGHT,
} from '../company-invite-modal.constants.ts'
import {
    closeInviteMemberModalAction,
    inviteMemberModalOpenAtom,
    inviteMemberSearchAtom,
    selectedInviteUserIdAtom,
} from '../company-invite-modal.reatom.ts'
import type { InviteUser } from '../company-invite-modal.types.ts'

import { CompanyInviteModalResult } from './company-invite-modal-result.view.tsx'
import { SelectedInviteUser } from './selected-invite-user.view.tsx'
import {
    SActions,
    SInviteContent,
    SResultsPanel,
    SSearchBlock,
    SSearchInputWrapper,
    SSearchLabel,
    SStatusText,
} from './styles.ts'

type InviteTheme = 'light' | 'dark'

export const CompanyInviteModal = reatomComponent(({ ctx }) => {
    const user = ctx.spy(userAtom)
    const selectedCompanyId = ctx.spy(selectedCompanyIdAtom) as string | null
    const isOpen = ctx.spy(inviteMemberModalOpenAtom)
    const query = ctx.spy(inviteMemberSearchAtom)
    const selectedInviteUserId = ctx.spy(selectedInviteUserIdAtom)
    const theme = ctx.spy(appThemeAtom) as InviteTheme
    const inviteUsersData = ctx.spy(inviteUsersResource.dataAtom)
    const { isPending: isLoading } = ctx.spy(inviteUsersResource.statusesAtom)
    const { isPending: isCreatingInvite, isRejected: isCreateInviteRejected } =
        ctx.spy(createInviteAsync.statusesAtom)
    const createInviteError = ctx.spy(createInviteAsync.errorAtom)
    const users = inviteUsersData.users
    const selectedUser = users.find((user) => user.id === selectedInviteUserId)
    const companyName =
        user?.companies?.find(
            (company) => company.company_id === selectedCompanyId,
        )?.company_name ?? ''
    const hasQuery = query.trim().length > 0
    const shouldShowResults = hasQuery && !selectedUser
    const listHeight = Math.min(users.length * USER_ROW_HEIGHT, RESULTS_HEIGHT)

    const handleClose = () => {
        closeInviteMemberModalAction(ctx)
    }

    const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
        inviteMemberSearchAtom(ctx, event.target.value)
    }

    const handleCreateInvite = async () => {
        if (!selectedCompanyId) {
            return
        }

        try {
            createInviteAsync.errorAtom.reset(ctx)
            await createInviteAsync(ctx, selectedCompanyId)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Modal
            centered
            footer={null}
            open={isOpen}
            title={`Добавить людей в ${companyName}`}
            width={MODAL_WIDTH}
            zIndex={1100}
            onCancel={handleClose}
        >
            <SInviteContent>
                {selectedUser ? (
                    <SelectedInviteUser user={selectedUser} />
                ) : (
                    <SSearchBlock>
                        <SSearchLabel
                            $theme={theme}
                            htmlFor="invite-member-search"
                        >
                            Поиск по логину, имени или email
                        </SSearchLabel>

                        <SSearchInputWrapper $theme={theme}>
                            <Input
                                id="invite-member-search"
                                autoFocus
                                placeholder="Введите имя или логин"
                                prefix={<SearchOutlined />}
                                value={query}
                                onChange={handleChangeQuery}
                            />
                        </SSearchInputWrapper>
                    </SSearchBlock>
                )}

                {shouldShowResults && (
                    <SResultsPanel $theme={theme}>
                        {isLoading ? (
                            <SStatusText $theme={theme}>
                                Ищем пользователей...
                            </SStatusText>
                        ) : users.length ? (
                            <VirtualList
                                data={users}
                                height={listHeight}
                                itemHeight={USER_ROW_HEIGHT}
                                itemKey="id"
                            >
                                {(user: InviteUser) => (
                                    <CompanyInviteModalResult
                                        key={user.id}
                                        user={user}
                                    />
                                )}
                            </VirtualList>
                        ) : (
                            <SStatusText $theme={theme}>
                                Пользователи не найдены
                            </SStatusText>
                        )}
                    </SResultsPanel>
                )}

                {isCreateInviteRejected && createInviteError && (
                    <Alert
                        showIcon
                        title={createInviteError.message}
                        type="error"
                    />
                )}

                <SActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button
                        disabled={!selectedUser}
                        loading={isCreatingInvite}
                        type="primary"
                        onClick={handleCreateInvite}
                    >
                        Пригласить
                    </Button>
                </SActions>
            </SInviteContent>
        </Modal>
    )
})
