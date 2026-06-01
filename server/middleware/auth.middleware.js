import { verifyToken } from '../shared/utils/jwt.js'

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            message: 'Не авторизован',
        })
    }

    const token = authHeader.replace('Bearer ', '')

    try {
        req.user = verifyToken(token)

        next()
    } catch {
        return res.status(401).json({
            message: 'Не авторизован',
        })
    }
}
