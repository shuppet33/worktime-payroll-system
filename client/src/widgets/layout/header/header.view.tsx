import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { reatomComponent } from '@reatom/npm-react'
import { Button } from 'antd'
import { Link, useNavigate } from 'react-router'

import { logoutUser } from './header.model'
import { SHeader, SHeaderActions, SLogo } from './styles'

type HeaderProps = {
    profilePath?: string
    showProfileLink?: boolean
    variant?: 'dark' | 'light'
}

export const Header = reatomComponent<HeaderProps>(
    ({
        ctx,
        profilePath = '/account',
        showProfileLink = false,
        variant = 'dark',
    }) => {
        const navigate = useNavigate()
        const { isPending: logoutLoading } = ctx.spy(logoutUser.statusesAtom)

        return (
            <SHeader $variant={variant}>
                <SLogo $variant={variant}>
                    Payroll System
                </SLogo>

                <SHeaderActions>
                    {showProfileLink && (
                        <Link to={profilePath}>
                            <Button icon={<UserOutlined />}>
                                Мой профиль
                            </Button>
                        </Link>
                    )}

                    <Button
                        icon={<LogoutOutlined />}
                        loading={logoutLoading}
                        onClick={async () => {
                            logoutUser.errorAtom.reset(ctx)
                            await logoutUser(ctx)
                            navigate('/')
                        }}
                    >
                        Выйти
                    </Button>
                </SHeaderActions>
            </SHeader>
        )
    },
)
