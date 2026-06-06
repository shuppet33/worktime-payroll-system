import type { MenuProps } from 'antd'
import { Button, Dropdown, Switch } from 'antd'
import {
    DownOutlined,
    LogoutOutlined,
    MoonOutlined,
    SunOutlined,
    UserOutlined,
} from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import { Link, useNavigate, useParams } from 'react-router'

import { userAtom } from '$entities/auth.ts'

import { appThemeAtom } from '$shared/theme.ts'

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
        variant,
    }) => {
        const navigate = useNavigate()
        const { companyId } = useParams()
        const user = ctx.spy(userAtom)
        const appTheme = ctx.spy(appThemeAtom)
        const { isPending: logoutLoading } = ctx.spy(logoutUser.statusesAtom)
        const headerVariant = variant ?? appTheme

        const companies = user?.companies ?? []
        const selectedCompany =
            companies.find((company) => company.company_id === companyId) ??
            companies[0]
        const companyItems: MenuProps['items'] = companies.map((company) => ({
            key: company.company_id,
            label: company.company_name,
        }))

        return (
            <SHeader $variant={headerVariant}>
                <SLogo $variant={headerVariant}>
                    Payroll System
                </SLogo>

                <SHeaderActions>
                    {selectedCompany && (
                        <Dropdown
                            menu={{
                                items: companyItems,
                                selectedKeys: [selectedCompany.company_id],
                                onClick: ({ key }) => {
                                    navigate(`/companies/${key}`)
                                },
                            }}
                            trigger={['click']}
                        >
                            <Button>
                                {selectedCompany.company_name}
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    )}

                    {showProfileLink && (
                        <Link to={profilePath}>
                            <Button icon={<UserOutlined />}>
                                Мой профиль
                            </Button>
                        </Link>
                    )}

                    <Switch
                        checked={appTheme === 'dark'}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                        onChange={(checked) => {
                            appThemeAtom(ctx, checked ? 'dark' : 'light')
                        }}
                    />

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
