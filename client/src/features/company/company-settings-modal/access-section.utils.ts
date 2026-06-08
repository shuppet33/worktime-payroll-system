import type { InvitedUser } from './access-section.types.ts'

export const getFilteredInvitedUsers = (
    invitedUsers: InvitedUser[],
    search: string,
) => {
    const query = search.trim().toLowerCase()

    if (!query) {
        return invitedUsers
    }

    return invitedUsers.filter((user) => {
        const target = `${user.name} ${user.login} ${user.role}`.toLowerCase()

        return target.includes(query)
    })
}
