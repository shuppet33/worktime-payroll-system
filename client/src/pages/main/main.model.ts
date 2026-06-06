import {
    atom,
    reatomAsync,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { tokenAtom, userAtom } from '$entities/auth.ts'

import { loginRequest, meRequest, registerRequest } from '$shared/auth/auth.ts'

export const loginModalOpenAtom = atom(false)
export const registerModalOpenAtom = atom(false)

export const loginAtom = atom('')
export const passwordAtom = atom('')

export const registerLoginAtom = atom('')
export const registerPasswordAtom = atom('')
export const registerConfirmPasswordAtom = atom('')

export const loginUser = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const login = ctx.get(loginAtom)
        const password = ctx.get(passwordAtom)

        if (!login.trim()) {
            throw new Error('Введите логин')
        }

        if (!password.trim()) {
            throw new Error('Введите пароль')
        }

        const { token, user, companies } = await loginRequest({
            login,
            password,
        })

        tokenAtom(ctx, token)
        userAtom(ctx, {
            id: user.id,
            login: user.login,
            companies,
        })

        return user
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const registerUser = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const login = ctx.get(registerLoginAtom)
        const password = ctx.get(registerPasswordAtom)
        const confirmPassword = ctx.get(registerConfirmPasswordAtom)

        if (!login.trim()) {
            throw new Error('Введите логин')
        }

        if (password.length < 6) {
            throw new Error('Минимум 6 символов')
        }

        if (password !== confirmPassword) {
            throw new Error('Пароли не совпадают')
        }

        const { token, user } = await registerRequest({
            login,
            password,
        })

        tokenAtom(ctx, token)
        userAtom(ctx, {
            id: user.id,
            login: user.login,
        })

        return user
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const getMe = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)

        if (!token) {
            throw new Error('Нет токена')
        }

        const user = await meRequest(token)

        userAtom(ctx, {
            id: user.id,
            login: user.login,
            companies: user.companies,
        })

        return user
    })
}).pipe(withStatusesAtom(), withErrorAtom())