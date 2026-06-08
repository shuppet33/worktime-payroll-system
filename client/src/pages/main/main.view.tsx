import { useEffect, useState } from 'react'

import { Alert, Button, Input, Modal, Switch } from 'antd'
import {
    LockOutlined,
    MoonOutlined,
    SunOutlined,
    UserOutlined,
} from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import { useNavigate } from 'react-router'

import { checkLoginRequest } from '$shared/auth/auth.ts'
import { appThemeAtom } from '$shared/theme.ts'

import {
    loginAsync,
    loginAtom,
    loginModalOpenAtom,
    passwordAtom,
    registerAsync,
    registerConfirmPasswordAtom,
    registerLoginAtom,
    registerModalOpenAtom,
    registerPasswordAtom,
} from './main.reatom'
import {
    SContent,
    SDescription,
    SFooter,
    SHeader,
    SHeaderActions,
    SLogo,
    SPage,
    STitle,
} from './styles'

type RegisterLoginCheckStatus = 'isLoading' | 'isBusy' | 'isFree'

const registerLoginCheckMessages: Record<RegisterLoginCheckStatus, string> = {
    isLoading: 'Проверяем логин...',
    isBusy: 'Такой логин уже занят',
    isFree: 'Такой логин свободен',
}

const registerLoginCheckColors: Partial<
    Record<RegisterLoginCheckStatus, string>
> = {
    isBusy: '#cf1322',
    isFree: '#389e0d',
}

export const MainPage = reatomComponent(({ ctx }) => {
    const appTheme = ctx.spy(appThemeAtom)
    const loginModalOpen = ctx.spy(loginModalOpenAtom)
    const registerModalOpen = ctx.spy(registerModalOpenAtom)

    const { isPending: registerLoading, isRejected: registerRejected } = ctx.spy(
        registerAsync.statusesAtom,
    )
    const registerError = ctx.spy(registerAsync.errorAtom)

    const registerLogin = ctx.spy(registerLoginAtom)
    const registerPassword = ctx.spy(registerPasswordAtom)
    const registerConfirmPassword = ctx.spy(registerConfirmPasswordAtom)
    const trimmedRegisterLogin = registerLogin.trim()

    const [registerLoginCheckStatus, setRegisterLoginCheckStatus] =
        useState<RegisterLoginCheckStatus | null>(null)

    const login = ctx.spy(loginAtom)
    const password = ctx.spy(passwordAtom)

    const { isPending: loginLoading, isRejected: loginRejected } = ctx.spy(
        loginAsync.statusesAtom,
    )
    const loginError = ctx.spy(loginAsync.errorAtom)

    const navigate = useNavigate()

    useEffect(() => {
        if (!registerModalOpen || !trimmedRegisterLogin) {
            setRegisterLoginCheckStatus(null)
            return
        }

        setRegisterLoginCheckStatus(null)

        const controller = new AbortController()
        const timeoutId = window.setTimeout(async () => {
            setRegisterLoginCheckStatus('isLoading')

            try {
                const { exists } = await checkLoginRequest(
                    trimmedRegisterLogin,
                    controller.signal,
                )

                setRegisterLoginCheckStatus(exists ? 'isBusy' : 'isFree')
            } catch (error) {
                if (controller.signal.aborted) {
                    return
                }

                setRegisterLoginCheckStatus(null)
                console.error(error)
            }
        }, 250)

        return () => {
            window.clearTimeout(timeoutId)
            controller.abort()
        }
    }, [registerModalOpen, trimmedRegisterLogin])

    const registerLoginCheckMessage = registerLoginCheckStatus
        ? registerLoginCheckMessages[registerLoginCheckStatus]
        : ''

    const registerLoginCheckColor = registerLoginCheckStatus
        ? registerLoginCheckColors[registerLoginCheckStatus]
        : undefined

    return (
        <SPage $theme={appTheme}>
            <SHeader $theme={appTheme}>
                <SLogo $theme={appTheme}>Payroll System</SLogo>

                <SHeaderActions>
                    <Switch
                        checked={appTheme === 'dark'}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                        onChange={(checked) => {
                            appThemeAtom(ctx, checked ? 'dark' : 'light')
                        }}
                    />

                    <Button onClick={() => registerModalOpenAtom(ctx, true)}>
                        Зарегистрироваться
                    </Button>

                    <Button
                        type="primary"
                        onClick={() => loginModalOpenAtom(ctx, true)}
                    >
                        Войти
                    </Button>
                </SHeaderActions>
            </SHeader>

            <SContent>
                <STitle>PAYROLL SYSTEM</STitle>

                <SDescription $theme={appTheme}>
                    Современная система автоматизации расчета заработной платы,
                    управления компаниями, сотрудниками и начислениями.
                </SDescription>
            </SContent>

            <SFooter $theme={appTheme}>
                © 2026 Никишова Алена Германовна · 24-ИСиП-10
            </SFooter>

            <Modal
                title="Вход"
                open={loginModalOpen}
                footer={null}
                onCancel={() => {
                    loginAsync.errorAtom.reset(ctx)
                    loginModalOpenAtom(ctx, false)
                }}
            >
                {loginRejected && loginError && (
                    <Alert type="error" title={loginError.message} />
                )}

                <Input
                    size="large"
                    placeholder="Логин"
                    prefix={<UserOutlined />}
                    value={login}
                    onChange={(event) => loginAtom(ctx, event.target.value)}
                />

                <Input.Password
                    style={{
                        marginTop: 12,
                    }}
                    size="large"
                    placeholder="Пароль"
                    prefix={<LockOutlined />}
                    value={password}
                    onChange={(event) => passwordAtom(ctx, event.target.value)}
                />

                <Button
                    type="primary"
                    block
                    size="large"
                    style={{
                        marginTop: 20,
                    }}
                    loading={loginLoading}
                    onClick={async () => {
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
                    }}
                >
                    Войти
                </Button>
            </Modal>

            <Modal
                title="Регистрация"
                open={registerModalOpen}
                footer={null}
                onCancel={() => {
                    registerAsync.errorAtom.reset(ctx)
                    registerModalOpenAtom(ctx, false)
                }}
            >
                {registerRejected && registerError && (
                    <Alert type="error" title={registerError.message} />
                )}

                <Input
                    size="large"
                    placeholder="Логин"
                    value={registerLogin}
                    prefix={<UserOutlined />}
                    onChange={(event) =>
                        registerLoginAtom(ctx, event.target.value)
                    }
                />

                {registerLoginCheckMessage && (
                    <div
                        style={{
                            color: registerLoginCheckColor,
                            fontSize: 13,
                            marginTop: 6,
                        }}
                    >
                        {registerLoginCheckMessage}
                    </div>
                )}

                <Input.Password
                    style={{
                        marginTop: 12,
                    }}
                    size="large"
                    placeholder="Пароль"
                    prefix={<LockOutlined />}
                    value={registerPassword}
                    onChange={(event) =>
                        registerPasswordAtom(ctx, event.target.value)
                    }
                />

                <Input.Password
                    style={{
                        marginTop: 12,
                    }}
                    size="large"
                    placeholder="Повторите пароль"
                    prefix={<LockOutlined />}
                    value={registerConfirmPassword}
                    onChange={(event) =>
                        registerConfirmPasswordAtom(ctx, event.target.value)
                    }
                />

                <Button
                    loading={registerLoading}
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    style={{
                        marginTop: 20,
                    }}
                    disabled={registerLoginCheckStatus === 'isBusy'}
                    onClick={async () => {
                        try {
                            registerAsync.errorAtom.reset(ctx)
                            await registerAsync(ctx)

                            registerModalOpenAtom(ctx, false)
                            navigate('/account')
                        } catch (error) {
                            console.error(error)
                        }
                    }}
                >
                    Зарегистрироваться
                </Button>
            </Modal>
        </SPage>
    )
})
