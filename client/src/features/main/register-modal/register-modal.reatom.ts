import {
    atom,
    reatomAsync,
    sleep,
    withConcurrency,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import {
    REGISTER_EMAIL_CODE_LENGTH,
    REGISTER_LOGIN_CHECK_DELAY,
} from '$features/main/register-modal/register-modal.constants.ts'

import { tokenAtom, userAtom } from '$entities/auth.ts'

import {
    checkLoginRequest,
    registerRequest,
    verifyEmailCodeRequest,
} from '$shared/auth/auth.ts'

import type {
    RegisterEmailCodeCheckStatus,
    RegisterLoginCheckStatus,
} from './register-modal.types.ts'

export const registerModalOpenAtom = atom(false, 'registerModalOpenAtom')

export const registerLoginAtom = atom('', 'registerLoginAtom')

export const registerEmailAtom = atom('', 'registerEmailAtom')

export const registerEmailCodeAtom = atom('', 'registerEmailCodeAtom')

export const registerPasswordAtom = atom('', 'registerPasswordAtom')

export const registerConfirmPasswordAtom = atom(
    '',
    'registerConfirmPasswordAtom',
)

export const registerLoginCheckStatusAtom =
    atom<RegisterLoginCheckStatus | null>(null, 'registerLoginCheckStatusAtom')

export const registerEmailCodeCheckStatusAtom =
    atom<RegisterEmailCodeCheckStatus | null>(
        null,
        'registerEmailCodeCheckStatusAtom',
    )

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

export const checkRegisterEmailCodeAction = reatomAsync(
    async (ctx, code: string) => {
        const email = ctx.get(registerEmailAtom).trim()
        const trimmedCode = code.trim()

        if (trimmedCode.length !== REGISTER_EMAIL_CODE_LENGTH) {
            registerEmailCodeCheckStatusAtom(ctx, null)
            return
        }

        if (!email) {
            registerEmailCodeCheckStatusAtom(ctx, 'isInvalid')
            return
        }

        registerEmailCodeCheckStatusAtom(ctx, 'isLoading')

        try {
            const { isValid } = await ctx.schedule(() =>
                verifyEmailCodeRequest({
                    code: trimmedCode,
                    email,
                }),
            )

            registerEmailCodeCheckStatusAtom(
                ctx,
                isValid ? 'isValid' : 'isInvalid',
            )
        } catch (error) {
            registerEmailCodeCheckStatusAtom(ctx, 'isInvalid')
            console.error(error)
        }
    },
    'checkRegisterEmailCode',
).pipe(withConcurrency())

export const registerAsync = reatomAsync((ctx) => {
    return ctx.schedule(async () => {
        const email = ctx.get(registerEmailAtom)
        const emailCode = ctx.get(registerEmailCodeAtom)
        const emailCodeCheckStatus = ctx.get(registerEmailCodeCheckStatusAtom)
        const login = ctx.get(registerLoginAtom)
        const password = ctx.get(registerPasswordAtom)
        const confirmPassword = ctx.get(registerConfirmPasswordAtom)

        if (!email.trim()) {
            throw new Error('Введите email')
        }

        if (emailCode.length !== REGISTER_EMAIL_CODE_LENGTH) {
            throw new Error('Введите код из email')
        }

        if (emailCodeCheckStatus !== 'isValid') {
            throw new Error('Подтвердите email кодом из письма')
        }

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
            email,
            emailCode,
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
