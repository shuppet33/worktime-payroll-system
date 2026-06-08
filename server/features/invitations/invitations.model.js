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
        const client = await connectDB.connect()

        try {
            await client.query('BEGIN')

            const { rows: invitationRows } = await client.query(
                `
                    SELECT
                        i.id,
                        i.company_id AS "companyId",
                        c.name AS "companyName",
                        i.role,
                        i.status,
                        i.expires_at AS "expiresAt"
                    FROM invitations i
                             JOIN companies c
                                  ON c.id = i.company_id
                    WHERE i.token = $1
                        FOR UPDATE OF i
                `,
                [token],
            )

            const invitation = invitationRows[0]

            if (!invitation) {
                await client.query('ROLLBACK')
                return { error: 'NOT_FOUND' }
            }

            if (invitation.status !== 'PENDING') {
                await client.query('ROLLBACK')
                return { error: invitation.status }
            }

            if (new Date(invitation.expiresAt).getTime() <= Date.now()) {
                await client.query(
                    `
                    UPDATE invitations
                    SET status = 'EXPIRED'
                    WHERE id = $1
                `,
                    [invitation.id],
                )

                await client.query('COMMIT')

                return { error: 'EXPIRED' }
            }

            const { rows: memberRows } = await client.query(
                `
                    SELECT id
                    FROM company_members
                    WHERE company_id = $1
                      AND user_id = $2
                `,
                [invitation.companyId, userId],
            )

            if (memberRows[0]) {
                await client.query('ROLLBACK')
                return { error: 'ALREADY_MEMBER' }
            }

            const { rows: createdMemberRows } = await client.query(
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
                    SET status = 'ACCEPTED'
                    WHERE id = $1
                `,
                [invitation.id],
            )

            await client.query('COMMIT')

            return {
                companyId: invitation.companyId,
                member: createdMemberRows[0],
            }
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    },

    async declineByToken(token) {
        const { rows } = await connectDB.query(
            `
            UPDATE invitations
            SET status = 'DECLINED'
            WHERE token = $1
              AND status = 'PENDING'
            RETURNING id, status
        `,
            [token],
        )

        return rows[0] || null
    },

    async revokeById(id) {
        const { rows } = await connectDB.query(
            `
            UPDATE invitations
            SET status = 'REVOKED'
            WHERE id = $1
              AND status = 'PENDING'
            RETURNING id, status
        `,
            [id],
        )

        return rows[0] || null
    },

    async getById(id) {
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
            WHERE i.id = $1
        `,
            [id],
        )

        return rows[0] || null
    },

    async canRevoke({ companyId, userId }) {
        const { rows } = await connectDB.query(
            `
            SELECT id
            FROM company_members
            WHERE company_id = $1
              AND user_id = $2
              AND role IN ('OWNER', 'ACCOUNTANT')
        `,
            [companyId, userId],
        )

        return Boolean(rows[0])
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
            LIMIT 1
        `,
            [companyId, userId],
        )

        return rows.length > 0
    }
}
