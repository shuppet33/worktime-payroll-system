export const roleMiddleware =
    (...allowedRoles) =>
    (req, res, next) => {
        try {
            const { user } = req

            if (!user) {
                return res.status(401).json({
                    message: 'Не авторизован',
                })
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: 'Недостаточно прав',
                })
            }

            next()
        } catch (error) {
            return res.status(500).json({
                message: 'Ошибка проверки прав',
            })
        }
    }
