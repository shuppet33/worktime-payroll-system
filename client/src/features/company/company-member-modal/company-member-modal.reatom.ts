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
