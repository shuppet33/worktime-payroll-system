import { reatomComponent } from '@reatom/npm-react'

import { Navigate, Outlet, Route, Routes } from 'react-router'

import { AccountPage } from '$pages/account'
import { MainPage } from '$pages/main/main.view.tsx'

import { tokenAtom } from '$entities/auth.ts'

const PrivateRoutes = reatomComponent(({ ctx }) => {
    const token = ctx.spy(tokenAtom)
    if (!token) {
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
