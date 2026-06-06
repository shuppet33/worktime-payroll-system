import { Alert, Button, Input, Modal } from 'antd'

import { reatomComponent } from '@reatom/npm-react'

import { Navigate, useNavigate } from 'react-router'

import { Header } from '$widgets/layout/header'

import { userAtom } from '$entities/auth.ts'

import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'
import { appThemeAtom } from '$shared/theme.ts'

import {
    companyNameAtom,
    createCompany,
    createCompanyModalOpenAtom,
    inviteLinkAtom,
    joinCompany,
    joinCompanyModalOpenAtom,
} from './account.reatom.ts'
import {
    SActions,
    SContent,
    SEmptyState,
    SEmptyText,
    SModalContent,
    SPage,
} from './styles'

export const AccountPage = reatomComponent(({ ctx }) => {
    const navigate = useNavigate()
    const user = ctx.spy(userAtom)
    const appTheme = ctx.spy(appThemeAtom)
    const selectedCompanyId = ctx.spy(selectedCompanyIdAtom)
    const createCompanyModalOpen = ctx.spy(createCompanyModalOpenAtom)
    const joinCompanyModalOpen = ctx.spy(joinCompanyModalOpenAtom)
    const companyName = ctx.spy(companyNameAtom)
    const inviteLink = ctx.spy(inviteLinkAtom)

    const {
        isPending: createCompanyLoading,
        isRejected: createCompanyRejected,
    } = ctx.spy(createCompany.statusesAtom)
    const createCompanyError = ctx.spy(createCompany.errorAtom)

    const { isPending: joinCompanyLoading, isRejected: joinCompanyRejected } =
        ctx.spy(joinCompany.statusesAtom)
    const joinCompanyError = ctx.spy(joinCompany.errorAtom)

    const companies = user?.companies ?? []
    const selectedCompany =
        companies.find((company) => company.company_id === selectedCompanyId) ??
        companies[0]

    if (selectedCompany) {
        selectedCompanyIdAtom(ctx, selectedCompany.company_id)

        return (
            <Navigate to={`/companies/${selectedCompany.company_id}`} replace />
        )
    }

    const handleCreateCompany = async () => {
        try {
            createCompany.errorAtom.reset(ctx)

            const company = await createCompany(ctx)

            selectedCompanyIdAtom(ctx, company.id)
            navigate(`/companies/${company.id}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <SPage $theme={appTheme}>
            <Header showProfileLink />

            <SContent>
                <SEmptyState>
                    <SEmptyText $theme={appTheme}>
                        У вас нет компании и вы не состоите в компании. Создайте
                        компанию или присоединитесь к существующей.
                    </SEmptyText>

                    <SActions>
                        <Button
                            size="large"
                            type="primary"
                            onClick={() =>
                                createCompanyModalOpenAtom(
                                    ctx,
                                    !createCompanyModalOpen,
                                )
                            }
                        >
                            Создать
                        </Button>

                        <Button
                            size="large"
                            onClick={() =>
                                joinCompanyModalOpenAtom(
                                    ctx,
                                    !joinCompanyModalOpen,
                                )
                            }
                        >
                            Присоединиться
                        </Button>
                    </SActions>
                </SEmptyState>
            </SContent>

            <Modal
                title="Создать компанию"
                open={createCompanyModalOpen}
                footer={null}
                onCancel={() => {
                    createCompany.errorAtom.reset(ctx)
                    createCompanyModalOpenAtom(ctx, false)
                }}
            >
                <SModalContent>
                    {createCompanyRejected && createCompanyError && (
                        <Alert
                            type="error"
                            title={createCompanyError.message}
                        />
                    )}

                    <Input
                        size="large"
                        placeholder="Название компании"
                        value={companyName}
                        onChange={(event) =>
                            companyNameAtom(ctx, event.target.value)
                        }
                        onPressEnter={handleCreateCompany}
                    />

                    <Button
                        block
                        size="large"
                        type="primary"
                        loading={createCompanyLoading}
                        onClick={handleCreateCompany}
                    >
                        Создать
                    </Button>
                </SModalContent>
            </Modal>

            <Modal
                title="Присоединиться к компании"
                open={joinCompanyModalOpen}
                footer={null}
                onCancel={() => {
                    joinCompany.errorAtom.reset(ctx)
                    joinCompanyModalOpenAtom(ctx, false)
                }}
            >
                <SModalContent>
                    {joinCompanyRejected && joinCompanyError && (
                        <Alert type="error" title={joinCompanyError.message} />
                    )}

                    <Input
                        size="large"
                        placeholder="Ссылка-приглашение"
                        value={inviteLink}
                        onChange={(event) =>
                            inviteLinkAtom(ctx, event.target.value)
                        }
                        onPressEnter={() => joinCompany(ctx)}
                    />

                    <Button
                        block
                        size="large"
                        type="primary"
                        loading={joinCompanyLoading}
                        onClick={() => {
                            joinCompany.errorAtom.reset(ctx)
                            joinCompany(ctx)
                        }}
                    >
                        Присоединиться
                    </Button>
                </SModalContent>
            </Modal>
        </SPage>
    )
})
