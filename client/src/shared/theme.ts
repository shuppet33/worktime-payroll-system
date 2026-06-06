import { atom } from '@reatom/framework'

export type AppTheme = 'light' | 'dark'

export const appThemeAtom = atom<AppTheme>('light', 'appThemeAtom')
