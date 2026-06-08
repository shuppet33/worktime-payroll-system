import { action, atom } from '@reatom/framework'

export const deleteCompanyModalOpenAtom = atom(
    false,
    'deleteCompanyModalOpenAtom',
)

export const settingsModalOpenAtom = atom(false, 'settingsModalOpenAtom')

export const companyNameDraftAtom = atom('', 'companyNameDraftAtom')

export const companyNameEditingAtom = atom(false, 'companyNameEditingAtom')

export const openSettingsModalAction = action((ctx, companyName: string) => {
    companyNameDraftAtom(ctx, companyName)
    companyNameEditingAtom(ctx, false)
    settingsModalOpenAtom(ctx, true)
}, 'openSettingsModalAction')

export const closeSettingsModalAction = action((ctx) => {
    companyNameEditingAtom(ctx, false)
    settingsModalOpenAtom(ctx, false)
}, 'closeSettingsModalAction')
