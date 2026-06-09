import { connectDB } from '../../db/connect-db.js'

export const searchLoginModel = {
    async searchByLogin(login) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    id,
                    login,
                    email
                FROM users
                WHERE login ILIKE $1
                LIMIT 10
            `,
            [`%${login}%`],
        )

        console.log('FOUND USERS:', rows)

        return rows
    },
}
