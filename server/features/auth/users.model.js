import { connectDB } from '../../db/index.js'

export const userModel = {
    async getByLogin(login) {
        const { rows } = await connectDB.query(
            `
                SELECT *
                FROM users
                WHERE login = $1
            `,
            [login],
        )

        return rows[0]
    },

    async getById(id) {
        const { rows } = await connectDB.query(
            `
                SELECT *
                FROM users
                WHERE id = $1
            `,
            [id],
        )

        return rows[0]
    },

    async create({ login, passwordHash }) {
        const { rows } = await connectDB.query(
            `
                INSERT INTO users
                ( login, password_hash )
                VALUES ( $1, $2 ) RETURNING *
            `,
            [login, passwordHash],
        )

        return rows[0]
    },

    async getCompanies(userId) {
        const { rows } = await connectDB.query(
            `
            SELECT
                cm.id,
                cm.role,
                c.id AS company_id,
                c.name AS company_name
            FROM company_members cm
            JOIN companies c
                ON c.id = cm.company_id
            WHERE cm.user_id = $1
            `,
            [userId],
        )

        return rows
    },
}
