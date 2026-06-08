import { Alert, Button, Input, Modal } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router'

import {
    loginAsync,
    loginAtom,
    loginModalOpenAtom,
    passwordAtom,
} from './login-modal.reatom.ts'

export const LoginModal = reatomComponent(({ ctx }) => {
    const navigate = useNavigate()
    const isOpen = ctx.spy(loginModalOpenAtom)
    const login = ctx.spy(loginAtom)
    const password = ctx.spy(passwordAtom)
    const { isPending: isLoading, isRejected } = ctx.spy(
        loginAsync.statusesAtom,
    )
    const error = ctx.spy(loginAsync.errorAtom)

    const handleClose = () => {
        loginAsync.errorAtom.reset(ctx)
        loginModalOpenAtom(ctx, false)
    }

    const handleChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
        loginAtom(ctx, event.target.value)
    }

    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        passwordAtom(ctx, event.target.value)
    }

    const handleSubmit = async () => {
        try {
            loginAsync.errorAtom.reset(ctx)
            await loginAsync(ctx)
            loginAtom(ctx, '')
            passwordAtom(ctx, '')
            loginModalOpenAtom(ctx, false)
            navigate('/account')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Modal title="Вход" open={isOpen} footer={null} onCancel={handleClose}>
            {isRejected && error && <Alert type="error" title={error.message} />}

            <Input
                size="large"
                placeholder="Логин"
                prefix={<UserOutlined />}
                value={login}
                onChange={handleChangeLogin}
            />

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

            <Button
                type="primary"
                block
                size="large"
                style={{
                    marginTop: 20,
                }}
                loading={isLoading}
                onClick={handleSubmit}
            >
                Войти
            </Button>
        </Modal>
    )
})
