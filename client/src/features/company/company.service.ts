import {
    reatomAsync,
    reatomResource,
    withCache,
    withDataAtom,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { tokenAtom, userAtom } from '$entities/auth.ts'

import {
    type CompanyMember,
    deleteCompanyRequest,
    getCompanyMembersRequest,
    updateCompanyRequest,
} from '$shared/companies/companies.ts'
import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'

import {
    companyNameDraftAtom,
    companyNameEditingAtom,
    deleteCompanyModalOpenAtom,
    deleteMemberModalOpenAtom,
    selectedMemberForDeleteIdAtom,
    settingsModalOpenAtom,
} from './company-modals/company-modals.reatom.ts'

type CompanyMembersData = {
    companyId: string | null
    members: CompanyMember[]
}

export const membersResource = reatomResource<CompanyMembersData>(
    async (ctx) => {
        const companyId = ctx.spy(selectedCompanyIdAtom)
        const token = ctx.spy(tokenAtom)

        if (!companyId) {
            return {
                companyId: null,
                members: [],
            }
        }

        if (!token) {
            throw new Error('Ошибка авторизации')
        }

        const members = await getCompanyMembersRequest(token, companyId)

        return {
            companyId,
            members,
        }
    },
    'membersResource',
).pipe(
    withCache({
        staleTime: 30_000,
    }),
    withDataAtom({
        companyId: null,
        members: [],
    }),
    withStatusesAtom(),
    withErrorAtom(),
)

export const updateNameAsync = reatomAsync((ctx, companyId: string) => {
    return ctx.schedule(async () => {
        const name = ctx.get(companyNameDraftAtom).trim()
        const token = ctx.get(tokenAtom)
        const user = ctx.get(userAtom)

        if (!name) {
            throw new Error('Введите название компании')
        }

        if (!token) {
            throw new Error('Ошибка авторизации')
        }

        const updatedCompany = await updateCompanyRequest(token, companyId, {
            name,
        })

        if (user) {
            userAtom(ctx, {
                ...user,
                companies: (user.companies ?? []).map((company) =>
                    company.company_id === updatedCompany.companyId
                        ? {
                              ...company,
                              company_name: updatedCompany.name,
                          }
                        : company,
                ),
            })
        }

        companyNameEditingAtom(ctx, false)

        return updatedCompany
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const deleteAsync = reatomAsync((ctx, companyId: string) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)
        const user = ctx.get(userAtom)

        if (!token) {
            throw new Error('Ошибка авторизации')
        }

        const result = await deleteCompanyRequest(token, companyId)

        if (user) {
            userAtom(ctx, {
                ...user,
                companies: (user.companies ?? []).filter(
                    (company) => company.company_id !== result.companyId,
                ),
            })
        }

        selectedMemberForDeleteIdAtom(ctx, null)
        deleteMemberModalOpenAtom(ctx, false)
        deleteCompanyModalOpenAtom(ctx, false)
        settingsModalOpenAtom(ctx, false)

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())
