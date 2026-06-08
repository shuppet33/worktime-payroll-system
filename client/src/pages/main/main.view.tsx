import { Button, Switch } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import { loginModalOpenAtom } from '$features/main/login-modal/login-modal.reatom.ts'
import { LoginModal } from '$features/main/login-modal/login-modal.view.tsx'
import { registerModalOpenAtom } from '$features/main/register-modal/register-modal.reatom.ts'
import { RegisterModal } from '$features/main/register-modal/register-modal.view.tsx'

import { appThemeAtom } from '$shared/theme.ts'

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
    const appTheme = ctx.spy(appThemeAtom)

    const handleChangeTheme = (checked: boolean) => {
        appThemeAtom(ctx, checked ? 'dark' : 'light')
    }

    const handleOpenRegisterModal = () => {
        registerModalOpenAtom(ctx, true)
    }

    const handleOpenLoginModal = () => {
        loginModalOpenAtom(ctx, true)
    }

    return (
        <SPage $theme={appTheme}>
            <SHeader $theme={appTheme}>
                <SLogo $theme={appTheme}>Payroll System</SLogo>

                <SHeaderActions>
                    <Switch
                        checked={appTheme === 'dark'}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                        onChange={handleChangeTheme}
                    />

                    <Button onClick={handleOpenRegisterModal}>
                        Зарегистрироваться
                    </Button>

                    <Button type="primary" onClick={handleOpenLoginModal}>
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

            <LoginModal />
            <RegisterModal />
        </SPage>
    )
})
