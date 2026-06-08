import { Alert, Button, Input, Modal } from 'antd'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import type { ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'

import {
    REGISTER_EMAIL_CODE_CHECK_COLORS,
    REGISTER_EMAIL_CODE_CHECK_MESSAGES,
    REGISTER_EMAIL_CODE_LENGTH,
    REGISTER_LOGIN_CHECK_COLORS,
    REGISTER_LOGIN_CHECK_MESSAGES,
} from '$features/main/register-modal/register-modal.constants.ts'

import {
    checkRegisterEmailCodeAction,
    checkRegisterLoginAction,
    registerAsync,
    registerConfirmPasswordAtom,
    registerEmailAtom,
    registerEmailCodeAtom,
    registerEmailCodeCheckStatusAtom,
    registerLoginAtom,
    registerLoginCheckStatusAtom,
    registerModalOpenAtom,
    registerPasswordAtom,
} from './register-modal.reatom.ts'

export const RegisterModal = reatomComponent(({ ctx }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const isOpen = ctx.spy(registerModalOpenAtom)
    const email = ctx.spy(registerEmailAtom)
    const emailCode = ctx.spy(registerEmailCodeAtom)
    const login = ctx.spy(registerLoginAtom)
    const password = ctx.spy(registerPasswordAtom)
    const confirmPassword = ctx.spy(registerConfirmPasswordAtom)
    const { isPending: isLoading, isRejected } = ctx.spy(
        registerAsync.statusesAtom,
    )
    const error = ctx.spy(registerAsync.errorAtom)

    const loginCheckStatus = ctx.spy(registerLoginCheckStatusAtom)
    const emailCodeCheckStatus = ctx.spy(registerEmailCodeCheckStatusAtom)

    const loginCheck = {
        color: loginCheckStatus
            ? REGISTER_LOGIN_CHECK_COLORS[loginCheckStatus]
            : undefined,
        isBusy: loginCheckStatus === 'isBusy',
        message: loginCheckStatus
            ? REGISTER_LOGIN_CHECK_MESSAGES[loginCheckStatus]
            : '',
    }

    const emailCodeCheck = {
        color: emailCodeCheckStatus
            ? REGISTER_EMAIL_CODE_CHECK_COLORS[emailCodeCheckStatus]
            : undefined,
        isInvalid: emailCodeCheckStatus === 'isInvalid',
        isLoading: emailCodeCheckStatus === 'isLoading',
        message: emailCodeCheckStatus
            ? REGISTER_EMAIL_CODE_CHECK_MESSAGES[emailCodeCheckStatus]
            : '',
    }

    const handleClose = () => {
        registerAsync.errorAtom.reset(ctx)
        registerModalOpenAtom(ctx, false)
    }

    const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        registerEmailAtom(ctx, event.target.value.trim())
        registerEmailCodeCheckStatusAtom(ctx, null)
    }

    const handleChangeEmailCode = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .trim()
            .slice(0, REGISTER_EMAIL_CODE_LENGTH)

        registerEmailCodeAtom(ctx, value)
        checkRegisterEmailCodeAction(ctx, value)
    }

    const handleChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase()

        registerLoginAtom(ctx, value)
        checkRegisterLoginAction(ctx, value)
    }

    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        registerPasswordAtom(ctx, event.target.value)
    }

    const handleChangeConfirmPassword = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        registerConfirmPasswordAtom(ctx, event.target.value)
    }

    const handleSubmit = async () => {
        try {
            registerAsync.errorAtom.reset(ctx)
            await registerAsync(ctx)
            registerModalOpenAtom(ctx, false)

            if (!location.pathname.startsWith('/invite/')) {
                navigate('/account')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Modal
            footer={null}
            open={isOpen}
            title="Регистрация"
            onCancel={handleClose}
        >
            {isRejected && error && <Alert type="error" title={error.message} />}

            <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
                value={email}
                onChange={handleChangeEmail}
            />

            <Input
                maxLength={REGISTER_EMAIL_CODE_LENGTH}
                prefix={<MailOutlined />}
                placeholder="Код из email"
                size="large"
                style={{
                    marginTop: 12,
                }}
                value={emailCode}
                onChange={handleChangeEmailCode}
            />

            {emailCodeCheck.message && (
                <div
                    style={{
                        color: emailCodeCheck.color,
                        fontSize: 13,
                        marginTop: 6,
                    }}
                >
                    {emailCodeCheck.message}
                </div>
            )}

            <Input
                prefix={<UserOutlined />}
                placeholder="Логин"
                size="large"
                style={{
                    marginTop: 12,
                }}
                value={login}
                onChange={handleChangeLogin}
            />

            {loginCheck.message && (
                <div
                    style={{
                        color: loginCheck.color,
                        fontSize: 13,
                        marginTop: 6,
                    }}
                >
                    {loginCheck.message}
                </div>
            )}

            <Input.Password
                prefix={<LockOutlined />}
                placeholder="Пароль"
                size="large"
                style={{
                    marginTop: 12,
                }}
                value={password}
                onChange={handleChangePassword}
            />

            <Input.Password
                prefix={<LockOutlined />}
                placeholder="Повторите пароль"
                size="large"
                style={{
                    marginTop: 12,
                }}
                value={confirmPassword}
                onChange={handleChangeConfirmPassword}
            />

            <Button
                block
                disabled={
                    loginCheck.isBusy ||
                    emailCodeCheck.isInvalid ||
                    emailCodeCheck.isLoading
                }
                htmlType="submit"
                loading={isLoading}
                size="large"
                style={{
                    marginTop: 20,
                }}
                type="primary"
                onClick={handleSubmit}
            >
                Зарегистрироваться
            </Button>
        </Modal>
    )
})
