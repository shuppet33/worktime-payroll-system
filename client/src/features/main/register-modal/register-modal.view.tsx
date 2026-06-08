import { Alert, Button, Input, Modal } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router'

import {
    REGISTER_LOGIN_CHECK_COLORS,
    REGISTER_LOGIN_CHECK_MESSAGES,
} from '$features/main/register-modal/register-modal.constants.ts'

import {
    checkRegisterLoginAction,
    registerAsync,
    registerConfirmPasswordAtom,
    registerLoginAtom,
    registerLoginCheckStatusAtom,
    registerModalOpenAtom,
    registerPasswordAtom,
} from './register-modal.reatom.ts'

export const RegisterModal = reatomComponent(({ ctx }) => {
    const navigate = useNavigate()
    const isOpen = ctx.spy(registerModalOpenAtom)
    const login = ctx.spy(registerLoginAtom)
    const password = ctx.spy(registerPasswordAtom)
    const confirmPassword = ctx.spy(registerConfirmPasswordAtom)
    const { isPending: isLoading, isRejected } = ctx.spy(
        registerAsync.statusesAtom,
    )
    const error = ctx.spy(registerAsync.errorAtom)

    const loginCheckStatus = ctx.spy(registerLoginCheckStatusAtom)

    const loginCheck = {
        color: loginCheckStatus
            ? REGISTER_LOGIN_CHECK_COLORS[loginCheckStatus]
            : undefined,
        isBusy: loginCheckStatus === 'isBusy',
        message: loginCheckStatus
            ? REGISTER_LOGIN_CHECK_MESSAGES[loginCheckStatus]
            : '',
    }

    const handleClose = () => {
        registerAsync.errorAtom.reset(ctx)
        registerModalOpenAtom(ctx, false)
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
            navigate('/account')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Modal
            title="Регистрация"
            open={isOpen}
            footer={null}
            onCancel={handleClose}
        >
            {isRejected && error && <Alert type="error" title={error.message} />}

            <Input
                size="large"
                placeholder="Логин"
                value={login}
                prefix={<UserOutlined />}
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
                style={{
                    marginTop: 12,
                }}
                size="large"
                placeholder="Пароль"
                prefix={<LockOutlined />}
                value={password}
                onChange={handleChangePassword}
            />

            <Input.Password
                style={{
                    marginTop: 12,
                }}
                size="large"
                placeholder="Повторите пароль"
                prefix={<LockOutlined />}
                value={confirmPassword}
                onChange={handleChangeConfirmPassword}
            />

            <Button
                loading={isLoading}
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{
                    marginTop: 20,
                }}
                disabled={loginCheck.isBusy}
                onClick={handleSubmit}
            >
                Зарегистрироваться
            </Button>
        </Modal>
    )
})
