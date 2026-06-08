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
    deleteCompanyRequest,
    getCompanyMembersRequest,
    updateCompanyRequest,
} from '$shared/companies/companies.ts'
import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'

import { MOCK_INVITE_USERS } from './company-invite-modal/company-invite-modal.constants.ts'
import {
    inviteMemberModalOpenAtom,
    inviteMemberSearchAtom,
} from './company-invite-modal/company-invite-modal.reatom.ts'
import { getFilteredInviteUsers } from './company-invite-modal/company-invite-modal.utils.ts'
import {
    deleteMemberModalOpenAtom,
    selectedMemberForDeleteIdAtom,
} from './company-member-modal/company-member-modal.reatom.ts'
import {
    companyNameDraftAtom,
    companyNameEditingAtom,
    deleteCompanyModalOpenAtom,
    settingsModalOpenAtom,
} from './company-settings-modal/company-settings-modal.reatom.ts'
import type { CompanyMembersData, InviteSearchData } from './company.types.ts'

const searchInviteUsers = async (query: string) => {
    await new Promise((resolve) => setTimeout(resolve, 650))

    return getFilteredInviteUsers(MOCK_INVITE_USERS, query)
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

export const inviteUsersResource = reatomResource<InviteSearchData>(
    async (ctx) => {
        const isOpen = ctx.spy(inviteMemberModalOpenAtom)
        const query = ctx.spy(inviteMemberSearchAtom).trim()

        if (!isOpen || !query) {
            return {
                query,
                users: [],
            }
        }

        const users = await searchInviteUsers(query)

        return {
            query,
            users,
        }
    },
    'inviteUsersResource',
).pipe(
    withDataAtom({
        query: '',
        users: [],
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

        if (!user) {
            companyNameEditingAtom(ctx, false)
            return updatedCompany
        }

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
