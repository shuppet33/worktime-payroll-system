import type {
    RegisterEmailCodeCheckStatus,
    RegisterLoginCheckStatus,
} from './register-modal.types.ts'

export const REGISTER_LOGIN_CHECK_DELAY = 250
export const REGISTER_EMAIL_CODE_LENGTH = 8

export const REGISTER_LOGIN_CHECK_COLORS: Partial<
    Record<RegisterLoginCheckStatus, string>
> = {
    isBusy: '#cf1322',
    isFree: '#389e0d',
}

export const REGISTER_LOGIN_CHECK_MESSAGES: Record<
    RegisterLoginCheckStatus,
    string
> = {
    isBusy: 'Такой логин уже занят',
    isFree: 'Такой логин свободен',
    isLoading: 'Проверяем логин...',
}

export const REGISTER_EMAIL_CODE_CHECK_COLORS: Partial<
    Record<RegisterEmailCodeCheckStatus, string>
> = {
    isInvalid: '#cf1322',
    isValid: '#389e0d',
}

export const REGISTER_EMAIL_CODE_CHECK_MESSAGES: Record<
    RegisterEmailCodeCheckStatus,
    string
> = {
    isInvalid: 'Неверный код из email',
    isLoading: 'Проверяем код...',
    isValid: 'Email подтвержден',
}
