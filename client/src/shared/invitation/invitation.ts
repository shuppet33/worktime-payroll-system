import { API_URL } from '$shared/api/url.ts'

import type {
    AcceptInvitationResponse,
    Invitation,
} from './invitation.types.ts'

export const getInvitation = async (token: string): Promise<Invitation> => {
    const response = await fetch(`${API_URL}/invitations/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Приглашение не найдено')
    }

    return response.json()
}

export const acceptInvitation = async (
    token: string,
    jwt: string,
): Promise<AcceptInvitationResponse> => {
    const response = await fetch(`${API_URL}/invitations/${token}/accept`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message ?? 'Не удалось принять приглашение')
    }

    return data
}
