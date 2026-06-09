import { API_URL } from '$shared/api/url.ts'

import type {
    AcceptInvitationResponse,
    DeclineInvitationResponse,
    Invitation,
} from './invitation.types.ts'

export class InvitationRequestError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'InvitationRequestError'
        this.status = status
    }
}

export const getInvitation = async (token: string): Promise<Invitation> => {
    const response = await fetch(`${API_URL}/invitations/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new InvitationRequestError(
            data.message ?? 'Приглашение не найдено',
            response.status,
        )
    }

    return data
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
        throw new InvitationRequestError(
            data.message ?? 'Не удалось принять приглашение',
            response.status,
        )
    }

    return data
}

export const declineInvitation = async (
    token: string,
    jwt: string,
): Promise<DeclineInvitationResponse> => {
    const response = await fetch(`${API_URL}/invitations/${token}/decline`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new InvitationRequestError(
            data.message ?? 'Не удалось отклонить приглашение',
            response.status,
        )
    }

    return data
}
