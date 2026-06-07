import { action, atom } from '@reatom/framework'

export const selectedMemberIdAtom = atom<string | null>(
    null,
    'selectedMemberIdAtom',
)

export const memberModalOpenAtom = atom(false, 'memberModalOpenAtom')

export const selectedMemberForDeleteIdAtom = atom<string | null>(
    null,
    'selectedMemberForDeleteIdAtom',
)

export const deleteMemberModalOpenAtom = atom(
    false,
    'deleteMemberModalOpenAtom',
)

export const deleteCompanyModalOpenAtom = atom(
    false,
    'deleteCompanyModalOpenAtom',
)

export const settingsModalOpenAtom = atom(false, 'settingsModalOpenAtom')

export const companyNameDraftAtom = atom('', 'companyNameDraftAtom')

export const companyNameEditingAtom = atom(false, 'companyNameEditingAtom')

export const selectMemberAction = action((ctx, memberId: string) => {
    selectedMemberIdAtom(ctx, memberId)
    memberModalOpenAtom(ctx, true)
}, 'selectMemberAction')

export const openDeleteMemberModalAction = action((ctx, memberId: string) => {
    selectedMemberForDeleteIdAtom(ctx, memberId)
    deleteMemberModalOpenAtom(ctx, true)
}, 'openDeleteMemberModalAction')

export const closeDeleteMemberModalAction = action((ctx) => {
    selectedMemberForDeleteIdAtom(ctx, null)
    deleteMemberModalOpenAtom(ctx, false)
}, 'closeDeleteMemberModalAction')

export const openSettingsModalAction = action((ctx, companyName: string) => {
    companyNameDraftAtom(ctx, companyName)
    companyNameEditingAtom(ctx, false)
    settingsModalOpenAtom(ctx, true)
}, 'openSettingsModalAction')

export const closeSettingsModalAction = action((ctx) => {
    companyNameEditingAtom(ctx, false)
    settingsModalOpenAtom(ctx, false)
}, 'closeSettingsModalAction')
