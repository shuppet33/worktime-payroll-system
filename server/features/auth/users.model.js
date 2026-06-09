import { connectDB } from '../../db/connect-db.js'

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

    async getByEmail(email) {
        const { rows } = await connectDB.query(
            `
                SELECT *
                FROM users
                WHERE email = $1
            `,
            [email],
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

    async create({
        id,
        login,
        passwordHash,
        email,
        verificationCode,
        verificationExpiresAt,
    }) {
        const { rows } = await connectDB.query(
            `
                INSERT INTO users (
                    id,
                    login,
                    password_hash,
                    email,
                    email_verification_code_hash,
                    email_verification_expires_at
                )
                VALUES (
                           $1,
                           $2,
                           $3,
                           $4,
                           $5,
                           $6
                       )
                RETURNING *
            `,
            [
                id,
                login,
                passwordHash,
                email,
                verificationCode,
                verificationExpiresAt,
            ],
        )

        return rows[0]
    },

    async verifyUser(userId) {
        await connectDB.query(
            `
                UPDATE users
                SET
                    email_verified_at = NOW(),
                    email_verification_code_hash = NULL,
                    email_verification_expires_at = NULL
                WHERE id = $1
            `,
            [userId],
        )
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
