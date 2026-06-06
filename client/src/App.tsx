import { reatomComponent } from '@reatom/npm-react'

import { Navigate, Outlet, Route, Routes } from 'react-router'

import { AccountPage } from '$pages/account'
import { getMe } from '$pages/main/main.model.ts'
import { MainPage } from '$pages/main/main.view.tsx'

import { tokenAtom, userAtom } from '$entities/auth.ts'
import { useEffect } from 'react'

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

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />

            <Route element={<PrivateRoutes />}>
                <Route path="/account" element={<AccountPage />} />
            </Route>
        </Routes>
    )
}

export default App
