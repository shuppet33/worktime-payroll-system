import { connectDB } from '../../db/connect-db.js'

export const invitationModel = {
    async getByToken(token) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    i.id,
                    i.token,
                    i.company_id AS "companyId",
                    c.name AS "companyName",
                    i.role,
                    i.status,
                    i.expires_at AS "expiresAt"
                FROM invitations i
                         JOIN companies c
                              ON c.id = i.company_id
                WHERE i.token = $1
            `,
            [token],
        )

        return rows[0] || null
    },

    async updateStatus(id, status) {
        const { rows } = await connectDB.query(
            `
            UPDATE invitations
            SET status = $2
            WHERE id = $1
            RETURNING *
        `,
            [id, status],
        )

        return rows[0] || null
    },

    async acceptByToken({ companyMemberId, token, userId }) {
        try {
            const { rows: invitationRows } = await connectDB.query(
                `
                    SELECT
                        i.id,
                        i.company_id as "companyId",
                        c.name as "companyName",
                        i.role,
                        i.expires_at as "expiresAt",
                        i.is_used as "isUsed"
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

            if (invitation.isUsed) {
                return { error: 'USED' }
            }

            if (new Date(invitation.expiresAt).getTime() <= Date.now()) {
                return { error: 'EXPIRED' }
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
                [companyMemberId, invitation.companyId, userId, invitation.role],
            )

            await connectDB.query(
                `
                    UPDATE invitations
                    SET is_used = true
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
}
