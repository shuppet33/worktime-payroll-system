import { useEffect } from 'react'

import { ConfigProvider, theme as antdTheme } from 'antd'

import { reatomComponent } from '@reatom/npm-react'

import { Navigate, Outlet, Route, Routes } from 'react-router'

import { AccountPage } from '$pages/account'
import { CompanyPage } from '$pages/company'
import { getMe } from '$pages/main/main.model.ts'
import { MainPage } from '$pages/main/main.view.tsx'

import { tokenAtom, userAtom } from '$entities/auth.ts'

import { appThemeAtom } from '$shared/theme.ts'

const PrivateRoutes = reatomComponent(({ ctx }) => {
    const token = ctx.spy(tokenAtom)
    const user = ctx.spy(userAtom)

    const isLoading = ctx.spy(getMe.statusesAtom).isPending
    const error = ctx.spy(getMe.errorAtom)

    useEffect(() => {
        if (!token) return
        if (user) return
        if (isLoading) return

        getMe.errorAtom.reset(ctx)
        getMe(ctx)
    }, [token, user, isLoading, ctx])

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
