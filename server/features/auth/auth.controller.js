import { userModel } from './users.model.js'
import { comparePassword, hashPassword } from '../../shared/utils/password.js'
import { generateToken } from '../../shared/utils/jwt.js'
import { mailSender } from '../mailer/mailSender.controller.js'
import { nanoid } from 'nanoid'

export const authController = {
    async register(req, res) {
        try {
            const { login, password, email } = req.body

            if (!login || !password || !email) {
                return res.status(400).json({
                    message: 'Логин, пароль и почта обязательны',
                })
            }

            const normalizedLogin = login.trim().toLowerCase()
            const normalizedEmail = email.trim().toLowerCase()

            const existingUser = await userModel.getByLogin(normalizedLogin)

            if (existingUser) {
                return res.status(409).json({
                    message: 'Пользователь уже существует',
                })
            }

            const passwordHash = await hashPassword(password)

            const userId = nanoid(8)

            // 1. verification code

            const code = Math.floor(
                10000000 + Math.random() * 90000000,
            ).toString()

            const codeHash = await hashPassword(code)

            const expiresAt = new Date(Date.now() + 1000 * 60 * 10) // 10 min

            // 2. create user
            const user = await userModel.create({
                id: userId,
                login: normalizedLogin,
                passwordHash,
                email: normalizedEmail,
                verificationCode: codeHash,
                verificationExpiresAt: expiresAt,
            })

            // 3. send email
            await mailSender.sendVerificationCode(
                normalizedEmail,
                code
            )

            return res.status(201).json({
                message: 'Письмо отправлено на почту',
                userId: user.id,
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

            if (q !== q.toLowerCase()) {
                return res.status(400).json({
                    message: 'Логин должен быть в нижнем регистре.',
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


