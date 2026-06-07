import { connectDB } from '../../db/connect-db.js'
import { nanoid } from 'nanoid'

export const companyModel = {
    async createWithOwner({ companyId, name, ownerId }) {
        try {
            const { rows } = await connectDB.query(
                `
                    INSERT INTO companies
                    ( id, name )
                    VALUES ( $1, $2 ) RETURNING *
                `,
                [companyId, name],
            )

            const recordId = nanoid(8)

            await connectDB.query(
                `
                    INSERT INTO company_members
                    ( id, company_id, user_id, role )
                    VALUES ( $1, $2, $3, $4 )
                `,
                [recordId, companyId, ownerId, 'OWNER'],
            )

            return rows[0]
        } catch (error) {
            throw error
        }
    },

    async getUserCompanies(userId) {
        const { rows } = await connectDB.query(
            `
            SELECT 
                c.id as "companyId",
                c.name,
                cm.role
            FROM company_members cm
            JOIN companies c ON c.id = cm.company_id
            WHERE cm.user_id = $1
            ORDER BY c.name ASC
            `,
            [userId],
        )

        return rows
    },

    async getCompanyById({ companyId, userId }) {
        const { rows } = await connectDB.query(
            `
        SELECT 
            c.id as "companyId",
            c.name,
            cm.role
        FROM company_members cm
        JOIN companies c ON c.id = cm.company_id
        WHERE cm.user_id = $1 AND c.id = $2
        `,
            [userId, companyId],
        )

        return rows[0] || null
    },

    async updateCompanyName({ companyId, name }) {
        const { rows } = await connectDB.query(
            `
                UPDATE companies
                SET name = $1
                WHERE id = $2
                RETURNING id as "companyId", name
            `,
            [name, companyId],
        )

        return rows[0] || null
    },

    async deleteCompany({ companyId, userId }) {
        const { rows: memberRows } = await connectDB.query(
            `
        SELECT role
        FROM company_members
        WHERE company_id = $1 AND user_id = $2
        `,
            [companyId, userId],
        )

        const member = memberRows[0]

        if (!member) {
            return null
        }

        if (member.role !== 'OWNER') {
            throw new Error('FORBIDDEN')
        }

        await connectDB.query(
            `
        DELETE FROM company_members
        WHERE company_id = $1
        `,
            [companyId],
        )

        const { rows } = await connectDB.query(
            `
        DELETE FROM companies
        WHERE id = $1
        RETURNING id as "companyId"
        `,
            [companyId],
        )

        return rows[0] || null
    },

    async getCompanyMembers({ companyId, userId }) {
        const access = await this.getCompanyById({
            companyId,
            userId,
        })

        if (!access) {
            return null
        }

        const { rows } = await connectDB.query(
            `
                SELECT
                    u.id,
                    u.login,
                    cm.role
                FROM company_members cm
                JOIN users u ON u.id = cm.user_id
                WHERE cm.company_id = $1
                ORDER BY
                    CASE
                        WHEN cm.role = 'OWNER' THEN 1
                        ELSE 2
                    END,
                    u.login
            `,
            [companyId],
        )

        return rows
    },

    async updateMemberRole({ companyId, memberId, role }) {
        const { rows } = await connectDB.query(
            `
                UPDATE company_members
                SET role = $1
                WHERE company_id = $2
                  AND user_id = $3
                RETURNING
                    user_id as "id",
                    role
            `,
            [role, companyId, memberId],
        )

        return rows[0] || null
    },
}
