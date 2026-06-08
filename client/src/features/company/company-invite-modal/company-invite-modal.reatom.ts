import { action, atom } from '@reatom/framework'

export const inviteMemberModalOpenAtom = atom(
    false,
    'inviteMemberModalOpenAtom',
)

export const inviteMemberSearchAtom = atom('', 'inviteMemberSearchAtom')

export const selectedInviteUserIdAtom = atom<string | null>(
    null,
    'selectedInviteUserIdAtom',
)

export const openInviteMemberModalAction = action((ctx) => {
    inviteMemberSearchAtom(ctx, '')
    selectedInviteUserIdAtom(ctx, null)
    inviteMemberModalOpenAtom(ctx, true)
}, 'openInviteMemberModalAction')

export const closeInviteMemberModalAction = action((ctx) => {
    inviteMemberSearchAtom(ctx, '')
    selectedInviteUserIdAtom(ctx, null)
    inviteMemberModalOpenAtom(ctx, false)
}, 'closeInviteMemberModalAction')
