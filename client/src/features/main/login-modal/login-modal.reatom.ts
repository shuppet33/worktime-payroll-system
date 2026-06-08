import {
    atom,
    reatomAsync,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { tokenAtom, userAtom } from '$entities/auth.ts'

import { loginRequest } from '$shared/auth/auth.ts'

export const loginModalOpenAtom = atom(false, 'loginModalOpenAtom')

export const loginAtom = atom('', 'loginAtom')

export const passwordAtom = atom('', 'passwordAtom')

export const loginAsync = reatomAsync((ctx) => {
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
            companies,
            id: user.id,
            login: user.login,
        })

        return user
    })
}).pipe(withStatusesAtom(), withErrorAtom())
