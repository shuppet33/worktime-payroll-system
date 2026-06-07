import { atom } from '@reatom/framework'
import { withSessionStorage } from '@reatom/persist-web-storage'

export type AppTheme = 'light' | 'dark'

export const appThemeAtom = atom<AppTheme>('light', 'appThemeAtom').pipe(
    withSessionStorage('appTheme'),
)
