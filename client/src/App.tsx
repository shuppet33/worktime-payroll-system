import { ConfigProvider, theme as antdTheme } from 'antd'

import { reatomComponent } from '@reatom/npm-react'

import { Navigate, Outlet, Route, Routes } from 'react-router'

import { AccountPage } from '$pages/account'
import { CompanyPage } from '$pages/company'
import { InvitationsPage } from '$pages/invitation'
import { MainPage } from '$pages/main'

import { meResource, tokenAtom, userAtom } from '$entities/auth.ts'

import { appThemeAtom } from '$shared/theme.ts'

const PrivateRoutes = reatomComponent(({ ctx }) => {
    const token = ctx.spy(tokenAtom)

    ctx.spy(meResource.dataAtom)

    const isLoading = ctx.spy(meResource.statusesAtom).isPending
    const error = ctx.spy(meResource.errorAtom)

    if (!token) {
        return <Navigate to="/" replace />
    }

    if (isLoading) {
        return <div>Загрузка...</div>
    }

    if (error) {
        tokenAtom(ctx, '')
        userAtom(ctx, null)

        return <Navigate to="/" replace />
    }

    return <Outlet />
})

const App = reatomComponent(({ ctx }) => {
    const appTheme = ctx.spy(appThemeAtom)

    return (
        <ConfigProvider
            theme={{
                algorithm:
                    appTheme === 'dark'
                        ? antdTheme.darkAlgorithm
                        : antdTheme.defaultAlgorithm,
            }}
        >
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/invite/:token" element={<InvitationsPage />} />

                <Route element={<PrivateRoutes />}>
                    <Route path="/account" element={<AccountPage />} />
                    <Route
                        path="/companies/:companyId"
                        element={<CompanyPage />}
                    />
                </Route>
            </Routes>
        </ConfigProvider>
    )
})

export default App
