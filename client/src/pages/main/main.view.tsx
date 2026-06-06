import { Alert, Button, Input, Modal } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import { useNavigate } from 'react-router'

import {
    loginAtom,
    loginModalOpenAtom,
    loginUser,
    passwordAtom,
    registerConfirmPasswordAtom,
    registerLoginAtom,
    registerModalOpenAtom,
    registerPasswordAtom,
    registerUser,
} from './main.model'
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

export const MainPage = reatomComponent(({ ctx }) => {
    const loginModalOpen = ctx.spy(loginModalOpenAtom)
    const registerModalOpen = ctx.spy(registerModalOpenAtom)

    const { isPending: registerLoading, isRejected: registerRejected } = ctx.spy(
        registerUser.statusesAtom,
    )
    const registerError = ctx.spy(registerUser.errorAtom)

    const registerLogin = ctx.spy(registerLoginAtom)
    const registerPassword = ctx.spy(registerPasswordAtom)
    const registerConfirmPassword = ctx.spy(registerConfirmPasswordAtom)
    
    const login = ctx.spy(loginAtom)
    const password = ctx.spy(passwordAtom)

    const { isPending: loginLoading, isRejected: loginRejected } = ctx.spy(loginUser.statusesAtom)
    const loginError = ctx.spy(loginUser.errorAtom)

    const navigate = useNavigate()

    return (
        <SPage>
            <SHeader>
                <SLogo>Payroll System</SLogo>

                <SHeaderActions>
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

                <SDescription>
                    Современная система автоматизации расчета заработной платы,
                    управления компаниями, сотрудниками и начислениями.
                </SDescription>
            </SContent>

            <SFooter>© 2026 Никишова Алена Германовна · 24-ИСиП-10</SFooter>

            <Modal
                title="Вход"
                open={loginModalOpen}
                footer={null}
                onCancel={() => {
                    loginUser.errorAtom.reset(ctx)
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
                            loginUser.errorAtom.reset(ctx)

                            await loginUser(ctx)

                            loginAtom(ctx, '')
                            passwordAtom(ctx, '')

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
                    registerUser.errorAtom.reset(ctx)
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
                    onChange={(e) => registerLoginAtom(ctx, e.target.value)}
                />

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
                    onClick={() => {
                        registerUser.errorAtom.reset(ctx)
                        registerUser(ctx)
                    }}
                >
                    Зарегистрироваться
                </Button>
            </Modal>
        </SPage>
    )
})
