import { userModel } from './users.model.js'
import { comparePassword, hashPassword } from '../../shared/utils/password.js'
import { generateToken } from '../../shared/utils/jwt.js'
import { nanoid } from 'nanoid'

export const authController = {
    async register(req, res) {
        try {
            const { login, password, email } = req.body

            if (!login || !password) {
                return res.status(400).json({
                    message: 'Логин и пароль обязательны',
                })
            }

            const normalizedLogin = login.trim()
            const normalizedEmail =
                typeof email === 'string' && email.trim() ? email.trim() : null

            const existingUser = await userModel.getByLogin(normalizedLogin)

            if (existingUser) {
                return res.status(409).json({
                    message: 'Пользователь уже существует',
                })
            }

            const passwordHash = await hashPassword(password)

            const userId = nanoid(8)

            const user = await userModel.create({
                id: userId,
                login: normalizedLogin,
                passwordHash,
                email: normalizedEmail,
            })

            const token = generateToken({
                id: user.id,
            })

            return res.status(201).json({
                token,
                user: {
                    id: user.id,
                    login: user.login,
                    email: user.email,
                },
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка регистрации',
            })
        }
    },

    async login(req, res) {
        try {
            const { login, password } = req.body

            if (!login || !password) {
                return res.status(400).json({
                    message: 'Логин и пароль обязательны',
                })
            }

            const user = await userModel.getByLogin(login)

            if (!user) {
                return res.status(401).json({
                    message: 'Неверный логин или пароль',
                })
            }

            const isValidPassword = await comparePassword(
                password,
                user.password_hash,
            )

            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Неверный логин или пароль',
                })
            }

            const companies = await userModel.getCompanies(user.id)

            const token = generateToken({
                id: user.id,
            })

            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    login: user.login,
                },
                companies,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка авторизации',
            })
        }
    },

    async logout(req, res) {
        return res.status(200).json({
            message: 'Выход выполнен',
        })
    },

    async me(req, res) {
        try {
            const user = await userModel.getById(req.user.id)

            if (!user) {
                return res.status(404).json({
                    message: 'Пользователь не найден',
                })
            }

            const companies = await userModel.getCompanies(user.id)

            return res.status(200).json({
                id: user.id,
                login: user.login,
                companies,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка получения пользователя',
            })
        }
    },

    async checkLogin(req, res) {
        try {
            const { q } = req.query

            if (!q) {
                return res.status(400).json({
                    message: 'q обязателен',
                })
            }


            const login = q.toLowerCase()

            const user = await userModel.getByLogin(login)

            return res.status(200).json({
                exists: !!user,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка проверки логина',
            })
        }
    },
}
