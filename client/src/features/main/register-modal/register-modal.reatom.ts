import {
    atom,
    reatomAsync,
    sleep,
    withConcurrency,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { REGISTER_LOGIN_CHECK_DELAY } from '$features/main/register-modal/register-modal.constants.ts'

import { tokenAtom, userAtom } from '$entities/auth.ts'

import { checkLoginRequest, registerRequest } from '$shared/auth/auth.ts'

import type { RegisterLoginCheckStatus } from './register-modal.types.ts'

export const registerModalOpenAtom = atom(false, 'registerModalOpenAtom')

export const registerLoginAtom = atom('', 'registerLoginAtom')

export const registerPasswordAtom = atom('', 'registerPasswordAtom')

export const registerConfirmPasswordAtom = atom(
    '',
    'registerConfirmPasswordAtom',
)

export const registerLoginCheckStatusAtom =
    atom<RegisterLoginCheckStatus | null>(null, 'registerLoginCheckStatusAtom')

export const checkRegisterLoginAction = reatomAsync(async (ctx, login: string) => {
    const trimmedLogin = login.trim().toLowerCase()

    if (!trimmedLogin) {
        registerLoginCheckStatusAtom(ctx, null)
        return
    }

    registerLoginCheckStatusAtom(ctx, null)

    await ctx.schedule(() => sleep(REGISTER_LOGIN_CHECK_DELAY))

    registerLoginCheckStatusAtom(ctx, 'isLoading')

    try {
        const { exists } = await ctx.schedule(() =>
            checkLoginRequest(trimmedLogin),
        )

        registerLoginCheckStatusAtom(ctx, exists ? 'isBusy' : 'isFree')
    } catch (error) {
        registerLoginCheckStatusAtom(ctx, null)
        console.error(error)
    }
}, 'checkRegisterLogin').pipe(withConcurrency())

export const registerAsync = reatomAsync((ctx) => {
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
