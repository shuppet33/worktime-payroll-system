import { connectDB } from '../../db/connect-db.js'

export const invitationModel = {
    async getByToken(token) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    i.id,
                    i.token,
                    i.company_id as "companyId",
                    i.user_id as "userId",
                    c.name as "companyName",
                    i.role,
                    i.status,
                    i.expires_at as "expiresAt"
                FROM invitations i
                JOIN companies c ON c.id = i.company_id
                WHERE i.token = $1
            `,
            [token],
        )

        const invitation = rows[0]

        if (!invitation) {
            return null
        }

        if (
            invitation.status === 'PENDING' &&
            new Date(invitation.expiresAt).getTime() <= Date.now()
        ) {
            await connectDB.query(
                `
                    UPDATE invitations
                    SET status = 'EXPIRED'
                    WHERE id = $1
                      AND status = 'PENDING'
                `,
                [invitation.id],
            )

            return {
                ...invitation,
                status: 'EXPIRED',
            }
        }

        return invitation
    },

    async acceptByToken({ companyMemberId, token, userId }) {
        try {
            const { rows: invitationRows } = await connectDB.query(
                `
                    SELECT
                        i.id,
                        i.company_id as "companyId",
                        i.user_id as "userId",
                        c.name as "companyName",
                        i.role,
                        i.status,
                        i.expires_at as "expiresAt"
                    FROM invitations i
                    JOIN companies c ON c.id = i.company_id
                    WHERE i.token = $1
                    FOR UPDATE OF i
                `,
                [token],
            )

            const invitation = invitationRows[0]

            if (!invitation) {
                return { error: 'NOT_FOUND' }
            }

            if (invitation.status !== 'PENDING') {
                return { error: invitation.status }
            }

            if (new Date(invitation.expiresAt).getTime() <= Date.now()) {
                await connectDB.query(
                    `
                    UPDATE invitations
                    SET status = 'EXPIRED'
                    WHERE id = $1
                      AND status = 'PENDING'
                    `,
                    [invitation.id],
                )

                return { error: 'EXPIRED' }
            }

            if (invitation.userId && invitation.userId !== userId) {
                return { error: 'FORBIDDEN_USER' }
            }

            const { rows: memberRows } = await connectDB.query(
                `
                    SELECT id
                    FROM company_members
                    WHERE company_id = $1
                      AND user_id = $2
                `,
                [invitation.companyId, userId],
            )

            if (memberRows[0]) {
                return { error: 'ALREADY_MEMBER' }
            }

            const { rows: createdMemberRows } = await connectDB.query(
                `
                    INSERT INTO company_members
                    ( id, company_id, user_id, role )
                    VALUES ( $1, $2, $3, $4 )
                    RETURNING id, role
                `,
                [
                    companyMemberId,
                    invitation.companyId,
                    userId,
                    invitation.role,
                ],
            )

            await connectDB.query(
                `
                    UPDATE invitations
                    SET
                        status = 'ACCEPTED',
                        is_used = true
                    WHERE id = $1
                `,
                [invitation.id],
            )

            return {
                company: {
                    id: invitation.companyId,
                    name: invitation.companyName,
                },
                member: createdMemberRows[0],
            }
        } catch (error) {
            throw error
        }
    },

    async hasActiveInvite(companyId, userId) {
        const { rows } = await connectDB.query(
            `
        SELECT 1
        FROM invitations
        WHERE company_id = $1
          AND user_id = $2
          AND status = 'PENDING'
          AND expires_at > NOW()
        `,
            [companyId, userId],
        )

        return rows.length > 0
    },

    async declineByToken({ token }) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    id,
                    status,
                    expires_at as "expiresAt"
                FROM invitations
                WHERE token = $1
                FOR UPDATE
            `,
            [token],
        )

        const invitation = rows[0]

        if (!invitation) {
            throw new Error('Приглашение не найдено')
        }

        if (invitation.status !== 'PENDING') {
            return { error: invitation.status }
        }

        if (new Date(invitation.expiresAt).getTime() <= Date.now()) {
            await connectDB.query(
                `
                    UPDATE invitations
                    SET status = 'EXPIRED'
                    WHERE id = $1
                      AND status = 'PENDING'
                `,
                [invitation.id],
            )

            return { error: 'EXPIRED' }
        }

        const { rows: updatedRows } = await connectDB.query(
            `
                UPDATE invitations
                SET status = 'DECLINED'
                WHERE id = $1
                RETURNING
                    id,
                    company_id as "companyId",
                    user_id as "userId",
                    role,
                    status,
                    expires_at as "expiresAt"
            `,
            [invitation.id],
        )

        return {
            invitation: updatedRows[0],
        }
    },
}
