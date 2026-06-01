import { Button, Input, Modal } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import { loginModalOpenAtom, registerModalOpenAtom } from './main.model'
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
    const loginOpen = ctx.spy(loginModalOpenAtom)

    const registerOpen = ctx.spy(registerModalOpenAtom)

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
                open={loginOpen}
                footer={null}
                onCancel={() => loginModalOpenAtom(ctx, false)}
            >
                <Input
                    size="large"
                    placeholder="Логин"
                    prefix={<UserOutlined />}
                />

                <Input.Password
                    style={{
                        marginTop: 12,
                    }}
                    size="large"
                    placeholder="Пароль"
                    prefix={<LockOutlined />}
                />

                <Button
                    type="primary"
                    block
                    size="large"
                    style={{
                        marginTop: 20,
                    }}
                >
                    Войти
                </Button>
            </Modal>

            <Modal
                title="Регистрация"
                open={registerOpen}
                footer={null}
                onCancel={() => registerModalOpenAtom(ctx, false)}
            >
                <Input
                    size="large"
                    placeholder="Логин"
                    prefix={<UserOutlined />}
                />

                <Input.Password
                    style={{
                        marginTop: 12,
                    }}
                    size="large"
                    placeholder="Пароль"
                    prefix={<LockOutlined />}
                />

                <Input.Password
                    style={{
                        marginTop: 12,
                    }}
                    size="large"
                    placeholder="Повторите пароль"
                    prefix={<LockOutlined />}
                />

                <Button
                    type="primary"
                    block
                    size="large"
                    style={{
                        marginTop: 20,
                    }}
                >
                    Зарегистрироваться
                </Button>
            </Modal>
        </SPage>
    )
})
