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
}
