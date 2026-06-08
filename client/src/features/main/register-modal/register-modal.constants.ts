import type { RegisterLoginCheckStatus } from './register-modal.types.ts'

export const REGISTER_LOGIN_CHECK_DELAY = 250

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
