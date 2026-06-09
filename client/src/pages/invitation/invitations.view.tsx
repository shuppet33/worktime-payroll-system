import { useEffect } from 'react'

import { Alert, Button, Space } from 'antd'

import { reatomComponent } from '@reatom/npm-react'

import { useNavigate, useParams } from 'react-router'

import {
    acceptInvitationAsync,
    declineInvitationAsync,
    getInvitationAsync,
} from '$features/invitation/invitation.service.ts'
import { loginModalOpenAtom } from '$features/main/login-modal/login-modal.reatom.ts'
import { LoginModal } from '$features/main/login-modal/login-modal.view.tsx'

import { tokenAtom } from '$entities/auth.ts'

import type { InvitationStatus } from '$shared/invitation/invitation.types.ts'

import {
    SInvitationContent,
    SInvitationPage,
    SInvitationStatus,
    SInvitationText,
    SInvitationTitle,
} from './styles.ts'

type InvitationError = Error & {
    status?: number
}

const INVITATION_STATUS_MESSAGES: Partial<Record<InvitationStatus, string>> = {
    ACCEPTED: 'Приглашение уже принято',
    DECLINED: 'Приглашение отклонено',
    EXPIRED: 'Срок приглашения истек',
    REVOKED: 'Приглашение отозвано',
}

export const InvitationsPage = reatomComponent(({ ctx }) => {
    const { token } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            getInvitationAsync(ctx, token)
        }
    }, [token])

    const jwt = ctx.spy(tokenAtom)
    const invitation = ctx.spy(getInvitationAsync.dataAtom)
    const { isPending } = ctx.spy(getInvitationAsync.statusesAtom)
    const error = ctx.spy(getInvitationAsync.errorAtom)
    const { isPending: isAccepting, isRejected: isAcceptRejected } = ctx.spy(
        acceptInvitationAsync.statusesAtom,
    )
    const acceptError = ctx.spy(acceptInvitationAsync.errorAtom)
    const { isPending: isDeclining, isRejected: isDeclineRejected } = ctx.spy(
        declineInvitationAsync.statusesAtom,
    )
    const declineError = ctx.spy(declineInvitationAsync.errorAtom)
    const acceptErrorStatus = (acceptError as InvitationError | null)?.status
    const shouldShowLoginAction = isAcceptRejected && acceptErrorStatus === 409

    useEffect(() => {
        acceptInvitationAsync.errorAtom.reset(ctx)
    }, [jwt])

    const handleOpenLogin = () => {
        loginModalOpenAtom(ctx, true)
    }

    const handleAcceptInvitation = async () => {
        if (!token) {
            return
        }

        if (!jwt) {
            handleOpenLogin()
            return
        }

        try {
            acceptInvitationAsync.errorAtom.reset(ctx)
            const result = await acceptInvitationAsync(ctx, token)

            navigate(`/company/${result.companyId}`)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeclineInvitation = async () => {
        if (!token) {
            return
        }

        if (!jwt) {
            handleOpenLogin()
            return
        }

        try {
            declineInvitationAsync.errorAtom.reset(ctx)
            await declineInvitationAsync(ctx, token)
        } catch (error) {
            console.error(error)
        }
    }

    if (isPending) {
        return (
            <SInvitationPage>
                <SInvitationStatus>Загрузка...</SInvitationStatus>
            </SInvitationPage>
        )
    }

    if (error) {
        return (
            <SInvitationPage>
                <SInvitationStatus>{error.message}</SInvitationStatus>
            </SInvitationPage>
        )
    }

    const status = invitation.status
    const isPendingInvitation = status === 'PENDING'
    const statusMessage = status ? INVITATION_STATUS_MESSAGES[status] : null

    return (
        <SInvitationPage>
            <SInvitationContent>
                <SInvitationTitle level={2}>
                    Приглашение в компанию
                </SInvitationTitle>

                {isPendingInvitation ? (
                    <SInvitationText>
                        Вас пригласили в компанию {invitation.companyName}
                    </SInvitationText>
                ) : (
                    <Alert
                        showIcon
                        message={statusMessage ?? 'Приглашение недоступно'}
                        type="info"
                    />
                )}

                {isAcceptRejected && acceptError && (
                    <Alert showIcon title={acceptError.message} type="error" />
                )}

                {isDeclineRejected && declineError && (
                    <Alert showIcon title={declineError.message} type="error" />
                )}

                {isPendingInvitation && (
                    <Space wrap>
                        {shouldShowLoginAction ? (
                            <Button
                                size="large"
                                type="primary"
                                onClick={handleOpenLogin}
                            >
                                Войти
                            </Button>
                        ) : jwt ? (
                            <>
                                <Button
                                    loading={isAccepting}
                                    size="large"
                                    type="primary"
                                    onClick={handleAcceptInvitation}
                                >
                                    Принять приглашение
                                </Button>
                                <Button
                                    loading={isDeclining}
                                    size="large"
                                    onClick={handleDeclineInvitation}
                                >
                                    Отклонить
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="large"
                                type="primary"
                                onClick={handleOpenLogin}
                            >
                                Войти
                            </Button>
                        )}
                    </Space>
                )}
            </SInvitationContent>

            <LoginModal />
        </SInvitationPage>
    )
})
