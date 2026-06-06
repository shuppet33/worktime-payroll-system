import { atom } from '@reatom/framework'
import { withSessionStorage } from '@reatom/persist-web-storage'

export const selectedCompanyIdAtom = atom<string | null>(
    null,
    'selectedCompanyIdAtom',
).pipe(withSessionStorage('selectedCompanyId'))
