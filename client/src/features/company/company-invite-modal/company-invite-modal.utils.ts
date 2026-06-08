import type { InviteUser } from './company-invite-modal.types.ts'

export const getInviteUserInitials = (user: InviteUser) => {
    const source = user.name || user.login
    const parts = source.trim().split(/\s+/).filter(Boolean)

    if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }

    return source.slice(0, 2).toUpperCase()
}

export const getFilteredInviteUsers = (
    users: InviteUser[],
    query: string,
) => {
    const normalizedQuery = query.toLowerCase()

    return users.filter((user) => {
        const target = `${user.name} ${user.login} ${user.email}`.toLowerCase()

        return target.includes(normalizedQuery)
    })
}
