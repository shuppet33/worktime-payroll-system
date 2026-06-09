import {
    reatomAsync,
    reatomResource, sleep,
    withCache, withConcurrency,
    withDataAtom,
    withErrorAtom,
    withStatusesAtom,
} from '@reatom/framework'

import { tokenAtom, userAtom } from '$entities/auth.ts'
import { companyMembersAtom } from '$entities/company.ts'

import {
    createCompanyInvitationRequest,
    deleteCompanyMembersRequest,
    deleteCompanyRequest,
    getCompanyAccessUsersRequest,
    getCompanyMembersRequest,
    revokeCompanyInvitationRequest,
    searchCompanyInviteUsersRequest,
    updateCompanyRequest,
} from '$shared/companies/companies.ts'
import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'

import {
    inviteMemberModalOpenAtom,
    inviteMemberSearchAtom,
    selectedInviteUserIdAtom,
    selectedInviteUserRoleAtom,
} from './company-invite-modal/company-invite-modal.reatom.ts'
import type { InviteUser } from './company-invite-modal/company-invite-modal.types.ts'
import {
    closeDeleteMemberModalAction,
    deleteMemberModalOpenAtom,
    selectedMemberForDeleteIdAtom,
} from './company-member-modal/company-member-modal.reatom.ts'
import {
    companyNameDraftAtom,
    companyNameEditingAtom,
    deleteCompanyModalOpenAtom,
    settingsModalOpenAtom,
} from './company-settings-modal/company-settings-modal.reatom.ts'
import type {
    CompanyAccessUsersData,
    CompanyMembersData,
    InviteSearchData,
} from './company.types.ts'

const INVITE_USER_COLORS = [
    '#1677ff',
    '#52c41a',
    '#fa8c16',
    '#722ed1',
    '#13c2c2',
    '#eb2f96',
]

const getInviteUserColor = (id: string) => {
    const colorIndex = id
        .split('')
        .reduce((sum, char) => sum + char.charCodeAt(0), 0)

    return INVITE_USER_COLORS[colorIndex % INVITE_USER_COLORS.length]
}

const mapInviteUser = (user: {
    id: string
    invitationId?: string
    login: string
    status: InviteUser['status']
}): InviteUser => {
    return {
        color: getInviteUserColor(user.id),
        email: '',
        id: user.id,
        invitationId: user.invitationId,
        login: user.login,
        name: user.login,
        status: user.status,
    }
}

export const membersResource = reatomResource<CompanyMembersData>(
    async (ctx) => {
        const companyId = ctx.spy(selectedCompanyIdAtom as never) as
            | string
            | null
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

        companyMembersAtom(ctx, members)

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
        const companyId = ctx.spy(selectedCompanyIdAtom as never) as
            | string
            | null
        const token = ctx.spy(tokenAtom)

        if (!isOpen || !query || !companyId) {
            return {
                query,
                users: [],
            }
        }

        if (!token) {
            throw new Error('Не авторизован')
        }

        await ctx.schedule(() => sleep(250))

        const users = await searchCompanyInviteUsersRequest(
            token,
            companyId,
            query,
        )

        return {
            query,
            users: users.map(mapInviteUser),
        }
    },
    'inviteUsersResource',
).pipe(
    withConcurrency(),
    withDataAtom({
        query: '',
        users: [],
    }),
    withStatusesAtom(),
    withErrorAtom(),
)

export const companyAccessUsersResource =
    reatomResource<CompanyAccessUsersData>(
        async (ctx) => {
            const isOpen = ctx.spy(settingsModalOpenAtom)
            const companyId = ctx.spy(selectedCompanyIdAtom as never) as
                | string
                | null
            const token = ctx.spy(tokenAtom)

            if (!isOpen || !companyId) {
                return {
                    companyId: null,
                    users: [],
                }
            }

            if (!token) {
                throw new Error('РќРµ Р°РІС‚РѕСЂРёР·РѕРІР°РЅ')
            }

            const users = await getCompanyAccessUsersRequest(token, companyId)

            return {
                companyId,
                users,
            }
        },
        'companyAccessUsersResource',
    ).pipe(
        withDataAtom({
            companyId: null,
            users: [],
        }),
        withStatusesAtom(),
        withErrorAtom(),
    )

export const createInviteAsync = reatomAsync((ctx, companyId: string) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)
        const userId = ctx.get(selectedInviteUserIdAtom)
        const inviteUsersData = ctx.get(inviteUsersResource.dataAtom)
        const userRole = ctx.get(selectedInviteUserRoleAtom)

        if (!token) {
            throw new Error('РћС€РёР±РєР° Р°РІС‚РѕСЂРёР·Р°С†РёРё')
        }

        if (!userId) {
            throw new Error('Р’С‹Р±РµСЂРёС‚Рµ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ')
        }

        const invitation = await createCompanyInvitationRequest(
            token,
            companyId,
            {
                role: userRole,
                userId,
            },
        )

        inviteUsersResource.dataAtom(ctx, {
            ...inviteUsersData,
            users: inviteUsersData.users.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          invitationId: invitation.id,
                          status: 'INVITED',
                      }
                    : user,
            ),
        })

        const accessUsers = await getCompanyAccessUsersRequest(token, companyId)

        companyAccessUsersResource.dataAtom(ctx, {
            companyId,
            users: accessUsers,
        })

        selectedInviteUserIdAtom(ctx, null)

        return invitation
    })
}).pipe(withStatusesAtom(), withErrorAtom())

export const revokeInviteAsync = reatomAsync(
    (ctx, payload: { companyId: string; invitationId: string; userId: string }) => {
        return ctx.schedule(async () => {
            const token = ctx.get(tokenAtom)
            const inviteUsersData = ctx.get(inviteUsersResource.dataAtom)

            if (!token) {
                throw new Error('РћС€РёР±РєР° Р°РІС‚РѕСЂРёР·Р°С†РёРё')
            }

            const result = await revokeCompanyInvitationRequest(
                token,
                payload.companyId,
                payload.invitationId,
            )

            inviteUsersResource.dataAtom(ctx, {
                ...inviteUsersData,
                users: inviteUsersData.users.map((user) =>
                    user.id === payload.userId
                        ? {
                              ...user,
                              invitationId: undefined,
                              status: 'CAN_INVITE',
                          }
                    : user,
                ),
            })

            const accessUsers = await getCompanyAccessUsersRequest(
                token,
                payload.companyId,
            )

            companyAccessUsersResource.dataAtom(ctx, {
                companyId: payload.companyId,
                users: accessUsers,
            })

            return result
        })
    },
).pipe(withStatusesAtom(), withErrorAtom())

export const deleteInviteMemberAsync = reatomAsync(
    (ctx, payload: { companyId: string; userId: string }) => {
        return ctx.schedule(async () => {
            const token = ctx.get(tokenAtom)
            const inviteUsersData = ctx.get(inviteUsersResource.dataAtom)

            if (!token) {
                throw new Error('РћС€РёР±РєР° Р°РІС‚РѕСЂРёР·Р°С†РёРё')
            }

            const result = await deleteCompanyMembersRequest(
                token,
                payload.userId,
                payload.companyId,
            )
            const members = await getCompanyMembersRequest(
                token,
                payload.companyId,
            )

            companyMembersAtom(ctx, members)
            membersResource.dataAtom(ctx, {
                companyId: payload.companyId,
                members,
            })

            const accessUsers = await getCompanyAccessUsersRequest(
                token,
                payload.companyId,
            )

            companyAccessUsersResource.dataAtom(ctx, {
                companyId: payload.companyId,
                users: accessUsers,
            })

            inviteUsersResource.dataAtom(ctx, {
                ...inviteUsersData,
                users: inviteUsersData.users.map((user) =>
                    user.id === payload.userId
                        ? {
                              ...user,
                              status: 'CAN_INVITE',
                          }
                        : user,
                ),
            })

            return result
        })
    },
).pipe(withStatusesAtom(), withErrorAtom())

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

export const deleteMemberAsync = reatomAsync((ctx, companyId: string) => {
    return ctx.schedule(async () => {
        const token = ctx.get(tokenAtom)
        const memberId = ctx.get(selectedMemberForDeleteIdAtom)

        if (!token) {
            throw new Error('Ошибка авторизации')
        }

        if (!memberId) {
            throw new Error('Сотрудник не выбран')
        }

        const result = await deleteCompanyMembersRequest(
            token,
            memberId,
            companyId,
        )

        const members = await getCompanyMembersRequest(token, companyId)
        const accessUsers = await getCompanyAccessUsersRequest(token, companyId)

        companyMembersAtom(ctx, members)

        membersResource.dataAtom(ctx, {
            companyId,
            members,
        })

        companyAccessUsersResource.dataAtom(ctx, {
            companyId,
            users: accessUsers,
        })

        closeDeleteMemberModalAction(ctx)

        return result
    })
}).pipe(withStatusesAtom(), withErrorAtom())
