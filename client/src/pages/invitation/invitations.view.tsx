import { useEffect } from 'react'

import { Alert, Button, Space } from 'antd'

import { reatomComponent } from '@reatom/npm-react'

import { useNavigate, useParams } from 'react-router'

import {
    acceptInvitationAsync,
    getInvitationAsync,
} from '$features/invitation/invitation.service.ts'
import { loginModalOpenAtom } from '$features/main/login-modal/login-modal.reatom.ts'
import { LoginModal } from '$features/main/login-modal/login-modal.view.tsx'

import { tokenAtom } from '$entities/auth.ts'

import {
    SInvitationContent,
    SInvitationPage,
    SInvitationStatus,
    SInvitationText,
    SInvitationTitle,
} from './styles.ts'

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

    const handleAcceptInvitation = async () => {
        if (!token) {
            return
        }

        if (!jwt) {
            loginModalOpenAtom(ctx, true)
            return
        }

        try {
            acceptInvitationAsync.errorAtom.reset(ctx)
            const result = await acceptInvitationAsync(ctx, token)

            navigate(`/companies/${result.company.id}`)
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

    return (
        <SInvitationPage>
            <SInvitationContent>
                <SInvitationTitle level={2}>
                    Приглашение в компанию
                </SInvitationTitle>

                <SInvitationText>
                    Вас пригласили в компанию {invitation.companyName}
                </SInvitationText>

                {isAcceptRejected && acceptError && (
                    <Alert showIcon title={acceptError.message} type="error" />
                )}

                {jwt ? (
                    <Button
                        loading={isAccepting}
                        size="large"
                        type="primary"
                        onClick={handleAcceptInvitation}
                    >
                        Принять приглашение
                    </Button>
                ) : (
                    <Space wrap>
                        <Button
                            size="large"
                            type="primary"
                            onClick={() => loginModalOpenAtom(ctx, true)}
                        >
                            Войти
                        </Button>
                    </Space>
                )}
            </SInvitationContent>

            <LoginModal />
        </SInvitationPage>
    )
})
