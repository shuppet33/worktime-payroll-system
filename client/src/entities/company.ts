import { atom } from '@reatom/framework'

import type { CompanyMember } from '$shared/companies/companies.types.ts'


export const companyMembersAtom = atom<CompanyMember[]>([])