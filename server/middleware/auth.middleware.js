import { verifyToken } from '../shared/utils/jwt.js'

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                message: 'Не авторизован',
            })
        }

        const token = authHeader.split(' ')[1]

        req.user = verifyToken(token)

        next()
    } catch {
        return res.status(401).json({
            message: 'Невалидный токен',
        })
    }
}
